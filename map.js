/* =========================================
   map.js — City Map Canvas Renderer
   RouteZero — Quantum Waste Route Optimizer
   ========================================= */

const MapRenderer = (() => {

  const _canvases = {};   // canvasId → { canvas, ctx, W, H }
  let _animFrameId = null;

  /** Initialise (or re-initialise) a canvas */
  function init(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = canvas.offsetWidth  * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    _canvases[canvasId] = { canvas, ctx, W: canvas.offsetWidth, H: canvas.offsetHeight };
  }

  /** Draw one frame on a registered canvas */
  function _draw(id) {
    const c = _canvases[id];
    if (!c || c.W === 0) return;
    const { ctx, W, H } = c;
    const t = Date.now() / 2000;

    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = '#0a1520';
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(0,200,150,0.05)';
    ctx.lineWidth   = 0.5;
    for (let x = 0; x < W; x += 30) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y < H; y += 30) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

    // Zone blocks
    DATA.mapZones.forEach(z => {
      ctx.fillStyle = z.color;
      ctx.fillRect(z.x*W, z.y*H, z.w*W, z.h*H);
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 1;
      ctx.strokeRect(z.x*W, z.y*H, z.w*W, z.h*H);
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.font = 'bold 11px Space Grotesk, sans-serif';
      ctx.fillText(z.label, (z.x+0.02)*W, (z.y+0.06)*H);
    });

    // Roads
    const roads = [
      [[0.05,0.50],[0.95,0.50]], [[0.47,0.05],[0.47,0.95]],
      [[0.05,0.25],[0.95,0.25]], [[0.05,0.75],[0.95,0.75]],
      [[0.25,0.05],[0.25,0.95]], [[0.70,0.05],[0.70,0.95]],
    ];
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1.5;
    roads.forEach(r => {
      ctx.beginPath();
      ctx.moveTo(r[0][0]*W, r[0][1]*H);
      ctx.lineTo(r[1][0]*W, r[1][1]*H);
      ctx.stroke();
    });

    // Route paths (dashed)
    DATA.routePaths.forEach(r => {
      ctx.beginPath();
      ctx.strokeStyle = r.color + 'aa';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 3]);
      ctx.moveTo(r.pts[0][0]*W, r.pts[0][1]*H);
      r.pts.slice(1).forEach(p => ctx.lineTo(p[0]*W, p[1]*H));
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Bins
    DATA.bins.forEach(b => {
      const col = b.fill > 85 ? '#ff4757' : b.fill > 60 ? '#f5a623' : '#00c896';
      // Glow halo
      ctx.beginPath();
      ctx.arc(b.x*W, b.y*H, 9, 0, Math.PI*2);
      ctx.fillStyle = col + '22';
      ctx.fill();
      // Dot
      ctx.beginPath();
      ctx.arc(b.x*W, b.y*H, 5, 0, Math.PI*2);
      ctx.fillStyle = col;
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Depot
    const dx = 0.47*W, dy = 0.50*H;
    ctx.beginPath(); ctx.arc(dx, dy, 18, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(0,153,255,0.15)'; ctx.fill();
    ctx.beginPath(); ctx.arc(dx, dy, 9, 0, Math.PI*2);
    ctx.fillStyle = '#0099ff'; ctx.fill();
    ctx.strokeStyle = 'rgba(0,153,255,0.5)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('D', dx, dy);

    // Vehicles (animated)
    DATA.mapVehicles.forEach((v, i) => {
      const px = (v.x + Math.sin(t + i) * 0.018) * W;
      const py = (v.y + Math.cos(t + i * 0.7) * 0.018) * H;
      // Pulse ring
      ctx.beginPath();
      ctx.arc(px, py, 10 + Math.sin(t + i) * 3, 0, Math.PI*2);
      ctx.strokeStyle = v.color + '44'; ctx.lineWidth = 1; ctx.stroke();
      // Body
      ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI*2);
      ctx.fillStyle = v.color; ctx.fill();
      ctx.fillStyle = '#000';
      ctx.font = 'bold 7px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('T', px, py);
    });
  }

  /** Animation loop — renders all visible canvases */
  function _loop() {
    Object.keys(_canvases).forEach(id => {
      const el = document.getElementById(id);
      if (el && el.offsetWidth > 0) _draw(id);
    });
    _animFrameId = requestAnimationFrame(_loop);
  }

  /** Public API */
  return {
    init,
    start() {
      if (!_animFrameId) _loop();
    },
    stop() {
      if (_animFrameId) { cancelAnimationFrame(_animFrameId); _animFrameId = null; }
    },
  };
})();
