from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
from io import BytesIO
from function.agents.agent_flow import AgentFlow
from function.util.text_to_speech import TextToSpeech

app = Flask(__name__)
CORS(app)

agent = AgentFlow()
tts = TextToSpeech()

@app.route('/')
def hello():
    return {"message": "Hello from Chad, this is connected to railway"}

@app.route('/chat', methods=['POST'])
async def chat():
    text = request.json.get('text', '')
    clear_memory = request.json.get('clear_memory', False)  # New parameter
    
    if not text:
        return jsonify({"error": "No text provided"}), 400
    
    # Clear memory if requested
    if clear_memory:
        agent.clear_conversation_memory()
    
    # Process both chat and action
    chat_response = await agent.process_chat(text)
    action_response = await agent.process_action(text)
    print(action_response)
    
    # Get audio for the response
    audio_data = None
    if chat_response:
        audio_data = tts.get_audio_stream(chat_response)
    
    return jsonify({
        "chat_response": chat_response,
        "action_response": action_response,  # This will now be the action object directly
        "audio": audio_data.hex() if audio_data else None
    })

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port)