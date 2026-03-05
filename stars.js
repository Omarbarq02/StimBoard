export const stars = Array.from({length: 80}, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.5 + 0.5,
    a: Math.random() * 0.6 + 0.2
  }));
  
  export function drawStars(ctx) {
    stars.forEach(s => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 220, 255, ${s.a})`;
      ctx.fill();
    });
  }