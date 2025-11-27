// auth.js — valida acceso a páginas protegidas

const dni = localStorage.getItem('clienteDNI');
const path = window.location.pathname;

// Si intenta acceder al turnero sin DNI, volver al index
if (path.includes('turnero.html') && !dni) {
  window.location.href = '../index.html';
}

// Si existe dniDisplay, mostrar DNI actual
const dniDisplay = document.getElementById('dniDisplay');
if (dniDisplay && dni) {
  dniDisplay.textContent = `DNI actual: ${dni}`;
}
