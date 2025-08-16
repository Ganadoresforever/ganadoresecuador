/**
 * FLIGHT DETAIL (REGRESO) — dinámico hasta 10 vuelos (v2)
 * - Renderiza tarjetas desde <template>
 * - Click: selecciona vuelo, marca activo y actualiza XS/S/M
 * - Encabezados correctos (origen/destino invertidos + fecha regreso)
 */

const loader = document.querySelector('.loader');
const cardsContainer = document.querySelector('#flight-cards');
const cardTpl = document.querySelector('#flight-card-template');

/* ===== CÓDIGOS IATA DE FALLBACK ===== */
const IATA_FALLBACK = {
  // Colombia
  "Bogotá": "BOG", "Cali": "CLO", "Medellín": "MDE",
  // Ecuador
  "Quito": "UIO", "Guayaquil": "GYE", "Manta": "MEC", "Cuenca": "CUE"
};

/* ===== Utilidades ===== */
function isNacional() {
  // Si ambos son Ecuador, consideramos nacional
  return (
    info?.flightInfo?.origin?.country === 'Ecuador' &&
    info?.flightInfo?.destination?.country === 'Ecuador'
  );
}
function priceTable() { return isNacional() ? pricesNAC : pricesINT; }
function asPrice(v) {
  if (typeof formatPrice === 'function') return formatPrice(v);
  try { return new Intl.NumberFormat('es-CO').format(Number(v)); }
  catch { return String(v); }
}
function normalizeDate(val) {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const t = Date.parse(val);
    return isNaN(t) ? Date.now() : t;
  }
  return Date.now();
}
function getDateByType(info, typeIdx) {
  const arr = (info?.flightInfo?.flightDates || []).map(normalizeDate);
  return arr[typeIdx] ?? Date.now();
}

/* ===== Slots de horarios/códigos (edita si quieres) ===== */
const flightSlots = [
  { start: '07:15', end: '08:30', code: 'AV 8908', duration: '1h 15m' },
  { start: '10:00', end: '11:15', code: 'AV 8904', duration: '1h 15m' },
  { start: '16:45', end: '18:00', code: 'AV 8704', duration: '1h 15m' },
  { start: '18:30', end: '19:45', code: 'AV 8710', duration: '1h 15m' },
  { start: '20:00', end: '21:15', code: 'AV 8720', duration: '1h 15m' },
  { start: '06:00', end: '07:15', code: 'AV 8801', duration: '1h 15m' },
  { start: '08:45', end: '10:00', code: 'AV 8803', duration: '1h 15m' },
  { start: '12:10', end: '13:25', code: 'AV 8805', duration: '1h 15m' },
  { start: '13:40', end: '14:55', code: 'AV 8807', duration: '1h 15m' },
  { start: '22:10', end: '23:25', code: 'AV 8809', duration: '1h 15m' },
];
function flightKeyByIndex(i) { return `flight_${i + 1}`; }

/* ===== Interacciones ===== */
function updateTariffPrices(key) {
  const p = priceTable()[key];
  if (!p) return;
  const elXS = document.querySelector('#xs');
  const elS  = document.querySelector('#s');
  const elM  = document.querySelector('#m');
  if (elXS) elXS.textContent = asPrice(p.xs.toFixed ? p.xs.toFixed(2) : p.xs);
  if (elS)  elS.textContent  = asPrice(p.s.toFixed  ? p.s.toFixed(2)  : p.s);
  if (elM)  elM.textContent  = asPrice(p.m.toFixed  ? p.m.toFixed(2)  : p.m);
}
function scrollToTariffs() {
  const section = document.querySelector('.tickets');
  (section || document.querySelector('.card-ticket') || document.querySelector('#xs'))
    ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
function setActiveCard(node) {
  cardsContainer.querySelectorAll('.card-departure.active')
    .forEach(n => n.classList.remove('active'));
  node.classList.add('active');
}
function loadFlight(key, node) {
  if (window.info) {
    info.flightInfo.ticket = key; // guardo selección
    try { updateLS && updateLS(); } catch {}
  }
  updateTariffPrices(key);
  if (node) setActiveCard(node);
  scrollToTariffs();
}

/* ===== Encabezados (REGRESO: invertir origen/destino) ===== */
function renderHeaderAndFrom() {
  // En regreso, origen = destino de ida ; destino = origen de ida
  const o = info?.flightInfo?.destination || {};
  const d = info?.flightInfo?.origin || {};

  const oCode = o.code || IATA_FALLBACK[o.city] || '';
  const dCode = d.code || IATA_FALLBACK[d.city] || '';

  const elOC = document.querySelector('#origin-code');
  const elDC = document.querySelector('#destination-code');
  if (elOC) elOC.textContent = oCode;
  if (elDC) elDC.textContent = dCode;

  const dateIdx = 1; // regreso
  const theDate = getDateByType(info, dateIdx);

  const elL1 = document.querySelector('#flight-label-1');
  const elL2 = document.querySelector('#flight-label-2');
  const elL3 = document.querySelector('#flight-label-3');
  if (elL1) elL1.textContent = `Selecciona tu vuelo de regreso - ${formatDateType1(theDate)}`;
  if (elL2) elL2.textContent = `${o.city || ''} a ${d.city || ''}`;
  if (elL3) elL3.textContent = `${formatDateType1(theDate)}`;

  // “Desde”
  const fromSpan = document.querySelector('#flight-price-0');
  const ptab = priceTable();
  const firstPrice = (ptab['flight_1']?.xs ?? ptab['flight_1']?.xs);
  if (fromSpan && firstPrice != null) {
    const val = Number(firstPrice);
    fromSpan.textContent = (typeof formatPrice === 'function')
      ? formatPrice(isNaN(val) ? firstPrice : val.toFixed(2))
      : new Intl.NumberFormat('es-CO').format(isNaN(val) ? firstPrice : val.toFixed(2));
  }
}

/* ===== Render de tarjetas ===== */
function renderCards() {
  if (!cardsContainer || !cardTpl) return;
  cardsContainer.innerHTML = '';

  const ptab = priceTable();
  const max = Math.min(10, flightSlots.length);

  // mejor precio para el badge
  const xsValues = [];
  for (let i = 0; i < max; i++) {
    const k = flightKeyByIndex(i);
    const xs = ptab[k]?.xs;
    if (xs != null) xsValues.push(Number(xs));
  }
  const minXs = xsValues.length ? Math.min(...xsValues) : null;

  for (let i = 0; i < max; i++) {
    const slot = flightSlots[i];
    const k = flightKeyByIndex(i);
    const prices = ptab[k];
    if (!prices) continue;

    const card = cardTpl.content.firstElementChild.cloneNode(true);
    card.querySelector('.time-start').textContent = slot.start;
    card.querySelector('.time-end').textContent   = slot.end;
    card.querySelector('.flight-code').textContent = slot.code;
    card.querySelector('.flight-duration').textContent = slot.duration;

    const priceEl = card.querySelector('.price-value');
    priceEl.textContent = asPrice((prices.xs.toFixed ? prices.xs.toFixed(2) : prices.xs));

    if (minXs != null && Number(prices.xs) === Number(minXs)) {
      const best = card.querySelector('.best-price-label');
      if (best) best.style.display = '';
    }

    card.style.cursor = 'pointer';
    card.addEventListener('click', () => loadFlight(k, card));
    cardsContainer.appendChild(card);
  }

  // selección por defecto
  const firstKey = [...Array(max).keys()].map(i => flightKeyByIndex(i)).find(k => !!ptab[k]);
  if (firstKey) {
    updateTariffPrices(firstKey);
    const firstCard = cardsContainer.querySelector('.card-departure');
    if (firstCard) firstCard.classList.add('active');
  }
}

/* ===== Init ===== */
(function init() {
  try {
    document.body?.classList?.remove?.('sb-hidden');
    document.body?.classList?.remove?.('sb2-hidden');
    loader?.classList?.remove?.('show');
  } catch {}
  renderHeaderAndFrom();
  renderCards();
})();
