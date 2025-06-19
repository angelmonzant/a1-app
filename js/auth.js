// Esperamos a que el DOM cargue completamente
document.addEventListener('DOMContentLoaded', () => {
  // Manejador de login (ya implementado antes)…
  const form = document.getElementById('loginForm');
  if (form) {
    form.addEventListener('submit', handleLogin);
  }

  // Conectamos el botón de logout si existe
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }
});

/**
 * Maneja el submit del login (extraído para legibilidad).
 */
async function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  // ———————— MOCK para pruebas sin servidor ————————
  if (username === 'admin' && password === 'Admin123') {
    // Creamos token y usuario de ejemplo
    sessionStorage.setItem('authToken', 'mocked-token');
    sessionStorage.setItem('user', JSON.stringify({
      name: 'Administrador',
      username: 'admin'
    }));
    window.location.href = 'dashboard.html';
    return;  // saltamos la llamada real
  }
  // ————————————————————————————————

  // Si no es el mock, continúa con la llamada real al backend
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!response.ok) {
      const err = await response.json();
      showError(err.message || 'Credenciales inválidas.');
      return;
    }
    const data = await response.json();
    sessionStorage.setItem('authToken', data.token);
    sessionStorage.setItem('user', JSON.stringify(data.user));
    window.location.href = 'dashboard.html';

  } catch (err) {
    console.error(err);
    showError('No fue posible conectar. Intenta más tarde.');
  }
}



/**
 * Si no hay token en sesión, redirige a login.
 */
function requireAuth() {
  if (!sessionStorage.getItem('authToken')) {
    window.location.href = 'login.html';
  }
}

/**
 * Limpia sesión y redirige a login.
 */
function logout() {
  sessionStorage.clear();
  window.location.href = 'login.html';
}

/**
 * Muestra un mensaje de error debajo del formulario.
 */
function showError(msg) {
  let errorEl = document.getElementById('errorMessage');
  if (!errorEl) {
    errorEl = document.createElement('div');
    errorEl.id = 'errorMessage';
    errorEl.className = 'error-message';
    const form = document.getElementById('loginForm');
    form.parentNode.insertBefore(errorEl, form.nextSibling);
  }
  errorEl.textContent = msg;
}
