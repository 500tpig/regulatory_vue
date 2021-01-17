<template>
  <q-page class="overview">
    <page-base-scroll content_class="q-mt-md q-px-md q-pb-lg">
      <div class="row justify-center">
        <div class="col-6 row q-pa-sm">
          <q-card class="col-12 q-pa-md">
            <div class="row justify-center">
              <div class="text-h5 text-primary q-mb-md">数据导入</div>
            </div>
            <div class="col-12 row justify-center q-mb-md">
              <el-upload
                drag
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
                  只能上传xls/xlsx文件，一次只能处理一个文件
                </div>
              </el-upload>
            </div>
            <div class="row q-mb-md">
              <div class=" offset-2 row">
                <q-input
                  color="primary"
                  v-model="uploadParam.operator"
                  label="操作人"
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
                  v-model="uploadParam.operating_instructions"
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
                :loading="loading1"
                :percentage="percentage1"
                dark-percentage
                color="orange"
                text-color="grey-9"
                @click="startComputing(1)"
                icon="cloud_upload"
                style="width: 150px"
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
        operator: "",
        operating_instructions: ""
      },
      loading1: false,
      percentage1: 0
    };
  },
  methods: {
    upload() {},
    fileOnChange(file, fileList) {
      let files = { 0: file.raw };
      this.readExcel(files);
    },
    startComputing(id) {
      this[`loading${id}`] = true;
      this[`percentage${id}`] = 0;
      this[`interval${id}`] = setInterval(() => {
        this[`percentage${id}`] += Math.floor(Math.random() * 8 + 10);
        if (this[`percentage${id}`] >= 100) {
          clearInterval(this[`interval${id}`]);
          this[`loading${id}`] = false;
        }
      }, 700);
    },

    beforeDestroy() {
      clearInterval(this.interval1);
      clearInterval(this.interval2);
    },
    readExcel(files) {
      //表格导入
      var that = this;
      if (files.length <= 0) {
        //如果没有文件名
        return false;
      } else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
        this.$Message.error("上传格式不正确，请上传xls或者xlsx格式");
        return false;
      }
      const fileReader = new FileReader();
      fileReader.onload = ev => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: "binary"
          });
          let documentsIndex = 0;
          let detailIndex = 0;
          for (let index = 0; index < workbook.SheetNames.length; index++) {
            const element = workbook.SheetNames[index];
            if (element === "单据") {
              documentsIndex = index;
            } else if (element === "单据明细") {
              detailIndex = index;
            }
          }
          const wsname1 = workbook.SheetNames[documentsIndex]; //取第n张表
          const ws1 = XLSX.utils.sheet_to_json(workbook.Sheets[wsname1]); //生成表的json表格内容
          console.log("json表格内容", ws1);
          try {
          } catch (err) {
            console.log(err);
          }
          this.$refs.upload.value = "";
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
