let turtle = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
  angle: 270,
  size: 48,
  bobT: 0,
};

let turtleColor    = [45, 160, 80];
let turtleShell    = [30, 120, 60];
let turtleHighlight = [70, 200, 110];

export function setTurtleColor(palette) {
  turtleShell     = palette[0];
  turtleColor     = palette[1] || palette[0].map(v => Math.min(255, v + 30));
  turtleHighlight = palette[2] || palette[0].map(v => Math.min(255, v + 60));
}

const heldKeys = new Set();
const stepTimers = {};

export const DIR_ANGLE = {
  'ArrowRight': 0, 'ArrowDown': 90, 'ArrowLeft': 180, 'ArrowUp': 270
};

const STEP = 44;
const STEP_INTERVAL = 150;

export function keyDown(key, canvasWidth, canvasHeight, onMove) {
  if (heldKeys.has(key)) return;
  heldKeys.add(key);
  doStep(key, canvasWidth, canvasHeight, onMove);
  stepTimers[key] = setInterval(() => {
    doStep(key, canvasWidth, canvasHeight, onMove);
  }, STEP_INTERVAL);
}

export function keyUp(key) {
  heldKeys.delete(key);
  clearInterval(stepTimers[key]);
  delete stepTimers[key];
}

function doStep(key, canvasWidth, canvasHeight, onMove) {
  turtle.angle = DIR_ANGLE[key];
  if (key === 'ArrowRight') turtle.x += STEP;
  if (key === 'ArrowLeft')  turtle.x -= STEP;
  if (key === 'ArrowDown')  turtle.y += STEP;
  if (key === 'ArrowUp')    turtle.y -= STEP;

  if (turtle.x > canvasWidth)       turtle.x = 0;
  if (turtle.x < 0)                 turtle.x = canvasWidth;
  if (turtle.y > canvasHeight - 36) turtle.y = 0;
  if (turtle.y < 0)                 turtle.y = canvasHeight - 36;

  if (onMove) onMove(turtle.x, turtle.y);
}

export function updateTurtle() {
  turtle.bobT += 0.004 * 16;
}

export function drawTurtle(ctx) {
  const bob = Math.sin(turtle.bobT) * 2;
  drawTurtleSprite(ctx, turtle.x, turtle.y + bob, turtle.angle, turtle.size);
}

function drawTurtleSprite(ctx, cx, cy, angleDeg, size) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angleDeg * Math.PI / 180);
  const r = size / 2 - 2;

  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fillStyle = `rgb(${turtleShell})`;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, 0, r * 0.82, 0, Math.PI * 2);
  ctx.fillStyle = `rgb(${turtleColor})`;
  ctx.fill();

  for (let i = 0; i < 6; i++) {
    const a = (i * 60) * Math.PI / 180;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(r * 0.52 * Math.cos(a), r * 0.52 * Math.sin(a));
    ctx.strokeStyle = `rgba(${turtleShell[0]},${turtleShell[1]},${turtleShell[2]},0.8)`;
    ctx.lineWidth = Math.max(1, size / 32);
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.arc(0, 0, size / 9, 0, Math.PI * 2);
  ctx.fillStyle = `rgb(${turtleHighlight})`;
  ctx.fill();

  const headX = r * 0.78;
  const headR = size / 9;
  ctx.beginPath();
  ctx.arc(headX, 0, headR, 0, Math.PI * 2);
  ctx.fillStyle = `rgb(${turtleColor})`;
  ctx.fill();

  const eyeR = Math.max(1, size / 22);
  const eyeOff = Math.max(2, size / 16);
  [-1, 1].forEach(sign => {
    ctx.beginPath();
    ctx.arc(headX + eyeOff/2, sign * eyeOff, eyeR, 0, Math.PI*2);
    ctx.fillStyle = '#0a0a0a';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(headX + eyeOff/2 - 1, sign * eyeOff - 1, Math.max(1, eyeR-1), 0, Math.PI*2);
    ctx.fillStyle = 'white';
    ctx.fill();
  });

  [[0.55,0.72],[0.55,-0.72],[-0.65,0.70],[-0.65,-0.70]].forEach(([ox,oy]) => {
    ctx.beginPath();
    ctx.arc(r*ox, r*oy, size/11, 0, Math.PI*2);
    ctx.fillStyle = `rgb(${turtleColor})`;
    ctx.fill();
  });

  ctx.beginPath();
  ctx.arc(-r * 0.88, 0, size/14, 0, Math.PI*2);
  ctx.fillStyle = `rgb(${turtleColor})`;
  ctx.fill();

  ctx.restore();
}