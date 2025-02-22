const WebSocket = require("ws"); // WebSocket server
const fs = require("fs");

const server = new WebSocket.Server({ port: 3000 });

server.on("connection", (ws) => {
    console.log("Client connected");

    let audioChunks = []; // Store received audio data
    let recording = false; // Track recording state
    let timeout; // Timer for sending back the audio

    ws.on("message", (data) => {
        if (!recording) {
            recording = true; // Start recording when first data arrives
            console.log("Recording started...");
        }

        audioChunks.push(data); // Collect audio chunks

        // Reset the timeout every time a new chunk is received
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            if (recording) {
                console.log("Recording stopped. Sending back audio...");
                recording = false; // Stop recording

                // Combine chunks into a single buffer
                const audioBuffer = Buffer.concat(audioChunks);
                
                // Save received audio file (optional)
                fs.writeFileSync("received_audio.webm", audioBuffer);
                console.log("Audio saved as received_audio.webm");

                // Send the collected audio back to the client
                ws.send(audioBuffer);
                audioChunks = []; // Clear buffer for the next recording session
            }
        }, 3000); // Wait 3 seconds after the last received chunk
    });

    ws.on("close", () => {
        console.log("Client disconnected");
        clearTimeout(timeout);
    });
});

console.log("WebSocket server running on ws://localhost:3000");

