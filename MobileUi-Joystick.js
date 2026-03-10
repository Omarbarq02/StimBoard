let joystickActive = false;
let joystickBase = { x: 0, y: 0 };
let joystickThumb = { x: 0, y: 0 };
let joystickTouchId = null;
let onMoveCallback = null;
let moveInterval = null;

const BASE_R = 75;
const THUMB_R = 38;
const DEAD_ZONE = 10;
const STEP_INTERVAL = 150;

export function initJoystick(onMove) {
  onMoveCallback = onMove;

  const canvas = document.getElementById('c');

  canvas.addEventListener('touchstart', e => {
    // only use touches in bottom-left area
    for (const t of e.changedTouches) {
      if (t.clientX < window.innerWidth * 0.4 && t.clientY > window.innerHeight * 0.5) {
        joystickActive = true;
        joystickTouchId = t.identifier;
        joystickBase.x = t.clientX;
        joystickBase.y = t.clientY;
        joystickThumb.x = t.clientX;
        joystickThumb.y = t.clientY;
        e.stopPropagation();
        return;
      }
    }
  }, { passive: true });

  canvas.addEventListener('touchmove', e => {
    if (!joystickActive) return;
    for (const t of e.changedTouches) {
      if (t.identifier !== joystickTouchId) continue;
      const dx = t.clientX - joystickBase.x;
      const dy = t.clientY - joystickBase.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const capped = Math.min(dist, BASE_R);
      const angle = Math.atan2(dy, dx);
      joystickThumb.x = joystickBase.x + Math.cos(angle) * capped;
      joystickThumb.y = joystickBase.y + Math.sin(angle) * capped;

      // trigger movement
      if (dist > DEAD_ZONE) {
        if (!moveInterval) {
          _doMove(dx, dy);
          moveInterval = setInterval(() => _doMove(dx, dy), STEP_INTERVAL);
        }
      }
    }
  }, { passive: true });

  canvas.addEventListener('touchend', e => {
    for (const t of e.changedTouches) {
      if (t.identifier === joystickTouchId) {
        joystickActive = false;
        joystickTouchId = null;
        clearInterval(moveInterval);
        moveInterval = null;
      }
    }
  }, { passive: true });
}

function _doMove(dx, dy) {
  if (!onMoveCallback) return;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);
  let key = null;
  if (absDx > absDy) key = dx > 0 ? 'ArrowRight' : 'ArrowLeft';
  else               key = dy > 0 ? 'ArrowDown'  : 'ArrowUp';
  onMoveCallback(key);
}

export function drawJoystick(ctx) {
    // always show a faint hint in bottom-left
    const hintX = 100;
    const hintY = window.innerHeight - 120;
  
    // faint base hint
    ctx.beginPath();
    ctx.arc(hintX, hintY, BASE_R, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(80,120,220,0.08)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(120,170,255,0.25)';
    ctx.lineWidth = 2;
    ctx.stroke();
  
    // faint thumb hint
    ctx.beginPath();
    ctx.arc(hintX, hintY, THUMB_R, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(120,170,255,0.15)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(200,230,255,0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();
  
    // label
    ctx.fillStyle = 'rgba(160,196,232,0.4)';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🐢 drag', hintX, hintY + BASE_R + 14);
  
    if (!joystickActive) return;
  
    // active base
    ctx.beginPath();
    ctx.arc(joystickBase.x, joystickBase.y, BASE_R, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(80,120,220,0.22)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(120,170,255,0.55)';
    ctx.lineWidth = 2;
    ctx.stroke();
  
    // active thumb
    ctx.beginPath();
    ctx.arc(joystickThumb.x, joystickThumb.y, THUMB_R, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(120,170,255,0.65)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(200,230,255,0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  export function isJoystickActive() { return joystickActive; }