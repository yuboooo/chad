import sys
import os

# Add the project root to Python path to fix imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from backend.function.llms.checking_llm import IntentClassifierProcessor

def test_intent_classification():
    # Initialize the LLM processor
    llm = IntentClassifierProcessor()
    
    # Test cases with expected results
    test_cases = [
        "Can you open github?",
        "What's the weather like today?",
        "Tell me a joke",
        "Can you open youtube please?",
        "What is 2+2?",
        "Can you help me with my homework?"
    ]
    
    print("\nTesting Intent Classification:")
    print("-" * 50)
    
    for test_input in test_cases:
        print(f"\nInput: {test_input}")
        try:
            result = llm.process(test_input)
            print(f"Classified Intent: {result}")
            # Validate that the result is a non-empty list
            assert isinstance(result, list), "Result should be a list"
            assert len(result) > 0, "Result should not be empty"
            assert all(isinstance(intent, str) for intent in result), "All intents should be strings"
            print("✓ Validation passed")
        except Exception as e:
            print(f"Error occurred: {str(e)}")
            print(f"Error type: {type(e)}")

if __name__ == "__main__":
    test_intent_classification() 