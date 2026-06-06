/* ══════════════════════════════════════════
   LeaveFlow — Dashboard SPA Scripts
══════════════════════════════════════════ */

// ── Current logged-in user (fetched from server) ──
let USER = { name: 'Loading...', initials: '..', role: '', dept: '', email: '', phone: '', joined: '', empId: '', manager: 'Priya Sharma' };

function getInitials(name) {
  return name.trim().split(' ').filter(Boolean).map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

async function loadUser() {
  try {
    const res  = await fetch('/api/me');
    const data = await res.json();
    if (!data.success) { window.location.href = '/'; return; }
    const u = data.user;
    USER = {
      name:     u.name,
      initials: getInitials(u.name),
      role:     u.role     || 'Employee',
      dept:     u.department || 'General',
      email:    u.email,
      empId:    u.empId,
      phone:    '+91 98765 43210',
      joined:   'N/A',
      manager:  'Priya Sharma',
    };

    // Update sidebar chip
    document.querySelectorAll('.user-avatar').forEach(el => el.textContent = USER.initials);
    document.querySelectorAll('.user-name').forEach(el   => el.textContent = USER.name);
    document.querySelectorAll('.user-role').forEach(el   => el.textContent = USER.role);

    // Update welcome banner
    const greetEl = document.querySelector('.welcome-text h2');
    if (greetEl) {
      const h    = new Date().getHours();
      const tod  = h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
      greetEl.textContent = 'Good ' + tod + ', ' + USER.name.split(' ')[0] + ' \uD83D\uDC4B';
    }

    // Re-render active page so profile/settings show real name
    renderPage(currentPage);
  } catch (err) {
    console.error('Could not load user:', err);
  }
}

// ── Demo leave records ──
const LEAVE_RECORDS = [
  { id:'LR-0041', type:'Annual',  icon:'umbrella-fill',    cls:'lt-annual',  from:'10 Jun 2026', to:'14 Jun 2026', days:5, applied:'01 Jun 2026', status:'Pending',  reason:'Family vacation' },
  { id:'LR-0038', type:'Sick',    icon:'thermometer-half', cls:'lt-sick',    from:'22 May 2026', to:'23 May 2026', days:2, applied:'21 May 2026', status:'Approved', reason:'Fever and rest' },
  { id:'LR-0035', type:'Casual',  icon:'person-walking',   cls:'lt-casual',  from:'05 May 2026', to:'05 May 2026', days:1, applied:'04 May 2026', status:'Approved', reason:'Personal work' },
  { id:'LR-0031', type:'Annual',  icon:'umbrella-fill',    cls:'lt-annual',  from:'18 Apr 2026', to:'19 Apr 2026', days:2, applied:'14 Apr 2026', status:'Pending',  reason:'Travel' },
  { id:'LR-0028', type:'Casual',  icon:'person-walking',   cls:'lt-casual',  from:'02 Apr 2026', to:'02 Apr 2026', days:1, applied:'30 Mar 2026', status:'Rejected', reason:'Market visit' },
  { id:'LR-0021', type:'Sick',    icon:'thermometer-half', cls:'lt-sick',    from:'15 Mar 2026', to:'15 Mar 2026', days:1, applied:'14 Mar 2026', status:'Approved', reason:'Doctor visit' },
  { id:'LR-0018', type:'Annual',  icon:'umbrella-fill',    cls:'lt-annual',  from:'20 Feb 2026', to:'22 Feb 2026', days:3, applied:'15 Feb 2026', status:'Approved', reason:'Wedding ceremony' },
  { id:'LR-0014', type:'Casual',  icon:'person-walking',   cls:'lt-casual',  from:'05 Feb 2026', to:'05 Feb 2026', days:1, applied:'03 Feb 2026', status:'Approved', reason:'Bank work' },
  { id:'LR-0009', type:'Sick',    icon:'thermometer-half', cls:'lt-sick',    from:'10 Jan 2026', to:'10 Jan 2026', days:1, applied:'09 Jan 2026', status:'Approved', reason:'Cold and flu' },
  { id:'LR-0003', type:'Annual',  icon:'umbrella-fill',    cls:'lt-annual',  from:'26 Dec 2025', to:'31 Dec 2025', days:6, applied:'18 Dec 2025', status:'Approved', reason:'Year-end holiday' },
];

const NOTIFICATIONS = [
  { id:1, icon:'check-circle-fill', color:'var(--accent3)', title:'Leave Approved',  body:'Your Sick Leave (22-23 May) has been approved.', time:'2 hours ago',  read:false },
  { id:2, icon:'x-circle-fill',     color:'#ef4444',        title:'Leave Rejected',  body:'Your Casual Leave (02 Apr) was rejected. Reason: Team deadline conflict.', time:'3 days ago',   read:false },
  { id:3, icon:'bell-fill',         color:'var(--accent2)', title:'Reminder',         body:'You have 18 annual leave days remaining for 2026. Plan ahead!', time:'1 week ago',   read:false },
  { id:4, icon:'info-circle-fill',  color:'#3b82f6',        title:'Policy Update',    body:'New WFH leave policy effective from 1 July 2026. Check HR portal.', time:'2 weeks ago',  read:true  },
  { id:5, icon:'person-fill',       color:'var(--muted)',   title:'Manager Note',     body:'Priya Sharma added a comment to your leave request LR-0041.', time:'3 weeks ago',  read:true  },
];

const TEAM_LEAVES = [
  { name:'Priya Sharma',   initials:'PS', role:'Engineering Manager',   color:'#a855f7', from:'Jun 10', to:'Jun 12', type:'Annual',  status:'Approved' },
  { name:'Rahul Verma',    initials:'RV', role:'Backend Developer',     color:'#3b82f6', from:'Jun 15', to:'Jun 16', type:'Sick',    status:'Approved' },
  { name:'Sneha Patel',    initials:'SP', role:'UI/UX Designer',        color:'#2ecc98', from:'Jun 20', to:'Jun 25', type:'Annual',  status:'Pending'  },
  { name:'Arjun Menon',    initials:'AM', role:'QA Engineer',           color:'#f97316', from:'Jun 08', to:'Jun 08', type:'Casual',  status:'Approved' },
  { name:'Divya Nair',     initials:'DN', role:'Product Manager',       color:'#ec4899', from:'Jun 18', to:'Jun 19', type:'Casual',  status:'Pending'  },
  { name:'Karan Singh',    initials:'KS', role:'DevOps Engineer',       color:'#14b8a6', from:'Jul 01', to:'Jul 05', type:'Annual',  status:'Pending'  },
];

let APPROVALS = [
  { id:'LR-0042', name:'Sneha Patel',  initials:'SP', color:'#2ecc98', role:'UI/UX Designer',    type:'Annual', from:'Jun 20', to:'Jun 25', days:6, reason:'Family trip',      applied:'02 Jun 2026' },
  { id:'LR-0040', name:'Karan Singh',  initials:'KS', color:'#14b8a6', role:'DevOps Engineer',   type:'Sick',   from:'Jun 07', to:'Jun 07', days:1, reason:'Medical checkup',  applied:'06 Jun 2026' },
];

// ── Sidebar & layout ──
const sidebar   = document.getElementById('sidebar');
const mainWrap  = document.getElementById('mainWrap');
const desktopTg = document.getElementById('desktopToggle');
const toggleIcon= document.getElementById('toggleIcon');
const mobileBtn = document.getElementById('mobileMenuBtn');
const overlay   = document.getElementById('overlay');
let collapsed   = false;

desktopTg.addEventListener('click', () => {
  collapsed = !collapsed;
  sidebar.classList.toggle('collapsed', collapsed);
  mainWrap.classList.toggle('sidebar-collapsed', collapsed);
  desktopTg.classList.toggle('collapsed', collapsed);
  toggleIcon.className = collapsed ? 'bi bi-chevron-right' : 'bi bi-chevron-left';
});

mobileBtn.addEventListener('click', () => {
  sidebar.classList.add('mobile-open');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
});

function closeMobileSidebar() {
  sidebar.classList.remove('mobile-open');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}
overlay.addEventListener('click', closeMobileSidebar);

// ── SPA navigation ──
let currentPage = 'dashboard';
const pageContent = document.getElementById('pageContent');
const headerTitle = document.getElementById('headerTitle');

document.querySelectorAll('.nav-link[data-page]').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    this.classList.add('active');
    currentPage = this.dataset.page;
    renderPage(currentPage);
    if (window.innerWidth < 992) closeMobileSidebar();
  });
});

function renderPage(page) {
  const titles = {
    dashboard: 'Dashboard', apply: 'Apply Leave', history: 'Leave History',
    notifications: 'Notifications', team: 'Team Calendar',
    approvals: 'Approvals', reports: 'Reports', profile: 'My Profile', settings: 'Settings'
  };
  headerTitle.textContent = titles[page] || 'Dashboard';

  const pages = { dashboard, apply, history, notifications, team, approvals, reports, profile, settings };
  pageContent.innerHTML   = (pages[page] || dashboard)();

  // re-bind page-specific events after render
  if (page === 'apply')         bindApply();
  if (page === 'history')       bindHistory();
  if (page === 'notifications') bindNotifications();
  if (page === 'approvals')     bindApprovals();
  if (page === 'settings')      bindSettings();
}

// ── Helpers ──
function statusBadge(s) {
  const map = { Approved:'sb-approved', Pending:'sb-pending', Rejected:'sb-rejected' };
  return `<span class="status-badge ${map[s]||''}">${s}</span>`;
}
function leaveTypeBadge(type, icon, cls) {
  return `<span class="leave-type-badge ${cls}"><i class="bi bi-${icon}"></i> ${type}</span>`;
}
function showToast(html, dur=4000) {
  const w = document.createElement('div');
  w.className = 'position-fixed bottom-0 end-0 m-3';
  w.style.zIndex = '9999';
  w.innerHTML = `<div class="toast show align-items-center text-white border-0"
    style="background:var(--ink);border-radius:12px;font-family:'DM Sans',sans-serif;font-size:.85rem;min-width:280px;">
    <div class="d-flex">
      <div class="toast-body">${html}</div>
      <button class="btn-close btn-close-white me-2 m-auto" onclick="this.closest('.position-fixed').remove()"></button>
    </div></div>`;
  document.body.appendChild(w);
  setTimeout(() => w.remove(), dur);
}

// ════════════════════════════════════════
//  PAGE RENDERERS
// ════════════════════════════════════════

function dashboard() {
  const recent = LEAVE_RECORDS.slice(0, 6);
  const rows = recent.map(r => `
    <tr>
      <td class="text-muted" style="font-size:.75rem;">${r.id}</td>
      <td>${leaveTypeBadge(r.type, r.icon, r.cls)}</td>
      <td>${r.from}</td><td>${r.to}</td>
      <td><strong>${r.days}</strong></td>
      <td>${r.applied}</td>
      <td>${statusBadge(r.status)}</td>
    </tr>`).join('');

  return `
  <div class="welcome-banner mb-4">
    <div class="welcome-text">
      <div class="greeting">${new Date().toLocaleDateString('en-GB',{weekday:'long',day:'2-digit',month:'long',year:'numeric'})}</div>
      <h2>Good ${new Date().getHours()<12?'morning':new Date().getHours()<17?'afternoon':'evening'}, ${USER.name.split(' ')[0]} \uD83D\uDC4B</h2>
      <p>You have <strong style="color:var(--accent2)">2 pending requests</strong> awaiting response.</p>
    </div>
    <div class="welcome-date d-none d-sm-block">
      <div class="date-num">${String(new Date().getDate()).padStart(2,'0')}</div>
      <div class="date-label">${new Date().toLocaleDateString('en-GB',{month:'long',year:'numeric'})}</div>
    </div>
  </div>

  <div class="row g-3 mb-4">
    <div class="col-6 col-xl-3"><div class="stat-card">
      <div class="card-icon icon-orange"><i class="bi bi-calendar3"></i></div>
      <div class="stat-val">18</div><div class="stat-label">Total Leave Balance</div>
      <div class="mini-progress"><div class="bar" style="width:72%;background:var(--accent);"></div></div>
      <div class="stat-footer"><i class="bi bi-info-circle"></i> 18 of 25 days remaining</div>
    </div></div>
    <div class="col-6 col-xl-3"><div class="stat-card">
      <div class="card-icon icon-amber"><i class="bi bi-send-fill"></i></div>
      <div class="stat-val">7</div><div class="stat-label">Leave Applied</div>
      <div class="mini-progress"><div class="bar" style="width:28%;background:var(--accent2);"></div></div>
      <div class="stat-footer"><i class="bi bi-arrow-up trend-up"></i><span class="trend-up"> 2 more</span> than last month</div>
    </div></div>
    <div class="col-6 col-xl-3"><div class="stat-card">
      <div class="card-icon icon-blue"><i class="bi bi-hourglass-split"></i></div>
      <div class="stat-val">2</div><div class="stat-label">Pending Requests</div>
      <div class="mini-progress"><div class="bar" style="width:20%;background:#3b82f6;"></div></div>
      <div class="stat-footer"><i class="bi bi-clock"></i> Awaiting HR review</div>
    </div></div>
    <div class="col-6 col-xl-3"><div class="stat-card">
      <div class="card-icon icon-green"><i class="bi bi-check-circle-fill"></i></div>
      <div class="stat-val">5</div><div class="stat-label">Approved Leaves</div>
      <div class="mini-progress"><div class="bar" style="width:71%;background:var(--accent3);"></div></div>
      <div class="stat-footer"><i class="bi bi-arrow-up trend-up"></i><span class="trend-up"> 71%</span> approval rate</div>
    </div></div>
  </div>

  <div class="row g-3">
    <div class="col-12 col-xl-8">
      <div class="section-heading"><h5>Recent Leave Requests</h5>
        <a href="#" onclick="navTo('history')">View all <i class="bi bi-arrow-right"></i></a></div>
      <div class="leave-table-wrap"><div class="table-responsive">
        <table class="table table-hover">
          <thead><tr><th>#</th><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Applied</th><th>Status</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div></div>
    </div>
    <div class="col-12 col-xl-4">
      <div class="section-heading"><h5>Leave Balance</h5><a href="#">Details</a></div>
      <div class="quick-panel mb-3"><h6><i class="bi bi-wallet2 me-1" style="color:var(--accent);"></i> Annual Leave</h6>
        <div class="balance-row"><span class="bl-label">Entitled</span><span class="bl-val">20 days</span></div>
        <div class="balance-row"><span class="bl-label">Used</span><span class="bl-val">7 days</span></div>
        <div class="balance-row"><span class="bl-label">Balance</span><span class="bl-val" style="color:var(--accent3);">13 days</span></div>
      </div>
      <div class="quick-panel mb-3"><h6><i class="bi bi-heart-pulse-fill me-1" style="color:#ef4444;"></i> Sick Leave</h6>
        <div class="balance-row"><span class="bl-label">Entitled</span><span class="bl-val">10 days</span></div>
        <div class="balance-row"><span class="bl-label">Used</span><span class="bl-val">3 days</span></div>
        <div class="balance-row"><span class="bl-label">Balance</span><span class="bl-val" style="color:var(--accent3);">7 days</span></div>
      </div>
      <div class="quick-panel"><h6><i class="bi bi-person-check-fill me-1" style="color:#3b82f6;"></i> Casual Leave</h6>
        <div class="balance-row"><span class="bl-label">Entitled</span><span class="bl-val">6 days</span></div>
        <div class="balance-row"><span class="bl-label">Used</span><span class="bl-val">4 days</span></div>
        <div class="balance-row"><span class="bl-label">Balance</span><span class="bl-val" style="color:var(--accent2);">2 days</span></div>
      </div>
    </div>
  </div>`;
}

function navTo(page) {
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const link = document.querySelector(`.nav-link[data-page="${page}"]`);
  if (link) link.classList.add('active');
  currentPage = page;
  renderPage(page);
}

function apply() {
  return `
  <div class="row justify-content-center">
    <div class="col-12 col-lg-7">
      <div class="page-card">
        <div class="page-card-header"><h4><i class="bi bi-calendar-plus me-2" style="color:var(--accent);"></i>Apply for Leave</h4></div>
        <div class="page-card-body">
          <div class="info-box mb-4">
            <i class="bi bi-info-circle-fill"></i>
            <span>Annual: <strong>13 days</strong> &nbsp;|&nbsp; Sick: <strong>7 days</strong> &nbsp;|&nbsp; Casual: <strong>2 days</strong> remaining</span>
          </div>
          <div class="mb-3">
            <label class="form-label">Leave Type <span class="text-danger">*</span></label>
            <select class="form-select" id="aLeaveType">
              <option value="">Select leave type...</option>
              <option>Annual Leave</option><option>Sick Leave</option>
              <option>Casual Leave</option><option>Maternity / Paternity Leave</option><option>Compensatory Off</option>
            </select>
            <div class="invalid-feedback">Please select a leave type.</div>
          </div>
          <div class="row g-3 mb-3">
            <div class="col-6">
              <label class="form-label">From Date <span class="text-danger">*</span></label>
              <input type="date" class="form-control" id="aFromDate"/>
              <div class="invalid-feedback">Select a valid start date.</div>
            </div>
            <div class="col-6">
              <label class="form-label">To Date <span class="text-danger">*</span></label>
              <input type="date" class="form-control" id="aToDate"/>
              <div class="invalid-feedback">Must be on or after From date.</div>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Number of Days</label>
            <input type="text" class="form-control" id="aNumDays" placeholder="Auto-calculated" readonly style="background:var(--paper);"/>
          </div>
          <div class="mb-3">
            <label class="form-label">Reason <span class="text-danger">*</span></label>
            <textarea class="form-control" id="aReason" rows="3" placeholder="Brief description of your leave reason..."></textarea>
            <div class="invalid-feedback">Please provide a reason.</div>
          </div>
          <div class="mb-4">
            <label class="form-label">Supporting Document <span class="text-muted">(optional)</span></label>
            <input type="file" class="form-control" accept=".pdf,.jpg,.png"/>
          </div>
          <div class="d-flex gap-2">
            <button class="btn-dark-custom flex-grow-1" onclick="submitApply()">
              <i class="bi bi-send me-1"></i> Submit Request
            </button>
            <button class="btn-outline-custom" onclick="navTo('dashboard')">Cancel</button>
          </div>
          <div id="applyAlert" class="alert alert-danger d-none mt-3 py-2 px-3" style="font-size:.82rem;border-radius:10px;">
            <i class="bi bi-exclamation-circle me-1"></i><span></span>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

function bindApply() {
  const today = new Date().toISOString().split('T')[0];
  const fd = document.getElementById('aFromDate');
  const td = document.getElementById('aToDate');
  if (fd) fd.min = today;
  if (td) td.min = today;
  function calcDays() {
    if (fd.value && td.value) {
      const d = Math.round((new Date(td.value) - new Date(fd.value)) / 86400000) + 1;
      document.getElementById('aNumDays').value = d > 0 ? d + ' day(s)' : '-';
    }
  }
  if (fd) fd.addEventListener('change', calcDays);
  if (td) td.addEventListener('change', calcDays);
}

function submitApply() {
  const lt = document.getElementById('aLeaveType');
  const fd = document.getElementById('aFromDate');
  const td = document.getElementById('aToDate');
  const re = document.getElementById('aReason');
  let valid = true;
  [lt, fd, td, re].forEach(el => el.classList.remove('is-invalid','is-valid'));
  if (!lt.value)      { lt.classList.add('is-invalid'); valid = false; } else lt.classList.add('is-valid');
  if (!fd.value)      { fd.classList.add('is-invalid'); valid = false; } else fd.classList.add('is-valid');
  if (!td.value || td.value < fd.value) { td.classList.add('is-invalid'); valid = false; } else td.classList.add('is-valid');
  if (!re.value.trim()){ re.classList.add('is-invalid'); valid = false; } else re.classList.add('is-valid');
  if (!valid) return;
  showToast('<i class="bi bi-check-circle-fill me-2" style="color:var(--accent3);"></i> Leave request submitted successfully!');
  navTo('history');
}

function history() {
  const rows = (filter) => LEAVE_RECORDS
    .filter(r => filter === 'all' || r.status === filter)
    .map(r => `<tr>
      <td class="text-muted" style="font-size:.75rem;">${r.id}</td>
      <td>${leaveTypeBadge(r.type,r.icon,r.cls)}</td>
      <td>${r.from}</td><td>${r.to}</td>
      <td><strong>${r.days}</strong></td>
      <td>${r.applied}</td>
      <td class="text-muted" style="font-size:.8rem;">${r.reason}</td>
      <td>${statusBadge(r.status)}</td>
    </tr>`).join('');

  return `
  <div class="d-flex flex-wrap gap-2 mb-3" id="histFilters">
    ${['all','Approved','Pending','Rejected'].map((f,i) =>
      `<button class="filter-btn ${i===0?'active':''}" data-filter="${f}">${f.charAt(0).toUpperCase()+f.slice(1)}</button>`
    ).join('')}
  </div>
  <div class="leave-table-wrap">
    <div class="table-responsive">
      <table class="table table-hover" id="histTable">
        <thead><tr><th>#</th><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Applied</th><th>Reason</th><th>Status</th></tr></thead>
        <tbody id="histBody">${rows('all')}</tbody>
      </table>
    </div>
  </div>`;
}

function bindHistory() {
  document.querySelectorAll('#histFilters .filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('#histFilters .filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const f = this.dataset.filter;
      document.getElementById('histBody').innerHTML = LEAVE_RECORDS
        .filter(r => f === 'all' || r.status === f)
        .map(r => `<tr>
          <td class="text-muted" style="font-size:.75rem;">${r.id}</td>
          <td>${leaveTypeBadge(r.type,r.icon,r.cls)}</td>
          <td>${r.from}</td><td>${r.to}</td>
          <td><strong>${r.days}</strong></td><td>${r.applied}</td>
          <td class="text-muted" style="font-size:.8rem;">${r.reason}</td>
          <td>${statusBadge(r.status)}</td>
        </tr>`).join('');
    });
  });
}

function notifications() {
  let notifs = [...NOTIFICATIONS];
  const items = () => notifs.map(n => `
    <div class="notif-item ${n.read?'read':''}" data-id="${n.id}">
      <div class="notif-icon" style="background:${n.color}20;color:${n.color};">
        <i class="bi bi-${n.icon}"></i>
      </div>
      <div class="notif-body">
        <div class="notif-title">${n.title}</div>
        <div class="notif-text">${n.body}</div>
        <div class="notif-time"><i class="bi bi-clock me-1"></i>${n.time}</div>
      </div>
      ${!n.read ? '<div class="notif-dot-badge"></div>' : ''}
    </div>`).join('');

  return `
  <div class="d-flex align-items-center justify-content-between mb-3">
    <span class="text-muted" style="font-size:.85rem;">${notifs.filter(n=>!n.read).length} unread</span>
    <button class="filter-btn active" id="markAllBtn">Mark all as read</button>
  </div>
  <div class="notif-list" id="notifList">${items()}</div>`;
}

function bindNotifications() {
  document.getElementById('markAllBtn')?.addEventListener('click', function() {
    NOTIFICATIONS.forEach(n => n.read = true);
    document.querySelectorAll('.notif-item').forEach(el => {
      el.classList.add('read');
      el.querySelector('.notif-dot-badge')?.remove();
    });
    document.querySelector('[data-id] ~ .notif-dot-badge');
    this.textContent = 'All read';
    this.disabled = true;
    showToast('<i class="bi bi-check-circle-fill me-2" style="color:var(--accent3);"></i> All notifications marked as read');
  });
}

function team() {
  const cards = TEAM_LEAVES.map(m => `
    <div class="col-12 col-sm-6 col-xl-4">
      <div class="team-card">
        <div class="team-avatar" style="background:${m.color}20;color:${m.color};">${m.initials}</div>
        <div class="team-info">
          <div class="team-name">${m.name}</div>
          <div class="team-role">${m.role}</div>
          <div class="team-dates">
            <i class="bi bi-calendar3"></i> ${m.from} - ${m.to}
            <span class="leave-type-badge ${m.type==='Annual'?'lt-annual':m.type==='Sick'?'lt-sick':'lt-casual'}" style="font-size:.7rem;padding:.15em .5em;">${m.type}</span>
            ${statusBadge(m.status)}
          </div>
        </div>
      </div>
    </div>`).join('');

  return `
  <div class="info-box mb-4">
    <i class="bi bi-people-fill"></i>
    <span>Showing upcoming and ongoing leaves for your team in <strong>June 2026</strong>.</span>
  </div>
  <div class="row g-3">${cards}</div>`;
}

function approvals() {
  if (APPROVALS.length === 0) return `
    <div class="empty-state">
      <i class="bi bi-check2-circle"></i>
      <p>No pending approvals. You're all caught up!</p>
    </div>`;

  const cards = APPROVALS.map(a => `
    <div class="approval-card mb-3" id="appr-${a.id}">
      <div class="d-flex align-items-start justify-content-between flex-wrap gap-2">
        <div class="d-flex align-items-center gap-3">
          <div class="team-avatar" style="background:${a.color}20;color:${a.color};">${a.initials}</div>
          <div>
            <div class="fw-600" style="font-weight:600;font-size:.9rem;">${a.name}</div>
            <div class="text-muted" style="font-size:.78rem;">${a.role} &nbsp;|&nbsp; ${a.empId}</div>
          </div>
        </div>
        <span class="status-badge sb-pending">Pending</span>
      </div>
      <hr style="border-color:var(--border);margin:1rem 0;">
      <div class="row g-2 mb-3" style="font-size:.82rem;">
        <div class="col-6 col-md-3"><span class="text-muted">Leave Type</span><br><strong>${a.type}</strong></div>
        <div class="col-6 col-md-3"><span class="text-muted">Duration</span><br><strong>${a.from} - ${a.to} (${a.days}d)</strong></div>
        <div class="col-6 col-md-3"><span class="text-muted">Reason</span><br><strong>${a.reason}</strong></div>
        <div class="col-6 col-md-3"><span class="text-muted">Applied On</span><br><strong>${a.applied}</strong></div>
      </div>
      <div class="d-flex gap-2">
        <button class="btn-dark-custom" style="background:var(--accent3);" onclick="approveLeave('${a.id}')">
          <i class="bi bi-check-lg me-1"></i> Approve
        </button>
        <button class="btn-outline-custom" style="color:#ef4444;border-color:#ef4444;" onclick="rejectLeave('${a.id}')">
          <i class="bi bi-x-lg me-1"></i> Reject
        </button>
      </div>
    </div>`).join('');

  return `<div>${cards}</div>`;
}

function approveLeave(id) {
  APPROVALS = APPROVALS.filter(a => a.id !== id);
  showToast('<i class="bi bi-check-circle-fill me-2" style="color:var(--accent3);"></i> Leave approved successfully!');
  renderPage('approvals');
}

function rejectLeave(id) {
  APPROVALS = APPROVALS.filter(a => a.id !== id);
  showToast('<i class="bi bi-x-circle-fill me-2" style="color:#ef4444;"></i> Leave request rejected.');
  renderPage('approvals');
}

function bindApprovals() {}

function reports() {
  const months  = ['Jan','Feb','Mar','Apr','May','Jun'];
  const values  = [3,1,2,2,3,5];
  const maxVal  = Math.max(...values);
  const bars = months.map((m,i) => `
    <div class="report-bar-wrap">
      <div class="report-bar-label">${values[i]}</div>
      <div class="report-bar" style="height:${Math.round((values[i]/maxVal)*130)}px;background:var(--accent);"></div>
      <div class="report-bar-month">${m}</div>
    </div>`).join('');

  return `
  <div class="row g-3 mb-4">
    <div class="col-6 col-md-3"><div class="stat-card">
      <div class="card-icon icon-orange"><i class="bi bi-calendar-check"></i></div>
      <div class="stat-val">16</div><div class="stat-label">Total Days Used</div>
    </div></div>
    <div class="col-6 col-md-3"><div class="stat-card">
      <div class="card-icon icon-green"><i class="bi bi-check-circle"></i></div>
      <div class="stat-val">71%</div><div class="stat-label">Approval Rate</div>
    </div></div>
    <div class="col-6 col-md-3"><div class="stat-card">
      <div class="card-icon icon-blue"><i class="bi bi-send"></i></div>
      <div class="stat-val">7</div><div class="stat-label">Requests Submitted</div>
    </div></div>
    <div class="col-6 col-md-3"><div class="stat-card">
      <div class="card-icon icon-amber"><i class="bi bi-hourglass"></i></div>
      <div class="stat-val">9</div><div class="stat-label">Days Remaining</div>
    </div></div>
  </div>
  <div class="row g-3">
    <div class="col-12 col-md-7">
      <div class="page-card">
        <div class="page-card-header"><h4>Monthly Leave Usage (2026)</h4></div>
        <div class="page-card-body">
          <div class="report-chart">${bars}</div>
        </div>
      </div>
    </div>
    <div class="col-12 col-md-5">
      <div class="page-card">
        <div class="page-card-header"><h4>By Leave Type</h4></div>
        <div class="page-card-body">
          ${[['Annual','umbrella-fill','#3b82f6',7],['Sick','thermometer-half','#ef4444',3],['Casual','person-walking','#f97316',3]].map(([t,ic,c,d]) => `
          <div class="report-type-row">
            <div class="d-flex align-items-center gap-2">
              <i class="bi bi-${ic}" style="color:${c};"></i>
              <span style="font-size:.85rem;">${t} Leave</span>
            </div>
            <div>
              <strong style="font-size:.9rem;">${d} days</strong>
              <div class="mini-progress mt-1" style="width:80px;display:inline-block;">
                <div class="bar" style="width:${Math.round(d/16*100)}%;background:${c};"></div>
              </div>
            </div>
          </div>`).join('')}
        </div>
      </div>
    </div>
  </div>`;
}

function profile() {
  return `
  <div class="row justify-content-center">
    <div class="col-12 col-lg-7">
      <div class="page-card mb-3">
        <div class="page-card-body text-center">
          <div class="profile-avatar mx-auto mb-3">${USER.initials}</div>
          <h4 style="font-family:'Syne',sans-serif;font-weight:800;letter-spacing:-.02em;">${USER.name}</h4>
          <p class="text-muted mb-1" style="font-size:.88rem;">${USER.role}</p>
          <p class="text-muted" style="font-size:.82rem;">${USER.dept} Department</p>
          <span class="status-badge sb-approved mt-2 d-inline-flex">Active Employee</span>
        </div>
      </div>
      <div class="page-card">
        <div class="page-card-header"><h4>Personal Information</h4></div>
        <div class="page-card-body">
          ${[
            ['person-fill','Full Name',USER.name],
            ['envelope-fill','Email Address',USER.email],
            ['credit-card-fill','Employee ID',USER.empId],
            ['building','Department',USER.dept],
            ['briefcase-fill','Job Role',USER.role],
            ['telephone-fill','Phone',USER.phone],
            ['calendar3','Joined',USER.joined],
            ['person-badge-fill','Manager',USER.manager],
          ].map(([ic,label,val]) => `
          <div class="profile-detail-row">
            <i class="bi bi-${ic}" style="color:var(--accent);width:18px;flex-shrink:0;margin-top:2px;"></i>
            <div>
              <div style="font-size:.72rem;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;">${label}</div>
              <div style="font-size:.88rem;font-weight:500;">${val || 'Not provided'}</div>
            </div>
          </div>`).join('')}
        </div>
      </div>
    </div>
  </div>`;
}

function settings() {
  const toggles = [
    ['Email Notifications','Receive leave updates via email','notif-email',true],
    ['Push Notifications','Browser push alerts for approvals','notif-push',true],
    ['Leave Reminders','Remind me of upcoming approved leaves','notif-remind',false],
    ['Weekly Summary','Get a weekly leave summary email','notif-weekly',false],
  ];
  return `
  <div class="row justify-content-center">
    <div class="col-12 col-lg-7">
      <div class="page-card mb-3">
        <div class="page-card-header"><h4><i class="bi bi-bell me-2" style="color:var(--accent);"></i>Notification Settings</h4></div>
        <div class="page-card-body">
          ${toggles.map(([title,desc,id,checked]) => `
          <div class="settings-row">
            <div>
              <div style="font-weight:500;font-size:.88rem;">${title}</div>
              <div style="font-size:.78rem;color:var(--muted);">${desc}</div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="${id}" ${checked?'checked':''}>
              <div class="toggle-track"></div>
            </label>
          </div>`).join('')}
        </div>
      </div>
      <div class="page-card mb-3">
        <div class="page-card-header"><h4><i class="bi bi-lock me-2" style="color:var(--accent);"></i>Change Password</h4></div>
        <div class="page-card-body">
          <div class="mb-3">
            <label class="form-label">Current Password</label>
            <input type="password" class="form-control" placeholder="Enter current password"/>
          </div>
          <div class="mb-3">
            <label class="form-label">New Password</label>
            <input type="password" class="form-control" placeholder="Min 8 characters"/>
          </div>
          <div class="mb-3">
            <label class="form-label">Confirm New Password</label>
            <input type="password" class="form-control" placeholder="Repeat new password"/>
          </div>
          <button class="btn-dark-custom" onclick="showToast('<i class=\'bi bi-check-circle-fill me-2\' style=\'color:var(--accent3);\'></i> Password updated successfully!')">
            Update Password
          </button>
        </div>
      </div>
      <div class="page-card">
        <div class="page-card-header"><h4><i class="bi bi-palette me-2" style="color:var(--accent);"></i>Appearance</h4></div>
        <div class="page-card-body">
          <div class="settings-row">
            <div><div style="font-weight:500;font-size:.88rem;">Compact Sidebar</div>
              <div style="font-size:.78rem;color:var(--muted);">Start with sidebar collapsed</div></div>
            <label class="toggle-switch"><input type="checkbox" id="compact"><div class="toggle-track"></div></label>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

function bindSettings() {
  document.getElementById('compact')?.addEventListener('change', function() {
    collapsed = this.checked;
    sidebar.classList.toggle('collapsed', collapsed);
    mainWrap.classList.toggle('sidebar-collapsed', collapsed);
    desktopTg.classList.toggle('collapsed', collapsed);
    toggleIcon.className = collapsed ? 'bi bi-chevron-right' : 'bi bi-chevron-left';
  });
}

// ── Logout ──
async function handleLogout() {
  try { await fetch('/api/logout', { method:'POST' }); } finally { window.location.href = '/'; }
}

// ── Boot ──
window.addEventListener('DOMContentLoaded', async () => {
  await loadUser();
  renderPage('dashboard');
});
