<template>
  <div class="comparison">
    <div class="row">
      <q-expansion-item
        class="shadow-1 overflow-hidden col-9"
        style="border-radius: 30px"
        icon="icon-icon_shaixuan"
        label="筛选条件"
        v-model="comparisonCommon.expanded"
        header-class="bg-primary text-white text-weight-medium"
        expand-icon-class="text-white"
      >
        <q-card class="q-mt-md">
          <q-card-section horizontal class="items-center q-px-lg cardSection">
            <span class="text-weight-medium">已选参保人:</span>
          </q-card-section>
          <q-card-section
            horizontal
            class=" items-center q-px-lg cardSection row"
          >
            <div class="col row" v-if="comparisonParam.personIds.length > 0">
              <div
                v-for="(item, index) in comparisonParam.personIds"
                :key="index"
              >
                <sapn class="q-mr-md">参保人{{ index + 1 }}:</sapn>
                <q-chip
                  removable
                  @remove="removePersonId(item, index)"
                  outline
                  color="light-blue"
                  icon="icon-user"
                >
                  {{ item }}
                </q-chip>
              </div>
            </div>
            <div v-else class="row  text-weight-medium col">
              <div class="offset-2">
                无
              </div>
            </div>
          </q-card-section>
          <q-card-section
            horizontal
            class="q-mt-sm items-center q-px-lg cardSection"
          >
            <q-btn
              color="primary"
              @click="comparisonCommon.dialog.showDialog = true"
              >参保人选择</q-btn
            >
          </q-card-section>
          <q-card-section
            horizontal
            class="items-center q-px-lg cardSection q-mt-sm"
          >
            <q-select
              v-model="comparisonParam.feeType"
              :options="comparisonCommon.feeOptions"
              label="费用类型"
              class="text-weight-medium"
              label-color="black"
            />
            <span class="q-ml-lg q-mr-sm text-weight-medium">产生部门:</span>
            <q-option-group
              v-model="comparisonParam.type"
              :options="common.typeOptions"
              color="primary"
              style="font-size:14px;"
              inline
              class="subText"
            />
            <span class="q-ml-lg q-mr-md text-weight-medium">日期选择:</span>
            <el-date-picker
              align="center"
              value-format="yyyyMMdd"
              v-model="comparisonParam.chargingTime"
              type="monthrange"
              unlink-panels
              clearable
              start-placeholder="开始月份"
              end-placeholder="结束月份"
              :picker-options="common.pickerOptions"
            >
            </el-date-picker>
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
    <div class="q-mt-md row justify-center">
      <q-card class="q-pa-md col-11" style="height:700px;" id="comparisonChart">
      </q-card>
    </div>
    <q-dialog v-model="comparisonCommon.dialog.showDialog"
      ><specificTable
        @selectConfirm="selectConfirm"
        url="/person/getPersonList"
        :searchParam="searchParam"
        :columns="comparisonCommon.dialog.columns"
        title="参保人"
        selection="multiple"
    /></q-dialog>
    <q-dialog v-model="comparisonCommon.alert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Alert</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          参保人最多选择3人，请重新选择
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import {
  shallowCopyObj,
  getYearBetween,
  getLastDay
} from "assets/js/util/common";
import { setGinsengContrastChartOption } from "assets/js/charts/byTimeLineOptions";
import { EleResize } from "assets/js/util/esresize";
import specificTable from "components/utils/specificTable";
export default {
  components: { specificTable },
  props: {
    common: Object,
    searchParam: Object,
    portraitInfo: Object
  },
  data() {
    return {
      comparisonCommon: {
        isInitialize: true,
        alert: false,
        expanded: true,
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
            },
            {
              name: "sex",
              label: "性别",
              field: "sex",
              sortable: true,
              align: "center"
            },
            {
              name: "name",
              label: "姓名",
              field: "name",
              sortable: true,
              align: "center"
            },
            {
              name: "survival",
              label: "生存状态",
              field: "survival",
              sortable: true,
              align: "center"
            }
          ]
        },
        feeOptions: [
          {
            label: "个人支付",
            value: "individualPay"
          },
          {
            label: "医保支付",
            value: "medicarePay"
          },
          {
            label: "总医疗费用",
            value: "totalCost"
          }
        ],
        personArr: [true]
      },
      comparisonParam: {
        feeType: {
          label: "总医疗费用",
          value: "totalCost"
        },
        type: "",
        chargingTime: [],
        personIds: [],
        chartData: []
      }
    };
  },
  methods: {
    async initialize() {
      let param = {};
      param = shallowCopyObj(this.comparisonParam, param);
      param.startDate = this.comparisonParam.chargingTime[0];
      param.endDate = this.comparisonParam.chargingTime[1];
      await this.getChartData(param);
      this.afterHttp();
    },
    async getChartData(param) {
      let chartData = [];
      await this.$http
        .post("/person/comparisonOfMedical", param)
        .then(res => {
          if (res.status === 200) {
            chartData = res.data.data;
          }
        })
        .catch(e => {});
      this.chartData = chartData;
    },
    afterHttp() {
      let option = setGinsengContrastChartOption(
        this.chartData,
        this.comparisonParam
      );
      this.drawChart(option, "comparisonChart");
    },
    // 画图表
    drawChart(option, id) {
      if (this.chartData.length > 0) {
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById(id));
        let resizeDiv = document.getElementById(id);
        // 指定图表的配置项和数据
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option, true);
        let that = this;
        if (this.comparisonCommon.isInitialize) {
          let comparisonChart = this.$echarts.init(
            document.getElementById("comparisonChart")
          );
          let linstener = function() {
            comparisonChart.resize();
          };
          EleResize.on(resizeDiv, linstener);
          this.comparisonCommon.initialize = false;
        }
      } else {
        // 以下是暂无数据显示样式(样式根据本身需求进行调整)
        let html =
          '<div><span  style="position: absolute;margin-left:46%;top:45%;color:#868686; font-size: 20px;">暂无数据</span></div>';
        document.getElementById(id).innerHTML = html;
        document.getElementById(id).removeAttribute("_echarts_instance_");
      }
    },
    removePersonId(obj, index) {
      this.comparisonParam.personIds.splice(index, 1);
    },
    selectConfirm(data) {
      if (data.length > 3) {
        this.comparisonCommon.alert = true;
        return;
      }
      this.comparisonCommon.dialog.showDialog = false;
      for (let i = 0; i < data.length; i++) {
        if (i > 3 || this.comparisonParam.personIds.length === 3) {
          break;
        }
        let temp = data[i];
        if (this.comparisonParam.personIds.indexOf(temp.column)) {
          this.comparisonParam.personIds.push(temp.column);
        }
      }
    }
  },
  mounted() {
    this.comparisonParam.type = this.searchParam.type;
    this.comparisonParam.chargingTime = this.searchParam.chargingTime;
    this.comparisonParam.personIds.push(this.searchParam.personId);
    this.initialize();
  }
};
</script>

<style scoped lang="scss"></style>
