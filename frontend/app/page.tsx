'use client';
import { useState, useRef, useEffect } from "react";

import DynamicScreen from "./DynamicScreen";


export default function Home() {
  const [isListening, setIsListening] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{role: string, content: string}>>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversationHistory]);

  // Add this constant at the top of your component
  const API_URL = process.env.NODE_ENV === 'development' 
    ? 'http://127.0.0.1:5001'
    : 'https://chad-production-c01d.up.railway.app';


  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      // Define proper types for WebkitSpeechRecognition
      interface Window {
        webkitSpeechRecognition: new () => SpeechRecognition;
      }
      
      interface SpeechRecognition {
        continuous: boolean;
        interimResults: boolean;
        onstart: () => void;
        onresult: (event: SpeechRecognitionEvent) => void;
        onend: () => void;
        start: () => void;
      }

      type SpeechRecognitionEvent = {
        results: {
          [key: number]: {
            [key: number]: {
              transcript: string;
            };
          };
        };
      };

      const recognition = new (window as Window).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const text = event.results[0][0].transcript;
        sendToBackend(text);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  };

  const playAudio = async (audioData: string) => {
    // Convert hex string back to ArrayBuffer
    const buffer = new Uint8Array(audioData.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))).buffer;
    const audioContext = new AudioContext();
    
    try {
      const audioBuffer = await audioContext.decodeAudioData(buffer);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start(0);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const sendToBackend = async (text: string) => {
    try {
      // Clear conversation history if "new conversation" is detected
      if (text.toLowerCase() === 'new conversation') {
        setConversationHistory([]);
      }

      // Add user message to conversation history
      setConversationHistory(prev => [...prev, { role: 'user', content: text }]);

      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text,
          clear_memory: ['new conversation']
            .includes(text.toLowerCase())
        }),
      });
      
      const data = await response.json();
      console.log('API Response:', data);
      
      if (data.chat_response) {
        setConversationHistory(prev => [...prev, { role: 'assistant', content: data.chat_response }]);
      }
      
      // Handle action response
      if (data.action_response) {
        console.log(data.action_response.params.url);
        // Open URL in a new tab/window
        window.open(data.action_response.params?.url, '_blank');
      }
      
      if (data.audio) {
        await playAudio(data.audio);
      }
      
    } catch (error) {
      console.error('Error:', error);
    }
  };


  return (
    <div className="grid grid-rows-[1fr_auto] min-h-screen">
      <div className="row-start-1">
        <div className="screen">
          <DynamicScreen />
        </div>
      </div>
      {/* bg-black/80  */}
      {/* Chat container - fixed width and centered */}
      <div className="row-start-2 w-[340px] h-[35vh] p-4 mb-3 relative left-[-25px]">
        {/* Chat history with fixed width messages */}
        <div 
          ref={chatContainerRef}
          className="h-[calc(37vh-7rem)] overflow-y-auto mb-8 scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-gray-800"
        >
          {conversationHistory.map((message, index) => (
            <div 
              key={index} 
              className={`mb-2 ${
                message.role === 'user' 
                  ? 'text-right' 
                  : 'text-left'
              }`}
            >
              <div className={`inline-block w-[210px] break-words whitespace-normal ${
                message.role === 'user'
                  ? ''
                  : ''
                } p-3 rounded  text-green-400 font-mono text-sm`}
              >
                <div className="text-xs opacity-50 mb-1">
                  {message.role === 'user' ? '> USER_INPUT' : '> SYSTEM_RESPONSE'}
                </div>
                <div className="font-mono">
                  {message.content}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Voice control button - centered in fixed width container */}
        <div className="flex justify-center">
          <button 
            onClick={startListening}
            className="px-6 py-2 bg-green-900/40 text-green-400 border border-green-500/50 rounded 
              hover:bg-green-800/40 font-mono text-sm transition-colors duration-200"
          >
            {isListening ? '>> LISTENING...' : '>> START_VOICE_INPUT'}
          </button>
        </div>
      </div>
    </div>
  );
}