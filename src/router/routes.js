const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/Index.vue"),
        meta: { name: "indexPage" },
      },
      {
        path: "album/:id",
        component: () => import("pages/Album.vue"),
        meta: { name: "albumPage" },
      },
      {
        path: "user/:id",
        component: () => import("pages/User.vue"),
        meta: { name: "userAlbums" },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
