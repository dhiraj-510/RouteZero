/* =========================================
   data.js — Static Data & Constants
   RouteZero — Quantum Waste Route Optimizer
   ========================================= */

const DATA = {

  routes: [
    { id: 'R-01', zone: 'North',   vehicle: 'WC-101', stops: 14, dist: '18.4 km', status: 'completed', fill: 92, saved: '2.1 km' },
    { id: 'R-02', zone: 'South',   vehicle: 'WC-102', stops: 11, dist: '15.2 km', status: 'active',    fill: 67, saved: '1.8 km' },
    { id: 'R-03', zone: 'East',    vehicle: 'WC-103', stops:  9, dist: '12.7 km', status: 'active',    fill: 78, saved: '2.4 km' },
    { id: 'R-04', zone: 'West',    vehicle: 'WC-104', stops: 16, dist: '22.1 km', status: 'scheduled', fill: 45, saved: '3.0 km' },
    { id: 'R-05', zone: 'Central', vehicle: 'WC-105', stops:  8, dist: '9.8 km',  status: 'completed', fill: 88, saved: '1.2 km' },
    { id: 'R-06', zone: 'NE',      vehicle: 'WC-106', stops: 12, dist: '16.3 km', status: 'active',    fill: 55, saved: '2.7 km' },
  ],

  vehicles: [
    { id: 'WC-101', name: 'Truck Alpha',   status: 'active',      route: 'R-01', fill: 92, icon: '🚛', cap: '4T' },
    { id: 'WC-102', name: 'Truck Beta',    status: 'active',      route: 'R-02', fill: 67, icon: '🚛', cap: '4T' },
    { id: 'WC-103', name: 'Van Gamma',     status: 'active',      route: 'R-03', fill: 78, icon: '🚐', cap: '2T' },
    { id: 'WC-104', name: 'Truck Delta',   status: 'scheduled',   route: 'R-04', fill:  0, icon: '🚛', cap: '4T' },
    { id: 'WC-105', name: 'Compact Echo',  status: 'maintenance', route: '—',    fill:  0, icon: '🚙', cap: '1T' },
    { id: 'WC-106', name: 'Truck Zeta',    status: 'active',      route: 'R-06', fill: 55, icon: '🚛', cap: '4T' },
  ],

  alerts: [
    { icon: '🔴', title: 'Bin Overload — North Market',    sub: 'WP-047 at 98% capacity. Priority pickup needed.',              time: '2m ago',  type: 'red'   },
    { icon: '⚠️', title: 'Route R-04 Delayed',             sub: 'Traffic congestion on Hunsur Road. ETA +22 min.',              time: '8m ago',  type: 'amber' },
    { icon: '⚠️', title: 'Vehicle WC-105 Maintenance',     sub: 'Scheduled service due. Removing from active pool.',            time: '15m ago', type: 'amber' },
    { icon: '🟢', title: 'Optimization Complete',           sub: '12 routes re-optimized. 32% efficiency gain achieved.',        time: '1h ago',  type: 'green' },
    { icon: '🔵', title: 'New Waste Point Added',           sub: 'WP-129 registered at Devaraj Urs Road.',                      time: '2h ago',  type: 'blue'  },
  ],

  weekDays:    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  weeklyEff:   [72, 78, 74, 85, 88, 92, 95],
  months:      ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  monthRoutes: [280, 295, 310, 298, 335, 342, 318, 348, 360, 355, 341, 348],
  monthFuel:   [600, 680, 750, 720, 810, 860, 795, 820, 890, 870, 840, 820],
  wasteTypes:  ['Recyclable', 'Organic', 'General', 'Hazardous', 'E-waste'],
  wastePct:    [34, 28, 24, 9, 5],
  wasteColors: ['#00c896', '#0099ff', '#f5a623', '#9b59ff', '#ff4757'],
  trendWeeks:  ['W1','W2','W3','W4','W5','W6','W7','W8'],
  trendAfter:  [62, 65, 70, 74, 80, 85, 91, 95],
  trendBefore: [62, 63, 64, 65, 65, 66, 66, 67],
  zones:       ['North','South','East','West','Central','NE','NW','SE'],
  zoneFill:    [92, 67, 78, 45, 88, 55, 73, 61],

  // Map bins: { x, y as 0-1 fractions, fill % }
  bins: [
    { x:0.20, y:0.08, fill:92 }, { x:0.30, y:0.15, fill:67 },
    { x:0.15, y:0.30, fill:45 }, { x:0.25, y:0.22, fill:78 },
    { x:0.65, y:0.12, fill:88 }, { x:0.75, y:0.20, fill:35 },
    { x:0.60, y:0.25, fill:55 }, { x:0.20, y:0.60, fill:72 },
    { x:0.30, y:0.70, fill:90 }, { x:0.65, y:0.65, fill:48 },
    { x:0.75, y:0.75, fill:61 }, { x:0.12, y:0.75, fill:33 },
    { x:0.82, y:0.30, fill:77 }, { x:0.38, y:0.40, fill:95 },
    { x:0.55, y:0.45, fill:50 }, { x:0.70, y:0.45, fill:84 },
  ],

  // Map route paths: arrays of [x,y] normalized coords
  routePaths: [
    { pts: [[0.10,0.10],[0.20,0.08],[0.30,0.15],[0.25,0.25],[0.15,0.30],[0.10,0.20]], color: '#00c896' },
    { pts: [[0.10,0.60],[0.20,0.55],[0.30,0.65],[0.25,0.75],[0.15,0.80]],            color: '#0099ff' },
    { pts: [[0.55,0.10],[0.65,0.08],[0.75,0.15],[0.80,0.25],[0.70,0.30],[0.60,0.20]], color: '#f5a623' },
    { pts: [[0.55,0.60],[0.65,0.65],[0.75,0.60],[0.80,0.75],[0.70,0.80]],            color: '#9b59ff' },
  ],

  // Map zones
  mapZones: [
    { x:0.05, y:0.05, w:0.38, h:0.42, color:'rgba(0,200,150,0.06)',   label:'North' },
    { x:0.05, y:0.52, w:0.38, h:0.42, color:'rgba(0,153,255,0.06)',   label:'South' },
    { x:0.48, y:0.05, w:0.46, h:0.42, color:'rgba(245,166,35,0.06)',  label:'East'  },
    { x:0.48, y:0.52, w:0.46, h:0.42, color:'rgba(155,89,255,0.06)',  label:'West'  },
  ],

  // Vehicle positions on map
  mapVehicles: [
    { x:0.18, y:0.18, color:'#00c896' },
    { x:0.62, y:0.62, color:'#f5a623' },
    { x:0.28, y:0.62, color:'#0099ff' },
    { x:0.72, y:0.12, color:'#f5a623' },
    { x:0.15, y:0.50, color:'#9b59ff' },
    { x:0.80, y:0.50, color:'#00c896' },
  ],
};
