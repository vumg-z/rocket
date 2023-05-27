import * as THREE from 'three';
import { OrbitControls } from './OrbitControls.js';
import * as CANNON from 'cannon';
let world, propulsionZoneBody, boxBodies = [];


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

    // Configurar el mundo físico
    world = new CANNON.World();
    world.gravity.set(0, -9.82, 0); // Gravedad en la dirección -y

    // Crear la referencia de la posición de generación de las cajas
    const boxGenerationPosition = new THREE.Vector3(0, -0.25, 0);

    // Configurar cuerpo físico de propulsionZone
    propulsionZoneBody = new CANNON.Body({
        mass: 0, // mass == 0 hace que el cuerpo sea estático
        position: new CANNON.Vec3(propulsionZone.position.x, propulsionZone.position.y, propulsionZone.position.z),
        shape: new CANNON.Box(new CANNON.Vec3(1, 0.25, 1)) // los parámetros son la mitad de los tamaños en x, y, z
    });
    world.addBody(propulsionZoneBody);

    // Crear y añadir cuerpos de caja justo debajo de la posición de generación
    for (let i = 0; i < 10; i++) {
        createBoxAtPosition(boxGenerationPosition.x, boxGenerationPosition.y, boxGenerationPosition.z);
    }
}

// Función para crear una caja en una posición específica
function createBoxAtPosition(x, y, z) {
    let box = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.5, 0.5),
        new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    );
    box.position.set(x + (Math.random() * 2 - 1), y, z + (Math.random() * 2 - 1)); // Posiciones aleatorias alrededor de la posición dada
    scene.add(box);

    let boxBody = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(box.position.x, box.position.y, box.position.z),
        shape: new CANNON.Box(new CANNON.Vec3(0.25, 0.25, 0.25))
    });
    world.addBody(boxBody);
    boxBodies.push({ threeObject: box, cannonBody: boxBody });
}

function animate() {
    requestAnimationFrame(animate);

    // Actualizar los controles de la cámara
    controls.update();

    // Avanzar la simulación física
    world.step(1 / 60); // El argumento es el tiempo en segundos desde la última vez que se llamó a world.step

    // Actualizar posiciones de los cuadros en Three.js para coincidir con Cannon.js
    for (let box of boxBodies) {
        box.threeObject.position.copy(box.cannonBody.position);
        box.threeObject.quaternion.copy(box.cannonBody.quaternion);
    }

    // Generar más cajas de forma continua justo debajo de la posición de generación
    if (boxBodies.length < 100) { // Limitar el número total de cajas para evitar el agotamiento de recursos
        createBoxAtPosition(0, -0.25, 0);
    }

    // Eliminar cajas que están por debajo de una cierta distancia
    const distanceThreshold = -10; // Ajusta esto a la distancia que desees
    for (let i = boxBodies.length - 1; i >= 0; i--) {
        if (boxBodies[i].threeObject.position.y < distanceThreshold) {
            // Eliminar de la escena Three.js
            scene.remove(boxBodies[i].threeObject);
            // Eliminar del mundo Cannon.js
            world.remove(boxBodies[i].cannonBody);
            // Eliminar de la lista boxBodies
            boxBodies.splice(i, 1);
        }
    }


    // Renderizar la escena
    renderer.render(scene, camera);
}
