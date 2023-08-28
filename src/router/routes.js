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
            {
                name: "Dashboard",
                path: "",
                component: () => import("pages/mainDashboard/DashboardPage.vue"),
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
