const ws = new WebSocket("ws://localhost:3000"); // Connect to WebSocket server

let mediaRecorder;
let recording = false;
let audioContext = new AudioContext();
let sourceNode;
let streamNode;

document.getElementById("audioBtn").addEventListener("click", async () => {
    if (recording) {
        recording = false;
        if (mediaRecorder) {
            console.log("recording stop");
            mediaRecorder.stop();
        }
        return;
    }

    recording = true;
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);

        console.log("recording");

        mediaRecorder.ondataavailable = event => {
            if (event.data.size > 0 && ws.readyState === WebSocket.OPEN) {
                ws.send(event.data); // Send audio chunk to WebSocket server
            }
        };

        mediaRecorder.start(100); // Send data every 100ms
    } catch (error) {
        console.error("Error starting audio:", error);
    }
});

// Handle incoming audio from WebSocket and play in real-time
ws.onmessage = async (event) => {
    const audioBlob = new Blob([event.data], { type: "audio/webm" });
    const audioUrl = URL.createObjectURL(audioBlob);
    
    const audio = new Audio(audioUrl);
    audio.play();
};

