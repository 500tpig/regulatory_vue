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

    <q-tab-panels v-model="common.tab" animated style="background: #FAFAFA;">
      <!-- 时间轴Tab页面 -->
      <q-tab-panel class="timeLineTab" name="timeLineTab">
        <page-base-scroll content_class="q-mt-md q-pb-xl">
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
                  <q-chip color="teal-5" text-color="white" icon="icon-menzhen">
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
                    icon="icon-yiyuan"
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
          <div class="row q-pl-xl q-my-lg">
            <div class="col-7">
              <div class="timeLine-select q-py-md q-px-lg" style="width:90%;">
                <div class="row items-center">
                  <span class="q-mr-md text-weight-medium">日期选择:</span>
                  <el-date-picker
                    align="center"
                    style="width:30%;"
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
                  <div class="row items-center justify-between">
                    <div class="row items-center">
                      <span class="q-ml-lg q-mr-sm text-weight-medium"
                        >类型:</span
                      >
                      <q-option-group
                        v-model="searchParam.type"
                        :options="common.typeOptions"
                        color="primary"
                        style="font-size:14px;"
                        inline
                        class="text-weight-medium subText"
                      />
                    </div>
                  </div>
                </div>
                <div class="row q-mt-sm items-center justify-between">
                  <div>
                    <span class="text-weight-medium">参保人选择:</span>
                    <q-chip
                      outline
                      color="light-blue"
                      icon="icon-user"
                      :label="searchParam.personId"
                      class="q-pa-md q-ml-md"
                      clickable
                      @click="common.dialog.showDialog = true"
                    />
                  </div>
                </div>
                <div class="row justify-end">
                  <q-btn
                    :ripple="{ center: true }"
                    color="primary"
                    label="确认"
                    no-caps
                    class="q-mr-md"
                    @click="initialize()"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="row q-pl-xl timeLineTab-pagination q-mt-md">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="common.timeLine.pageNum"
              :page-sizes="[10, 15, 20, 30, 50]"
              :page-size="common.timeLine.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="common.timeLine.total"
            >
            </el-pagination>
          </div>
          <!-- 时间轴 -->
          <div class="timeLineTab-timeLine">
            <div v-if="common.timeLine.timeLineData.length == 0">
              <div class="row justify-center">
                <div class="h3">暂无数据</div>
              </div>
            </div>
            <q-timeline
              layout="comfortable"
              v-if="common.timeLine.timeLineData.length > 0"
            >
              <q-timeline-entry heading :body="common.timeLine.title" />
              <q-timeline-entry
                v-for="(item, index) in common.timeLine.timeLineData"
                :key="index"
                :color="item.color"
                :subtitle="item.month"
                :icon="item.icon"
              >
                <q-card class="q-pa-md" style="width:85%;">
                  <div class="row q-pl-md q-mt-sm">
                    <span class="col-1">类型:</span>
                    <span class="subText col-2">{{ item.title }}</span>
                    <span class="col-1">科室:</span>
                    <span class="subText col-2">{{ item.department }}</span>
                    <span class="col-2">疾病编号:</span>
                    <span class="subText  col-1">{{ item.disease }}</span>
                  </div>
                  <div class="row q-pl-md q-mt-sm">
                    <span class="col-2">医生编号:</span>
                    <span class="subText  col-1">{{ item.doctorId }}</span>
                    <span class="col-2">单据流水号:</span>
                    <span class="subText">{{ item.djlsh }}</span>
                  </div>
                  <div class="q-my-sm">
                    <q-chip
                      color="green-7"
                      text-color="white"
                      icon="icon-menzhenyaofei"
                    >
                      药品明细
                    </q-chip>
                  </div>
                  <div class="row items-center q-pl-md">
                    <div v-if="item.drugResult.length == 0">无</div>
                    <div
                      class="col-5"
                      v-for="(drugItem, drugIndex) in item.drugResult"
                      :key="drugIndex"
                    >
                      <div v-for="(drugCost, drug) in drugItem" :key="drug">
                        <div class="row items-center">
                          <div class="col-5 hideText">
                            <span
                              >{{ drug }}
                              <q-tooltip
                                content-class="bg-white text-black shadow-4 text-weight-medium"
                                content-style="font-size: 13px"
                                :offset="[10, 10]"
                              >
                                {{ drug }}
                              </q-tooltip>
                            </span>
                          </div>
                          <span class="subText offset-1 col-4"
                            >{{ drugCost }} 元</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="q-my-sm">
                    <q-chip
                      color="grey-8"
                      text-color="white"
                      icon="icon-jiancha"
                    >
                      其他明细
                    </q-chip>
                  </div>
                  <div class="row items-center q-pl-md">
                    <div v-if="item.otherResult.length == 0">无</div>
                    <div
                      class="col-5"
                      v-for="(drugItem, drugIndex) in item.otherResult"
                      :key="drugIndex"
                    >
                      <div v-for="(drugCost, drug) in drugItem" :key="drug">
                        <div class="row items-center">
                          <div class="col-5 hideText">
                            <span
                              >{{ drug }}
                              <q-tooltip
                                content-class="bg-white text-black shadow-4 text-weight-medium"
                                content-style="font-size: 13px"
                                :offset="[10, 10]"
                              >
                                {{ drug }}
                              </q-tooltip>
                            </span>
                          </div>
                          <span class="subText offset-1 col-4"
                            >{{ drugCost }} 元</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="q-my-sm">
                    <q-chip
                      color="blue-6"
                      text-color="white"
                      icon="icon-feiyong"
                    >
                      费用明细:
                    </q-chip>
                  </div>
                  <div class="row q-pl-md ">
                    <div class="col-4">
                      <span>
                        药品总和:
                      </span>
                      <span class="subText  q-ml-md"
                        >{{ item.drugSum }} 元</span
                      >
                    </div>
                    <div class="col-4">
                      <span>
                        其他总和:
                      </span>
                      <span class="subText q-ml-md"
                        >{{ item.otherSum }} 元</span
                      >
                    </div>
                    <div class="col-4">
                      <span>
                        医保支付占比:
                      </span>
                      <span class="subText q-ml-md"
                        >{{
                          common.calculate.Div(
                            item.medicarePay * 100,
                            item.totalCost,
                            2
                          )
                        }}
                        %</span
                      >
                    </div>
                  </div>
                  <div class="row q-pl-md ">
                    <div class="col-4">
                      <span>
                        个人支付:
                      </span>
                      <span class="subText  q-ml-md"
                        >{{ item.individualPay }} 元</span
                      >
                    </div>
                    <div class="col-4">
                      <span>
                        医保支付:
                      </span>
                      <span class="subText q-ml-md"
                        >{{ item.medicarePay }} 元</span
                      >
                    </div>
                    <div class="col-4">
                      <span>
                        医疗费用:
                      </span>
                      <span class="subText q-ml-md "
                        >{{ item.totalCost }} 元</span
                      >
                    </div>
                  </div>
                </q-card>
              </q-timeline-entry>
            </q-timeline>
          </div>
        </page-base-scroll>
      </q-tab-panel>
      <!-- 日历图Tab页面 -->
      <q-tab-panel name="calendarTab">
        <page-base-scroll content_class="q-mt-md q-pl-xl">
          <calendarTab
            style="margin-bottom:100px;"
            :common="common"
            :searchParam="searchParam"
            :portraitInfo="portraitInfo"
          ></calendarTab>
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
import calendarTab from "pages/TimeLine/calendarTab";
import {
  pickerOptions,
  shallowCopyObj,
  formatDate,
  formatDateTime,
  Nation,
  jsGetAge,
  calculate,
  getportraitPhoto
} from "assets/js/util/common";
import specificTable from "components/utils/specificTable";
import { EleResize } from "assets/js/util/esresize";
export default {
  components: { pageBaseScroll, specificTable, calendarTab },
  data() {
    return {
      common: {
        calculate: calculate,
        tab: "timeLineTab",
        timeLine: {
          title: "",
          timeLineData: [],
          pageSize: 10,
          pageNum: 1,
          total: 0
        },
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
        },
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
        expanded: [false]
      },
      searchParam: {
        personId: "B4009B864068C706A0ED408167E7A03AFCCA8BF95E698A30",
        chargingTime: ["20160701", "20181231"],
        type: "OCAndHC"
      },
      portraitInfo: {},
      portraitFee: {
        OC: [
          {
            totalCost: 0,
            individualPay: 0,
            medicarePay: 0
          }
        ],
        HC: [{ totalCost: 0, individualPay: 0, medicarePay: 0 }]
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
      this.getTimeLineData(param);
    },
    // 总费用
    async getPortraitFee(param) {
      let portraitFee = {};
      await this.$http
        .post("/person/PortraitFee", param)
        .then(res => {
          if (res.status === 200) {
            portraitFee = res.data.data;
          }
        })
        .catch(e => {});
      for (let key in portraitFee) {
        let item = portraitFee[key];
        if (item[0] == null) {
          item[0] = {
            totalCost: 0,
            individualPay: 0,
            medicarePay: 0
          };
        }
      }
      this.portraitFee = portraitFee;
    },
    // 时间轴数据
    async getTimeLineData(param) {
      let timeLineData = [];
      param.produceCost = "day";
      param.pageSize = this.common.timeLine.pageSize;
      param.pageNum = this.common.timeLine.pageNum;
      let total = 0;
      await this.$http
        .post("/person/timeLineData", param)
        .then(res => {
          if (res.status === 200) {
            timeLineData = res.data.data.data;
            total = res.data.data.total;
          }
        })
        .catch(e => {});
      this.common.timeLine.timeLineData = timeLineData;
      this.common.timeLine.total = total;
      console.log(timeLineData);
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
      this.common.timeLine.title = this.portraitInfo.xming0 + "就医轨迹";
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
    },
    handleSizeChange(val) {
      let param = {};
      param = shallowCopyObj(this.searchParam, param);
      param.startDate = this.searchParam.chargingTime[0];
      param.endDate = this.searchParam.chargingTime[1];
      this.common.timeLine.pageSize = val;
      this.getTimeLineData(param);
    },
    handleCurrentChange(val) {
      let param = {};
      param = shallowCopyObj(this.searchParam, param);
      param.startDate = this.searchParam.chargingTime[0];
      param.endDate = this.searchParam.chargingTime[1];
      this.getTimeLineData(param);
    }
  },
  mounted() {
    this.initialize();
  }
};
</script>

<style lang="scss" scoped>
.timeLine {
  color: #333160;
  font-size: 16px;
  .hideText {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .q-tab-panel {
    padding: 0;
  }
  .subText {
    color: #838098;
    font-size: 16px;
    font-weight: 500;
  }
  .hideText {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .timeLineTab {
    .timeLine-info {
      color: #333160;
      font-size: 16px;
      font-weight: 500;
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
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
      border-radius: 0.5rem;
      background: #fff;
    }
    .timeLineTab-timeLine {
      color: #333160;
      .q-card {
        border-radius: 0.5rem;
      }
    }
  }
}
</style>
