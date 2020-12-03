<template>
  <q-page class="timeLine">
    <q-tabs
      v-model="common.tab"
      align="left"
      inline-label
      class="bg-grey-1 text-weight-bold"
    >
      <q-tab
        name="timeLineTab"
        icon="icon-shijianzhou"
        label="时间轴"
        class="text-orange"
        style="width:140px;"
      />
      <q-tab
        class="text-cyan"
        name="calendarTab"
        icon="icon-rilitubiao"
        label="日历图"
        style="width:140px;"
      />
      <q-tab
        name="comparisonTab"
        icon="icon-duibifenxibiaoanalysis"
        label="就医对比"
        class="text-red"
        style="width:140px;"
      />
    </q-tabs>

    <q-tab-panels v-model="common.tab" animated>
      <!-- 时间轴Tab页面 -->
      <q-tab-panel name="timeLineTab">
        <page-base-scroll content_class="q-mt-md">
          <div class="row q-pl-xl">
            <!-- 参保人基本信息 -->
            <q-card class="col-5 row q-pa-md q-mr-lg">
              <q-avatar size="100px" class="q-mr-lg self-center">
                <img style="border-radius:50%" :src="portraitInfo.photo" />
              </q-avatar>
              <div class="timeLine-info col q-ml-md">
                <div class="row timeLine-info-row" style="margin-top:10px;">
                  <span class="col-3">公民身份号码:</span>
                  <span class="subText"
                    >1111111111111111234{{ portraitInfo.sfzhao }}</span
                  >
                </div>
                <div class="row timeLine-info-row">
                  <span class="col-3">社会保障号:</span>
                  <span class="subText"
                    >1234567891011{{ portraitInfo.id0000 }}</span
                  >
                </div>
                <div class="row timeLine-info-row">
                  <span class="col-3">姓名:</span>
                  <span class="subText col-2">{{ portraitInfo.xming0 }}</span>
                  <span class="col-2 q-ml-md">性别:</span>
                  <span class="subText q-ml-md">{{ portraitInfo.sex }}</span>
                </div>
                <div class="row timeLine-info-row" style="margin-bottom:10px;">
                  <span class="col-3">年龄:</span>
                  <span class="subText col-2">{{ portraitInfo.age }}</span>
                  <span class="col-2 q-ml-md">生存状态:</span>
                  <span class="subText q-ml-md">{{ portraitInfo.gzztai }}</span>
                </div>
              </div>
            </q-card>
            <!-- 参保人费用信息 -->
            <q-card class="col-6 row q-pa-md">
              <div class="timeLine-costInfo col">
                <!-- 门诊费用 -->
                <div class="row">
                  <q-chip
                    color="teal-5"
                    text-color="white"
                    icon-right="icon-menzhen"
                  >
                    门诊费用
                  </q-chip>
                </div>
                <div class="row timeLine-costInfo-OC q-pl-md q-my-sm">
                  <span>
                    个人支付:
                  </span>
                  <span class="subText col-2"
                    >{{ portraitFee.OC[0].individualPay }} 元</span
                  >
                  <span>
                    医保支付:
                  </span>
                  <span class="subText col-2"
                    >{{ portraitFee.OC[0].medicarePay }} 元</span
                  >
                  <span>
                    医疗费用:
                  </span>
                  <span class="subText col-3"
                    >{{ portraitFee.OC[0].totalCost }} 元</span
                  >
                </div>
                <!-- 住院费用 -->
                <div class="row">
                  <q-chip
                    color="deep-orange"
                    text-color="white"
                    icon-right="icon-yiyuan"
                  >
                    住院费用
                  </q-chip>
                </div>
                <div class="row timeLine-costInfo-HC q-pl-md q-mt-sm">
                  <span>
                    个人支付:
                  </span>
                  <span class="subText col-2"
                    >{{ portraitFee.HC[0].individualPay }} 元</span
                  >
                  <span>
                    医保支付:
                  </span>
                  <span class="subText col-2"
                    >{{ portraitFee.HC[0].medicarePay }} 元</span
                  >
                  <span>
                    医疗费用:
                  </span>
                  <span class="subText col-3"
                    >{{ portraitFee.HC[0].totalCost }} 元</span
                  >
                </div>
              </div>
            </q-card>
          </div>
          <!-- 筛选 -->
          <div class="row timeLine-select q-pl-xl row items-center q-mt-md">
            <span class="q-mr-md text-weight-bold">参保人ID:</span>
            <q-chip
              outline
              color="light-blue"
              icon="icon-user"
              :label="searchParam.personId"
              class="q-pa-md q-mr-md"
              clickable
              @click="common.dialog.showDialog = true"
            />
            <div>
              <span class="q-mr-md text-weight-bold">日期选择:</span>
              <el-date-picker
                align="center"
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
            </div>
            <q-btn
              :ripple="{ center: true }"
              color="primary"
              label="确认"
              no-caps
              @click="initialize"
              class="q-ml-md"
            />
          </div>
        </page-base-scroll>
      </q-tab-panel>
      <!-- 日历图Tab页面 -->
      <q-tab-panel name="calendarTab">
        <page-base-scroll content_class="q-mt-md">
          <div class="text-h6">Alarms</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </page-base-scroll>
      </q-tab-panel>
      <!-- 就医对比Tab页面 -->
      <q-tab-panel name="comparisonTab">
        <page-base-scroll content_class="q-mt-md">
          <div class="text-h6">Movies</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </page-base-scroll>
      </q-tab-panel>
    </q-tab-panels>
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
  getportraitPhoto
} from "assets/js/util/common";
import specificTable from "components/utils/specificTable";
import { EleResize } from "assets/js/util/esresize";
export default {
  components: { pageBaseScroll, specificTable },
  data() {
    return {
      common: {
        tab: "timeLineTab",
        splitterModel: 10,
        isInitialize: true,
        pickerOptions: pickerOptions,
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
        chargingTime: ["20160701", "20161231"]
      },
      portraitInfo: {},
      portraitFee: {
        OC: [{}],
        HC: [{}]
      }
    };
  },
  methods: {
    initialize() {
      let param = {};
      param = shallowCopyObj(this.searchParam, param);
      param.startDate = this.searchParam.chargingTime[0];
      param.endDate = this.searchParam.chargingTime[1];
      this.getPersonInfo(param);
      this.getPortraitFee(param);
    },
    async getPortraitFee(param) {
      let portraitFee = [];
      await this.$http
        .post("/person/PortraitFee", param)
        .then(res => {
          if (res.status === 200) {
            portraitFee = res.data.data;
          }
        })
        .catch(e => {});
      this.portraitFee = portraitFee;
    },
    async getPersonInfo(param) {
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
    },
    selectConfirm(data) {
      this.common.dialog.showDialog = false;
      this.searchParam.personId = data[0].column;
    }
  },
  mounted() {
    this.initialize();
  }
};
</script>

<style lang="scss" scoped>
.timeLine {
  .q-card {
    box-shadow: $card-box-shadow-around;
  }
  .q-tab-panel {
    padding: 0;
  }
  .hideText {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .timeLine-info {
    color: #333160;
    font-size: 16px;
    font-weight: 500;
    .subText {
      color: #838098;
      font-size: 16px;
    }
    .timeLine-info-row {
      margin: 12px 0 0 0;
    }
  }
  .timeLine-costInfo {
    color: #333160;
    font-size: 16px;
    font-weight: 500;
    .timeLine-costInfo-OC {
      .subText {
        color: #4aa79c;
        font-size: 16px;
        margin-left: 16px;
      }
    }
    .timeLine-costInfo-HC {
      .subText {
        color: #ed6237;
        font-size: 16px;
        margin-left: 16px;
      }
    }
  }
  .timeLine-select {
    color: #333160;
    font-size: 16px;
  }
}
</style>
