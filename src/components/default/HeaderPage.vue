<script setup>
import { storeToRefs } from "pinia";
import { useInitStore } from "src/stores/init.store";

const initStore = useInitStore();
const { platformName: nameAPP, platformAbbreviation: abbreviationApp } = storeToRefs(initStore);
</script>

<template>
    <q-header class="text-white">
        <q-toolbar>
            <q-toolbar-title>
                {{ abbreviationApp }}
                <q-tooltip transition-show="flip-right" transition-hide="flip-left" class="bg-black text-body2" anchor="bottom start" self="top start" :offset="[10, 10]">
                    {{ nameAPP }}
                </q-tooltip>
            </q-toolbar-title>
        </q-toolbar>
    </q-header>
</template>
