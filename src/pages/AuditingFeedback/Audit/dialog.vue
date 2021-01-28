<template>
  <div class="dialogInfo">
    <q-card class="dialogInfo-card">
      <q-card-section class="row justify-center">
        <div class="text-h6">单据编号 {{ row.documentId }} 详情</div>
      </q-card-section>

      <q-card-section class="q-py-none">
        <div class="row">
          <div class="col-6 hideText">
            <span class="instructions">单据主键: </span>
            <span
              >{{ row.id }}
              <q-tooltip
                transition-show="scale"
                transition-hide="scale"
                content-class="bg-white text-black shadow-4 text-weight-medium"
                :delay="1000"
              >
                {{ row.id }}
              </q-tooltip></span
            >
          </div>
          <div class="col-2">
            <span class="instructions">单据状态: </span>
            <span>{{ row.documentStatus }}</span>
          </div>
          <div class="col-3">
            <span class="instructions">申诉次数: </span>
            <span>{{ row.complaintsNum }}</span>
          </div>
        </div>
        <div class="row items-center q-my-md">
          <div class="col-sm-4 col-md-4 col-lg-3 hideText">
            <span class="instructions">单据编号:</span>
            <span
              >{{ row.documentId }}
              <q-tooltip
                transition-show="scale"
                transition-hide="scale"
                content-class="bg-white text-black shadow-4 text-weight-medium"
                :delay="1000"
              >
                {{ row.documentId }}
              </q-tooltip></span
            >
          </div>
          <div class="col-lg-3 hideText">
            <span class="instructions">医疗机构:</span>
            <span>{{ row.medicalInstitution }}***</span>
          </div>
          <div class="col-lg-2 hideText">
            <span class="instructions">科室:</span>
            <span>{{ row.department }}</span>
          </div>
          <div class="col-lg-2 hideText">
            <span class="instructions ">就诊类型:</span>
            <span>{{ row.typeOfVisit }}</span>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-4 col-md-4 col-lg-3 hideText">
            <span class="instructions">医生工号:</span>
            <span
              >{{ row.doctorJobId }}
              <q-tooltip
                transition-show="scale"
                transition-hide="scale"
                content-class="bg-white text-black shadow-4 text-weight-medium"
                :delay="1000"
              >
                {{ row.doctorJobId }}
              </q-tooltip></span
            >
          </div>
          <div class="col-sm-4 col-md-4 col-lg-3 hideText">
            <span class="instructions">医生证件号:</span>
            <span
              >{{ row.doctorId }}
              <q-tooltip
                transition-show="scale"
                transition-hide="scale"
                content-class="bg-white text-black shadow-4 text-weight-medium"
                :delay="1000"
              >
                {{ row.doctorId }}
              </q-tooltip>
            </span>
          </div>
          <div class="col-sm-4 col-md-4 col-lg-3 hideText">
            <span class="instructions">门诊/住院号:</span>
            <span
              >{{ row.outpatientHospitalNumber }}
              <q-tooltip
                transition-show="scale"
                transition-hide="scale"
                content-class="bg-white text-black shadow-4 text-weight-medium"
                :delay="1000"
              >
                {{ row.outpatientHospitalNumber }}
              </q-tooltip>
            </span>
          </div>
        </div>
        <div class="row q-my-md">
          <div class="col-3 hideText">
            <span class="instructions">个人编号:</span>
            <span
              >{{ row.personId }}
              <q-tooltip
                transition-show="scale"
                transition-hide="scale"
                content-class="bg-white text-black shadow-4 text-weight-medium"
                :delay="1000"
              >
                {{ row.personId }}
              </q-tooltip></span
            >
          </div>
          <div class="hideText col-2">
            <span class="instructions">险种:</span>
            <span>{{ row.insurance }}</span>
          </div>
          <div class="col-1 hideText">
            <span class="instructions">性别:</span>
            <span>{{ row.sex }} </span>
          </div>
          <div class="col-2">
            <span class="instructions">年龄:</span>
            <span>{{ row.age }}</span>
          </div>
          <div class="col-3 hideText">
            <span class="instructions">主要诊断:</span>
            <span
              >{{ row.mainDiagnosis }}
              <q-tooltip
                transition-show="scale"
                transition-hide="scale"
                content-class="bg-white text-black shadow-4 text-weight-medium"
                :delay="1000"
              >
                {{ row.mainDiagnosis }}
              </q-tooltip>
            </span>
          </div>
        </div>
        <div class="row">
          <div class="col-3 hideText">
            <span class="instructions">入院日期:</span>
            <span
              >{{ row.admissionDate }}
              <q-tooltip
                transition-show="scale"
                transition-hide="scale"
                content-class="bg-white text-black shadow-4 text-weight-medium"
                :delay="1000"
              >
                {{ row.admissionDate }}
              </q-tooltip>
            </span>
          </div>
          <div class="col-3 hideText">
            <span class="instructions">出院日期:</span>
            <span
              >{{ row.dischargeDate }}
              <q-tooltip
                transition-show="scale"
                transition-hide="scale"
                content-class="bg-white text-black shadow-4 text-weight-medium"
                :delay="1000"
              >
                {{ row.dischargeDate }}
              </q-tooltip>
            </span>
          </div>
          <div class="col-2 hideText">
            <span class="instructions">住院天数:</span>
            <span
              >{{ row.hospitalizedDay }}
              <q-tooltip
                transition-show="scale"
                transition-hide="scale"
                content-class="bg-white text-black shadow-4 text-weight-medium"
                :delay="1000"
              >
                {{ row.hospitalizedDay }}
              </q-tooltip>
            </span>
          </div>
          <div class="col-3 hideText">
            <span class="instructions">病种类型:</span>
            <span
              >{{ row.typesOfDiseases }}
              <q-tooltip
                transition-show="scale"
                transition-hide="scale"
                content-class="bg-white text-black shadow-4 text-weight-medium"
                :delay="1000"
              >
                {{ row.typesOfDiseases }}
              </q-tooltip>
            </span>
          </div>
        </div>
        <div class="row q-my-md">
          <div class="col-3 hideText">
            <span class="instructions">单据金额:</span>
            <span>{{ row.documentAmount }}</span>
          </div>
          <div class="col-3 hideText">
            <span class="instructions">基金支付:</span>
            <span>{{ row.fundPayment }}</span>
          </div>
          <div class="col-2 hideText">
            <span class="instructions">统筹支付:</span>
            <span>{{ row.overallPayment }} </span>
          </div>
          <div class="col-3 hideText">
            <span class="instructions">个账支付:</span>
            <span>{{ row.individualAccountPayment }} </span>
          </div>
        </div>
        <div class="row">
          <div class="col-3 hideText">
            <span class="instructions">处理人:</span>
            <span>{{ row.handler }}</span>
          </div>
          <div class="col-3 hideText">
            <span class="instructions">处理时间:</span>
            <span>{{ row.processingTime }}</span>
          </div>
          <div class="col-2 hideText">
            <span class="instructions">参保身份:</span>
            <span>{{ row.insuredStatus }} </span>
          </div>
        </div>
        <div class="row q-my-md">
          <div class="col-6 q-pr-sm">
            <span class="instructions">剔除说明: </span
            ><span>
              {{ row.eliminateInstructions }}
            </span>
          </div>
          <div class="col-6">
            <span class="instructions">申诉说明: </span
            ><span>
              {{ row.appealDescription }}
            </span>
          </div>
        </div>
        <div class="row q-my-md">
          <div class="col-6 q-pr-sm">
            <span class="instructions">智能审核规则: </span
            ><span>
              {{ row.smartAuditRules }}
            </span>
          </div>
          <div class="col-6">
            <span class="instructions">人工审核规则: </span
            ><span>
              {{ row.manualAuditRules }}
            </span>
          </div>
        </div>
        <div class="row q-mt-md">
          <div class="col-6 q-pr-sm">
            <span class="instructions">智能审核规则描述: </span
            ><span>
              {{ row.descriptionSmartAuditRules }}
            </span>
          </div>
          <div class="col-6">
            <span class="instructions">人工审核规则描述: </span
            ><span>
              {{ row.manualReviewRuleDescription }}
            </span>
          </div>
        </div>
        <div class="row q-my-sm items-center">
          <div class="col-3 hideText">
            <span class="instructions">导入日期: </span
            ><span>
              {{ row.importTime }}
            </span>
          </div>
          <div class="col-3">
            <span class="instructions">反馈结束日期: </span
            ><span>
              {{ row.feedbackEndDate }}
            </span>
          </div>
          <div class="col-3">
            <span class="instructions">剩余天数: </span>
            <q-chip
              square
              color="red-6"
              text-color="white"
              v-if="row.remainingNumberOfDays < 7"
              :label="row.remainingNumberOfDays"
            />
            <q-chip
              square
              color="amber-8"
              text-color="white"
              v-if="
                row.remainingNumberOfDays >= 7 &&
                  row.remainingNumberOfDays <= 14
              "
              :label="row.remainingNumberOfDays"
            />
            <q-chip
              square
              color="positive"
              text-color="white"
              v-if="row.remainingNumberOfDays > 14"
              :label="row.remainingNumberOfDays"
            />
          </div>
        </div>
        <div class="row items-center">
          <div class="col-3">
            <span class="instructions">剔除金额:</span>
            <q-chip
              square
              color="red-6"
              text-color="white"
              icon="icon-feiyong"
              v-if="row.excludingAmount"
              :label="row.excludingAmount"
            />
          </div>
          <div class="col-3">
            <span class="instructions">反馈状态:</span>
            <q-chip
              square
              color="red-6"
              text-color="white"
              icon="warning"
              v-if="row.feedbackStatus === '未处理'"
              :label="row.feedbackStatus"
              clickable
            >
              <q-popup-edit
                buttons
                title="反馈状态"
                v-model="row.feedbackStatus"
              >
                <q-select
                  filled
                  v-model="row.feedbackStatus"
                  :options="options"
                />
              </q-popup-edit>
            </q-chip>
            <q-chip
              square
              color="positive"
              text-color="white"
              icon="check"
              v-if="row.feedbackStatus === '已处理'"
              :label="row.feedbackStatus"
              clickable
              ><q-popup-edit
                buttons
                title="反馈状态"
                v-model="row.feedbackStatus"
              >
                <q-select
                  filled
                  v-model="row.feedbackStatus"
                  :options="options"
                /> </q-popup-edit
            ></q-chip>
            <q-chip
              square
              color="amber-8"
              text-color="white"
              icon="icon-daibandengdaishenhe"
              v-if="row.feedbackStatus === '处理中'"
              :label="row.feedbackStatus"
              clickable
              ><q-popup-edit
                buttons
                title="反馈状态"
                v-model="row.feedbackStatus"
              >
                <q-select
                  filled
                  v-model="row.feedbackStatus"
                  :options="options"
                /> </q-popup-edit
            ></q-chip>
          </div>
          <div class="col-3">
            <span class="instructions">处理结果:</span>

            <q-chip
              square
              color="red-6"
              text-color="white"
              icon="warning"
              v-if="row.treatmentResults === '未处理'"
              :label="row.treatmentResults"
              clickable
            >
              <q-popup-edit
                buttons
                title="处理结果"
                v-model="row.treatmentResults"
              >
                <q-select
                  filled
                  v-model="row.treatmentResults"
                  :options="options"
                />
              </q-popup-edit>
            </q-chip>
            <q-chip
              square
              color="positive"
              text-color="white"
              icon="check"
              v-if="row.treatmentResults === '已处理'"
              :label="row.treatmentResults"
              clickable
              ><q-popup-edit
                buttons
                title="处理结果"
                v-model="row.treatmentResults"
              >
                <q-select
                  filled
                  v-model="row.treatmentResults"
                  :options="options"
                /> </q-popup-edit
            ></q-chip>
            <q-chip
              square
              color="amber-8"
              text-color="white"
              icon="icon-daibandengdaishenhe"
              v-if="row.treatmentResults === '处理中'"
              :label="row.treatmentResults"
              clickable
              ><q-popup-edit
                buttons
                title="处理结果"
                v-model="row.treatmentResults"
              >
                <q-select
                  filled
                  v-model="row.treatmentResults"
                  :options="options"
                /> </q-popup-edit
            ></q-chip>
          </div>
        </div>
        <div class="row q-mt-sm">
          <div class="col-12">
            <span class="instructions">反馈说明: </span
            ><span>
              {{ row.feedbackDescription }}
              <q-popup-edit
                buttons
                title="反馈说明"
                persistent
                v-model="row.feedbackDescription"
              >
                <q-input
                  type="textarea"
                  v-model="row.feedbackDescription"
                  autofocus
                  counter
                  @keyup.enter.stop
                />
              </q-popup-edit>
            </span>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          label="更新"
          class="bg-accent"
          style="color: white;"
          @click="updateInvoiceAuditing"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import { deepClone } from "assets/js/util/common";
export default {
  props: {
    row: Object
  },
  data() {
    return {
      options: ["未处理", "已处理", "处理中"]
    };
  },
  methods: {
    async updateInvoiceAuditing() {
      let param = deepClone(this.row);
      let resultData = [];
      await this.$http
        .post("/auditingFeedback/updateByDocumentId", param)
        .then(res => {
          if (res.status === 200) {
            resultData = res.data.data;
          }
        })
        .catch(e => {});
      if (resultData === 1) {
        this.$q.notify({
          icon: "done",
          color: "positive",
          message: "更新成功"
        });
      } else {
        this.$q.notify({
          icon: "error",
          color: "negative",
          message: "更新失败"
        });
      }
      this.$emit("initialize");
    }
  }
};
</script>

<style lang="scss" scoped>
.dialogInfo {
  width: 60vw;
  max-width: 70vw;
  font-size: 16px;

  .hideText {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .dialogInfo-card {
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
    .instructions {
      // color: #431d87;
      padding: 0 8px 0 0;
      font-weight: 600;
    }
  }
}
</style>
