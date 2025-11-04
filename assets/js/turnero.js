// turnero.js - Manejo de reservas con fotos y validaciones
document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('turnoForm');
  const select = document.getElementById('peluqueroSelect');
  const contenedor = document.getElementById('listaPeluqueros');
  const dni = localStorage.getItem('clienteDNI');
  let turnos = JSON.parse(localStorage.getItem('turnos')) || [];

  // Mostrar el DNI activo
  document.getElementById('dniDisplay').textContent = `DNI actual: ${dni}`;

  try {
    const res = await fetch('../data/peluqueros.json');
    const peluqueros = await res.json();

    // Renderizar tarjetas visuales
    peluqueros.forEach(p => {
      const card = document.createElement('div');
      card.className = 'peluquero-card';
      card.innerHTML = `
        <img src="${p.imagen}" alt="${p.nombre}" class="peluquero-img">
        <h3>${p.nombre}</h3>
        <p class="especialidades">${p.especialidades.join(' • ')}</p>
      `;
      contenedor.appendChild(card);

      // Llenar el selector también
      const option = document.createElement('option');
      option.value = p.nombre;
      option.textContent = `${p.nombre} — ${p.especialidades.join(', ')}`;
      select.appendChild(option);
    });
  } catch (error) {
    Swal.fire('Error', 'No se pudieron cargar los peluqueros.', 'error');
    return;
  }

  // Envío del formulario
  form.addEventListener('submit', e => {
    e.preventDefault();

    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const peluquero = select.value;
    const nombre = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('telefono').value.trim();

    if (!fecha || !hora || !peluquero || !nombre || !telefono) {
      return Swal.fire(' Campos incompletos', 'Completá todos los campos.', 'warning');
    }

    const dia = dayjs(fecha).day(); // 0=Domingo, 1=Lunes...
    if (dia === 1) {
      return Swal.fire(' Dia No laborable', 'Solo se puede reservar de martes a domingo.', 'error');
    }

    // Verificar si el peluquero ya tiene turno
    const ocupado = turnos.some(t => t.fecha === fecha && t.hora === hora && t.peluquero === peluquero);
    if (ocupado) {
      return Swal.fire(' Turno ocupado', `${peluquero} ya tiene turno a esa hora.`, 'error');
    }

    // Verificar si el mismo DNI tiene un turno esta en lasemana
    const yaReservo = turnos.some(t => t.dni === dni && dayjs(t.fecha).isSame(fecha, 'week'));
    if (yaReservo) {
      return Swal.fire(' ATENCION', 'Ya tenrs un turno esta semana.', 'warning');
    }

    // Guardar el turno
    const nuevoTurno = { fecha, hora, peluquero, nombre, telefono, dni };
    turnos.push(nuevoTurno);
    localStorage.setItem('turnos', JSON.stringify(turnos));

    Swal.fire({
      title: ' Turno reservado',
      text: `Turno con ${peluquero} el ${fecha} a las ${hora}.`,
      icon: 'success',
      confirmButtonText: 'Aceptar'
    }).then(() => {
      window.location.href = '../index.html';
    });
  });
});
