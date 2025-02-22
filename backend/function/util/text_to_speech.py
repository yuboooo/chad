import os
import shutil
import subprocess
import requests
import time
from dotenv import load_dotenv

load_dotenv()

class TextToSpeech:
    DG_API_KEY = os.getenv("DEEPGRAM_API_KEY")
    MODEL_NAME = "aura-luna-en"

    @staticmethod
    def is_installed(lib_name: str) -> bool:
        lib = shutil.which(lib_name)
        return lib is not None

    def speak(self, text):
        if not self.is_installed("ffplay"):
            raise ValueError("ffplay not found, necessary to stream audio.")

        print(f"Attempting TTS for text: {text}")
        
        DEEPGRAM_URL = f"https://api.deepgram.com/v1/speak?model={self.MODEL_NAME}&encoding=linear16&sample_rate=24000"
        headers = {
            "Authorization": f"Token {self.DG_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {"text": text}

        try:
            response = requests.post(DEEPGRAM_URL, stream=True, headers=headers, json=payload)
            if response.status_code != 200:
                print(f"Deepgram API error: {response.status_code}")
                print(f"Response: {response.text}")
                return
            
            player_command = ["ffplay", "-autoexit", "-", "-nodisp"]
            player_process = subprocess.Popen(
                player_command,
                stdin=subprocess.PIPE,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )

            start_time = time.time()
            first_byte_time = None

            with response as r:
                for chunk in r.iter_content(chunk_size=1024):
                    if chunk:
                        if first_byte_time is None:
                            first_byte_time = time.time()
                            ttfb = int((first_byte_time - start_time)*1000)
                            print(f"TTS Time to First Byte (TTFB): {ttfb}ms\n")
                        player_process.stdin.write(chunk)
                        player_process.stdin.flush()

            if player_process.stdin:
                player_process.stdin.close()
            player_process.wait()
        except Exception as e:
            print(f"Error in TTS: {e}") 