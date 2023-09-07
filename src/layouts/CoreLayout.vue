<script setup>
import AppBarCore from "src/components/core/AppBarCore.vue";
import DrawerCore from "src/components/core/DrawerCore.vue";
import FooterCore from "src/components/core/FooterCore.vue";
import ViewCore from "src/components/core/ViewCore.vue";
import { defineComponent } from "vue";

defineComponent({
    AppBarCore,
    // DrawerCore,
    FooterCore,
    ViewCore,
});
</script>
<template>
    <!-- <div class="q-pa-md"> -->
    <!-- <q-layout view="lHh lpr lFf"> -->
    <q-layout view="lHh Lpr fFf">
        <!-- APP BAR -->
        <app-bar-core />
        <!-- DRAWER -->
        <drawer-core />
        <!-- VIEW -->
        <view-core />
        <!-- FOOTER -->
        <footer-core />
    </q-layout>
    <!-- </div> -->
</template>
