"""
Manages a voice-based conversation loop between a user and an AI language model.
Handles speech-to-text transcription, language model processing, and text-to-speech output.
The conversation continues until the user says "goodbye".

Key components:
- Speech-to-text: Continuously transcribes user speech
- Language model: Processes transcribed text and generates responses
- Text-to-speech: Converts AI responses to spoken audio
"""

import asyncio
from backend.function.llms.chat_llm import LanguageModelProcessor
from backend.function.util.text_to_speech import TextToSpeech
from backend.function.util.speech_to_text import get_transcript

class ConversationManager:
    def __init__(self):
        self.transcription_response = ""
        self.llm = LanguageModelProcessor()

    async def main(self):
        def handle_full_sentence(full_sentence):
            self.transcription_response = full_sentence

        while True:
            await get_transcript(handle_full_sentence)
            
            if "goodbye" in self.transcription_response.lower():
                break
            
            llm_response = self.llm.process(self.transcription_response)

            tts = TextToSpeech()
            tts.speak(llm_response)

            self.transcription_response = ""

if __name__ == "__main__":
    manager = ConversationManager()
    asyncio.run(manager.main()) 