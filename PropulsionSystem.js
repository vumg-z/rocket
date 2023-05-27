import * as THREE from 'three';
import * as CANNON from 'cannon';

export default class PropulsionSimulator extends THREE.Object3D {
    constructor(scene, rocket) {
        super();
        this.scene = scene;
        this.world = new CANNON.World();
        this.propulsionZoneBody = null;
        this.boxBodies = [];
        this.rocket = rocket;
        this.rocketPosition = new THREE.Vector3();
        this.rocketQuaternion = new THREE.Quaternion();
        this.init();
    }

    init() {
        // Crear el objeto propulsionZone
        const propulsionZone = new THREE.Mesh(
            new THREE.BoxGeometry(2, 0.5, 2),
            new THREE.MeshBasicMaterial({ color: 0xff0000 })
        );
        propulsionZone.position.copy(this.position); // Establecer la posición de la zona de propulsión para coincidir con la posición del PropulsionSimulator

        // Añadir el objeto propulsionZone a la escena
        this.add(propulsionZone);

        // Configurar el mundo físico
        this.world = new CANNON.World();
        this.world.gravity.set(0, -9.82, 0); // Gravedad en la dirección -y

        // Configurar cuerpo físico de propulsionZone
        this.propulsionZoneBody = new CANNON.Body({
            mass: 0, // mass == 0 hace que el cuerpo sea estático
            position: new CANNON.Vec3(this.position.x, this.position.y, this.position.z),
            shape: new CANNON.Box(new CANNON.Vec3(1, 0.25, 1)) // los parámetros son la mitad de los tamaños en x, y, z
        });
        this.world.addBody(this.propulsionZoneBody);

        // Crear y añadir cuerpos de caja justo debajo de la posición de generación
        for (let i = 0; i < 10; i++) {
            this.createBoxAtRandomPosition();
        }
    }

    createBoxAtRandomPosition() {
        const box = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.5, 0.5),
            new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        );
        const randomX = Math.random() * 2 - 1;
        const randomZ = Math.random() * 2 - 1;
        box.position.copy(this.position).add(new THREE.Vector3(randomX, -0.25, randomZ));
        this.scene.add(box);

        const boxBody = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(box.position.x, box.position.y, box.position.z),
            shape: new CANNON.Box(new CANNON.Vec3(0.25, 0.25, 0.25))
        });

        this.world.addBody(boxBody);
        this.boxBodies.push({ threeObject: box, cannonBody: boxBody });

        console.log('Box created at:', box.position.x, box.position.y, box.position.z); // Imprimir posición de la caja
    }

    updateRocketPosition() {
        this.rocketPosition.copy(this.rocket.position);
        this.rocketQuaternion.copy(this.rocket.quaternion);
    }

    animate() {
        // Avanzar la simulación física
        this.world.step(1 / 60);

        // Actualizar posiciones y rotaciones de los cubos en Three.js para coincidir con Cannon.js
        for (let box of this.boxBodies) {
            const boxPositionRelativeToRocket = box.cannonBody.position.clone().vadd(this.position);
            box.threeObject.position.copy(boxPositionRelativeToRocket);
            box.threeObject.quaternion.copy(box.cannonBody.quaternion);
        }

        // Imprimir posición del cohete
        console.log('Rocket position:', this.rocket.position.x, this.rocket.position.y, this.rocket.position.z);

        // Rotar la zona de propulsión junto con el cohete
        this.rotation.y += 0.01;

        // Generar más cajas de forma continua justo debajo de la posición del cohete
        if (this.boxBodies.length < 100) {
            this.createBoxAtRandomPosition();
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
    }

    start() {
        this.init();
    }
}
