import os
import time
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_openai import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.prompts import (
    ChatPromptTemplate,
    MessagesPlaceholder,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
)
from langchain.chains import LLMChain

load_dotenv()

class ActionLanguageModelProcessor:
    def __init__(self):
        self.llm = ChatGroq(temperature=0, model_name="mixtral-8x7b-32768", groq_api_key=os.getenv("GROQ_API_KEY"))
        
        # Load the system prompt from a file
        prompt_path = os.path.join(os.path.dirname(__file__), '..', 'prompts', 'url_action_prompt.txt')
        with open(prompt_path, 'r') as file:
            action_prompt = file.read().strip()
        
        self.prompt = ChatPromptTemplate.from_messages([
            SystemMessagePromptTemplate.from_template(action_prompt),
            HumanMessagePromptTemplate.from_template("{text}")
        ])
        # print("Action prompt: ", self.prompt)

        self.conversation = LLMChain(
            llm=self.llm,
            prompt=self.prompt
        )

    def process(self, text):
        start_time = time.time()
        response = self.conversation.invoke({"text": text})
        end_time = time.time()

        elapsed_time = int((end_time - start_time) * 1000)
        print(f"Action LLM ({elapsed_time}ms): {response['text']}")
        
        try:
            actions = eval(response['text'])
            # print("Actions: ", actions)
            if not isinstance(actions, list):
                print("Warning: Actions response is not a list")
                return []
            return actions
        except Exception as e:
            print(f"Error parsing actions: {str(e)}")
            print(f"Raw response: {response['text']}")
            return []