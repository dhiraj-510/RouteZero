/* =========================================
   ui.js — UI Helpers: Toast, Animate, Render
   RouteZero — Quantum Waste Route Optimizer
   ========================================= */

const UI = (() => {

  /* ─────────────────────────────────────
     Toast notifications
  ───────────────────────────────────── */
  function showToast(msg, type = 'info') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const colorMap = { success: 'var(--accent)', danger: 'var(--red)', info: 'var(--blue)' };
    const t = document.createElement('div');
    t.className = 'toast';
    t.style.borderColor = colorMap[type] || 'var(--amber)';
    t.innerHTML = `<span>${msg}</span>`;
    document.body.appendChild(t);

    setTimeout(() => {
      t.classList.add('hide');
      setTimeout(() => t.remove(), 300);
    }, 3000);
  }

  /* ─────────────────────────────────────
     Animated number counter
  ───────────────────────────────────── */
  function animateNumber(id, target) {
    const el = document.getElementById(id);
    if (!el) return;
    const start = parseInt(el.textContent) || 0;
    const steps = 20;
    let i = 0;
    const iv = setInterval(() => {
      i++;
      el.textContent = Math.round(start + (target - start) * (i / steps));
      if (i >= steps) { clearInterval(iv); el.textContent = target; }
    }, 40);
  }

  /* ─────────────────────────────────────
     Route tables
  ───────────────────────────────────── */
  function _fillColor(fill) {
    return fill > 85 ? 'var(--red)' : fill > 60 ? 'var(--amber)' : 'var(--accent)';
  }

  function _statusTag(status) {
    const map = { completed: 'tag-green', active: 'tag-amber', scheduled: 'tag-blue' };
    return `<span class="tag ${map[status] || 'tag-blue'}">${status}</span>`;
  }

  function _progressCell(fill) {
    return `<div style="display:flex;align-items:center;gap:8px;">
      <div class="progress-bar"><div class="progress-fill" style="width:${fill}%;background:${_fillColor(fill)}"></div></div>
      <span style="font-size:11px;color:var(--muted2)">${fill}%</span>
    </div>`;
  }

  function renderDashboardRoutes() {
    const tbody = document.getElementById('routeTableBody');
    if (!tbody) return;
    tbody.innerHTML = DATA.routes.slice(0, 5).map(r => `
      <tr>
        <td><span style="font-family:var(--font-mono);font-size:12px;color:var(--accent)">${r.id}</span></td>
        <td>${r.vehicle}</td>
        <td>${_statusTag(r.status)}</td>
        <td>${_progressCell(r.fill)}</td>
        <td style="font-size:12px;color:var(--muted2)">${new Date(Date.now() + r.stops * 300000).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}</td>
      </tr>
    `).join('');
  }

  function renderFullRoutes(filter = 'all') {
    const tbody = document.getElementById('fullRouteTable');
    if (!tbody) return;
    const rows = filter === 'all' ? DATA.routes : DATA.routes.filter(r => r.status === filter);
    tbody.innerHTML = rows.map(r => `
      <tr>
        <td><span style="font-family:var(--font-mono);color:var(--accent)">${r.id}</span></td>
        <td>${r.zone}</td>
        <td>${r.vehicle}</td>
        <td>${r.stops}</td>
        <td>${r.dist}</td>
        <td>${_statusTag(r.status)}</td>
        <td>${_progressCell(r.fill)}</td>
        <td style="color:var(--accent);font-size:12px;">↓${r.saved}</td>
        <td>
          <div style="display:flex;gap:6px;">
            <button class="btn btn-outline" style="padding:3px 10px;font-size:11px;" onclick="UI.viewRoute('${r.id}')">View</button>
            <button class="btn btn-danger"  style="padding:3px 10px;font-size:11px;" onclick="UI.deleteRoute('${r.id}')">Del</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  function viewRoute(id) { showToast(`📍 Viewing route ${id}…`, 'success'); }
  function deleteRoute(id) { showToast(`🗑️ Route ${id} removed from schedule`, 'danger'); }

  /* ─────────────────────────────────────
     Alerts
  ───────────────────────────────────── */
  function _alertHTML(a) {
    return `<div class="notif">
      <span class="notif-icon">${a.icon}</span>
      <div class="notif-body">
        <div class="notif-title">${a.title}</div>
        <div class="notif-sub">${a.sub}</div>
      </div>
      <span class="notif-time">${a.time}</span>
    </div>`;
  }

  function renderAlerts() {
    const mini = document.getElementById('alertList');
    const full = document.getElementById('fullAlertList');
    if (mini) mini.innerHTML = DATA.alerts.slice(0, 3).map(_alertHTML).join('');
    if (full) full.innerHTML = DATA.alerts.map(_alertHTML).join('');
  }

  function clearAlerts() {
    const full = document.getElementById('fullAlertList');
    if (full) full.innerHTML = '<div style="text-align:center;padding:30px;color:var(--muted)">No active alerts</div>';
    showToast('✅ All alerts cleared', 'success');
  }

  /* ─────────────────────────────────────
     Vehicles
  ───────────────────────────────────── */
  function renderVehicles() {
    const list = document.getElementById('vehicleList');
    if (!list) return;
    list.innerHTML = DATA.vehicles.map(v => {
      const statusColor = v.status === 'active' ? 'var(--accent)' : v.status === 'maintenance' ? 'var(--red)' : 'var(--amber)';
      const statusBg    = v.status === 'active' ? 'rgba(0,200,150,0.1)' : v.status === 'maintenance' ? 'rgba(255,71,87,0.1)' : 'rgba(245,166,35,0.1)';
      const loadBar     = v.fill > 0 ? `
        <div style="text-align:right">
          <div style="font-size:11px;color:var(--muted2);margin-bottom:3px">Load</div>
          <div class="progress-bar" style="width:60px">
            <div class="progress-fill" style="width:${v.fill}%;background:${_fillColor(v.fill)}"></div>
          </div>
        </div>` : '';
      return `<div class="vehicle-card">
        <div class="vehicle-icon" style="background:rgba(0,200,150,0.1)">${v.icon}</div>
        <div class="vehicle-info">
          <div class="vehicle-name">${v.name} <span style="font-size:11px;color:var(--muted)">(${v.id})</span></div>
          <div class="vehicle-route">Route: ${v.route} • Cap: ${v.cap}</div>
        </div>
        ${loadBar}
        <span class="vehicle-status" style="background:${statusBg};color:${statusColor}">${v.status}</span>
      </div>`;
    }).join('');
  }

  /* ─────────────────────────────────────
     Modal
  ───────────────────────────────────── */
  function openModal() {
    document.getElementById('addModal').style.display = 'flex';
  }
  function closeModal() {
    document.getElementById('addModal').style.display = 'none';
  }
  function submitWastePoint() {
    const name = document.getElementById('wpName').value.trim() || 'New Point';
    closeModal();
    const nodes = document.getElementById('nodesDash');
    if (nodes) nodes.textContent = parseInt(nodes.textContent) + 1;
    showToast(`📍 "${name}" added to routing system`, 'success');
  }

  /* ─────────────────────────────────────
     Startup metric animation
  ───────────────────────────────────── */
  function animateStartup() {
    setTimeout(() => animateNumber('m-routes',  12),  200);
    setTimeout(() => animateNumber('m-fuel',   284),  400);
    setTimeout(() => animateNumber('m-co2',    741),  600);
    setTimeout(() => animateNumber('m-missed',   2),  800);
  }

  return {
    showToast, animateNumber,
    renderDashboardRoutes, renderFullRoutes,
    viewRoute, deleteRoute,
    renderAlerts, clearAlerts,
    renderVehicles,
    openModal, closeModal, submitWastePoint,
    animateStartup,
  };
})();
