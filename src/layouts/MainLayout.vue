<script setup>
import HeaderPage from "src/components/default/HeaderPage.vue";
import FooterPage from "src/components/default/FooterPage.vue";

import { defineComponent } from "vue";

defineComponent({
    HeaderPage,
    FooterPage,
});
</script>

<template>
    <div class="q-pa-md">
        <q-layout view="hHh lpr fFf">
            <!-- HEADER  -->
            <header-page />

            <!-- VISTA  -->
            <q-page-container>
                <router-view />
            </q-page-container>

            <!-- FOOTER  -->
            <footer-page />
        </q-layout>
    </div>
</template>
