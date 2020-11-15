<template>
  <q-page>
    <page-base-scroll content_class="byTime q-pt-md q-pb-lg">
      <div class="row justify-center">
        <q-expansion-item
          class="shadow-1 overflow-hidden col-8"
          style="border-radius: 30px"
          icon="icon-icon_shaixuan"
          label="筛选条件"
          v-model="expanded"
          header-class="bg-primary text-white text-weight-medium"
          expand-icon-class="text-white"
        >
          <q-card
            class=" q-pt-md text-grey-8 text-weight-medium text-subtitle1"
          >
            <!-- <q-separator dark /> -->
            <q-card-section
              horizontal
              class="row items-center q-pl-xl"
              style="font-size:16px;font-weight:500;"
            >
              <div class="q-mr-sm">类型选择:</div>
              <div class="q-gutter-sm text-grey-8" style="font-size:14px;">
                <q-radio v-model="searchParam.type" val="OC" label="门诊费用" />
                <q-radio v-model="searchParam.type" val="HC" label="住院费用" />
                <q-radio
                  v-model="searchParam.type"
                  val="OCAndHC"
                  label="全选"
                />
              </div>
              <div>
                <span class="q-ml-lg q-mr-md">日期选择:</span>
                <el-date-picker
                  align="center"
                  value-format="yyyyMMdd"
                  v-model="searchParam.chargingTime"
                  type="monthrange"
                  unlink-panels
                  clearable
                  start-placeholder="开始月份"
                  end-placeholder="结束月份"
                  :picker-options="pickerOptions"
                >
                </el-date-picker>
              </div>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn
                class="q-mr-lg"
                flat
                @click="submit(reduction)"
                v-if="isShowReduction"
                >还原</q-btn
              >
              <q-btn
                class="q-mr-lg"
                flat
                @click="submit"
                style="font-size:16px;"
                >提交</q-btn
              >
            </q-card-actions>
          </q-card>
        </q-expansion-item>
      </div>
      <div class="row">
        <div class="col-8 offset-2 ">
          <q-card class="q-mt-lg q-pt-sm" ref="histogram" id="byTimeHistogram">
          </q-card>
        </div>
      </div>
      <div class="row q-mt-lg justify-center">
        <q-card class="col-5">
          <div id="byTimeRingChart"></div>
        </q-card>
        <q-card class="col-5 q-ml-lg">
          <div id="byTimePieChart"></div>
        </q-card>
      </div>
      <div class="row q-mt-lg justify-center">
        <q-table
          class="byTimeTable shadow-2 col-5"
          :title="OCTableData.title"
          :data="OCTableData.data"
          :columns="byTimeTable.columns"
          row-key="index"
          flat
          bordered
          :filter="byTimeTable.filter1"
        >
          <template v-slot:top-right>
            <q-input
              borderless
              dense
              debounce="300"
              v-model="byTimeTable.filter1"
              placeholder="Search"
              :input-style="{ padding: '8px' }"
              bg-color="white"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input> </template
        ></q-table>
        <q-table
          class="byTimeTable shadow-2 col-5 q-ml-md"
          :title="HCTableData.title"
          :data="HCTableData.data"
          :columns="byTimeTable.columns"
          row-key="index"
          flat
          bordered
          :filter="byTimeTable.filter2"
        >
          <template v-slot:top-right>
            <q-input
              borderless
              dense
              debounce="300"
              v-model="byTimeTable.filter2"
              placeholder="Search"
              :input-style="{ padding: '8px' }"
              bg-color="white"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input> </template
        ></q-table>
      </div>
    </page-base-scroll>
  </q-page>
</template>

<script>
import pageBaseScroll from "components/utils/PageScroll";
import { EleResize } from "assets/js/util/esresize";
import {
  getMonthLastDay,
  formatDate,
  pickerOptions
} from "assets/js/util/common";
import {
  setbyTimeChartOption,
  setbyTimePieChartOption,
  setbyTimeRingChartOption
} from "assets/js/charts/byTimeOption";
export default {
  name: "byTime",
  components: { pageBaseScroll: pageBaseScroll },
  data() {
    return {
      isInitialize: true,
      chartTitle: {
        histogram: ""
      },
      reduction: "reduction",
      isShowReduction: false,
      searchParam: {
        chargingTime: ["20160701", "20161231"],
        type: "OCAndHC"
      },
      OCTableData: { title: "门诊费用详情表", data: [] },
      HCTableData: { title: "住院费用详情表", data: [] },
      byTimeTable: {
        filter1: "",
        filter2: "",
        columns: [
          {
            name: "index",
            label: "#",
            field: "index",
            align: "center",
            sortable: true
          },
          {
            name: "chargingTime",
            label: "日期",
            field: "chargingTime",
            sortable: true,
            align: "center"
          },
          {
            name: "individualPay",
            label: "个人支付费用",
            field: "individualPay",
            align: "center",
            format: val => `${val}` + `元`,
            sortable: true
          },
          {
            name: "medicarePay",
            align: "center",
            label: "医保支付费用",
            field: "medicarePay",
            format: val => `${val}` + `元`,
            sortable: true
          },
          {
            name: "totalCost",
            align: "center",
            label: "医疗总费用",
            field: "totalCost",
            format: val => `${val}` + `元`,
            sortable: true
          },
          {
            name: "ratio",
            align: "center",
            label: "医保支付占比",
            field: "ratio",
            sortable: true
          }
        ],
        data: []
      },
      options: [
        { value: "OC", label: "门诊收费" },
        { value: "HC", label: "住院收费" }
      ],
      pickerOptions: pickerOptions,
      expanded: true
    };
  },
  methods: {
    // 初始化请求
    async initialize() {
      let param = {
        type: "OCAndHC",
        startDate: this.searchParam.chargingTime[0],
        endDate: this.searchParam.chargingTime[1]
      };
      let optionData = [];
      await this.$http
        .post("/fundUse/monthlyFee", param)
        .then(res => {
          if (res.status === 200) {
            optionData = res.data.data;
          }
        })
        .catch(() => {});
      let ringData = {};
      await this.$http
        .post("/fundUse/monthlyFeeOCAndHC", param)
        .then(res => {
          if (res.status === 200) {
            ringData = res.data.data;
          }
        })
        .catch(() => {});
      this.afterHttp(optionData, ringData);
    },

    // 画图表
    drawChart(option, id) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById(id));
      let resizeDiv = document.getElementById(id);
      // 指定图表的配置项和数据
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option, true);
      let that = this;
      if (id === "byTimeHistogram") {
        myChart.on("click", function(param) {
          that.drillDown(param.name);
        });
      }
      if (this.isInitialize) {
        let histogram = this.$echarts.init(
          document.getElementById("byTimeHistogram")
        );
        let pie = this.$echarts.init(document.getElementById("byTimePieChart"));
        let ring = this.$echarts.init(
          document.getElementById("byTimeRingChart")
        );
        let histogramDiv = document.getElementById("byTimeHistogram");
        let pieDiv = document.getElementById("byTimePieChart");
        let ringDiv = document.getElementById("byTimeRingChart");
        let linstener = function() {
          histogram.resize();
          pie.resize();
          ring.resize();
        };
        EleResize.on(resizeDiv, linstener);
        this.isInitialize = false;
      }
    },

    // 图表下钻
    async drillDown(month) {
      this.isShowReduction = true;
      let param = {};
      param.startDate = (month + "01").replace("-", "");
      param.endDate = getMonthLastDay(month.replace("-", ""));
      param.type = this.searchParam.type;
      param.isDrillDown = "true";
      let optionData = [];
      await this.$http
        .post("/fundUse/monthlyFee", param)
        .then(res => {
          if (res.status === 200) {
            optionData = res.data.data;
          }
        })
        .catch(() => {});
      let ringData = {};
      await this.$http
        .post("/fundUse/monthlyFeeOCAndHC", param)
        .then(res => {
          if (res.status === 200) {
            ringData = res.data.data;
          }
        })
        .catch(() => {});
      this.afterHttp(optionData, ringData, month);
    },

    // 渲染表格数据
    formatTableData(tableDataObj, month) {
      let tempTitle;
      if (month !== undefined) {
        tempTitle = month + " ";
      } else {
        tempTitle =
          formatDate(this.searchParam.chargingTime[0]) +
          " 至 " +
          formatDate(this.searchParam.chargingTime[1]) +
          " ";
      }
      this.OCTableData.title = tempTitle + "门诊费用详情表";
      this.HCTableData.title = tempTitle + "住院费用详情表";
      this.HCTableData.data = [];
      this.OCTableData.data = [];

      for (let key in tableDataObj) {
        let table = tableDataObj[key];
        for (let i = 0; i < table.length; i++) {
          let temp = {};
          temp.index = i + 1;
          temp.individualPay = table[i].individualPay;
          temp.medicarePay = table[i].medicarePay;
          temp.totalCost = table[i].totalCost;
          temp.chargingTime =
            table[i].chargingTime.slice(0, 4) +
            "-" +
            table[i].chargingTime.slice(4);
          if (temp.chargingTime.length >= 8) {
            temp.chargingTime =
              temp.chargingTime.slice(0, 7) +
              "-" +
              temp.chargingTime.slice(7, 9);
          }
          temp.ratio =
            ((table[i].medicarePay / table[i].totalCost) * 100).toFixed(2) +
            "%";
          if (key === "OC") {
            this.OCTableData.data.push(temp);
          } else {
            this.HCTableData.data.push(temp);
          }
        }
      }
    },

    afterHttp(optionData, ringData, month) {
      let titleStr = " 门诊住院总费用";
      if (this.searchParam.type === "OC") {
        titleStr = " 门诊费用";
      } else if (this.searchParam.type === "HC") {
        titleStr = " 住院费用";
      }
      let timeStr = "";
      if (this.isShowReduction) {
        timeStr = month;
      } else {
        timeStr =
          formatDate(this.searchParam.chargingTime[0]) +
          " 至 " +
          formatDate(this.searchParam.chargingTime[1]);
      }
      this.chartTitle.histogram = timeStr + titleStr;
      let histogramOption = setbyTimeChartOption(
        optionData,
        this.chartTitle.histogram
      );
      let pieOption = setbyTimePieChartOption(optionData, timeStr);
      this.drawChart(pieOption, "byTimePieChart");

      let ringOption = setbyTimeRingChartOption(
        ringData,
        this.chartTitle.histogram
      );
      this.drawChart(ringOption, "byTimeRingChart");
      this.drawChart(histogramOption, "byTimeHistogram");

      this.formatTableData(ringData, month);
    },
    // 提交查询
    async submit(str) {
      this.isShowReduction = false;
      if (str === "reduction") {
        this.isShowReduction = false;
      }
      let param = {};
      param.type = this.searchParam.type;
      param.startDate = this.searchParam.chargingTime[0];
      param.endDate = getMonthLastDay(this.searchParam.chargingTime[1]);
      let optionData;
      await this.$http
        .post("/fundUse/monthlyFee", param)
        .then(async res => {
          if (res.status === 200) {
            optionData = res.data.data;
          }
        })
        .catch(() => {});
      let ringData;
      await this.$http
        .post("/fundUse/monthlyFeeOCAndHC", param)
        .then(res => {
          if (res.status === 200) {
            ringData = res.data.data;
          }
        })
        .catch(() => {});
      this.afterHttp(optionData, ringData);
    }
  },
  mounted() {
    this.initialize();
  }
};
</script>

<style lang="scss" scoped>
.byTime {
  height: 100%;
  .el-input__inner {
    border: 1px solid rgba(0, 0, 0, 0.24);
  }
  #byTimeHistogram {
    height: 600px;
  }
  #byTimePieChart,
  #byTimeRingChart {
    height: 430px;
  }
  .byTime-searchBar-row {
    .byTime-searchBar-row-col {
      .byTime-searchBar-row-col-card {
        // width: 80%;
        .input:focus {
          color: white;
        }
        .byTime-searchBar-row-col-card-select {
          width: auto;
          min-width: 200px;
        }
      }
    }
  }
}
</style>
<style lang="sass">
.byTimeTable
  /* height or max-height is important */
  height: 400px

  // .q-table__middle::-webkit-scrollbar
  //   display: none

  .q-table__title
    font-size: 20px
  .q-table__top,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #018DA7
    color: #FFFFFF
    font-size: 14px

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
</style>
