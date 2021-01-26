<template>
  <q-page class="audit row q-pa-md">
    <div class="col-6">
      <div class="column" style="height:100%;">
        <q-card class="col-auto q-px-md q-pt-md q-pb-sm">
          <div class="q-pb-sm">
            <span class="q-mr-md">导入时间:</span>
            <el-date-picker
              class="subText"
              v-model="param.importTime"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="common.pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="center"
            >
            </el-date-picker>
          </div>
          <div class="row items-center q-pb-sm">
            <span class="q-mr-md">反馈情况:</span>
            <div class="subText">
              <q-radio v-model="param.type" val="未处理" label="未处理" />
              <q-radio v-model="param.type" val="已处理" label="已处理" />
              <q-radio v-model="param.type" val="all" label="全选" />
            </div>
            <div class="col">
              <q-btn
                style="background: #018DA7; color: white;float:right;"
                label="确认"
                @click="initialize"
              />
            </div>
          </div>
          <!-- <div class="row items-center q-pb-sm">
            <span class="">筛选:</span>
            <q-toggle
              color="pink"
              v-model="param.selectAllType"
              left-label
              @input="toggleFun"
            />
          </div> -->
        </q-card>
        <div class="col auditTable-div">
          <q-table
            class="auditTable"
            :data="common.table.data"
            :columns="common.table.columns"
            row-key="documentId"
            flat
            bordered
            virtual-scroll
            :visible-columns="common.table.visibleColumns"
            :filter="common.table.filter"
            :rows-per-page-options="[10, 20, 30, 50, 100]"
            selection="single"
            :selected.sync="common.table.selected"
            :filter-method="test"
          >
            <template v-slot:top="props">
              <q-btn
                color="accent"
                icon-right="archive"
                no-caps
                @click="exportTables"
                class="q-mr-sm"
              >
                <q-tooltip
                  transition-show="rotate"
                  transition-hide="rotate"
                  content-class="bg-white text-black shadow-4 text-weight-medium"
                >
                  导出csv
                </q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                dense
                color="primary"
                :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                @click="props.toggleFullscreen"
                class="q-ml-md"
              >
                <q-tooltip
                  transition-show="rotate"
                  transition-hide="rotate"
                  content-class="bg-white text-black shadow-4 text-weight-medium"
                >
                  全屏
                </q-tooltip>
              </q-btn>
              <q-space />
              <q-input
                dense
                debounce="300"
                v-model="common.table.filter"
                placeholder="Search"
                :input-style="{ padding: '8px' }"
                bg-color="white"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>
          </q-table>
        </div>
      </div>
    </div>
    <div class="col-6 row q-pl-md">
      <div style="height:100%;width:100%;">
        <q-card class=" q-pa-md documentsInfo">
          <div v-if="common.table.selected.length > 0">
            <div class="row">
              <div class="col-5 hideText">
                <span class="instructions">单据主键: </span>
                <span
                  >{{ common.table.selected[0].id }}
                  <q-tooltip
                    transition-show="scale"
                    transition-hide="scale"
                    content-class="bg-white text-black shadow-4 text-weight-medium"
                    :delay="1000"
                  >
                    {{ common.table.selected[0].id }}
                  </q-tooltip></span
                >
              </div>
              <div class="col-2">
                <span class="instructions">单据状态: </span>
                <span>{{ common.table.selected[0].documentStatus }}</span>
              </div>
              <div class="col-3">
                <span class="instructions">申诉次数: </span>
                <span>{{ common.table.selected[0].complaintsNum }}</span>
              </div>
            </div>
            <div class="row items-center">
              <div class="col-sm-4 col-md-5 col-lg-3">
                <span class="instructions">反馈状态:</span>
                <q-chip
                  square
                  color="red-6"
                  text-color="white"
                  icon="warning"
                  v-if="common.table.selected[0].feedbackStatus === '未处理'"
                  :label="common.table.selected[0].feedbackStatus"
                />
                <q-chip
                  square
                  color="positive"
                  text-color="white"
                  icon="check"
                  v-if="common.table.selected[0].feedbackStatus === '已处理'"
                  :label="common.table.selected[0].feedbackStatus"
                />
              </div>
              <div class="col-sm-4 col-md-4 col-lg-3 q-mx-sm">
                <span class="instructions">单据编号:</span>
                <span
                  >{{ common.table.selected[0].documentId }}
                  <q-tooltip
                    transition-show="scale"
                    transition-hide="scale"
                    content-class="bg-white text-black shadow-4 text-weight-medium"
                    :delay="1000"
                  >
                    {{ common.table.selected[0].documentId }}
                  </q-tooltip></span
                >
              </div>
              <div class="col-sm-4 col-md-4 col-lg-4">
                <span class="instructions">剔除金额:</span>
                <q-chip
                  square
                  color="red-6"
                  text-color="white"
                  icon="icon-feiyong"
                  v-if="common.table.selected[0].excludingAmount"
                  :label="common.table.selected[0].excludingAmount"
                />
              </div>
            </div>
            <div class="row q-mb-sm">
              <div class="col-sm-4 col-md-4 col-lg-3">
                <span class="instructions">医疗机构:</span>
                <span>{{ common.table.selected[0].medicalInstitution }}</span>
              </div>
              <div class="col-sm-4 col-md-4 col-lg-3">
                <span class="instructions q-mx-sm">科室:</span>
                <span>{{ common.table.selected[0].department }}</span>
              </div>
              <div class="col-sm-4 col-md-4 col-lg-4 hideText">
                <span class="instructions">医生工号:</span>
                <span
                  >{{ common.table.selected[0].doctorJobId }}
                  <q-tooltip
                    transition-show="scale"
                    transition-hide="scale"
                    content-class="bg-white text-black shadow-4 text-weight-medium"
                    :delay="1000"
                  >
                    {{ common.table.selected[0].doctorJobId }}
                  </q-tooltip></span
                >
              </div>
            </div>
            <div class="row">
              <div class="col-sm-4 col-md-4 col-lg-3 hideText">
                <span class="instructions">医生证件号:</span>
                <span
                  >{{ common.table.selected[0].doctorId }}
                  <q-tooltip
                    transition-show="scale"
                    transition-hide="scale"
                    content-class="bg-white text-black shadow-4 text-weight-medium"
                    :delay="1000"
                  >
                    {{ common.table.selected[0].doctorId }}
                  </q-tooltip>
                </span>
              </div>
              <div class="col-sm-4 col-md-4 col-lg-3">
                <span class="instructions q-mx-sm">就诊类型:</span>
                <span>{{ common.table.selected[0].typeOfVisit }}</span>
              </div>
              <div class="col-sm-4 col-md-4 col-lg-4 hideText">
                <span class="instructions">个人编号:</span>
                <span
                  >{{ common.table.selected[0].personId }}
                  <q-tooltip
                    transition-show="scale"
                    transition-hide="scale"
                    content-class="bg-white text-black shadow-4 text-weight-medium"
                    :delay="1000"
                  >
                    {{ common.table.selected[0].personId }}
                  </q-tooltip></span
                >
              </div>
            </div>
            <div class="row q-my-sm">
              <div class="col-sm-3 col-md-3 col-lg-2 hideText">
                <span class="instructions">性别:</span>
                <span>{{ common.table.selected[0].sex }} </span>
              </div>
              <div class="col-sm-4 col-md-4 col-lg-2">
                <span class="instructions q-mx-sm">年龄:</span>
                <span>{{ common.table.selected[0].age }}</span>
              </div>
              <div class="col-sm-3 col-md-3 col-lg-2">
                <span class="instructions">险种:</span>
                <span>{{ common.table.selected[0].insurance }}</span>
              </div>
              <div class="col-sm-3 col-md-3 col-lg-4 hideText">
                <span class="instructions">主要诊断:</span>
                <span
                  >{{ common.table.selected[0].mainDiagnosis }}
                  <q-tooltip
                    transition-show="scale"
                    transition-hide="scale"
                    content-class="bg-white text-black shadow-4 text-weight-medium"
                    :delay="1000"
                  >
                    {{ common.table.selected[0].mainDiagnosis }}
                  </q-tooltip>
                </span>
              </div>
            </div>
            <div class="row q-my-sm">
              <div class="col-3 hideText">
                <span class="instructions">单据金额:</span>
                <span>{{ common.table.selected[0].documentAmount }}</span>
              </div>
              <div class="col-3 hideText">
                <span class="instructions">基金支付:</span>
                <span>{{ common.table.selected[0].fundPayment }}</span>
              </div>
              <div class="col-3 hideText">
                <span class="instructions">统筹支付:</span>
                <span>{{ common.table.selected[0].overallPayment }} </span>
              </div>
              <div class="col-3 hideText">
                <span class="instructions">个账支付:</span>
                <span
                  >{{ common.table.selected[0].individualAccountPayment }}
                </span>
              </div>
            </div>
            <div class="documentsInfo-button">
              <q-btn class="bg-accent" round icon="icon-bianji" />
            </div>
            <div class="hideText" style="width:80%;">
              <span>剔除说明: </span>
              {{ common.table.selected[0].eliminateInstructions }}
              <q-tooltip
                transition-show="scale"
                transition-hide="scale"
                content-class="bg-white text-black shadow-4 text-weight-medium"
                :delay="1000"
              >
                {{ common.table.selected[0].eliminateInstructions }}
              </q-tooltip>
            </div>
            <div class="hideText" style="width:80%;">
              <span>反馈说明: </span>
              {{ common.table.selected[0].feedbackDescription }}
              <q-tooltip
                transition-show="scale"
                transition-hide="scale"
                content-class="bg-white text-black shadow-4 text-weight-medium"
                :delay="1000"
              >
                {{ common.table.selected[0].feedbackDescription }}
              </q-tooltip>
            </div>
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import {
  formatDate,
  shallowCopyObj,
  accAdd,
  exportTable
} from "assets/js/util/common";
export default {
  data() {
    return {
      param: {
        importTime: ["2021-01-17 11:11:47", "2021-01-24 11:11:47"],
        type: "未处理",
        selectAllType: false
      },
      common: {
        pickerOptions: {
          shortcuts: [
            {
              text: "最近一周",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近一个月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近三个月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit("pick", [start, end]);
              }
            }
          ]
        },
        table: {
          visibleColumns: [
            "documentId",
            "department",
            "personId",
            "feedbackEndDate",
            "importTime",
            "doctorJobId"
          ],
          filter: "",
          data: [],
          selected: [],
          columns: [
            {
              name: "documentStatus",
              label: "单据状态",
              field: "documentStatus"
            },
            {
              name: "complaintsNum",
              label: "申诉次数",
              field: "complaintsNum"
            },
            {
              name: "feedbackStatus",
              label: "反馈状态",
              field: "feedbackStatus"
            },
            {
              name: "documentId",
              label: "单据编号",
              field: "documentId",
              align: "center",
              sortable: true
            },
            {
              name: "excludingAmount",
              label: "剔除金额",
              field: "excludingAmount"
            },
            {
              name: "medicalInstitution",
              label: "医疗机构",
              field: "medicalInstitution"
            },
            {
              name: "department",
              label: "科室",
              field: "department",
              align: "center",
              sortable: true
            },
            {
              name: "doctorJobId",
              label: "医生工号",
              field: "doctorJobId",
              align: "center",
              sortable: true
            },
            { name: "doctorId", label: "医生证件号", field: "doctorId" },
            { name: "typeOfVisit", label: "就诊类型", field: "typeOfVisit" },
            {
              name: "personId",
              label: "个人编号",
              field: "personId",
              align: "center",
              sortable: true
            },
            {
              name: "feedbackEndDate",
              label: "反馈结束日期",
              field: "feedbackEndDate",
              align: "center",
              sortable: true
            },
            {
              name: "remainingNumberOfDays",
              label: "剩余天数",
              field: "remainingNumberOfDays"
            },
            { name: "sex", label: "性别", field: "sex" },
            { name: "age", label: "年龄", field: "age" },
            { name: "insurance", label: "险种", field: "insurance" },
            {
              name: "mainDiagnosis",
              label: "主要诊断",
              field: "mainDiagnosis"
            },
            {
              name: "outpatientHospitalNumber",
              label: "门诊/住院号",
              field: "outpatientHospitalNumber"
            },
            {
              name: "admissionDate",
              label: "入院日期",
              field: "admissionDate"
            },
            {
              name: "dischargeDate",
              label: "出院日期",
              field: "dischargeDate"
            },
            {
              name: "hospitalizedDay",
              label: "住院天数",
              field: "hospitalizedDay"
            },
            {
              name: "settlementDate",
              label: "结算日期",
              field: "settlementDate"
            },
            {
              name: "documentAmount",
              label: "单据金额",
              field: "documentAmount"
            },
            { name: "fundPayment", label: "基金支付", field: "fundPayment" },
            {
              name: "overallPayment",
              label: "统筹支付",
              field: "overallPayment"
            },
            {
              name: "individualAccountPayment",
              label: "个账支付",
              field: "individualAccountPayment"
            },
            {
              name: "typesOfDiseases",
              label: "病种类型",
              field: "typesOfDiseases"
            },
            { name: "handler", label: "处理人", field: "handler" },
            {
              name: "processingTime",
              label: "处理时间",
              field: "processingTime"
            },
            {
              name: "insuredStatus",
              label: "参保身份",
              field: "insuredStatus"
            },
            {
              name: "eliminateInstructions",
              label: "剔除说明",
              field: "eliminateInstructions"
            },
            {
              name: "appealDescription",
              label: "申诉说明",
              field: "appealDescription"
            },
            {
              name: "smartAuditRules",
              label: "智能审核规则",
              field: "smartAuditRules"
            },
            {
              name: "descriptionSmartAuditRules",
              label: "智能审核规则描述",
              field: "descriptionSmartAuditRules"
            },
            {
              name: "manualAuditRules",
              label: "人工审核规则",
              field: "manualAuditRules"
            },
            {
              name: "treatmentResults",
              label: "处理结果",
              field: "treatmentResults"
            },
            {
              name: "manualReviewRuleDescription",
              label: "人工审核规则描述",
              field: "manualReviewRuleDescription"
            },
            {
              name: "feedbackDescription",
              label: "反馈说明",
              field: "feedbackDescription"
            },
            {
              name: "importTime",
              label: "导入日期",
              field: "importTime",
              align: "center",
              sortable: true
            }
          ]
        }
      }
    };
  },
  methods: {
    async initialize() {
      if (this.param.importTime.length === 0) {
        this.$q.notify({
          icon: "warning",
          color: "warning",
          message: "请设置导入日期！"
        });
        return;
      }
      let resultData = [];
      await this.$http
        .post("/auditingFeedback/getInvoiceAuditing", this.param)
        .then(res => {
          if (res.status === 200) {
            resultData = res.data.data;
          }
        })
        .catch(e => {});
      this.common.table.data = resultData;
      this.common.table.selected.push(resultData[0]);
      console.log(resultData);
    },
    exportTables() {
      exportTable(this.common.table.columns, this.common.table.data);
    },
    test(rows, terms, cols, getCellValue) {
      let result = [];
      for (let index = 0; index < rows.length; index++) {
        const element = rows[index];
        for (const key in element) {
          if (Object.hasOwnProperty.call(element, key)) {
            const temp = element[key];
            if (temp !== null) {
              if (temp.toString().split(terms).length > 1) {
                result.push(element);
                break;
              }
            }
          }
        }
      }
      return result;
    }
  },
  mounted() {
    this.initialize();
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
  .hideText {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .documentsInfo {
    .instructions {
      padding: 0 8px 0 0;
    }
    background: #640064;
    color: #ffffff;
    background-image: -webkit-linear-gradient(
      60deg,
      #00cfe8,
      rgba(0, 207, 232, 0.5)
    );
    background-image: -moz-linear-gradient(
      60deg,
      #00cfe8,
      rgba(0, 207, 232, 0.5)
    );
    background-image: -o-linear-gradient(
      60deg,
      #00cfe8,
      rgba(0, 207, 232, 0.5)
    );
    background-image: linear-gradient(30deg, #00cfe8, rgba(0, 207, 232, 0.5));
    background-repeat: repeat-x;
    position: relative;
    .documentsInfo-button {
      position: absolute;
      top: 6%;
      right: 4%;
    }
  }
}
</style>
<style lang="sass">
.auditTable-div
  position: relative
  width: 100%
  .auditTable
    width: 100%
    position: absolute
    top: 16px
    bottom: 0px
    left: 0px

    // height: 810px !important
    /* height or max-height is important */

    // .q-table__middle

    .q-table__top,
    thead tr:first-child th
      /* bg color is important for th; just specify one */
      background-color: #FFFFFF
      // color: #FFFFFF
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
