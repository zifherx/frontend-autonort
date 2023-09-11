<script setup>
import { useRoute } from "vue-router";
import * as pro from "src/plugins/helper";
import * as notif from "src/plugins/notifications";
import * as xs from "src/plugins/excelFeatures";
import { computed, reactive, ref } from "vue";
import { deleteServiceById, getActiveService, getAllService, patchUpdateServiceById, postService } from "src/services";

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
    password: "",
    documento: "",
    email: "",
    phone: "",
    sucursalE: "",
    roles: [],
    sedeAcargo: [],
    estado: true,
    fecha_ingreso: ref(""),
    fecha_nacimiento: ref(""),
});
let defaultItem = ref({
    codigo: "",
    name: "",
    username: "",
    password: "",
    documento: "",
    email: "",
    phone: "",
    sucursalE: "",
    roles: [],
    sedeAcargo: [],
    estado: false,
});
let isPwd = ref(true);
let dialogItem = ref(false);
let titleDialog = computed(() => (editedIndex.value === -1 ? `Nuevo Usuario` : `Actualizar Usuario`));
let loadingItem = reactive([]);
const rowSelection = ref([]);

// API SEDE
let sedeSeleccionada = ref(null);
let sedeSeleccionada2 = ref([]);
let listaSedes = reactive([]);

// API AREA
let areaSeleccionada = ref(null);
let listaAreas = reactive([]);

// API ROL
let rolSeleccionado = ref([""]);
let listaRoles = reactive([]);

// AVATAR
let avatar = ref(null);

function loaderItem(number) {
    loadingItem[number] = true;

    setTimeout(() => {
        console.log("Objeto Guardado");
        saveItem();
    }, 1000);

    setTimeout(() => {
        loadingItem[number] = false;
    }, 5000);
}

const getData = async () => {
    loadingTable.value = true;

    try {
        const query = await getAllService("users");
        // console.log(query);
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
                    areaE: pro.checkNullOrUndefined(element.areaE) ? "" : element.areaE.name,
                    roles: pro.checkNullOrUndefined(element.roles) ? [] : element.roles.map((a) => a.name),
                    sedeAcargo: pro.checkNullOrUndefined(element.sedeAcargo) ? [] : element.sedeAcargo.map((a) => a.name),
                    estado: element.estado,
                    online: element.online,
                    fecha_ingreso: pro.formattingDate(element.fecha_ingreso, 3),
                    fecha_nacimiento: pro.formattingDate(element.fecha_nacimiento, 3),
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

function initCombos() {
    getComboSede();
    getComboAreas();
    getComboRoles();
}

function viewItem(item) {
    console.log("Item:", item);
    editedIndex.value = contentTable.indexOf(item);
    editedItem.value = Object.assign({}, item);
    // MANUALES
    editedItem.value.email = item.email.split("@").shift();
    sedeSeleccionada.value = item.sucursalE;
    areaSeleccionada.value = item.areaE;
    rolSeleccionado.value = editedItem.value.roles;
    sedeSeleccionada2.value = editedItem.value.sedeAcargo;
    // console.log("EditedItem:", editedItem.value);
    dialogItem.value = true;
}

async function deleteItem(item) {
    // console.log(item);
    const askEliminar = notif.askDelete();
    askEliminar.then(async (result) => {
        if (result.isConfirmed) {
            // console.log(result);
            try {
                const query = await deleteServiceById("users", item.codigo);
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

async function saveItem() {
    if (editedIndex.value > -1) {
        console.log("Actualizar");

        const formData = new FormData();

        formData.append("name", editedItem.value.name);
        formData.append("documento", editedItem.value.documento);
        formData.append("username", editedItem.value.username);
        formData.append("email", editedItem.value.email);
        formData.append("phone", editedItem.value.phone);
        formData.append("sucursalE", sedeSeleccionada.value);
        formData.append("estado", editedItem.value.estado);
        formData.append("area", areaSeleccionada.value);
        formData.append("areaE", areaSeleccionada.value);
        formData.append("genero", "");
        formData.append("fecha_ingreso", editedItem.value.fecha_ingreso);
        formData.append("fecha_nacimiento", editedItem.value.fecha_nacimiento);
        for (let item of rolSeleccionado.value) {
            formData.append("roles[]", item);
        }
        for (let item of sedeSeleccionada2.value) {
            formData.append("sedeAcargo[]", item);
        }
        // formData.append('avatar', avatar.value);

        try {
            const query = await patchUpdateServiceById("users", editedItem.value.codigo, formData);
            if (pro.HTTPResponse(query.status)) {
                notif.notify_Succesfull(query.data.message);
                closeDialogItem();
                init();
            }
        } catch (err) {
            // console.log(err);
            // console.log(err.response);
            pro.handleError(err.response);
        }
    } else {
        console.log("Nuevo");

        const newObj = {
            name: editedItem.value.name,
            username: editedItem.value.username,
            password: editedItem.value.password,
            sucursal: sedeSeleccionada.value.name,
            sucursalE: sedeSeleccionada.value.name,
            estado: editedItem.value.estado,
            fecha_nacimiento: editedItem.value.fecha_nacimiento,
            fecha_ingreso: editedItem.value.fecha_ingreso,
            genero: "",
            area: areaSeleccionada.value.name,
            areaE: areaSeleccionada.value.name,
            documento: editedItem.value.documento,
            phone: editedItem.value.phone,
            email: editedItem.value.email,
            roles: rolSeleccionado.value.map((a) => a.name),
            sedeAcargo: sedeSeleccionada2.value.map((a) => a.name),
        };
        // console.log("Nuevo: ", newObj);

        try {
            const query = await postService("users", newObj);
            if (pro.HTTPResponse(query.status)) {
                notif.notify_Succesfull(query.data.message);
                closeDialogItem();
                init();
            }
        } catch (err) {
            // console.log(err);
            // console.log(err.response);
            pro.handleError(err.response);
        }
    }
}

function closeDialogItem() {
    editedIndex.value = -1;
    editedItem.value = Object.assign({}, defaultItem.value);
    sedeSeleccionada.value = null;
    areaSeleccionada.value = null;
    sedeSeleccionada2.value = [];
    rolSeleccionado.value = [];
    dialogItem.value = false;
}

function colorSede(item) {
    return pro.colorSede(item);
}

function abreviaturaSede(item) {
    return pro.abreviaturaSede(item);
}

function colorArea(item) {
    return pro.colorArea(item);
}

function abreviaturaArea(item) {
    return pro.abreviaturaArea(item);
}

function abreviaturaRol(item) {
    return pro.abreviaturaRol(item);
}

async function exportItems() {
    notif.notify_Succesfull("Exportando");
}

async function getComboSede() {
    try {
        const query = await getActiveService("sucursal");
        if (pro.HTTPResponse(query.status)) {
            listaSedes = query.data.all;
        }
    } catch (err) {
        pro.handleError(err.response);
    }
}

async function getComboAreas() {
    try {
        const query = await getActiveService("area");
        if (pro.HTTPResponse(query.status)) {
            listaAreas = query.data.all;
        }
    } catch (err) {
        pro.handleError(err.response);
    }
}

async function getComboRoles() {
    try {
        const query = await getActiveService("roles");
        if (pro.HTTPResponse(query.status)) {
            listaRoles = query.data.all;
        }
    } catch (err) {
        pro.handleError(err.response);
    }
}

initCombos();
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
                                <q-card style="width: 800px; max-width: 90vw">
                                    <q-card-section class="bg-primary text-white text-uppercase row items-center q-pb-none">
                                        <q-icon name="label" size="sm" left />
                                        <span class="text-h6">{{ titleDialog }}</span>
                                        <q-space />
                                        <q-btn icon="close" flat round dense @click="closeDialogItem" />
                                    </q-card-section>
                                    <q-separator />
                                    <q-form @submit.prevent="loaderItem(3)">
                                        <!-- <q-form> -->
                                        <q-card-section>
                                            <div class="q-pa-md">
                                                <div class="row q-gutter-md">
                                                    <div class="col-11 col-lg-8 col-md-8 col-sm-8 col-xs-11">
                                                        <q-input
                                                            v-model="editedItem.name"
                                                            label="Colaborador"
                                                            color="primary"
                                                            autofocus
                                                            dense
                                                            outlined
                                                            input-class="text-left"
                                                            :disable="loadingItem[3]"
                                                        >
                                                            <template v-slot:prepend>
                                                                <q-icon name="label" />
                                                            </template>
                                                        </q-input>
                                                    </div>
                                                    <div class="col-11 col-lg-3 col-md-3 col-sm-3 col-xs-11">
                                                        <q-input
                                                            v-model="editedItem.documento"
                                                            label="DNI"
                                                            type="text"
                                                            color="primary"
                                                            maxlength="8"
                                                            dense
                                                            outlined
                                                            input-class="text-left"
                                                            :disable="loadingItem[3]"
                                                        >
                                                            <template v-slot:prepend>
                                                                <q-icon name="fingerprint" />
                                                            </template>
                                                        </q-input>
                                                    </div>
                                                    <div class="col-11 col-lg-8 col-md-8 col-sm-8 col-xs-11">
                                                        <q-input
                                                            v-model="editedItem.email"
                                                            label="Correo"
                                                            type="text"
                                                            suffix="@autonortnor.com.pe"
                                                            color="primary"
                                                            dense
                                                            outlined
                                                            input-class="text-right"
                                                            :disable="loadingItem[3]"
                                                        >
                                                            <template v-slot:prepend>
                                                                <!-- <q-icon name="alternate_email" /> -->
                                                                <q-icon name="mail" />
                                                            </template>
                                                        </q-input>
                                                    </div>
                                                    <div class="col-11 col-lg-3 col-md-3 col-sm-3 col-xs-11">
                                                        <q-input
                                                            v-model="editedItem.phone"
                                                            label="Celular"
                                                            type="tel"
                                                            color="primary"
                                                            mask="### - ### - ###"
                                                            dense
                                                            outlined
                                                            input-class="text-left"
                                                            fill-mask
                                                            :disable="loadingItem[3]"
                                                        >
                                                            <template v-slot:prepend>
                                                                <q-icon name="phone" />
                                                            </template>
                                                        </q-input>
                                                    </div>
                                                    <div class="col-11 col-lg-4 col-md-4 col-sm-4 col-xs-11">
                                                        <q-input
                                                            v-model="editedItem.username"
                                                            label="Usuario"
                                                            color="primary"
                                                            dense
                                                            outlined
                                                            input-class="text-center"
                                                            :disable="loadingItem[3]"
                                                        >
                                                            <template v-slot:prepend>
                                                                <q-icon name="account_box" />
                                                            </template>
                                                        </q-input>
                                                    </div>
                                                    <div class="col-11 col-lg-4 col-md-4 col-sm-4 col-xs-11">
                                                        <q-input
                                                            v-model="editedItem.password"
                                                            autocomplete
                                                            label="Password"
                                                            color="primary"
                                                            :type="isPwd ? 'password' : 'text'"
                                                            dense
                                                            outlined
                                                            input-class="text-center"
                                                            :disable="editedIndex > -1 ? true : false"
                                                        >
                                                            <template v-slot:prepend>
                                                                <q-icon name="password" />
                                                            </template>

                                                            <template v-slot:append>
                                                                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
                                                            </template>
                                                        </q-input>
                                                    </div>
                                                    <div class="col-11 col-lg-3 col-md-3 col-sm-2 col-xs-11">
                                                        <q-toggle
                                                            v-model="editedItem.estado"
                                                            color="primary"
                                                            :icon="editedItem.estado ? 'thumb_up' : 'thumb_down'"
                                                            :label="`Estado ${editedItem.estado}`"
                                                            :false-value="false"
                                                            :true-value="true"
                                                            :disable="loadingItem[3]"
                                                        />
                                                    </div>
                                                    <div class="col-11 col-lg-4 col-md-4 col-sm-4 col-xs-11">
                                                        <q-select
                                                            v-model="sedeSeleccionada"
                                                            :options="listaSedes"
                                                            option-label="name"
                                                            option-value="name"
                                                            map-options
                                                            label="Sede"
                                                            outlined
                                                            dense
                                                            transition-show="flip-up"
                                                            transition-hide="flip-down"
                                                            color="primary"
                                                            clearable
                                                            options-selected-class="text-primary"
                                                            :disable="loadingItem[3]"
                                                        >
                                                            <template v-slot:prepend>
                                                                <q-icon name="location_on" />
                                                            </template>

                                                            <template v-slot:selected-item="{ opt }">
                                                                <q-chip size="sm" dense square :color="colorSede(opt.name)" text-color="white">
                                                                    {{ opt.name }}
                                                                </q-chip>
                                                            </template>

                                                            <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
                                                                <q-item v-bind="itemProps">
                                                                    <q-item-section avatar>
                                                                        <q-avatar :color="colorSede(opt.name)" size="sm" text-color="white">
                                                                            {{ abreviaturaSede(opt.name) }}
                                                                        </q-avatar>
                                                                    </q-item-section>
                                                                    <q-item-section>
                                                                        <q-item-label>{{ opt.name }}</q-item-label>
                                                                    </q-item-section>
                                                                    <q-item-section side>
                                                                        <q-checkbox
                                                                            size="sm"
                                                                            :model-value="selected"
                                                                            @update:model-value="toggleOption(opt)"
                                                                            :color="colorSede(opt.name)"
                                                                        />
                                                                    </q-item-section>
                                                                </q-item>
                                                            </template>
                                                        </q-select>
                                                    </div>
                                                    <div class="col-11 col-lg-4 col-md-4 col-sm-4 col-xs-11">
                                                        <q-select
                                                            v-model="areaSeleccionada"
                                                            :options="listaAreas"
                                                            option-label="name"
                                                            option-value="name"
                                                            label="Area"
                                                            map-options
                                                            outlined
                                                            dense
                                                            transition-show="flip-up"
                                                            transition-hide="flip-down"
                                                            color="primary"
                                                            clearable
                                                            options-selected-class="text-primary"
                                                            :disable="loadingItem[3]"
                                                        >
                                                            <template v-slot:prepend>
                                                                <q-icon name="more" />
                                                            </template>

                                                            <template v-slot:selected-item="{ opt }">
                                                                <q-chip size="sm" dense square :color="colorArea(opt.name)" text-color="white">
                                                                    {{ opt.name }}
                                                                </q-chip>
                                                            </template>

                                                            <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
                                                                <q-item v-bind="itemProps">
                                                                    <q-item-section avatar>
                                                                        <q-avatar :color="colorArea(opt.name)" size="sm" text-color="white">
                                                                            {{ abreviaturaArea(opt.name) }}
                                                                        </q-avatar>
                                                                    </q-item-section>
                                                                    <q-item-section>
                                                                        <q-item-label>{{ opt.name }}</q-item-label>
                                                                    </q-item-section>
                                                                    <q-item-section side>
                                                                        <q-checkbox
                                                                            size="sm"
                                                                            :model-value="selected"
                                                                            @update:model-value="toggleOption(opt)"
                                                                            :color="colorArea(opt.name)"
                                                                        />
                                                                    </q-item-section>
                                                                </q-item>
                                                            </template>
                                                        </q-select>
                                                    </div>
                                                    <div class="col-11 col-lg-8 col-md-8 col-sm-8 col-xs-11">
                                                        <q-select
                                                            v-model="rolSeleccionado"
                                                            :options="listaRoles"
                                                            option-label="name"
                                                            option-value="name"
                                                            multiple
                                                            emit-value
                                                            label="Roles"
                                                            outlined
                                                            dense
                                                            transition-show="flip-up"
                                                            transition-hide="flip-down"
                                                            color="primary"
                                                            clearable
                                                            options-selected-class="text-primary"
                                                            :disable="loadingItem[3]"
                                                        >
                                                            <template v-slot:prepend>
                                                                <q-icon name="qr_code" />
                                                            </template>

                                                            <template v-slot:selected-item="{ opt }">
                                                                <q-chip size="sm" dense square color="primary" text-color="white">
                                                                    {{ opt }}
                                                                </q-chip>
                                                            </template>

                                                            <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
                                                                <q-item v-bind="itemProps">
                                                                    <q-item-section avatar>
                                                                        <q-avatar color="primary" size="sm" text-color="white">
                                                                            {{ abreviaturaRol(opt.name) }}
                                                                        </q-avatar>
                                                                    </q-item-section>
                                                                    <q-item-section>
                                                                        <q-item-label>{{ opt.name }}</q-item-label>
                                                                    </q-item-section>
                                                                    <q-item-section side>
                                                                        <q-checkbox size="sm" :model-value="selected" @update:model-value="toggleOption(opt)" color="primary" />
                                                                    </q-item-section>
                                                                </q-item>
                                                            </template>
                                                        </q-select>
                                                    </div>
                                                    <div class="col-11 col-lg-3 col-md-3 col-sm-3 col-xs-11">
                                                        <q-input
                                                            v-model="editedItem.fecha_ingreso"
                                                            mask="date"
                                                            fill-mask
                                                            outlined
                                                            dense
                                                            label="Fecha Ingreso"
                                                            :disable="loadingItem[3]"
                                                        >
                                                            <template v-slot:prepend>
                                                                <q-icon name="event" class="cursor-pointer">
                                                                    <q-popup-proxy cover transition-show="flip-up" transition-hide="flip-down">
                                                                        <q-date v-model="editedItem.fecha_ingreso">
                                                                            <div class="row items-center justify-end">
                                                                                <q-btn v-close-popup label="Cerrar" color="primary" flat />
                                                                            </div>
                                                                        </q-date>
                                                                    </q-popup-proxy>
                                                                </q-icon>
                                                            </template>
                                                        </q-input>
                                                    </div>
                                                    <div class="col-11 col-lg-8 col-md-8 col-sm-8 col-xs-11">
                                                        <q-select
                                                            v-model="sedeSeleccionada2"
                                                            :options="listaSedes"
                                                            option-label="name"
                                                            option-value="name"
                                                            multiple
                                                            label="Sede a Cargo"
                                                            emit-value
                                                            outlined
                                                            dense
                                                            transition-show="flip-up"
                                                            transition-hide="flip-down"
                                                            color="primary"
                                                            clearable
                                                            options-selected-class="text-primary"
                                                            :disable="loadingItem[3]"
                                                        >
                                                            <template v-slot:prepend>
                                                                <q-icon name="location_on" />
                                                            </template>

                                                            <template v-slot:selected-item="{ opt }">
                                                                <q-chip size="sm" dense square :color="colorSede(opt)" text-color="white">
                                                                    {{ opt }}
                                                                </q-chip>
                                                            </template>

                                                            <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
                                                                <q-item v-bind="itemProps">
                                                                    <q-item-section avatar>
                                                                        <q-avatar :color="colorSede(opt.name)" size="sm" text-color="white">
                                                                            {{ abreviaturaSede(opt.name) }}
                                                                        </q-avatar>
                                                                    </q-item-section>
                                                                    <q-item-section>
                                                                        <q-item-label>{{ opt.name }}</q-item-label>
                                                                    </q-item-section>
                                                                    <q-item-section side>
                                                                        <q-checkbox
                                                                            size="sm"
                                                                            :model-value="selected"
                                                                            @update:model-value="toggleOption(opt)"
                                                                            :color="colorSede(opt.name)"
                                                                        />
                                                                    </q-item-section>
                                                                </q-item>
                                                            </template>
                                                        </q-select>
                                                    </div>
                                                    <div class="col-11 col-lg-3 col-md-3 col-sm-3 col-xs-11">
                                                        <q-input
                                                            v-model="editedItem.fecha_nacimiento"
                                                            mask="date"
                                                            fill-mask
                                                            outlined
                                                            dense
                                                            label="Fecha Nacimiento"
                                                            :disable="loadingItem[3]"
                                                        >
                                                            <template v-slot:prepend>
                                                                <q-icon name="event" class="cursor-pointer">
                                                                    <q-popup-proxy cover transition-show="flip-up" transition-hide="flip-down">
                                                                        <q-date v-model="editedItem.fecha_nacimiento">
                                                                            <div class="row items-center justify-end">
                                                                                <q-btn v-close-popup label="Cerrar" color="primary" flat />
                                                                            </div>
                                                                        </q-date>
                                                                    </q-popup-proxy>
                                                                </q-icon>
                                                            </template>
                                                        </q-input>
                                                    </div>
                                                </div>
                                            </div>
                                        </q-card-section>
                                        <q-separator />
                                        <q-card-actions align="right">
                                            <q-btn color="primary" size="sm" @click="closeDialogItem">
                                                <q-icon name="cancel" left />
                                                Cancelar
                                            </q-btn>
                                            <q-btn color="secondary" size="sm" type="submit" :disable="loadingItem[3]" :loading="loadingItem[3]">
                                                Guardar
                                                <q-icon name="save" right />
                                                <template v-slot:loading>
                                                    <q-spinner-hourglass class="on-left" />
                                                    Cargando...
                                                </template>
                                            </q-btn>
                                        </q-card-actions>
                                    </q-form>
                                </q-card>
                            </q-dialog>

                            <!-- <br />Selected: {{ JSON.stringify(rowSelection) }} -->
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

.maximum-Card {
    width: 700px;
    max-width: 95vw;
}
</style>
