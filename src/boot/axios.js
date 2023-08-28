import { boot } from "quasar/wrappers";
import axios from "axios";
import { globalVariables } from "src/Global";

const API_INSTANCE_MAIN = axios.create({
    baseURL: globalVariables.URL_HEROKU_SERVER_PUBLIC,
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    },
});

const API_INSTANCE_PERUDEV = axios.create({
    baseURL: globalVariables.URL_PERUDEV_SERVER_PUBLIC,
    params: { api_token: globalVariables.TOKEN_PERU_DEV },
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    },
});

export default boot(({ app }) => {
    app.config.globalProperties.$axios = axios;

    app.config.globalProperties.$api = API_INSTANCE_MAIN;
});

export { API_INSTANCE_MAIN, API_INSTANCE_PERUDEV };
