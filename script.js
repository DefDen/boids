const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;

const num_boids = 10;
const detection_radius = 50;

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
    let closest_x = 0;
    let closest_y = 0;
    let num = 0;
    for (let boid of neighbors) {
      if (Math.pow(Math.pow(boid.x - this.x, 2) + Math.pow(boid.y - this.y), 1 / 2) < detection_radius) {
        avg_x += boid.x;
        avg_y += boid.y;
        avg_dx += boid.dx;
        avg_dy += boid.dy;
        closest_x = Math.min(closest_x, boid.x);
        closest_y = Math.min(closest_y, boid.y);
        num++;
      }
    }
    if (num > 0) {
      avg_x /= num;
      avg_y /= num;
      avg_dx /= num;
      avg_dy /= num;
      this.dx = this.dx / 4 + avg_dx * 3 / 4;
      this.dy = this.dy / 4 + avg_dy * 3 / 4;
      console.log(avg_x, avg_y)
      /*
      this.dx += detection_distance - (closest_x - this.x);
      this.dy += detection_distance - (closest_y - this.y);
      */
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
  let x = width / 2;
  let y = height / 2;
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
