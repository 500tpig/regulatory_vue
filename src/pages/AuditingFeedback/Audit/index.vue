<template>
  <q-page class="audit row q-pa-md">
    <div class="col-5">
      <div class="column" style="height:100%;">
        <q-card class="col-auto q-pa-md">
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
        <div class="col q-pt-md auditTable-div">
          <!-- <q-table
            class="auditTable col-12 shadow-2 bg-white"
            :data="common.table.data"
            :columns="common.table.columns"
            row-key="documentId"
            selection="single"
            :selected.sync="common.table.selected"
            :visible-columns="common.table.visibleColumns"
            :filter="common.table.filter"
            grid
            :rows-per-page-options="[6]"
          >
            <template v-slot:top>
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
              <q-space />
              <q-input
                borderless
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

            <template v-slot:item="props">
              <div
                class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-6 grid-style-transition"
                :style="props.selected ? 'transform: scale(0.95);' : ''"
              >
                <q-card :class="props.selected ? 'bg-grey-2' : ''">
                  <q-card-section>
                    <q-checkbox
                      dense
                      v-model="props.selected"
                      :label="props.row.name"
                    />
                  </q-card-section>
                  <q-separator />
                  <q-list dense>
                    <q-item
                      v-for="col in props.cols.filter(
                        col => col.name !== 'desc'
                      )"
                      :key="col.name"
                    >
                      <q-item-section>
                        <q-item-label>{{ col.label }}</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-item-label caption>{{ col.value }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card>
              </div>
            </template>
          </q-table> -->
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
          >
            <template v-slot:top>
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
              <q-space />
              <q-input
                borderless
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
    <div class="col-7 row q-pl-md">
      <q-card class="col-12 row"></q-card>
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
            "importTime",
            "remainingNumberOfDays"
          ],
          filter: "",
          data: [],
          selected: [],
          columns: [
            {
              name: "documentId",
              label: "单据编号",
              field: "documentId",
              align: "center",
              sortable: true
            },
            {
              name: "department",
              label: "科室",
              field: "department",
              align: "center",
              sortable: true
            },
            {
              name: "personId",
              label: "个人编号",
              field: "personId",
              align: "center",
              sortable: true
            },
            {
              name: "importTime",
              label: "导入时间",
              field: "importTime",
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
              field: "remainingNumberOfDays",
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
      console.log(resultData);
    },
    exportTables() {
      exportTable(this.common.table.columns, this.common.table.data);
    }
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
}
</style>
<style lang="sass">
.auditTable-div
  position: relative
  width: 100%
  .auditTable

    height: 810px !important
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
