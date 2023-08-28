import { defineStore } from "pinia";
import { getServiceById, loginService, logoutService } from "src/services";
import { ref } from "vue";
import { useRouter } from "vue-router";
import * as pro from "src/plugins/helper";
import * as notif from "src/plugins/notifications";

export const useAuthStore = defineStore("Auth", () => {
    let userStore = ref(null);
    let onlineStore = ref(null);

    const router = useRouter();

    const loginSessionStore = async (user) => {
        try {
            const query = await loginService(user);

            if (pro.HTTPResponse(query.status)) {
                let loggedUser = {
                    token: query.data.token,
                    userId: query.data.codigo,
                };

                userStore.value = loggedUser;
                console.log("Usuario conectado ♥");
                localStorage.setItem("data-token", userStore.value.token);
                localStorage.setItem("data-user", userStore.value.userId);

                const notify = notif.notify_Succesfull("¡Login Exitoso!");
                notify.then(() => router.push("/dashboard"));
                // router.push("/dashboard");
            }
        } catch (err) {
            console.log(err);
            console.log(err.response);
        }
    };
    const detectUserStore = async () => {
        const userLocalStorage = localStorage.getItem("data-token");
        if (pro.checkNullOrUndefined(userLocalStorage)) userStore.value = null;
        let userDetected = {
            token: localStorage.getItem("data-token"),
            userId: localStorage.getItem("data-user"),
        };
        userStore.value = userDetected;
    };
    const getUserStore = async () => {
        detectUserStore();
        try {
            const query = await getServiceById("users", userStore.value.userId);
            if (pro.HTTPResponse(query.status)) onlineStore.value = query.data.one;
        } catch (err) {
            console.log(err);
            console.log(err.response);
        }
    };
    const logoutSessionStore = async () => {
        if (!pro.checkNullOrUndefined(userStore)) {
            try {
                const query = await logoutService();
                if (pro.HTTPResponse(query.status)) {
                    userStore.value = null;
                    onlineStore.value = null;
                    console.log("Usuario desconectado ♠");
                }
            } catch (err) {
                console.log(err);
                console.log(err.response);
            }
            localStorage.removeItem("data-token");
            localStorage.removeItem("data-user");
            router.push("/");
        }
    };

    return {
        userStore,
        onlineStore,
        loginSessionStore,
        detectUserStore,
        getUserStore,
        logoutSessionStore,
    };
});
