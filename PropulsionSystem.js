import * as THREE from 'three';
import * as CANNON from 'cannon';

export default class PropulsionSimulator extends THREE.Object3D {
  constructor(x = 0, y = 0, z = 0) {
    super();

    // Crear el cubo verde
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);

    // Configurar la posición del cubo verde con los valores proporcionados
    cube.position.set(x, y, z);

    // Agregar el cubo verde como hijo de PropulsionSimulator
    this.add(cube);

    // Crear el cubo blanco
    const whiteCube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );

    // Configurar la posición del cubo blanco relativa al padre
    whiteCube.position.set(0, -1, 0);
    
    // Agregar el cubo blanco como hijo de PropulsionSimulator
    cube.add(whiteCube);
  }
}
