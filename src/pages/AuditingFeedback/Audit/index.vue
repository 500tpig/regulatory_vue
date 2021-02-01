<template>
  <q-page class="audit row q-pa-md">
    <div class="col-6">
      <div class="column" style="height:100%;">
        <q-card class="col-auto q-px-md q-pt-md q-pb-sm">
          <div class="q-pb-sm">
            <span class="q-mr-md">开始日期:</span>
            <el-date-picker
              v-model="param.importTime[0]"
              value-format="yyyy-MM-dd HH:mm:ss"
              clearable
              align="center"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
            <span class="q-mx-md">结束日期:</span>
            <el-date-picker
              v-model="param.importTime[1]"
              value-format="yyyy-MM-dd HH:mm:ss"
              clearable
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
            <!-- <span class="q-mr-md">导入时间:</span>
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
            </el-date-picker> -->
          </div>
          <div class="row items-center q-pb-sm">
            <span class="q-mr-md">反馈情况:</span>
            <div class="subText">
              <q-radio v-model="param.type" val="未处理" label="未处理" />
              <q-radio v-model="param.type" val="已处理" label="已处理" />
              <q-radio v-model="param.type" val="all" label="全选" />
            </div>
          </div>
          <div class="row items-center q-pb-sm">
            <span class="q-mr-md">自动审核:</span>
            <div class="subText">
              <q-radio
                v-model="param.isAutomaticAudit"
                val="已完成"
                label="已完成"
              />
              <q-radio
                v-model="param.isAutomaticAudit"
                val="未审核"
                label="未审核"
              />
              <q-radio
                v-model="param.isAutomaticAudit"
                val="全选"
                label="全选"
              />
            </div>
            <div class="col">
              <q-btn
                style="background: #018DA7; color: white;float:right;"
                label="确认"
                @click="initialize"
              />
              <q-btn
                style="background: #26A69A; color: white;float:right;margin-right:16px;"
                label="自动审核"
              />
            </div>
          </div>
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
            :filter-method="searchFilter"
            @selection="getInvoiceAuditingDetail"
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
                  transition-show="scale"
                  transition-hide="scale"
                  content-class="bg-white text-black shadow-4 text-weight-medium"
                >
                  导出完整表格的csv
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
                  transition-show="scale"
                  transition-hide="scale"
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
    <div class="col-6 q-pl-md">
      <div class="audit-right column">
        <q-card class="q-pa-md documentsInfo col-auto">
          <div
            v-if="common.table.selected.length <= 0"
            class="row justify-center"
          >
            <div class="text-h6">暂无数据</div>
          </div>
          <div v-if="common.table.selected.length > 0">
            <div class="row">
              <div class="col-6 hideText">
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
                  color="amber-8"
                  text-color="white"
                  icon="icon-daibandengdaishenhe"
                  v-if="common.table.selected[0].feedbackStatus === '处理中'"
                  :label="common.table.selected[0].feedbackStatus"
                  clickable
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
              <q-btn
                @click="openDialog"
                class="bg-accent"
                round
                icon="icon-bianji"
              />
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
        <div class="auditTableDetails-div col">
          <q-table
            selection="single"
            :selected.sync="common.tableDetails.selected"
            class="auditTableDetails tableClass"
            :data="common.tableDetails.data"
            :columns="common.tableDetails.columns"
            row-key="id"
            flat
            bordered
            virtual-scroll
            :filter="common.tableDetails.filter"
            :rows-per-page-options="[10, 20, 30, 50, 100]"
            :filter-method="searchFilter"
          >
            <template v-slot:top="props">
              <q-btn
                color="accent"
                icon-right="archive"
                no-caps
                @click="exportDetailTables"
                class="q-mr-sm"
              >
                <q-tooltip
                  transition-show="scale"
                  transition-hide="scale"
                  content-class="bg-white text-black shadow-4 text-weight-medium"
                >
                  导出完整表格的csv
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
                  transition-show="scale"
                  transition-hide="scale"
                  content-class="bg-white text-black shadow-4 text-weight-medium"
                >
                  全屏
                </q-tooltip>
              </q-btn>
              <q-space />
              <q-input
                dense
                debounce="300"
                v-model="common.tableDetails.filter"
                placeholder="Search"
                :input-style="{ padding: '8px' }"
                bg-color="white"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>
            <template v-slot:body-selection="scope">
              <q-toggle v-model="scope.selected" />
            </template>
          </q-table>
        </div>
      </div>
    </div>
    <q-dialog
      v-model="common.isShowDialog"
      transition-show="scale"
      transition-hide="scale"
      ><dialogInfo
        :row="common.dialogData"
        @initialize="initialize"
      ></dialogInfo>
    </q-dialog>
  </q-page>
</template>

<script>
import { exportTable, deepClone } from "assets/js/util/common";
import dialogInfo from "./dialog";
export default {
  components: { dialogInfo },
  data() {
    return {
      param: {
        importTime: ["2020-11-02 11:27:42", "2021-01-31 11:27:42"],
        type: "未处理",
        selectAllType: false,
        isAutomaticAudit: "全选"
      },
      common: {
        dialogData: {},
        isShowDialog: false,
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
        },
        tableDetails: {
          filter: "",
          data: [],
          columns: [
            {
              name: "id",
              label: "id",
              align: "center",
              sortable: true,
              field: "id"
            },
            {
              name: "documentId",
              label: "单据编号",
              align: "center",
              sortable: true,
              field: "documentId"
            },
            {
              name: "itemNumber",
              label: "项目编号",
              align: "center",
              sortable: true,
              field: "itemNumber"
            },
            {
              name: "hospitalProjectName",
              label: "医院项目名称",
              align: "center",
              sortable: true,
              field: "hospitalProjectName"
            },
            {
              name: "abnormalAmount",
              label: "异常金额",
              align: "center",
              sortable: true,
              field: "abnormalAmount"
            },
            {
              name: "unitPrice",
              label: "单价",
              align: "center",
              sortable: true,
              field: "unitPrice"
            },
            {
              name: "quantity",
              label: "数量",
              align: "center",
              sortable: true,
              field: "quantity"
            },
            {
              name: "medicalAmount",
              label: "医疗金额",
              align: "center",
              sortable: true,
              field: "medicalAmount"
            },
            {
              name: "medicareAmount",
              label: "医保金额",
              align: "center",
              sortable: true,
              field: "medicareAmount"
            },
            {
              name: "dosageForm",
              label: "剂型",
              align: "center",
              sortable: true,
              field: "dosageForm"
            },
            {
              name: "specification",
              label: "规格",
              align: "center",
              sortable: true,
              field: "specification"
            },
            {
              name: "invoiceItem",
              label: "发票项目",
              align: "center",
              sortable: true,
              field: "invoiceItem"
            },
            {
              name: "accountingDate",
              label: "记账日期",
              align: "center",
              sortable: true,
              field: "accountingDate"
            },
            {
              name: "medicalProjectName",
              label: "医保项目名称",
              align: "center",
              sortable: true,
              field: "medicalProjectName"
            },
            {
              name: "unit",
              label: "单位",
              align: "center",
              sortable: true,
              field: "unit"
            },
            {
              name: "totalMedicineTaken",
              label: "取药总量",
              align: "center",
              sortable: true,
              field: "totalMedicineTaken"
            },
            {
              name: "totalUnit",
              label: "总量单位",
              align: "center",
              sortable: true,
              field: "totalUnit"
            },
            {
              name: "singleDose",
              label: "单次用量",
              align: "center",
              sortable: true,
              field: "singleDose"
            },
            {
              name: "singleDosageUnit",
              label: "单次用量单位",
              align: "center",
              sortable: true,
              field: "singleDosageUnit"
            },
            {
              name: "frequencyOfTaking",
              label: "服用频次",
              align: "center",
              sortable: true,
              field: "frequencyOfTaking"
            },
            {
              name: "medicationDays",
              label: "用药天数",
              align: "center",
              sortable: true,
              field: "medicationDays"
            },
            {
              name: "routeOfAdministration",
              label: "给药途径",
              align: "center",
              sortable: true,
              field: "routeOfAdministration"
            },
            {
              name: "importTime",
              label: "导入日期",
              align: "center",
              sortable: true,
              field: "importTime"
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
            for (let index = 0; index < resultData.length; index++) {
              let element = resultData[index];
              element.remainingNumberOfDays = this.getDaysBetween(
                element.feedbackEndDate
              );
            }
          }
        })
        .catch(e => {});
      if (resultData.length > 0) {
        this.common.table.data = resultData;
        this.common.table.selected = [];
        this.common.table.selected.push(resultData[0]);
        this.getInvoiceAuditingDetail(resultData[0].documentId, true);
      } else {
        this.common.table.data = [];
        this.common.tableDetails.data = [];
        this.common.table.selected = [];
      }
    },
    /**
     * 计算两个日期之间的天数
     * @param dateString1  开始日期 yyyy-MM-dd
     * @param dateString2  结束日期 yyyy-MM-dd
     * @returns {number} 如果日期相同 返回一天 开始日期大于结束日期，返回0
     */
    getDaysBetween(dateString2) {
      // var startDate = Date.parse(dateString1);
      let startDate = new Date();
      let endDate = Date.parse(dateString2);
      if (startDate > endDate) {
        return 0;
      }
      if (startDate == endDate) {
        return 1;
      }
      let days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000);
      return days;
    },
    openDialog() {
      this.common.dialogData = deepClone(this.common.table.selected[0]);
      this.common.isShowDialog = true;
    },
    exportTables() {
      exportTable(
        this.common.table.columns,
        this.common.table.data,
        "审核单据"
      );
    },
    exportDetailTables() {
      exportTable(
        this.common.tableDetails.columns,
        this.common.tableDetails.data,
        "审核单据明细"
      );
    },
    async getInvoiceAuditingDetail(details, initialize) {
      let resultData = [];
      let param = {};
      if (initialize === true) {
        param.documentId = details;
      } else {
        param.documentId = details.keys[0];
      }
      await this.$http
        .post("/auditingFeedback/getByDocumentId", param)
        .then(res => {
          if (res.status === 200) {
            resultData = res.data.data;
          }
        })
        .catch(e => {});
      this.common.tableDetails.data = resultData;
    },
    searchFilter(rows, terms, cols, getCellValue) {
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
  .audit-right {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    position: relative;
    .documentsInfo {
      width: 100%;
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
    .auditTableDetails-div {
      position: relative;
      width: 100%;
      .auditTableDetails {
        width: 100%;
        position: absolute;
        top: 16px;
        bottom: 0px;
        left: 0px;
      }
    }
  }
}
</style>
<style lang="sass">
.tableClass
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
.auditTable-div
  position: relative
  width: 100%
  .auditTable
    width: 100%
    position: absolute
    top: 16px
    bottom: 0px
    left: 0px
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
