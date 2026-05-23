/* =========================================
   charts.js — All Chart.js Instances
   RouteZero — Quantum Waste Route Optimizer
   ========================================= */

const Charts = (() => {

  const _instances = {};  // chartId → Chart instance

  const GRID_COLOR  = 'rgba(0,200,150,0.05)';
  const TICK_COLOR  = '#5a8070';
  const TICK_FONT   = { size: 10 };

  function _defaultScales(yCallback) {
    return {
      x: { ticks: { color: TICK_COLOR, font: TICK_FONT }, grid: { color: GRID_COLOR } },
      y: { ticks: { color: TICK_COLOR, font: TICK_FONT, callback: yCallback }, grid: { color: GRID_COLOR } },
    };
  }

  function _destroy(id) {
    if (_instances[id]) { _instances[id].destroy(); delete _instances[id]; }
  }

  /** Weekly efficiency line chart */
  function initEfficiency() {
    _destroy('effChart');
    const ctx = document.getElementById('effChart');
    if (!ctx) return;
    _instances['effChart'] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: DATA.weekDays,
        datasets: [{
          label: 'Efficiency %',
          data: DATA.weeklyEff,
          borderColor: '#00c896', borderWidth: 2,
          backgroundColor: 'rgba(0,200,150,0.08)', fill: true,
          tension: 0.4, pointBackgroundColor: '#00c896', pointRadius: 3,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: _defaultScales(v => v + '%'),
      },
    });
  }

  /** Convergence graph for optimizer */
  function initConvergence() {
    _destroy('convChart');
    const ctx = document.getElementById('convChart');
    if (!ctx) return;
    const pts = [];
    let val = 150;
    for (let i = 0; i < 40; i++) {
      val = Math.max(val * 0.92 - Math.random() * 5, 42.6);
      pts.push(Math.round(val * 10) / 10);
    }
    _instances['convChart'] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: pts.map((_, i) => i * 25),
        datasets: [{
          label: 'Cost', data: pts,
          borderColor: '#f5a623', borderWidth: 1.5,
          backgroundColor: 'rgba(245,166,35,0.06)', fill: true,
          tension: 0.3, pointRadius: 0,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: TICK_COLOR, font: TICK_FONT, maxTicksLimit: 5 }, grid: { color: 'rgba(255,255,255,0.04)' } },
          y: { ticks: { color: TICK_COLOR, font: TICK_FONT }, grid: { color: 'rgba(255,255,255,0.04)' } },
        },
      },
    });
  }

  /** Monthly performance bar chart */
  function initMonthly() {
    _destroy('monthChart');
    const ctx = document.getElementById('monthChart');
    if (!ctx) return;
    _instances['monthChart'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: DATA.months,
        datasets: [
          { label: 'Routes',      data: DATA.monthRoutes, backgroundColor: 'rgba(0,200,150,0.6)', borderRadius: 4 },
          { label: 'Fuel Saved L',data: DATA.monthFuel,   backgroundColor: 'rgba(0,153,255,0.4)', borderRadius: 4 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: TICK_COLOR, font: TICK_FONT }, grid: { display: false } },
          y: { ticks: { color: TICK_COLOR, font: TICK_FONT }, grid: { color: GRID_COLOR } },
        },
      },
    });
  }

  /** Waste type donut */
  function initWasteDonut() {
    _destroy('wasteDonut');
    const ctx = document.getElementById('wasteDonut');
    if (!ctx) return;
    _instances['wasteDonut'] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: DATA.wasteTypes,
        datasets: [{ data: DATA.wastePct, backgroundColor: DATA.wasteColors, borderWidth: 0, hoverOffset: 4 }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        cutout: '65%',
        plugins: { legend: { display: false } },
      },
    });
  }

  /** Route efficiency trend */
  function initTrend() {
    _destroy('trendChart');
    const ctx = document.getElementById('trendChart');
    if (!ctx) return;
    _instances['trendChart'] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: DATA.trendWeeks,
        datasets: [
          { label: 'RouteZero', data: DATA.trendAfter,  borderColor: '#00c896', tension: 0.4, borderWidth: 2, pointRadius: 3, fill: false },
          { label: 'Baseline',  data: DATA.trendBefore, borderColor: '#ff4757', tension: 0.1, borderWidth: 1.5, borderDash: [4,3], pointRadius: 0, fill: false },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: TICK_COLOR, font: TICK_FONT }, grid: { color: 'rgba(0,200,150,0.04)' } },
          y: { ticks: { color: TICK_COLOR, font: TICK_FONT, callback: v => v+'%' }, grid: { color: 'rgba(0,200,150,0.04)' }, min: 55, max: 100 },
        },
      },
    });
  }

  /** Zone fill horizontal bar */
  function initZoneFill() {
    _destroy('zoneChart');
    const ctx = document.getElementById('zoneChart');
    if (!ctx) return;
    _instances['zoneChart'] = new Chart(ctx, {
      type: 'bar',
      indexAxis: 'y',
      data: {
        labels: DATA.zones,
        datasets: [{
          label: 'Fill %',
          data: DATA.zoneFill,
          backgroundColor: (c) => { const v = c.raw; return v > 85 ? 'rgba(255,71,87,0.7)' : v > 65 ? 'rgba(245,166,35,0.7)' : 'rgba(0,200,150,0.7)'; },
          borderRadius: 3,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: TICK_COLOR, font: TICK_FONT, callback: v => v+'%' }, grid: { color: 'rgba(255,255,255,0.04)' }, max: 100 },
          y: { ticks: { color: TICK_COLOR, font: TICK_FONT }, grid: { display: false } },
        },
      },
    });
  }

  /** Fuel consumption multi-line */
  function initFuel() {
    _destroy('fuelChart');
    const ctx = document.getElementById('fuelChart');
    if (!ctx) return;
    const colors = ['#00c896','#0099ff','#f5a623'];
    _instances['fuelChart'] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: DATA.weekDays,
        datasets: DATA.vehicles.slice(0, 3).map((v, i) => ({
          label: v.id,
          data: Array.from({ length: 7 }, () => Math.round(20 + Math.random() * 30)),
          borderColor: colors[i], tension: 0.4, borderWidth: 2, pointRadius: 2, fill: false,
        })),
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: TICK_COLOR, font: TICK_FONT }, grid: { color: GRID_COLOR } },
          y: { ticks: { color: TICK_COLOR, font: TICK_FONT, callback: v => v+'L' }, grid: { color: GRID_COLOR } },
        },
      },
    });
  }

  /** Init all charts needed for a given page */
  function initPage(page) {
    switch (page) {
      case 'dashboard': initEfficiency(); break;
      case 'optimizer': initConvergence(); break;
      case 'analytics': initMonthly(); initWasteDonut(); initTrend(); initZoneFill(); break;
      case 'vehicles':  initFuel(); break;
    }
  }

  return { initPage, initConvergence };
})();
