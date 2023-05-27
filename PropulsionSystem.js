import * as THREE from 'three';
import * as CANNON from 'cannon';
import { OrbitControls } from './OrbitControls.js';

let camera, scene, renderer, controls;
let world, propulsionSystem;

class PropulsionSystem {
    constructor(world, position, boxLimit) {
        this.world = world;
        this.position = position.clone();
        this.boxLimit = boxLimit;
        this.boxBodies = [];
    }

    createBox() {
        if (this.boxBodies.length >= this.boxLimit) return;

        let box = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.5, 0.5),
            new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        );
        box.position.set(
            this.position.x + (Math.random() * 2 - 1), 
            this.position.y, 
            this.position.z + (Math.random() * 2 - 1)
        );
        scene.add(box);

        let boxBody = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(box.position.x, box.position.y, box.position.z),
            shape: new CANNON.Box(new CANNON.Vec3(0.25, 0.25, 0.25))
        });
        this.world.addBody(boxBody);
        this.boxBodies.push({threeObject: box, cannonBody: boxBody});
    }

    update() {
        const distanceThreshold = -10;
        for (let i = this.boxBodies.length - 1; i >= 0; i--) {
            if (this.boxBodies[i].threeObject.position.y < distanceThreshold) {
                scene.remove(this.boxBodies[i].threeObject);
                this.world.remove(this.boxBodies[i].cannonBody);
                this.boxBodies.splice(i, 1);
            } else {
                this.boxBodies[i].threeObject.position.copy(this.boxBodies[i].cannonBody.position);
                this.boxBodies[i].threeObject.quaternion.copy(this.boxBodies[i].cannonBody.quaternion);
            }
        }
        this.createBox();
    }
}

function init() {
    // Crear la cámara
    // ...

    // Crear la escena
    // ...

    // Crear el renderizador
    // ...

    // Crear los controles de la cámara
    // ...

    // Configurar el mundo físico
    world = new CANNON.World();
    world.gravity.set(0, -9.82, 0); // Gravedad en la dirección -y

    // Crear el sistema de propulsión
    const rocketPosition = new THREE.Vector3(0, -0.25, 0);
    propulsionSystem = new PropulsionSystem(world, rocketPosition, 100);
}

function animate() {
    requestAnimationFrame(animate);

    // Actualizar los controles de la cámara
    // ...

    // Avanzar la simulación física
    world.step(1 / 60); 

    // Actualizar el sistema de propulsión
    propulsionSystem.update();

    // Renderizar la escena
    renderer.render(scene, camera);
}

init();
animate();
