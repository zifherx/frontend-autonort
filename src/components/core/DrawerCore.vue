<script setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "src/stores/auth.store";
import { useInitStore } from "src/stores/init.store";
import { computed, ref } from "vue";

const initStore = useInitStore();
const { drawer } = storeToRefs(initStore);

const authStore = useAuthStore();
const { onlineStore } = storeToRefs(authStore);

const init = async () => {
    await authStore.getUserStore();
};

const urlLogo = ref("/src/assets/logo-autonort-white.png");

const onlineLogged = computed(() => {
    return {
        avatar: onlineStore.value?.avatar,
        name: onlineStore.value?.name,
        email: onlineStore.value?.email,
        username: onlineStore.value?.username,
        role: onlineStore.value?.roles.map((a) => a.name),
    };
});

const rutaPrefixDashboard = ref("/dashboard");
const adminDashboard = ref([
    { title: "Dashboard Ventas", icon: "memory", to: "/ventas" },
    { title: "Dashboard CRM", icon: "share", to: "/crm" },
]);

const rutaPrefixAdmin = ref("/administrative");
const adminItems = ref([
    { title: "Configuraciones", icon: "settings_applications", to: "/settings" },
    { title: "Permisos", icon: "vpn_lock", to: "/license" },
    { title: "Roles", icon: "fingerprint", to: "/roles" },
    { title: "Usuarios", icon: "groups", to: "/users" },
    { title: "Vehículos", icon: "directions_car", to: "/vehicles" },
    { title: "Vendedores", icon: "diversity_3", to: "/sellers" },
]);

const rutaPrefixComercial = ref("/commercial");
const comercialItems = ref([
    { title: "ADV", icon: "inventory", to: "/adv" },
    { title: "Canal Digital", icon: "share", to: "/canal-digital" },
    { title: "Cadena de Valor", icon: "support_agent", to: "/cadena-valor" },
    { title: "Conexos", icon: "emergency", to: "/conexos" },
    { title: "Cierres", icon: "monitor", to: "/cierre" },
    { title: "PDS", icon: "thumb_up", to: "/pds" },
    { title: "Ventas", icon: "payments", to: "/ventas" },
]);

const rutaPrefixDC = ref("/dc");
const dcItems = ref([{ title: "Actividades", icon: "local_activity", to: "/activities" }]);

const rutaPrefixFinanzas = ref("/finances");
const finanzasItems = ref([{ title: "Divisas", icon: "currency_exchange", to: "/divisas" }]);

const rutaPrefixRecursosHumanos = ref("/rrhh");
const rrhhItems = ref([{ title: "Planillas", icon: "article", to: "/planillas" }]);

init();
</script>
<template>
    <q-drawer show-if-above :model-value="drawer" :width="300" :breakpoint="500" class="bg-black" side="left" bordered>
        <q-scroll-area class="scrollArea">
            <q-list padding class="text-white">
                <q-separator dark class="q-mb-md" />

                <q-item dense>
                    <q-item-section avatar>
                        <q-avatar size="6em">
                            <q-img :src="onlineLogged.avatar" fit="contain" />
                        </q-avatar>
                    </q-item-section>

                    <q-item-section>
                        <q-item-label class="text-white text-weight-bold text-body2">
                            {{ onlineLogged.name }}
                        </q-item-label>

                        <q-item-label>
                            <div v-for="(item, index) in onlineLogged.role" :key="index">
                                <q-chip size="sm" color="primary" text-color="white">
                                    {{ item }}
                                </q-chip>
                            </div>
                        </q-item-label>

                        <q-item-label caption="" class="text-white">
                            {{ onlineLogged.email }}
                        </q-item-label>
                    </q-item-section>
                </q-item>

                <q-separator dark class="q-mb-md" />

                <q-expansion-item expand-separator icon="dashboard" label="Dashboard">
                    <q-item v-for="(item, index) in adminDashboard" :key="index" :to="rutaPrefixDashboard + item.to" :inset-level="0.5" clickable active-class="primary">
                        <q-item-section avatar>
                            <q-icon color="white" :name="item.icon" />
                        </q-item-section>

                        <q-item-section>
                            {{ item.title }}
                        </q-item-section>
                    </q-item>
                </q-expansion-item>

                <q-expansion-item expand-separator icon="settings_suggest" label="Administración">
                    <q-item v-for="(item, index) in adminItems" :key="index" :to="rutaPrefixAdmin + item.to" :inset-level="0.5" clickable active-class="primary">
                        <q-item-section avatar>
                            <q-icon color="white" :name="item.icon" />
                        </q-item-section>

                        <q-item-section>{{ item.title }}</q-item-section>
                    </q-item>
                </q-expansion-item>

                <q-expansion-item expand-separator icon="store" label="Comercial">
                    <q-item v-for="(item, index) in comercialItems" :key="index" :to="rutaPrefixComercial + item.to" :inset-level="0.5" clickable active-class="primary">
                        <q-item-section avatar>
                            <q-icon color="white" :name="item.icon" />
                        </q-item-section>

                        <q-item-section>{{ item.title }}</q-item-section>
                    </q-item>
                </q-expansion-item>

                <q-expansion-item expand-separator icon="support_agent" label="DC">
                    <q-item v-for="(item, index) in dcItems" :key="index" :to="rutaPrefixDC + item.to" :inset-level="0.5" clickable active-class="primary">
                        <q-item-section avatar>
                            <q-icon color="white" :name="item.icon" />
                        </q-item-section>

                        <q-item-section>{{ item.title }}</q-item-section>
                    </q-item>
                </q-expansion-item>

                <q-expansion-item expand-separator icon="account_balance" label="Finanzas">
                    <q-item v-for="(item, index) in finanzasItems" :key="index" :to="rutaPrefixFinanzas + item.to" :inset-level="0.5" clickable active-class="primary">
                        <q-item-section avatar>
                            <q-icon color="white" :name="item.icon" />
                        </q-item-section>

                        <q-item-section>{{ item.title }}</q-item-section>
                    </q-item>
                </q-expansion-item>

                <q-expansion-item expand-separator icon="groups" label="Recursos Humanos">
                    <q-item v-for="(item, index) in rrhhItems" :key="index" :to="rutaPrefixRecursosHumanos + item.to" :inset-level="0.5" clickable active-class="primary">
                        <q-item-section avatar>
                            <q-icon color="white" :name="item.icon" />
                        </q-item-section>

                        <q-item-section>{{ item.title }}</q-item-section>
                    </q-item>
                </q-expansion-item>
            </q-list>
        </q-scroll-area>

        <q-img class="fixed-top q-mx-auto q-mt-lg" :src="urlLogo" :placeholder-src="urlLogo" loading="lazy" spinner-color="white" style="max-width: 200px" fit="contain" />
    </q-drawer>
</template>

<style>
.scrollArea {
    height: calc(100% - 150px);
    margin-top: 100px;
    border-right: 1px solid #ddd;
}
</style>
