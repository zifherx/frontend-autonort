const routes = [
    {
        path: "/",
        component: () => import("layouts/MainLayout.vue"),
        children: [
            {
                path: "",
                component: () => import("pages/IndexPage.vue"),
            },
        ],
    },
    {
        path: "/dashboard",
        component: () => import("layouts/CoreLayout.vue"),
        meta: { requireAuth: true },
        children: [
            // DASHBOARD
            {
                name: "Dashboard",
                path: "",
                component: () => import("pages/mainDashboard/DashboardPage.vue"),
            },
            {
                name: "Dashboard Ventas",
                path: "/dashboard/ventas",
                component: () => import("pages/mainDashboard/DashboardVentasPage.vue"),
            },
            {
                name: "Dashboard CRM",
                path: "/dashboard/crm",
                component: () => import("pages/mainDashboard/DashboardCRMPage.vue"),
            },
            // PROFILE
            {
                name: "Perfil",
                path: "/profile",
                component: () => import("pages/Profile.vue"),
            },
            // SETTINGS
            {
                name: "Configuración",
                path: "/administrative/settings",
                component: () => import("pages/admin/config/initPage.vue"),
            },
            // USUARIOS
            {
                name: "Lista de Usuarios",
                path: "/administrative/users",
                component: () => import("pages/admin/users/listUsers.vue"),
            },
            // ROLES
            {
                name: "Lista de Roles",
                path: "/administrative/roles",
                component: () => import("pages/admin/roles/listRoles.vue"),
            },
        ],
    },
    // Always leave this as last one,
    // but you can also remove it
    {
        path: "/:catchAll(.*)*",
        component: () => import("pages/ErrorNotFound.vue"),
    },
];

export default routes;
