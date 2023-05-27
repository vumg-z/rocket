import * as THREE from 'three';
import CubeConnectorStructure from './cubes/cubeConnectorStructure.js';
import CameraController from './camera.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x808080); // Set to gray
document.body.appendChild(renderer.domElement);

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);

const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(0, 5, 10);
spotLight.castShadow = true;
scene.add(spotLight);

spotLight.shadow.mapSize.width = 1024; // tamaño de la textura de la sombra
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 0.5; // cuán cerca comienza a proyectarse la sombra
spotLight.shadow.camera.far = 500; // cuán lejos se proyecta la sombra


// Parámetros para los Cubos y el Conector
const cubeSize = 1; // Cube size
const connectorSize = .9; // Connector size

const cube1Color = 0x000000; // Cube color (in hexadecimal format)
const cube2Color = 0x000000; // Cube color (in hexadecimal format)
const connectorColor = 0xffffff; // Connector color (in hexadecimal format)

// Crear una matriz 2x2 de CubeConnectorStructure
const structures = [];

const positions = [
    { x: 0, y: 1.999, z: 0.23931271456177017 },
    { x: 1.0961179061289288, y: 2, z: -0.8602099121356961 },
    { x: 1.0961179061289288, y: 2, z: 0.23931271456177017 },
    { x: -0.0052521226297396195, y: 2, z: -0.8700423185801522 },
];


for (let i = 0; i < positions.length; i++) {
    const connectorPosition = positions[i]; // Posición del Conector
    const cube1Props = { size: cubeSize, color: cube1Color, position: { x: connectorPosition.x, y: connectorPosition.y + 0.6, z: connectorPosition.z } };
    const cube2Props = { size: cubeSize, color: cube2Color, position: { x: connectorPosition.x, y: connectorPosition.y - 0.6, z: connectorPosition.z } };
    const connectorProps = { size: connectorSize, color: connectorColor, position: connectorPosition };
    const structure = new CubeConnectorStructure(cube1Props, cube2Props, connectorProps);
    structure.addToScene(scene);
    structures.push(structure);
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
