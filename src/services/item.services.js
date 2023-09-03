import { API_INSTANCE_MAIN } from "src/boot/axios";

const getAllService = async (endpoint) => await API_INSTANCE_MAIN.get(endpoint);
const postService = async (endpoint, thing) => await API_INSTANCE_MAIN.post(endpoint, thing);
const getServiceById = async (endpoint, itemId) => await API_INSTANCE_MAIN.get(endpoint + "/" + itemId);
const getActiveService = async (endpoint) => await API_INSTANCE_MAIN.get(endpoint + "/activos");
const patchUpdateServiceById = async (endpoint, itemId, newThing) => await API_INSTANCE_MAIN.patch(endpoint + "/" + itemId, newThing);
const deleteServiceById = async (endpoint, itemId) => await API_INSTANCE_MAIN.delete(endpoint + "/" + itemId);

//Access Service
const loginService = async (item) => await API_INSTANCE_MAIN.post("auth/login", item);
const logoutService = async () => await API_INSTANCE_MAIN.post("auth/logout");

export { postService, getServiceById, getActiveService, loginService, logoutService, getAllService, patchUpdateServiceById, deleteServiceById };
