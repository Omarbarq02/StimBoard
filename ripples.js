const ripples = [];

export function spawnRipple(x, y, randColor) {
  ripples.push({ x, y, radius: 2, alpha: 210, color: randColor() });
}

export function updateRipples() {
  for (let i = ripples.length - 1; i >= 0; i--) {
    const r = ripples[i];
    r.radius += 0.7;
    r.alpha -= 0.5 + (r.radius / 160) * 0.4;
    if (r.radius >= 160 || r.alpha <= 0) ripples.splice(i, 1);
  }
}

export function drawRipples(ctx) {
  ripples.forEach(r => {
    ctx.beginPath();
    ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${r.color[0]},${r.color[1]},${r.color[2]},${r.alpha/255})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });
}