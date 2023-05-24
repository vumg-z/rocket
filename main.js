import * as THREE from 'three';
import CubeConnectorStructure from './CubeConnectorStructure';
import CameraController from './camera.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x808080); // Set to gray
document.body.appendChild(renderer.domElement);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Parámetros para los Cubos y el Conector
const cubeSize = 1; // Cube size
const connectorSize = .9; // Connector size

const cube1Color = 0xff0000; // Cube color (in hexadecimal format)
const cube2Color = 0x00ff00; // Cube color (in hexadecimal format)
const connectorColor = 0xffffff; // Connector color (in hexadecimal format)

// Crear una matriz 2x2 de CubeConnectorStructure
const structures = [];
for (let i = 0; i < 2; i++) {
  for (let j = 0; j < 2; j++) {
    const connectorPosition = { x: i * 3, y: j * 3, z: 0 }; // Posición del Conector
    const cube1Props = { size: cubeSize, color: cube1Color, position: { x: connectorPosition.x, y: connectorPosition.y + 0.6, z: connectorPosition.z } };
    const cube2Props = { size: cubeSize, color: cube2Color, position: { x: connectorPosition.x, y: connectorPosition.y - 0.6, z: connectorPosition.z } };
    const connectorProps = { size: connectorSize, color: connectorColor, position: connectorPosition };
    const structure = new CubeConnectorStructure(cube1Props, cube2Props, connectorProps);
    structure.addToScene(scene);
    structures.push(structure);
  }
}


camera.position.z = 5;

let time = 0;

function animate() {
  time += 0.05; // adjust speed of oscillation

  // Move both cubes up and down between their respective limits
  const deltaY = Math.sin(time) * 0.15;

  for (let structure of structures) {
    structure.moveCubes(deltaY);
  }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

// Create an instance of CameraController and pass it the camera and the DOM element
const cameraController = new CameraController(camera, renderer.domElement);

// Render the scene
function render() {
  cameraController.update(); // Update the camera movement
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();
