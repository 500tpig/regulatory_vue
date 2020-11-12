import { accAdd, accDiv, formatDate } from "../util/common";
function setDiseaseChartOption(chartData, isDrillDown) {
  let diseases = [];
  let individualPay = [];
  let totalCost = [];
  let medicarePay = [];
  let title = {};
  if (isDrillDown) {
    title = {
      text: chartData[0].disease + "费用详情",
      left: "3%",
      top: "1%"
    };
  }
  chartData.map(item => {
    if (isDrillDown) {
      diseases.push(item.chargingTime);
    } else {
      diseases.push(item.disease);
    }
    individualPay.push(item.individualPay);
    totalCost.push(item.totalCost);
    medicarePay.push(item.medicarePay);
  });
  let Option = {
    title: title,
    toolbox: {
      //可视化的工具箱
      show: true,
      right: "15%",
      top: "2%",
      feature: {
        dataView: {
          //数据视图
          show: true,
          readOnly: true,
          optionToContent: function(opt) {
            let axisData = opt.xAxis[0].data;
            let series = opt.series;
            let tdHeaders = "<td>日期</td>"; //表头
            series.forEach(function(item) {
              tdHeaders += "<td>" + item.name + "</td>"; //组装表头
            });
            let table =
              '<div class="table-responsive"><table class="table table-bordered table-striped table-hover" style="text-align:center;color:#222831;"><tbody><tr>' +
              tdHeaders +
              "</tr>";
            let tdBodys = ""; //数据
            for (let i = 0, l = axisData.length; i < l; i++) {
              for (let j = 0; j < series.length; j++) {
                tdBodys += "<td>" + series[j].data[i] + "元</td>"; //组装表数据
              }
              table +=
                '<tr><td style="padding: 0 10px">' +
                axisData[i] +
                "</td>" +
                tdBodys +
                "</tr>";
              tdBodys = "";
            }

            table += "</tbody></table></div>";
            return table;
          }
        },
        restore: {
          //重置
          show: true
        },
        saveAsImage: {
          //保存图片
          show: true
        },
        magicType: {
          //动态类型切换
          type: ["bar", "line"]
        }
      }
    },
    tooltip: {
      trigger: "axis",
      formatter: {
        _custom: {
          type: "function",
          display: "<span>ƒ</span> (params)"
        }
      },
      backgroundColor: "#fff",
      textStyle: {
        color: "#5c6c7c"
      },
      padding: [20, 20],
      extraCssText: "box-shadow: 1px 0 2px 0 rgba(163,163,163,0.5)"
    },
    grid: {
      top: "10%",
      bottom: "18%"
      // x: 40,
      // y: 40,
      // x2: 40,
      // y2: 20
    },
    dataZoom: [
      {
        show: true,
        start: 0,
        end: 100,
        handleSize: "100%",
        bottom: "4%",
        // left: "14%",
        // right: "30%",
        handleIcon: "M0,0 v9.7h5 v-9.7h-5 Z",
        handleStyle: {
          /*手柄的样式*/
          color: "#40bcf9",
          borderColor: "#1fb2fb"
        },
        backgroundColor: "#e2f3ff" /*背景 */,
        dataBackground: {
          /*数据背景*/
          lineStyle: {
            color: "#ff2e63",
            width: 2
          },
          areaStyle: {
            color: "#d4d9dd"
          }
        },
        fillerColor: "rgba(31,178,251,0.2)" /*被start和end遮住的背景*/
      },
      {
        show: true,
        type: "inside",
        start: 0,
        end: 100
      },
      {
        handleIcon: "M0,0 v9.7h5 v-9.7h-5 Z",
        handleStyle: {
          /*手柄的样式*/
          color: "#40bcf9",
          borderColor: "#1fb2fb"
        },
        backgroundColor: "#e2f3ff" /*背景 */,
        dataBackground: {
          /*数据背景*/
          lineStyle: {
            color: "#000000"
          },
          areaStyle: {
            color: "#d4d9dd"
          }
        },
        fillerColor: "rgba(31,178,251,0.2)" /*被start和end遮住的背景*/,
        show: true,
        yAxisIndex: 0,
        filterMode: "empty",
        width: 20,
        height: "70%",
        showDataShadow: false,
        right: "4%",
        top: "13%"
      }
    ],
    legend: {
      data: ["个人支付", "医保支付", "医疗总费用"],
      x: "center",
      top: 10
    },
    xAxis: {
      type: "category",
      data: diseases,
      axisLabel: {
        // interval: 0,
        rotate: 30
      }
    },
    yAxis: [
      {
        name: "金额",
        type: "value",
        axisLabel: {
          formatter: function(value, index) {
            if (value > 100000000)
              return (value / 100000000).toFixed(2) + "亿元";
            else if (value > 10000) return value / 10000 + "万元";
            return value.toFixed(2) + "元";
          }
        }
      }
    ],
    series: [
      {
        name: "医保支付",
        type: "bar",
        stack: "one",
        barMaxWidth: 40,
        data: medicarePay,
        itemStyle: {
          normal: {
            color: "#61C378"
          }
        }
      },
      {
        name: "个人支付",
        type: "bar",
        data: individualPay,
        barMaxWidth: 40,
        stack: "one",
        itemStyle: {
          normal: {
            color: "#7367F0",
            barBorderRadius: [30, 30, 0, 0]
          }
        }
      },
      {
        name: "医疗总费用",
        type: "line",
        symbolSize: 1,
        symbol: "circle",
        barMaxWidth: 40,
        itemStyle: {
          normal: {
            color: "#D95E5A",
            barBorderRadius: 0
          }
        },
        lineStyle: {
          normal: {
            width: 4,
            itemStyle: {
              normal: {
                color: "#D95E5A"
              }
            }
          }
        },
        data: totalCost
      }
    ]
  };
  return Option;
}
function setDiseasePointChartOption(chartData, type, searchParam) {
  let title = "";
  title +=
    formatDate(searchParam.chargingTime[0]) +
    "至" +
    formatDate(searchParam.chargingTime[1]);
  if (!searchParam.showAllDis) title += " 部分疾病";
  else title += " 疾病";
  if (type === "totalCost") {
    title += "总医疗费用";
  } else if (type === "individualPay") {
    title += "个人支付费用";
  } else {
    title += "医保支付费用";
  }
  let colorList = [
    [
      "#ff7f50",
      "#87cefa",
      "#da70d6",
      "#32cd32",
      "#6495ed",
      "#ff69b4",
      "#ba55d3",
      "#cd5c5c",
      "#ffa500",
      "#40e0d0",
      "#1e90ff",
      "#ff6347",
      "#7b68ee",
      "#d0648a",
      "#ffd700",
      "#6b8e23",
      "#4ea397",
      "#3cb371",
      "#b8860b",
      "#7bd9a5"
    ],
    [
      "#ff7f50",
      "#87cefa",
      "#da70d6",
      "#32cd32",
      "#6495ed",
      "#ff69b4",
      "#ba55d3",
      "#cd5c5c",
      "#ffa500",
      "#40e0d0",
      "#1e90ff",
      "#ff6347",
      "#7b68ee",
      "#00fa9a",
      "#ffd700",
      "#6b8e23",
      "#ff00ff",
      "#3cb371",
      "#b8860b",
      "#30e0e0"
    ],
    [
      "#929fff",
      "#9de0ff",
      "#ffa897",
      "#af87fe",
      "#7dc3fe",
      "#bb60b2",
      "#433e7c",
      "#f47a75",
      "#009db2",
      "#024b51",
      "#0780cf",
      "#765005",
      "#e75840",
      "#26ccd8",
      "#3685fe",
      "#9977ef",
      "#f5616f",
      "#f7b13f",
      "#f9e264",
      "#50c48f"
    ]
  ][2];

  let total = 0;
  let data = [];
  let count = 0;
  chartData.map(item => {
    if (count > 19) {
      count = 0;
    }
    total = accAdd(item[type], total);
    // if (parseFloat(item[type]) > parseFloat(max)) {
    //   max = item[type];
    // }
    let temp = {};
    temp.name = item.disease;
    temp.value = item[type];
    temp.draggable = true;
    temp.itemStyle = {
      normal: {
        shadowBlur: 100,
        shadowColor: colorList[count],
        color: colorList[count]
      }
    };
    data.push(temp);
    count++;
  });
  data.map(item => {
    item.symbolSize = accDiv(item.value, total) * 1000;
    if (item.symbolSize <= 10) item.symbolSize = 30;
    else if (item.symbolSize >= 10 && item.symbolSize <= 20)
      item.symbolSize = 40;
  });
  console.log(data);
  let option = {
    // 图表标题
    title: {
      show: true, //显示策略，默认值true,可选为：true（显示） | false（隐藏）
      text: title, //主标题文本，'\n'指定换行
      x: "center", // 水平安放位置，默认为左对齐，可选为：
      // 'center' ¦ 'left' ¦ 'right'
      // ¦ {number}（x坐标，单位px）
      y: "bottom", // 垂直安放位置，默认为全图顶端，可选为：
      // 'top' ¦ 'bottom' ¦ 'center'
      // ¦ {number}（y坐标，单位px）
      //textAlign: null          // 水平对齐方式，默认根据x设置自动调整
      backgroundColor: "rgba(0,0,0,0)",
      borderColor: "#ccc", // 标题边框颜色
      borderWidth: 0, // 标题边框线宽，单位px，默认为0（无边框）
      padding: 5, // 标题内边距，单位px，默认各方向内边距为5，
      // 接受数组分别设定上右下左边距，同css
      itemGap: 10, // 主副标题纵向间隔，单位px，默认为10，
      textStyle: {
        fontSize: 18,
        fontWeight: "bolder",
        color: "#333" // 主标题文字颜色
      },
      subtextStyle: {
        color: "#aaa" // 副标题文字颜色
      }
    },
    backgroundColor: "#fff",
    tooltip: {
      trigger: "item",
      borderColor: "rgba(255,255,255,.3)",
      backgroundColor: "rgba(13,5,30,.6)",
      borderWidth: 1,
      padding: 5,
      formatter: function(parms) {
        var str =
          parms.marker +
          "" +
          parms.data.name +
          "</br>" +
          "金额：" +
          parms.data.value +
          "元</br>";
        return str;
      }
    },
    animationDurationUpdate: function(idx) {
      // 越往后的数据延迟越大
      return idx * 100;
    },
    animationEasingUpdate: "bounceIn",
    color: ["#fff", "#fff", "#fff"],
    series: [
      {
        type: "graph",
        layout: "force",
        force: {
          repulsion: 500,
          edgeLength: 10
        },
        roam: true,
        label: {
          normal: {
            show: true
          }
        },
        data: data
      }
    ]
  };
  return option;
}

export { setDiseaseChartOption, setDiseasePointChartOption };
