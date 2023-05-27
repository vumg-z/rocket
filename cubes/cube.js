import * as THREE from 'three';

class Cube {
    constructor(size, color, position) {
        // Initialize basic properties
        this.size = size;
        this.color = color;
        this.position = position;

        // This property will hold a reference to the connector this cube is connected to
        this.connector = null;

        // Create a Three.js geometry and material for this cube
        this.geometry = new THREE.BoxGeometry(size, size, size);
        this.material = new THREE.MeshPhongMaterial({
            color: color,
            emissive: 0x000000 // Emissive color is black
        });

        // Create a Three.js mesh using the geometry and material
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        // Set the position of the mesh
        this.mesh.position.set(position.x, position.y, position.z);

        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

    }

    // This method can be used to add the cube to a Three.js scene
    addToScene(scene) {
        scene.add(this.mesh);
    }

    // Method to move the cube
    // Note: This method just changes the position of the cube's mesh. 
    // In a real physics engine, you would need to include collision detection and response.
    move(deltaX, deltaY, deltaZ) {
        if (this.connector) {
            let newY = this.mesh.position.y + deltaY;
            // Check if the cube would still be connected to the connector after this move
            let relativeY = newY - this.connector.mesh.position.y;
            if (relativeY >= -0.9 && relativeY <= -0.6) {
                this.mesh.position.y = newY;
            } else if (relativeY >= 0.6 && relativeY <= 0.9) {
                this.mesh.position.y = newY;
            } else {
                console.log("Cube cannot move beyond connector!");
            }
        } else {
            // If the cube is not connected to a connector, it can move freely
            this.mesh.position.x += deltaX;
            this.mesh.position.y += deltaY;
            this.mesh.position.z += deltaZ;
        }
    }


    // If you need to remove the cube from a scene, you can use this method
    removeFromScene(scene) {
        scene.remove(this.mesh);
        // Dispose of the geometry and material to free up resources
        this.geometry.dispose();
        this.material.dispose();
    }
}

export default Cube;
