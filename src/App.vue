<script setup>
import {
    useQuasar,
    QSpinnerGears,
    QSpinnerFacebook,
    QSpinnerBall,
    QSpinnerAudio,
    QSpinnerBars,
    QSpinnerBox,
    QSpinnerClock,
    QSpinnerComment,
    QSpinnerCube,
    QSpinnerDots,
    QSpinnerGrid,
    QSpinnerHearts,
    QSpinnerInfinity,
    QSpinnerIos,
    QSpinnerOrbit,
    QSpinnerOval,
    QSpinnerPie,
    QSpinnerPuff,
    QSpinnerRings,
    QSpinnerTail,
} from "quasar";
import { onBeforeUnmount } from "vue";

const $q = useQuasar();
let timer;

onBeforeUnmount(() => {
    if (timer !== void 0) {
        clearTimeout(timer);
        $q.loading.hide();
    }
});

function showLoading() {
    $q.loading.show({
        spinner: QSpinnerPuff,
        spinnerColor: "primary",
        message: "Cargando componentes ...",
        messageColor: "black",
    });

    timer = setTimeout(() => {
        $q.loading.show({
            spinner: QSpinnerInfinity,
            // spinner: QSpinnerGears,
            // spinner: QSpinnerFacebook,
            spinnerColor: "primary",
            // spinnerSize: "5.5em",
            spinnerSize: "200",
            messageColor: "black",
            backgroundColor: "grey",
            message: "Iniciando PIA ...",
        });

        timer = setTimeout(() => {
            $q.loading.hide();
            timer = void 0;
        }, 4000);
    }, 2000);
}

showLoading();
</script>

<template>
    <router-view />
</template>
