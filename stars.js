const BASE_STARS = 80;
let stars = [];
let stimLevel = 'medium';

function makeStars(count) {
  stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.5,
      a: Math.random() * 95 + 50,
      vx: (Math.random() - 0.5),
      vy: (Math.random() - 0.5),
    });
  }
}

export function setStarLevel(level) {
  stimLevel = level;
  if (level === 'calm')   makeStars(40);
  if (level === 'medium') makeStars(200);
  if (level === 'high')   makeStars(350);
}

export function updateStars() {
  const speed = stimLevel === 'calm' ? 0 : stimLevel === 'medium' ? 0.7 : 2.0;
  for (const s of stars) {
    s.x += s.vx * speed;
    s.y += s.vy * speed;
    if (s.x < 0) s.x = window.innerWidth;
    if (s.x > window.innerWidth) s.x = 0;
    if (s.y < 0) s.y = window.innerHeight;
    if (s.y > window.innerHeight) s.y = 0;
  }
}

export function drawStars(ctx) {
  for (const s of stars) {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200,220,255,${s.a/255})`;
    ctx.fill();
  }
}

makeStars(80);