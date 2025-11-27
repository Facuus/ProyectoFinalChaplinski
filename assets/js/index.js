// index.js — manejo del login y chequeo de turnos previos

const form = document.getElementById('dniForm');
const inputDni = document.getElementById('dniInput');
const turnoActual = document.getElementById('turnoActual');

// Si ya hay DNI guardado, mostrar info o redirigir
const dniGuardado = localStorage.getItem('clienteDNI');

form.addEventListener('submit', e => {
  e.preventDefault();

  const dni = inputDni.value.trim();

  if (!dni || dni.length < 6) {
    return Swal.fire('DNI inválido', 'Ingrese un DNI válido.', 'error');
  }

  localStorage.setItem('clienteDNI', dni);

  const turnos = JSON.parse(localStorage.getItem('turnos')) || [];
  const turnoCliente = turnos.find(t => t.dni === dni);

  if (turnoCliente) {
    Swal.fire({
      title: 'Ya tenés un turno reservado',
      html: `
        <b>Día:</b> ${turnoCliente.fecha}<br>
        <b>Hora:</b> ${turnoCliente.hora}<br>
        <b>Peluquero:</b> ${turnoCliente.peluquero}
      `,
      icon: 'info',
      confirmButtonText: 'Aceptar'
    });

    turnoActual.textContent =
      `Tenés un turno con ${turnoCliente.peluquero} el ${turnoCliente.fecha} a las ${turnoCliente.hora}.`;

  } else {
    window.location.href = './pages/turnero.html';
  }
});
