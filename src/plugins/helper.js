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
