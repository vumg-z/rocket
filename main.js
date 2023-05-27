import * as THREE from 'three';
import { OrbitControls } from './OrbitControls.js';

let camera, scene, renderer, controls;

init();
animate();

function init() {
    // Crear la cámara
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(-5.206487822512527, 0.3727371290852184, 20); // Ajustar la posición de la cámara
    const target = new THREE.Vector3(0, 0, 0); // Establecer el punto al que la cámara apunta
    camera.lookAt(target);

    // Crear la escena
    scene = new THREE.Scene();

    // Crear el objeto propulsionZone
    const propulsionZone = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.5, 2),
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    propulsionZone.position.set(0, 0, 0); // Establecer la posición de la zona de propulsión

    // Añadir el objeto propulsionZone a la escena
    scene.add(propulsionZone);

    // Crear el renderizador
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Adjuntar el renderizador al elemento DOM correcto
    const container = document.getElementById('container');
    container.appendChild(renderer.domElement);

    // Crear los controles de la cámara
    controls = new OrbitControls(camera, renderer.domElement);
}

function animate() {
    requestAnimationFrame(animate);

    // Actualizar los controles de la cámara
    controls.update();

    // Renderizar la escena
    renderer.render(scene, camera);
}
