import os
import random
import numpy as np
import torch
import gradio as gr
import librosa
import soundfile as sf
from pathlib import Path
from chatterbox.tts import ChatterboxTTS

# Optimized settings for M4 Mac
DEVICE = "mps" if torch.backends.mps.is_available() else "cpu"
print(f"Using device: {DEVICE}")

def set_seed(seed: int):
    """Set random seed for reproducible results"""
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed(seed)
        torch.cuda.manual_seed_all(seed)
    random.seed(seed)
    np.random.seed(seed)

def load_model():
    """Load the Chatterbox TTS model"""
    print("Loading Chatterbox TTS model...")
    model = ChatterboxTTS.from_pretrained(DEVICE)
    print("Model loaded successfully!")
    return model

def preprocess_audio(audio_path):
    """Preprocess audio file for optimal voice cloning"""
    if audio_path is None:
        return None
    
    try:
        # Load audio file (supports M4A, WAV, MP3, etc.)
        audio, sr = librosa.load(audio_path, sr=22050)
        
        # Trim silence from beginning and end
        audio, _ = librosa.effects.trim(audio, top_db=20)
        
        # Normalize audio
        audio = librosa.util.normalize(audio)
        
        # Save preprocessed audio as WAV
        processed_path = "preprocessed_voice_sample.wav"
        sf.write(processed_path, audio, sr)
        
        # Calculate duration
        duration = len(audio) / sr
        
        return processed_path, duration
    
    except Exception as e:
        return None, f"Error processing audio: {str(e)}"

def analyze_voice_sample(audio_path):
    """Analyze the uploaded voice sample and provide feedback"""
    if audio_path is None:
        return "No audio file uploaded."
    
    try:
        audio, sr = librosa.load(audio_path, sr=22050)
        duration = len(audio) / sr
        
        # Check duration
        if duration < 10:
            duration_feedback = "⚠️ Too short (less than 10 seconds). Recommend 15-30 seconds."
        elif duration > 60:
            duration_feedback = "⚠️ Too long (over 60 seconds). Recommend 15-30 seconds."
        else:
            duration_feedback = "✅ Good duration"
        
        # Check for silence
        non_silent = librosa.effects.split(audio, top_db=20)
        silence_ratio = 1 - (sum(end - start for start, end in non_silent) / len(audio))
        
        if silence_ratio > 0.3:
            silence_feedback = "⚠️ Too much silence. Record with less pauses."
        else:
            silence_feedback = "✅ Good speech-to-silence ratio"
        
        # Check volume levels
        rms = librosa.feature.rms(y=audio)[0]
        avg_volume = np.mean(rms)
        
        if avg_volume < 0.01:
            volume_feedback = "⚠️ Audio too quiet. Speak louder or increase recording volume."
        elif avg_volume > 0.3:
            volume_feedback = "⚠️ Audio too loud. May cause distortion."
        else:
            volume_feedback = "✅ Good volume level"
        
        feedback = f"""
**Voice Sample Analysis:**
- Duration: {duration:.1f} seconds - {duration_feedback}
- Silence: {silence_feedback}
- Volume: {volume_feedback}

**Overall Quality:** {'✅ Excellent' if all('✅' in f for f in [duration_feedback, silence_feedback, volume_feedback]) else '⚠️ Needs improvement'}
        """
        
        return feedback
        
    except Exception as e:
        return f"Error analyzing audio: {str(e)}"

def generate_voice_clone(model, text, voice_sample, exaggeration, cfg_weight, temperature, seed_num, use_preprocessing):
    """Generate speech using voice cloning"""
    if model is None:
        model = ChatterboxTTS.from_pretrained(DEVICE)
    
    if not text.strip():
        return None, "Please enter some text to synthesize."
    
    if len(text) > 500:
        return None, "Text too long. Please keep it under 500 characters."
    
    try:
        # Set seed for reproducibility
        if seed_num != 0:
            set_seed(int(seed_num))
        
        # Preprocess audio if requested
        audio_path = voice_sample
        if use_preprocessing and voice_sample:
            processed_path, duration = preprocess_audio(voice_sample)
            if isinstance(duration, str):  # Error message
                return None, duration
            audio_path = processed_path
        
        # Generate speech
        wav = model.generate(
            text,
            audio_prompt_path=audio_path,
            exaggeration=exaggeration,
            temperature=temperature,
            cfg_weight=cfg_weight,
        )
        
        # Convert to numpy array for Gradio
        audio_output = (model.sr, wav.squeeze(0).cpu().numpy())
        
        success_msg = f"✅ Generated {len(text)} characters of speech"
        if audio_path:
            success_msg += " using voice cloning"
        
        return audio_output, success_msg
        
    except Exception as e:
        return None, f"Error generating speech: {str(e)}"

# Create the Gradio interface
def create_app():
    with gr.Blocks(
        theme=gr.themes.Soft(),
        title="Voice Cloning Content Creator",
        css="""
        .gradio-container {
            max-width: 1200px !important;
        }
        .voice-tips {
            background: #222831;
            color: #f1f1f1;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #3b82f6;
        }
        """
    ) as demo:
        
        # Model state
        model_state = gr.State(None)
        
        gr.Markdown("# 🎙️ Voice Cloning Content Creator")
        gr.Markdown("Create professional voice content using your own voice with Chatterbox TTS")
        
        with gr.Row():
            with gr.Column(scale=1):
                gr.Markdown("## 📁 Voice Sample")
                
                # Voice sample upload
                voice_sample = gr.Audio(
                    sources=["upload", "microphone"],
                    type="filepath",
                    label="Upload Your Voice Sample",
                    # info="Upload M4A, WAV, or MP3 file (15-30 seconds recommended)"
                )
                
                # Audio analysis
                analyze_btn = gr.Button("🔍 Analyze Voice Sample", variant="secondary")
                analysis_output = gr.Markdown()
                
                # Preprocessing option
                use_preprocessing = gr.Checkbox(
                    label="Auto-preprocess audio (recommended)",
                    value=True,
                    info="Automatically trim silence and normalize volume"
                )
                
                gr.Markdown("## 🎛️ Generation Settings")
                
                # Main controls
                exaggeration = gr.Slider(
                    0.1, 1.5, 
                    step=0.05, 
                    label="Voice Expression", 
                    value=0.5,
                    info="0.1 = Calm, 0.5 = Natural, 1.0+ = Expressive"
                )
                
                cfg_weight = gr.Slider(
                    0.1, 1.0, 
                    step=0.05, 
                    label="Speech Pace", 
                    value=0.5,
                    info="Lower = Faster, Higher = Slower"
                )
                
                # Advanced settings
                with gr.Accordion("🔧 Advanced Settings", open=False):
                    temperature = gr.Slider(
                        0.1, 2.0, 
                        step=0.1, 
                        label="Creativity", 
                        value=0.8,
                        info="Higher = More varied, Lower = More consistent"
                    )
                    
                    seed_num = gr.Number(
                        value=0, 
                        label="Random Seed",
                        info="0 = Random, any number = Reproducible results"
                    )
            
            with gr.Column(scale=2):
                gr.Markdown("## 📝 Content Creation")
                
                # Text input
                text_input = gr.Textbox(
                    label="Text to Synthesize",
                    placeholder="Enter your script here...",
                    lines=6,
                    max_lines=10,
                    info="Keep it under 500 characters for best results"
                )
                
                # Character counter
                char_count = gr.Markdown("Characters: 0/500")
                
                # Generate button
                generate_btn = gr.Button("🎤 Generate Voice", variant="primary", size="lg")
                
                # Output
                audio_output = gr.Audio(label="Generated Audio")
                status_output = gr.Markdown()
                
                # Quick text examples
                gr.Markdown("## 💡 Quick Examples")
                example_texts = [
                    "Welcome to my podcast! Today we're discussing the future of artificial intelligence.",
                    "Thanks for watching! Don't forget to like and subscribe for more content.",
                    "In this tutorial, I'll show you how to create amazing content using AI tools.",
                    "Good morning everyone! Let's start today's lesson with an interesting question."
                ]
                
                for i, example in enumerate(example_texts):
                    gr.Button(f"Example {i+1}", size="sm").click(
                        lambda x=example: x,
                        outputs=text_input
                    )
        
        # Voice recording tips
        with gr.Accordion("🎯 Perfect Voice Sample Guide", open=False):
            gr.Markdown("""
            <div class="voice-tips">
            
            ### 📋 What to Say in Your Voice Sample:
            
            **Option 1: Natural Conversation**
            "Hi there! I'm excited to be creating content with this amazing voice cloning technology. 
            I hope you find this useful for your projects. The weather is nice today, and I'm feeling 
            creative. Let me know what you think about this voice sample quality."
            
            **Option 2: Varied Pronunciation**
            "The quick brown fox jumps over the lazy dog. She sells seashells by the seashore. 
            Peter Piper picked a peck of pickled peppers. How much wood would a woodchuck chuck 
            if a woodchuck could chuck wood? These sentences help capture different sounds."
            
            **Option 3: Content-Specific**
            Record yourself saying something similar to what you'll generate (e.g., if making podcast 
            intros, record yourself doing a practice intro).
            
            ### 🎤 Recording Tips:
            - **Duration**: 15-30 seconds (not too short, not too long)
            - **Environment**: Quiet room, no background noise
            - **Speaking**: Natural pace, clear pronunciation
            - **Emotion**: Match the tone you want for your content
            - **Consistency**: Steady volume throughout
            - **Quality**: Use a decent microphone or phone close to your mouth
            
            ### ✅ Signs of a Good Sample:
            - Clear speech without mumbling
            - Consistent volume
            - Minimal background noise
            - Natural breathing patterns
            - Various vowel and consonant sounds
            
            </div>
            """)
        
        # Event handlers
        def update_char_count(text):
            return f"Characters: {len(text)}/500"
        
        text_input.change(update_char_count, inputs=text_input, outputs=char_count)
        
        analyze_btn.click(
            analyze_voice_sample,
            inputs=voice_sample,
            outputs=analysis_output
        )
        
        generate_btn.click(
            generate_voice_clone,
            inputs=[
                model_state,
                text_input,
                voice_sample,
                exaggeration,
                cfg_weight,
                temperature,
                seed_num,
                use_preprocessing
            ],
            outputs=[audio_output, status_output]
        )
        
        # Load model on startup
        demo.load(load_model, outputs=model_state)
    
    return demo

# Launch the app
if __name__ == "__main__":
    app = create_app()
    app.queue(max_size=10).launch(
        server_name="0.0.0.0",
        server_port=7860,
        share=False,  # Set to True if you want a public link
        show_error=True
    )