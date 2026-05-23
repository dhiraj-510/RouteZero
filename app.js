/* =========================================
   app.js — Main Controller & Event Wiring
   RouteZero — Quantum Waste Route Optimizer
   ========================================= */

const App = (() => {

  const PAGE_TITLES = {
    dashboard: 'Operations Dashboard',
    map:       'Live City Map',
    routes:    'Route Management',
    optimizer: 'Quantum Optimizer',
    analytics: 'Analytics & Reports',
    vehicles:  'Fleet Management',
    alerts:    'System Alerts',
  };

  let _currentPage = 'dashboard';

  /* ─────────────────────────────────────
     Navigation
  ───────────────────────────────────── */
  function _switchPage(name) {
    if (name === _currentPage) return;
    _currentPage = name;

    // Show/hide pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById('page-' + name);
    if (target) target.classList.add('active');

    // Update nav highlight
    document.querySelectorAll('.nav-item').forEach(n => {
      n.classList.toggle('active', n.dataset.page === name);
    });

    // Update topbar
    const titleEl = document.getElementById('pageTitle');
    if (titleEl) titleEl.textContent = PAGE_TITLES[name] || name;

    // Lazy-init page content
    switch (name) {
      case 'map':
        setTimeout(() => {
          MapRenderer.init('mapCanvas2');
        }, 50);
        break;
      case 'optimizer':
        Optimizer.initMatrix();
        Charts.initPage('optimizer');
        break;
      case 'analytics':
        Charts.initPage('analytics');
        break;
      case 'vehicles':
        UI.renderVehicles();
        Charts.initPage('vehicles');
        break;
      case 'alerts':
        UI.renderAlerts();
        break;
    }
  }

  /* ─────────────────────────────────────
     Event binding
  ───────────────────────────────────── */
  function _bindEvents() {

    // Sidebar nav
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => _switchPage(item.dataset.page));
    });

    // "View All" links inside pages that goto another page
    document.querySelectorAll('[data-goto]').forEach(el => {
      el.addEventListener('click', () => _switchPage(el.dataset.goto));
    });

    // Topbar buttons
    document.getElementById('addWasteBtn')?.addEventListener('click', UI.openModal);
    document.getElementById('topOptBtn')?.addEventListener('click', Optimizer.run);

    // Modal
    document.getElementById('cancelModal')?.addEventListener('click', UI.closeModal);
    document.getElementById('submitWaste')?.addEventListener('click', UI.submitWastePoint);
    document.getElementById('addModal')?.addEventListener('click', e => {
      if (e.target.id === 'addModal') UI.closeModal();
    });

    // Routes page filter
    document.getElementById('routeFilter')?.addEventListener('change', e => {
      UI.renderFullRoutes(e.target.value);
    });

    // Add route (placeholder)
    document.getElementById('addRouteBtn')?.addEventListener('click', () => {
      UI.showToast('📋 Route creation wizard coming soon…', 'info');
    });

    // Map controls
    document.getElementById('zoomIn')?.addEventListener('click',   () => UI.showToast('🔍 Zoomed in', 'info'));
    document.getElementById('zoomOut')?.addEventListener('click',  () => UI.showToast('🔍 Zoomed out', 'info'));
    document.getElementById('resetMap')?.addEventListener('click', () => UI.showToast('↺ Map reset', 'info'));
    document.getElementById('toggleHeatmap')?.addEventListener('click', () => UI.showToast('🔥 Heatmap toggled', 'info'));
    document.getElementById('refreshMap')?.addEventListener('click',    () => UI.showToast('🗺️ Map refreshed', 'success'));

    // Optimizer algorithm cards
    document.querySelectorAll('.algo-card').forEach(card => {
      card.addEventListener('click', () => Optimizer.selectAlgo(card.dataset.algo));
    });

    // Run optimizer button (in optimizer page)
    document.getElementById('runBtn')?.addEventListener('click', Optimizer.run);

    // Sliders
    document.querySelectorAll('input[type="range"][data-target]').forEach(input => {
      input.addEventListener('input', () => {
        const target = document.getElementById(input.dataset.target);
        if (target) target.textContent = input.value;
      });
    });

    // Alerts clear
    document.getElementById('clearAlertsBtn')?.addEventListener('click', UI.clearAlerts);
  }

  /* ─────────────────────────────────────
     Init
  ───────────────────────────────────── */
  function init() {
    // Date in topbar
    const dateEl = document.getElementById('dateStr');
    if (dateEl) dateEl.textContent = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    // Bind all events
    _bindEvents();

    // Render initial data
    UI.renderDashboardRoutes();
    UI.renderFullRoutes();
    UI.renderAlerts();

    // Init dashboard map + chart
    MapRenderer.init('mapCanvas');
    MapRenderer.start();
    Charts.initPage('dashboard');

    // Animate metrics on load
    UI.animateStartup();
  }

  return { init, switchPage: _switchPage };
})();

/* ── Boot ── */
document.addEventListener('DOMContentLoaded', App.init);
