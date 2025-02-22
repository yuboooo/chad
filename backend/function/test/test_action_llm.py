import sys
import os

# Add the project root to Python path to fix imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from function.llms.action_llm import ActionLanguageModelProcessor
from function.action.open_url import execute_open_url

def test_action_detection():
    # Initialize the LLM processor
    llm = ActionLanguageModelProcessor()
    
    # Test cases with expected results
    test_cases = [
        "Can you open github?",
        "Can you open youtube?",
        "Can you open linkedin?",
        # "can you open yubojing"
    ]
    
    print("\nTesting Action Detection:")
    print("-" * 50)
    
    for test_input in test_cases:
        print(f"\nInput: {test_input}")
        try:
            actions = llm.process(test_input)
            # Test the first action if any actions are returned
            print("Actions: ", actions)
            if actions:
                result = execute_open_url(actions[0])
                print(f"Action execution result: {'Success' if result == 1 else 'Failed'}")
            else:
                print("No actions to execute")
        except Exception as e:
            print(f"Error occurred: {str(e)}")
            print(f"Error type: {type(e)}")
    
if __name__ == "__main__":
    test_action_detection() 