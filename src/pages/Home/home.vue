<template>
  <q-page class="home">
    <page-base-scroll content_class="text-black q-pb-lg">
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
      <div class="row q-px-md">
        <div class="col-6 q-pr-sm">
          <q-card class="q-pa-sm">
            <div class="row items-center q-pl-md">
              <span class="q-mr-sm text-weight-medium" style="font-size:15px;"
                >类型:</span
              >
              <q-radio v-model="param.type" val="department" label="科室" />
              <q-radio
                v-model="param.type"
                val="drugInspection"
                label="药品检查"
              />
              <q-radio v-model="param.type" val="doctor" label="医生" />
              <q-radio v-model="param.type" val="insured" label="参保人" />
              <div class="col row justify-end q-pr-md">
                <q-btn color="secondary" class="q-ml-md" @click="getCostDetails"
                  >确认</q-btn
                >
              </div>
            </div>
          </q-card>
          <div class="histogram-div q-pt-md">
            <q-card id="histogram"> </q-card>
          </div>
        </div>
        <div class="col-6 row q-pl-sm">
          <q-card class="col-12 q-pa-sm" id="numberOfPenalty"></q-card>
        </div>
      </div>
      <div class="row q-pa-md">
        <div class="col-12 roseChart-div">
          <q-card class="q-pa-sm" id="roseChart"> </q-card>
        </div>
      </div>
      <div class="row q-px-md">
        <div class="col-12 violationOfNumber-div">
          <q-card class="q-pa-sm" id="violationOfNumber"> </q-card>
        </div>
      </div>
    </page-base-scroll>
  </q-page>
</template>

<script>
import pageBaseScroll from "components/utils/PageScroll";
import {
  fourRingOption,
  healthCareAccountedOption,
  dashboardOption,
  costDetailsOption,
  numberOfPenaltyOption,
  roseChartOption,
  violationOfNumberOption
} from "assets/js/charts/homeChartOptions";
import { EleResize } from "assets/js/util/esresize";
import {
  pickerOptions,
  isObjArr,
  formatDateTime,
  deepClone
} from "assets/js/util/common";
export default {
  components: { pageBaseScroll },
  data() {
    return {
      param: {
        chargingTime: [],
        type: "department",
        sort: "DESC",
        showNum: 20
      },
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
    console.log();
  },
  methods: {
    async initialize() {
      let fourRingData = [];
      await this.$http
        .post("/home/getAmount", this.param)
        .then(res => {
          if (res.status === 200) {
            fourRingData = res.data.data;
          }
        })
        .catch(e => {});

      let countUntreated = [];
      await this.$http
        .post("/home/countUntreated", this.param)
        .then(res => {
          if (res.status === 200) {
            countUntreated = res.data.data;
          }
        })
        .catch(e => {});

      let costDetailsData = [];
      await this.$http
        .post("/home/costDetails", this.param)
        .then(res => {
          if (res.status === 200) {
            costDetailsData = res.data.data;
          }
        })
        .catch(e => {});

      let numberOfPenaltyData = [];
      await this.$http
        .post("/home/numberOfPenalty", this.param)
        .then(res => {
          if (res.status === 200) {
            numberOfPenaltyData = res.data.data;
          }
        })
        .catch(e => {});
      this.afterHttp(
        fourRingData,
        countUntreated,
        costDetailsData,
        numberOfPenaltyData
      );
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
          let histogram = this.$echarts.init(
            document.getElementById("histogram")
          );

          let numberOfPenalty = this.$echarts.init(
            document.getElementById("numberOfPenalty")
          );

          let roseChart = this.$echarts.init(
            document.getElementById("roseChart")
          );
          let violationOfNumber = this.$echarts.init(
            document.getElementById("violationOfNumber")
          );

          let linstener = function() {
            fourRing.resize();
            healthCareAccounted.resize();
            dashboard.resize();
            histogram.resize();
            numberOfPenalty.resize();
            roseChart.resize();
            violationOfNumber.resize();
          };
          EleResize.on(resizeDiv, linstener);
          this.common.isInitialize = false;
        }
      }
    },
    // 画医保占比动画饼图
    drawHealthCareAccounted(fourRingData) {
      this.common.angle = this.common.angle + 3;
      let healthCareAccounted = healthCareAccountedOption(
        fourRingData,
        this.common.angle
      );
      let myChart = this.$echarts.init(
        document.getElementById("healthCareAccounted")
      );
      myChart.setOption(healthCareAccounted, true);
    },
    afterHttp(
      fourRingData,
      countUntreated,
      costDetailsData,
      numberOfPenaltyData
    ) {
      let that = this;
      let fourRing = fourRingOption(fourRingData);
      this.drawChart(fourRing, "fourRing", fourRingData);
      this.common.timerId = setInterval(function() {
        //用setInterval做动画感觉有问题
        that.drawHealthCareAccounted(fourRingData);
      }, 100);
      let dashboard = dashboardOption(countUntreated);
      this.drawChart(dashboard, "dashboard", countUntreated);

      let costDetails = costDetailsOption(costDetailsData, this.param);
      this.drawChart(costDetails, "histogram", costDetailsData);

      let numberOfPenalty = numberOfPenaltyOption(
        numberOfPenaltyData,
        this.param
      );
      this.drawChart(numberOfPenalty, "numberOfPenalty", numberOfPenaltyData);

      let roseChart = roseChartOption(this.param);
      this.drawChart(roseChart, "roseChart", [1]);

      let violationOfNumber = violationOfNumberOption(this.param);
      this.drawChart(violationOfNumber, "violationOfNumber", [1]);
    },
    async getCostDetails() {
      let costDetailsData = [];
      await this.$http
        .post("/home/costDetails", this.param)
        .then(res => {
          if (res.status === 200) {
            costDetailsData = res.data.data;
          }
        })
        .catch(e => {});
      let numberOfPenaltyData = [];
      await this.$http
        .post("/home/numberOfPenalty", this.param)
        .then(res => {
          if (res.status === 200) {
            numberOfPenaltyData = res.data.data;
          }
        })
        .catch(e => {});
      let costDetails = costDetailsOption(costDetailsData, this.param);
      this.drawChart(costDetails, "histogram", costDetailsData);

      let numberOfPenalty = numberOfPenaltyOption(
        numberOfPenaltyData,
        this.param
      );
      this.drawChart(numberOfPenalty, "numberOfPenalty", numberOfPenaltyData);
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
  .histogram-div {
    #histogram {
      height: calc(60vh);
      background: #0e2147;
    }
  }
  .roseChart-div {
    #roseChart {
      height: calc(66vh);
    }
  }
  .violationOfNumber-div {
    #violationOfNumber {
      background: #01004c;
      height: calc(65vh);
    }
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
