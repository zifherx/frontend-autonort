import * as notif from "src/plugins/notifications";

// HTTP RESPONSES

export function HTTPResponse__200(response) {
    return response === 200 ? true : false;
}

export function HTTPResponse(response) {
    const mapResponse = {
        200: true,
        201: true,
    };
    return mapResponse[response] ?? false;
}

// VALIDATING

export function checkNullOrUndefined(field) {
    const map = {
        null: true,
        undefined: true,
        "": true,
    };
    return map[field] ?? false;
}

export function cleanTable(table) {
    table.splice(table, table.length);
}

// ERRORS HANDLING

export function handleError(param) {
    let obj = {};
    switch (param.status) {
        case 400:
            obj.code = param.status;
            obj.title = "¡Sesión caducada!";
            obj.message = param.data.message;
            break;
        case 401:
            obj.code = param.status;
            obj.title = "¡No Autorizado!";
            obj.message = param.data.message;
            break;
        case 403:
            obj.code = param.status;
            obj.title = "Acceso Prohibido";
            obj.message = param.data.message;
            break;
        case 404:
            obj.code = param.status;
            obj.title = "No Encontrado";
            obj.message = param.data.message;
            break;
        case 409:
            obj.code = param.status;
            obj.title = "Error con Token";
            obj.message = param.data.message;
            break;
        case 500:
            obj.code = param.status;
            obj.title = "Error en Servidor";
            obj.message = param.data.message;
            break;
        case 503:
            obj.code = param.status;
            obj.title = "Error en Servidor";
            obj.message = param.data.message;
            break;
        default:
            obj.code = 0;
            obj.title = "Error";
            obj.message = param.data.message;
            break;
    }

    notif.alertError(obj.title, obj.message);
}

// COLORS

export function colorSede(item) {
    if (item === "Jaén") return "purple-6";
    else if (item === "Trujillo") return "amber-7";
    else if (item === "Chachapoyas") return "blue-6";
    else if (item === "Tarapoto") return "green-6";
    else if (item === "Todas") return "red-10";
    else return "brown-4";
}

export function colorArea(item) {
    if (item === "ADMINISTRACIÓN") return "grey-10";
    else if (item === "ADV") return "blue-grey-8";
    else if (item === "BACK OFFICE") return "deep-orange-10";
    else if (item === "CADENA VALOR") return "orange-5";
    else if (item === "CANAL DIGITAL") return "cyan-13";
    else if (item === "CONEXOS") return "purple-10";
    else if (item === "CONTABILIDAD") return "brown-9";
    else if (item === "DC") return "red-13";
    else if (item === "EPDP") return "pink-9";
    else if (item === "FINANZAS") return "indigo-14";
    else if (item === "GERENCIA") return "deep-purple-10";
    else if (item === "MAF") return "red-7";
    else if (item === "MARKETING") return "pink-5";
    else if (item === "PDS") return "amber-10";
    else if (item === "PLANEAMIENTO COMERCIAL") return "lime-10";
    else if (item === "REPUESTOS") return "purple";
    else if (item === "RRHH") return "yellow-10";
    else if (item === "SEMINUEVOS") return "deep-orange-4";
    else if (item === "SERVICIOS") return "orange-8";
    else if (item === "SERVICIOS GENERALES") return "cyan-10";
    else if (item === "TASACIONES") return "light-blue-13";
    else if (item === "TI") return "purple-12";
    else if (item === "TRÁMITES") return "blue-10";
    else if (item === "TUNNING") return "cyan-8";
    else if (item === "VENTAS") return "green-10";
}

// ABREVIATURAS

export function abreviaturaSede(item) {
    if (item === "Jaén") return "JAE";
    else if (item === "Trujillo") return "TRU";
    else if (item === "Chachapoyas") return "CHA";
    else if (item === "Tarapoto") return "TAR";
    else if (item === "Todas") return "TOD";
}

export function abreviaturaArea(item) {
    if (item === "ADMINISTRACIÓN") return "ADM";
    else if (item === "ADV") return "ADV";
    else if (item === "BACK OFFICE") return "BO";
    else if (item === "CADENA VALOR") return "CV";
    else if (item === "CANAL DIGITAL") return "CD";
    else if (item === "CONEXOS") return "COX";
    else if (item === "CONTABILIDAD") return "CON";
    else if (item === "DC") return "DC";
    else if (item === "EPDP") return "EPDP";
    else if (item === "FINANZAS") return "FIN";
    else if (item === "GERENCIA") return "GER";
    else if (item === "MAF") return "MAF";
    else if (item === "MARKETING") return "MKT";
    else if (item === "PDS") return "PDS";
    else if (item === "PLANEAMIENTO COMERCIAL") return "PLC";
    else if (item === "REPUESTOS") return "REP";
    else if (item === "RRHH") return "RH";
    else if (item === "SEMINUEVOS") return "SEN";
    else if (item === "SERVICIOS") return "SER";
    else if (item === "SERVICIOS GENERALES") return "SG";
    else if (item === "TASACIONES") return "TAS";
    else if (item === "TI") return "TI";
    else if (item === "TRÁMITES") return "TRA";
    else if (item === "TUNNING") return "TUN";
    else if (item === "VENTAS") return "VEN";
}

export function abreviaturaRol(word) {
    let inicial = word.split("-");
    if (inicial.length === 3) {
        return inicial[0].slice(0, 1).toUpperCase() + inicial[1].slice(0, 1).toUpperCase() + inicial[2].slice(0, 1).toUpperCase();
    } else if (inicial.length === 2) {
        return inicial[0].slice(0, 1).toUpperCase() + inicial[1].slice(0, 1).toUpperCase();
    } else {
        return inicial[0].slice(0, 3).toUpperCase();
    }
}

// DATES

export function formattingDate(date, option) {
    let newDate = new Date(date);

    let yearX = newDate.getUTCFullYear();
    let monthX = newDate.getUTCMonth() + 1;
    let dayX = newDate.getUTCDate();

    if (monthX < 10) monthX = "0" + monthX;
    if (dayX < 10) dayX = "0" + dayX;

    let hourFromDate = newDate.toTimeString();

    let newDate2 = new Date();
    let hourX = newDate2.getHours() + ":" + newDate2.getMinutes() + ":" + newDate2.getSeconds();

    switch (option) {
        case 1:
            return yearX + "-" + monthX + "-" + dayX + " " + hourFromDate.substring(0, 8);
        // break;
        case 2:
            return yearX + "-" + monthX + "-" + dayX + " " + hourX;
        // break;
        case 3:
            return yearX + "-" + monthX + "-" + dayX;
        // break;
    }
}
