<template>
  <q-page class="byTIme q-py-lg">
    <div class="row byTime-searchBar-row">
      <!-- 筛选栏 -->
      <div class="col-8 offset-2 byTime-searchBar-row-col">
        <q-card
          class="byTime-searchBar-row-col-card bg-white text-primary q-pt-md"
        >
          <!-- <q-separator dark /> -->
          <q-card-section horizontal class="row items-center justify-center">
            <span class="q-mr-sm">类型选择 :</span>
            <el-select
              v-model="searchParam.type"
              multiple
              placeholder="请选择"
              class="col-4"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <div>
              <span class="q-ml-lg q-mr-sm">日期选择 :</span>
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
            <q-btn class="q-mr-lg" flat @click="submit">提交</q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
    <div class="row">
      <div class="col-8 offset-2 ">
        <q-card class="q-mt-lg q-pt-md">
          <div ref="histogram" id="byTimeHistogram"></div>
        </q-card>
      </div>
    </div>
    <div class="row q-mt-lg">
      <q-card class="col-5 offset-1">
        <div id="byTimePieChart"></div>
      </q-card>
      <div>
        <q-table
          class="byTimeTable col-5 q-ml-lg shadow-2"
          title="医保支付详情表"
          :data="byTimeTable.data"
          :columns="byTimeTable.columns"
          row-key="index"
          flat
          bordered
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { EleResize } from "assets/js/util/esresize";
import { getMonthLastDay } from "assets/js/util/common";
import {
  setbyTimeChartOption,
  setbyTimePieChartOption
} from "assets/js/charts/byTimeOption";
export default {
  name: "byTime",
  data() {
    return {
      searchParam: {
        chargingTime: ["20160701", "20161231"],
        type: ["individualPay", "medicarePay", "totalCost"]
      },
      byTimeTable: {
        columns: [
          {
            name: "index",
            label: "#",
            field: "index",
            align: "center",
            sortable: true
          },
          {
            name: "chargingTime",
            label: "日期",
            field: "chargingTime",
            sortable: true,
            align: "center"
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
        ],
        data: []
      },
      options: [
        { value: "individualPay", label: "个人支付" },
        { value: "medicarePay", label: "医保支付" },
        { value: "totalCost", label: "医疗总费用" }
      ],

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
  },
  methods: {
    async submit() {
      let parm = {};
      this.searchParam.type.map(item => {
        parm[item] = item;
      });
      parm.startDate = this.searchParam.chargingTime[0];
      parm.endDate = getMonthLastDay(this.searchParam.chargingTime[1]);
      let optionData;
      await this.$http
        .post("/fundUse/getFundUseByTime", parm)
        .then(async res => {
          if (res.status === 200) {
            optionData = res.data.data;
          }
        })
        .catch(() => {});
      let histogramOption = setbyTimeChartOption(optionData);
      this.changeChart(histogramOption, "byTimeHistogram");
      this.formatTableData(optionData);
      let pieOption = setbyTimePieChartOption(optionData);
      this.changeChart(pieOption, "byTimePieChart");
    },
    changeChart(option, id) {
      let myChart = this.$echarts.init(document.getElementById(id));
      myChart.setOption(option, true);
    },
    drawChart(option, id) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById(id));
      let resizeDiv = document.getElementById(id);
      // 指定图表的配置项和数据
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option, true);
      let linstener = function() {
        myChart.resize();
      };
      EleResize.on(resizeDiv, linstener);
    },
    async initialize() {
      let parm = {
        totalCost: "totalCost",
        individualPay: "individualPay",
        medicarePay: "medicarePay",
        startDate: "20160701",
        endDate: "20161231"
      };
      let optionData = [];
      await this.$http
        .post("/fundUse/getFundUseByTime", parm)
        .then(async res => {
          if (res.status === 200) {
            optionData = res.data.data;
            let histogramOption = setbyTimeChartOption(optionData);
            this.drawChart(histogramOption, "byTimeHistogram");
            this.formatTableData(optionData);
            let pieOption = setbyTimePieChartOption(optionData);
            this.drawChart(pieOption, "byTimePieChart");
          }
        })
        .catch(() => {});
    },
    formatTableData(optionData) {
      this.byTimeTable.data = [];
      for (let i = 0; i < optionData.length; i++) {
        let temp = {};
        temp.index = i + 1;
        temp.individualPay = optionData[i].individualPay;
        temp.medicarePay = optionData[i].medicarePay;
        temp.totalCost = optionData[i].totalCost;
        temp.chargingTime =
          optionData[i].chargingTime.slice(0, 4) +
          "-" +
          optionData[i].chargingTime.slice(4);
        temp.ratio =
          ((optionData[i].medicarePay / optionData[i].totalCost) * 100).toFixed(
            2
          ) + "%";
        this.byTimeTable.data.push(temp);
      }
    }
  },
  mounted() {
    this.initialize();
  }
};
</script>

<style lang="scss" scoped>
.byTIme {
  #byTimeHistogram {
    height: 600px;
  }
  #byTimePieChart {
    height: 400px;
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
<style lang="sass">
.byTimeTable
  /* height or max-height is important */
  height: 400px

  .q-table__title
    font-size: 24px
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
