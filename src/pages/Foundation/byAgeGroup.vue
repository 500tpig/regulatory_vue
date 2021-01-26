<template>
  <q-page class="byAgeGroup">
    <page-base-scroll content_class="q-mb-xl q-pt-md ">
      <div class="row justify-center">
        <q-expansion-item
          class="shadow-1 overflow-hidden col-8"
          style="border-radius: 30px"
          icon="icon-icon_shaixuan"
          label="筛选条件"
          v-model="common.expanded[0]"
          header-class="bg-primary text-white text-weight-medium"
          expand-icon-class="text-white"
        >
          <q-card class="q-pt-md text-grey-8 text-weight-medium text-subtitle1">
            <q-card-section horizontal class="items-center q-pl-xl cardSection">
              <div class="q-mr-sm">类型选择:</div>
              <div class="text-grey-8" style="font-size:14px;">
                <q-radio v-model="searchParam.type" val="OC" label="门诊费用" />
                <q-radio v-model="searchParam.type" val="HC" label="住院费用" />
                <q-radio
                  v-model="searchParam.type"
                  val="OCAndHC"
                  label="全选"
                />
              </div>
              <span class="q-mx-md">日期选择:</span>
              <div style="width:30%;">
                <el-date-picker
                  align="center"
                  value-format="yyyyMMdd"
                  v-model="searchParam.chargingTime"
                  type="daterange"
                  unlink-panels
                  clearable
                  start-placeholder="开始月份"
                  end-placeholder="结束月份"
                  :picker-options="common.pickerOptions"
                  style="width:100%;"
                />
              </div>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn
                class="q-mr-lg"
                flat
                style="font-size:16px;"
                @click="initialize"
                >提交</q-btn
              >
            </q-card-actions>
          </q-card>
        </q-expansion-item>
      </div>
      <div class="row">
        <div class="col-8 offset-2 ">
          <q-card class="q-mt-lg q-pt-md">
            <div id="byAgeGroupHistogram"></div>
          </q-card>
        </div>
      </div>
      <div class="row justify-center">
        <q-card class="col-9 q-mt-lg q-px-md q-pt-md">
          <q-select
            filled
            v-model="common.model"
            :options="common.options"
            option-value="value"
            option-label="label"
            option-disable="inactive"
            emit-value
            map-options
            @input="changeGroupDoubleHistogram"
            style="min-width: 150px; max-width: 200px"
          />
          <div class="q-mt-sm">
            <div id="byAgeGroupDoubleHistogram"></div>
          </div>
        </q-card>
      </div>
      <div class="row q-mt-lg justify-center">
        <div class="col-6" style="padding-left:5%;">
          <q-table
            class="shadow-2 byAgeGroupTable"
            :title="common.OCTableData.title"
            :data="common.OCTableData.data"
            :columns="common.byAgeGroupTable.columns"
            row-key="index"
            flat
            bordered
            :filter="common.byAgeGroupTable.filter1"
            :rows-per-page-options="[10, 20, 30, 50, 100]"
          >
            <template v-slot:top-right>
              <q-btn
                color="accent"
                icon-right="archive"
                no-caps
                @click="exportTableHC"
                class="q-mr-sm"
              >
                <q-tooltip
                  transition-show="rotate"
                  transition-hide="rotate"
                  content-class="bg-white text-black shadow-4 text-weight-medium"
                >
                  导出csv
                </q-tooltip>
              </q-btn>
              <q-input
                borderless
                dense
                debounce="300"
                v-model="common.byAgeGroupTable.filter1"
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
        <div class=" col-6">
          <q-table
            class="shadow-2 byAgeGroupTable q-ml-md"
            style="width:90%"
            :title="common.HCTableData.title"
            :data="common.HCTableData.data"
            :columns="common.byAgeGroupTable.columns"
            row-key="index"
            flat
            bordered
            :filter="common.byAgeGroupTable.filter2"
            :rows-per-page-options="[10, 20, 30, 50, 100]"
          >
            <template v-slot:top-right>
              <q-btn
                color="accent"
                icon-right="archive"
                no-caps
                @click="exportTableHC"
                class="q-mr-sm"
              >
                <q-tooltip
                  transition-show="rotate"
                  transition-hide="rotate"
                  content-class="bg-white text-black shadow-4 text-weight-medium"
                >
                  导出csv
                </q-tooltip>
              </q-btn>
              <q-input
                borderless
                dense
                debounce="300"
                v-model="common.byAgeGroupTable.filter2"
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
      </div>
    </page-base-scroll>
  </q-page>
</template>

<script>
import pageBaseScroll from "components/utils/PageScroll";
import {
  setAgeGroupChartOption,
  setAgeGroupDoubleHistogramOption
} from "assets/js/charts/byAgeGroupOptions";
import {
  pickerOptions,
  shallowCopyObj,
  formatDate,
  calculate,
  exportTable
} from "assets/js/util/common";
import { EleResize } from "assets/js/util/esresize";
export default {
  components: { pageBaseScroll },
  data() {
    return {
      searchParam: {
        chargingTime: ["20160701", "20161231"],
        type: "OCAndHC",
        isDrillDown: "",
        ageGroup: ""
      },
      tempData: [],
      common: {
        resize: true,
        expanded: [true],
        isInitialize: true,
        pickerOptions: pickerOptions,
        model: "总医疗费用",
        options: [
          { label: "总医疗费用", value: "totalCost" },
          { label: "医保支付费用", value: "medicarePay" },
          { label: "个人支付费用", value: "individualPay" }
        ],
        byAgeGroupTable: {
          filter1: "",
          filter2: "",
          visibleColumns: [
            "index",
            "ageScope",
            "individualPay",
            "medicarePay",
            "totalCost",
            "ratio"
          ],
          columns: [
            {
              name: "index",
              label: "#",
              field: "index",
              align: "center",
              sortable: true
            },
            {
              name: "ageScope",
              label: "年龄段",
              field: "ageScope",
              sortable: true,
              align: "center",
              format: val => `${val}`
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
          ]
        },
        OCTableData: { title: "门诊科室费用详情表", data: [] },
        HCTableData: { title: "住院科室费用详情表", data: [] }
      }
    };
  },
  mounted() {
    this.initialize();
  },
  methods: {
    // 初始化请求
    async initialize() {
      let param = {};

      param = shallowCopyObj(this.searchParam, param);
      param.startDate = this.searchParam.chargingTime[0];
      param.endDate = this.searchParam.chargingTime[1];

      let optionData = [];
      await this.$http
        .post("/fundUse/monthlyFeeByAgeGroup", param)
        .then(res => {
          if (res.status === 200) {
            optionData = res.data.data;
          }
        })
        .catch(e => {});
      let doubleHistogramData = [];
      await this.$http
        .post("/fundUse/monthlyFeeByAgeGroupOCAndHC", param)
        .then(res => {
          if (res.status === 200) {
            doubleHistogramData = res.data.data;
          }
        })
        .catch(e => {});
      this.tempData = doubleHistogramData;
      this.afterHttp(optionData, doubleHistogramData);
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
      if (this.common.isInitialize) {
        myChart.on("click", function(param) {
          that.drillDown(param);
        });
        let histogramChart = this.$echarts.init(
          document.getElementById("byAgeGroupHistogram")
        );
        let doubleHistogram = this.$echarts.init(
          document.getElementById("byAgeGroupDoubleHistogram")
        );

        let linstener = function() {
          histogramChart.resize();
          doubleHistogram.resize();
        };
        EleResize.on(resizeDiv, linstener);
        this.common.isInitialize = false;
      }
    },
    // 处理请求后的结果
    afterHttp(optionData, doubleHistogramData) {
      let histogramOption = setAgeGroupChartOption(optionData);
      this.drawChart(histogramOption, "byAgeGroupHistogram");

      let doubleHistogramOption = setAgeGroupDoubleHistogramOption(
        doubleHistogramData,
        "totalCost",
        this.searchParam
      );
      this.drawChart(doubleHistogramOption, "byAgeGroupDoubleHistogram");
      this.formatTableData(doubleHistogramData);
      this.common.isInitialize = false;
    },
    changeGroupDoubleHistogram() {
      let doubleHistogramOption = setAgeGroupDoubleHistogramOption(
        this.tempData,
        this.common.model,
        this.searchParam
      );
      this.drawChart(doubleHistogramOption, "byAgeGroupDoubleHistogram");
    },
    // 渲染表格数据
    formatTableData(tableDataObj) {
      this.common.HCTableData.data = [];
      this.common.OCTableData.data = [];

      for (let key in tableDataObj) {
        let table = tableDataObj[key];
        for (let i = 0; i < table.length; i++) {
          let temp = {};
          temp.index = i + 1;
          temp.individualPay = table[i].individualPay;
          temp.medicarePay = table[i].medicarePay;
          temp.totalCost = table[i].totalCost;
          temp.ageScope = table[i].ageScope;
          temp.ratio =
            calculate.Div(table[i].medicarePay * 100, table[i].totalCost, 2) +
            "%";
          if (key === "OC") {
            this.common.OCTableData.data.push(temp);
          } else {
            this.common.HCTableData.data.push(temp);
          }
        }
      }
      let tempTitle;
      tempTitle =
        formatDate(this.searchParam.chargingTime[0]) +
        " 至 " +
        formatDate(this.searchParam.chargingTime[1]) +
        " ";
      this.common.OCTableData.title = tempTitle + "门诊" + "费用详情表";
      this.common.HCTableData.title = tempTitle + "住院" + "费用详情表";
    },
    async drillDown(chartParam) {
      let param = {};
      param = shallowCopyObj(this.searchParam, param);
      param.startDate = this.searchParam.chargingTime[0];
      param.endDate = this.searchParam.chargingTime[1];
      param.startAge = chartParam.name.split("～")[0].replace(/[^0-9]/gi, "");
      param.endAge = chartParam.name.split("～")[1].replace(/[^0-9]/gi, "");
      let optionData = {};
      await this.$http
        .post("/fundUse/monthlyFeeByAgeGroupDown", param)
        .then(res => {
          if (res.status === 200) {
            optionData = res.data.data;
          }
        })
        .catch(e => {});
      let data1 = optionData.OCAndHC;
      let data2 = {
        OC: optionData.OC,
        HC: optionData.HC
      };
      this.afterHttp(data1, data2);
    },
    exportTableOC() {
      exportTable(
        this.common.byAgeGroupTable.columns,
        this.common.OCTableData.data,
        "门诊年龄费用"
      );
    },
    exportTableHC() {
      exportTable(
        this.common.byAgeGroupTable.columns,
        this.common.HCTableData.data,
        "住院年龄费用"
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.byAgeGroup {
  .cardSection {
    // height: 70px;
    .el-range-editor.is-active,
    .el-range-editor.is-active:hover {
      border: 2px solid $primary;
    }
    .el-input__inner {
      border: 1px solid rgba(0, 0, 0, 0.24);
    }
  }
  #byAgeGroupHistogram {
    height: 600px;
  }
  #byAgeGroupDoubleHistogram {
    height: 630px;
  }
}
</style>
<style lang="sass">
.byAgeGroupTable
  /* height or max-height is important */
  height: 450px !important

  .q-table__middle::-webkit-scrollbar
    display: none

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
