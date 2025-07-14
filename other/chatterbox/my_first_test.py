import torchaudio as ta
from chatterbox.tts import ChatterboxTTS

# Initialize model - this will download the model on first run
print("Loading Chatterbox TTS model...")
model = ChatterboxTTS.from_pretrained(device="cpu")  # Use "mps" if you have Apple Silicon
print("Model loaded successfully!")

# Generate your first speech
text = "Hello! I'm using Chatterbox TTS on my Mac. This is pretty cool!"
print(f"Generating speech for: '{text}'")

wav = model.generate(text)

# Save the audio
output_file = "my_first_chatterbox_output.wav"
ta.save(output_file, wav, model.sr)
print(f"Audio saved as: {output_file}")
print("You can now play this file in any audio player!")