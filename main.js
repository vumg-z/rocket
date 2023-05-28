import * as THREE from 'three';
import { OrbitControls } from './OrbitControls.js';
import PropulsionSimulator from './PropulsionSimulator.js';

let camera, scene, renderer, controls, propulsionZone, propulsionSimulator;
let upKeyPressed = false;

init();
animate();

function init() {
    // Crear la cámara
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(-5.206487822512527, 0.3727371290852184, 20); 
    const target = new THREE.Vector3(0, 0, 0); 
    camera.lookAt(target);

    // Crear la escena
    scene = new THREE.Scene();

    // Crear el renderizador
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Adjuntar el renderizador al elemento DOM correcto
    const container = document.getElementById('container');
    container.appendChild(renderer.domElement);

    // Crear los controles de la cámara
    controls = new OrbitControls(camera, renderer.domElement);

    // Crear la zona de propulsión
    propulsionZone = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.5, 2),
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    propulsionZone.position.set(0, 0, 0);
    scene.add(propulsionZone);

    // Iniciar el simulador de propulsión
    propulsionSimulator = new PropulsionSimulator(scene, propulsionZone);
    propulsionSimulator.init();

    // Agregar eventos de teclado para los controles de movimiento hacia arriba
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
}

function handleKeyDown(event) {
    if (event.code === 'ArrowUp') {
        upKeyPressed = true;
    }
}

function handleKeyUp(event) {
    if (event.code === 'ArrowUp') {
        upKeyPressed = false;
    }
}

function animate() {
    requestAnimationFrame(animate);

    if (upKeyPressed) {
        propulsionZone.position.y += 0.1;
    }

    propulsionSimulator.animate(renderer, camera);
    controls.update();
    renderer.render(scene, camera);
}

