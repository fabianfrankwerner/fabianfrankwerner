"use client";
import React, { useState, useEffect } from "react";
import { Player } from "@remotion/player";
import { AbsoluteFill } from "remotion";
import { Video, STEP_FRAMES } from "@/remotion/Video";
import { ErrorBoundary } from "./ErrorBoundary";

const defaultMarkdown = `!!steps Step 1: Define Array
\`\`\`js
const numbers = [1, 2, 3, 4, 5];
console.log(numbers);
\`\`\`

!!steps Step 2: Map Values
\`\`\`js
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log(doubled);
\`\`\`

!!steps Step 3: Filter Results
\`\`\`js
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const big = doubled.filter(n => n > 5);
console.log(big);
\`\`\`
`;

const themes = [
  "github-dark",
  "github-light",
  "dracula",
  "dracula-soft",
  "dark-plus",
  "light-plus",
  "material-darker",
  "material-default",
  "material-lighter",
  "material-ocean",
  "material-palenight",
  "min-dark",
  "min-light",
  "monokai",
  "nord",
  "one-dark-pro",
  "poimandres",
  "rose-pine",
  "rose-pine-dawn",
  "rose-pine-moon",
  "slack-dark",
  "slack-ochin",
  "solarized-dark",
  "solarized-light",
];

const SimpleVideo = ({ steps }: { steps: any[] }) => {
  console.log("SimpleVideo Rendering with steps:", steps?.length);
  return (
    <AbsoluteFill style={{ 
      backgroundColor: "white", 
      color: "black", 
      display: "flex", 
      flexDirection: "column",
      alignItems: "center", 
      justifyContent: "center",
      fontSize: 40,
    }}>
      HELLO FROM SIMPLE VIDEO (AbsoluteFill)
      <br />
      Steps: {steps?.length}
    </AbsoluteFill>
  );
};

export default function Home() {
  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const [steps, setSteps] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [theme, setTheme] = useState("github-dark");

  console.log("Home Render:", { stepsCount: steps.length, hasError: !!error });

  useEffect(() => {
    // Initial fetch
    fetchParse(markdown, theme);
  }, []); // Run once on mount

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchParse(markdown, theme);
    }, 1000);

    return () => clearTimeout(timer);
  }, [markdown, theme]);

  const fetchParse = async (md: string, th: string) => {
      console.log("fetchParse called with length:", md.length);
      try {
        const res = await fetch("/api/parse", {
          method: "POST",
          body: JSON.stringify({ markdown: md, theme: th }),
        });
        const data = await res.json();
        console.log("fetchParse received:", data);
        if (data.error) {
          console.error(data.error);
          setError(data.error);
        } else {
          setSteps(data.steps);
          setError(null);
        }
      } catch (e) {
        console.error(e);
        setError("Network error");
      }
  };

  const handleExport = async () => {
      if (steps.length === 0) return;
      setIsExporting(true);
      try {
          const res = await fetch("/api/render", {
              method: "POST",
              body: JSON.stringify({ steps }),
          });
          
          if (!res.ok) {
              const data = await res.json();
              throw new Error(data.error || "Export failed");
          }
          
          const blob = await res.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "code-animation.mp4";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
      } catch (e) {
          console.error(e);
          alert("Export failed: " + e);
      } finally {
          setIsExporting(false);
      }
  };

  const durationInFrames = steps.length > 0 ? steps.length * STEP_FRAMES : 60;

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0D1117] text-white overflow-hidden font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-[#161B22]">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center font-bold text-xl">
                C
            </div>
            <h1 className="font-bold text-lg tracking-tight">Code Animator</h1>
        </div>
        
        <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Theme</label>
                <select 
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="bg-gray-900 border border-gray-700 text-sm rounded px-3 py-1.5 focus:outline-none focus:border-blue-500 transition-colors"
                >
                    {themes.map(t => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>
             </div>
             
             <button 
                 onClick={() => fetchParse(markdown, theme)} 
                 className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm font-bold"
             >
                 Refresh
             </button>
             
             <button 
                 onClick={handleExport} 
                 disabled={isExporting || steps.length === 0}
                 className={`flex items-center gap-2 px-4 py-2 rounded-md transition text-sm font-bold ${ 
                     isExporting || steps.length === 0 
                     ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                     : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
                 }`}
             >
                 {isExporting ? (
                     <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Exporting...
                     </>
                 ) : (
                     "Export MP4"
                 )}
             </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor */}
        <div className="w-1/2 h-full flex flex-col border-r border-gray-800 bg-[#0D1117]">
            <div className="px-4 py-2 bg-[#161B22]/50 text-xs font-mono text-gray-400 border-b border-gray-800">
                EDITOR
            </div>
            <div className="flex-1 relative">
                <textarea
                  className="w-full h-full bg-transparent p-6 font-mono resize-none focus:outline-none text-sm leading-relaxed text-gray-300"
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  spellCheck={false}
                  placeholder="Enter your animation steps here..."
                />
                {error && (
                    <div className="absolute bottom-4 left-4 right-4 bg-red-900/90 text-red-100 p-3 rounded-md text-sm border border-red-700 shadow-xl backdrop-blur-sm">
                        <span className="font-bold block mb-1">Error Parsing Markdown</span>
                        {error}
                    </div>
                )}
            </div>
        </div>

        {/* Preview */}
        <div className="w-1/2 h-full flex flex-col bg-black relative">
            <div className="px-4 py-2 bg-[#161B22]/50 text-xs font-mono text-gray-400 border-b border-gray-800 flex justify-between">
                <span>PREVIEW</span>
                <span>{durationInFrames} frames</span>
            </div>
            <div className="flex-1 flex items-start justify-center p-8 bg-grid-pattern">
                 <div className="absolute top-2 right-2 text-xs text-gray-500 font-mono">
                    Steps: {steps.length} | Error: {error || "None"}
                 </div>
                 {steps.length > 0 ? (
                     <div className="rounded-lg overflow-hidden shadow-2xl border border-gray-800">
                         <ErrorBoundary>
                             <Player
                                component={Video}
                                inputProps={{ steps }}
                                durationInFrames={durationInFrames}
                                fps={60}
                                compositionWidth={1280}
                                compositionHeight={720}
                                style={{
                                    width: "800px",
                                    height: "450px",
                                }}
                                controls
                             />
                         </ErrorBoundary>
                     </div>
                 ) : (
                     <div className="flex flex-col items-center justify-center text-gray-600 gap-4">
                        <div className="w-12 h-12 border-4 border-gray-800 border-t-blue-600 rounded-full animate-spin"></div>
                        <p className="font-mono text-sm animate-pulse">Rendering preview...</p>
                        <p className="text-xs text-red-500 font-mono">
                            Debug: Steps={steps.length}, Error={String(error)}
                        </p>
                     </div>
                 )}
            </div>
        </div>
      </div>
    </div>
  );
}
