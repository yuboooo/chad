'use client';
import { useState, useEffect } from "react";

export default function Home() {
  const [message, setMessage] = useState('Loading...');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    fetch('http://localhost:5001/')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('Error:', error));
  }, []);

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      // @ts-ignore
      recognition.onresult = (event: any) => {
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
      const response = await fetch('http://localhost:5001/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      
      const data = await response.json();
      
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
