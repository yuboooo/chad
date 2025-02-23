import os
import requests
from dotenv import load_dotenv

load_dotenv()

class TextToSpeech:
    DG_API_KEY = os.getenv("DEEPGRAM_API_KEY")
    MODEL_NAME = "aura-luna-en"

    def get_audio_stream(self, text):
        print(f"Attempting TTS for text: {text}")
        
        DEEPGRAM_URL = f"https://api.deepgram.com/v1/speak?model={self.MODEL_NAME}&encoding=linear16&sample_rate=24000"
        headers = {
            "Authorization": f"Token {self.DG_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {"text": text}

        try:
            response = requests.post(DEEPGRAM_URL, headers=headers, json=payload)
            if response.status_code != 200:
                print(f"Deepgram API error: {response.status_code}")
                print(f"Response: {response.text}")
                return None
            
            return response.content  # Return the raw audio data
            
        except Exception as e:
            print(f"Error in TTS: {e}")
            return None 