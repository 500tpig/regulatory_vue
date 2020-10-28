<template>
  <q-page class="byDepartment">
    <page-base-scroll content_class="q-pt-lg q-mb-xl">
      <div class="row">
        <q-card class="col-6 offset-3 q-pt-md">
          <q-card-section
            horizontal
            class="row items-center q-pl-xl cardSection"
            style="font-size:16px;font-weight:500;"
          >
            <span class="q-mr-md">科室数量:</span>
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
            <q-btn class="q-mr-lg" flat style="font-size:16px;">提交</q-btn>
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
        departmentNum: 15
      },
      pickerOptions: pickerOptions
    };
  },
  mounted() {
    this.initialize();
  },
  methods: {
    // 初始化请求
    async initialize() {
      let param = {
        type: "OCAndHC",
        startDate: "20160701",
        endDate: "20161231",
        mode: "byDepartment"
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
      console.log(optionData);
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
      max-width: 160px;
      margin-bottom: -20px;
    }
  }
}
</style>
