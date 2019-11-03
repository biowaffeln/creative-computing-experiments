/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const { sqrt, sin, cos } = Math;
const TAU = Math.PI * 2;
let width, height;

const init = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  width = canvas.width;
  height = canvas.height;
  ctx.fillStyle = "#fff";
};
init();
window.onresize = init;

const drawPoint = ({ x, y, scale }) => {
  ctx.beginPath();
  ctx.fillRect(x, y, scale, scale);
};

const clear = () => {
  ctx.clearRect(0, 0, width, height);
};

const rotateX = (p, theta) => {
  const { y, z } = p;
  p.y = y * cos(theta) + z * sin(theta);
  p.z = y * -sin(theta) + z * cos(theta);
};

const rotateY = (p, theta) => {
  const { x, z } = p;
  p.x = x * cos(theta) + z * sin(theta);
  p.z = x * -sin(theta) + z * cos(theta);
};

const points = [];

/* sphere */
for (let i = -10; i < 10; i += 0.3) {
  for (let j = 0; j < TAU; j += 0.05) {
    points.push({
      x: cos(j) * sqrt(10 - i ** 2) * 50,
      y: sin(j) * sqrt(10 - i ** 2) * 50,
      z: i * 50,
    });
  }
}

/* plane */
for (let j = -100; j < 100; j += 5) {
  for (let i = -100; i < 100; i += 5) {
    points.push({
      x: i,
      y: j,
      z: 0,
    });
  }
}

/*
  making the fov really small creates the
  cool distortion effect
*/
const fov = 20;
let xRotation = 0.0;
let yRotation = 0.0;

function draw() {
  clear();

  for (p of points) {
    /* rotate every point */
    rotateX(p, xRotation);
    rotateY(p, yRotation);

    /* draw with perspective */
    const scale = fov / (fov + p.z);
    drawPoint({
      x: p.x * scale + width / 2,
      y: p.y * scale + height / 2,
      scale,
    });
  }
  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);

canvas.addEventListener("mousemove", e => {
  const rect = canvas.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;

  xRotation = -(y - height / 2) / 50000;
  yRotation = -(x - width / 2) / 50000;
});
