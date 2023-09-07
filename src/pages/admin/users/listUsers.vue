<script setup>
import { useRoute } from "vue-router";
import * as pro from "src/plugins/helper";
import * as notif from "src/plugins/notifications";
import * as xs from "src/plugins/excelFeatures";
import { computed, reactive, ref } from "vue";
import { getAllService } from "src/services";

const route = useRoute();

const headerTable = ref([
    { label: "Nombre", field: "name", name: "name", align: "left", headerClasses: "text-uppercase" },
    // { label: "Usuario", field: "username", name: "username", align: "center", headerClasses: "text-uppercase" },
    { label: "DNI", field: "documento", name: "documento", align: "center", headerClasses: "text-uppercase" },
    // { label: "Email", field: "email", name: "email", align: "center", headerClasses: "text-uppercase" },
    // { label: "Celular", field: "phone", name: "phone", align: "center", headerClasses: "text-uppercase" },
    { label: "Roles", field: "roles", name: "roles", align: "center", headerClasses: "text-uppercase" },
    { label: "Cobertura", field: "sedeAcargo", name: "sedeAcargo", align: "center", headerClasses: "text-uppercase" },
    { label: "Estado", field: "estado", name: "estado", align: "center", headerClasses: "text-uppercase" },
    { label: "Online", field: "online", name: "online", align: "center", headerClasses: "text-uppercase" },
    { label: "Actividad", field: "last_activity", name: "last_activity", align: "center", headerClasses: "text-uppercase" },
    { label: "Acciones", field: "actions", name: "actions", align: "center", sortable: false, headerClasses: "text-uppercase" },
]);
const contentTable = reactive([]);
const searchTable = ref("");
const noDataTable = ref("No existen registros");
const noFilterTable = ref("La búsqueda no encontró resultados");
const loadingTable = ref(false);
const pagination = ref({ sortBy: "desc", descending: false, page: 1, rowsPerPage: 30 });
const pageMaxNumber = computed(() => Math.ceil(contentTable.length / pagination.value.rowsPerPage));
let editedIndex = ref(-1);
let editedItem = ref({
    codigo: "",
    name: "",
    username: "",
    documento: "",
    email: "",
    phone: "",
    sucursalE: "",
    roles: [],
    sedeAcargo: [],
    estado: true,
});
let defaultItem = ref({
    codigo: "",
    name: "",
    username: "",
    documento: "",
    email: "",
    phone: "",
    sucursalE: "",
    roles: [],
    sedeAcargo: [],
    estado: false,
});
let dialogItem = ref(false);
let titleDialog = computed(() => (editedIndex.value === -1 ? `Nuevo Rol` : `Actualizar Rol`));
const loadingBtn = ref([false]);
const rowSelection = ref([]);

function simulateProgress(number) {
    loadingBtn.value[number] = true;

    setTimeout(() => {
        console.log("Objeto Guardado");
        saveItem();
    }, 1000);

    setTimeout(() => {
        loadingBtn.value[number] = false;
    }, 5000);
}

const getData = async () => {
    loadingTable.value = true;

    try {
        const query = await getAllService("users");
        if (pro.HTTPResponse(query.status)) {
            await query.data.all.forEach((element) => {
                let obj = {
                    codigo: element._id,
                    name: pro.checkNullOrUndefined(element.name) ? "" : element.name,
                    username: pro.checkNullOrUndefined(element.username) ? "" : element.username,
                    documento: pro.checkNullOrUndefined(element.documento) ? "" : element.documento,
                    email: pro.checkNullOrUndefined(element.email) ? "" : element.email,
                    phone: pro.checkNullOrUndefined(element.phone) ? "" : element.phone,
                    sucursalE: pro.checkNullOrUndefined(element.sucursalE) ? "" : element.sucursalE.name,
                    roles: pro.checkNullOrUndefined(element.roles) ? "" : element.roles.map((a) => a.name),
                    sedeAcargo: pro.checkNullOrUndefined(element.sedeAcargo) ? "" : element.sedeAcargo.map((a) => a.name),
                    estado: element.estado,
                    online: element.online,
                    last_activity: pro.formattingDate(element.updatedAt, 1),
                };
                contentTable.push(obj);
            });
            loadingTable.value = false;
        }
    } catch (err) {
        pro.handleError(err.response);
        loadingTable.value = false;
    }
};

function init() {
    if (contentTable.length > 0) {
        pro.cleanTable(contentTable);
        getData();
    } else {
        getData();
    }
}

function closeDialogItem() {
    editedIndex.value = -1;
    editedItem.value = Object.assign({}, defaultItem.value);
    dialogItem.value = false;
}

function colorSede(item) {
    return pro.colorSede(item);
}

async function exportItems() {
    notif.notify_Succesfull("Exportando");
}

init();
</script>

<template>
    <q-page>
        <div class="q-pa-md">
            <div class="row q-mt-lg">
                <div class="col">
                    <q-table
                        :title="route.name"
                        dense
                        :grid="$q.screen.xs"
                        title-class="text-primary text-uppercase"
                        :columns="headerTable"
                        :rows="contentTable"
                        row-key="codigo"
                        :filter="searchTable"
                        :no-data-label="noDataTable"
                        :no-results-label="noFilterTable"
                        :loading="loadingTable"
                        separator="cell"
                        hide-pagination
                        selection="single"
                        v-model:pagination="pagination"
                        v-model:selected="rowSelection"
                    >
                        <template v-slot:top-right>
                            <q-input v-model="searchTable" placeholder="Filtrar por..." clearable outlined dense label="Buscar..." debounce="300">
                                <template v-slot:append>
                                    <q-icon name="search" />
                                </template>
                            </q-input>

                            <q-btn fab-mini color="primary" class="q-mx-sm" @click="init">
                                <q-icon name="refresh"></q-icon>
                                <q-tooltip class="bg-primary" anchor="bottom middle" self="top middle" :offset="[10, 10]" transition-show="flip-right" transition-hide="flip-left">
                                    Refrescar
                                </q-tooltip>
                            </q-btn>

                            <q-btn fab-mini color="primary" class="q-mx-sm" @click="dialogItem = !dialogItem">
                                <q-icon name="person_add"></q-icon>
                                <q-tooltip class="bg-primary" anchor="bottom middle" self="top middle" :offset="[10, 10]" transition-show="flip-right" transition-hide="flip-left">
                                    Nuevo
                                </q-tooltip>
                            </q-btn>

                            <q-btn fab-mini color="primary" class="q-mx-sm" no-caps @click="exportItems">
                                <q-icon name="mdi-microsoft-excel"></q-icon>
                                <q-tooltip class="bg-primary" anchor="bottom middle" self="top middle" :offset="[10, 10]" transition-show="flip-right" transition-hide="flip-left">
                                    Exportar
                                </q-tooltip>
                            </q-btn>

                            <q-dialog v-model="dialogItem" persistent transition-show="flip-down" transition-hide="flip-up">
                                <q-card>
                                    <q-card-section></q-card-section>
                                    <q-separator></q-separator>
                                    <q-card-section></q-card-section>
                                    <q-separator></q-separator>
                                    <q-card-actions align="right">
                                        <q-btn color="primary" size="sm" @click="closeDialogItem">
                                            <q-icon name="cancel" left />
                                            Cancelar
                                        </q-btn>
                                    </q-card-actions>
                                </q-card>
                            </q-dialog>

                            <br />Selected: {{ JSON.stringify(rowSelection) }}
                        </template>

                        <template v-slot:body-cell-roles="item">
                            <q-td>
                                <div class="text-center" v-for="a of item.row.roles" :key="a">
                                    <q-chip square size="sm" color="primary" text-color="white" :label="a" />
                                </div>
                            </q-td>
                        </template>

                        <template v-slot:body-cell-sedeAcargo="item">
                            <q-td>
                                <div class="text-center" v-for="a of item.row.sedeAcargo" :key="a">
                                    <q-chip square size="sm" :color="colorSede(a)" text-color="white" :label="a" />
                                </div>
                            </q-td>
                        </template>

                        <template v-slot:body-cell-estado="item">
                            <q-td>
                                <div class="text-center">
                                    <q-icon size="xs" :name="item.row.estado ? 'thumb_up' : 'thumb_down'" :color="item.row.estado ? 'secondary' : 'primary'"> </q-icon>
                                </div>
                            </q-td>
                        </template>

                        <template v-slot:body-cell-online="item">
                            <q-td>
                                <div class="text-center">
                                    <q-icon size="xs" name="fiber_manual_record" :color="item.row.online ? 'secondary' : 'primary'"> </q-icon>
                                </div>
                            </q-td>
                        </template>

                        <template v-slot:body-cell-actions="item">
                            <q-td>
                                <div class="text-center">
                                    <q-btn flat round color="info">
                                        <q-icon name="visibility"></q-icon>
                                        <q-tooltip
                                            class="bg-info"
                                            anchor="center left"
                                            self="center end"
                                            :offset="[10, 10]"
                                            transition-show="flip-right"
                                            transition-hide="flip-left"
                                        >
                                            Ver
                                        </q-tooltip>
                                    </q-btn>

                                    <q-btn flat round color="warning">
                                        <q-icon name="logout"></q-icon>
                                        <q-tooltip
                                            class="bg-warning"
                                            anchor="center left"
                                            self="center end"
                                            :offset="[10, 10]"
                                            transition-show="flip-right"
                                            transition-hide="flip-left"
                                        >
                                            Forzar Cierre
                                        </q-tooltip>
                                    </q-btn>

                                    <q-btn flat round color="accent">
                                        <q-icon name="restart_alt"></q-icon>
                                        <q-tooltip
                                            class="bg-accent"
                                            anchor="center left"
                                            self="center end"
                                            :offset="[10, 10]"
                                            transition-show="flip-right"
                                            transition-hide="flip-left"
                                        >
                                            Reset Pass
                                        </q-tooltip>
                                    </q-btn>

                                    <q-btn flat round color="primary">
                                        <q-icon name="delete"></q-icon>
                                        <q-tooltip
                                            class="bg-primary"
                                            anchor="center left"
                                            self="center end"
                                            :offset="[10, 10]"
                                            transition-show="flip-right"
                                            transition-hide="flip-left"
                                        >
                                            Eliminar
                                        </q-tooltip>
                                    </q-btn>
                                </div>
                            </q-td>
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

.anchoBtn {
    width: 180px;
}
</style>
