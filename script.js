const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;

const num_boids = 20;
const detection_radius = 100;
const alignment_rate = 0.01;
const separation_rate = 0.5;
const cohesion_rate = 0.005;

ctx.fillStyle = "blue";

class Boid {

  static size = 15;
  static max_initial_velocity = 5;

  constructor(x, y) {
    this.x = x;
    this.y = y;
    let v = Math.random() * Boid.max_initial_velocity;
    let r = Math.random() * 2 * Math.PI;
    this.dx = v * Math.cos(r);
    this.dy = v * Math.sin(r);
  }

  update(neighbors) {
    let avg_x = 0;
    let avg_y = 0;
    let avg_dx = 0;
    let avg_dy = 0;
    let separation_x = 0;
    let separation_y = 0;
    let num = 0;
    for (let boid of neighbors) {
      if (boid === this) {
        continue;
      }
      if (Math.pow(Math.pow(boid.x - this.x, 2) + Math.pow(boid.y - this.y, 2), 1 / 2) < detection_radius) {
        avg_x += boid.x;
        avg_y += boid.y;
        avg_dx += boid.dx;
        avg_dy += boid.dy;
        if (boid.x === this.x) {
          separation_x += 1.5;
        } else {
          separation_x += 1 / (boid.x - this.x)
        }
        if (boid.y === this.y) {
          separation_y += 1.5;
        } else {
          separation_y += 1 / (boid.y - this.y)
        }
        num++;
      }
    }
    console.log(num);
    if (num > 0) {
      avg_x /= num;
      avg_y /= num;
      avg_dx /= num;
      avg_dy /= num;
      separation_x /= num;
      separation_y /= num;
      this.dx = this.dx * (1 - alignment_rate) + avg_dx * alignment_rate;
      this.dy = this.dy * (1 - alignment_rate) + avg_dy * alignment_rate;
      this.dx += separation_rate * separation_x;
      this.dy += separation_rate * separation_y;
      this.dx -= cohesion_rate * (this.x - avg_x);
      this.dy -= cohesion_rate * (this.y - avg_y);
    }
    this.x = (this.x + this.dx + width) % width;
    this.y = (this.y + this.dy + height) % height;
  }

  draw() {
    let r = Math.atan2(this.dy, this.dx);
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    r += 3 * Math.PI / 4
    ctx.lineTo(this.x + Boid.size * Math.cos(r), this.y + Boid.size * Math.sin(r));
    r += Math.PI / 2
    ctx.lineTo(this.x + Boid.size * Math.cos(r), this.y + Boid.size * Math.sin(r));
    ctx.fill();
  }
}

function addToGrid(b, g) {
  let x = b.x;
  let y = b.y;
  if (!g.includes(Math.floor(x / detection_radius))) {
    g[Math.floor(x / detection_radius)] = [];
  }
  if (!g[Math.floor(x / detection_radius)].includes(Math.floor(y / detection_radius))) {
    g[Math.floor(x / detection_radius)][Math.floor(y / detection_radius)] = [];
  }
  g[Math.floor(x / detection_radius)][Math.floor(y / detection_radius)].push(b);
}

const boids = [];
let grid = [];
let next_grid = [];
for (let i = 0; i < num_boids; i++) {
  let x = Math.random() * width;
  let y = Math.random() * height;
  boids[i] = new Boid(x, y);
  addToGrid(boids[i], grid);
}

window.requestAnimationFrame(draw);

function draw() {
  ctx.clearRect(0, 0, width, height);
  for (let boid of boids) {
    //boid.update(grid[Math.floor(boid.x / detection_radius)][Math.floor(boid.y / detection_radius)]);
    boid.update(boids);
    addToGrid(boid, next_grid);
  }
  for (let boid of boids) {
    boid.draw();
  }
  grid = next_grid;
  next_grid = [];
  window.requestAnimationFrame(draw);
}
