<script setup>
import LoginPage from "../components/basics/LoginPage.vue";
import PortadaPage from "../components/basics/PortadaPage.vue";
import { getActiveService } from "src/services/item.services";
import * as pro from "src/plugins/helper";
import { ref } from "vue";

const imageLinks = ref([]);

async function getPortadas() {
    try {
        const query = await getActiveService("portada");
        if (pro.HTTPResponse(query.status)) {
            await query.data.all.forEach((element) => {
                let a = {
                    name: element.name,
                    src: element.avatar,
                };
                imageLinks.value.push(a);
            });
        }
    } catch (err) {
        console.log(err);
        console.log(err.response);
    }
}

getPortadas();
</script>

<template>
    <div class="q-pa-md">
        <div class="row">
            <!-- Portadas -->
            <div v-if="!$q.screen.xs" class="col-12 col-md-8">
                <portada-page :url-images="imageLinks" />
            </div>

            <!-- LOGIN -->
            <div class="col-12 col-md-4 q-my-auto">
                <!-- <h1>LOGIN</h1> -->
                <login-page />
            </div>
        </div>
    </div>
</template>
