<template>
  <q-page class="knowledgeGraph">
    <page-base-scroll content_class="q-mt-md q-px-md">
      <div class="row ">
        <q-card
          class="col-8 q-mr-md"
          id="container"
          ref="containerRef"
        ></q-card>
        <q-card class="col q-py-md">
          <div class="text-h6 q-pl-md">
            <q-icon name="icon-canshushezhi" style="font-size: 1.5em"></q-icon
            >设置
          </div>
          <div class="row justify-center">
            <div class="col-11">
              <q-list>
                <!-- 参数设置 -->
                <q-expansion-item
                  popup
                  default-opened
                  icon="icon-_canshu_xiugaicanshudingyi"
                  label="参数设置"
                >
                  <q-separator />
                  <!-- 类型选择 -->
                  <div class="row items-center q-pl-md">
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
                  <div class="row items-center q-pl-md q-mt-md">
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
                  <div class="row items-center q-pl-md q-my-md">
                    <span class="q-mr-md text-weight-medium">参保人选择:</span>
                    <q-btn
                      color="secondary"
                      @click="common.dialog.showDialog = true"
                      >参保人选择</q-btn
                    >
                    <q-btn @click="query()" color="primary" class="q-ml-md"
                      >查询</q-btn
                    >
                  </div>
                  <q-separator />
                </q-expansion-item>
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
import { generateR, generateColor } from "assets/js/util/knowledgeGraph";
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
      d3: {
        forceSimulation: "",
        dragging: false,
        nodes: "",
        links: "",
        nodeData: [],
        linkData: []
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
        ],
        image: {
          Person: require("src/assets/image/knowledgeGraph/Person.png"),
          DiagnosticEventsOC: require("src/assets/image/knowledgeGraph/DiagnosticEventsOC.png"),
          DiagnosticEventsHC: require("src/assets/image/knowledgeGraph/DiagnosticEventsHC.png"),
          Date: require("src/assets/image/knowledgeGraph/Date.png")
        }
      }
    };
  },
  mounted() {},
  methods: {
    async query() {
      this.removeSVG();
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
      this.d3.nodeData = personData.nodes;
      this.d3.linkData = personData.edges;

      this.graphInit(personData);
    },
    graphInit(personData) {
      let containerWidth = this.$refs.containerRef.$el.offsetWidth;
      let containerHeight = this.$refs.containerRef.$el.offsetHeight;

      let nodes = personData.nodes;
      let edges = personData.edges;

      const svg = this.setVis();
      this.setForce(containerWidth, containerHeight);

      this.forceSimulation.alphaTarget(0.1);
      this.forceSimulation.restart();

      const g = d3.select("g");

      this.forceSimulation.nodes(nodes).on("tick", this.ticked);
      // 绘制连线
      this.generateLinks(edges, g);
      // 绘制节点
      this.generateNodes(nodes, g);
    },
    // 创建svg视图
    setVis() {
      let svg = d3
        .select("#container")
        .append("div")
        .classed("svg-container", true)
        .append("svg")
        // Responsive SVG needs these 2 attributes and no width and height attr.
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("viewBox", "0 0 1000 1000")
        .attr("preserveAspectRatio", "none")
        // Class to make it responsive.
        .classed("svg-content-responsive", true)
        // .style("max-height", "950px")
        .call(
          d3
            .zoom()
            .scaleExtent([0.01, 10])
            .on("zoom", () => {
              g.attr("transform", d3.event.transform);
            })
        )
        .on("dblclick.zoom", null);

      const g = svg.append("g");

      let defs = d3
        .select("#container")
        .select("svg")
        .append("defs");
      //patient节点图片
      defs
        .append("pattern")
        .attr("id", "Person")
        .attr("patternContentUnits", "objectBoundingBox")
        .attr("width", "100%")
        .attr("height", "100%")
        .append("image")
        .attr("width", "1")
        .attr("height", "1")
        .attr("xlink:href", this.common.image.Person);

      defs
        .append("pattern")
        .attr("id", "DiagnosticEventsOC")
        .attr("patternContentUnits", "objectBoundingBox")
        .attr("width", "100%")
        .attr("height", "100%")
        .append("image")
        .attr("width", "1")
        .attr("height", "1")
        .attr("xlink:href", this.common.image.DiagnosticEventsOC);

      defs
        .append("pattern")
        .attr("id", "DiagnosticEventsHC")
        .attr("patternContentUnits", "objectBoundingBox")
        .attr("width", "100%")
        .attr("height", "100%")
        .append("image")
        .attr("width", "1")
        .attr("height", "1")
        .attr("xlink:href", this.common.image.DiagnosticEventsHC);

      defs
        .append("pattern")
        .attr("id", "Date")
        .attr("patternContentUnits", "objectBoundingBox")
        .attr("width", "100%")
        .attr("height", "100%")
        .append("image")
        .attr("width", "1")
        .attr("height", "1")
        .attr("xlink:href", this.common.image.Date);

      return svg;
    },
    // 清空svg
    removeSVG() {
      d3.selectAll("#container > *").remove();
      d3.select("svg").remove();
    },
    // 力导向图布局
    setForce(containerWidth, containerHeight) {
      // 新建一个力导向图
      this.forceSimulation = d3
        .forceSimulation([])
        .alphaDecay(0.03) //设置 alpha 衰减率.迭代150，默认0.0228
        .alphaMin(0.005) //需要在 [0, 1] 之间。如果没有指定 min 则返回当前的最小 alpha 值，默认为 0.001. 在仿真内部，会不断的减小 alpha 值直到 alpha 值小于 最小 alpha。
        .velocityDecay(0.2) //默认为 0.4,较低的衰减系数可以使得迭代次数更多，其布局结果也会更理性，但是可能会引起数值不稳定从而导致震荡。
        .force(
          "link",
          d3
            .forceLink([])
            .id(d => d.id)
            .distance(200)
        )
        .force(
          "collision",
          d3
            .forceCollide(d => generateR(d) + 0.5) //设置节点碰撞半径>= 点半径避免重叠
            .strength(1) //则将碰撞强度设置为指定的数值，强度范围为 [0, 1]。并返回当前碰撞力模型,默认0.7
        )
        .force("charge", d3.forceManyBody())
        .force(
          "charge",
          d3.forceManyBody().strength(-150) //作用力应用在所用的节点之间，当strength为正的时候可以模拟重力，当为负的时候可以模拟电荷力。
          // .distanceMin(80)   //设置或获取最小连接距离
          // .distanceMax(400)  //设置或获取最大连接距离
        )
        .force(
          "center",
          d3.forceCenter(containerWidth / 2, containerHeight / 2)
        )
        .force("x", d3.forceX())
        .force("y", d3.forceY());
    },
    // 生成力导向图的线段
    generateLinks(edges, g) {
      // 生成边数据
      this.forceSimulation.force("link").links(edges);

      // 有了节点和边的数据后，我们开始绘制
      // 绘制边
      this.d3.links = g
        .append("g")
        .selectAll("line")
        .data(edges)
        .enter()
        .append("line")
        .attr("stroke-width", 1);
    },
    // 绘制节点
    generateNodes(nodes, g) {
      this.d3.nodes = g
        .selectAll(".circleText")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "nodes")
        .attr("id", d => "node-" + d.id)
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

      this.d3.nodes
        .append("svg:circle")
        .attr("class", "node-bg")
        .attr("r", d => generateR(d))
        .attr("fill", d => generateColor(d))
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .attr("group", d => d.group)
        .attr("name", d => d.id)
        .on("mouseover", this.mouseover)
        .on("mouseout", this.mouseout);
    },
    ticked() {
      this.d3.links
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
      this.d3.nodes.attr("transform", d => `translate(${d.x},${d.y})`);
    },
    // 开始拖动
    started(d) {
      this.d3.dragging = true;
      if (!d3.event.active) {
        this.forceSimulation.alphaTarget(0.3).restart();
      }
      d3.event.subject.fx = d3.event.subject.x;
      d3.event.subject.fy = d3.event.subject.y;
      // d.fx = d.x;
      // d.fy = d.y;
    },
    // 拖动中
    dragged(d) {
      d3.event.subject.fx = d3.event.x;
      d3.event.subject.fy = d3.event.y;
      // d.fx = d3.event.x;
      // d.fy = d3.event.y;
    },
    // 拖动停止
    ended(d) {
      if (!d3.event.active) {
        this.forceSimulation.alphaTarget(0);
      }
      d3.event.subject.fx = d3.event.x;
      d3.event.subject.fy = d3.event.y;
      this.d3.dragging = false;
      // d.fx = null;
      // d.fy = null;
    },
    // 鼠标移入
    mouseover(d) {
      let that = this;
      if (!this.d3.dragging) {
        const id = d.id;
        const svg = d3.select("#container").select("svg");
        // 处理circle, 不相连的circle不显示
        svg
          .selectAll(".nodes")
          .selectAll("circle")
          .attr("class", function(d) {
            // 是目前鼠标悬浮的那个
            if (d.id === id) {
              return "";
            }

            // 不是悬浮的那个，需要显示相邻的circle，对其他的圆圈做处理
            // 遍历图中的所有link
            for (let i = 0; i < that.d3.linkData.length; i++) {
              if (
                that.d3.linkData[i]["source"].id === id &&
                that.d3.linkData[i]["target"].id === d.id
              ) {
                return "";
              }
              if (
                that.d3.linkData[i]["target"].id === id &&
                that.d3.linkData[i]["source"].id === d.id
              ) {
                return "";
              }
            }

            return "inactive";
          });
        // 处理连接line, 不相连的line不显示
        svg.selectAll("line").attr("class", function(data) {
          if (data.source.id === id || data.target.id === id) {
            return "active";
          } else {
            return "inactive";
          }
        });
      }
      //添加提示框的div
      let tooltip = d3.select(".tooltip");
      // console.log(d);
      let htmlStr = "";
      // 关键字段样式
      let classStr =
        "<span style='color: #838098;font-size: 16px;font-weight: 500;'>";
      // 字段类型样式
      let spanClass = "<span style='font-weight: 500;margin-right:5px;'>";
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
        tooltip.html(htmlStr).style("opacity", 1.0);
      }
      if (d.group === "Date") {
        htmlStr +=
          spanClass +
          "日期：</span>" +
          classStr +
          d.properties.date +
          "</span>";
        tooltip.html(htmlStr).style("opacity", 1.0);
      }
      if (
        d.group === "DiagnosticEventsOC" ||
        d.group === "DiagnosticEventsHC"
      ) {
        htmlStr +=
          "<div style='max-width: 300px;overflow: hidden;white-space: nowrap;" +
          "text-overflow: ellipsis;font-weight: 500;'>参保人ID ：" +
          classStr +
          d.properties.personId +
          "</span>" +
          "</div>";
        htmlStr +=
          spanClass +
          "医院ID：</span>" +
          classStr +
          d.properties.hospitalID +
          "</span><br/>";
        htmlStr +=
          spanClass +
          "单据流水号：</span>" +
          classStr +
          d.properties.documentSerialNumber +
          "</span><br/>";
        if (d.group === "DiagnosticEventsOC") {
          htmlStr +=
            spanClass +
            "门诊流水号：</span>" +
            classStr +
            d.properties.serialNumber +
            "</span><br/>";
        } else {
          htmlStr +=
            spanClass +
            "住院流水号：</span>" +
            classStr +
            d.properties.serialNumber +
            "</span><br/>";
        }
        htmlStr +=
          spanClass +
          "费用日期：</span>" +
          classStr +
          d.properties.date +
          "</span><br/>";
        tooltip.html(htmlStr).style("opacity", 1.0);
      }
    },
    // 鼠标离开
    mouseout() {
      if (!this.d3.dragging) {
        const svg = d3.select("#container").select("svg");
        svg.selectAll("text").attr("class", "");
        svg
          .selectAll(".nodes")
          .selectAll("circle")
          .attr("class", "");
        svg
          .selectAll("line")
          .selectAll("line")
          .attr("class", "");
      }
    },
    // 确认选择参保人
    selectConfirm(data) {
      this.common.dialog.showDialog = false;
      for (let i = 0; i < data.length; i++) {
        let temp = data[i];
        if (this.searchParam.personList.indexOf(temp.column)) {
          this.searchParam.personList.push(temp.column);
        }
      }
    },
    // 删除参保人
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
  #container {
    background-color: #272b30;
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
}
</style>
<style>
.svg-container {
  display: inline-block;
  position: relative;
  width: 100%;
  padding-bottom: 70%; /* aspect ratio */
  vertical-align: top;
  overflow: hidden;
}
.svg-content-responsive {
  display: inline-block;
  position: absolute;
  top: 10px;
  left: 0;
}
line {
  stroke: rgb(240, 240, 240); /*线的颜色*/
  stroke-opacity: 0.4; /*线的透明度*/
}
line.inactive {
  /*display: none !important;*/
  stroke-opacity: 0.1;
}
line.active {
  /*display: none !important;*/
  stroke-opacity: 1;
  stroke: yellow;
}
.nodes circle {
  stroke: #fff;
  stroke-width: 1.5px; /*圆的描边宽度*/
}
.nodes circle:hover {
  cursor: pointer;
}
.nodes circle.inactive {
  /*display: none !important;*/
  fill-opacity: 0.2;
  stroke-width: 0;
}
</style>
