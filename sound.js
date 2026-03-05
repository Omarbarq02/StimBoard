let sound = null;
let sparkleSound = null;

export async function loadSound(path) {
  const audio = new Audio(path);
  audio.volume = 0.4;
  sound = audio;
}

export async function loadSparkleSound(path) {
  const audio = new Audio(path);
  audio.volume = 0.4;
  sparkleSound = audio;
}

export function playPlink() {
  if (!sound) return;
  const clone = sound.cloneNode();
  clone.volume = 0.4;
  clone.play().catch(() => {});
}

export function playSparkle() {
  if (!sparkleSound) return;
  const clone = sparkleSound.cloneNode();
  clone.volume = 0.9;
  clone.play().catch(() => {});
  setTimeout(() => { clone.pause(); clone.currentTime = 0; }, 200);
}