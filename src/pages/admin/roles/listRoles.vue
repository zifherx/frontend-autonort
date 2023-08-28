<script setup>
import { computed, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import * as pro from "src/plugins/helper";
import { getAllService } from "src/services";

const route = useRoute();

const headerTable = computed(() => {
    return [
        { label: "Rol", field: "name", name: "name", align: "left", sortable: false, headerClasses: "text-uppercase" },
        { label: "Descripción", field: "description", name: "description", align: "left", sortable: false, headerClasses: "text-uppercase" },
        { label: "Estado", field: "estado", name: "estado", align: "center", required: true, sortable: false, headerClasses: "text-uppercase" },
        { label: "Acciones", field: "actions", name: "actions", align: "center", sortable: false, headerClasses: "text-uppercase" },
    ];
});

const contentTable = reactive([]);
const searchTable = ref("");
const noDataTable = ref("No existen registros");
const noFilterTable = ref("La búsqueda no encontró resultados");
const loadingTable = ref(false);
const pagination = ref({ sortBy: "desc", descending: false, page: 1, rowsPerPage: 30 });
const pageMaxNumber = computed(() => Math.ceil(contentTable.length / pagination.value.rowsPerPage));

const getData = async () => {
    loadingTable.value = true;

    try {
        const query = await getAllService("roles");
        if (pro.HTTPResponse(query.status)) {
            await query.data.all.forEach((element) => {
                let obj = {};
                obj.codigo = element._id;
                obj.name = pro.checkNullOrUndefined(element.name) ? "" : element.name;
                obj.description = pro.checkNullOrUndefined(element.description) ? "" : element.description;
                obj.estado = element.estado;

                contentTable.push(obj);
            });
            loadingTable.value = false;
        }
    } catch (err) {
        console.log(err);
        console.log(err.response);
        loadingTable.value = false;
    }
};

const init = async () => {
    if (contentTable.length > 0) {
        pro.cleanTable(contentTable);
        getData();
    } else {
        getData();
    }
};
init();
</script>

<template>
    <q-page>
        <div class="q-pa-md">
            <div class="row q-mt-lg">
                <div class="col">
                    <!-- grid -->
                    <q-table
                        :title="route.name"
                        outlined
                        dense
                        :grid="$q.screen.xs"
                        title-class="text-primary text-uppercase"
                        :columns="headerTable"
                        :rows="contentTable"
                        :filter="searchTable"
                        :no-data-label="noDataTable"
                        :no-results-label="noFilterTable"
                        :loading="loadingTable"
                        row-key="codigo"
                        separator="vertical"
                        hide-pagination
                        v-model:pagination="pagination"
                    >
                        <template v-slot:top-right>
                            <q-input v-model="searchTable" placeholder="Filtrar por..." clearable outlined dense label="Buscar..." debounce="300">
                                <template v-slot:append>
                                    <q-icon name="search" />
                                </template>
                            </q-input>

                            <q-btn fab-mini color="primary" class="q-mx-sm">
                                <q-icon name="person_add"></q-icon>
                                <q-tooltip>Nuevo</q-tooltip>
                            </q-btn>

                            <q-btn fab-mini color="primary" class="q-mx-sm" no-caps>
                                <q-icon name="mdi-microsoft-excel"></q-icon>
                                <q-tooltip>Exportar</q-tooltip>
                            </q-btn>
                        </template>

                        <template v-slot:body-cell-estado="item">
                            <q-td>
                                <div class="text-center">
                                    <q-chip
                                        square
                                        size="sm"
                                        :icon="item.row.estado ? 'thumb_up' : 'thumb_down'"
                                        :color="item.row.estado ? 'secondary' : 'primary'"
                                        text-color="white"
                                    >
                                    </q-chip>
                                </div>
                            </q-td>
                        </template>

                        <template v-slot:body-cell-actions="item">
                            <q-td>
                                <div class="text-center">
                                    <q-btn size="md-" flat round color="info">
                                        <q-icon name="visibility"></q-icon>
                                        <q-tooltip>Ver {{ route.name }}</q-tooltip>
                                    </q-btn>

                                    <q-btn flat round color="primary">
                                        <q-icon name="delete"></q-icon>
                                        <q-tooltip>Eliminar {{ route.name }}</q-tooltip>
                                    </q-btn>
                                </div>
                            </q-td>
                        </template>

                        <template v-slot:item="props">
                            <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-4 grid-style-transition escalaGrid">
                                <q-card bordered flat bg-grey-2>
                                    <q-list dense>
                                        <q-item v-for="(col, index) in props.cols.filter((a) => a.name !== 'desc')" :key="index">
                                            <q-item-section>
                                                <q-item-label class="text-weight-bold">{{ col.label }}</q-item-label>
                                            </q-item-section>
                                            <q-item-section side>
                                                <q-item-label caption>{{ col.value }}</q-item-label>
                                            </q-item-section>
                                        </q-item>
                                    </q-list>
                                </q-card>
                            </div>
                        </template>

                        <template v-slot:no-data="{ icon, message, filter }">
                            <div class="full-width row flex-center text-primary q-gutter-sm">
                                <q-icon size="2em" name="sentiment_dissatisfied" />
                                <span> Lo sentimos... {{ message }} </span>
                                <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
                            </div>
                        </template>

                        <template v-slot:loading>
                            <q-inner-loading showing color="primary"></q-inner-loading>
                        </template>
                    </q-table>

                    <div class="q-pa-lg flex flex-center">
                        <q-pagination v-model="pagination.page" color="primary" :max="pageMaxNumber" direction-links />
                    </div>
                </div>
            </div>
        </div>
    </q-page>
</template>

<style>
.escalaGrid {
    transform: scale(0.95);
}
</style>
