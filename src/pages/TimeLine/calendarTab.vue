<template>
  <div class="calendarTab">
    <div class="row">
      <q-card class="q-pa-md col-6">
        <div class="row items-center">
          <q-select
            v-model="calendarParam.feeType"
            :options="feeOptions"
            label="费用类型"
            class="col-2 text-weight-medium"
            label-color="black"
          />
          <span class="q-ml-lg q-mr-sm text-weight-medium">产生部门:</span>
          <q-option-group
            v-model="calendarParam.type"
            :options="common.typeOptions"
            color="primary"
            style="font-size:14px;"
            inline
            class="subText"
          />
        </div>
        <div class="row q-mt-md items-center">
          <span class="q-mr-sm text-weight-medium">展示方式:</span>
          <q-option-group
            v-model="calendarParam.showType"
            :options="showOption"
            color="primary"
            style="font-size:14px;"
            inline
            class="subText"
          />
          <span class="q-ml-lg q-mr-md text-weight-medium">日期选择:</span>
          <el-date-picker
            v-if="calendarParam.showType === 'onlyMonth'"
            v-model="calendarParam.showMonth"
            type="month"
            value-format="yyyyMMdd"
            placeholder="选择月"
          >
          </el-date-picker>
          <el-date-picker
            v-if="calendarParam.showType === 'byYear'"
            align="center"
            style="width:30%;"
            value-format="yyyyMMdd"
            v-model="calendarParam.chargingTime"
            type="monthrange"
            unlink-panels
            clearable
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            :picker-options="common.pickerOptions"
          >
          </el-date-picker>
        </div>
        <div class="col row justify-end q-mt-sm">
          <q-btn
            :ripple="{ center: true }"
            color="primary"
            label="确认"
            no-caps
            @click="initialize()"
          />
        </div>
      </q-card>
    </div>
    <div v-if="nowShowType === 'byYear'" class="row q-mt-md justify-center">
      <q-card
        id="calendarChart"
        class="col-11 q-pa-md"
        :style="{ height: chartHeight + 'px' }"
      >
      </q-card>
    </div>
    <div v-if="nowShowType === 'onlyMonth'" class="row q-mt-md justify-center">
      <q-card
        id="calendarMonthChart"
        class="col-10 q-pa-md"
        style="height:600px"
      >
      </q-card>
    </div>
  </div>
</template>

<script>
import {
  setCalendarYearChartOption,
  setCalendarMonthChartOption,
  setGinsengContrastChartOption
} from "assets/js/charts/byTimeLineOptions";
import {
  shallowCopyObj,
  getYearBetween,
  getLastDay
} from "assets/js/util/common";
import { EleResize } from "assets/js/util/esresize";
export default {
  name: "calendarTab",
  props: {
    common: Object,
    searchParam: Object,
    portraitInfo: Object
  },
  data() {
    return {
      nowShowType: "byYear",
      calendarParam: {
        feeType: {
          label: "总医疗费用",
          value: "totalCost"
        },
        type: "",
        chargingTime: [],
        showType: "byYear",
        showMonth: "20160701"
      },
      chartHeight: 200,
      isInitialize: true,
      feeOptions: [
        {
          label: "个人支付",
          value: "individualPay"
        },
        {
          label: "医保支付",
          value: "medicarePay"
        },
        {
          label: "总医疗费用",
          value: "totalCost"
        }
      ],
      showOption: [
        {
          label: "按年显示",
          value: "byYear"
        },
        {
          label: "只显示一个月",
          value: "onlyMonth"
        }
      ],
      chartData: []
    };
  },
  methods: {
    async initialize() {
      let param = {};
      param = shallowCopyObj(this.calendarParam, param);
      if (this.calendarParam.showType === "byYear") {
        param.startDate = this.calendarParam.chargingTime[0];
        param.endDate = this.calendarParam.chargingTime[1];
        let yearArr = getYearBetween(
          this.calendarParam.chargingTime[0].substring(0, 4),
          this.calendarParam.chargingTime[1].substring(0, 4)
        );
        this.chartHeight = 200 + 230 * (yearArr.length - 1);
      } else {
        let lastDay = getLastDay(
          this.calendarParam.showMonth.substring(0, 4),
          this.calendarParam.showMonth.substring(4, 6)
        );
        param.startDate = this.calendarParam.showMonth;
        param.endDate = this.calendarParam.showMonth.substring(0, 6) + lastDay;
      }
      await this.getChartData(param);
      await this.afterInit();
    },
    async getChartData(param) {
      let chartData = [];
      await this.$http
        .post("/person/calendarData", param)
        .then(res => {
          if (res.status === 200) {
            chartData = res.data.data;
          }
        })
        .catch(e => {});
      this.nowShowType = this.calendarParam.showType;
      this.chartData = chartData;
    },
    afterInit() {
      if (this.calendarParam.showType === "byYear") {
        let option = setCalendarYearChartOption(
          this.chartData,
          this.calendarParam.feeType,
          this.searchParam,
          this.portraitInfo
        );
        this.drawChart(option, "calendarChart");
      } else {
        let monthOption = setCalendarMonthChartOption(
          this.chartData,
          this.calendarParam.feeType,
          this.calendarParam
        );
        this.drawChart(monthOption, "calendarMonthChart");
      }
    },
    // 画图表
    drawChart(option, id) {
      if (this.chartData.length > 0) {
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById(id));
        let resizeDiv = document.getElementById(id);
        // 指定图表的配置项和数据
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option, true);
        let that = this;
        if (this.calendarParam.showType === "byYear") {
          let calendarChart = this.$echarts.init(
            document.getElementById("calendarChart")
          );
          let linstener = function() {
            calendarChart.resize();
          };
          EleResize.on(resizeDiv, linstener);
        } else {
          let calendarMonthChart = this.$echarts.init(
            document.getElementById("calendarMonthChart")
          );
          let linstener = function() {
            calendarMonthChart.resize();
          };
          calendarMonthChart.resize();
          EleResize.on(resizeDiv, linstener);
        }
      } else {
        // 以下是暂无数据显示样式(样式根据本身需求进行调整)
        let html =
          '<div><span  style="position: absolute;margin-left:46%;top:45%;color:#868686; font-size: 20px;">暂无数据</span></div>';
        document.getElementById(id).innerHTML = html;
        document.getElementById(id).removeAttribute("_echarts_instance_");
      }
    }
  },
  mounted() {
    this.calendarParam.type = this.searchParam.type;
    this.calendarParam.chargingTime = this.searchParam.chargingTime;
    this.calendarParam.personId = this.searchParam.personId;
    this.initialize();
  }
};
</script>

<style scoped lang="scss">
.calendarTab {
  color: #333160;
  font-size: 16px;
  .subText {
    color: #838098;
    font-size: 16px;
    font-weight: 500;
  }
}
</style>
