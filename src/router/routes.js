const routes = [
  {
    path: "/",
    redirect: "login"
  },
  {
    path: "/login",
    name: "login",
    component: () => import("pages/Login/login")
  },
  {
    path: "/index",
    name: "index",
    meta: { requireAuth: true },
    component: () => import("layouts/MainLayout"),
    children: [
      {
        path: "/home",
        name: "home",
        meta: { requireAuth: true },
        component: () => import("pages/Home/home")
      },
      {
        path: "/foundation/by_time",
        meta: { requireAuth: true },
        component: () => import("pages/Foundation/byTime")
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
