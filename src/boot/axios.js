import Vue from "vue";
import axios from "axios";
import { Notify } from "quasar";
import {
  Loading,
  //可选！，例如下面例子
  //使用的自定义旋转器
  QSpinnerGears
} from "quasar";
import Router from "../router/index";
import Store from "../store/index";
const http = axios.create({
  baseURL: "http://47.101.144.184:8090",
  // baseURL: "http://localhost:8090",
  timeout: 100000
});
// http request 拦截器
http.interceptors.request.use(
  config => {
    let token = sessionStorage.getItem("token");
    if (token) {
      config.headers["u-token"] = token;
    }
    Loading.show({
      spinner: QSpinnerGears,
      spinnerColor: "primary",
      backgroundColor: "white"
      // 其它属性
    });
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);
//  响应拦截
http.interceptors.response.use(
  data => {
    Loading.hide();
    if (data.data.status === false) {
      let st = Store();
      let rt = Router(); // router/index.js 提供工厂函数，这里需要实例化它才能用
      if (data.data.code === "4301") {
        if (sessionStorage.getItem("token") !== null) {
          Notify.create({
            color: "negative",
            message: data.data.msg
          });
        }
        rt.push("/login").catch(e => {});
        st.dispatch("user/userLogout");
        return;
      }
      Notify.create({
        color: "negative",
        message: data.data.msg
      });
      return;
    }
    return data;
  },
  error => {
    let errMsg = "未知错误";
    console.log(11);
    if (error && error.response && error.response.status) {
      let errCode = error.response.status;
      if (errCode === 401) {
        errMsg = "请先登录";
      } else if (errCode >= 400) {
        errMsg = error.response.data.msg;
      }
    }
    Loading.hide();
    Notify.create({
      color: "negative",
      message: errMsg
    });
    Loading.hide();
    return Promise.resolve(error);
  }
);

Vue.prototype.$http = http;

export default http;
