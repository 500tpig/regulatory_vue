const routes = [
  {
    path: "/home",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/about",
        component: () => import("pages/Index.vue")
      }
    ]
  },
  {
    path: "/login",
    component: () => import("pages/login/index.vue")
  },
  {
    path: "/",
    component: () => import("pages/login/index.vue")
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: () => import("pages/Error404.vue")
  }
];

export default routes;
