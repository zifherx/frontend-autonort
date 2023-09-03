import * as notif from "src/plugins/notifications";

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

    // return obj;
    notif.alertError(obj.title, obj.message);
    // Swal.fire({
    //     icon: "error",
    //     title: obj.title,
    //     text: obj.message,
    //     showConfirmButton: false,
    //     allowOutsideClick: false,
    //     allowEscapeKey: false,
    //     timerProgressBar: true,
    //     timer: counterTimer,
    //     didOpen: (a) => {
    //         a.addEventListener("mouseenter", Swal.stopTimer);
    //         a.addEventListener("mouseleave", Swal.resumeTimer);
    //     },
    // });
}
