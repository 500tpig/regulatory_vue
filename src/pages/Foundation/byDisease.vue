<template>
  <q-page class="byDisease">
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
            <!-- <q-card-section horizontal class="items-center q-pl-xl cardSection">
              <span class="q-mr-md">日期选择:</span>
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
            </q-card-section> -->
            <q-card-section
              horizontal
              class="row items-center q-pl-xl"
              style="font-size:16px;font-weight:500;"
            >
              <span class="q-mr-md">开始日期:</span>
              <el-date-picker
                v-model="searchParam.chargingTime[0]"
                value-format="yyyyMMdd"
                clearable
                type="month"
                align="center"
                placeholder="选择月"
              >
              </el-date-picker>
              <span class="q-mx-md">结束日期:</span>
              <el-date-picker
                v-model="searchParam.chargingTime[1]"
                value-format="yyyyMMdd"
                clearable
                type="month"
                align="center"
                placeholder="选择月"
              >
              </el-date-picker>
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
              <span class="q-mr-sm q-ml-md">展示疾病数量:</span>
              <q-input
                class="numberInput"
                v-model.number="searchParam.diseaseNum"
                type="number"
                outlined
                dense
                :disable="searchParam.showAllDep"
                :input-style="{ textAlign: 'center' }"
                :rules="[
                  val => (val !== null && val !== '') || '请输入疾病数量',
                  val => val > 0 || '疾病数量小于或者为0'
                ]"
              />
              <span class="q-mx-sm">或</span>
              <q-checkbox
                v-model="searchParam.showAllDis"
                val="DESC"
                label="全部"
                color="red"
              />
              <div class="text-subtitle2 q-ml-xs" v-if="searchParam.showAllDis">
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
                  searchParam.diseaseList.length !== 0 &&
                    searchParam.selectSpecific
                "
              />
            </q-card-section>
            <q-card-section
              horizontal
              v-if="
                searchParam.diseaseList.length !== 0 &&
                  searchParam.selectSpecific
              "
              class="row items-center q-pl-xl cardSection q-mt-xs"
            >
              <div style="max-width: 400px">
                <q-expansion-item v-model="common.expanded[1]" label="已选科室">
                  <q-card>
                    <q-card-section>
                      <q-chip
                        v-for="(item, index) in searchParam.diseaseList"
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
            <div id="byDiseaseHistogram"></div>
          </q-card>
        </div>
      </div>
      <div class="row justify-center">
        <div class="col-9">
          <q-card class="q-mt-lg q-px-md q-pt-md"
            ><div>
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
            <div class="q-mt-sm" id="byDiseasePoint"></div>
          </q-card>
        </div>
      </div>
    </page-base-scroll>
    <q-dialog v-model="common.dialog.showDialog" @before-hide="hideDilog"
      ><specificTable
        @selectConfirm="selectConfirm"
        url="/fundUse/getDiseaseOC"
        :searchParam="searchParam"
        :columns="common.dialog.columns"
        title="疾病"
    /></q-dialog>
  </q-page>
</template>

<script>
import pageBaseScroll from "components/utils/PageScroll";
import { EleResize } from "assets/js/util/esresize";
import {
  getMonthLastDay,
  formatDate,
  pickerOptions,
  shallowCopyObj,
  accAdd
} from "assets/js/util/common";
import {
  setDiseaseChartOption,
  setDiseasePointChartOption
} from "assets/js/charts/byDiseaseOptions";
import specificTable from "components/utils/specificTable";
export default {
  components: { pageBaseScroll, specificTable },
  data() {
    return {
      tempData: [],
      searchParam: {
        chargingTime: ["20160701", "20161231"],
        diseaseNum: 15,
        type: "OCAndHC",
        order: "DESC",
        selectSpecific: false,
        showAllDis: false,
        diseaseList: [],
        isDrillDown: false
      },
      common: {
        switchLable: "选择所有疾病",
        model: "总医疗费用",
        options: [
          { label: "总医疗费用", value: "totalCost" },
          { label: "医保支付费用", value: "medicarePay" },
          { label: "个人支付费用", value: "individualPay" }
        ],
        pickerOptions: pickerOptions,
        isInitialize: true,
        expanded: [true, true],
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
              label: "疾病",
              field: "column",
              sortable: true,
              align: "center"
            }
          ]
        }
      }
    };
  },
  methods: {
    async initialize() {
      let param = {};

      this.searchParam.isDrillDown = false;

      param = shallowCopyObj(this.searchParam, param);
      param.startDate = this.searchParam.chargingTime[0];
      param.endDate = this.searchParam.chargingTime[1];

      let optionData = [];
      await this.$http
        .post("/fundUse/monthlyFeeOCByDisease", param)
        .then(res => {
          if (res.status === 200) {
            optionData = res.data.data;
          }
        })
        .catch(e => {});
      this.tempData = optionData;
      this.afterHttp(optionData);
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
        // if (id === "byDepartmentHistogram") {
        //   myChart.on("click", function(param) {
        //     that.drillDown(param);
        //   });
        // }

        let histogramChart = this.$echarts.init(
          document.getElementById("byDiseaseHistogram")
        );

        let pointChart = this.$echarts.init(
          document.getElementById("byDiseasePoint")
        );

        let histogramDiv = document.getElementById("byDiseaseHistogram");
        let linstener = function() {
          histogramChart.resize();
          pointChart.resize();
        };
        EleResize.on(resizeDiv, linstener);
        this.common.isInitialize = false;
      }
    },
    // 处理请求后的结果
    afterHttp(optionData, ringData) {
      let histogramOption = setDiseaseChartOption(
        optionData,
        this.searchParam.isDrillDown
      );
      this.drawChart(histogramOption, "byDiseaseHistogram");
      let pointOption = setDiseasePointChartOption(
        optionData,
        "totalCost",
        this.searchParam
      );
      this.drawChart(pointOption, "byDiseasePoint");
    },
    // 按钮切换函数
    toggleFun(value, evt) {
      if (!this.searchParam.selectSpecific) {
        this.common.switchLable = "选择所有疾病";
      } else {
        this.common.switchLable = "选择特定疾病";
        this.common.dialog.showDialog = true;
      }
    },
    changePointChart(value) {
      let pointOption = setDiseasePointChartOption(
        this.tempData,
        value,
        this.searchParam
      );
      this.drawChart(pointOption, "byDiseasePoint");
    },
    remove(index) {
      this.searchParam.diseaseList.splice(index, 1);
    },
    // 隐藏对话框
    hideDilog() {
      if (this.searchParam.diseaseList.length === 0) {
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
      this.searchParam.diseaseList = temp;
    }
  },
  mounted() {
    this.initialize();
  }
};
</script>

<style lang="scss" scoped>
.byDisease {
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
  #byDiseaseHistogram {
    height: 620px;
  }
  #byDiseasePoint {
    height: 620px;
  }
}
</style>
