<template>
  <q-page class="home">
    <page-base-scroll content_class="text-black">
      <div class="row q-pa-md">
        <div class="col-4 row q-pr-sm">
          <q-card class="col-12" id="fourRing"></q-card>
        </div>
        <div class="col-4 column q-px-sm">
          <div class="col q-pb-sm column">
            <q-card class="col-12 row items-center">
              <div>
                <span
                  class="q-ml-lg q-mr-md text-weight-medium"
                  style="font-size:16px;"
                  >日期选择:</span
                >
                <el-date-picker
                  style="width:65%;"
                  align="center"
                  value-format="yyyy-MM-dd"
                  v-model="param.chargingTime"
                  type="daterange"
                  unlink-panels
                  clearable
                  start-placeholder="开始月份"
                  end-placeholder="结束月份"
                  :picker-options="common.pickerOptions"
                >
                </el-date-picker>
              </div>
              <!-- <div class="row justify-end q-pr-md q-pt-md">
                <q-btn color="primary">查询</q-btn>
              </div> -->
            </q-card>
          </div>
          <div class="col-9 column health-care-accounted-div">
            <q-card class="col-12" id="healthCareAccounted"></q-card>
            <div class="accounted-title">医保支付占比</div>
          </div>
        </div>
        <div class="col-4 column q-pl-sm dashboard-div">
          <q-card class="col-12" id="dashboard"></q-card>
          <q-btn color="secondary" class="q-ml-md dashboard-div-button"
            >处理
            <q-tooltip
              content-class="bg-white text-black shadow-4 text-weight-medium"
              content-style="font-size: 13px"
              :offset="[10, 10]"
              :delay="600"
              >前往处理
            </q-tooltip>
          </q-btn>
        </div>
      </div>
    </page-base-scroll>
  </q-page>
  <!-- <q-page class="row">
    <div class="col-12 column">
      <div class="col-4 row q-pa-md">
        <div class="col-4 row q-pr-sm">
          <q-card class="col-12" id="fourRing"></q-card>
        </div>
        <div class="col-4 row q-px-sm">
          <q-card class="col-12"></q-card>
        </div>
        <div class="col-4 row q-pl-sm">
          <q-card class="col-12"></q-card>
        </div>
      </div>
    </div>
  </q-page> -->
</template>

<script>
import pageBaseScroll from "components/utils/PageScroll";
import {
  fourRingOption,
  healthCareAccountedOption,
  dashboardOption
} from "assets/js/charts/homeChartOptions";
import { EleResize } from "assets/js/util/esresize";
import { pickerOptions, isObjArr, formatDateTime } from "assets/js/util/common";
export default {
  components: { pageBaseScroll },
  data() {
    return {
      param: { chargingTime: [] },
      common: {
        isInitialize: true,
        pickerOptions: pickerOptions,
        angle: 0,
        timerId: ""
      }
    };
  },
  mounted() {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
    let startDate = formatDateTime(start);
    let endDate = formatDateTime(end);
    this.param.chargingTime.push(startDate);
    this.param.chargingTime.push(endDate);
    this.initialize();
  },
  methods: {
    async initialize() {
      this.afterHttp();
    },
    // 画图表
    drawChart(option, id, chartData) {
      let judge = isObjArr(chartData);
      let isEmpty = false;
      if (judge !== "error") {
        if (judge === "Array") {
          if (chartData.length === 0) isEmpty = true;
        }
        if (judge === "Object") {
          let count = 0;
          for (let key in chartData) {
            if (chartData[key].length === 0) {
              count++;
            }
          }
          if (count === 3) isEmpty = true;
        }
      }
      if (isEmpty) {
        // 以下是暂无数据显示样式(样式根据本身需求进行调整)
        let html =
          '<div><span  style="position: absolute;margin-left:46%;top:45%;color:#868686; font-size: 20px;">暂无数据</span></div>';
        document.getElementById(id).innerHTML = html;
        document.getElementById(id).removeAttribute("_echarts_instance_");
      } else {
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById(id));
        // 指定图表的配置项和数据
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option, true);
        let that = this;
        if (this.common.isInitialize) {
          let resizeDiv = document.getElementById(id);
          let fourRing = this.$echarts.init(
            document.getElementById("fourRing")
          );
          let healthCareAccounted = this.$echarts.init(
            document.getElementById("healthCareAccounted")
          );
          let dashboard = this.$echarts.init(
            document.getElementById("dashboard")
          );
          let linstener = function() {
            fourRing.resize();
            healthCareAccounted.resize();
            dashboard.resize();
          };
          EleResize.on(resizeDiv, linstener);
          this.common.isInitialize = false;
        }
      }
    },
    drawHealthCareAccounted() {
      this.common.angle = this.common.angle + 3;
      let healthCareAccounted = healthCareAccountedOption(
        [0],
        this.common.angle
      );
      let myChart = this.$echarts.init(
        document.getElementById("healthCareAccounted")
      );
      myChart.setOption(healthCareAccounted, true);
    },
    afterHttp() {
      let that = this;
      let fourRing = fourRingOption();
      this.drawChart(fourRing, "fourRing", [1, 2, 3, 4]);
      this.common.timerId = setInterval(function() {
        //用setInterval做动画感觉有问题
        that.drawHealthCareAccounted();
      }, 100);
      let dashboard = dashboardOption();
      this.drawChart(dashboard, "dashboard", [1, 2, 3, 4]);
    }
  },
  destroyed() {
    clearInterval(this.common.timerId);
  }
};
</script>

<style lang="scss" scoped>
.home {
  #fourRing {
    background: #333333;
    height: calc(40vh - 32px);
  }
  #dashboard {
    background: #333333;
  }
  .health-care-accounted-div {
    position: relative;
    #healthCareAccounted {
      background: #000e1a;
    }
    .accounted-title {
      position: absolute;
      color: white;
      font-size: 16px;
      bottom: 0;
      left: 0;
      right: 0;
      margin: 0 auto;
      width: 100px;
      height: 30px;
    }
  }
  .dashboard-div {
    position: relative;
    .dashboard-div-button {
      position: absolute;
      right: 5%;
      bottom: 6%;
    }
  }
}
</style>
