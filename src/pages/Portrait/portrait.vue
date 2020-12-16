<template>
  <q-page class="Portrait">
    <page-base-scroll content_class="q-mb-md q-pt-lg q-pb-md">
      <div class="row justify-between">
        <q-card class="col-5 q-pa-md row firstCard q-ml-lg">
          <q-avatar size="80px" class="q-mr-lg self-center">
            <img style="border-radius:50%" :src="portraitInfo.photo" />
          </q-avatar>
          <div class="col">
            <div style="font-size:20px;">
              {{ portraitInfo.xming0 }}
            </div>
            <div class="row q-my-sm">
              <span class="col-3">社会保障号:</span>
              <span class="col-4 subText hideText"
                >1234567891011{{ portraitInfo.id0000 }}
                <q-tooltip
                  content-class="bg-white text-black shadow-4 text-weight-medium"
                  content-style="font-size: 13px"
                  :offset="[10, 10]"
                >
                  1234567891011
                </q-tooltip>
              </span>
              <span class="col-2">性别:</span>
              <span class="col-3 subText">{{ portraitInfo.sex }}</span>
            </div>
            <div class="row q-my-sm">
              <span class="col-3">公民身份号码:</span>
              <span class="col-4 subText hideText"
                >1111111111111111234{{ portraitInfo.sfzhao }}
                <q-tooltip
                  content-class="bg-white text-black shadow-4 text-weight-medium"
                  content-style="font-size: 13px"
                  :offset="[10, 10]"
                >
                  1111111111111111234
                </q-tooltip>
              </span>
              <span class="col-2">出生日期:</span>
              <span class="col-3 subText">{{ portraitInfo.birthday }}</span>
            </div>
            <div class="row q-my-sm">
              <span class="col-3">名族:</span>
              <span class="col-4 subText">{{ portraitInfo.nation }}</span>
              <span class="col-2">年龄:</span>
              <span class="col-3 subText">{{ portraitInfo.age }}</span>
            </div>
          </div>
        </q-card>
        <q-card class="col-3 q-pa-md row mainText secondCard">
          <div class="col">
            <div class="row q-my-sm">
              <span class="col-3">地区编号:</span>
              <span class="col-2 subText">{{ portraitInfo.dqbhao }}</span>
              <span class="col-3 offset-1">邮政编码:</span>
              <span class="col-3 subText">{{ portraitInfo.yzbma0 }}</span>
            </div>
            <div class="row q-my-sm">
              <span class="col-3">户口性质:</span>
              <span class="col-2 subText">{{ portraitInfo.hkxzhi }}</span>
              <span class="col-3 offset-1">户口所在地:</span>
              <span class="col-3 subText">{{ portraitInfo.hkszdi }}</span>
            </div>
            <div class="row q-my-sm">
              <span class="col-3">联系电话:</span>
              <span class="col-4 subText">{{ portraitInfo.lxdhua }}</span>
            </div>
            <div class="row q-my-sm">
              <span class="col-3">单位编号:</span>
              <span class="col-9 subText">{{ portraitInfo.dwid00 }}</span>
            </div>
          </div>
        </q-card>
        <q-card class="col-3 q-pa-md row mainText thirdCard q-mr-lg">
          <div class="col">
            <div class="row q-my-sm">
              <span class="col-4">养老参保标志:</span>
              <span class="col-2 subText">{{ portraitInfo.ylcbbz }}</span>
              <span class="col-4">工伤参保标志:</span>
              <span class="col-2 subText">{{ portraitInfo.gscbbz }}</span>
            </div>
            <div class="row q-my-sm">
              <span class="col-4">失业参保标志:</span>
              <span class="col-2 subText">{{ portraitInfo.sycbbz }}</span>
              <span class="col-4">生育参保标志:</span>
              <span class="col-2 subText">{{ portraitInfo.hkszdi }}</span>
            </div>
            <div class="row q-my-sm">
              <span class="col-4">医疗参保标志:</span>
              <span class="col-2 subText">{{ portraitInfo.yycbbz }}</span>
              <span class="col-4">人员状态:</span>
              <span class="col-2 subText">{{ portraitInfo.gzztai }}</span>
            </div>
            <div class="row justify-end">
              <q-btn
                :ripple="{ center: true }"
                color="secondary"
                label="参保人选择"
                no-caps
                @click="common.dialog.showDialog = true"
                class="q-mr-md"
              />
              <q-btn
                :ripple="{ center: true }"
                color="purple-7"
                label="更多"
                no-caps
              />
            </div>
          </div>
        </q-card>
      </div>
      <div class="row searchParamDiv">
        <q-card
          class="row q-pa-md q-my-md q-ml-lg text-primary col-6 items-center"
        >
          <q-option-group
            v-model="searchParam.type"
            :options="common.typeOptions"
            color="primary"
            class="text-weight-bold"
            inline
          />
          <span class="q-ml-lg q-mr-md text-weight-bold">日期选择:</span>
          <el-date-picker
            align="center"
            style="width:33%"
            value-format="yyyyMMdd"
            v-model="searchParam.chargingTime"
            type="monthrange"
            unlink-panels
            clearable
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            :picker-options="common.pickerOptions"
          >
          </el-date-picker>
          <q-btn
            :ripple="{ center: true }"
            color="primary q-ml-lg"
            label="确认"
            no-caps
            @click="initialize()"
          />
        </q-card>
      </div>
      <div class="row">
        <q-card class=" q-pa-md row q-mx-lg" id="portraitMonthly"> </q-card>
        <div class="row" style="width: 45.4%;">
          <q-card class=" q-pa-md row" id="proportionOfMedical"> </q-card>
          <q-card class=" q-mt-md q-pa-md row" id="portraitRingChart"> </q-card>
        </div>
      </div>
      <div class="row q-mt-md">
        <q-card
          class="row q-px-md q-mx-lg text-primary col-6 items-center"
          id="portraitNumberOfDepartments"
        >
        </q-card>
        <q-card class="row justify-center q-pt-sm" style="width: 45.4%;">
          <div>
            <q-option-group
              v-model="searchParam.costType"
              :options="common.costTypeOptions"
              color="primary"
              class="text-weight-bold text-primary"
              inline
              @input="changeCostType"
            />
          </div>
          <div id="departmentsCost"></div>
        </q-card>
      </div>
      <div class="row q-mt-md q-px-lg">
        <div class="col-6 row justify-start">
          <q-card class="q-pa-sm" id="drugChart"></q-card>
        </div>
        <div class="col-6 row justify-end">
          <q-card class="q-pa-sm" id="otherDrugChart"></q-card>
        </div>
      </div>
    </page-base-scroll>
    <q-dialog v-model="common.dialog.showDialog"
      ><specificTable
        @selectConfirm="selectConfirm"
        url="/person/getPersonList"
        :searchParam="searchParam"
        :columns="common.dialog.columns"
        title="参保人"
        selection="single"
    /></q-dialog>
  </q-page>
</template>

<script>
import pageBaseScroll from "components/utils/PageScroll";
import {
  pickerOptions,
  shallowCopyObj,
  formatDate,
  Nation,
  jsGetAge,
  getportraitPhoto,
  isObjArr
} from "assets/js/util/common";
import specificTable from "components/utils/specificTable";
import { EleResize } from "assets/js/util/esresize";
import {
  setPortraitMonthlyOption,
  setProportionOfMedicalOption,
  setPortraitRingChartOption,
  setPortraitNumberOfDepartmentsOption,
  setDepartmentRingOption,
  setDrugChartOption
} from "assets/js/charts/portraitOptions";
export default {
  components: { specificTable, pageBaseScroll },
  data() {
    return {
      common: {
        isInitialize: true,
        pickerOptions: pickerOptions,
        selectPortrait: false,
        typeOptions: [
          {
            label: "门诊费用",
            value: "OC"
          },
          {
            label: "住院费用",
            value: "HC"
          },
          {
            label: "全部",
            value: "OCAndHC"
          }
        ],
        costTypeOptions: [
          {
            label: "个人支出",
            value: "individualPay"
          },
          {
            label: "医保支出",
            value: "medicarePay"
          },
          {
            label: "医疗总费用",
            value: "totalCost"
          }
        ],
        departmentsCostTemp: [],
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
        }
      },
      searchParam: {
        personId: "B4009B864068C706A0ED408167E7A03AFCCA8BF95E698A30",
        chargingTime: ["20160701", "20181231"],
        type: "OCAndHC",
        costType: "totalCost"
      },
      portraitInfo: {
        // photo: require("assets/image/portrait/childBoy.png")
      }
    };
  },
  methods: {
    async initialize() {
      let param = {};
      param = shallowCopyObj(this.searchParam, param);
      param.startDate = this.searchParam.chargingTime[0];
      param.endDate = this.searchParam.chargingTime[1];
      let personData = [];
      await this.$http
        .post("/person/getPersonInfo", param)
        .then(res => {
          if (res.status === 200) {
            personData = res.data.data;
          }
        })
        .catch(e => {});
      this.portraitInfo = personData;
      if (this.portraitInfo.xbie00 === 1) this.portraitInfo.sex = "男";
      else this.portraitInfo.sex = "女";
      this.portraitInfo.birthday = formatDate(this.portraitInfo.csrqi0);
      this.portraitInfo.nation = Nation(this.portraitInfo.mzu000);
      this.portraitInfo.age = jsGetAge(this.portraitInfo.birthday);
      this.portraitInfo.photo = require("assets/image/portrait/" +
        getportraitPhoto(this.portraitInfo.age, this.portraitInfo.xbie00));

      let optionData = []; // 参保人每月费用
      await this.$http
        .post("/person/PortraitMonthlyFeeOCAndHC", param)
        .then(res => {
          if (res.status === 200) {
            optionData = res.data.data;
          }
        })
        .catch(e => {});

      let numberOfDepartments = []; // 科室次数柱状图
      await this.$http
        .post("/person/PortraitNumberOfDepartments", param)
        .then(res => {
          if (res.status === 200) {
            numberOfDepartments = res.data.data;
          }
        })
        .catch(e => {});

      let departmentCostData = []; // 科室消费柱状图
      await this.$http
        .post("/person/PortraitByDepartment", param)
        .then(res => {
          if (res.status === 200) {
            departmentCostData = res.data.data;
          }
        })
        .catch(e => {});
      this.departmentsCostTemp = departmentCostData;

      let drugData = []; //  药品费用占比情况数据

      await this.$http
        .post("/person/PortraitByDrug", param)
        .then(res => {
          if (res.status === 200) {
            drugData = res.data.data;
          }
        })
        .catch(e => {});

      this.afterHttp(
        optionData,
        numberOfDepartments,
        departmentCostData,
        drugData
      );
    },
    afterHttp(optionData, numberOfDepartments, departmentCostData, drugData) {
      //  每月费用柱状图
      let histogramOption = setPortraitMonthlyOption(
        optionData[this.searchParam.type]
      );
      this.drawChart(
        histogramOption,
        "portraitMonthly",
        optionData[this.searchParam.type]
      );

      // 医保个人支付占比环状图
      let proportionOfMedicalOption = setProportionOfMedicalOption(
        optionData[this.searchParam.type]
      );
      this.drawChart(
        proportionOfMedicalOption,
        "proportionOfMedical",
        optionData[this.searchParam.type]
      );

      // 门诊住院费用占比图
      let portraitRingChartOption = setPortraitRingChartOption(optionData);
      this.drawChart(portraitRingChartOption, "portraitRingChart", optionData);

      // 科室次数柱状图
      let portraitNumberOfDepartmentsOption = setPortraitNumberOfDepartmentsOption(
        numberOfDepartments[this.searchParam.type]
      );
      this.drawChart(
        portraitNumberOfDepartmentsOption,
        "portraitNumberOfDepartments",
        numberOfDepartments[this.searchParam.type]
      );

      // 科室消费环状图
      let departmentRingOption = setDepartmentRingOption(
        departmentCostData[this.searchParam.type],
        this.searchParam.type,
        this.searchParam.costType
      );
      this.drawChart(
        departmentRingOption,
        "departmentsCost",
        departmentCostData[this.searchParam.type]
      );

      // 药品消费环状图
      let drugOption = setDrugChartOption(drugData.drug, "部分药品费用占比");
      this.drawChart(drugOption, "drugChart");

      // 其他药品消费环状图
      let otherDrugOption = setDrugChartOption(
        drugData.otherDrug,
        "部分其他药品费用占比"
      );
      this.drawChart(otherDrugOption, "otherDrugChart");
    },
    // 画图表
    drawChart(option, id, chartData) {
      let judge = isObjArr(chartData);
      let isEmpty = false;
      if (judge !== "error") {
        if (judge === "Array") {
          if (chartData.length === 0) isEmpty = true;
        }
        if (judge === "Object") {
          let count = 0;
          for (let key in chartData) {
            if (chartData[key].length === 0) {
              count++;
            }
          }
          if (count === 3) isEmpty = true;
        }
      }
      if (isEmpty) {
        // 以下是暂无数据显示样式(样式根据本身需求进行调整)
        let html =
          '<div><span  style="position: absolute;margin-left:46%;top:45%;color:#868686; font-size: 20px;">暂无数据</span></div>';
        document.getElementById(id).innerHTML = html;
        document.getElementById(id).removeAttribute("_echarts_instance_");
      } else {
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById(id));
        // 指定图表的配置项和数据
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option, true);
        let that = this;
        if (this.common.isInitialize) {
          let resizeDiv = document.getElementById(id);
          let histogram = this.$echarts.init(
            document.getElementById("portraitMonthly")
          );
          let proportionOfMedical = this.$echarts.init(
            document.getElementById("proportionOfMedical")
          );
          let portraitRingChart = this.$echarts.init(
            document.getElementById("portraitRingChart")
          );
          let portraitNumberOfDepartmentsChart = this.$echarts.init(
            document.getElementById("portraitNumberOfDepartments")
          );

          let departmentsCostChart = this.$echarts.init(
            document.getElementById("departmentsCost")
          );

          let drugChart = this.$echarts.init(
            document.getElementById("drugChart")
          );

          let otherDrugChart = this.$echarts.init(
            document.getElementById("otherDrugChart")
          );

          let histogramDiv = document.getElementById("portraitMonthly");
          let linstener = function() {
            histogram.resize();
            proportionOfMedical.resize();
            portraitRingChart.resize();
            portraitNumberOfDepartmentsChart.resize();
            departmentsCostChart.resize();
            drugChart.resize();
            otherDrugChart.resize();
          };
          EleResize.on(resizeDiv, linstener);
          this.common.isInitialize = false;
        }
      }
    },
    changeCostType(value, evt) {
      let departmentRingOption = setDepartmentRingOption(
        this.departmentsCostTemp[this.searchParam.type],
        this.searchParam.type,
        value
      );
      this.drawChart(departmentRingOption, "departmentsCost");
    },
    selectConfirm(data) {
      this.common.dialog.showDialog = false;
      this.searchParam.personId = data[0].column;
      this.initialize();
    }
  },
  mounted() {
    this.initialize();
  }
};
</script>

<style lang="scss" scoped>
.Portrait {
  .hideText {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .firstCard {
    color: #333160;
    font-size: 16px;
    font-weight: 500;
    .subText {
      color: #838098;
      font-size: 16px;
    }
  }
  .secondCard {
    color: #ffffff;
    font-size: 16px;
    font-weight: 600;
    background: -webkit-linear-gradient(
      to right,
      rgba(107, 112, 221, 0.8),
      rgba(107, 112, 221, 1)
    ); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(
      to right,
      rgba(107, 112, 221, 0.8),
      rgba(107, 112, 221, 1)
    ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    .subText {
      color: #e2e3ee;
      font-size: 16px;
    }
  }
  .thirdCard {
    color: #ffffff;
    font-size: 16px;
    font-weight: 600;
    background: -webkit-linear-gradient(
      to right,
      rgba(240, 166, 164, 0.8),
      rgba(240, 156, 153, 1)
    ); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(
      to right,
      rgba(240, 166, 164, 0.8),
      rgba(240, 156, 153, 1)
    ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    .subText {
      color: #e2e3ee;
      font-size: 16px;
    }
  }
  .searchParamDiv {
    .el-range-editor.is-active,
    .el-range-editor.is-active:hover {
      border: 1px solid $primary;
    }
    .el-input__inner {
      border: 1px solid rgba(0, 0, 0, 0.24);
    }
  }
  #portraitMonthly {
    height: 656px;
    width: 50%;
  }
  #proportionOfMedical {
    height: 364px;
    width: 100%;
    margin-top: -88px;
  }
  #portraitRingChart {
    height: 364px;
    width: 100%;
  }
  #portraitNumberOfDepartments {
    height: 548px;
  }
  #departmentsCost {
    height: 500px;
    width: 100%;
  }
  #drugChart {
    height: 540px;
    width: 98%;
  }
  #otherDrugChart {
    height: 540px;
    width: 98%;
  }
}
</style>
