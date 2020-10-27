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
                val => (val > 0 && val < 100) || '科室数量小于或者为0'
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
                :rules="[
                  val => (val !== null && val !== '') || 'Please type your age',
                  val => (val > 0 && val < 100) || 'Please type a real age'
                ]"
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
    </page-base-scroll>
  </q-page>
</template>

<script>
import pageBaseScroll from "components/utils/PageScroll";
export default {
  components: { pageBaseScroll: pageBaseScroll },
  data() {
    return {
      searchParam: {
        chargingTime: ["20160701", "20161231"],
        departmentNum: 15
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "本月",
            onClick(picker) {
              picker.$emit("pick", [new Date(), new Date()]);
            }
          },
          {
            text: "今年至今",
            onClick(picker) {
              const end = new Date();
              const start = new Date(new Date().getFullYear(), 0);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近六个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setMonth(start.getMonth() - 6);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
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
