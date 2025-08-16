/**
 * FLIGHT DETAIL (IDA) — Rescate estable
 * - Pinta hasta 10 vuelos desde <template>
 * - Click selecciona y actualiza XS/S/M
 * - Ruta y fecha correctas
 * - Se auto-crea el template si faltara en el HTML
 */

const loader = document.querySelector('.loader');

/* ==== asegura contenedor + template aunque falten en el HTML ==== */
function ensureCardsInfra() {
  let cards = document.querySelector('#flight-cards');
  if (!cards) {
    const main = document.querySelector('main') || document.body;
    cards = document.createElement('div');
    cards.id = 'flight-cards';
    main.appendChild(cards);
  }
  let tpl = document.querySelector('#flight-card-template');
  if (!tpl) {
    tpl = document.createElement('template');
    tpl.id = 'flight-card-template';
    tpl.innerHTML = `
      <div class="card-departure mt-2">
        <div class="best-price-label" style="display:none;"><p>Mejor precio</p></div>
        <p class="fs-5 text-center mt-3">
          <span class="flight-direct">Directo</span> •
          <span class="flight-duration">1h 15m</span> •
          <span class="flight-code">AV 0000</span>
        </p>
        <div class="card-departure-distance">
          <h4 class="time-start">07:15</h4><hr><h4 class="time-end">08:30</h4>
        </div>
        <p class="fs-6 mt-2">Incluye trayecto operado por Avianca</p>
        <h4 class="text-end mt-1">$<span class="price-value">0</span></h4>
      </div>`;
    cards.insertAdjacentElement('afterend', tpl);
  }
}
ensureCardsInfra();

const cardsContainer = document.querySelector('#flight-cards');
const cardTpl = document.querySelector('#flight-card-template');

/* ==== IATA fallback ==== */
const IATA_FALLBACK = {
  "Bogotá":"BOG","Cali":"CLO","Medellín":"MDE",
  "Quito":"UIO","Guayaquil":"GYE","Manta":"MEC","Cuenca":"CUE"
};

/* ==== util ==== */
function isNacional(){
  return (info?.flightInfo?.origin?.country === 'Ecuador' &&
          info?.flightInfo?.destination?.country === 'Ecuador');
}
function priceTable(){ return isNacional() ? pricesNAC : pricesINT; }
function asPrice(v){
  if (typeof formatPrice==='function') return formatPrice(v);
  return new Intl.NumberFormat('es-CO').format(Number(v));
}
function normalizeDate(v){
  if (typeof v==='number') return v;
  const t = Date.parse(v||''); return isNaN(t)? Date.now(): t;
}
function getDateByType(info, idx){
  const arr=(info?.flightInfo?.flightDates||[]).map(normalizeDate);
  return arr[idx] ?? Date.now();
}

/* ==== horarios/códigos (10) ==== */
const flightSlots = [
  { start:'07:15', end:'08:30', code:'AV 8908', duration:'1h 15m' },
  { start:'10:00', end:'11:15', code:'AV 8904', duration:'1h 15m' },
  { start:'16:45', end:'18:00', code:'AV 8704', duration:'1h 15m' },
  { start:'18:30', end:'19:45', code:'AV 8710', duration:'1h 15m' },
  { start:'20:00', end:'21:15', code:'AV 8720', duration:'1h 15m' },
  { start:'06:00', end:'07:15', code:'AV 8801', duration:'1h 15m' },
  { start:'08:45', end:'10:00', code:'AV 8803', duration:'1h 15m' },
  { start:'12:10', end:'13:25', code:'AV 8805', duration:'1h 15m' },
  { start:'13:40', end:'14:55', code:'AV 8807', duration:'1h 15m' },
  { start:'22:10', end:'23:25', code:'AV 8809', duration:'1h 15m' },
];
const flightKeyByIndex = i => `flight_${i+1}`;

/* ==== interacciones ==== */
function updateTariffPrices(key){
  const p = priceTable()[key]; if(!p) return;
  const elXS=document.querySelector('#xs'), elS=document.querySelector('#s'), elM=document.querySelector('#m');
  if(elXS) elXS.textContent = asPrice(p.xs);
  if(elS)  elS.textContent  = asPrice(p.s);
  if(elM)  elM.textContent  = asPrice(p.m);
}
function setActiveCard(node){
  cardsContainer.querySelectorAll('.card-departure.active').forEach(n=>n.classList.remove('active'));
  node.classList.add('active');
}
function loadFlight(key, node){
  if(window.info){ info.flightInfo.ticket = key; try{updateLS&&updateLS();}catch{} }
  updateTariffPrices(key);
  if(node) setActiveCard(node);
  (document.querySelector('.tickets')||document.querySelector('.card-ticket')||document.querySelector('#xs'))?.scrollIntoView({behavior:'smooth',block:'center'});
}

/* ==== encabezados (IDA) ==== */
function renderHeaderAndFrom(){
  const o=info?.flightInfo?.origin||{}, d=info?.flightInfo?.destination||{};
  const oCode=o.code||IATA_FALLBACK[o.city]||'', dCode=d.code||IATA_FALLBACK[d.city]||'';
  const elOC=document.querySelector('#origin-code'), elDC=document.querySelector('#destination-code');
  if(elOC) elOC.textContent=oCode; if(elDC) elDC.textContent=dCode;

  const theDate = getDateByType(info, 0);
  const L1=document.querySelector('#flight-label-1'), L2=document.querySelector('#flight-label-2'), L3=document.querySelector('#flight-label-3');
  if(L1) L1.textContent = `Selecciona tu vuelo de salida - ${formatDateType1(theDate)}`;
  if(L2) L2.textContent = `${o.city||''} a ${d.city||''}`;
  if(L3) L3.textContent = `${formatDateType1(theDate)}`;

  const fromSpan=document.querySelector('#flight-price-0');
  const ptab=priceTable(); const firstPrice=ptab['flight_1']?.xs;
  if(fromSpan && firstPrice!=null) fromSpan.textContent = asPrice(firstPrice);
}

/* ==== render tarjetas ==== */
function renderCards(){
  if(!cardsContainer||!cardTpl) return;
  cardsContainer.innerHTML='';

  const ptab=priceTable(); const max=Math.min(10, flightSlots.length);
  const xsVals=[]; for(let i=0;i<max;i++){ const k=flightKeyByIndex(i); if(ptab[k]?.xs!=null) xsVals.push(Number(ptab[k].xs)); }
  const minXs = xsVals.length? Math.min(...xsVals): null;

  for(let i=0;i<max;i++){
    const slot=flightSlots[i]; const k=flightKeyByIndex(i); const prices=ptab[k]; if(!prices) continue;
    const card=cardTpl.content.firstElementChild.cloneNode(true);
    card.querySelector('.time-start').textContent=slot.start;
    card.querySelector('.time-end').textContent=slot.end;
    card.querySelector('.flight-code').textContent=slot.code;
    card.querySelector('.flight-duration').textContent=slot.duration;
    card.querySelector('.price-value').textContent = asPrice(prices.xs);
    if(minXs!=null && Number(prices.xs)===minXs){ card.querySelector('.best-price-label').style.display=''; }
    card.style.cursor='pointer';
    card.addEventListener('click', ()=>loadFlight(k, card));
    cardsContainer.appendChild(card);
  }
  const firstKey=[...Array(max).keys()].map(i=>flightKeyByIndex(i)).find(k=>!!ptab[k]);
  if(firstKey){ updateTariffPrices(firstKey); const first=cardsContainer.querySelector('.card-departure'); if(first) first.classList.add('active'); }
}

/* ==== init ==== */
(function init(){
  try{ document.body?.classList?.remove?.('sb-hidden'); document.body?.classList?.remove?.('sb2-hidden'); loader?.classList?.remove?.('show'); }catch{}
  renderHeaderAndFrom(); renderCards();
})();
