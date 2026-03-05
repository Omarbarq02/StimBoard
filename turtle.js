let turtle = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    angle: 270,
    size: 48,
    bobT: 0,
  };
  
  export const DIR_ANGLE = {
    'ArrowRight': 0, 'ArrowDown': 90, 'ArrowLeft': 180, 'ArrowUp': 270
  };
  
  export function moveTurtle(key, canvasWidth, canvasHeight) {
    turtle.angle = DIR_ANGLE[key];
    const step = 44;
    const half = turtle.size / 2;
    if (key === 'ArrowRight') turtle.x = turtle.x + step > canvasWidth ? 0 : turtle.x + step;
    if (key === 'ArrowLeft')  turtle.x = turtle.x - step < 0 ? canvasWidth : turtle.x - step;
    if (key === 'ArrowDown')  turtle.y = turtle.y + step > canvasHeight - 38 ? 0 : turtle.y + step;
    if (key === 'ArrowUp')    turtle.y = turtle.y - step < 0 ? canvasHeight - 38 : turtle.y - step;
    return { x: turtle.x, y: turtle.y };
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
    ctx.fillStyle = 'rgb(30,120,60)';
    ctx.fill();
  
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.82, 0, Math.PI * 2);
    ctx.fillStyle = 'rgb(45,160,80)';
    ctx.fill();
  
    for (let i = 0; i < 6; i++) {
      const a = (i * 60) * Math.PI / 180;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(r * 0.52 * Math.cos(a), r * 0.52 * Math.sin(a));
      ctx.strokeStyle = 'rgba(20,90,45,0.8)';
      ctx.lineWidth = Math.max(1, size / 32);
      ctx.stroke();
    }
  
    ctx.beginPath();
    ctx.arc(0, 0, size / 9, 0, Math.PI * 2);
    ctx.fillStyle = 'rgb(70,200,110)';
    ctx.fill();
  
    const headX = r * 0.78;
    const headR = size / 9;
    ctx.beginPath();
    ctx.arc(headX, 0, headR, 0, Math.PI * 2);
    ctx.fillStyle = 'rgb(55,180,90)';
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
      ctx.fillStyle = 'rgb(45,155,75)';
      ctx.fill();
    });
  
    ctx.beginPath();
    ctx.arc(-r * 0.88, 0, size/14, 0, Math.PI*2);
    ctx.fillStyle = 'rgb(45,155,75)';
    ctx.fill();
  
    ctx.restore();
  }