<template>
  <q-page class="byDepartment">
    <page-base-scroll content_class="q-pt-md q-pb-lg">
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
            <q-card-section
              horizontal
              class=" items-center q-pl-xl cardSection"
            >
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
              <div>
                <span class="q-ml-lg q-mr-md">日期选择:</span>
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
                  style="width:60%;"
                >
                </el-date-picker>
              </div>
            </q-card-section>
            <q-card-section
              horizontal
              class="row items-center q-pl-xl cardSection q-mt-sm"
            >
              <div class="q-mr-sm">排序方式:</div>
              <div class=" text-grey-8 text-subtitle2">
                <q-radio
                  v-model="searchParam.order"
                  val="ASC"
                  label="升序"
                  color="yellow-8"
                />
                <q-radio
                  v-model="searchParam.order"
                  val="DESC"
                  label="降序"
                  color="yellow-10"
                />
              </div>
              <span class="q-mr-sm q-ml-md">展示科室数量:</span>
              <q-input
                class="numberInput"
                v-model.number="searchParam.departmentNum"
                type="number"
                outlined
                dense
                :disable="searchParam.showAllDep"
                :input-style="{ textAlign: 'center' }"
                :rules="[
                  val => (val !== null && val !== '') || '请输入科室数量',
                  val => val > 0 || '科室数量小于或者为0'
                ]"
              />
              <span class="q-mx-sm">或</span>
              <q-checkbox
                v-model="searchParam.showAllDep"
                val="DESC"
                label="全部"
                color="red"
              />
              <div class="text-subtitle2 q-ml-xs" v-if="searchParam.showAllDep">
                <q-icon name="warning" color="negative"></q-icon>
                <span class="text-negative">可能导致页面卡顿卡死</span>
              </div>
            </q-card-section>
            <q-card-section
              horizontal
              class="row items-center q-pl-xl cardSection q-mt-xs"
            >
              <q-toggle
                :label="common.switchLable"
                color="pink"
                v-model="searchParam.selectSpecific"
                left-label
                @input="toggleFun"
              />
              <q-btn
                color="warning"
                label="重选科室"
                @click="common.dialog.showDialog = true"
                class="q-ml-sm"
                v-if="
                  searchParam.departmentList.length !== 0 &&
                    searchParam.selectSpecific
                "
              />
            </q-card-section>
            <q-card-section
              horizontal
              v-if="
                searchParam.departmentList.length !== 0 &&
                  searchParam.selectSpecific
              "
              class="row items-center q-pl-xl cardSection q-mt-xs"
            >
              <div style="max-width: 400px">
                <q-expansion-item v-model="common.expanded[1]" label="已选科室">
                  <q-card>
                    <q-card-section>
                      <q-chip
                        v-for="(item, index) in searchParam.departmentList"
                        :key="index"
                        removable
                        color="primary"
                        text-color="white"
                        @remove="remove(index)"
                      >
                        {{ item }}
                      </q-chip>
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
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
            <div ref="histogram" id="byDepartmentHistogram"></div>
          </q-card>
        </div>
      </div>
      <div class="row q-mt-lg justify-center">
        <q-card class="col-5">
          <div id="byDepartmentRingChartOC"></div>
        </q-card>
        <q-card class="col-5 q-ml-lg">
          <div id="byDepartmentRingChartHC"></div>
        </q-card>
      </div>
      <div class="row q-mt-lg justify-center">
        <div class="col-6" style="padding-left:5%;">
          <q-table
            class="shadow-2 byDepartmentTable"
            :title="common.OCTableData.title"
            :data="common.OCTableData.data"
            :columns="common.byDepartmentTable.columns"
            row-key="index"
            flat
            bordered
            :visible-columns="common.byDepartmentTable.visibleColumns"
            :filter="common.byDepartmentTable.filter1"
            :rows-per-page-options="[10, 20, 30, 50, 100]"
          >
            <template v-slot:top-right>
              <q-btn
                color="accent"
                icon-right="archive"
                no-caps
                @click="exportTableOC"
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
                v-model="common.byDepartmentTable.filter1"
                placeholder="Search"
                :input-style="{ padding: '8px' }"
                bg-color="white"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>
          </q-table>
        </div>
        <div class=" col-6">
          <q-table
            class="shadow-2 byDepartmentTable q-ml-md"
            style="width:90%"
            :title="common.HCTableData.title"
            :data="common.HCTableData.data"
            :columns="common.byDepartmentTable.columns"
            row-key="index"
            flat
            bordered
            :visible-columns="common.byDepartmentTable.visibleColumns"
            :filter="common.byDepartmentTable.filter2"
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
                v-model="common.byDepartmentTable.filter2"
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
    <q-dialog v-model="common.dialog.showDialog" @before-hide="hideDilog"
      ><specificTable
        @selectConfirm="selectConfirm"
        url="/fundUse/getDepartmentOC"
        :searchParam="searchParam"
        :columns="common.dialog.columns"
        title="科室"
        selection="multiple"
    /></q-dialog>
  </q-page>
</template>

<script>
import pageBaseScroll from "components/utils/PageScroll";
import { EleResize } from "assets/js/util/esresize";
import {
  setDepartmentChartOption,
  setDepartmentRingOption,
  setDrillDownRingOption
} from "assets/js/charts/byDepartmentOptions";
import {
  getMonthLastDay,
  formatDate,
  pickerOptions,
  shallowCopyObj,
  accAdd,
  exportTable
} from "assets/js/util/common";
import specificTable from "components/utils/specificTable";
export default {
  components: { pageBaseScroll, specificTable },
  data() {
    return {
      searchParam: {
        chargingTime: ["20160701", "20161231"],
        departmentNum: 15,
        type: "OCAndHC",
        order: "DESC",
        selectSpecific: false,
        showAllDep: false,
        departmentList: [],
        isDrillDown: false
      },
      common: {
        switchLable: "选择所有科室",
        pickerOptions: pickerOptions,
        isInitialize: true,
        expanded: [true, true],
        byDepartmentTable: {
          filter1: "",
          filter2: "",
          visibleColumns: [
            "index",
            "department",
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
              name: "chargingTime",
              label: "日期",
              field: "chargingTime",
              sortable: true,
              align: "center"
            },
            {
              name: "department",
              label: "科室",
              field: "department",
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
          ]
        },
        OCTableData: { title: "门诊科室费用详情表", data: [] },
        HCTableData: { title: "住院科室费用详情表", data: [] },
        dialog: {
          showDialog: false,
          columns: [
            {
              name: "no",
              label: "序号",
              field: "no",
              align: "center",
              sortable: true
            },
            {
              name: "column",
              label: "科室",
              field: "column",
              sortable: true,
              align: "center"
            }
          ]
        }
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
      let param2 = {};

      this.searchParam.isDrillDown = false;

      param = shallowCopyObj(this.searchParam, param);
      param.startDate = this.searchParam.chargingTime[0];
      param.endDate = this.searchParam.chargingTime[1];
      param2 = shallowCopyObj(param, param2);
      param2.departmentList = [];

      let optionData = [];
      await this.$http
        .post("/fundUse/monthlyFeeByDepartment", param)
        .then(res => {
          if (res.status === 200) {
            optionData = res.data.data;
          }
        })
        .catch(e => {});
      await optionData.map(item => {
        param2.departmentList.push(item.department);
      });
      param2.selectSpecific = true;
      let ringData = {};
      await this.$http
        .post("/fundUse/monthlyFeeOCAndHCByDepartment", param2)
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

      if (this.common.isInitialize) {
        if (id === "byDepartmentHistogram") {
          myChart.on("click", function(param) {
            that.drillDown(param);
          });
        }

        let histogramChart = this.$echarts.init(
          document.getElementById("byDepartmentHistogram")
        );
        let OCChart = this.$echarts.init(
          document.getElementById("byDepartmentRingChartOC")
        );
        let HCChart = this.$echarts.init(
          document.getElementById("byDepartmentRingChartHC")
        );

        let histogramDiv = document.getElementById("byDepartmentHistogram");
        let OCDiv = document.getElementById("byDepartmentRingChartOC");
        let HCDiv = document.getElementById("byDepartmentRingChartHC");
        let linstener = function() {
          histogramChart.resize();
          OCChart.resize();
          HCChart.resize();
        };
        EleResize.on(resizeDiv, linstener);
        this.common.isInitialize = false;
      }
    },
    // 处理请求后的结果
    afterHttp(optionData, ringData) {
      let histogramOption = setDepartmentChartOption(
        optionData,
        this.searchParam.isDrillDown
      );
      this.drawChart(histogramOption, "byDepartmentHistogram");

      let ringOCOption = setDepartmentRingOption(
        ringData.OC,
        "门诊科室费用占比"
      );
      this.drawChart(ringOCOption, "byDepartmentRingChartOC");

      let ringHCOption = setDepartmentRingOption(
        ringData.HC,
        "住院科室费用占比"
      );
      this.drawChart(ringHCOption, "byDepartmentRingChartHC");

      this.formatTableData(ringData);
      // ringData
    },
    // 图表下钻
    async drillDown(chartParam) {
      let department = chartParam.name;
      this.searchParam.isDrillDown = true;
      let param = {};
      param = shallowCopyObj(this.searchParam, param);
      param.departmentList = [];
      param.departmentList.push(department);
      param.selectSpecific = true;
      param.startDate = this.searchParam.chargingTime[0];
      param.endDate = this.searchParam.chargingTime[1];
      param.order = "ASC";

      let optionData = [];
      await this.$http
        .post("/fundUse/monthlyFeeByDepartment", param)
        .then(res => {
          if (res.status === 200) {
            optionData = res.data.data;
          }
        })
        .catch(e => {});
      let histogramOption = setDepartmentChartOption(
        optionData,
        this.searchParam.isDrillDown
      );
      this.changeChart(histogramOption, "byDepartmentHistogram");
      let data1 = {
        individualPay: {
          name: "个人支付费用",
          value: 0
        },
        medicarePay: {
          name: "医保支付费用",
          value: 0
        }
      };
      let data2 = {
        OC: {
          name: "门诊费用",
          value: 0
        },
        HC: {
          name: "住院费用",
          value: 0
        }
      };
      optionData.map(item => {
        data1.individualPay.value = accAdd(
          data1.individualPay.value,
          item.individualPay
        );
        data1.medicarePay.value = accAdd(
          data1.medicarePay.value,
          item.medicarePay
        );
      });
      let color1 = ["#E271DE", "#F8456B"];
      let color2 = ["#00FFFF", "#4AEAB0"];
      let ringChartOption1 = setDrillDownRingOption(
        data1,
        "医疗总费用",
        color1
      );
      this.changeChart(ringChartOption1, "byDepartmentRingChartOC");

      let ringData = {};
      await this.$http
        .post("/fundUse/monthlyFeeOCAndHCByDepartment", param)
        .then(res => {
          if (res.status === 200) {
            ringData = res.data.data;
          }
        })
        .catch(() => {});
      for (let key in ringData) {
        let temp = ringData[key];
        temp.map(item => {
          if (key === "OC") {
            data2.OC.value = accAdd(data2.OC.value, item.totalCost);
          } else {
            data2.HC.value = accAdd(data2.HC.value, item.totalCost);
          }
        });
      }
      let ringChartOption2 = setDrillDownRingOption(
        data2,
        "门诊住院总费用",
        color2
      );
      this.changeChart(ringChartOption2, "byDepartmentRingChartHC");

      this.formatTableData(ringData, department);
    },

    changeChart(option, id) {
      let myChart = this.$echarts.init(document.getElementById(id));
      myChart.setOption(option, true);
    },

    // 渲染表格数据
    formatTableData(tableDataObj, department) {
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
          if (this.searchParam.isDrillDown) {
            temp.chargingTime = table[i].chargingTime;
          }
          temp.department = table[i].department;
          temp.ratio =
            ((table[i].medicarePay / table[i].totalCost) * 100).toFixed(2) +
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
      if (this.searchParam.isDrillDown) {
        this.common.byDepartmentTable.visibleColumns.splice(
          1,
          0,
          "chargingTime"
        );
        tempTitle = tempTitle + department;
      } else {
        if (this.common.byDepartmentTable.visibleColumns.length === 7)
          this.common.byDepartmentTable.visibleColumns.splice(1, 1);
      }
      this.common.OCTableData.title = tempTitle + "门诊" + "费用详情表";
      this.common.HCTableData.title = tempTitle + "住院" + "费用详情表";
    },

    // 按钮切换函数
    toggleFun(value, evt) {
      if (!this.searchParam.selectSpecific) {
        this.common.switchLable = "选择所有科室";
      } else {
        this.common.switchLable = "选择特定科室";
        this.common.dialog.showDialog = true;
      }
    },
    // 隐藏对话框
    hideDilog() {
      if (this.searchParam.departmentList.length === 0) {
        this.searchParam.selectSpecific = false;
      }
    },
    // 确定选择科室对话框
    selectConfirm(data) {
      this.common.dialog.showDialog = false;
      let temp = [];
      data.map(item => {
        temp.push(item.column);
      });
      this.searchParam.departmentList = temp;
    },
    remove(index) {
      this.searchParam.departmentList.splice(index, 1);
    },
    exportTableOC() {
      exportTable(
        this.common.byDepartmentTable.columns,
        this.common.OCTableData.data
      );
    },
    exportTableHC() {
      exportTable(
        this.common.byDepartmentTable.columns,
        this.common.HCTableData.data
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.byDepartment {
  color: $primary;
  .cardSection {
    // height: 70px;
    .el-range-editor.is-active,
    .el-range-editor.is-active:hover {
      border: 2px solid $primary;
    }
    .el-input__inner {
      border: 1px solid rgba(0, 0, 0, 0.24);
    }
    .numberInput {
      font-size: 16px;
      max-width: 100px;
      margin-bottom: -20px;
    }
  }
  #byDepartmentHistogram {
    height: 620px;
  }
  #byDepartmentRingChartOC,
  #byDepartmentRingChartHC {
    height: 430px;
  }
}
</style>

<style lang="sass">
.byDepartmentTable
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
