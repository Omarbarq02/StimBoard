let joystickActive = false;
let joystickBase = { x: 0, y: 0 };
let joystickThumb = { x: 0, y: 0 };
let joystickTouchId = null;
let onMoveCallback = null;
let moveInterval = null;
let lastDx = 0;
let lastDy = 0;

const BASE_R = 70;
const THUMB_R = 32;
const DEAD_ZONE = 10;
const STEP_INTERVAL = 150;

export function initJoystick(onMove) {
  onMoveCallback = onMove;

  document.addEventListener('touchstart', e => {
    for (const t of e.changedTouches) {
      if (t.clientX < window.innerWidth * 0.4 && t.clientY > window.innerHeight * 0.4) {
        joystickActive = true;
        joystickTouchId = t.identifier;
        joystickBase.x = t.clientX;
        joystickBase.y = t.clientY;
        joystickThumb.x = t.clientX;
        joystickThumb.y = t.clientY;
        lastDx = 0;
        lastDy = 0;
        return;
      }
    }
  }, { passive: true });

  document.addEventListener('touchmove', e => {
    if (!joystickActive) return;
    for (const t of e.changedTouches) {
      if (t.identifier !== joystickTouchId) continue;
      const dx = t.clientX - joystickBase.x;
      const dy = t.clientY - joystickBase.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const capped = Math.min(dist, BASE_R);
      const angle = Math.atan2(dy, dx);
      joystickThumb.x = joystickBase.x + Math.cos(angle) * capped;
      joystickThumb.y = joystickBase.y + Math.sin(angle) * capped;
      lastDx = dx;
      lastDy = dy;
      if (dist > DEAD_ZONE) {
        if (!moveInterval) {
          _doMove(dx, dy);
          moveInterval = setInterval(() => _doMove(lastDx, lastDy), STEP_INTERVAL);
        }
      } else {
        clearInterval(moveInterval);
        moveInterval = null;
      }
    }
  }, { passive: true });

  document.addEventListener('touchend', e => {
    for (const t of e.changedTouches) {
      if (t.identifier === joystickTouchId) {
        joystickActive = false;
        joystickTouchId = null;
        joystickThumb.x = joystickBase.x;
        joystickThumb.y = joystickBase.y;
        clearInterval(moveInterval);
        moveInterval = null;
        lastDx = 0;
        lastDy = 0;
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

export function isJoystickActive() { return joystickActive; }

export function drawJoystick(ctx, turtleOn) {
    if (!turtleOn) return;
    if (!joystickActive) return;
  
    // active base
    ctx.beginPath();
    ctx.arc(joystickBase.x, joystickBase.y, BASE_R, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(80,120,220,0.22)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(120,170,255,0.6)';
    ctx.lineWidth = 2.5;
    ctx.stroke();
  
    // active thumb
    ctx.beginPath();
    ctx.arc(joystickThumb.x, joystickThumb.y, THUMB_R, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(120,170,255,0.7)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(200,230,255,0.9)';
    ctx.lineWidth = 2.5;
    ctx.stroke();
  }