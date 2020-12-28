<template>
  <q-page class="knowledgeGraph">
    <page-base-scroll content_class="q-pt-md q-px-md">
      <div class="row ">
        <!-- 就医轨迹卡 -->
        <q-card class="col-8 q-mr-md" id="container" ref="containerRef">
          <div class="svg-container"></div>
        </q-card>
        <!-- 设置卡 -->
        <q-card class="col q-pt-md q-pb-sm">
          <q-scroll-area style="height: 900px;">
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
                    <!-- <div class="row items-center q-pl-md">
                    <span class="q-mr-lg text-weight-medium">类型:</span>
                    <q-option-group
                      v-model="searchParam.type"
                      :options="common.typeOptions"
                      color="primary"
                      style="font-size:14px;"
                      inline
                      class="text-weight-medium subText"
                    />
                  </div> -->
                    <div class="row items-center q-pl-md q-mt-sm">
                      <span class="q-mr-md text-weight-medium col-5"
                        >是否展示节点提示框:</span
                      >
                      <q-toggle
                        v-model="d3.isShowTooltip"
                        checked-icon="check"
                        color="green"
                        @input="isShowTooltip"
                        unchecked-icon="clear"
                      />
                    </div>
                    <!-- 日期 -->
                    <div class="row items-center q-pl-md q-mt-sm">
                      <span class="q-mr-md text-weight-medium col-3"
                        >日期选择:</span
                      >
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
                      <span class="q-mr-md text-weight-medium col-3"
                        >参保人选择:</span
                      >
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
                              <span class="q-mr-md text-weight-medium"
                                >参保人{{ index + 1 }}:</span
                              >
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
                    <div class="row justify-center">
                      <q-toggle
                        v-for="(value, key, index) in d3.showNode"
                        :key="index"
                        v-model="value.value"
                        :color="value.color"
                        :icon="value.icon"
                        size="lg"
                        :label="value.label"
                        class="col-5"
                        @input="switchShow(key)"
                      />
                    </div>
                  </q-expansion-item>
                  <!-- 搜索节点 -->
                  <q-expansion-item
                    popup
                    default-opened
                    icon="icon-sousuo"
                    label="搜索"
                  >
                    <q-separator />
                    <div class="row q-pa-md items-center">
                      <span class="q-mr-lg text-weight-medium">搜索节点:</span>
                      <q-input
                        outlined
                        v-model="d3.search"
                        @input="searchNode"
                        clearable
                        dense
                      >
                        <template v-slot:append>
                          <q-icon name="search" />
                        </template>
                      </q-input>
                    </div>
                  </q-expansion-item>
                  <!-- 节点信息 -->
                  <q-expansion-item
                    popup
                    default-opened
                    icon="icon-xinxi1"
                    label="节点信息"
                  >
                    <q-separator />
                    <div class="q-py-sm q-px-md">
                      <div
                        v-for="(item, index) in d3.tooltipData"
                        :key="index"
                        class="row q-my-xs"
                      >
                        <div class="col-3 text-weight-medium">
                          {{ item.label }}:
                        </div>
                        <div class="col hideText subText">
                          {{ item.value }}
                          <q-tooltip
                            v-if="item.label === '参保人ID'"
                            content-class="bg-white text-black shadow-4 text-weight-medium"
                            content-style="font-size: 13px"
                            :offset="[10, 10]"
                          >
                            {{ item.value }}
                          </q-tooltip>
                        </div>
                      </div>
                    </div>
                  </q-expansion-item>
                </q-list>
              </div>
            </div>
          </q-scroll-area>
        </q-card>
      </div>
    </page-base-scroll>
    <!-- 选择参保人 -->
    <q-dialog v-model="common.dialog.showDialog"
      ><specificTable
        @selectConfirm="selectConfirm"
        url="/person/getPersonList"
        :searchParam="searchParam"
        :columns="common.dialog.columns"
        title="参保人"
        selection="multiple"
    /></q-dialog>
  </q-page>
</template>
<script>
/* eslint-disable  no-param-reassign */
import * as d3 from "d3";
import pageBaseScroll from "components/utils/PageScroll";
import { pickerOptions, shallowCopyObj } from "assets/js/util/common";
import specificTable from "components/utils/specificTable";
import {
  generateR,
  generateColor,
  generateTooltip
} from "assets/js/util/knowledgeGraph";
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
        linkData: [],
        sourceNodeList: [],
        sourceLinkList: [],
        tooltipData: [],
        showNode: {
          Person: {
            label: "参保人",
            value: true,
            icon: "icon-user",
            color: "primary"
          },
          DiagnosticEventsOC: {
            label: "门诊就诊",
            value: true,
            icon: "icon-menzhen",
            color: "OC"
          },
          DiagnosticEventsHC: {
            label: "住院就诊",
            value: true,
            icon: "icon-yiyuan",
            color: "HC"
          },
          Date: {
            label: "日期",
            value: true,
            icon: "icon-rili",
            color: "Date"
          },
          knowledgeGraphDrug: {
            label: "药品",
            value: true,
            icon: "icon-menzhenyaofei",
            color: "knowledgeGraphDrug"
          },
          knowledgeGraphMoney: {
            label: "费用详情",
            value: true,
            icon: "icon-feiyong",
            color: "knowledgeGraphMoney"
          }
        },
        search: "",
        isShowTooltip: true
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
          Date: require("src/assets/image/knowledgeGraph/Date.png"),
          knowledgeGraphMoney: require("src/assets/image/knowledgeGraph/knowledgeGraphMoney.png"),
          knowledgeGraphDrug: require("src/assets/image/knowledgeGraph/knowledgeGraphDrug.png")
        }
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
      let graphData = [];
      await this.$http
        .post("/knowledgeGraph/query", param)
        .then(res => {
          if (res.status === 200) {
            graphData = res.data.data;
          }
        })
        .catch(e => {});
      this.d3.nodeData = graphData.nodes.slice();
      this.d3.linkData = graphData.edges.slice();

      this.graphInit(graphData);
    },
    graphInit(graphData) {
      this.d3.tooltipData = [];
      // 获取容器宽高
      let containerWidth = this.$refs.containerRef.$el.offsetWidth;
      let containerHeight = this.$refs.containerRef.$el.offsetHeight;

      let nodes = graphData.nodes;
      let links = graphData.edges;

      const svg = this.setVis(containerWidth, containerHeight);
      this.setForce(containerWidth, containerHeight);

      this.forceSimulation.alphaTarget(0.1);
      this.forceSimulation.restart();

      const g = d3.select("g");

      this.forceSimulation.nodes(nodes).on("tick", this.ticked);
      // 绘制连线
      this.generateLinks(links, g);
      // 绘制节点
      this.generateNodes(nodes, g);
    },
    // 创建svg视图
    setVis(containerWidth, containerHeight) {
      this.removeSVG();
      let tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0.0);

      // 加500的原因是修复全屏模式画布大小不够的问题
      let svg_width = window.screen.width;
      let svg_height = window.screen.height;

      let svg = d3
        .select("#container")
        .append("svg:svg")
        .attr("id", "J_SvgView")
        // Responsive SVG needs these 2 attributes and no width and height attr.
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("viewBox", "0 0 1000 1000")
        // Class to make it responsive.
        .classed("svg-content-responsive", true)
        .attr("width", containerWidth)
        .attr("height", containerHeight)
        .call(
          d3
            .zoom()
            .scaleExtent([0.01, 10])
            .on("zoom", () => {
              g.attr("transform", d3.event.transform);
            })
        )
        .on("dblclick.zoom", null);

      const g = svg
        .append("g")
        .attr("class", "all")
        .attr("data-width", 1000)
        .attr("data-height", 1000);

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

      defs
        .append("pattern")
        .attr("id", "knowledgeGraphDrug")
        .attr("patternContentUnits", "objectBoundingBox")
        .attr("width", "100%")
        .attr("height", "100%")
        .append("image")
        .attr("width", "1")
        .attr("height", "1")
        .attr("xlink:href", this.common.image.knowledgeGraphDrug);

      defs
        .append("pattern")
        .attr("id", "knowledgeGraphMoney")
        .attr("patternContentUnits", "objectBoundingBox")
        .attr("width", "100%")
        .attr("height", "100%")
        .append("image")
        .attr("width", "1")
        .attr("height", "1")
        .attr("xlink:href", this.common.image.knowledgeGraphMoney);

      return svg;
    },
    // 清空svg
    removeSVG() {
      d3.selectAll("svg > *").remove();
      d3.select("#J_SvgView").remove();
      d3.select(".tooltip").remove();
    },
    // 力导向图布局
    // https://blog.csdn.net/weixin_34236869/article/details/91432941
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
      let tooltip = d3.select(".tooltip");
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
        .on("mousemove", function(d) {
          /* 鼠标移动时，更改样式 left 和 top 来改变提示框的位置 */

          tooltip
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY + 20 + "px");
        })
        .on("mouseout", this.mouseout)
        .on("dblclick", this.dbclickHandler);
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

        //添加提示框的div
        let tooltip = d3.select(".tooltip");
        let htmlStr = "";
        for (let key in d.properties) {
          htmlStr += key + " : ";
          htmlStr += d.properties[key] + "<br/>";
        }
        tooltip
          .html(htmlStr)
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY + 20 + "px")
          .style("opacity", 1.0);

        this.d3.tooltipData = generateTooltip(d);
      }
    },
    // 鼠标离开
    mouseout() {
      if (!this.d3.dragging && this.d3.search == "") {
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
        let tooltip = d3.select(".tooltip");
        tooltip.style("opacity", 0.0);
      }
    },
    // 双击实现
    async dbclickHandler(that) {
      let id = that.id;
      let node = this.d3.nodeData.find(v => v.id === id);
      //如果节点未展开

      if (!node.isExpand) {
        node.isExpand = true;
        if (
          node.group === "DiagnosticEventsOC" ||
          node.group === "DiagnosticEventsHC"
        ) {
          let param = {
            type: node.group.substring(
              node.group.length - 2,
              node.group.length
            ),
            documentSerialNumber: node.properties.documentSerialNumber,
            target: id
          };
          let result = [];
          await this.$http
            .post("/knowledgeGraph/getKnowledgeGraphDrugMoney", param)
            .then(res => {
              if (res.status === 200) {
                result = res.data.data;
              }
            })
            .catch(e => {});
          let that = this;
          let nodeData = [];
          result.nodes.map(item => {
            that.d3.nodeData.push(item);
          });
          result.edges.map(item => {
            that.d3.linkData.push(item);
          });
          this.graphInit({
            nodes: that.d3.nodeData.slice(),
            edges: that.d3.linkData.slice()
          });
        }
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
    },
    // 显示与隐藏节点
    switchShow(nodeType) {
      if (!this.d3.showNode[nodeType].value) {
        window[`node${nodeType}Show_checked`] = false;

        // 选中所有节点
        const nodes = d3.select("svg").selectAll("circle");
        // 选中所有线段
        const edges = d3.select("svg").selectAll("line");

        const texts = d3.selectAll("text");
        // 用filter筛选出节点属性group为nodeType的节点
        nodes
          .filter(d => d.group === nodeType)
          // 举例：三元表达式，根据nodePatientShow_checked的值设置颜色display为none隐藏
          .style("display", "none")
          // 遍历所有筛选出的节点
          .each(node => {
            // 筛选出线段的sourceId或者targetId为nodeId的线段，即找出有连接之前‘筛选出的节点’的线段
            edges
              .filter(
                link => link.source.id === node.id || link.target.id === node.id
              )
              // 设置线段隐藏
              .style("display", "none");
          });
      } else {
        // 举例：比如输入的参数nodeType为'Patient'，实际情况可以是'Patient','DiagnosisEvent','Date','Hospital'等
        // 举例：下面这句就会变为window[`nodePatientShow_checked`] = !window[`nodePatientShow_checked`]
        // 举例：就变成把全局作用域下的nodePatientShow_checked变量赋予相反值
        window[`node${nodeType}Show_checked`] = !window[
          `node${nodeType}Show_checked`
        ];
        // 选中所有节点
        const nodes = d3.select("svg").selectAll("circle");
        // 选中所有线段
        const edges = d3.select("svg").selectAll("line");

        const texts = d3.selectAll("text");
        // 用filter筛选出节点属性group为nodeType的节点
        nodes
          .filter(d => d.group === nodeType)
          // 举例：三元表达式，根据nodePatientShow_checked的值设置颜色display为block显示或none隐藏
          .style(
            "display",
            window[`node${nodeType}Show_checked`] ? "block" : "none"
          )
          // 遍历所有筛选出的节点
          .each(node => {
            // 筛选出线段的sourceId或者targetId为nodeId的线段，即找出有连接之前‘筛选出的节点’的线段
            edges
              .filter(
                link => link.source.id === node.id || link.target.id === node.id
              )
              // 设置线段显示或者隐藏
              .style(
                "display",
                window[`node${nodeType}Show_checked`] ? "block" : "none"
              );
          });
      }
    },
    searchNode(node) {
      // 如果输入为空，全部显示出来
      const svg = d3.select("#container").select("svg");

      if (node === "") {
        svg.selectAll("text").attr("class", "");
        svg
          .selectAll(".nodes")
          .selectAll("circle")
          .attr("class", "");
        svg.selectAll("line").attr("class", "");
      } else {
        // 筛选，判断这三个东西里的元素是否包含输入的东西
        //筛选然后设置class，样式在/knowledgeGraph/css/medicalTrack.css
        svg
          .selectAll(".nodes")
          .selectAll("circle")
          .attr("class", function(d) {
            let isContain = false;
            for (let key in d.properties) {
              let item = d.properties[key];
              if (d.properties[key].indexOf(node) != -1) {
                isContain = true;
                break;
              }
            }
            if (isContain) {
              return "";
            } else {
              return "inactive";
            }
            // if (d.properties.AAC001 !== null && (d.properties.AAC001 + '').indexOf(name.toLowerCase()) >= 0) {
            //     return '';
            // } else if (d.properties.aac001 !== null && (d.properties.aac001 + '').indexOf(name.toLowerCase()) >= 0) {
            //     return '';
            // } else if (d.properties.date !== null && (d.properties.date + '').indexOf(name.toLowerCase()) >= 0) {
            //     return '';
            // } else if (d.properties.AAC003 !== null && (d.properties.AAC003 + '').indexOf(name.toLowerCase()) >= 0) {
            //     return '';
            // } else if (d.properties.AAZ107 !== null && (d.properties.AAZ107 + '').indexOf(name.toLowerCase()) >= 0) {
            //     return '';
            // } else {
            //     return 'inactive';
            // }
          });
        svg.selectAll("line").attr("class", "inactive");
        // d3.select("#svg1 .linetexts").selectAll('text').attr('fill-opacity', 0);
      }
    },
    isShowTooltip(bool) {
      if (bool) {
        let tooltip = d3
          .select("body")
          .append("div")
          .attr("class", "tooltip")
          .style("opacity", 0.0);
      } else {
        d3.select(".tooltip").remove();
      }
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
/* d3有些样式不能写在scoped里 */
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
.tooltip {
  position: absolute;
  width: auto;
  height: auto;
  font-family: simsun;
  font-size: 14px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  background-color: white;
  border-radius: 5px;
  padding: 10px;
}
</style>
