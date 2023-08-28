<script setup>
import { storeToRefs } from "pinia";
import { useInitStore } from "src/stores/init.store";
import { ref } from "vue";

const initStore = useInitStore();
const { platformAbbreviation: abbreviationApp, platformVersion: versionApp, platformDesignedBy: designedByApp, platformAuthor: authorApp } = storeToRefs(initStore);
const yearApp = ref(new Date().getFullYear());
</script>

<template>
    <q-footer bordered class="bg-primary text-white text-center">
        <q-toolbar>
            <q-toolbar-title class="text-caption">
                <span class="text-weight-regular"> {{ abbreviationApp }} v{{ versionApp }}</span>
                <div>
                    <span class="text-weight-thin"> {{ designedByApp }} {{ authorApp }} </span>
                    <span class="text-weight-bold"> &copy; 2021 - {{ yearApp }}</span>
                </div>
            </q-toolbar-title>
        </q-toolbar>
    </q-footer>
</template>
