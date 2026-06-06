/* ══════════════════════════════════════════
   LeaveFlow — Signup Page Scripts
══════════════════════════════════════════ */

// ── Password toggle (main) ──
document.getElementById('togglePwd').addEventListener('click', () => {
  const pwd  = document.getElementById('password');
  const icon = document.getElementById('eyeIcon');
  pwd.type       = pwd.type === 'password' ? 'text' : 'password';
  icon.className = pwd.type === 'password' ? 'bi bi-eye' : 'bi bi-eye-slash';
});

// ── Password toggle (confirm) ──
document.getElementById('toggleConfirm').addEventListener('click', () => {
  const pwd  = document.getElementById('confirmPwd');
  const icon = document.getElementById('eyeIcon2');
  pwd.type       = pwd.type === 'password' ? 'text' : 'password';
  icon.className = pwd.type === 'password' ? 'bi bi-eye' : 'bi bi-eye-slash';
});

// ── Password strength meter ──
document.getElementById('password').addEventListener('input', function () {
  const val   = this.value;
  const wrap  = document.getElementById('strengthWrap');
  const fill  = document.getElementById('strengthFill');
  const label = document.getElementById('strengthLabel');

  if (!val) { wrap.style.display = 'none'; return; }
  wrap.style.display = 'flex';

  let score = 0;
  if (val.length >= 8)              score++;
  if (/[A-Z]/.test(val))            score++;
  if (/[0-9]/.test(val))            score++;
  if (/[^A-Za-z0-9]/.test(val))     score++;

  const levels = [
    { pct: '25%', color: '#ef4444', text: 'Weak' },
    { pct: '50%', color: '#f97316', text: 'Fair' },
    { pct: '75%', color: 'var(--accent2)', text: 'Good' },
    { pct: '100%', color: 'var(--accent3)', text: 'Strong' },
  ];

  const lvl        = levels[Math.max(0, score - 1)];
  fill.style.width      = lvl.pct;
  fill.style.background = lvl.color;
  label.textContent     = lvl.text;
  label.style.color     = lvl.color;
});

// ── Helpers ──
function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function isValidEmpId(v) { return /^EMP-\d+$/i.test(v.trim()); }

function setInvalid(el, msg) {
  el.classList.add('is-invalid');
  el.classList.remove('is-valid');
  const fb = el.closest('.mb-3, .col-7, .col-5, .col-6')?.querySelector('.invalid-feedback');
  if (fb && msg) fb.textContent = msg;
}

function setValid(el) {
  el.classList.remove('is-invalid');
  el.classList.add('is-valid');
}

// ── Clear on input ──
document.querySelectorAll('#signupForm input, #signupForm select').forEach(el => {
  el.addEventListener('input', () => {
    el.classList.remove('is-invalid', 'is-valid');
    document.getElementById('signupAlert').classList.add('d-none');
  });
});

// ── Form submission ──
document.getElementById('signupForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const fullName   = document.getElementById('fullName');
  const empId      = document.getElementById('empId');
  const email      = document.getElementById('email');
  const department = document.getElementById('department');
  const role       = document.getElementById('role');
  const password   = document.getElementById('password');
  const confirmPwd = document.getElementById('confirmPwd');
  const terms      = document.getElementById('terms');
  const alertEl    = document.getElementById('signupAlert');
  const successEl  = document.getElementById('signupSuccess');
  const btn        = document.querySelector('.btn-login[type="submit"]');

  let valid = true;

  // Full name
  if (!fullName.value.trim() || fullName.value.trim().length < 2) {
    setInvalid(fullName, 'Please enter your full name (at least 2 characters).');
    valid = false;
  } else setValid(fullName);

  // Employee ID
  if (!isValidEmpId(empId.value)) {
    setInvalid(empId, 'Format: EMP-#### (e.g. EMP-1042).');
    valid = false;
  } else setValid(empId);

  // Email
  if (!isValidEmail(email.value.trim())) {
    setInvalid(email, 'Enter a valid email address.');
    valid = false;
  } else setValid(email);

  // Department
  if (!department.value) {
    setInvalid(department, 'Please select your department.');
    valid = false;
  } else setValid(department);

  // Role
  if (!role.value.trim()) {
    setInvalid(role, 'Please enter your job role.');
    valid = false;
  } else setValid(role);

  // Password
  if (password.value.length < 8) {
    setInvalid(password, 'Password must be at least 8 characters.');
    valid = false;
  } else setValid(password);

  // Confirm password
  if (confirmPwd.value !== password.value) {
    setInvalid(confirmPwd, 'Passwords do not match.');
    valid = false;
  } else if (confirmPwd.value) setValid(confirmPwd);

  // Terms
  if (!terms.checked) {
    terms.classList.add('is-invalid');
    valid = false;
  } else terms.classList.remove('is-invalid');

  if (!valid) return;

  // Loading state
  btn.disabled    = true;
  btn.innerHTML   = '<span><i class="bi bi-arrow-repeat spin me-1"></i>Creating account…</span>';

  try {
    const res  = await fetch('/api/signup', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:       fullName.value.trim(),
        empId:      empId.value.trim().toUpperCase(),
        email:      email.value.trim().toLowerCase(),
        department: department.value,
        role:       role.value.trim(),
        password:   password.value,
      }),
    });

    const data = await res.json();

    if (data.success) {
      successEl.classList.remove('d-none');
      btn.innerHTML = '<span><i class="bi bi-check-circle-fill me-1"></i>Account created!</span>';
      setTimeout(() => { window.location.href = '/'; }, 1800);
    } else {
      alertEl.querySelector('span').textContent = data.message || 'Something went wrong.';
      alertEl.classList.remove('d-none');
      btn.disabled  = false;
      btn.innerHTML = '<span>Create Account &nbsp;<i class="bi bi-arrow-right"></i></span>';
    }
  } catch (err) {
    alertEl.querySelector('span').textContent = 'Server error. Is the server running?';
    alertEl.classList.remove('d-none');
    btn.disabled  = false;
    btn.innerHTML = '<span>Create Account &nbsp;<i class="bi bi-arrow-right"></i></span>';
  }
});
