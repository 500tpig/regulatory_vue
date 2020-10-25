// import something here
import SlideVerify from "vue-monoplasty-slide-verify";
// echarts
import echarts from "echarts";
// element ui
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/cli-documentation/boot-files#Anatomy-of-a-boot-file
export default async ({ Vue }) => {
  // something to do
  Vue.use(SlideVerify);
  Vue.use(ElementUI);
  Vue.prototype.$echarts = echarts;
};
