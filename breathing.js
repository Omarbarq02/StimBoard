const INHALE_MS  = 2800;
const HOLD_MS    = 800;
const EXHALE_MS  = 5000;
const PAUSE_MS   = 1200;
const CYCLE_MS   = INHALE_MS + HOLD_MS + EXHALE_MS + PAUSE_MS;
const MAX_BREATH_CYCLES = 4;

let breathingOn = false;
let breathStart = 0;
let breathCycles = 0;
let lastBreathPhase = 'pause';

function breathPhase(elapsed) {
  let t = elapsed % CYCLE_MS;
  if (t < INHALE_MS)  return ['inhale', t / INHALE_MS];
  t -= INHALE_MS;
  if (t < HOLD_MS)    return ['hold', 1.0];
  t -= HOLD_MS;
  if (t < EXHALE_MS)  return ['exhale', 1.0 - t / EXHALE_MS];
  return ['pause', 0.0];
}

function easeInOut(f) { return (1 - Math.cos(f * Math.PI)) / 2; }

export function isBreathingOn() { return breathingOn; }

export function toggleBreathing(showToast) {
  if (breathingOn) {
    breathingOn = false;
    showToast('🫁 Breathing exercise off');
  } else {
    breathingOn = true;
    breathStart = performance.now();
    breathCycles = 0;
    lastBreathPhase = 'pause';
    showToast('🌿 Breathing exercise starting…');
  }
}

export function drawBreathing(ctx, canvas, showToast) {
  if (!breathingOn) return;

  const elapsed = performance.now() - breathStart;
  const [phase, frac] = breathPhase(elapsed);

  if (phase === 'inhale' && lastBreathPhase === 'pause') {
    breathCycles++;
    if (breathCycles >= MAX_BREATH_CYCLES) {
      breathingOn = false;
      showToast('🌿 Great job! Breathing complete ✨');
      return;
    }
  }
  lastBreathPhase = phase;

  const smooth = (phase === 'inhale' || phase === 'exhale') ? easeInOut(frac) : frac;
  const minR = 45, maxR = 120;
  const radius = minR + (maxR - minR) * smooth;
  const alpha = phase === 'pause' ? 0.27 : 0.67;
  const cx = canvas.width / 2;
  const cy = canvas.height / 2 - 30;

  for (let i = 5; i > 0; i--) {
    const gr = radius + i * 9;
    const ga = Math.max(0, alpha - i * 0.12);
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, gr);
    grad.addColorStop(0, `rgba(100,200,255,${ga})`);
    grad.addColorStop(1, `rgba(100,200,255,0)`);
    ctx.beginPath();
    ctx.arc(cx, cy, gr, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  }

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(80,185,255,${alpha})`;
  ctx.fill();
  ctx.strokeStyle = `rgba(160,230,255,0.5)`;
  ctx.lineWidth = 3;
  ctx.stroke();

  const labels = { inhale:'Breathe in…', hold:'Hold…', exhale:'Breathe out…', pause:'' };
  const lbl = labels[phase];
  if (lbl) {
    ctx.fillStyle = 'rgba(180,235,255,0.95)';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(lbl, cx, cy + radius + 36);
  }
}