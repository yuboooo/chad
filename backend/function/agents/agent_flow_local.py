"""
Manages a sophisticated conversation flow that handles both chat and actions simultaneously.
For each user input:
1. Initiates a chat response thread
2. Checks for potential actions
3. Executes actions if detected
4. Provides contextual responses through chat

Key components:
- Dual processing: Handles both chat and actions concurrently
- Action detection: Uses checking_llm to identify action intents
- Action execution: Processes detected actions via url_llm
- Contextual responses: Maintains conversation flow with chat_llm
"""

import asyncio
from backend.function.llms.chat_llm import LanguageModelProcessor
from backend.function.llms.checking_llm import IntentClassifierProcessor
from backend.function.llms.url_llm import ActionLanguageModelProcessor
from backend.function.util.text_to_speech import TextToSpeech
from backend.function.util.speech_to_text import get_transcript
from backend.function.action.open_url import execute_open_url

class AgentFlow:
    def __init__(self):
        self.transcription_response = ""
        self.chat_llm = LanguageModelProcessor()
        self.checking_llm = IntentClassifierProcessor()
        self.action_llm = ActionLanguageModelProcessor()
        self.tts = TextToSpeech()

    async def process_chat(self, text):
        """Handle the chat response in a separate task"""
        response = self.chat_llm.process(text)
        self.tts.speak(response)

    async def process_action(self, text):
        """Handle the action detection and execution"""
        # First check if this is an action
        intents = self.checking_llm.process(text)

        print(f"Intents: {intents}")
        
        if "action" in intents:
            # Get specific actions from url_llm
            actions = self.action_llm.process(text)
            print(f"Actions: {actions}")
            
            if actions:
                for action in actions:
                    result = execute_open_url(action)
                    # Create action status message
                    status = "I've successfully opened that website for you" if result == 1 else "I wasn't able to open that website"
                    # Process the status through chat_llm for a natural response
                    response = self.chat_llm.process(status)
                    self.tts.speak(response)
            else:
                status = "I wasn't able to open that website"
                response = self.chat_llm.process(status)
                self.tts.speak(response)

    async def main(self):
        def handle_full_sentence(full_sentence):
            self.transcription_response = full_sentence

        while True:
            # Get voice input
            await get_transcript(handle_full_sentence)
            
            if "goodbye" in self.transcription_response.lower():
                farewell = self.chat_llm.process("goodbye")
                self.tts.speak(farewell)
                break
            
            # Process both chat and action concurrently
            await asyncio.gather(
                self.process_chat(self.transcription_response),
                self.process_action(self.transcription_response)
            )

            self.transcription_response = ""

if __name__ == "__main__":
    agent = AgentFlow()
    asyncio.run(agent.main())
