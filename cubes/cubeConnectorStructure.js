import Cube from './cubes/cube';
import Conector from './cubes/conector';

class CubeConnectorStructure {
  constructor(cube1Props, cube2Props, connectorProps) {
    // Crear el Conector
    this.connector = new Conector(connectorProps.size, connectorProps.color, connectorProps.position);

    // Crear los Cubos con la posición relativa al Conector
    const connectorY = this.connector.mesh.position.y;
    this.cube1 = new Cube(cube1Props.size, cube1Props.color, { x: 0, y: connectorY + 0.6, z: 0 });
    this.cube2 = new Cube(cube2Props.size, cube2Props.color, { x: 0, y: connectorY - 0.6, z: 0 });

    // Conectar los Cubos con el Conector
    this.connector.insertCube(this.cube1);
    this.connector.insertCube(this.cube2);
    this.cube1.connector = this.connector;
    this.cube2.connector = this.connector;
  }

  addToScene(scene) {
    // Añadir los Cubos y el Conector a la escena
    this.cube1.addToScene(scene);
    this.cube2.addToScene(scene);
    this.connector.addToScene(scene);
  }

  moveCubes(deltaY) {
    // Mover los Cubos
    this.cube1.move(0, deltaY, 0);
    this.cube2.move(0, -deltaY, 0);
  }

  removeFromScene(scene) {
    // Remover los Cubos y el Conector de la escena
    this.cube1.removeFromScene(scene);
    this.cube2.removeFromScene(scene);
    this.connector.removeFromScene(scene);
  }
}

export default CubeConnectorStructure;
