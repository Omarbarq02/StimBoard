const sparkles = [];

function drawStar(ctx, x, y, outer, inner, n, angleOffset) {
  ctx.beginPath();
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = angleOffset + (i * Math.PI) / n;
    i === 0 ? ctx.moveTo(x + r*Math.cos(a), y + r*Math.sin(a))
            : ctx.lineTo(x + r*Math.cos(a), y + r*Math.sin(a));
  }
  ctx.closePath();
}

export function spawnSparkle(x, y, randColor) {
  const color = randColor();
  const angle = Math.random() * Math.PI * 2;
  const speed = Math.random() * 2 + 0.8;
  sparkles.push({
    x, y, color,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - 0.5,
    size: Math.random() * 12 + 6,
    alpha: 255,
    decay: Math.random() * 2.5 + 3.5,
    spin: Math.random() * 8 - 4,
    angle: Math.random() * Math.PI * 2,
  });
}

export function updateSparkles() {
  for (let i = sparkles.length - 1; i >= 0; i--) {
    const s = sparkles[i];
    s.x += s.vx; s.y += s.vy; s.vy += 0.04;
    s.alpha -= s.decay; s.angle += s.spin * Math.PI/180;
    s.size *= 0.97;
    if (s.alpha <= 0 || s.size < 1) sparkles.splice(i, 1);
  }
}

export function drawSparkles(ctx) {
  sparkles.forEach(s => {
    ctx.save();
    ctx.globalAlpha = Math.max(0, s.alpha / 255);
    ctx.fillStyle = `rgb(${s.color[0]},${s.color[1]},${s.color[2]})`;
    drawStar(ctx, s.x, s.y, s.size, s.size * 0.42, 5, s.angle);
    ctx.fill();
    ctx.restore();
  });
}