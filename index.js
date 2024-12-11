// Global vars
let canvas, ctx;
let canvasWidth = 1400;
let canvasHeight = 800;
let ship;
let bullets = [];
let asteroids = [];
let keys = [];
let score = 0;
let lives = 3;

document.addEventListener('DOMContentLoaded', setupCanvas);

function setupCanvas() {
  canvas = document.querySelector('canvas');
  ctx = canvas.getContext('2d');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  // Draw black square
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // Create ship
  ship = new Ship();
  for (let i = 0; i < 8; i++) {
    asteroids.push(new Asteroid());
  }
  // Check for entered keys
  document.body.addEventListener('keydown', function(e) {
    keys[e.key] = true;
  });
  document.body.addEventListener('keyup', function(e) {
    keys[e.key] = false;
    if (e.key === ' ') {
      bullets.push(new Bullet(ship.angle));
    }
  });
  render();
}


class Ship {
  constructor() {
    this.visible = true;
    this.x = canvasWidth / 2;
    this.y = canvasHeight / 2;
    this.movingForward = false;
    this.speed = 0.10;
    this.velX = 0;
    this.velY = 0;
    this.rotateSpeed = 2;
    this.radius = 15; // Ship radius
    this.angle = 0;
    this.strokeColor = 'white';
    this.noseX = canvasWidth / 2 + this.radius;
    this.noseY = canvasWidth / 2;
  }
  Rotate(dir) {
    this.angle += this.rotateSpeed * dir;
  }
  update() {
    // converting degrees to radians
    const radians = this.angle * (Math.PI / 180);
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
    this.velX *= 0.98;
    this.velY *= 0.98;

    // Update position
    this.x -= this.velX;
    this.y -= this.velY;
  }
  draw() {
    ctx.strokeStyle = this.strokeColor;
    ctx.beginPath();
    let vertAngle = (Math.PI * 2) / 3;
    const radians = this.angle * (Math.PI / 180);
    this.noseX = this.x - this.radius * Math.cos(radians);
    this.noseY = this.y - this.radius * Math.sin(radians);
    for (let i = 0; i < 3; i++) {
      const x = this.x - this.radius * Math.cos(i*vertAngle + radians);
      const y = this.y - this.radius * Math.sin(i*vertAngle + radians);
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }
}


class Bullet {
  constructor(angle, ) {
    this.visible = true;
    this.x = ship.noseX;
    this.y = ship.noseY;
    this.angle = angle;
    this.width = 4;
    this.height = 4;
    this.speed = 5;
    this.velX = 0;
    this.velY = 0
  }
  update() {
    let radians = this.angle * (Math.PI / 180);
    this.x -= Math.cos(radians) * this.speed;
    this.y -= Math.sin(radians) * this.speed;
  }
  draw() {
    ctx.fillStyle = 'white';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}


class Asteroid {
  constructor(x, y, radius, level, collisionRadius) {
    this.visible = true;
    this.x = x || Math.floor(Math.random() * canvasWidth);
    this.y = y || Math.floor(Math.random() * canvasHeight);
    this.speed = 4;
    this.radius = radius || 50;
    this.angle = Math.floor(Math.random() * 359);
    this.collisionRadius = collisionRadius || 46;
    this.level = level || 1;
  }
  update() {
    let radians = this.angle * (Math.PI / 180);
    this.x += Math.cos(radians) * this.speed;
    this.y += Math.sin(radians) * this.speed;
    // Asteroid beyond screen
    if (this.x < this.radius)
      this.x = canvas.width;
    if (this.x > canvas.width)
      this.x = this.radius;
    if (this.y < this.radius)
      this.y = canvas.height;
    if (this.y > canvas.height)
      this.y = this.radius;
  }
  draw() {
    const radians = this.angle * (Math.PI / 180);
    ctx.beginPath();
    let vertAngle = Math.PI * 2 / 6;
    for (let i = 0; i < 6; i++) {
      const x = this.x - this.radius * Math.cos(i*vertAngle + radians);
      const y = this.y - this.radius * Math.sin(i*vertAngle + radians);
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }
}

function circleCollision(p1x, p1y, r1, p2x, p2y, r2) {
  let radiusSum = r1 + r2;
  let xDiff = p1x - p2x;
  let yDiff = p1y - p2y;
  return (radiusSum > Math.sqrt((xDiff**2 ) + (yDiff**2)));
}

function drawLifeShip() {
  let startX = 1350;
  let startY = 10;
  let points = [[9, 9], [-9, 9]];
  ctx.strokeStyle = 'white';
  for (let i = 0; i < lives; i++) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    for (let j = 0; j < points.length; j++) {
      ctx.lineTo(startX + points[j][0], startY + points[j][1]);
    }
    ctx.closePath();
    ctx.stroke();
    startX -= 30;
  }
}


function render() {
  ship.movingForward = keys['w'];
  if (keys['d'])
    ship.Rotate(1);
  if (keys['a'])
    ship.Rotate(-1);
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.fillStyle = 'white';
  ctx.font = '21px Arial'
  ctx.fillText('SCORE: ' + score.toString(), 20, 35)
  if (lives <= 0) {
    ship.visible = false;
    ctx.font = '50px Arial';
    ctx.fillText('GAME OVER', canvasWidth/2 - 150, canvasHeight/2)
  }
  drawLifeShip();
  if (asteroids.length !== 0) {
    for (let i = 0; i < asteroids.length; i++) {
      if (circleCollision(ship.x, ship.y, 11, asteroids[i].x, asteroids[i].y,
                          asteroids[i].collisionRadius)) {
        ship.x = canvasWidth / 2;
        ship.y = canvasHeight / 2;
        ship.VelX = 0;
        ship.velY = 0;
        lives -= 1;
      }
    }
  }
  if (asteroids.length !== 0 && bullets.length != 0) {
    loop1:
    for (let l = 0; l < asteroids.length; l++) {
      for (let m = 0; m < bullets.length; m++) {
        if (circleCollision(bullets[m].x, bullets[m].y, 3,
          asteroids[l].x, asteroids[l].y, asteroids[l].collisionRadius)) {
          if (asteroids[l].level === 1) {
            asteroids.push(new Asteroid(asteroids[l].x - 5, asteroids[l].y - 5, 25, 2, 22));
            asteroids.push(new Asteroid(asteroids[l].x + 5, asteroids[l].y + 5, 25, 2, 22));
          } else if (asteroids[l].level === 2) {
            asteroids.push(new Asteroid(asteroids[l].x - 5, asteroids[l].y - 5, 15, 3, 12));
            asteroids.push(new Asteroid(asteroids[l].x + 5, asteroids[l].y + 5, 15, 3, 12));
      }
      asteroids.splice(l,1);
      bullets.splice(m,1);
      score += 20;

      break loop1;
      }
    }
  }
}
  if (ship.visible) {
    ship.update()
    ship.draw();
  }
  if (bullets.length !== 0) {
    for (let i = 0; i < bullets.length; i++) {
      bullets[i].update();
      bullets[i].draw();
    }
  }
  if (asteroids.length !== 0) {
    for (let i = 0; i < asteroids.length; i++) {
      asteroids[i].update();
      asteroids[i].draw(i);
    }
  }
  requestAnimationFrame(render);
}