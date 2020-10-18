<template>
  <q-page class="flex flex-center">
    <div id="main"></div>
  </q-page>
</template>

<script>
import { EleResize } from "assets/js/esresize";
export default {
  name: "Echarts",
  methods: {
    drawLine(dom, option) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById(dom));
      let resizeDiv = document.getElementById(dom);
      // 绘制图表
      myChart.setOption(option);
      console.log(EleResize);
      let listener = function() {
        myChart.resize();
      };
      EleResize.on(resizeDiv, listener);
    },
    myEcharts() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("main"));
      let resizeDiv = document.getElementById("main");
      // 指定图表的配置项和数据
      let option = {
        title: {
          text: "ECharts 入门示例"
        },
        tooltip: {},
        legend: {
          data: ["销量"]
        },
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
      let linstener = function() {
        myChart.resize();
      };
      EleResize.on(resizeDiv, linstener);
    }
  },
  mounted() {
    this.myEcharts();
  }
};
</script>

<style lang="sass" scoped>
#main
  width: 50%
  height: 300px
</style>
