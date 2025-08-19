/**
 * flight-detail-back.js — Regreso con mismas cards que ida (av-card)
 * Mantiene tu modal/funciones. Sin cambios de lógica de negocio.
 */

/* Loader */
const loader = document.querySelector('.loader');
setTimeout(() => {
  try {
    document.body.classList.remove('sb-hidden');
    document.body.classList.remove('sb2-hidden');
    loader.classList.remove('show');
  } catch (e) { console.log(e); }
}, 1200);

/* Header (regreso: destino → origen) */
(function setHeaderBack(){
  const o = info.flightInfo.origin;
  const d = info.flightInfo.destination;
  const dateBack = info.flightInfo.flightDates[1] || info.flightInfo.flightDates[0];

  document.querySelector('#origin-code').textContent      = d.code;
  document.querySelector('#destination-code').textContent = o.code;
  document.querySelector('#flight-date').textContent      = monthDic[+dateBack.split('-')[1]-1] + ' ' + dateBack.split('-')[2];
  document.querySelector('#flight-label-1').textContent   = `Selecciona tu vuelo de regreso - ${formatDateType1(dateBack)}`;
  document.querySelector('#flight-label-2').textContent   = `${d.city} a ${o.city}`;
  document.querySelector('#flight-label-3').textContent   = `${formatDateType1(dateBack)}`;
})();

/* Relleno de “Desde …” igual al ida */
(function fillCardPrices(){
  const isNAC = (info.flightInfo.origin.country === 'Ecuador' && info.flightInfo.destination.country === 'Ecuador');
  const P = isNAC ? pricesNAC : pricesINT;

  const map = [
    ['#flight-price-0', 'flight_1'],
    ['#flight-price-1', 'flight_1'],
    ['#flight-price-2', 'flight_2'],
    ['#flight-price-3', 'flight_3'],
    ['#flight-price-4', 'flight_4'],
    ['#flight-price-5', 'flight_5'],
    ['#flight-price-6', 'flight_6'],
    ['#flight-price-7', 'flight_7'],
    ['#flight-price-8', 'flight_8'],
    ['#flight-price-9', 'flight_9'],
    ['#flight-price-10','flight_10'],
  ];

  map.forEach(([sel, key])=>{
    const el = document.querySelector(sel);
    if (!el || !P[key]) return;
    el.textContent = formatPrice(P[key].xs);
  });
})();

/* Editar búsqueda */
const btnEditFlight = document.querySelector('#btn-edit-flight');
btnEditFlight && btnEditFlight.addEventListener('click', ()=>{
  info.edit = 1; updateLS(); window.location.href = 'index.html';
});

/* Utilidades */
function updateLS(){ LS.setItem('info', JSON.stringify(info)); }
function formatDateType1(date){
  const dt = new Date(+date.split('-')[0], +date.split('-')[1]-1, +date.split('-')[2]-1);
  return dayDic[dt.getDay()] + ', ' + monthDic[dt.getMonth()] + ' ' + date.split('-')[2];
}
function formatPrice(n){ return Number(n).toLocaleString('en', { maximumFractionDigits: 2 }); }

/* Tu flujo existente (modal/inline) — sin cambios */
function loadFlight(flight_sched){
  try{ document.getElementById('modal-select-ticket').classList.add('show'); }catch(_){}
  info.flightInfo.ticket_sched = flight_sched; // mismo campo que usabas
  updateLS();

  const xs = document.querySelector('#xs');
  const s  = document.querySelector('#s');
  const m  = document.querySelector('#m');

  const isNAC = (info.flightInfo.origin.country === 'Ecuador' && info.flightInfo.destination.country === 'Ecuador');
  const P = isNAC ? pricesNAC : pricesINT;
  const F = P[flight_sched]; if (!F) return;

  xs && (xs.textContent = formatPrice(F.xs));
  s  && (s.textContent  = formatPrice(F.s));
  m  && (m.textContent  = formatPrice(F.m));
}

/* Cerrar modal (si lo usas) */
const closeModalTicket = document.querySelector('#modal-close-ticket');
closeModalTicket && closeModalTicket.addEventListener('click', ()=> {
  document.getElementById('modal-select-ticket').classList.remove('show');
});
