<template>
  <q-page class="byInsured">
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
              <span class="q-mr-sm q-ml-md">展示参保人数量:</span>
              <q-input
                class="numberInput"
                v-model.number="searchParam.personNum"
                type="number"
                outlined
                dense
                :disable="searchParam.showAllPerson"
                :input-style="{ textAlign: 'center' }"
                :rules="[
                  val => (val !== null && val !== '') || '请输入参保人数量',
                  val => val > 0 || '参保人数量小于或者为0'
                ]"
              />
              <span class="q-mx-sm">或</span>
              <q-checkbox
                v-model="searchParam.showAllPerson"
                val="DESC"
                label="全部"
                color="red"
              />
              <div
                class="text-subtitle2 q-ml-xs"
                v-if="searchParam.showAllPerson"
              >
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
                label="重选参保人"
                @click="common.dialog.showDialog = true"
                class="q-ml-sm"
                v-if="
                  searchParam.personList.length !== 0 &&
                    searchParam.selectSpecific
                "
              />
            </q-card-section>
            <q-card-section
              horizontal
              v-if="
                searchParam.personList.length !== 0 &&
                  searchParam.selectSpecific
              "
              class="row items-center q-pl-xl cardSection q-mt-xs"
            >
              <div style="max-width: 600px">
                <q-expansion-item
                  v-model="common.expanded[1]"
                  label="已选参保人"
                >
                  <q-card>
                    <q-card-section>
                      <q-chip
                        v-for="(item, index) in searchParam.personList"
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
            <div id="byInsuredHistogram"></div>
          </q-card>
        </div>
      </div>
      <div class="row justify-center">
        <div class="col-9">
          <q-card class="q-mt-lg q-px-md q-pt-md">
            <div>
              <q-select
                filled
                v-model="common.model"
                :options="common.options"
                option-value="value"
                option-label="label"
                option-disable="inactive"
                emit-value
                map-options
                @input="changePointChart"
                style="min-width: 150px; max-width: 200px"
              />
            </div>
            <div class="q-mt-sm" id="byInsuredPoint"></div>
          </q-card>
        </div>
      </div>
      <div class="row q-mt-lg justify-center">
        <div class="col-6" style="padding-left:5%;">
          <q-table
            class="shadow-2 byInsuredTable"
            :title="common.OCTableData.title"
            :data="common.OCTableData.data"
            :columns="common.byInsuredTable.columns"
            row-key="index"
            flat
            bordered
            :filter="common.byInsuredTable.filter1"
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
                v-model="common.byInsuredTable.filter1"
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
            class="shadow-2 byInsuredTable q-ml-md"
            style="width:90%"
            :title="common.HCTableData.title"
            :data="common.HCTableData.data"
            :columns="common.byInsuredTable.columns"
            row-key="index"
            flat
            bordered
            :filter="common.byInsuredTable.filter2"
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
                v-model="common.byInsuredTable.filter2"
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
        url="/fundUse/getInsuredList"
        :searchParam="searchParam"
        :columns="common.dialog.columns"
        title="参保人"
        selection="multiple"
    /></q-dialog>
  </q-page>
</template>

<script>
import pageBaseScroll from "components/utils/PageScroll";
import {
  pickerOptions,
  shallowCopyObj,
  formatDate,
  exportTable
} from "assets/js/util/common";
import specificTable from "components/utils/specificTable";
import {
  setInsuredChartOption,
  setInsuredPointChartOption
} from "assets/js/charts/byInsuredOptions";
import { EleResize } from "assets/js/util/esresize";
export default {
  components: { specificTable, pageBaseScroll },
  data() {
    return {
      tempData: [],
      searchParam: {
        chargingTime: ["20160701", "20161231"],
        personNum: 15,
        type: "OCAndHC",
        order: "DESC",
        selectSpecific: false,
        showAllPerson: false,
        personList: []
      },
      common: {
        isInitialize: true,
        expanded: [true, true],
        pickerOptions: pickerOptions,
        switchLable: "选择所有参保人",
        model: "总医疗费用",
        options: [
          { label: "总医疗费用", value: "totalCost" },
          { label: "医保支付费用", value: "medicarePay" },
          { label: "个人支付费用", value: "individualPay" }
        ],
        byInsuredTable: {
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
              name: "person",
              label: "参保人",
              field: "person",
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
              label: "参保人",
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

      param = shallowCopyObj(this.searchParam, param);
      param.startDate = this.searchParam.chargingTime[0];
      param.endDate = this.searchParam.chargingTime[1];
      param2 = shallowCopyObj(param, param2);
      param2.departmentList = [];

      let optionData = [];
      await this.$http
        .post("/fundUse/monthlyFeeByInsured", param)
        .then(res => {
          if (res.status === 200) {
            optionData = res.data.data;
          }
        })
        .catch(e => {});

      param2.showAllPerson = true;
      let tableDataObj = {};
      await this.$http
        .post("/fundUse/monthlyFeeByInsuredTableData", param2)
        .then(res => {
          if (res.status === 200) {
            tableDataObj = res.data.data;
          }
        })
        .catch(() => {});

      this.tempData = optionData;
      this.afterHttp(optionData, tableDataObj);
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
        let histogramChart = this.$echarts.init(
          document.getElementById("byInsuredHistogram")
        );

        let pointChart = this.$echarts.init(
          document.getElementById("byInsuredPoint")
        );
        let linstener = function() {
          histogramChart.resize();
          pointChart.resize();
        };
        EleResize.on(resizeDiv, linstener);
        this.common.isInitialize = false;
      }
    },
    // 处理请求后的结果
    afterHttp(optionData, tableDataObj) {
      let histogramOption = setInsuredChartOption(optionData);
      this.drawChart(histogramOption, "byInsuredHistogram");

      let pointOption = setInsuredPointChartOption(
        optionData,
        "totalCost",
        this.searchParam
      );
      this.drawChart(pointOption, "byInsuredPoint");
      this.formatTableData(tableDataObj);
    },
    changePointChart(value) {
      let pointOption = setInsuredPointChartOption(
        this.tempData,
        value,
        this.searchParam
      );
      this.drawChart(pointOption, "byInsuredPoint");
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
          temp.person = table[i].person;
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
      this.common.OCTableData.title = tempTitle + "门诊" + "费用详情表";
      this.common.HCTableData.title = tempTitle + "住院" + "费用详情表";
    },
    // 按钮切换函数
    toggleFun(value, evt) {
      if (!this.searchParam.selectSpecific) {
        this.common.switchLable = "选择所有参保人";
      } else {
        this.common.switchLable = "选择特定参保人";
        this.common.dialog.showDialog = true;
      }
    },
    // 隐藏对话框
    hideDilog() {
      if (this.searchParam.personList.length === 0) {
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
      this.searchParam.personList = temp;
    },
    remove(index) {
      this.searchParam.personList.splice(index, 1);
    },
    exportTableOC() {
      exportTable(
        this.common.byInsuredTable.columns,
        this.common.OCTableData.data,
        "门诊参保人费用"
      );
    },
    exportTableHC() {
      exportTable(
        this.common.byInsuredTable.columns,
        this.common.HCTableData.data,
        "住院参保人费用"
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.byInsured {
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
  #byInsuredHistogram {
    height: 600px;
  }
  #byInsuredPoint {
    height: 600px;
  }
}
</style>
<style lang="sass">
.byInsuredTable
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
