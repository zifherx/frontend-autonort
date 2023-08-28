<script setup>
import { computed, ref } from "vue";
import { useAuthStore } from "stores/auth.store";

const authStore = useAuthStore();
const { loginSessionStore } = authStore;

const account = ref({
    username: "",
    password: "",
});

const defaultAccount = ref({
    username: "",
    password: "",
});

const inputFillCancelled = ref(false);
const isPwd = ref(true);
const loading = ref([]);

const inputShadowText = computed(() => {
    if (inputFillCancelled.value === true) return "";

    const placeHolderUsername = "Ingrese usuario";

    const inputEmpty = typeof account.value.username !== "string" || account.value.username.length === 0;

    if (inputEmpty === true) return placeHolderUsername;
    if (placeHolderUsername.indexOf(account.value.username) !== 0) return "";
});

function loginAccount(number) {
    this.loading[number] = true;

    setTimeout(() => {
        // console.log("Valores:", account.value);
        loginSessionStore(account.value);
    }, 2000);

    setTimeout(() => {
        this.loading[number] = false;
        this.account = Object.assign({}, this.defaultAccount);
    }, 5000);
}
</script>

<template>
    <div class="q-pa-lg vertical-middle">
        <q-card>
            <q-card-section>
                <div class="text-h4 text-uppercase text-primary text-weight-bold text-center">Login</div>
            </q-card-section>
            <q-form class="q-gutter-sm q-pa-md" @submit.prevent="loginAccount(3)">
                <q-card-section>
                    <q-input
                        v-model="account.username"
                        class="q-mb-md"
                        color="primary"
                        label="Usuario"
                        :shadow-text="inputShadowText"
                        outlined
                        clearable
                        autofocus
                        :disable="loading[3]"
                    >
                        <template v-slot:prepend>
                            <q-icon name="account_circle" color="primary"></q-icon>
                        </template>
                    </q-input>
                    <q-input v-model="account.password" :type="isPwd ? 'password' : 'text'" color="primary" label="Contraseña" outlined :disable="loading[3]" autocomplete>
                        <template v-slot:prepend>
                            <q-icon name="lock" color="primary"></q-icon>
                        </template>
                        <template v-slot:append>
                            <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" color="primary" @click="isPwd = !isPwd"></q-icon>
                        </template>
                    </q-input>
                </q-card-section>
                <q-card-actions>
                    <q-btn class="full-width" color="primary" type="submit" :disable="loading[3]" :loading="loading[3]">
                        <q-icon left name="login"></q-icon>
                        <div class="text-h5">LOGIN</div>
                        <template v-slot:loading>
                            <q-spinner-hourglass class="on-left" />
                            Creando sesión
                        </template>
                    </q-btn>
                </q-card-actions>
            </q-form>
        </q-card>
    </div>
</template>
