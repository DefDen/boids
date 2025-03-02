const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;

const num_boids = 1000;

ctx.fillStyle = "blue";

class Boid {

  static size = 3;
  static max_initial_velocity = 5;

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.v = Math.random() * 2 * Boid.max_initial_velocity - (Boid.max_initial_velocity / 2);
    this.r = Math.random() * 2 * Math.PI;
  }

  draw() {
    this.x += this.v * Math.cos(this.r);
    this.y += this.v * Math.sin(this.r);
    this.x = (this.x + width) % width
    this.y = (this.y + height) % height
    ctx.fillRect(this.x, this.y, Boid.size, Boid.size)
  }
}

let boids = [];
for (let i = 0; i < num_boids; i++) {
  boids[i] = new Boid(width / 2, height / 2);
}

window.requestAnimationFrame(draw);

function draw() {
  ctx.clearRect(0, 0, width, height);
  for (let boid of boids) {
    boid.draw();
  }
  window.requestAnimationFrame(draw);
}
