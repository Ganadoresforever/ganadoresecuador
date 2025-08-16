/**
 * FLIGHT DETAIL (dinámico hasta 10 vuelos) — v2
 * - Renderiza hasta 10 tarjetas
 * - Al hacer click en una tarjeta: fija precios XS/S/M y deja listo el botón (nextStep)
 */

const loader = document.querySelector('.loader');
const cardsContainer = document.querySelector('#flight-cards');
const cardTpl = document.querySelector('#flight-card-template');

function isNacional() {
  return (
    info?.flightInfo?.origin?.country === 'Ecuador' &&
    info?.flightInfo?.destination?.country === 'Ecuador'
  );
}

function priceTable() {
  return isNacional() ? pricesNAC : pricesINT;
}

function asPrice(v) {
  if (typeof formatPrice === 'function') return formatPrice(v);
  try { return new Intl.NumberFormat('es-CO').format(Number(v)); }
  catch { return String(v); }
}

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

function formatDateSafe(ts) {
  try { return formatDateType1(ts); } catch { return ''; }
}

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
    info.flightInfo.ticket = key;
    try { updateLS && updateLS(); } catch {}
  }
  updateTariffPrices(key);
  if (node) setActiveCard(node);
  scrollToTariffs();
}

function renderHeaderAndFrom() {
  const label1 = document.querySelector('#flight-label-1');
  const label2 = document.querySelector('#flight-label-2');
  const label3 = document.querySelector('#flight-label-3');
  const fromSpan = document.querySelector('#flight-price-0');

  if (label1) {
    const idx = (info?.flightInfo?.type === 1) ? 0 : 1;
    label1.textContent = `Selecciona tu vuelo de ${info?.flightInfo?.type === 1 ? 'salida' : 'regreso'} - ${formatDateSafe(info?.flightInfo?.flightDates?.[idx])}`;
  }
  if (label2) label2.textContent = `${info?.flightInfo?.origin?.city ?? ''} a ${info?.flightInfo?.destination?.city ?? ''}`;
  if (label3) {
    const idx = (info?.flightInfo?.type === 1) ? 0 : 1;
    label3.textContent = `${formatDateSafe(info?.flightInfo?.flightDates?.[idx])}`;
  }

  const ptab = priceTable();
  const firstKey = flightKeyByIndex(0);
  const firstPrice = (ptab[firstKey]?.xs ?? ptab['flight_1']?.xs);
  if (fromSpan && firstPrice != null) {
    const val = Number(firstPrice);
    fromSpan.textContent = asPrice(isNaN(val) ? firstPrice : val.toFixed(2));
  }
}

function renderCards() {
  if (!cardsContainer || !cardTpl) return;
  cardsContainer.innerHTML = '';

  const ptab = priceTable();
  const max = Math.min(10, flightSlots.length);

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
      card.querySelector('.best-price-label').style.display = '';
    }

    card.style.cursor = 'pointer';
    card.addEventListener('click', () => loadFlight(k, card));

    cardsContainer.appendChild(card);
  }

  const firstKey = [...Array(max).keys()].map(i => flightKeyByIndex(i)).find(k => !!ptab[k]);
  if (firstKey) {
    updateTariffPrices(firstKey);
    const firstCard = cardsContainer.querySelector('.card-departure');
    if (firstCard) firstCard.classList.add('active');
  }
}

(function init() {
  try { document.body?.classList?.remove?.('sb-hidden'); loader?.classList?.remove?.('show'); } catch {}
  renderHeaderAndFrom();
  renderCards();
})();
