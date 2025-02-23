"""
Manages voice-based action execution through speech recognition and language model processing.
Listens for voice commands, processes them to detect actions (like opening URLs),
and provides voice feedback on action execution status.

Key components:
- Speech-to-text: Captures voice commands
- Action processing: Identifies actionable commands via LLM
- Action execution: Performs detected actions (e.g., opening URLs)
- Voice feedback: Confirms action status through text-to-speech
"""

import asyncio
from backend.function.llms.url_llm import ActionLanguageModelProcessor
from backend.function.util.text_to_speech import TextToSpeech
from backend.function.util.speech_to_text import get_transcript
from backend.function.action.open_url import execute_open_url

class ActionConversationManager:
    def __init__(self):
        self.transcription_response = ""
        self.action_llm = ActionLanguageModelProcessor()
        self.tts = TextToSpeech()

    async def main(self):
        def handle_full_sentence(full_sentence):
            self.transcription_response = full_sentence

        # Get single voice input
        await get_transcript(handle_full_sentence)
        
        # Process the input for actions
        actions = self.action_llm.process(self.transcription_response)
        
        # Execute actions if any are returned
        if actions:
            for action in actions:
                result = execute_open_url(action)
                response = "Action completed successfully" if result == 1 else "Failed to execute action"
                self.tts.speak(response)
        else:
            self.tts.speak("No action was detected in your request")

if __name__ == "__main__":
    manager = ActionConversationManager()
    asyncio.run(manager.main())
