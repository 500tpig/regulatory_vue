// import something here
import SlideVerify from "vue-monoplasty-slide-verify";
import echarts from "echarts";
// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/cli-documentation/boot-files#Anatomy-of-a-boot-file
export default async ({ Vue }) => {
  // something to do
  Vue.use(SlideVerify);
  Vue.prototype.$echarts = echarts;
};
