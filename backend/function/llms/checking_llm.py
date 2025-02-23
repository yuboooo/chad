import os
import time
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain.prompts import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
)
from langchain.chains import LLMChain

load_dotenv()

class IntentClassifierProcessor:
    def __init__(self):
        self.llm = ChatGroq(temperature=0, model_name="mixtral-8x7b-32768", groq_api_key=os.getenv("GROQ_API_KEY"))
        
        # Load the system prompt from a file
        prompt_path = os.path.join(os.path.dirname(__file__), '..', 'prompts', 'action_classification_prompt.txt')
        with open(prompt_path, 'r') as file:
            checking_prompt = file.read().strip()
        
        self.prompt = ChatPromptTemplate.from_messages([
            SystemMessagePromptTemplate.from_template(checking_prompt),
            HumanMessagePromptTemplate.from_template("{text}")
        ])

        self.conversation = LLMChain(
            llm=self.llm,
            prompt=self.prompt
        )

    def process(self, text):
        start_time = time.time()
        # Make the instruction even more explicit and strict
        instruction = (
            f"Classify the following text: {text}\n"
            "IMPORTANT: Respond ONLY with ['action'] or ['chat']. "
            "No explanation, no code, no examples. Just the list."
            "Only classify action with open url as action, otherwise classify as chat"
        )
        response = self.conversation.invoke({"text": instruction})
        end_time = time.time()

        elapsed_time = int((end_time - start_time) * 1000)
        print(f"Checking LLM ({elapsed_time}ms): {response['text']}")
        
        try:
            result = eval(response['text'])
            # Validate that result is a list containing only 'action' or 'chat'
            if isinstance(result, list) and len(result) == 1 and result[0] in ['action', 'chat']:
                return result
            print(f"Warning: Invalid response format: {result}")
            return ["chat"]
        except Exception as e:
            print(f"Error parsing response: {str(e)}")
            print(f"Raw response: {response['text']}")
            return ["chat"] 