let spinnerOn = false;
let spinnerAngle = 0;
let spinnerSpeed = 2;
const FRICTION = 0.988;
const MIN_SPEED = 0.6;
const MAX_SPEED = 40;

let spinnerColors = [
  [[255,110,160],[255,180,210]],
  [[100,190,255],[180,230,255]],
  [[120,240,160],[200,255,220]],
];

export function setSpinnerColors(palette) {
  const cols = palette.slice(0, 3);
  spinnerColors = cols.map(c => [c, c.map(v => Math.min(255, v + 60))]);
}

function drawSpinnerArm(ctx, cx, cy, angleDeg, colors) {
  const angleRad = angleDeg * Math.PI / 180;
  const r = 55, ballR = 18;
  const tx = cx + r * Math.cos(angleRad);
  const ty = cy + r * Math.sin(angleRad);
  const [main, shine] = colors;
  const perp = angleRad + Math.PI / 2;
  const rootW = 10, tipW = 3;

  ctx.beginPath();
  ctx.moveTo(cx + rootW*Math.cos(perp), cy + rootW*Math.sin(perp));
  ctx.lineTo(cx - rootW*Math.cos(perp), cy - rootW*Math.sin(perp));
  ctx.lineTo(tx - tipW*Math.cos(perp), ty - tipW*Math.sin(perp));
  ctx.lineTo(tx + tipW*Math.cos(perp), ty + tipW*Math.sin(perp));
  ctx.closePath();
  ctx.fillStyle = `rgb(${main[0]},${main[1]},${main[2]})`;
  ctx.fill();
  ctx.strokeStyle = `rgba(${shine[0]},${shine[1]},${shine[2]},0.5)`;
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(tx, ty, ballR, 0, Math.PI * 2);
  ctx.fillStyle = `rgb(${main[0]},${main[1]},${main[2]})`;
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(tx - ballR/3, ty - ballR/3, ballR/3, 0, Math.PI*2);
  ctx.fillStyle = `rgba(${shine[0]},${shine[1]},${shine[2]},0.7)`;
  ctx.fill();
}

export function isSpinnerOn() { return spinnerOn; }
export function toggleSpinner() { spinnerOn = !spinnerOn; }

export function handleScroll(e) {
  if (!spinnerOn) return;
  if (e.deltaY < 0) spinnerSpeed = Math.min(MAX_SPEED, spinnerSpeed + 8);
  else spinnerSpeed = Math.max(-MAX_SPEED, spinnerSpeed - 8);
}

export function drawSpinner(ctx, canvas) {
  if (!spinnerOn) return;
  const cx = canvas.width - 150;
  const cy = canvas.height - 150;

  spinnerAngle = (spinnerAngle + spinnerSpeed) % 360;
  spinnerSpeed = spinnerSpeed > 0
    ? Math.max(MIN_SPEED, spinnerSpeed * FRICTION)
    : Math.min(-MIN_SPEED, spinnerSpeed * FRICTION);

  for (let i = 0; i < 3; i++) {
    drawSpinnerArm(ctx, cx, cy, spinnerAngle + i * 120, spinnerColors[i]);
  }

  ctx.beginPath();
  ctx.arc(cx, cy, 16, 0, Math.PI*2);
  ctx.fillStyle = 'rgb(50,55,80)';
  ctx.fill();
  ctx.strokeStyle = 'rgb(100,110,160)';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, 12, 0, Math.PI*2);
  ctx.fillStyle = 'rgb(190,200,230)';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx - 3, cy - 3, 4, 0, Math.PI*2);
  ctx.fillStyle = 'white';
  ctx.fill();
}