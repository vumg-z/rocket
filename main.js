import * as THREE from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import CameraController from './camera';

let camera, scene, renderer, cameraController;


init();
animate();

function init() {
    // Crear la cámara
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(-5.206487822512527, 0.3727371290852184, 14.501602931402532);
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
                    // Obtener la posición del objeto cargado (rocket)
                    const rocketPosition = rocket.position.clone();

                    // Añadir el objeto rocket a la escena
                    scene.add(rocket);

                    // Crear un nuevo objeto basado en la posición de rocket
                    const zonePropulsion = new THREE.Mesh(
                        new THREE.BoxGeometry(2, .5, 2),
                        new THREE.MeshBasicMaterial({ color: 0xff0000 })
                    );

                    // Establecer la posición relativa de newObject respecto a rocket
                    zonePropulsion.position.copy(rocketPosition);
                    zonePropulsion.position.y -= -2; // Ajustar la posición en Y
                    zonePropulsion.position.x -= 12; // Ajustar la posición en Y
                    zonePropulsion.position.z -= -5; // Ajustar la posición en Z

                    // Añadir el nuevo objeto a rocket como hijo
                    rocket.add(zonePropulsion);
                },
                function (xhr) {
                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                },
                function (error) {
                    console.log('An error happened');
                }
            );
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

    // Renderizar la escena
    renderer.render(scene, camera);

}
