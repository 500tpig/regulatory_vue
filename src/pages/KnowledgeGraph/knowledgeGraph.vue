<template>
  <q-page class="knowledgeGraph">
    <page-base-scroll content_class="q-mt-md q-px-md">
      <div class="row ">
        <q-card class="container col-8 q-mr-md" ref="containerRef"></q-card>
        <q-card class="col q-py-md">
          <div class="text-h6 q-pl-md">参数设置</div>
          <!-- 类型选择 -->
          <div class="row items-center q-pl-lg  q-mt-md">
            <span class="q-mr-lg text-weight-medium">类型:</span>
            <q-option-group
              v-model="searchParam.type"
              :options="common.typeOptions"
              color="primary"
              style="font-size:14px;"
              inline
              class="text-weight-medium subText"
            />
          </div>
          <!-- 日期 -->
          <div class="row items-center q-pl-lg q-mt-md">
            <span class="q-mr-md text-weight-medium">日期选择:</span>
            <el-date-picker
              align="center"
              style="width:50%;"
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
          <!-- 参保人选择 -->
          <div class="row items-center q-pl-lg q-mt-md">
            <span class="q-mr-md text-weight-medium">参保人选择:</span>
            <q-btn color="secondary" @click="common.dialog.showDialog = true"
              >参保人选择</q-btn
            >
            <q-btn @click="query()" color="primary" class="q-ml-md">查询</q-btn>
          </div>
          <div class="row items-center q-pl-sm q-mt-md">
            <q-list>
              <!-- 已选参保人 -->
              <q-expansion-item
                popup
                default-opened
                icon="icon-user-group-fill"
                label="已选参保人"
              >
                <q-separator />
                <q-card>
                  <q-card-section>
                    <div>
                      <div
                        class="col row"
                        v-if="searchParam.personList.length > 0"
                      >
                        <div
                          v-for="(item, index) in searchParam.personList"
                          :key="index"
                        >
                          <span class="q-mr-md">参保人{{ index + 1 }}:</span>
                          <q-chip
                            removable
                            @remove="removePersonId(item, index)"
                            outline
                            color="light-blue"
                            icon="icon-user"
                            style="max-width: 300px"
                          >
                            <div class="hideText">
                              {{ item }}
                              <q-tooltip
                                content-class="bg-white text-black shadow-4 text-weight-medium"
                                content-style="font-size: 13px"
                                :offset="[10, 10]"
                              >
                                {{ item }}
                              </q-tooltip>
                            </div>
                          </q-chip>
                        </div>
                      </div>
                      <div v-else class="row  text-weight-medium col">
                        <div class="offset-2">
                          无
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </q-expansion-item>
              <!-- 节点类型 -->
              <q-expansion-item
                popup
                default-opened
                icon="icon-jiediancuxiao"
                label="节点类型"
              >
                <q-separator />
              </q-expansion-item>
              <!-- 节点信息 -->
              <q-expansion-item
                popup
                default-opened
                icon="icon-xinxi1"
                label="节点信息"
              >
                <q-separator />
                <div class="tooltip q-py-sm q-px-md"></div>
              </q-expansion-item>
            </q-list>
          </div>
        </q-card>
      </div>
      <q-dialog v-model="common.dialog.showDialog"
        ><specificTable
          @selectConfirm="selectConfirm"
          url="/person/getPersonList"
          :searchParam="searchParam"
          :columns="common.dialog.columns"
          title="参保人"
          selection="multiple"
      /></q-dialog>
    </page-base-scroll>
  </q-page>
</template>
<script>
/* eslint-disable  no-param-reassign */
import * as d3 from "d3";
import pageBaseScroll from "components/utils/PageScroll";
import { pickerOptions, shallowCopyObj } from "assets/js/util/common";
import specificTable from "components/utils/specificTable";
const leng = [
  { group: "Person" },
  { group: "DiagnosticEventsOC" },
  { group: "DiagnosticEventsHC" },
  { group: "Date" }
];
const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

export default {
  components: { pageBaseScroll, specificTable },
  data() {
    return {
      searchParam: {
        personList: ["B4009B864068C706A0ED408167E7A03AFCCA8BF95E698A30"],
        chargingTime: ["20160701", "20161231"],
        type: "OCAndHC"
      },
      links: "",
      linksText: "",
      gs: "",
      d3: {
        forceSimulation: ""
      },
      common: {
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
        pickerOptions: pickerOptions,
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
        ]
      }
    };
  },
  mounted() {},
  methods: {
    async query() {
      let param = {};
      param = shallowCopyObj(this.searchParam, param);
      param.startDate = this.searchParam.chargingTime[0];
      param.endDate = this.searchParam.chargingTime[1];
      let personData = [];
      await this.$http
        .post("/knowledgeGraph/query", param)
        .then(res => {
          if (res.status === 200) {
            personData = res.data.data;
          }
        })
        .catch(e => {});

      this.graphInit(personData);
    },
    graphInit(personData) {
      let svg1 = d3.select("svg");
      if (svg1) {
        svg1.remove();
      }
      // 新建一个力导向图
      this.forceSimulation = d3
        .forceSimulation()
        .force(
          "link",
          d3.forceLink().id(d => d.id)
        )
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter());

      let nodes = personData.nodes;
      let edges = personData.edges;

      let widthSVG = 380;
      let heightSVG = 300; //设置绘制范围的宽高

      const svg = d3
        .select(".container")
        .append("svg")
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("viewBox", "0 0 380 300")
        .attr("preserveAspectRatio", "none");

      const width = svg.attr("width");
      const height = svg.attr("height");
      const g = svg.append("g");
      svg
        .call(
          d3
            .zoom()
            .scaleExtent([0.1, 4])
            .on("zoom", () => {
              g.attr("transform", d3.event.transform);
            })
        )
        .on("dblclick.zoom", null); // 关闭双击缩放功能

      // 设置lengend
      // svg
      //   .selectAll("rect")
      //   .data(leng)
      //   .enter()
      //   .append("rect")
      //   .attr("x", (d, i) => i * 70)
      //   .attr("y", 20)
      //   .attr("class", "legend")
      //   .attr("width", 25)
      //   .attr("height", 15)
      //   .attr("rx", 4)
      //   .attr("ry", 4)
      //   .style("fill", d => colorScale(d.group));

      // svg
      //   .selectAll(".text")
      //   .data(leng)
      //   .enter()
      //   .append("text")
      //   .attr("class", "Text")
      //   .attr("x", (d, i) => 25 + i * 75)
      //   .attr("y", 32)
      //   .attr("transform", "translate(5)")
      //   .text(d => d.group);

      this.forceSimulation.nodes(nodes).on("tick", this.ticked); // 这个函数很重要，后面给出具体实现和说明
      // 生成边数据
      this.forceSimulation
        .force("link")
        .links(edges)
        .distance(() => 200);
      // 设置图形的中心位置
      this.forceSimulation
        .force("center")
        .x(width / 2)
        .y(height / 2);
      // 在浏览器的控制台输出

      // 有了节点和边的数据后，我们开始绘制
      // 绘制边
      this.links = g
        .append("g")
        .selectAll("line")
        .data(edges)
        .enter()
        .append("line")
        .attr("stroke", "#ccc")
        .attr("stroke-width", 1);
      // 绘制节点
      // 老规矩，先为节点和节点上的文字分组
      this.gs = g
        .selectAll(".circleText")
        .data(nodes)
        .enter()
        .append("g")
        .attr("transform", d => {
          const cirX = d.x;
          const cirY = d.y;
          return `translate(${cirX},${cirY})`;
        })
        .call(
          d3
            .drag()
            .on("start", this.started)
            .on("drag", this.dragged)
            .on("end", this.ended)
        );

      //添加提示框的div
      let tooltip = d3.select(".tooltip");

      // 绘制节点
      this.gs
        .append("circle")
        .attr("r", 15)
        .attr("fill", d => colorScale(d.group))
        .on("mouseover", this.showTooltip);
      //--鼠标移出事件
      // .on("mouseout", function(d) {
      //   tooltip.style("opacity", 0.0);
      // });

      // 文字
      // this.gs
      //   .append("text")
      //   .attr("x", -15)
      //   .attr("y", -28)
      //   .attr("dy", 10)
      //   .attr("fill", d => colorScale(d.group))
      //   .text(d => d.group);
    },
    showTooltip(d) {
      //添加提示框的div
      let tooltip = d3.select(".tooltip");
      // console.log(d);
      let htmlStr = "";
      let classStr =
        "<span style='color: #838098;font-size: 16px;font-weight: 500;'>";
      let spanClass = "<span style='font-weight: 500;'>";
      tooltip.html(htmlStr);

      htmlStr +=
        spanClass +
        "节点类型： </span>" +
        classStr +
        d.properties.nodeName +
        "</span><br/>";
      htmlStr +=
        spanClass + "图谱ID： </span>" + classStr + d.id + "</span><br/>";

      if (d.group === "Person") {
        htmlStr +=
          spanClass +
          "姓名 ：</span>" +
          classStr +
          d.properties.name +
          "</span><br/>";
        htmlStr +=
          spanClass +
          "性别 ：</span>" +
          classStr +
          d.properties.sex +
          "</span>" +
          "<br/>";
        htmlStr +=
          "<div style='max-width: 300px;overflow: hidden;white-space: nowrap;" +
          "text-overflow: ellipsis;font-weight: 500;'>参保人ID ：" +
          classStr +
          d.properties.id +
          "</span>" +
          "</div>";
        htmlStr +=
          spanClass +
          "出生日期 ：</span>" +
          classStr +
          d.properties.birthday +
          "</span>" +
          "<br/>";
        //设置tooltip文字
        tooltip.html(htmlStr).style("opacity", 1.0);
      }
      if (d.group === "Date") {
        htmlStr +=
          spanClass +
          "日期：</span>" +
          classStr +
          d.properties.date +
          "</span>";
        //设置tooltip文字
        tooltip.html(htmlStr).style("opacity", 1.0);
      }
      if (
        d.group === "DiagnosticEventsOC" ||
        d.group === "DiagnosticEventsHC"
      ) {
        htmlStr +=
          spanClass +
          "费用日期：</span>" +
          classStr +
          d.properties.date +
          "</span>";
        //设置tooltip文字
        tooltip.html(htmlStr).style("opacity", 1.0);
      }
    },
    ticked() {
      this.links
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
      this.gs.attr("transform", d => `translate(${d.x},${d.y})`);
    },
    started(d) {
      if (!d3.event.active) {
        this.forceSimulation.alphaTarget(0.8).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
    },
    dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    },
    ended(d) {
      if (!d3.event.active) {
        this.forceSimulation.alphaTarget(0);
      }
      d.fx = null;
      d.fy = null;
    },
    selectConfirm(data) {
      this.common.dialog.showDialog = false;
      for (let i = 0; i < data.length; i++) {
        let temp = data[i];
        this.searchParam.personList.push(temp.column);
      }
    },
    removePersonId(obj, index) {
      this.searchParam.personList.splice(index, 1);
    }
  }
};
</script>
<style scoped lang="scss">
.knowledgeGraph {
  color: #333160;
  font-size: 16px;
  .subText {
    color: #838098;
    font-size: 16px;
    font-weight: 500;
  }
  .title {
    background: red;
  }
  .text {
    font-size: 12px;
  }
  .legend {
    position: fixed;
    font: 10px sans-serif;
    box-shadow: 2px 2px 1px #888;
  }
  .hideText {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
