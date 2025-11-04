// auth.js
// guarda "dni" ,valida
document.addEventListener('DOMContentLoaded', () => {
  const dni = localStorage.getItem('clienteDNI');
  const path = window.location.pathname;


  // lo devulve al logn
  if (path.includes('turnero.html') && !dni) {
    window.location.href = './login.html';
  }

  if (document.getElementById('dniDisplay')) {
    document.getElementById('dniDisplay').textContent = `DNI actual: ${dni}`;
  }
});
