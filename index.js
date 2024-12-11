// Global vars
let canvas, ctx;
let canvasWidth = 1400;
let canvasHeight = 800;
let keys = [];

document.addEventListener('DOMContentLoaded', setupCanvas);

function setupCanvas() {
  canvas = document.querySelector('canvas');
  ctx = canvas.getContext('2d');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  // Draw black square
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // Check for entered keys
  document.body.addEventListener('keydown', function(e) {
    keys[e.key] = true;
    // console.log(keys);
  });
  document.body.addEventListener('keyup', function(e) {
    keys[e.key] = false;
  });
  render();
}


class Ship {
  constructor() {
    this.visible = true;
    this.x = canvasWidth / 2;
    this.y = canvasHeight / 2;
    this.movingForward = false;
    this.speed = 0.1;
    this.velX = 0;
    this.velY = 0;
    this.rotateSpeed = 1;
    this.radius = 15; // Ship radius
    this.angle = 0;
    this.strokeColor = 'white';
  }

  Rotate(dir) {
    this.angle += this.rotateSpeed * dir;
  }


  update() {
    // converting degrees to radians
    const radians = this.angle * (Math.PI / 180);
    // const radians = this.angle / (Math.PI * 180);
    if (this.movingForward) {
      this.velX += Math.cos(radians) * this.speed;
      this.velY += Math.sin(radians) * this.speed;
    }

    // Ship beyond screen
    if (this.x < this.radius)
      this.x = canvas.width;
    if (this.x > canvas.width)
      this.x = this.radius;
    if (this.y < this.radius)
      this.y = canvas.height;
    if (this.y > canvas.height)
      this.y = this.radius;

    // Slow down, Speed up
    this.velX *= 0.99;
    this.velY *= 0.99;

    // Update position
    this.x -= this.velX;
    this.y -= this.velY;
  }

  draw() {
    ctx.strokeStyle = this.strokeColor;
    ctx.beginPath();
    let vertAngle = (Math.PI * 2) / 3;
    const radians = this.angle * (Math.PI / 180);
    // const radians = this.angle / (Math.PI * 180);
    for (let i = 0; i < 3; i++) {
      const x = this.x - this.radius * Math.cos(i*vertAngle + radians);
      const y = this.y - this.radius * Math.sin(i*vertAngle + radians);
      // console.log(x, y)
      ctx.lineTo(x, y);
    }
    // console.log("_____________")
    ctx.closePath();
    ctx.stroke();
  }
}


const ship = new Ship();
function render() {
  ship.movingForward = keys['w'];
  if (keys['d'])
    ship.Rotate(1);
  if (keys['a'])
    ship.Rotate(-1);
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ship.update()
  ship.draw();
  requestAnimationFrame(render);
}