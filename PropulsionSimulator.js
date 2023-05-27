import * as THREE from 'three';
import * as CANNON from 'cannon';

export default class PropulsionSimulator {
    constructor(scene) {
        this.scene = scene;
        this.world = new CANNON.World();
        this.propulsionZoneBody = null;
        this.boxBodies = [];
    }

    init() {
        // Crear el objeto propulsionZone
        const propulsionZone = new THREE.Mesh(
            new THREE.BoxGeometry(2, 0.5, 2),
            new THREE.MeshBasicMaterial({ color: 0xff0000 })
        );
        propulsionZone.position.set(0, 0, 0); // Establecer la posición de la zona de propulsión

        // Añadir el objeto propulsionZone a la escena
        this.scene.add(propulsionZone);

        // Configurar el mundo físico
        this.world = new CANNON.World();
        this.world.gravity.set(0, -9.82, 0); // Gravedad en la dirección -y

        // Crear la referencia de la posición de generación de las cajas
        const boxGenerationPosition = new THREE.Vector3(0, -0.25, 0);

        // Configurar cuerpo físico de propulsionZone
        this.propulsionZoneBody = new CANNON.Body({
            mass: 0, // mass == 0 hace que el cuerpo sea estático
            position: new CANNON.Vec3(propulsionZone.position.x, propulsionZone.position.y, propulsionZone.position.z),
            shape: new CANNON.Box(new CANNON.Vec3(1, 0.25, 1)) // los parámetros son la mitad de los tamaños en x, y, z
        });
        this.world.addBody(this.propulsionZoneBody);

        // Crear y añadir cuerpos de caja justo debajo de la posición de generación
        for (let i = 0; i < 10; i++) {
            this.createBoxAtPosition(boxGenerationPosition.x, boxGenerationPosition.y, boxGenerationPosition.z);
        }
    }

    // Función para crear una caja en una posición específica
    createBoxAtPosition(x, y, z) {
        let box = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.5, 0.5),
            new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        );
        box.position.set(x + (Math.random() * 2 - 1), y, z + (Math.random() * 2 - 1)); // Posiciones aleatorias alrededor de la posición dada
        this.scene.add(box);

        let boxBody = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(box.position.x, box.position.y, box.position.z),
            shape: new CANNON.Box(new CANNON.Vec3(0.25, 0.25, 0.25))
        });
        this.world.addBody(boxBody);
        this.boxBodies.push({ threeObject: box, cannonBody: boxBody });
    }



    // ...
    animate(renderer, camera) {
        // Avanzar la simulación física
        this.world.step(1 / 60);

        // Actualizar posiciones de los cuadros en Three.js para coincidir con Cannon.js
        for (let box of this.boxBodies) {
            box.threeObject.position.copy(box.cannonBody.position);
            box.threeObject.quaternion.copy(box.cannonBody.quaternion);
        }

        // Generar más cajas de forma continua justo debajo de la posición de generación
        if (this.boxBodies.length < 100) {
            this.createBoxAtPosition(0, -0.25, 0);
        }

        // Eliminar cajas que están por debajo de una cierta distancia
        const distanceThreshold = -10;
        for (let i = this.boxBodies.length - 1; i >= 0; i--) {
            if (this.boxBodies[i].threeObject.position.y < distanceThreshold) {
                this.scene.remove(this.boxBodies[i].threeObject);
                this.world.remove(this.boxBodies[i].cannonBody);
                this.boxBodies.splice(i, 1);
            }
        }

        // Renderizar la escena
        renderer.render(this.scene, camera);
    }

    start() {
        this.init();
        this.animate();
    }
}
