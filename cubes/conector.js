import * as THREE from 'three';

class Conector {
    constructor(size, color, position) {
        // Initialize basic properties
        this.size = size;
        this.color = color;
        this.position = position;
        this.contents = []; // This will hold the Cubes that are inside the connector

        // Create a Three.js geometry and material for this connector
        // Note: For now, we'll represent the connector as a simple box like the cube.
        // To create a hollow shape, you might want to use a different geometry,
        // like BoxBufferGeometry with the "thickness" parameter.
        this.geometry = new THREE.BoxGeometry(size, size, size);
        this.material = new THREE.MeshPhongMaterial({
            color: color,
            opacity: 1, // Make it semi-transparent to indicate it's hollow
            transparent: true,
            emissive: 0xffffff // Emissive color is white
        });

        // Create a Three.js mesh using the geometry and material
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        // Set the position of the mesh
        this.mesh.position.set(position.x, position.y, position.z);
    }

    // This method can be used to add the connector to a Three.js scene
    addToScene(scene) {
        scene.add(this.mesh);
    }

    // Method to add a Cube to this connector
    insertCube(cube) {
        if (this.contents.length < 2) {
            this.contents.push(cube);
            // You could also add logic here to physically move the cube into the connector
            // using Three.js methods
        } else {
            console.log("This connector is already full!");
        }
    }

    // Method to remove a Cube from this connector
    removeCube(cube) {
        const index = this.contents.indexOf(cube);
        if (index !== -1) {
            const removedCube = this.contents.splice(index, 1)[0];
            return removedCube;
        } else {
            console.log("Cube not found in connector!");
            return null;
        }
    }

    // If you need to remove the connector from a scene, you can use this method
    removeFromScene(scene) {
        scene.remove(this.mesh);
        // Dispose of the geometry and material to free up resources
        this.geometry.dispose();
        this.material.dispose();
    }
}

export default Conector;
