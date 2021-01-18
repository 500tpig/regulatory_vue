<template>
  <q-page class="overview">
    <page-base-scroll content_class="q-mt-md q-px-md q-pb-lg">
      <div class="row justify-center">
        <div class="col-6 row q-pa-sm">
          <q-card class="col-12 q-pa-md">
            <div class="row justify-center">
              <div class="text-h5 text-primary q-mb-md text-weight-medium">
                数据导入
              </div>
            </div>
            <div class="col-12 row justify-center q-mb-md">
              <el-upload
                drag
                ref="upload"
                accept="xls,xlsx"
                :auto-upload="false"
                :multiple="false"
                action=""
                :on-change="fileOnChange"
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  将文件拖到此处，或<em>点击上传</em>
                </div>
                <div class="el-upload__tip" slot="tip">
                  只能上传xls/xlsx文件，一次只处理一个文件。
                </div>
                <div class="el-upload__tip" slot="tip">
                  文件过大时会出现卡顿现象，请耐心等待。
                </div>
              </el-upload>
            </div>
            <div class="row q-mb-md">
              <div class=" offset-2 row">
                <q-input
                  color="primary"
                  v-model="uploadParam.operator"
                  label="操作人"
                  ref="operator"
                  clearable
                  :input-style="{ fontSize: '16px' }"
                  :rules="[val => !!val || 'Field is required']"
                >
                  <template v-slot:prepend>
                    <q-icon name="icon-user" />
                  </template>
                </q-input>
              </div>
            </div>
            <div class="row q-mb-md">
              <div class="offset-2 row col-12">
                <q-input
                  class="col-8"
                  v-model="uploadParam.operatingInstructions"
                  ref="operatingInstructions"
                  label="操作说明"
                  hint="输入本次数据导入的相关描述"
                  outlined
                  autogrow
                  clearable
                  type="textarea"
                  :input-style="{ fontSize: '16px' }"
                  :rules="[val => !!val || 'Field is required']"
                />
              </div>
            </div>
            <div class="row justify-center">
              <q-btn
                :loading="loading"
                color="orange"
                text-color="black"
                @click="simulateProgress()"
                icon="cloud_upload"
                style="width: 120px"
              >
                <template v-slot:loading>
                  <q-spinner-gears class="on-left" />
                  更新中...
                </template></q-btn
              >
            </div>
          </q-card>
        </div>
        <div class="col-6 row q-pa-sm">
          <q-card class="col-12"> </q-card>
        </div>
      </div>
    </page-base-scroll>
  </q-page>
</template>

<script>
import pageBaseScroll from "components/utils/PageScroll";
import XLSX from "xlsx";
export default {
  components: { pageBaseScroll },
  data() {
    return {
      uploadParam: {
        operator: "test",
        operatingInstructions: "test",
        fileName: "test.xml",
        data: []
      },
      loading: false
    };
  },
  methods: {
    upload() {},
    fileOnChange(file, fileList) {
      this.uploadParam.fileName = file.name;
      let files = { 0: file.raw };
      this.readExcel(files);
    },
    async simulateProgress() {
      this.loading = true;
      let result = [];
      this.uploadParam.updateUser = this.$store.getters["user/userInfo"][
        "userName"
      ];
      this.$refs.operator.validate();
      this.$refs.operatingInstructions.validate();
      if (
        this.$refs.operator.hasError ||
        this.$refs.operatingInstructions.hasError
      ) {
        return;
      }
      if (this.uploadParam.data.length <= 0) {
        this.$q.notify({
          icon: "warning",
          color: "warning",
          message: "请添加要上传的文件！"
        });
      } else {
        this.$q.notify({
          icon: "done",
          color: "positive",
          message: "提交成功，请等待..."
        });
      }
      await this.$http
        .post("/auditingFeedback/insertRecord", this.uploadParam)
        .then(res => {
          if (res.status === 200) {
            result = res.data.data;
          }
        })
        .catch(e => {});
      this.loading = false;
    },
    readExcel(files) {
      //表格导入
      let that = this;
      if (files.length <= 0) {
        //如果没有文件名
        return false;
      } else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
        this.$q.notify({
          icon: "error",
          color: "negative",
          message: "上传格式不正确，请上传xls或者xlsx格式"
        });
        return false;
      }
      const fileReader = new FileReader();
      fileReader.onload = ev => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: "binary"
          });
          let documentsIndex = -1;
          let detailIndex = -1;
          for (let index = 0; index < workbook.SheetNames.length; index++) {
            const element = workbook.SheetNames[index];
            if (element === "单据") {
              documentsIndex = index;
            } else if (element === "单据明细") {
              detailIndex = index;
            }
          }
          if (documentsIndex === -1) {
            that.$q.notify({
              icon: "error",
              color: "negative",
              message: "上传文件找不到单据"
            });
            this.$refs["upload"].clearFiles();
            return false;
          } else if (detailIndex === -1) {
            that.$q.notify({
              icon: "error",
              color: "negative",
              message: "上传文件找不到单据明细"
            });
            this.$refs["upload"].clearFiles();
            return false;
          }
          const wsname1 = workbook.SheetNames[documentsIndex]; //取第n张表
          const ws1 = XLSX.utils.sheet_to_json(workbook.Sheets[wsname1]); //生成表的json表格内容
          that.uploadParam.data = ws1;
        } catch (e) {
          return false;
        }
      };
      fileReader.readAsBinaryString(files[0]);
    }
  },
  mounted() {}
};
</script>

<style></style>
