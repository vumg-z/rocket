import * as THREE from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from './OrbitControls.js';
import PropulsionSimulator from './PropulsionSystem.js';

// Crear la escena
const scene = new THREE.Scene();

// Crear la cámara
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.position.set(0, 0, 50); // Ajustar la posición de la cámara
camera.lookAt(scene.position); // Apuntar la cámara hacia el centro de la escena

// Crear el renderizador
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Crear la luz
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(0, 0, 5);
scene.add(light);

// Crear los controles de órbita
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true; // Habilitar zoom
controls.autoRotate = true; // Habilitar rotación automática

// Crear el objeto "rocket"
const rocket = new THREE.Object3D();

// Cargar el objeto 3D y el material
const objLoader = new OBJLoader();
const mtlLoader = new MTLLoader();
mtlLoader.setPath('rocket/'); // Especifica la ruta de los archivos .mtl y .obj
mtlLoader.load('rocket.mtl', function (materials) {
    materials.preload();
    objLoader.setMaterials(materials);
    objLoader.setPath('rocket/');
    objLoader.load('rocket.obj', function (object) {
        // Agregar el objeto cargado a "rocket"
        rocket.add(object);
    });
});

// Crear una instancia de PropulsionSimulator
const propulsionSimulator = new PropulsionSimulator(-12, 2, 5);

// Agregar PropulsionSimulator como hijo de "rocket"
rocket.add(propulsionSimulator);


// Agregar "rocket" a la escena
scene.add(rocket);

// Llamar a la función de animación
function animate() {
    requestAnimationFrame(animate);

    // Rotar "rocket" en el eje Y
    rocket.rotation.y += 0.01; // Ajusta la velocidad y dirección de la rotación

    renderer.render(scene, camera);
}

// Llamar a la función de animación
animate();
