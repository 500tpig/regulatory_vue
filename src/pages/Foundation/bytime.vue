<template>
  <q-page class="byTIme q-pt-lg">
    <div class="row byTime-searchBar-row">
      <!-- 筛选栏 -->
      <div class="col-8 offset-2 byTime-searchBar-row-col">
        <q-card
          class="byTime-searchBar-row-col-card bg-white text-primary q-pt-md"
        >
          <!-- <q-separator dark /> -->
          <q-card-section horizontal class="row q-px-lg items-center">
            <div class=" byTime-searchBar-row-col-card-select">
              <q-select
                v-model="searchParam.type"
                :options="options"
                multiple
                rounded
                outlined
                prefix="类型"
                color="primary"
                bg-color="white"
              >
                <template v-slot:selected-item="scope">
                  <q-chip
                    removable
                    dense
                    @remove="scope.removeAtIndex(scope.index)"
                    :tabindex="scope.tabindex"
                    color="white"
                    text-color="primary"
                    class="q-mx-xs"
                  >
                    {{ scope.opt }}
                  </q-chip>
                </template>
              </q-select>
            </div>
            <div class=" q-ml-lg">
              <q-input
                v-model="searchParam.startDate"
                prefix="开始日期 :"
                type="date"
                rounded
                outlined
                :input-style="{ color: '#018DA7' }"
              />
            </div>
            <div class=" q-ml-lg">
              <q-input
                v-model="searchParam.endDate"
                prefix="结束日期 :"
                type="date"
                rounded
                outlined
                :input-style="{ color: '#018DA7' }"
              />
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn class="q-mr-lg" flat>提交</q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
    <div class="row">
      <div class="col-8 offset-2 ">
        <q-card class="q-mt-lg q-pt-md">
          <div id="main"></div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { EleResize } from "assets/js/esresize";
import { byTimeOption } from "assets/js/charts/byTimeOption";
export default {
  name: "Echarts",
  data() {
    return {
      searchParam: {
        startDate: "",
        endDate: "",
        type: ["个人支付", "医保支付", "医疗总费用"]
      },
      options: ["个人支付", "医保支付", "医疗总费用"],
      model: {
        label: "Google",
        value: "goog",
        icon: "mail"
      }
    };
  },
  methods: {
    onItemClick() {},
    myEcharts() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("main"));
      let resizeDiv = document.getElementById("main");
      // 指定图表的配置项和数据
      let option = byTimeOption;
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
      let linstener = function() {
        myChart.resize();
      };
      EleResize.on(resizeDiv, linstener);
    }
  },
  mounted() {
    this.myEcharts();
  }
};
</script>

<style lang="scss" scoped>
.byTIme {
  #main {
    // width: 80%;
    height: 600px;
  }
  .byTime-searchBar-row {
    .byTime-searchBar-row-col {
      .byTime-searchBar-row-col-card {
        .input:focus {
          color: white;
        }
        .byTime-searchBar-row-col-card-select {
          width: auto;
          min-width: 200px;
        }
      }
    }
  }
}
</style>
