// Auth helpers
function getUsers() { return JSON.parse(localStorage.getItem('et_users') || '[]'); }
function saveUsers(u) { localStorage.setItem('et_users', JSON.stringify(u)); }
function getSession() { return JSON.parse(localStorage.getItem('et_session') || 'null'); }
function setSession(user) { localStorage.setItem('et_session', JSON.stringify(user)); }
function clearSession() { localStorage.removeItem('et_session'); }

// Guard: redirect to login if not authenticated (skip on login page)
if (!window.location.pathname.includes('login.html')) {
  if (!getSession()) window.location.href = 'login.html';
}

// Dark mode
function applyDark() {
  if (localStorage.getItem('et_dark') === '1') document.body.classList.add('dark');
}
applyDark();

document.addEventListener('DOMContentLoaded', () => {
  // Show username
  const nameEl = document.getElementById('user-name');
  if (nameEl) { const s = getSession(); if (s) nameEl.textContent = s.name; }

  // Logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) logoutBtn.addEventListener('click', () => { clearSession(); window.location.href = 'login.html'; });

  // Dark toggle
  const darkBtn = document.getElementById('dark-toggle');
  if (darkBtn) {
    darkBtn.textContent = localStorage.getItem('et_dark') === '1' ? '☀ Light Mode' : '🌙 Dark Mode';
    darkBtn.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark');
      localStorage.setItem('et_dark', isDark ? '1' : '0');
      darkBtn.textContent = isDark ? '☀ Light Mode' : '🌙 Dark Mode';
    });
  }

  // Login form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      const users = getUsers();
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) { document.getElementById('login-error').textContent = 'Invalid email or password.'; return; }
      setSession(user);
      window.location.href = 'dashboard.html';
    });
  }

  // Register form
  const regForm = document.getElementById('register-form');
  if (regForm) {
    regForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const password = document.getElementById('reg-password').value;
      const confirm = document.getElementById('reg-confirm').value;
      const errEl = document.getElementById('reg-error');

      if (password.length < 8) { errEl.textContent = 'Password must be at least 8 characters.'; return; }
      if (password !== confirm) { errEl.textContent = 'Passwords do not match.'; return; }
      const users = getUsers();
      if (users.find(u => u.email === email)) { errEl.textContent = 'Email already registered.'; return; }

      const user = { name, email, password };
      users.push(user);
      saveUsers(users);
      setSession(user);
      window.location.href = 'dashboard.html';
    });
  }
});

// Tab switching on login page
function showTab(tab) {
  document.getElementById('login-form').classList.toggle('hidden', tab !== 'login');
  document.getElementById('register-form').classList.toggle('hidden', tab !== 'register');
  document.querySelectorAll('.tab').forEach((t, i) => t.classList.toggle('active', (i === 0 && tab === 'login') || (i === 1 && tab === 'register')));
}
