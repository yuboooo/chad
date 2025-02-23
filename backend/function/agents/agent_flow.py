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
from function.llms.chat_llm import LanguageModelProcessor
from function.llms.checking_llm import IntentClassifierProcessor
from function.llms.url_llm import ActionLanguageModelProcessor
from function.util.text_to_speech import TextToSpeech
from function.util.speech_to_text import get_transcript
from function.action.open_url import execute_open_url

class AgentFlow:
    def __init__(self):
        self.chat_llm = LanguageModelProcessor()
        self.checking_llm = IntentClassifierProcessor()
        self.action_llm = ActionLanguageModelProcessor()

    def clear_conversation_memory(self):
        """Clear the conversation memory in chat LLM"""
        self.chat_llm.clear_memory()

    async def process_chat(self, text):
        """Handle the chat response and return it"""
        # Check if it's a new conversation start indicator
        if text.lower() in ["new conversation"]:
            self.clear_conversation_memory()
        
        response = self.chat_llm.process(text)
        return response

    async def process_action(self, text):
        """Handle the action detection and execution, return the response"""
        intents = self.checking_llm.process(text)
        
        if "action" in intents:
            actions = self.action_llm.process(text)
            print(actions)
            
            if actions and isinstance(actions, list) and len(actions) > 0:
                # Return the first action directly instead of executing it
                return actions[0]
        
        return None

    async def main(self):
        def handle_full_sentence(full_sentence):
            self.transcription_response = full_sentence

        while True:
            # Get voice input
            await get_transcript(handle_full_sentence)
            
            if "goodbye" in self.transcription_response.lower():
                farewell = self.chat_llm.process("goodbye")
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
