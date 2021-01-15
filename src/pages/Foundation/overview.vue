<template>
  <q-page class="overview">
    <page-base-scroll content_class="q-mt-md q-px-md q-pb-lg">
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
                  unlink-panels
                  clearable
                  type="monthrange"
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
                @click="initialize"
                style="font-size:16px;"
                >提交</q-btn
              >
            </q-card-actions>
          </q-card>
        </q-expansion-item>
      </div>
      <div class="row justify-center">
        <q-card id="lineChart" class="col-9 q-mt-md q-pt-sm"></q-card>
      </div>
      <div class="row justify-center q-mt-md">
        <div class="col-6 row justify-center q-px-md">
          <q-card class="col-12" id="drugRadar"></q-card>
        </div>
        <div class="col-6 row justify-center q-px-md">
          <q-card class="col-12" id="overallPlanning"></q-card>
        </div>
      </div>
      <div class="row justify-center q-mt-md">
        <div class="col-6 row justify-center q-px-md">
          <q-card class="col-12" id="subsidyChart"></q-card>
        </div>
        <div class="col-6 row justify-center q-px-md">
          <q-card class="col-12" id="drugRanking"></q-card>
        </div>
      </div>
    </page-base-scroll>
  </q-page>
</template>

<script>
import pageBaseScroll from "components/utils/PageScroll";
import {
  pickerOptions,
  shallowCopyObj,
  getMonthLastDay
} from "assets/js/util/common";
import specificTable from "components/utils/specificTable";
import { EleResize } from "assets/js/util/esresize";
import {
  setLineChartOption,
  setdrugRadarChartOption,
  setoVerallPlanningOption,
  setSubsidyChartOption,
  setDrugRankingChartOption
} from "assets/js/charts/overviewOptions";
export default {
  components: { pageBaseScroll },
  data() {
    return {
      searchParam: {
        personId: "B4009B864068C706A0ED408167E7A03AFCCA8BF95E698A30",
        chargingTime: ["20160701", "20171231"],
        type: "OCAndHC"
      },
      common: { pickerOptions: pickerOptions, isInitialize: true },
      expanded: true
    };
  },
  methods: {
    async initialize() {
      let param = {};
      param = shallowCopyObj(this.searchParam, param);
      param.startDate = this.searchParam.chargingTime[0];
      param.endDate = this.searchParam.chargingTime[1];
      param.endDate = getMonthLastDay(param.endDate);
      let optionData = [];
      await this.$http
        .post("/fundUse/monthlyFee", param)
        .then(res => {
          if (res.status === 200) {
            optionData = res.data.data;
          }
        })
        .catch(() => {});

      let drugRadarData = [];
      await this.$http
        .post("/fundUse/drugRadarChart", param)
        .then(res => {
          if (res.status === 200) {
            drugRadarData = res.data.data;
          }
        })
        .catch(() => {});

      let overallPlanning = [];
      await this.$http
        .post("/fundUse/overallPlanning", param)
        .then(res => {
          if (res.status === 200) {
            overallPlanning = res.data.data;
          }
        })
        .catch(() => {});

      let subsidyData = [];

      await this.$http
        .post("/fundUse/subsidy", param)
        .then(res => {
          if (res.status === 200) {
            subsidyData = res.data.data;
          }
        })
        .catch(() => {});

      let drugRanking = [];

      await this.$http
        .post("/fundUse/drugRanking", param)
        .then(res => {
          if (res.status === 200) {
            drugRanking = res.data.data;
          }
        })
        .catch(() => {});
      console.log(drugRanking);

      this.afterHttp(
        optionData,
        drugRadarData,
        overallPlanning,
        subsidyData,
        drugRanking
      );
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
        let lineChart = this.$echarts.init(
          document.getElementById("lineChart")
        );

        let drugRadarChart = this.$echarts.init(
          document.getElementById("drugRadar")
        );
        let overallPlanningChart = this.$echarts.init(
          document.getElementById("overallPlanning")
        );

        let subsidyChart = this.$echarts.init(
          document.getElementById("subsidyChart")
        );

        let drugRankingChart = this.$echarts.init(
          document.getElementById("drugRanking")
        );

        let linstener = function() {
          lineChart.resize();
          drugRadarChart.resize();
          overallPlanningChart.resize();
          subsidyChart.resize();
          drugRankingChart.resize();
        };
        EleResize.on(resizeDiv, linstener);
        this.common.isInitialize = false;
      }
    },
    // 处理请求后的结果
    afterHttp(
      optionData,
      drugRadarData,
      overallPlanning,
      subsidyData,
      drugRanking
    ) {
      let lineChartOption = setLineChartOption(optionData, this.searchParam);
      this.drawChart(lineChartOption, "lineChart");

      let drugRadarOption = setdrugRadarChartOption(
        drugRadarData,
        this.searchParam
      );
      this.drawChart(drugRadarOption, "drugRadar");

      let overallPlanningOption = setoVerallPlanningOption(
        overallPlanning,
        this.searchParam
      );
      this.drawChart(overallPlanningOption, "overallPlanning");

      let subsidyChartOption = setSubsidyChartOption(subsidyData);
      this.drawChart(subsidyChartOption, "subsidyChart");

      let drugRankingChartOption = setDrugRankingChartOption(drugRanking);
      this.drawChart(drugRankingChartOption, "drugRanking");
    }
  },
  mounted() {
    this.initialize();
  }
};
</script>

<style scoped lang="scss">
.overview {
  #lineChart {
    height: 670px;
  }
  #drugRadar {
    height: 550px;
  }
  #subsidyChart {
    height: 600px;
  }
}
</style>
