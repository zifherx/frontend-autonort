import { API_INSTANCE_MAIN } from "src/boot/axios";

const postService = async (endpoint, thing) => await API_INSTANCE_MAIN.post(endpoint, thing);
const getServiceById = async (endpoint, itemId) => await API_INSTANCE_MAIN.get(endpoint + "/" + itemId);
const getActiveService = async (endpoint) => await API_INSTANCE_MAIN.get(endpoint + "/activos");

//Access Service
const loginService = async (item) => await API_INSTANCE_MAIN.post("auth/login", item);
const logoutService = async () => await API_INSTANCE_MAIN.post("auth/logout");

export { postService, getServiceById, getActiveService, loginService, logoutService };
