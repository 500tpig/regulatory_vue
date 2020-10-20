<template>
  <q-page class="byTIme q-pt-lg">
    <div class="row byTime-searchBar-row">
      <div class="col-8 offset-2 byTime-searchBar-row-col">
        <q-card
          class="byTime-searchBar-row-col-card bg-white text-primary q-py-sm"
        >
          <!-- <q-separator dark /> -->
          <q-card-section horizontal class="row q-px-lg items-center">
            <div class="col-0 byTime-searchBar-row-col-card-select">
              <q-select
                filled
                use-chips
                multiple
                v-model="multiple"
                :options="options"
                label="类型"
              />
            </div>
            <div class=" q-ml-lg">
              <q-input
                v-model="startDate"
                prefix="开始日期 :"
                filled
                type="date"
              />
            </div>
            <div class=" q-ml-lg">
              <q-input
                v-model="startDate"
                prefix="结束日期 :"
                filled
                type="date"
              />
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn class=" q-mr-lg" flat>提交</q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
    <div id="main" style=""></div>
  </q-page>
</template>

<script>
import { EleResize } from "assets/js/esresize";
export default {
  name: "Echarts",
  data() {
    return {
      multiple: null,
      options: ["个人支付", "医保支付", "医疗总费用"],
      startDate: ""
    };
  },
  methods: {
    onItemClick() {},
    drawLine(dom, option) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById(dom));
      let resizeDiv = document.getElementById(dom);
      // 绘制图表
      myChart.setOption(option);
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
          // text: "ECharts 入门示例"
        },
        tooltip: {
          trigger: "axis",
          formatter: function(data) {
            let str = data[0].axisValue + "<br/>";
            data.map(item => {
              str += item.seriesName + " : " + item.value + "元<br/>";
            });

            return str;
          },
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999"
            }
          }
        },
        grid: {
          containLabel: true
        },

        legend: {
          data: ["个人支付", "医保支付", "总费用"],
          x: "center",
          top: 10
        },
        xAxis: {
          name: "时间",
          axisPointer: {
            type: "shadow"
          },
          nameTextStyle: {
            padding: [0, 0, 0, -10] // 四个数字分别为上右下左与原位置距离
          },
          type: "category",
          data: [
            "2016-01",
            "2016-02",
            "2016-03",
            "2016-04",
            "2016-05",
            "2016-06"
          ],
          axisLabel: {
            interval: 0,
            rotate: 40
          }
        },
        yAxis: [
          {
            name: "金额",
            type: "value"
          }
        ],
        series: [
          {
            name: "个人支付",
            type: "bar",
            data: [5, 20, 36, 10, 10, 20],
            // barMaxWidth: 60,
            stack: "one",
            itemStyle: {
              normal: {
                color: "#EBA954"
              }
            }
          },
          {
            name: "医保支付",
            type: "bar",
            stack: "one",
            data: [5, 20, 36, 10, 10, 20],
            // barMaxWidth: 60,
            itemStyle: {
              normal: {
                color: "#01949B"
              }
            }
          },
          {
            name: "总费用",
            type: "line",
            data: [10, 40, 72, 20, 20, 40],
            itemStyle: {
              normal: {
                color: "#C23531"
              }
            }
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

<style lang="scss" scoped>
.byTIme {
  #main {
    width: 80%;
    height: 300px;
  }
  .byTime-searchBar-row {
    .byTime-searchBar-row-col {
      .byTime-searchBar-row-col-card {
        .byTime-searchBar-row-col-card-select {
          width: auto;
          min-width: 200px;
        }
      }
    }
  }
}
</style>
