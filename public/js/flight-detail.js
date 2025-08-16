/**
 * FLIGHT DETAIL (dinámico hasta 10 vuelos)
 * Archivo completo para reemplazar.
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
  try {
    return new Intl.NumberFormat('es-CO').format(Number(v));
  } catch (e) {
    return String(v);
  }
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

function flightKeyByIndex(i) {
  return `flight_${i + 1}`;
}

function loadFlight(key) {
  // Mantén compatibilidad con tu flujo
  if (window.info && window.updateLS) {
    info.flightInfo.ticket = key;
    updateLS();
  }
  // Si tu flujo navega aquí, lo dejas:
  // window.location.href = 'step-two.html';
}

function formatDateSafe(ts) {
  try {
    return formatDateType1(ts);
  } catch (e) {
    return '';
  }
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
  if (label2) {
    label2.textContent = `${info?.flightInfo?.origin?.city ?? ''} a ${info?.flightInfo?.destination?.city ?? ''}`;
  }
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

  const xsList = [];
  for (let i = 0; i < max; i++) {
    const key = flightKeyByIndex(i);
    const xs = ptab[key]?.xs ?? null;
    xsList.push(xs);
  }
  const xsNumbers = xsList.filter(v => v != null).map(Number);
  const minXs = xsNumbers.length ? Math.min(...xsNumbers) : null;

  for (let i = 0; i < max; i++) {
    const slot = flightSlots[i];
    const key = flightKeyByIndex(i);
    const prices = ptab[key];

    if (!prices) continue;

    const node = cardTpl.content.firstElementChild.cloneNode(true);

    node.querySelector('.time-start').textContent = slot.start;
    node.querySelector('.time-end').textContent = slot.end;
    node.querySelector('.flight-code').textContent = slot.code;
    node.querySelector('.flight-duration').textContent = slot.duration;

    const priceEl = node.querySelector('.price-value');
    const val = Number(prices.xs);
    priceEl.textContent = asPrice(isNaN(val) ? prices.xs : val.toFixed(2));

    if (minXs != null && Number(prices.xs) === Number(minXs)) {
      const best = node.querySelector('.best-price-label');
      if (best) best.style.display = '';
    }

    node.addEventListener('click', () => loadFlight(key));
    cardsContainer.appendChild(node);
  }
}

(function init() {
  try {
    document.body?.classList?.remove?.('sb-hidden');
    loader?.classList?.remove?.('show');
  } catch (e) {}
  renderHeaderAndFrom();
  renderCards();
})();
