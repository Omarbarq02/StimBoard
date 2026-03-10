let _showToast = null;
let _toggleBreathing, _toggleSpinner, _isSpinnerOn;
let _setSparkleMode, _getSparkleMode;
let _showSensoryPicker, _showColourPicker;
let _turtleOn = false;

export function isTurtleOn() { return _turtleOn; }

function _showJoystickHint() {
  if (document.getElementById('joystickHint')) return;
  const hint = document.createElement('div');
  hint.id = 'joystickHint';
  hint.style.cssText = `
    position:fixed;
    bottom:80px;
    left:12px;
    background:rgba(18,28,80,0.92);
    border:1.5px solid rgba(100,160,255,0.5);
    border-radius:14px;
    padding:10px 14px;
    font-family:sans-serif;
    font-size:13px;
    color:#b8d8ff;
    pointer-events:none;
    z-index:600;
    max-width:180px;
    line-height:1.5;
  `;
  hint.innerHTML = `↙ <strong>Joystick here</strong><br>Drag to move the turtle`;
  document.body.appendChild(hint);

  // auto hide after 4 seconds
  setTimeout(_hideJoystickHint, 4000);
}

function _hideJoystickHint() {
  const hint = document.getElementById('joystickHint');
  if (hint) hint.remove();
}

export function initMobileUI(deps) {
  _showToast       = deps.showToast;
  _toggleBreathing = deps.toggleBreathing;
  _toggleSpinner   = deps.toggleSpinner;
  _isSpinnerOn     = deps.isSpinnerOn;
  _setSparkleMode  = deps.setSparkleMode;
  _getSparkleMode  = deps.getSparkleMode;
  _showSensoryPicker = deps.showSensoryPicker;
  _showColourPicker  = deps.showColourPicker;
}

export function createMobileButtons() {
  const bar = document.createElement('div');
  bar.id = 'mobileBar';
  bar.style.cssText = `
    position:fixed;bottom:0;left:0;right:0;
    height:70px;
    background:rgba(8,10,30,0.92);
    border-top:1px solid rgba(80,130,220,0.25);
    display:flex;align-items:center;justify-content:space-around;
    padding:0 8px;z-index:500;
  `;

  const buttons = [
    { label: '🌿', sub: 'Breathe',  id: 'mb-breathe'  },
    { label: '🌀', sub: 'Fidget',   id: 'mb-fidget'   },
    { label: '✨', sub: 'Sparkles', id: 'mb-sparkles' },
    { label: '🌟', sub: 'Sensory',  id: 'mb-sensory'  },
    { label: '🎨', sub: 'Colours',  id: 'mb-colours'  },
    { label: '🐢', sub: 'Turtle',   id: 'mb-turtle'   },
  ];

  buttons.forEach(b => {
    const btn = document.createElement('button');
    btn.id = b.id;
    btn.style.cssText = `
      background:rgba(28,36,92,0.85);
      border:1.5px solid rgba(80,130,220,0.5);
      border-radius:14px;
      padding:6px 10px;
      cursor:pointer;
      display:flex;flex-direction:column;
      align-items:center;justify-content:center;
      min-width:56px;height:52px;gap:2px;
      -webkit-tap-highlight-color:transparent;
    `;
    btn.innerHTML = `
      <span style="font-size:22px;line-height:1">${b.label}</span>
      <span style="color:#a0c4e8;font-family:sans-serif;font-size:10px">${b.sub}</span>
    `;
    bar.appendChild(btn);
  });

  document.body.appendChild(bar);
  _attachListeners();
}

function _attachListeners() {
  document.getElementById('mb-breathe').addEventListener('click', () => {
    _toggleBreathing(_showToast);
  });

  document.getElementById('mb-fidget').addEventListener('click', () => {
    _toggleSpinner();
    _showToast('🌀 Fidget spinner ' + (_isSpinnerOn() ? 'on — spin by swiping!' : 'off'));
  });

  document.getElementById('mb-sparkles').addEventListener('click', () => {
    const next = !_getSparkleMode();
    _setSparkleMode(next);
    const btn = document.getElementById('mb-sparkles');
    btn.style.borderColor = next ? '#a0d7ff' : 'rgba(80,130,220,0.5)';
    btn.style.background  = next ? 'rgba(50,68,135,0.95)' : 'rgba(28,36,92,0.85)';
    _showToast('✨ Sparkle mode ' + (next ? 'on' : 'off'));
  });

  document.getElementById('mb-sensory').addEventListener('click', () => {
    _showSensoryPicker();
  });

  document.getElementById('mb-colours').addEventListener('click', () => {
    _showColourPicker();
  });
  document.getElementById('mb-turtle').addEventListener('click', () => {
    _turtleOn = !_turtleOn;
    const btn = document.getElementById('mb-turtle');
    btn.style.borderColor = _turtleOn ? '#a0d7ff' : 'rgba(80,130,220,0.5)';
    btn.style.background  = _turtleOn ? 'rgba(50,68,135,0.95)' : 'rgba(28,36,92,0.85)';
    if (_turtleOn) {
      _showToast('🐢 Turtle on! Joystick is bottom-left ↙');
      _showJoystickHint();
    } else {
      _showToast('🐢 Turtle off');
      _hideJoystickHint();
    }
  });
}

export function removeMobileButtons() {
  const bar = document.getElementById('mobileBar');
  if (bar) bar.remove();
}