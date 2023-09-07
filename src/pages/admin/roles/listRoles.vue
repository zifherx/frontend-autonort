<script setup>
import { computed, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import * as pro from "src/plugins/helper";
import * as notif from "src/plugins/notifications";
import * as xs from "src/plugins/excelFeatures";
import { deleteServiceById, getAllService, patchUpdateServiceById, postService } from "src/services";

const route = useRoute();

const headerTable = ref([
    { label: "Rol", field: "name", name: "name", align: "left", sortable: false, headerClasses: "text-uppercase" },
    { label: "Descripción", field: "description", name: "description", align: "left", sortable: false, headerClasses: "text-uppercase" },
    { label: "Estado", field: "estado", name: "estado", align: "center", required: true, sortable: false, headerClasses: "text-uppercase" },
    { label: "Acciones", field: "actions", name: "actions", align: "center", sortable: false, headerClasses: "text-uppercase" },
]);

const contentTable = reactive([]);
const searchTable = ref("");
const noDataTable = ref("No existen registros");
const noFilterTable = ref("La búsqueda no encontró resultados");
const loadingTable = ref(false);
const pagination = ref({ sortBy: "desc", descending: false, page: 1, rowsPerPage: 30 });
const pageMaxNumber = computed(() => Math.ceil(contentTable.length / pagination.value.rowsPerPage));
let dialogItem = ref(false);

let editedIndex = ref(-1);
let editedItem = ref({
    codigo: "",
    name: "",
    description: "",
    estado: true,
});
let defaultItem = ref({
    codigo: "",
    name: "",
    description: "",
    estado: false,
});
let titleDialog = computed(() => (editedIndex.value === -1 ? `Nuevo Rol` : `Actualizar Rol`));

const loadingBtn = ref([false]);
const progress = ref(false);

function simulateProgress(number) {
    loadingBtn.value[number] = true;

    setTimeout(() => {
        console.log("Objeto Guardado");
        saveItem();
    }, 1000);

    setTimeout(() => {
        loadingBtn.value[number] = false;
    }, 3000);
}

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
        pro.handleError(err.response);
        // console.log(err);
        // console.log(err.response);
        loadingTable.value = false;
    }
};

function viewItem(item) {
    editedIndex.value = contentTable.indexOf(item);
    editedItem.value = Object.assign({}, item);
    dialogItem.value = true;
}

function closeDialogItem() {
    editedIndex.value = -1;
    editedItem.value = Object.assign({}, defaultItem.value);
    dialogItem.value = false;
}

function init() {
    if (contentTable.length > 0) {
        pro.cleanTable(contentTable);
        getData();
    } else {
        getData();
    }
}

async function saveItem() {
    let obj = {
        name: editedItem.value.name,
        description: editedItem.value.description,
        estado: editedItem.value.estado,
    };

    if (editedIndex.value > -1) {
        console.log("edited");
        try {
            const query = await patchUpdateServiceById("roles", editedItem.value.codigo, obj);
            if (pro.HTTPResponse(query.status)) {
                notif.notify_Succesfull(query.data.message);
                closeDialogItem();
                init();
            }
        } catch (err) {
            pro.handleError(err.response);
            // console.log(err);
            // console.log(err.response);
        }
    } else {
        console.log("new");
        try {
            const query = await postService("roles", obj);
            if (pro.HTTPResponse(query.status)) {
                notif.notify_Succesfull(query.data.message);
                closeDialogItem();
                init();
            }
        } catch (err) {
            pro.handleError(err.response);
        }
    }
}

async function deleteItem(item) {
    console.log(item);
    const askEliminar = notif.askQuestion("Estás seguro que deseas eliminar", "No podrás revertir la operación");
    askEliminar.then(async (result) => {
        console.log(result);
        if (result.isConfimed) {
            try {
                const query = await deleteServiceById("roles", item.codigo);
                if (pro.HTTPResponse(query.status)) {
                    notif.notify_Succesfull(query.data.message);
                    init();
                }
            } catch (err) {
                pro.handleError(err.response);
            }
        }
    });
}

async function exportItems() {
    const headerT = ref([
        { header: "Rol", key: "name", width: 30 },
        { header: "Descripción", key: "description", width: 100 },
        { header: "Estado", key: "estado", width: 20 },
    ]);
    const contentT = ref([]);

    for (let item of contentTable) {
        contentT.value.push({ name: item.name, description: item.description, estado: item.estado });
    }

    // Exportar Tabla
    xs.createExcelTable(`Lista de Roles ${new Date().getFullYear()}`, headerT.value, contentT.value, "A1:C1", `Catálogo de Roles - ${new Date().getFullYear()}`);
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

                            <q-btn fab-mini color="primary" class="q-mx-sm" @click="init">
                                <q-icon name="refresh"></q-icon>
                                <q-tooltip>Refrescar</q-tooltip>
                            </q-btn>

                            <q-btn fab-mini color="primary" class="q-mx-sm" @click="dialogItem = true">
                                <q-icon name="add"></q-icon>
                                <q-tooltip>Nuevo</q-tooltip>
                            </q-btn>

                            <q-dialog v-model="dialogItem" persistent transition-show="flip-down" transition-hide="flip-up">
                                <q-card style="width: 600px; max-width: 80vw">
                                    <q-card-section class="bg-primary text-white text-uppercase row items-center q-pb-none">
                                        <q-icon left name="label" size="sm"></q-icon>
                                        <span class="text-h6">{{ titleDialog }}</span>
                                        <q-space />
                                        <q-btn icon="close" flat round dense @click="closeDialogItem" />
                                    </q-card-section>
                                    <q-separator />
                                    <q-card-section>
                                        <q-form>
                                            <div class="row q-gutter-sm">
                                                <div class="col-8">
                                                    <q-input v-model="editedItem.name" label="Nombre de rol" color="primary" autofocus dense outlined input-class="text-left">
                                                        <template v-slot:prepend>
                                                            <q-icon name="label" />
                                                        </template>
                                                    </q-input>
                                                </div>
                                                <div class="col-3">
                                                    <q-toggle
                                                        v-model="editedItem.estado"
                                                        color="primary"
                                                        :icon="editedItem.estado ? 'thumb_up' : 'thumb_down'"
                                                        :label="`Estado ${editedItem.estado}`"
                                                        :false-value="false"
                                                        :true-value="true"
                                                    />
                                                </div>
                                                <div class="col-12">
                                                    <q-input
                                                        v-model="editedItem.description"
                                                        type="textarea"
                                                        label="Descripción de rol"
                                                        autogrow
                                                        dense
                                                        outlined
                                                        input-class="text-left"
                                                    >
                                                        <template v-slot:prepend>
                                                            <q-icon name="description" />
                                                        </template>
                                                    </q-input>
                                                </div>
                                            </div>
                                        </q-form>
                                    </q-card-section>
                                    <q-separator />
                                    <q-card-actions align="right">
                                        <q-btn color="primary" size="sm" @click="closeDialogItem">
                                            <q-icon name="cancel" left></q-icon>
                                            Cancelar
                                        </q-btn>
                                        <q-btn color="secondary" size="sm" class="q-ml-sm anchoBtn" :loading="loadingBtn[0]" @click="simulateProgress(0)">
                                            Aceptar
                                            <q-icon name="done" right />
                                            <template v-slot:loading>
                                                <q-spinner-hourglass class="on-left" />
                                                Cargando...
                                            </template>
                                        </q-btn>
                                    </q-card-actions>
                                </q-card>
                            </q-dialog>

                            <q-btn fab-mini color="primary" class="q-mx-sm" no-caps @click="exportItems">
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
                                    <q-btn flat round color="info" @click="viewItem(item.row)">
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

                                    <q-btn flat round color="primary" @click="deleteItem(item.row)">
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

                        <template v-slot:item="props">
                            <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-4 grid-style-transition escalaGrid">
                                <q-card bordered flat bg-grey-2>
                                    <q-list dense>
                                        <q-item v-for="(col, index) in props.cols.filter((a) => a.name !== 'desc' && a.name !== 'actions')" :key="index">
                                            <q-item-section>
                                                <q-item-label class="text-weight-bold">{{ col.label }}</q-item-label>
                                            </q-item-section>
                                            <q-item-section side>
                                                <q-item-label caption>{{ col.value }}</q-item-label>
                                            </q-item-section>
                                        </q-item>
                                    </q-list>
                                    <q-separator />
                                    <q-list>
                                        <q-item>
                                            <q-item-section>
                                                <q-item-label class="text-weight-bold">Acción</q-item-label>
                                            </q-item-section>
                                            <q-item-section side>
                                                <div q-gutter-xs>
                                                    <q-btn size="md-" flat round color="info" @click="viewItem(props.row)">
                                                        <q-icon name="visibility"></q-icon>
                                                        <q-tooltip>Ver {{ route.name }}</q-tooltip>
                                                    </q-btn>

                                                    <q-btn flat round color="primary">
                                                        <q-icon name="delete"></q-icon>
                                                        <q-tooltip>Eliminar {{ route.name }}</q-tooltip>
                                                    </q-btn>
                                                </div>
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

.anchoBtn {
    width: 180px;
}
</style>
