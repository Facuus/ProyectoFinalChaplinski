// turnero.js
document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('turnoForm');
  const select = document.getElementById('peluqueroSelect');
  const dni = localStorage.getItem('clienteDNI');
  let turnos = JSON.parse(localStorage.getItem('turnos')) || [];

  // Cargar peluqueros desde JSON remoto
  const res = await fetch('../data/peluqueros.json');
  const peluqueros = await res.json();
  peluqueros.forEach(p => {
    const option = document.createElement('option');
    option.value = p.nombre;
    option.textContent = p.nombre + ' — ' + p.especialidades.join(', ');
    select.appendChild(option);
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const peluquero = select.value;
    const nombre = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('telefono').value.trim();

    if (!diaEsValido(fecha)) {
      return Swal.fire('❌ Día inválido', 'Solo de martes a domingo.', 'error');
    }

    // Validar turno existente con mismo peluquero
    const ocupado = turnos.some(t => t.fecha === fecha && t.hora === hora && t.peluquero === peluquero);
    if (ocupado) {
      return Swal.fire('⛔ Turno ocupado', `${peluquero} ya tiene turno a esa hora.`, 'error');
    }

    // Validar mismo DNI en la misma semana
    const yaReservo = turnos.some(t => t.dni === dni && mismaSemana(t.fecha, fecha));
    if (yaReservo) {
      return Swal.fire('🚫 Restricción', 'Ya tenés un turno esta semana.', 'warning');
    }

    const nuevoTurno = { fecha, hora, peluquero, nombre, telefono, dni };
    turnos.push(nuevoTurno);
    localStorage.setItem('turnos', JSON.stringify(turnos));

    Swal.fire('✅ Turno reservado', `Turno con ${peluquero} el ${fecha} a las ${hora}.`, 'success');
    form.reset();
  });
});
