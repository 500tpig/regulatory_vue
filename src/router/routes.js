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
        path: "/foundation/overview",
        meta: { requireAuth: true },
        component: () => import("pages/Foundation/overview")
      },
      {
        path: "/foundation/by_time",
        meta: { requireAuth: true },
        component: () => import("pages/Foundation/byTime")
      },
      {
        path: "/foundation/by_department",
        meta: { requireAuth: true },
        component: () => import("pages/Foundation/byDepartment")
      },
      {
        path: "/foundation/by_disease",
        meta: { requireAuth: true },
        component: () => import("pages/Foundation/byDisease")
      },
      {
        path: "/foundation/by_ageGroup",
        meta: { requireAuth: true },
        component: () => import("pages/Foundation/byAgeGroup")
      },
      {
        path: "/foundation/by_insured",
        meta: { requireAuth: true },
        component: () => import("pages/Foundation/byInsured")
      },
      {
        path: "/portrait",
        meta: { requireAuth: true },
        component: () => import("pages/Portrait/portrait")
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
