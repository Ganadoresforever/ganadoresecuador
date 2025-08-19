/**
 * flight-detail-back.js — Regreso con TARIFAS INLINE (toggle) + fallback modal
 * Mantiene tu lógica, datasets (pricesNAC/INT) y el modal como respaldo.
 */

const INLINE_FARES = true; // pon false para usar el modal como antes
let _lastClickedCard = null;

// recordar la card clickeada
document.addEventListener('click', (e)=>{
  const c = e.target.closest('.card-departure, .av-card');
  if (c) _lastClickedCard = c;
});

/* ===== SET DOM ===== */
const modal = document.querySelector('#modal-select-ticket');

const loader = document.querySelector('.loader');
setTimeout(() =>{
  try{
    document.querySelector('body').classList.remove('sb-hidden');
    document.querySelector('body').classList.remove('sb2-hidden'); // quita también esta clase
    loader.classList.remove('show');

    if(info.edit === 1){
      btnSearchFlight && btnSearchFlight.click && btnSearchFlight.click();
    }

  }catch(err){
    console.log(err);
  }
}, 2500);

const closeModalTicket = document.querySelector('#modal-close-ticket');
closeModalTicket && closeModalTicket.addEventListener('click', () =>{
  try{ modal.classList.remove('show'); }catch(e){ console.log(e); }
});


/* --- HEADER (regreso: destino → origen) --- */
(function setHeaderBack(){
  const o = info.flightInfo.origin;
  const d = info.flightInfo.destination;
  const dateBack = info.flightInfo.flightDates[1] || info.flightInfo.flightDates[0];

  document.querySelector('#origin-code').textContent      = d.code;
  document.querySelector('#destination-code').textContent = o.code;
  document.querySelector('#flight-date').textContent      = monthDic[dateBack.split('-')[1] - 1] + ' ' + dateBack.split('-')[2];
  document.querySelector('#flight-label-1').textContent   = `Selecciona tu vuelo de regreso - ${formatDateType1(dateBack)}`;
  document.querySelector('#flight-label-2').textContent   = `${d.city} a ${o.city}`;
  document.querySelector('#flight-label-3').textContent   = `${formatDateType1(dateBack)}`;
})();

/* --- FLIGHT CARDS (relleno de “Desde…”) --- */
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

/**
 * BUTTONS
 */
const btnEditFlight = document.querySelector('#btn-edit-flight');
btnEditFlight && btnEditFlight.addEventListener('click', ()=>{
  info.edit = 1;
  updateLS();
  window.location.href = 'index.html';
});

/**
 * FUNCTIONS
 */
function updateLS(){
  LS.setItem('info', JSON.stringify(info));
}

function formatDateType1(date){
  let format = new Date(parseInt(date.split('-')[0]), parseInt(date.split('-')[1]) - 1, parseInt(date.split('-')[2]) - 1);
  return dayDic[format.getDay()] + ', ' + monthDic[format.getMonth()] + ' ' + date.split('-')[2];
}

// Formato estilo USD/inglés (igual que en ida)
function formatPrice(number){
  return Number(number).toLocaleString('en', {
    maximumFractionDigits: 2
  });
}

/* ================================================================
   MODO INLINE (toggle debajo del vuelo) o MODAL (respaldo)
   ================================================================ */
function loadFlight(flight_sched){
  // Guardamos selección del regreso
  info.flightInfo.ticket_sched_back = flight_sched;

  const isNAC = (info.flightInfo.origin.country === 'Ecuador' && info.flightInfo.destination.country === 'Ecuador');
  info.flightInfo.ticket_nat = isNAC ? 'NAC' : 'INT';
  updateLS();

  if (INLINE_FARES) {
    const card = getCardForFlight(flight_sched);
    // Toggle: si ya está abierto para esta card, cerrar
    if (card && card.nextElementSibling && card.nextElementSibling.classList.contains('av-inline-fares')) {
      card.nextElementSibling.remove();
      return;
    }
    setTimeout(()=>{ renderInlineFares(flight_sched); }, 0);
    return;
  }

  // ----- Respaldo: MODO MODAL -----
  try{ modal.classList.add('show'); }catch(err){ console.log(err); }

  const xsPrice = document.querySelector('#xs');
  const sPrice  = document.querySelector('#s');
  const mPrice  = document.querySelector('#m');

  const P = isNAC ? pricesNAC : pricesINT;
  const F = P[flight_sched];
  if (xsPrice && sPrice && mPrice && F){
    xsPrice.textContent = formatPrice(F.xs);
    sPrice.textContent  = formatPrice(F.s);
    mPrice.textContent  = formatPrice(F.m);
  }
}

function getCardForFlight(flight_sched){
  if (_lastClickedCard && _lastClickedCard.matches('.card-departure, .av-card')) return _lastClickedCard;
  const all = Array.from(document.querySelectorAll('.card-departure[onclick], .av-card[onclick]'));
  return all.find(el => (el.getAttribute('onclick') || '').includes(flight_sched)) || all[0];
}

function renderInlineFares(flight_sched){
  // Cerrar otros paneles abiertos
  document.querySelectorAll('.av-inline-fares').forEach(p => p.remove());

  const card = getCardForFlight(flight_sched);
  if (!card){ console.warn('No se encontró card'); return; }

  const isNAC = (info.flightInfo.origin.country === 'Ecuador' && info.flightInfo.destination.country === 'Ecuador');
  const P = isNAC ? pricesNAC : pricesINT;
  const F = P[flight_sched];
  if (!F){ console.warn('No hay precios para', flight_sched); return; }

  const html = `
    <div class="av-inline-fares" data-flight="\${flight_sched}">
      <div class="av-inline-fares__top">
        <h3 class="av-choose-title">Elige cómo quieres volar (regreso)</h3>
        <button class="av-inline-close" type="button">Cerrar</button>
      </div>
      <div class="av-fares-grid">
        <div class="card-container xs">
          <div class="card-ticket">
            <h2 class="card-ticket-type">Basic</h2>
            <p class="card-ticket-label">Vuela ligero</p>
            <div class="card-ticket-items">
              <div class="ct-item"><img src="./assets/svg/personalItemLowest-XS.svg" width="18"><p>1 artículo personal (bolso)</p></div>
              <div class="ct-item" style="text-decoration: underline;"><img src="./assets/svg/icon-alert-denied.svg" width="18"><p>Restricciones de la tarifa</p></div>
            </div>
          </div>
          <div class="card-ticket-header" data-next="xs">
            <h6 class="fs-3">$${formatPrice(F.xs)}</h6>
            <p class="fs-5">Precio por pasajero</p>
          </div>
        </div>

        <div class="card-container s">
          <div class="card-ticket">
            <h2 class="card-ticket-type">Classic</h2>
            <p class="card-ticket-label">Más completo</p>
            <div class="card-ticket-items">
              <div class="ct-item"><img src="./assets/svg/S_1.svg" width="18"><p>1 artículo personal (bolso)</p></div>
              <div class="ct-item"><img src="./assets/svg/S_2.svg" width="18"><p>1 equipaje de mano (10kg)</p></div>
              <div class="ct-item"><img src="./assets/svg/S_3.svg" width="18"><p>1 equipaje de bodega (23kg)</p></div>
              <div class="ct-item"><img src="./assets/svg/S_4.svg" width="18"><p>Check-in en aeropuerto</p></div>
              <div class="ct-item"><img src="./assets/svg/S_5.svg" width="18"><p>Asiento Economy</p></div>
              <div class="ct-item"><img src="./assets/svg/S_6.svg" width="18"><p>Acumula lifemiles</p></div>
              <div class="ct-item" style="text-decoration: underline;"><img src="./assets/svg/icon-alert-denied.svg" width="18"><p>Restricciones de la tarifa</p></div>
            </div>
          </div>
          <div class="card-ticket-header" data-next="s">
            <h6 class="fs-3">$${formatPrice(F.s)}</h6>
            <p class="fs-5">Precio por pasajero</p>
          </div>
        </div>

        <div class="card-container m">
          <div class="card-ticket">
            <h2 class="card-ticket-type">Flex</h2>
            <p class="card-ticket-label">Más posibilidades</p>
            <div class="card-ticket-items">
              <div class="ct-item"><img src="./assets/svg/M_1.svg" width="18"><p>1 artículo personal (bolso)</p></div>
              <div class="ct-item"><img src="./assets/svg/M_2.svg" width="18"><p>1 equipaje de mano (10kg)</p></div>
              <div class="ct-item"><img src="./assets/svg/M_3.svg" width="18"><p>1 equipaje de bodega (23kg)</p></div>
              <div class="ct-item"><img src="./assets/svg/M_4.svg" width="18"><p>Check-in en aeropuerto</p></div>
              <div class="ct-item"><img src="./assets/svg/M_5.svg" width="18"><p>Asiento Economy</p></div>
              <div class="ct-item"><img src="./assets/svg/M_6.svg" width="18"><p>Acumula lifemiles</p></div>
              <div class="ct-item"><img src="./assets/svg/M_7.svg" width="18"><p>Reembolso</p></div>
              <div class="ct-item"><img src="./assets/svg/M_8.svg" width="18"><p>Cambios de vuelo</p></div>
              <div class="ct-item" style="text-decoration: underline;"><img src="./assets/svg/icon-alert-denied.svg" width="18"><p>Restricciones de la tarifa</p></div>
            </div>
          </div>
          <div class="card-ticket-header" data-next="m">
            <h6 class="fs-3">$${formatPrice(F.m)}</h6>
            <p class="fs-5">Precio por pasajero</p>
          </div>
        </div>
      </div>
    </div>
  `;

  // Insertar debajo de la card
  card.insertAdjacentHTML('afterend', html);

  const panel = card.nextElementSibling;
  if (!panel) return;

  // botón cerrar
  const btnClose = panel.querySelector('.av-inline-close');
  btnClose && btnClose.addEventListener('click', ()=> panel.remove());

  // seleccionar tarifa → paso siguiente (regreso)
  panel.addEventListener('click', (e)=>{
    const btn = e.target.closest('.card-ticket-header');
    if (!btn) return;
    nextStepBack(btn.dataset.next);
  });

  panel.scrollIntoView({ behavior:'smooth', block:'start' });
}

/* Cerrar si haces click fuera del panel */
document.addEventListener('click', (e)=>{
  const insidePanel = e.target.closest('.av-inline-fares');
  const insideCard  = e.target.closest('.card-departure, .av-card');
  if (!insidePanel && !insideCard) {
    document.querySelectorAll('.av-inline-fares').forEach(p => p.remove());
  }
});

/* ===== Paso siguiente (REGRESO) ===== */
function nextStepBack(type){
  info.flightInfo.ticket_type_back = type;
  updateLS();
  window.location.href = 'step-two.html';
}

/* ===== Mantén tu función modal por compatibilidad (si la usas) ===== */
function nextStep(type){
  // si el modal viejo se usa, al menos guardamos tipo_back
  info.flightInfo.ticket_type_back = type;
  updateLS();
  window.location.href = 'step-two.html';
}
