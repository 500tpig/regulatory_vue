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
        <div class="col-9">
          <q-card class="q-mt-lg q-pt-md">
            <div id="byAgeGroupDoubleHistogram"></div>
          </q-card>
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
  formatDate
} from "assets/js/util/common";
import { EleResize } from "assets/js/util/esresize";
export default {
  components: { pageBaseScroll },
  data() {
    return {
      searchParam: {
        chargingTime: ["20160701", "20161231"],
        type: "OC",
        isDrillDown: "",
        ageGroup: ""
      },
      common: {
        expanded: [true],
        isInitialize: true,
        pickerOptions: pickerOptions
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
        "totalCost"
      );
      this.drawChart(doubleHistogramOption, "byAgeGroupDoubleHistogram");
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
