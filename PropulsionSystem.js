import * as THREE from 'three';
import * as CANNON from 'cannon';

export default class PropulsionSimulator extends THREE.Object3D {
  constructor(x = 0, y = 0, z = 0) {
    super();

    // Crear el cubo
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);

    // Configurar la posición
    cube.position.set(x, y, z);

    // Agregar el cubo como hijo de PropulsionSimulator
    this.add(cube);
  }
}
