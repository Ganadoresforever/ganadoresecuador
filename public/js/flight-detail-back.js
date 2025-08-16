/**
 * SET DOM
 * 
 */
const modal = document.querySelector('#modal-select-ticket');

const loader = document.querySelector('.loader');
setTimeout(() =>{
    try{
        document.querySelector('body').classList.remove('sb-hidden');
        loader.classList.remove('show');

        if(info.edit === 1){
            btnSearchFlight.click();
        }

    }catch(err){
        console.log(err);
    }
}, 2500);

const closeModalTicket = document.querySelector('#modal-close-ticket');
closeModalTicket.addEventListener('click', () =>{
    try{
        modal.classList.remove('show');
    }catch(e){
        console.log(e);
    }
});


/* --- HEADER --- */
document.querySelector('#origin-code').textContent = info.flightInfo.destination.code;
document.querySelector('#destination-code').textContent = info.flightInfo.origin.code;
document.querySelector('#flight-date').textContent = monthDic[info.flightInfo.flightDates[1].split('-')[1] - 1] + ' ' +info.flightInfo.flightDates[1].split('-')[2];
document.querySelector('#flight-label-1').textContent = `Selecciona tu vuelo de regreso - ${formatDateType1(info.flightInfo.flightDates[1])}`;
document.querySelector('#flight-label-2').textContent = `${info.flightInfo.destination.city} a ${info.flightInfo.origin.city}`;
document.querySelector('#flight-label-3').textContent = `${formatDateType1(info.flightInfo.flightDates[1])}`;


/* --- FLIGHT CARDS --- */
if(info.flightInfo.origin.country === 'Ecuador' && info.flightInfo.destination.country === 'Ecuador'){
    // NAC: “Desde …” y precios visibles en las tarjetas
    document.querySelector('#flight-price-0').textContent  = formatPrice(pricesNAC.flight_1.xs.toFixed(2));
    document.querySelector('#flight-price-1').textContent  = formatPrice(pricesNAC.flight_1.xs.toFixed(2));
    document.querySelector('#flight-price-2').textContent  = formatPrice(pricesNAC.flight_2.xs.toFixed(2));
    document.querySelector('#flight-price-3').textContent  = formatPrice(pricesNAC.flight_3.xs.toFixed(2));
    // añadidos 4..10 si existen en el HTML
    document.querySelector('#flight-price-4')  && (document.querySelector('#flight-price-4').textContent  = formatPrice(pricesNAC.flight_4.xs.toFixed(2)));
    document.querySelector('#flight-price-5')  && (document.querySelector('#flight-price-5').textContent  = formatPrice(pricesNAC.flight_5.xs.toFixed(2)));
    document.querySelector('#flight-price-6')  && (document.querySelector('#flight-price-6').textContent  = formatPrice(pricesNAC.flight_6.xs.toFixed(2)));
    document.querySelector('#flight-price-7')  && (document.querySelector('#flight-price-7').textContent  = formatPrice(pricesNAC.flight_7.xs.toFixed(2)));
    document.querySelector('#flight-price-8')  && (document.querySelector('#flight-price-8').textContent  = formatPrice(pricesNAC.flight_8.xs.toFixed(2)));
    document.querySelector('#flight-price-9')  && (document.querySelector('#flight-price-9').textContent  = formatPrice(pricesNAC.flight_9.xs.toFixed(2)));
    document.querySelector('#flight-price-10') && (document.querySelector('#flight-price-10').textContent = formatPrice(pricesNAC.flight_10.xs.toFixed(2)));
}else{
    // INT
    document.querySelector('#flight-price-0').textContent  = formatPrice(pricesINT.flight_1.xs.toFixed(2));
    document.querySelector('#flight-price-1').textContent  = formatPrice(pricesINT.flight_1.xs.toFixed(2));
    document.querySelector('#flight-price-2').textContent  = formatPrice(pricesINT.flight_2.xs.toFixed(2));
    document.querySelector('#flight-price-3').textContent  = formatPrice(pricesINT.flight_3.xs.toFixed(2));
    // añadidos 4..10 si existen en el HTML
    document.querySelector('#flight-price-4')  && (document.querySelector('#flight-price-4').textContent  = formatPrice(pricesINT.flight_4.xs.toFixed(2)));
    document.querySelector('#flight-price-5')  && (document.querySelector('#flight-price-5').textContent  = formatPrice(pricesINT.flight_5.xs.toFixed(2)));
    document.querySelector('#flight-price-6')  && (document.querySelector('#flight-price-6').textContent  = formatPrice(pricesINT.flight_6.xs.toFixed(2)));
    document.querySelector('#flight-price-7')  && (document.querySelector('#flight-price-7').textContent  = formatPrice(pricesINT.flight_7.xs.toFixed(2)));
    document.querySelector('#flight-price-8')  && (document.querySelector('#flight-price-8').textContent  = formatPrice(pricesINT.flight_8.xs.toFixed(2)));
    document.querySelector('#flight-price-9')  && (document.querySelector('#flight-price-9').textContent  = formatPrice(pricesINT.flight_9.xs.toFixed(2)));
    document.querySelector('#flight-price-10') && (document.querySelector('#flight-price-10').textContent = formatPrice(pricesINT.flight_10.xs.toFixed(2)));
}



/**
 * BUTTONS
 * 
 */
const btnEditFlight = document.querySelector('#btn-edit-flight');
btnEditFlight.addEventListener('click', ()=>{
    info.edit = 1;
    updateLS();
    window.location.href = 'index.html';
});



/**
 * FUNCTIONS
 * 
 */
function updateLS(){
    LS.setItem('info', JSON.stringify(info));
}

function formatDateType1(date){
    let format = new Date(parseInt(date.split('-')[0]), parseInt(date.split('-')[1]) - 1, parseInt(date.split('-')[2]) - 1);
    return dayDic[format.getDay()] + ', ' + monthDic[format.getMonth()] + ' ' + date.split('-')[2];
}

function formatPrice(number){
    return number.toLocaleString('es', {
        maximumFractionDigits: 2,
        useGrouping: true
    });
}

function loadFlight(flight_sched){
    //Open modal
    try{
        modal.classList.add('show');
    }catch(err){
        console.log(err);
    }

    info.flightInfo.ticket_sched = flight_sched;
    updateLS();

    const xsPrice = document.querySelector('#xs');
    const sPrice  = document.querySelector('#s');
    const mPrice  = document.querySelector('#m');

    if(info.flightInfo.origin.country === 'Ecuador' && info.flightInfo.destination.country === 'Ecuador'){
        // Set type
        info.flightInfo.ticket_nat = 'NAC';
        updateLS();

        if(flight_sched === 'flight_1'){
            xsPrice.textContent = formatPrice(pricesNAC.flight_1.xs)
            sPrice.textContent  = formatPrice(pricesNAC.flight_1.s)
            mPrice.textContent  = formatPrice(pricesNAC.flight_1.m)
        }else if(flight_sched === 'flight_2'){
            xsPrice.textContent = formatPrice(pricesNAC.flight_2.xs)
            sPrice.textContent  = formatPrice(pricesNAC.flight_2.s)
            mPrice.textContent  = formatPrice(pricesNAC.flight_2.m)
        }else if(flight_sched === 'flight_3'){
            xsPrice.textContent = formatPrice(pricesNAC.flight_3.xs)
            sPrice.textContent  = formatPrice(pricesNAC.flight_3.s)
            mPrice.textContent  = formatPrice(pricesNAC.flight_3.m)
        }else if(flight_sched === 'flight_4'){
            xsPrice.textContent = formatPrice(pricesNAC.flight_4.xs)
            sPrice.textContent  = formatPrice(pricesNAC.flight_4.s)
            mPrice.textContent  = formatPrice(pricesNAC.flight_4.m)
        }else if(flight_sched === 'flight_5'){
            xsPrice.textContent = formatPrice(pricesNAC.flight_5.xs)
            sPrice.textContent  = formatPrice(pricesNAC.flight_5.s)
            mPrice.textContent  = formatPrice(pricesNAC.flight_5.m)
        }else if(flight_sched === 'flight_6'){
            xsPrice.textContent = formatPrice(pricesNAC.flight_6.xs)
            sPrice.textContent  = formatPrice(pricesNAC.flight_6.s)
            mPrice.textContent  = formatPrice(pricesNAC.flight_6.m)
        }else if(flight_sched === 'flight_7'){
            xsPrice.textContent = formatPrice(pricesNAC.flight_7.xs)
            sPrice.textContent  = formatPrice(pricesNAC.flight_7.s)
            mPrice.textContent  = formatPrice(pricesNAC.flight_7.m)
        }else if(flight_sched === 'flight_8'){
            xsPrice.textContent = formatPrice(pricesNAC.flight_8.xs)
            sPrice.textContent  = formatPrice(pricesNAC.flight_8.s)
            mPrice.textContent  = formatPrice(pricesNAC.flight_8.m)
        }else if(flight_sched === 'flight_9'){
            xsPrice.textContent = formatPrice(pricesNAC.flight_9.xs)
            sPrice.textContent  = formatPrice(pricesNAC.flight_9.s)
            mPrice.textContent  = formatPrice(pricesNAC.flight_9.m)
        }else if(flight_sched === 'flight_10'){
            xsPrice.textContent = formatPrice(pricesNAC.flight_10.xs)
            sPrice.textContent  = formatPrice(pricesNAC.flight_10.s)
            mPrice.textContent  = formatPrice(pricesNAC.flight_10.m)
        }
    }else{
        // Set type
        info.flightInfo.ticket_nat = 'INT';
        updateLS();

        if(flight_sched === 'flight_1'){
            xsPrice.textContent = formatPrice(pricesINT.flight_1.xs)
            sPrice.textContent  = formatPrice(pricesINT.flight_1.s)
            mPrice.textContent  = formatPrice(pricesINT.flight_1.m)
        }else if(flight_sched === 'flight_2'){
            xsPrice.textContent = formatPrice(pricesINT.flight_2.xs)
            sPrice.textContent  = formatPrice(pricesINT.flight_2.s)
            mPrice.textContent  = formatPrice(pricesINT.flight_2.m)
        }else if(flight_sched === 'flight_3'){
            xsPrice.textContent = formatPrice(pricesINT.flight_3.xs)
            sPrice.textContent  = formatPrice(pricesINT.flight_3.s)
            mPrice.textContent  = formatPrice(pricesINT.flight_3.m)
        }else if(flight_sched === 'flight_4'){
            xsPrice.textContent = formatPrice(pricesINT.flight_4.xs)
            sPrice.textContent  = formatPrice(pricesINT.flight_4.s)
            mPrice.textContent  = formatPrice(pricesINT.flight_4.m)
        }else if(flight_sched === 'flight_5'){
            xsPrice.textContent = formatPrice(pricesINT.flight_5.xs)
            sPrice.textContent  = formatPrice(pricesINT.flight_5.s)
            mPrice.textContent  = formatPrice(pricesINT.flight_5.m)
        }else if(flight_sched === 'flight_6'){
            xsPrice.textContent = formatPrice(pricesINT.flight_6.xs)
            sPrice.textContent  = formatPrice(pricesINT.flight_6.s)
            mPrice.textContent  = formatPrice(pricesINT.flight_6.m)
        }else if(flight_sched === 'flight_7'){
            xsPrice.textContent = formatPrice(pricesINT.flight_7.xs)
            sPrice.textContent  = formatPrice(pricesINT.flight_7.s)
            mPrice.textContent  = formatPrice(pricesINT.flight_7.m)
        }else if(flight_sched === 'flight_8'){
            xsPrice.textContent = formatPrice(pricesINT.flight_8.xs)
            sPrice.textContent  = formatPrice(pricesINT.flight_8.s)
            mPrice.textContent  = formatPrice(pricesINT.flight_8.m)
        }else if(flight_sched === 'flight_9'){
            xsPrice.textContent = formatPrice(pricesINT.flight_9.xs)
            sPrice.textContent  = formatPrice(pricesINT.flight_9.s)
            mPrice.textContent  = formatPrice(pricesINT.flight_9.m)
        }else if(flight_sched === 'flight_10'){
            xsPrice.textContent = formatPrice(pricesINT.flight_10.xs)
            sPrice.textContent  = formatPrice(pricesINT.flight_10.s)
            mPrice.textContent  = formatPrice(pricesINT.flight_10.m)
        }
    }
}

function nextStep(type){
    window.location.href = 'step-two.html';
}
