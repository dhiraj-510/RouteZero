/* =========================================
   optimizer.js — Quantum Optimizer Simulation
   RouteZero — Quantum Waste Route Optimizer
   ========================================= */

const Optimizer = (() => {

  let _running = false;
  let _selectedAlgo = 'QAOA';
  let _matrixInterval = null;

  /* ─────────────────────────────────────
     Qubit Matrix
  ───────────────────────────────────── */
  function initMatrix() {
    const el = document.getElementById('qMatrix');
    if (!el) return;
    el.innerHTML = '';
    for (let i = 0; i < 64; i++) {
      const cell = document.createElement('div');
      cell.className = 'q-cell';
      el.appendChild(cell);
    }
    _tickMatrix(false);
  }

  function _tickMatrix(intense) {
    const cells = document.querySelectorAll('.q-cell');
    cells.forEach(c => {
      const r = Math.random();
      if (intense) {
        c.className = 'q-cell ' + (r > 0.3 ? 'active' : r > 0.1 ? 'mid' : '');
      } else {
        c.className = 'q-cell ' + (r > 0.8 ? 'active' : r > 0.6 ? 'mid' : '');
      }
    });
    _setElem('entVal', Math.round(60 + Math.random() * 35) + '%');
    _setElem('fidVal', (97 + Math.random() * 2).toFixed(1) + '%');
  }

  /* ─────────────────────────────────────
     Algorithm selector
  ───────────────────────────────────── */
  function selectAlgo(algo) {
    _selectedAlgo = algo;
    document.querySelectorAll('.algo-card').forEach(c => {
      c.classList.toggle('sel', c.dataset.algo === algo);
    });
    _setElem('algoNameDash', algo);
  }

  /* ─────────────────────────────────────
     Run / Stop
  ───────────────────────────────────── */
  function run() {
    if (_running) return;
    _running = true;

    const btn  = document.getElementById('runBtn');
    const text = document.getElementById('runBtnText');
    if (btn)  btn.classList.add('running');
    if (text) text.textContent = 'Running…';

    UI.showToast(`⚡ ${_selectedAlgo} optimization started…`, 'info');

    let tick = 0;
    const maxTicks = 20;

    _matrixInterval = setInterval(() => {
      tick++;
      _tickMatrix(true);
      _setElem('itersDash', tick * Math.round(800 / maxTicks));

      if (tick >= maxTicks) {
        clearInterval(_matrixInterval);
        _matrixInterval = null;
        _finish();
      }
    }, 120);
  }

  function _finish() {
    _running = false;
    const btn  = document.getElementById('runBtn');
    const text = document.getElementById('runBtnText');
    if (btn)  btn.classList.remove('running');
    if (text) text.textContent = 'Run Optimizer';

    // Randomised improvement results
    const routes   = Math.floor(10 + Math.random() * 5);
    const fuel     = Math.floor(250 + Math.random() * 100);
    const co2      = Math.floor(fuel * 2.6);
    const distPct  = 28 + Math.round(Math.random() * 10);
    const convPct  = (98 + Math.random() * 1.5).toFixed(1);
    const timeSave = (3 + Math.random() * 2).toFixed(1);

    UI.animateNumber('m-routes', routes);
    UI.animateNumber('m-fuel',   fuel);
    UI.animateNumber('m-co2',    co2);

    _setElem('convDash',    convPct + '%');
    _setElem('timeDash',    timeSave + 'h');
    _setElem('distDash',    '−' + distPct + '%');
    _setElem('resTotalDist', (210.4 * (1 - distPct/100)).toFixed(1) + ' km');
    _setElem('resVehicles',  Math.floor(6 + Math.random() * 4) + '/12');
    _setElem('resTime',      Math.floor(4 + Math.random() * 3) + 'h ' + Math.floor(Math.random() * 59) + 'm');

    // Refresh convergence chart with new run data
    Charts.initPage('optimizer');

    UI.showToast(`✅ Optimization complete! ${routes} routes updated`, 'success');
  }

  /* ─────────────────────────────────────
     Helpers
  ───────────────────────────────────── */
  function _setElem(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  return { initMatrix, selectAlgo, run };
})();
