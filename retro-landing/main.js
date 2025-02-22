import * as THREE from 'three';
import {createScreen, updateScreen} from './screen.js';
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Camera setup (Driver's perspective)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(2, 0.6, 5);
camera.lookAt(2, 1.5, 0);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Skybox
const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
const skyMaterial = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load('./skybox.png'),
    side: THREE.BackSide // Flip the sphere inside out
});
const skySphere = new THREE.Mesh(skyGeometry, skyMaterial);
scene.add(skySphere);

// Lights
scene.add(new THREE.AmbientLight(0x404040, 1)); // Soft ambient light
const directionalLight = new THREE.DirectionalLight(0xff00ff, 2);
directionalLight.position.set(0, 3, -10);
scene.add(directionalLight);
const interiorLight = new THREE.DirectionalLight(0x0000ff, 3);
interiorLight.position.set(2, 1, 5);
scene.add(interiorLight);

// Add a neon sunset glow
const neonLight = new THREE.PointLight(0xff0099, 10, 100);
neonLight.position.set(0, 10, -10);
scene.add(neonLight);

// Add ambient neon glow
const ambientLight = new THREE.AmbientLight(0x220044, 0.8);
scene.add(ambientLight);

// Road
const roadGeometry = new THREE.PlaneGeometry(10, 50, 10, 10);
const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, side: THREE.DoubleSide });
/*const roadMaterial = new THREE.MeshStandardMaterial({
    color: 0x222222,  // Dark road color
    metalness: 0.9,   // High metalness for reflections
    roughness: 0.2    // Low roughness for sharper reflections
});*/

const road = new THREE.Mesh(roadGeometry, roadMaterial);
road.rotation.x = -Math.PI / 2;
road.position.y = 0.01;
scene.add(road);

// Road Lines
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
const createLine = (xOffset) => {
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(xOffset, 0.02, -25),
        new THREE.Vector3(xOffset, 0.02, 25)
    ]);
    return new THREE.Line(lineGeometry, lineMaterial);
};
scene.add(createLine(-4.5)); // Left side line
scene.add(createLine(4.5));  // Right side line
scene.add(createLine(0));    // Center line

// Terrain Generation
const terrainGeometry = new THREE.PlaneGeometry(50, 50, 50, 50);
const terrainMaterial = new THREE.MeshStandardMaterial({ color: 0x8800ff, wireframe: false });
const terrainWireMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
const terrainWireframe = new THREE.Mesh(terrainGeometry, terrainWireMaterial);
terrain.rotation.x = -Math.PI / 2;
terrainWireframe.rotation.x = -Math.PI / 2;
scene.add(terrain);
scene.add(terrainWireframe);

// Apply Perlin noise for terrain height variation
const noise = new ImprovedNoise();
const vertices = terrainGeometry.attributes.position.array;
for (let i = 0; i < vertices.length; i += 3) {
    let x = vertices[i] * 0.1;
    let y = vertices[i + 1] * 0.1;
    let height = noise.noise(x, y, 0) * 2;
    vertices[i + 2] = height;
}
terrainGeometry.computeVertexNormals();
terrainGeometry.attributes.position.needsUpdate = true;

// Function to check if a point is in range of the road
function isInRoadRange(x, z) {
    return Math.abs(x) < 5 && Math.abs(z) < 25; // Road width is 10, centered at x=0
}

// Hide terrain vertices within road range
const terrainVertices = terrainGeometry.attributes.position.array;
for (let i = 0; i < terrainVertices.length; i += 3) {
    if (isInRoadRange(terrainVertices[i], terrainVertices[i + 1])) {
        terrainVertices[i + 2] = -100; // Move below ground level to hide
    }
}
terrainGeometry.attributes.position.needsUpdate = true;

// Create duplicate road and terrain for seamless looping
const roadClone = road.clone();
roadClone.position.z = -50;
scene.add(roadClone);

const terrainClone = terrain.clone();
terrainClone.position.z = -50;
scene.add(terrainClone);
const terrainWireframeClone = terrainWireframe.clone();
terrainWireframeClone.position.z = -50;
scene.add(terrainWireframeClone);

// Interior Model (Basic 3D shapes to simulate a dashboard)
const dashboardGeometry = new THREE.BoxGeometry(3.7, 0.5, 0.5);
const dashboardMaterial = new THREE.MeshStandardMaterial({ color: 0x111100 });
const dashboard = new THREE.Mesh(dashboardGeometry, dashboardMaterial);
dashboard.position.set(2.5, 0.21, 3.6);

const aPillarGeometry = new THREE.BoxGeometry(0.2,2,0.1);
const aPillar = new THREE.Mesh(aPillarGeometry, dashboardMaterial);
aPillar.rotation.z = Math.PI/5;
aPillar.position.set(0.5,1.2,3.8);

const sideDoorGeometry = new THREE.BoxGeometry(0.1,1,1);
const sideDoor = new THREE.Mesh(sideDoorGeometry, dashboardMaterial);
sideDoor.position.set(0.7,-0.1,4);

const neonBtnGeo = new THREE.BoxGeometry(0.03,0.05,0.02);
const neonMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x00ff00,  // Base color (Red)
    emissive: 0x00ff00, // Glowing effect
    emissiveIntensity: 3, // Increase glow brightness
    metalness: 0.8, // Metallic effect
    roughness: 0.3  // Slightly smooth surface
});
const neonGroup = new THREE.Group();
const neonCnt = 5;
const neonspacing = 0.1;
for (let i=0; i<neonCnt; i++){
    const btn = new THREE.Mesh(neonBtnGeo, neonMaterial);
    btn.position.set(1.5 + (i*neonspacing), 0.3, 3.9);
    neonGroup.add(btn);
}
const neonGroup2 = neonGroup.clone();
neonGroup2.position.set(0.9, -0.1,0);
scene.add(neonGroup);
scene.add(neonGroup2);
scene.add(sideDoor);
scene.add(aPillar);
scene.add(dashboard);

const steeringWheelGeometry = new THREE.TorusGeometry(0.5, 0.05, 16, 100);
const steeringWheelMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
const steeringWheel = new THREE.Mesh(steeringWheelGeometry, steeringWheelMaterial);
steeringWheel.position.set(1.3, 0, 3.9);
steeringWheel.rotation.z = -Math.PI / 7;
scene.add(steeringWheel);

// chat
const chatGeo = new THREE.BoxGeometry(0.1,0.1,0.1);
const chat = new THREE.Mesh(chatGeo,neonMaterial);
const scrPos = new THREE.Vector3(2.0,0.51,3.8);
chat.position.copy(scrPos);
scene.add(chat);
scrPos.z += 0.05;
const { screen, ctx, screenTexture } = createScreen(scene,scrPos,0.094,0.094);
setInterval(() => {
    const testText = Math.floor(Math.random()*100);
    updateScreen(ctx,screenTexture, testText);
}, 1000);


// Animation Loop
let speed = 0.1;
function animate() {
    requestAnimationFrame(animate);
    
    // Move the road and terrain backward to simulate motion
    road.position.z += speed;
    roadClone.position.z += speed;
    terrain.position.z += speed;
    terrainClone.position.z += speed;
    terrainWireframe.position.z += speed;
    terrainWireframeClone.position.z += speed;
    
    // Reset position for infinite loop effect
    if (road.position.z > 50) road.position.z -= 100;
    if (roadClone.position.z > 50) roadClone.position.z -= 100;
    if (terrain.position.z > 50) terrain.position.z -= 100;
    if (terrainClone.position.z > 50) terrainClone.position.z -= 100;
    if (terrainWireframe.position.z > 50) terrainWireframe.position.z -= 100;
    if (terrainWireframeClone.position.z > 50) terrainWireframeClone.position.z -= 100;
    
    renderer.render(scene, camera);
}
animate();

// Resize Handler
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

