const routes = [
  {
    path: "/",
    redirect: "Login"
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("pages/Login")
  },
  {
    path: "/home",
    name: "Home",
    meta: { requireAuth: true },
    component: () => import("layouts/MainLayout"),
    children: [
      {
        path: "/about",
        meta: { requireAuth: true },
        component: () => import("pages/Home")
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
