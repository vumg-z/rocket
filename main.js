import * as THREE from 'three';
import { OrbitControls } from './OrbitControls.js';
import PropulsionSimulator from './PropulsionSimulator.js';

let camera, scene, renderer, controls, propulsionSimulator;

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

    // Iniciar el simulador de propulsión
    propulsionSimulator = new PropulsionSimulator(scene);
    propulsionSimulator.init();
}

function animate() {
    requestAnimationFrame(animate);

    // Actualizar los controles de la cámara
    controls.update();

    // Avanzar la simulación del simulador de propulsión
    propulsionSimulator.animate(renderer, camera);

    // Renderizar la escena
    renderer.render(scene, camera);
}
