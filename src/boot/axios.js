import Vue from "vue";
import axios from "axios";
import { Notify } from "quasar";
const http = axios.create({
  baseURL: "http://localhost:8090",
  timeout: 10000
});
//  响应拦截
http.interceptors.response.use(
  response => response,
  err => {
    let msg = "未知错误";
    if (err && err.response && err.response.status) {
      switch (err.response.status) {
        case 400:
          msg: err.response.message;
          break;
        case 401:
          msg = "未登录";
          break;
        case 500:
          msg = "服务器错误";
          break;
      }
    }
    Notify.create({
      color: "negative",
      message: msg
    });
  }
);
Vue.prototype.$http = http;
