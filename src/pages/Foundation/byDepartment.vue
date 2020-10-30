<template>
  <q-page class="byDepartment">
    <page-base-scroll content_class="q-pt-lg q-mb-xl">
      <div class="row justify-center">
        <q-card class="col-7 q-pt-md">
          <q-card-section
            horizontal
            class="row items-center q-pl-xl cardSection"
            style="font-size:16px;font-weight:500;"
          >
            <div class="q-mr-sm">类型选择:</div>
            <div class="q-gutter-sm text-grey-8" style="font-size:14px;">
              <q-radio
                v-model="searchParam.type"
                val="OC"
                label="门诊费用"
                color="teal-5"
              />
              <q-radio
                v-model="searchParam.type"
                val="HC"
                label="住院费用"
                color="deep-orange-6"
              />
              <q-radio
                v-model="searchParam.type"
                val="OCAndHC"
                label="全选"
                color="blue-6"
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
          <q-card-section
            horizontal
            class="row items-center q-pl-xl cardSection q-mt-xs"
            style="font-size:16px;font-weight:500;"
          >
            <span class="q-mr-sm">科室数量:</span>
            <q-input
              class="numberInput"
              v-model.number="searchParam.departmentNum"
              type="number"
              outlined
              dense
              :input-style="{ textAlign: 'center' }"
              :rules="[
                val => (val !== null && val !== '') || '请输入科室数量',
                val => val > 0 || '科室数量小于或者为0'
              ]"
            />
            <div class="q-mr-sm q-ml-md">排序方式:</div>
            <div class="q-gutter-sm text-grey-8" style="font-size:14px;">
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
      </div>
      <div class="row">
        <div class="col-8 offset-2 ">
          <q-card class="q-mt-lg q-pt-md">
            <div ref="histogram" id="byDepartmentHistogram"></div>
          </q-card>
        </div>
      </div>
    </page-base-scroll>
  </q-page>
</template>

<script>
import pageBaseScroll from "components/utils/PageScroll";
import { EleResize } from "assets/js/util/esresize";
import { setDepartmentChartOption } from "assets/js/charts/byDepartmentOptions";
import {
  getMonthLastDay,
  formatDate,
  pickerOptions
} from "assets/js/util/common";
export default {
  components: { pageBaseScroll: pageBaseScroll },
  data() {
    return {
      searchParam: {
        chargingTime: ["20160701", "20161231"],
        departmentNum: 15,
        type: "OCAndHC",
        order: "DESC"
      },
      pickerOptions: pickerOptions,
      isInitialize: true
    };
  },
  mounted() {
    this.initialize();
  },
  methods: {
    // 初始化请求
    async initialize() {
      let param = {
        type: this.searchParam.type,
        startDate: this.searchParam.chargingTime[0],
        endDate: this.searchParam.chargingTime[1],
        departmentNum: this.searchParam.departmentNum,
        sort: this.searchParam.order
      };
      let optionData = [];
      await this.$http
        .post("/fundUse/monthlyFeeByDepartment", param)
        .then(res => {
          if (res.status === 200) {
            optionData = res.data.data;
          }
        })
        .catch(() => {});
      // let ringData = {};
      // await this.$http
      //   .post("/fundUse/monthlyFeeOCAndHC", param)
      //   .then(res => {
      //     if (res.status === 200) {
      //       ringData = res.data.data;
      //     }
      //   })
      //   .catch(() => {});
      // console.log(ringData);
      this.afterHttp(optionData);
    },

    // 画图表
    drawChart(option, id) {
      // 基于准备好的dom，初始化echarts实例
      // let oldChart = this.$echarts.init(document.getElementById(id));
      // oldChart.dispose();
      let myChart = this.$echarts.init(document.getElementById(id));
      let resizeDiv = document.getElementById(id);
      // 指定图表的配置项和数据
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option, true);
      let that = this;
      // if (id === "byTimeHistogram") {
      //   myChart.on("click", function(param) {
      //     that.drillDown(param.name);
      //   });
      // }
      if (this.isInitialize) {
        let linstener = function() {
          myChart.resize();
        };
        EleResize.on(resizeDiv, linstener);
        this.isInitialize = false;
      }
    },
    afterHttp(optionData) {
      let histogramOption = setDepartmentChartOption(optionData);
      this.drawChart(histogramOption, "byDepartmentHistogram");
    }
  },
  beforeDestroy() {}
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
      max-width: 160px;
      margin-bottom: -20px;
    }
  }
  #byDepartmentHistogram {
    height: 600px;
  }
}
</style>
