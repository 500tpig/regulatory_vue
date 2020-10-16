import Vue from 'vue'
import axios from 'axios'
const http = axios.create({
    baseURL:process.env.API,
    timeout:10000
})
Vue.prototype.$http = http
