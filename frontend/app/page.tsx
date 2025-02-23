'use client';
import { useState, useEffect } from "react";

export default function Home() {
  const [message, setMessage] = useState('Loading...');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  // Add this constant at the top of your component
  const API_URL = process.env.NODE_ENV === 'development' 
    ? 'http://127.0.0.1:5001'
    : 'https://chad-production-c01d.up.railway.app';

  useEffect(() => {
    fetch(`${API_URL}/`)
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('Error:', error));
  }, []);

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
        setTranscript(text);
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
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text,
          // Clear memory for conversation starters
          clear_memory: ['new conversation']
            .includes(text.toLowerCase())
        }),
      });
      
      const data = await response.json();
      
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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold">{message}</h1>
        <div className="flex flex-col items-center gap-4">
          <button 
            onClick={startListening}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {isListening ? 'Listening...' : 'Start Speaking'}
          </button>
          {transcript && (
            <div className="mt-4">
              <p>You said: {transcript}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
