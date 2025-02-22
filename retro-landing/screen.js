import * as THREE from 'three'

const len = 1024;
const canvas = document.createElement('canvas');
canvas.width = len;
canvas.height = len;
export function createScreen(scene, position, width, height) {
    const ctx = canvas.getContext('2d');

    // Draw initial content on the canvas (example: a simple UI)
    const fontSize = Math.floor(len*0.1)
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0,len,len);
    ctx.fillStyle = "white";
    ctx.font = `300px Arial`;
    ctx.fillText("Loading...", 200,500);

    // Convert the canvas into a Three.js texture
    const screenTexture = new THREE.CanvasTexture(canvas);
    screenTexture.minFilter = THREE.LinearFilter;
    screenTexture.magFilter = THREE.LinearFilter;
    screenTexture.needsUpdate = true;
    const screenMaterial = new THREE.MeshBasicMaterial({ map: screenTexture });

    // Create a plane geometry for the screen
    const screenGeometry = new THREE.PlaneGeometry(width, height); // Slightly smaller than the box face
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.copy(position); // Slightly in front of the box
    scene.add(screen);

    return {screen, ctx, screenTexture};
}

// Function to update the screen dynamically
export function updateScreen(ctx, screenTexture, content) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, len, len); // Clear screen
    ctx.fillStyle = "white";
    ctx.font = "400px Arial";
    ctx.fillText(content, 300, 500);

    screenTexture.needsUpdate = true; // Refresh the texture
}
