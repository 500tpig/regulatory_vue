<template>
  <q-page class="audit row q-pa-md">
    <div class="col-5 row">
      <q-card class="col-12 q-pa-md">
        <div class="q-mb-sm">
          <span class="demonstration q-mr-md">导入时间:</span>
          <el-date-picker
            class="subText"
            v-model="param.importTime"
            type="datetimerange"
            :picker-options="common.pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="center"
          >
          </el-date-picker>
        </div>
        <div class="row items-center q-mb-sm">
          <span class="demonstration q-mr-md">反馈情况:</span>
          <div class="subText">
            <q-radio v-model="param.type" val="unprocessed" label="未处理" />
            <q-radio v-model="param.type" val="processed" label="已处理" />
            <q-radio v-model="param.type" val="all" label="全选" />
          </div>
        </div>
        <div class="row items-center q-mb-sm">
          <span class="demonstration q-mr-md">违规类型:</span>
          <q-toggle
            :label="common.switchLable"
            color="pink"
            v-model="param.selectAllType"
            left-label
            @input="toggleFun"
          />
        </div>
      </q-card>
    </div>
    <div class="col-7 row q-pl-md">
      <q-card class="col-12 row"></q-card>
    </div>
  </q-page>
</template>

<script>
import {
  formatDate,
  pickerOptions,
  shallowCopyObj,
  accAdd,
  exportTable
} from "assets/js/util/common";
export default {
  data() {
    return {
      param: {
        importTime: [],
        type: "unprocessed",
        selectAllType: true
      },
      common: {
        pickerOptions: pickerOptions,
        switchLable: "所有类型"
      }
    };
  },
  methods: {
    toggleFun(obj) {
      console.log(obj);
      if (obj) {
        this.common.switchLable = "所有类型";
      } else {
        this.common.switchLable = "特定类型";
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.audit {
  color: #333160;
  font-weight: 500;
  .subText {
    font-weight: 400;
    //     color: #838098;
    //     font-size: 16px;
  }
}
</style>
