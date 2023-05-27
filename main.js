import * as THREE from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import CameraController from './camera';
import PropulsionSimulator from './PropulsionSystem.js';

let camera, scene, renderer, cameraController;
let zonePropulsion;  // Variable global para mantener una referencia a zonePropulsion
let rocketLoaded;

init();
animate();

function init() {
    // Crear la cámara
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(-5.206487822512527, 0.3727371290852184, 40.501602931402532);
    const euler = new THREE.Euler(0, 0.5499999999999999, 0, 'XYZ');
    camera.setRotationFromEuler(euler);

    // Crear la escena
    scene = new THREE.Scene();

    // Crear el loader de MTLLoader
    const mtlLoader = new MTLLoader();

    // Cargar el archivo .mtl y el archivo .obj
    mtlLoader.load(
        // URL del archivo .mtl
        'rocket/rocket.mtl',
        function (materials) {
            materials.preload();

            // Crear el loader de OBJLoader
            const objLoader = new OBJLoader();

            // Asignar los materiales cargados al loader de OBJLoader
            objLoader.setMaterials(materials);

            // Cargar el archivo .obj
            objLoader.load(
                // URL del archivo .obj
                'rocket/rocket.obj',
                function (rocket) {
                    rocketLoaded = rocket;
                    // Añadir el objeto rocket a la escena
                    scene.add(rocketLoaded);

                    // Crear un nuevo objeto Propulsion system basado en la posición del cohete
                    zonePropulsion = new PropulsionSimulator(scene, rocket);

                    // ...

                    zonePropulsion.start(); // Llamar al método start() en PropulsionSimulator
                },
                function (xhr) {
                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                },
                function (error) {
                    console.log('An error happened');
                    console.log(error);
                }
            );

            // ...


            // ...


        }
    );

    // Agregar luz ambiental
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Agregar luz direccional
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Crear el renderizador
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Adjuntar el renderizador al elemento DOM correcto
    const container = document.getElementById('container');
    container.appendChild(renderer.domElement);

    // Crear el controlador de cámara
    cameraController = new CameraController(camera, container);
}

function animate() {
    requestAnimationFrame(animate);

    // Actualizar el controlador de cámara
    cameraController.update();

    // Actualizar la simulación de propulsión, si ha sido inicializada
    if (zonePropulsion) {
        zonePropulsion.updateRocketPosition(rocketLoaded); // Actualizar la posición y la rotación del cohete
        zonePropulsion.animate(); // Llamar al método animate() en PropulsionSimulator
    }

    if (rocketLoaded) {
        rocketLoaded.rotation.y += 0.01;
    }

    // Renderizar la escena
    renderer.render(scene, camera);
}

