// camera.js
class CameraController {
    constructor(camera, domElement) {
      this.camera = camera;
      this.domElement = domElement;
  
      // Variables para el control del arrastre del mouse
      this.isDragging = false;
      this.previousMousePosition = { x: 0, y: 0 };
  
      // Variables para el control de teclas
      this.keyState = {};
  
      // Añadir eventos para el control del arrastre del mouse
      this.domElement.addEventListener('mousedown', this.onMouseDown.bind(this));
      this.domElement.addEventListener('mouseup', this.onMouseUp.bind(this));
      this.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
  
      // Añadir eventos para el control de las teclas
      document.addEventListener('keydown', this.onKeyDown.bind(this));
      document.addEventListener('keyup', this.onKeyUp.bind(this));
    }
  
    onMouseDown(event) {
      this.isDragging = true;
      this.previousMousePosition.x = event.clientX;
      this.previousMousePosition.y = event.clientY;
    }
  
    onMouseUp() {
      this.isDragging = false;
    }
  
    onMouseMove(event) {
      if (!this.isDragging) return;
  
      const delta = {
        x: event.clientX - this.previousMousePosition.x,
        y: event.clientY - this.previousMousePosition.y
      };
  
      // Rotar la cámara en base al arrastre del mouse
      this.camera.rotation.y += delta.x * 0.01;
      this.camera.rotation.x += delta.y * 0.01;
  
      this.previousMousePosition.x = event.clientX;
      this.previousMousePosition.y = event.clientY;
    }
  
    onKeyDown(event) {
      this.keyState[event.key] = true;
    }
  
    onKeyUp(event) {
      this.keyState[event.key] = false;
    }
  
    update() {
      const moveDistance = 0.1; // La distancia que se moverá la cámara en cada paso
      const rotationSpeed = 0.05; // La velocidad de rotación de la cámara
  
      if (this.keyState['ArrowUp'] || this.keyState['w']) {
        // Mover hacia adelante
        this.camera.translateZ(-moveDistance);
      }
      if (this.keyState['ArrowDown'] || this.keyState['s']) {
        // Mover hacia atrás
        this.camera.translateZ(moveDistance);
      }
      if (this.keyState['ArrowLeft'] || this.keyState['a']) {
        // Rotar hacia la izquierda
        this.camera.rotation.y -= rotationSpeed;
      }
      if (this.keyState['ArrowRight'] || this.keyState['d']) {
        // Rotar hacia la derecha
        this.camera.rotation.y += rotationSpeed;
      }
    }
  }
  
  export default CameraController;
  