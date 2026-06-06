/* ══════════════════════════════════════════
   LeaveFlow — Login Page Scripts
══════════════════════════════════════════ */

// ── Password show / hide toggle ──
document.getElementById('togglePwd').addEventListener('click', () => {
  const pwd  = document.getElementById('password');
  const icon = document.getElementById('eyeIcon');

  if (pwd.type === 'password') {
    pwd.type       = 'text';
    icon.className = 'bi bi-eye-slash';
  } else {
    pwd.type       = 'password';
    icon.className = 'bi bi-eye';
  }
});

// ── Validation helpers ──
function isValidEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
}

function isValidEmpId(val) {
  return /^EMP-\d+$/i.test(val.trim());
}

// ── Form submission → calls backend ──
document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const empIdEl  = document.getElementById('empId');
  const pwdEl    = document.getElementById('password');
  const alertEl  = document.getElementById('loginAlert');
  const btn      = document.querySelector('.btn-login');
  let valid      = true;

  // Client-side validation
  const empVal = empIdEl.value.trim();
  if (!empVal || (!isValidEmail(empVal) && !isValidEmpId(empVal))) {
    empIdEl.classList.add('is-invalid');
    document.getElementById('empIdFeedback').textContent = empVal
      ? 'Enter a valid email (user@domain.com) or Employee ID (EMP-####).'
      : 'This field is required.';
    valid = false;
  } else {
    empIdEl.classList.remove('is-invalid');
    empIdEl.classList.add('is-valid');
  }

  if (!pwdEl.value) {
    pwdEl.classList.add('is-invalid');
    valid = false;
  } else {
    pwdEl.classList.remove('is-invalid');
    pwdEl.classList.add('is-valid');
  }

  if (!valid) return;

  // Show loading state
  btn.disabled    = true;
  btn.innerHTML   = '<span><i class="bi bi-arrow-repeat spin me-1"></i>Signing in…</span>';

  try {
    const res  = await fetch('/api/login', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      // send as 'identifier' — server checks both email AND empId
      body:    JSON.stringify({ identifier: empVal, password: pwdEl.value }),
    });

    const data = await res.json();

    if (data.success) {
      // Redirect to dashboard
      window.location.href = data.redirect;
    } else {
      alertEl.querySelector('span').textContent = data.message || 'Invalid credentials. Please try again.';
      alertEl.classList.remove('d-none');
      btn.disabled  = false;
      btn.innerHTML = '<span>Sign In &nbsp;<i class="bi bi-arrow-right"></i></span>';
      setTimeout(() => alertEl.classList.add('d-none'), 3500);
    }
  } catch (err) {
    alertEl.querySelector('span').textContent = 'Server error. Is the server running?';
    alertEl.classList.remove('d-none');
    btn.disabled  = false;
    btn.innerHTML = '<span>Sign In &nbsp;<i class="bi bi-arrow-right"></i></span>';
  }
});

// ── Clear validation state on input ──
['empId', 'password'].forEach(id => {
  document.getElementById(id).addEventListener('input', function () {
    this.classList.remove('is-invalid', 'is-valid');
    document.getElementById('loginAlert').classList.add('d-none');
  });
});

// ── Forgot password ──
function showForgot(e) {
  e.preventDefault();
  alert('A password reset link will be sent to your registered email. Please contact HR if needed.');
}
