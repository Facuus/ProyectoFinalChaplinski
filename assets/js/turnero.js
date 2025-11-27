// ======================================================
// turnero.js 
// ======================================================

// Elementos del formulario
const form = document.getElementById('turnoForm');
const select = document.getElementById('peluqueroSelect');
const contenedor = document.getElementById('listaPeluqueros');

const dniCliente = localStorage.getItem('clienteDNI');

// Cargar turnos previos desde localStorage
let turnos = JSON.parse(localStorage.getItem('turnos')) || [];

// ------------------------------------------------------
// Validar  DNI 
// ------------------------------------------------------
if (!dniCliente) {
  window.location.href = '../index.html';
}

// Mostrar DNI en pantalla
document.getElementById('dniDisplay').textContent = `DNI actual: ${dniCliente}`;

// ------------------------------------------------------
// Cargar peluqueros desde JSON
// ------------------------------------------------------
async function cargarPeluqueros() {
  try {
    const res = await fetch('../data/peluqueros.json');
    if (!res.ok) throw new Error("No se pudo leer el archivo JSON");

    const peluqueros = await res.json();

    peluqueros.forEach(p => {
      // Tarjeta visual
      const card = document.createElement('div');
      card.className = 'peluquero-card';
      card.innerHTML = `
        <img src="${p.imagen}" alt="${p.nombre}" class="peluquero-img">
        <h3>${p.nombre}</h3>
        <p class="especialidades">${p.especialidades.join(' • ')}</p>
      `;
      contenedor.appendChild(card);

      // Opción del select
      const option = document.createElement('option');
      option.value = p.nombre;
      option.textContent = `${p.nombre} — ${p.especialidades.join(', ')}`;
      select.appendChild(option);
    });

  } catch (err) {
    console.error(err);
    Swal.fire('Error', 'No se pudieron cargar los peluqueros.', 'error');
  }
}

// Llamar a la función
cargarPeluqueros();


// Envío del formulario del turno
// ------------------------------------------------------
form.addEventListener('submit', e => {
  e.preventDefault();

  const fecha = document.getElementById('fecha').value;
  const hora = document.getElementById('hora').value;
  const nombre = document.getElementById('nombre').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const peluquero = select.value;

  // Validación
  if (!fecha || !hora || !nombre || !telefono || !peluquero) {
    return Swal.fire('Campos incompletos', 'Completá todos los campos.', 'warning');
  }

  // No permitir lunes (1 = lunes)
  const diaSemana = dayjs(fecha).day();
  if (diaSemana === 1) {
    return Swal.fire('Día no laborable', 'Solo se puede reservar de martes a domingo.', 'error');
  }

  // Verificar si el peluquero ya tiene un turno
  const ocupado = turnos.some(t =>
    t.fecha === fecha &&
    t.hora === hora &&
    t.peluquero === peluquero
  );

  if (ocupado) {
    return Swal.fire('Turno ocupado', `${peluquero} ya tiene un turno a esa hora.`, 'error');
  }

  // Verificar que el cliente no reserve 2 veces en la misma semana
  const yaReservo = turnos.some(t =>
    t.dni === dniCliente && dayjs(t.fecha).isSame(fecha, 'week')
  );

  if (yaReservo) {
    return Swal.fire('Atención', 'Ya tenés un turno esta semana.', 'warning');
  }

  // Nuevo turno
  const nuevoTurno = {
    fecha,
    hora,
    peluquero,
    nombre,
    telefono,
    dni: dniCliente
  };

  // Guardar turno
  turnos.push(nuevoTurno);
  localStorage.setItem('turnos', JSON.stringify(turnos));

  // Confirma
  Swal.fire({
    title: 'Turno reservado',
    text: `Turno con ${peluquero} el ${fecha} a las ${hora}.`,
    icon: 'success',
    confirmButtonText: 'Aceptar'
  }).then(() => {
    window.location.href = '../index.html';
  });
});