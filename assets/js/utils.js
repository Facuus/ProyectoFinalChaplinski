// utils.js - funciones de utilidad
function diaEsValido(fecha) {
  const dia = dayjs(fecha).day(); // 0=Domingo, 1=Lunes...
  return dia !== 1; // Lunes no
}

function mismaSemana(fecha1, fecha2) {
  return dayjs(fecha1).isSame(fecha2, 'week');
}
