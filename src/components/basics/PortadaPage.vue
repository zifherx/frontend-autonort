<script setup>
import { ref } from "vue";

const routes = defineProps({
    urlImages: { type: Array },
});
const slides = ref(1);

let autoplay = ref(true);
let fullscreen = ref(false);
</script>

<template>
    <div>
        <q-carousel
            v-model="slides"
            v-model:fullscreen="fullscreen"
            height="550px"
            animated
            arrows
            infinite
            :autoplay="autoplay"
            transition-prev="slide-right"
            transition-next="slide-left"
            @mouseenter="autoplay = false"
            @mouseleave="autoplay = true"
        >
            <q-carousel-slide v-for="(item, index) in routes.urlImages" :key="index" :name="item.name" :img-src="item.src" />
            <template v-slot:control>
                <q-carousel-control>
                    <q-btn push round dense color="white" text-color="priamry" :icon="fullscreen ? 'fullscree_exit' : 'fullscreen'" @click="fullscreen = !fullscreen" />
                </q-carousel-control>
            </template>
        </q-carousel>
    </div>
</template>
