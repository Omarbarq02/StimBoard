const letterBubbles = [];

export function spawnLetterBubble(letter, canvasWidth, canvasHeight, randColor) {
  const margin = 80;
  const x = margin + Math.random() * (canvasWidth - margin * 2);
  const y = margin + Math.random() * (canvasHeight - margin * 2 - 36);
  const color = randColor();
  letterBubbles.push({
    letter, x, y, fy: y, color,
    start: performance.now(),
    duration: 1400,
  });
}

export function updateLetterBubbles() {
  const now = performance.now();
  for (let i = letterBubbles.length - 1; i >= 0; i--) {
    const b = letterBubbles[i];
    const elapsed = now - b.start;
    if (elapsed >= b.duration) { letterBubbles.splice(i, 1); continue; }
    b.fy -= 0.35;
  }
}

export function drawLetterBubbles(ctx) {
  const now = performance.now();
  letterBubbles.forEach(b => {
    const elapsed = now - b.start;
    const t = elapsed / b.duration;
    let alpha;
    if (t < 0.1) alpha = t / 0.1;
    else alpha = 1 - Math.pow((t - 0.1) / 0.9, 1.5);
    alpha = Math.max(0, Math.min(1, alpha));

    const [r,g,bl] = b.color;
    const fontSize = 80;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const tw = ctx.measureText(b.letter).width;
    const padX = 22, padY = 12;
    const bw = tw + padX * 2, bh = fontSize + padY * 2;

    ctx.fillStyle = `rgba(${Math.min(255,r*0.55+30)},${Math.min(255,g*0.55+30)},${Math.min(255,bl*0.55+30)},0.75)`;
    ctx.beginPath();
    ctx.ellipse(b.x, b.fy, bw/2, bh/2, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.strokeStyle = `rgba(${r},${g},${bl},0.7)`;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = 'white';
    ctx.fillText(b.letter, b.x, b.fy);
    ctx.restore();
  });
}