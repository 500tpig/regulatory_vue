<template>
  <q-page class="overview">
    <q-tabs
      v-model="common.tab"
      align="left"
      inline-label
      class="bg-grey-1 text-weight-bold"
    >
      <q-tab
        name="update"
        icon="icon-shangchuan"
        label="数据上传"
        class="text-orange"
        style="width:140px;"
      />
      <q-tab
        name="record"
        icon="icon-jilu"
        label="上传记录"
        class="text-indigo"
        style="width:140px;"
      />
    </q-tabs>
    <q-tab-panels v-model="common.tab" animated style="background: #FAFAFA;">
      <q-tab-panel name="update">
        <page-base-scroll content_class="q-px-md q-pb-lg">
          <div class="row justify-center" style="margin-top:4%;">
            <div class="col-9 row">
              <q-card class="col-12 q-pa-lg">
                <div class="row justify-center">
                  <div class="text-h5 text-primary q-mb-md text-weight-medium">
                    数据导入
                  </div>
                </div>
                <div class="row items-center q-mb-md">
                  <div
                    class="offset-2 q-mr-sm text-black "
                    style="font-size:16px;"
                  >
                    类型选择:
                  </div>
                  <div class="text-grey-8" style="font-size:16px;">
                    <q-radio
                      v-model="uploadParam.type"
                      val="documents"
                      label="单据"
                      @input="changeType"
                    />
                    <q-radio
                      v-model="uploadParam.type"
                      val="details"
                      label="单据明细"
                      @input="changeType"
                    />
                    <q-radio
                      v-model="uploadParam.type"
                      val="DAndD"
                      label="全选"
                      @input="changeType"
                    />
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
                      outlined
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
                    :loading="common.loading"
                    color="orange"
                    text-color="black"
                    :percentage="common.percentage"
                    @click="simulateProgress()"
                    icon="cloud_upload"
                    style="width: 130px"
                    size="16px"
                  >
                    <template v-slot:loading>
                      <q-spinner-gears class="on-left" />
                      更新中...
                    </template></q-btn
                  >
                </div>
              </q-card>
            </div>
          </div>
        </page-base-scroll>
      </q-tab-panel>
      <q-tab-panel name="record">
        <page-base-scroll content_class="q-px-md q-pb-lg">
          <div class="row justify-center" style="margin-top:4%;">
            <div class="col-9 row">
              <q-card class="col-12">
                <q-table
                  title="数据上传记录"
                  class="updateDataTable"
                  :data="table.data"
                  :columns="table.columns"
                  row-key="id"
                  :rows-per-page-options="[10, 20, 30, 50, 100]"
                  :visible-columns="table.visibleColumns"
                  :filter="table.filter"
                  flat
                  bordered
                >
                  <template v-slot:top-right>
                    <q-input
                      borderless
                      dense
                      debounce="300"
                      v-model="table.filter"
                      placeholder="Search"
                      :input-style="{ padding: '8px' }"
                      bg-color="white"
                      :rows-per-page-options="[10, 20, 30, 50, 100]"
                    >
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </template>
                  <template v-slot:header="props">
                    <q-tr :props="props">
                      <q-th auto-width />
                      <q-th
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                      >
                        {{ col.label }}
                      </q-th>
                    </q-tr>
                  </template>
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td auto-width>
                        <q-btn
                          size="sm"
                          color="primary"
                          round
                          dense
                          @click="props.expand = !props.expand"
                          :icon="props.expand ? 'remove' : 'add'"
                        />
                      </q-td>
                      <q-td
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                      >
                        {{ col.value }}
                      </q-td>
                    </q-tr>
                    <q-tr v-show="props.expand" :props="props">
                      <q-td colspan="100%" style="font-size:16px;">
                        <div class="text-left">
                          本次数据上传说明:
                        </div>
                        <div style="text-indent:2em">
                          {{ props.row.operatingInstructions }}
                        </div>
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </q-card>
            </div>
          </div>
        </page-base-scroll>
      </q-tab-panel>
    </q-tab-panels>
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
        data: {
          documents: [],
          details: []
        },
        type: "documents"
      },
      table: {
        visibleColumns: [
          "index",
          "operator",
          "operationTime",
          "stopTime",
          "state",
          "updateUser",
          "fileName",
          "type"
        ],
        filter: "",
        columns: [
          {
            name: "index",
            label: "#",
            field: "index",
            align: "center",
            sortable: true
          },
          {
            name: "operator",
            label: "操作人",
            field: "operator",
            sortable: true,
            align: "center",
            format: val => `${val}`
          },

          {
            name: "operationTime",
            label: "操作时间",
            field: "operationTime",
            align: "center",
            sortable: true
          },
          {
            name: "stopTime",
            label: "结束时间",
            field: "stopTime",
            align: "center",
            sortable: true
          },
          {
            name: "updateUser",
            label: "操作用户",
            field: "updateUser",
            align: "center",
            sortable: true
          },
          {
            name: "operatingInstructions",
            label: "操作说明",
            field: "operatingInstructions",
            align: "center",
            sortable: true
          },
          {
            name: "type",
            label: "类型",
            field: "type",
            align: "center",
            sortable: true
          },
          {
            name: "fileName",
            label: "文件名",
            field: "fileName",
            align: "center",
            sortable: true
          },
          {
            name: "state",
            align: "center",
            label: "状态",
            field: "state",
            format: val => {
              if (val === 0) {
                return "进行中";
              } else if (val === 1) {
                return "成功";
              } else {
                return "失败";
              }
            },
            sortable: true
          }
        ],
        data: []
      },
      common: {
        tab: "update",
        loading: false,
        percentage: 0,
        interval: "",
        percentageId: "",
        file: ""
      }
    };
  },
  methods: {
    // 开始上传
    async simulateProgress() {
      let that = this;
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
      if (this.uploadParam.type !== "DAndD") {
        let msg = "";
        if (this.uploadParam.type === "documents") {
          msg = "单据";
        } else if (this.uploadParam.type === "details") {
          msg = "单据明细";
        }
        if (this.uploadParam.data[this.uploadParam.type].length <= 0) {
          this.$q.notify({
            icon: "warning",
            color: "warning",
            message: "上传文件的" + msg + "为空！"
          });
          return;
        }
      } else {
        if (
          this.uploadParam.dat.documents.length <= 0 ||
          this.uploadParam.dat.details.length <= 0
        ) {
          this.$q.notify({
            icon: "warning",
            color: "warning",
            message: "上传文件的单据或单据明细为空！"
          });
          return;
        }
      }
      console.log(this.uploadParam);
      await this.$http
        .post("/auditingFeedback/insertRecord", this.uploadParam)
        .then(res => {
          if (res.status === 200) {
            result = res.data.data;
          }
        })
        .catch(e => {});
      if (result.length !== 0) {
        this.$q.notify({
          icon: "done",
          color: "positive",
          message: "导入中，请稍后。。"
        });
        this.common.percentageId = result;
        // 开始加载
        this.getUpdatePercentage();
      } else {
        this.$q.notify({
          icon: "error",
          color: "negative",
          message: "导入失败"
        });
      }
      this.getTableData();
    },
    // 传入文件
    fileOnChange(file, fileList) {
      this.uploadParam.fileName = file.name;
      let files = { 0: file.raw };
      this.common.file = files;
      this.readExcel(files);
    },
    // 处理文件
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
          if (that.uploadParam.type === "documents") {
            if (documentsIndex === -1) {
              that.$q.notify({
                icon: "error",
                color: "negative",
                message: "上传文件找不到单据"
              });
              that.$refs["upload"].clearFiles();
              return false;
            }
          } else if (that.uploadParam.type === "details") {
            if (detailIndex === -1) {
              that.$q.notify({
                icon: "error",
                color: "negative",
                message: "上传文件找不到单据明细"
              });
              that.$refs["upload"].clearFiles();
              return false;
            }
          } else {
            if (documentsIndex === -1) {
              that.$q.notify({
                icon: "error",
                color: "negative",
                message: "上传文件找不到单据"
              });
              that.$refs["upload"].clearFiles();
              return false;
            }
            if (detailIndex === -1) {
              that.$q.notify({
                icon: "error",
                color: "negative",
                message: "上传文件找不到单据明细"
              });
              that.$refs["upload"].clearFiles();
              return false;
            }
          }
          if (that.uploadParam.type === "documents") {
            const wsname1 = workbook.SheetNames[documentsIndex]; //取第n张表
            const ws1 = XLSX.utils.sheet_to_json(workbook.Sheets[wsname1]); //生成表的json表格内容
            that.uploadParam.data.documents = ws1;
          } else if (that.uploadParam.type === "details") {
            const wsname1 = workbook.SheetNames[detailIndex]; //取第n张表
            const ws1 = XLSX.utils.sheet_to_json(workbook.Sheets[wsname1]); //生成表的json表格内容
            that.uploadParam.data.details = ws1;
          } else {
            const wsname1 = workbook.SheetNames[documentsIndex]; //取第n张表
            const ws1 = XLSX.utils.sheet_to_json(workbook.Sheets[wsname1]); //生成表的json表格内容
            that.uploadParam.data.documents = ws1;
            const wsname2 = workbook.SheetNames[detailIndex]; //取第n张表
            const ws2 = XLSX.utils.sheet_to_json(workbook.Sheets[wsname2]); //生成表的json表格内容
            that.uploadParam.data.details = ws2;
          }
        } catch (e) {
          return false;
        }
      };
      fileReader.readAsBinaryString(files[0]);
      return true;
    },
    // 获取导入进度
    getUpdatePercentage() {
      let that = this;
      this.common.loading = true;
      this.common.percentage = 0;
      this.common.interval = setInterval(() => {
        let percentage = 0;
        let param = { id: that.common.percentageId };
        that.$http
          .post("/auditingFeedback/getUpdatePercentage", param)
          .then(res => {
            if (res.status === 200) {
              percentage = res.data.data;
              that.common.percentage = percentage;
              if (that.common.percentage >= 100) {
                clearInterval(that.common.interval);
                that.common.loading = false;
                that.$q.notify({
                  icon: "done",
                  color: "positive",
                  message: "导入完成！"
                });
                that.getTableData();
              }
            }
          })
          .catch(e => {
            clearInterval(that.common.interval);
            that.common.loading = false;
            that.$q.notify({
              icon: "error",
              color: "negative",
              message: "导入失败"
            });
            that.getTableData();
          });
      }, 1000);
    },
    // 获取导入记录
    async getTableData() {
      let result = [];
      await this.$http
        .post("/auditingFeedback/getUpdateDataList")
        .then(res => {
          if (res.status === 200) {
            result = res.data.data;
          }
        })
        .catch(e => {});
      let i = 1;
      result.map(item => {
        item.index = i++;
      });
      this.table.data = result;
    },
    changeType(value) {}
  },
  mounted() {
    this.getTableData();
  }
};
</script>

<style lang="sass">
.updateDataTable
  /* height or max-height is important */
  height: 580px !important

  .q-table__middle::-webkit-scrollbar
    display: none

  .q-table__title
    font-size: 1.4rem

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
