const routes = [
  {
    path: "/",
    redirect: "login"
  },
  {
    path: "/login",
    name: "login",
    component: () => import("pages/Login/index")
  },
  {
    path: "/home",
    name: "home",
    meta: { requireAuth: true },
    component: () => import("layouts/MainLayout"),
    children: [
      {
        path: "/about",
        meta: { requireAuth: true },
        component: () => import("pages/Home/index")
      }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    name: "404",
    component: () => import("pages/Error404")
  }
];

export default routes;
