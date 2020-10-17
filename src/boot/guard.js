// import something here

import { Dialog } from "quasar";
// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/cli-documentation/boot-files#Anatomy-of-a-boot-file
export default async (/* { app, router, Vue ... } */ { router, store }) => {
  // something to do
  //路由守卫
  router.beforeEach((to, from, next) => {
    console.log(11);
    // 判断是否需要登录
    console.log(to.meta.requireAuth);
    if (to.meta.requireAuth) {
      // 判断登录状态
      console.log(store.state.user.isLogin);
      if (store.state.user.isLogin) {
        next();
      } else {
        Dialog.create({
          title: "你还未登录！",
          message: "跳转登录",
          position: "top"
        }).onOk(() => {
          next({
            path: "/login"
          });
        });
      }
    } else {
      next();
    }
    /*如果本地 存在 token 则 不允许直接跳转到 登录页面*/
    if (to.fullPath == "/login") {
      if (localStorage.getItem("token") && store.state.user.isLogin) {
        next({
          path: from.fullPath
        });
      } else {
        next();
      }
    }
  });
};
