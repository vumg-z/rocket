import * as THREE from 'three';
import Cube from './cubes/cube';
import CameraController from './camera.js';
import Conector from './cubes/conector';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor( 0x808080 ); // Set to gray
document.body.appendChild(renderer.domElement);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a new connector
const connectorSize = .9; // Connector size
const connectorColor = 0xffffff; // Connector color (in hexadecimal format)
const connectorPosition = { x: 0, y: 0, z: 0 }; // Connector position

const connector = new Conector(connectorSize, connectorColor, connectorPosition);
connector.addToScene(scene);

// Create the first cube
const cube1Size = 1; // Cube size
const cube1Color = 0xff0000; // Cube color (in hexadecimal format)
const cube1Position = { x: 0, y: 0.6, z: 0 }; // Cube position

const cube1 = new Cube(cube1Size, cube1Color, cube1Position);
cube1.addToScene(scene);

// Add the cube to the connector
connector.insertCube(cube1);

// Set the cube's connector property to the connector
cube1.connector = connector;

// Create the second cube
const cube2Size = 1; // Cube size
const cube2Color = 0x00ff00; // Cube color (in hexadecimal format)
const cube2Position = { x: 0, y: -0.6, z: 0 }; // Cube position

const cube2 = new Cube(cube2Size, cube2Color, cube2Position);
cube2.addToScene(scene);

// Add the second cube to the connector
connector.insertCube(cube2);

// Set the second cube's connector property to the connector
cube2.connector = connector;

camera.position.z = 5;

let time = 0;

function animate() {
	time += 0.05; // adjust speed of oscillation

	// Move both cubes up and down between their respective limits
	const deltaY = Math.sin(time) * 0.15;
	cube1.move(0, deltaY, 0);
	cube2.move(0, -deltaY, 0); // we move the second cube in the opposite direction

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
