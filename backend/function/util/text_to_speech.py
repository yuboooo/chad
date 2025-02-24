import os
import requests
from dotenv import load_dotenv

load_dotenv()

class TextToSpeech:
    ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
    VOICE_ID = "21m00Tcm4TlvDq8ikWAM"  # Default voice ID - you can change this
    VOICE_ID = "SV61h9yhBg4i91KIBwdz"  # indian better man
    VOICE_ID = "NOpBlnGInO9m6vDvFkFC"  # grandpa
    VOICE_ID = "xnx6sPTtvU635ocDt2j7"  # indian
    VOICE_ID = "eVItLK1UvXctxuaRV2Oq"  # female
    VOICE_ID = "XsmrVB66q3D4TaXVaWNF"  # funny
    
    def get_audio_stream(self, text):
        print(f"Attempting TTS for text: {text}")
        
        ELEVENLABS_URL = f"https://api.elevenlabs.io/v1/text-to-speech/{self.VOICE_ID}"
        headers = {
            "xi-api-key": self.ELEVENLABS_API_KEY,
            "Content-Type": "application/json"
        }
        payload = {
            "text": text,
            "model_id": "eleven_turbo_v2",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.5
            }
        }

        try:
            response = requests.post(ELEVENLABS_URL, headers=headers, json=payload)
            if response.status_code != 200:
                print(f"ElevenLabs API error: {response.status_code}")
                print(f"Response: {response.text}")
                return None
            
            return response.content  # Return the raw audio data
            
        except Exception as e:
            print(f"Error in TTS: {e}")
            return None 