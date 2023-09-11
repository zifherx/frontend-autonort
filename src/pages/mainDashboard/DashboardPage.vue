<script setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "src/stores/auth.store";
import { API_INSTANCE_MAIN } from "src/boot/axios";
import { useRouter } from "vue-router";

const router = useRouter();

const useAuth = useAuthStore();
const { userStore } = storeToRefs(useAuth);

const init = () => {
    useAuth.detectUserStore();
    asignarTokenAxios();
};

const asignarTokenAxios = () => {
    console.log("Token establecido");
    console.log(userStore.value.token);
    API_INSTANCE_MAIN.defaults.headers["x-access-token"] = userStore.value.token;
    router.push("/dashboard/ventas");
};

init();
</script>

<template>
    <q-page></q-page>
</template>
