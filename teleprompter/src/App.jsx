import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [text, setText] = useState(`# Voice-Controlled Teleprompter

Welcome to your new prompter. This application supports **Markdown** formatting to make your scripts easier to read.

---

### Features Demo

Below is a demonstration of the supported styles:

1. **Headlines:** Use \`#\` for titles.
2. **Emphasis:** Use **bold** and *italics*.
3. **Lists:** Support for bullet points and numbers.
4. **Code:** Inline code like \`npm install\` looks great.

---

### Sample Script

* Introduction
* Main Content
* Conclusion

**Start Speaking:**

"Ladies and gentlemen, welcome to the future of presentation. Notice how the text follows my voice."

1. First point: Speak clearly.
2. Second point: Pause for effect.

---

### Technical Details

You can paste any script here. The parser handles:
- Block elements
- Inline styles
- Special characters

Good luck with your presentation!
`);
  const [isEditing, setIsEditing] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [currentIndex, setCurrentIndexState] = useState(0);
  const currentIndexRef = useRef(0);
  const [fontSize, setFontSize] = useState(20);
  const [lineHeight, setLineHeight] = useState(1.2);
  const [widthPercent, setWidthPercent] = useState(20);
  const recognitionRef = useRef(null);
  const activeWordRef = useRef(null);
  const containerRef = useRef(null);

  // Helper to update both state and ref
  const setCurrentIndex = (index) => {
    currentIndexRef.current = index;
    setCurrentIndexState(index);
  };

  // Parsing logic
  const parseText = (inputText) => {
    const finalWords = [];
    const lines = inputText.split('\n');
    
    // Inline parser helper
    const parseInline = (textStr, baseStyles) => {
        let tokens = [{ text: textStr, styles: baseStyles }];
        
        const applyStyle = (regex, styleName) => {
            const newTokens = [];
            for (const token of tokens) {
                if (token.styles.includes('code')) {
                    newTokens.push(token);
                    continue;
                }
                const splitParts = token.text.split(regex);
                for (let i = 0; i < splitParts.length; i++) {
                    const part = splitParts[i];
                    if (!part) continue;
                    if (i % 2 === 1) {
                        newTokens.push({ text: part, styles: [...token.styles, styleName] });
                    } else {
                        newTokens.push({ text: part, styles: token.styles });
                    }
                }
            }
            tokens = newTokens;
        };

        applyStyle(/`([^`]+)`/, 'code');
        applyStyle(/\*\*([^*]+)\*\*/, 'bold');
        applyStyle(/\*([^*]+)\*/, 'italic');
        
        return tokens;
    };

    for (let line of lines) {
      const originalLine = line;
      line = line.trim(); 
      
      // Empty line -> Newline block to preserve spacing
      if (!line) {
         finalWords.push({ type: 'newline', text: '', styles: [], clean: '' });
         continue;
      }
      
      let lineStyles = [];
      let prefixToken = null;
      
      // Horizontal Rule
      if (line === '---' || line === '***') {
         finalWords.push({ type: 'hr', text: '', styles: [], clean: '' });
         continue;
      }
      
      // Headlines
      const headingMatch = line.match(/^(#{1,6})\s+(.*)/);
      if (headingMatch) {
         const level = headingMatch[1].length;
         if (level <= 3) lineStyles.push(`h${level}`); // Only support h1-h3 for now
         else lineStyles.push('bold'); // Fallback
         line = headingMatch[2]; 
      }
      
      // Lists
      const ulMatch = line.match(/^[-*]\s+(.*)/);
      const olMatch = line.match(/^(\d+\.)\s+(.*)/);
      
      if (ulMatch) {
        prefixToken = { type: 'text', text: '•', styles: ['list-bullet'], clean: '' };
        line = ulMatch[1];
      } else if (olMatch) {
        prefixToken = { type: 'text', text: olMatch[1], styles: ['list-number'], clean: '' };
        line = olMatch[2];
      }
      
      // Process inline
      const inlineTokens = parseInline(line, lineStyles);
      
      // Push Prefix if exists
      if (prefixToken) finalWords.push(prefixToken);

      for (const token of inlineTokens) {
         // If it's a headline, we might want to keep the whole phrase together? 
         // But we need to split by space for speech recognition granularity.
         // However, if we split an H1 into words, each word will be display:block if we apply .md-h1 to the span.
         // That's wrong. .md-h1 should apply to the container? No, we are rendering a flat list of spans.
         // Solution: We need a wrapper? Or the words themselves are just styled text, but we need a line break before/after.
         // Actually, if I apply `display: block` to a word, it breaks the line.
         // But an H1 is multiple words.
         // So: "Header" (block?) "Text" (block?). No.
         // "Header" (inline) "Text" (inline). 
         // We need a way to say "This line is a header".
         // Since we are strictly word-based, maybe we just make them bold and large?
         // And ensure there are newlines around them.
         
         const wordsInToken = token.text.split(/\s+/);
         for (const w of wordsInToken) {
           if (w.length > 0) {
             finalWords.push({
               type: 'word',
               text: w,
               styles: [...token.styles], // Pass h1, h2 etc here
               clean: w.toLowerCase().replace(/[^\w\s]/gi, '')
             });
           }
         }
      }
      
      // Add newline at end of every processed line to simulate block behavior
      finalWords.push({ type: 'newline', text: '', styles: [], clean: '' });
    }
    
    return finalWords;
  };

  const words = parseText(text);

  useEffect(() => {
    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const results = event.results;
        // Get the latest result
        const result = results[results.length - 1];
        const transcript = result[0].transcript;
        
        // We pass the transcript to the handler, which reads from the Ref
        handleSpeechInput(transcript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        if (event.error === 'not-allowed') {
          setIsListening(false);
          alert("Microphone access denied.");
        }
      };

      recognition.onend = () => {
         // Restart if we are supposed to be listening
         if (isListening) {
           try {
             recognition.start();
           } catch (e) {
             // ignore
           }
         }
      };

      recognitionRef.current = recognition;
    } else {
      alert("Your browser does not support Speech Recognition. Please use Chrome or Safari.");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]); // Remove 'text' from deps to avoid re-init loop, rely on refs/state

  useEffect(() => {
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        // Already started
      }
    } else if (!isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  // Auto-scroll effect
  useEffect(() => {
    if (!isEditing && activeWordRef.current) {
      // scrollIntoView with block: 'start' aligns it to the top,
      // respecting the scrollMarginTop set on the element to provide context.
      activeWordRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentIndex, isEditing]);

  const handleSpeechInput = (transcript) => {
    if (!transcript) return;
    
    const spokenWords = transcript.toLowerCase().trim().split(/\s+/);
    const lastSpoken = spokenWords[spokenWords.length - 1];
    const cleanSpoken = lastSpoken.replace(/[^\w\s]/gi, '');
    
    const currentIdx = currentIndexRef.current;
    
    // Search windows
    const forwardWindow = 10; // Reduced from 15 to prevent skipping too fast
    const backwardWindow = 5; // Allow matching recent past words

    // 1. Check forward first (priority)
    for (let i = 0; i < forwardWindow; i++) {
      if (currentIdx + i >= words.length) break;
      
      const scriptWordObj = words[currentIdx + i];
      const scriptWord = scriptWordObj.clean;

      if (scriptWord && scriptWord === cleanSpoken) {
        setCurrentIndex(currentIdx + i + 1);
        return;
      }
    }

    // 2. Check backward if no forward match found
    for (let i = 1; i <= backwardWindow; i++) {
      if (currentIdx - i < 0) break;
      
      const scriptWordObj = words[currentIdx - i];
      const scriptWord = scriptWordObj.clean;

      if (scriptWord && scriptWord === cleanSpoken) {
        setCurrentIndex(currentIdx - i + 1);
        return;
      }
    }
  };

  const resetPrompter = () => {
    setCurrentIndex(0);
    setIsListening(false);
  };

  return (
    <div className="app-container">
      {/* Header / Controls */}
      <header className="controls-header">
        <div className="controls-group">
           {isEditing ? (
             <button 
               onClick={() => setIsEditing(false)}
               className="btn btn-primary"
             >
               Start Prompter
             </button>
           ) : (
             <div className="controls-group">
               <button 
                 onClick={() => {
                   setIsEditing(true);
                   setIsListening(false);
                 }}
                 className="btn btn-secondary"
               >
                 Edit Text
               </button>
               <button 
                 onClick={() => {
                    const nextState = !isListening;
                    setIsListening(nextState);
                    if (!nextState && currentIndex >= words.length) {
                        setCurrentIndex(0);
                    }
                 }}
                 className={`btn ${isListening ? 'btn-danger' : 'btn-success'}`}
               >
                 {isListening ? 'Stop' : 'Start Listening'}
               </button>
               <button 
                 onClick={resetPrompter}
                 className="btn btn-secondary"
               >
                 Reset
               </button>
             </div>
           )}
        </div>

        <div className="controls-group">
          <label className="size-control">
            <span>Text Size:</span>
            <input 
              type="range" 
              min="1" 
              max="128" 
              value={fontSize} 
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="size-slider"
            />
            <span className="size-value">{fontSize}px</span>
          </label>
          <label className="size-control">
            <span>Line Height:</span>
            <input 
              type="range" 
              min="1" 
              max="3" 
              step="0.1"
              value={lineHeight} 
              onChange={(e) => setLineHeight(Number(e.target.value))}
              className="size-slider"
            />
            <span className="size-value">{lineHeight}</span>
          </label>
          <label className="size-control">
            <span>Width:</span>
            <input 
              type="range" 
              min="1" 
              max="100" 
              value={widthPercent} 
              onChange={(e) => setWidthPercent(Number(e.target.value))}
              className="size-slider"
            />
            <span className="size-value">{widthPercent}%</span>
          </label>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {isEditing ? (
          <textarea
            className="script-editor"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your script here..."
          />
        ) : (
          <div 
            ref={containerRef}
            className="prompter-display"
            style={{ 
              fontSize: `${fontSize}px`,
              lineHeight: lineHeight,
              maxWidth: `${widthPercent}%` 
            }}
          >
            {words.map((wordObj, index) => {
              if (wordObj.type === 'newline') {
                return <div key={index} className="md-newline" />;
              }
              if (wordObj.type === 'hr') {
                return <hr key={index} className="md-hr" />;
              }

              const isPast = index < currentIndex;
              const isActive = index === currentIndex;
              
              // Build class string based on styles
              let classes = `word ${isPast ? 'past' : 'future'}`;
              if (wordObj.styles.includes('bold')) classes += ' md-bold';
              if (wordObj.styles.includes('italic')) classes += ' md-italic';
              if (wordObj.styles.includes('code')) classes += ' md-code';
              if (wordObj.styles.includes('h1')) classes += ' md-h1';
              if (wordObj.styles.includes('h2')) classes += ' md-h2';
              if (wordObj.styles.includes('h3')) classes += ' md-h3';
              if (wordObj.styles.includes('list-bullet')) classes += ' list-bullet';
              if (wordObj.styles.includes('list-number')) classes += ' list-number';
              
              const wordStyle = {};
              if (isActive) {
                 // Ensure ~2.5 lines of context above the active word
                 wordStyle.scrollMarginTop = `${lineHeight * 2.5}em`;
              }

              return (
                <span
                  key={index}
                  ref={isActive ? activeWordRef : null}
                  className={classes}
                  style={isActive ? wordStyle : undefined}
                >
                  {wordObj.text}
                </span>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
