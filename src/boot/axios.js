import Vue from "vue";
import axios from "axios";
import { Notify } from "quasar";
const http = axios.create({
  baseURL: "http://localhost:8090",
  timeout: 100000
});
//  响应拦截
http.interceptors.response.use(
  function(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function(error) {
    let errMsg = "未知错误";
    if (error && error.response && error.response.status) {
      let errCode = error.response.status;
      if (errCode === 401) {
        errMsg = "请先登录";
      } else if (errCode >= 400) {
        errMsg = error.response.data.msg;
      }
    }
    Notify.create({
      color: "negative",
      message: errMsg
    });
    return Promise.reject(error);
  }
);
Vue.prototype.$http = http;

export default http;
