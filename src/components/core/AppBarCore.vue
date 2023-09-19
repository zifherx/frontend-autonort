<script setup>
import { useRoute, useRouter } from "vue-router";
import { useInitStore } from "stores/init.store";
import { storeToRefs } from "pinia";
import { useAuthStore } from "src/stores/auth.store";
import * as notif from "src/plugins/notifications";

const route = useRoute();
const router = useRouter();
const initStore = useInitStore();
const { drawer } = storeToRefs(initStore);
const authStore = useAuthStore();

const closeSession = () => {
    const askClosing = notif.askQuestion("Estás segur@ que deseas salir", "Nos vemos pronto");
    askClosing.then(async (result) => {
        if (result.isConfirmed) {
            await authStore.logoutSessionStore();
        }
    });
};

const goToProfile = () => {
    router.push("/profile");
};
</script>
<template>
    <q-header>
        <q-toolbar class="fullOpacity">
            <q-btn dense flat round color="primary" @click="drawer = !drawer">
                <q-icon :name="drawer ? 'menu' : 'more_vert'"></q-icon>
            </q-btn>

            <q-toolbar-title class="text-weight-bold text-primary text-uppercase">{{ route.name }}</q-toolbar-title>

            <q-space></q-space>

            <q-btn flat icon="person" color="white" text-color="dark" @click="goToProfile">
                <q-tooltip transition-show="flip-right" transition-hide="flip-left" class="bg-black text-body2" anchor="bottom start" self="top start" :offset="[10, 10]">
                    Perfil
                </q-tooltip>
            </q-btn>

            <q-btn flat icon="logout" color="white" text-color="dark" @click="closeSession()">
                <q-tooltip transition-show="flig-right" transition-hide="flip-left" class="bg-black text-body2" anchor="bottom start" self="top start" :offset="[10, 10]">
                    Cerrar Sesión
                </q-tooltip>
            </q-btn>
        </q-toolbar>
    </q-header>
</template>

<style>
.fullOpacity {
    background-color: #fff;
    opacity: 0.99;
}
</style>
