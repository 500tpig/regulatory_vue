import { accAdd } from "../util/common";
function setDepartmentChartOption(chartData) {
  let departments = [];
  let individualPay = [];
  let totalCost = [];
  let medicarePay = [];
  chartData.map(item => {
    departments.push(item.department);
    individualPay.push(item.individualPay);
    totalCost.push(item.totalCost);
    medicarePay.push(item.medicarePay);
  });
  let byTimeOption = {
    title: {
      // text: "ECharts 入门示例"
    },
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
      data: departments,
      axisLabel: {
        interval: 0,
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
  return byTimeOption;
}
function setDepartmentRingOption(chartData, title) {
  // console.log(chartData);
  if (chartData.length === 0) {
    title = "暂无数据";
  }
  let sum = 0;
  let data = [];
  chartData.map(item => {
    let temp = {};
    temp.name = item.department;
    sum = accAdd(item.totalCost, sum);
    temp.value = item.totalCost;
    data.push(temp);
  });
  let colorList = [
    "#0090ff",
    "#06d3c4",
    "#ffbc32",
    "#2ccc44",
    "#ff3976",
    "#6173d6",
    "#914ce5",
    "#42b1cc",
    "#ff55ac",
    "#0090ff",
    "#06d3c4",
    "#ffbc32",
    "#2ccc44",
    "#ff3976",
    "#6173d6",
    "#914ce5",
    "#42b1cc",
    "#ff55ac",
    "#0090ff",
    "#06d3c4",
    "#ffbc32",
    "#2ccc44",
    "#ff3976",
    "#6173d6",
    "#914ce5",
    "#42b1cc",
    "#ff55ac",
    "#0090ff",
    "#06d3c4",
    "#ffbc32",
    "#2ccc44",
    "#ff3976",
    "#6173d6",
    "#914ce5",
    "#42b1cc",
    "#ff55ac",
    "#0090ff",
    "#06d3c4",
    "#ffbc32",
    "#2ccc44",
    "#ff3976",
    "#6173d6",
    "#914ce5",
    "#42b1cc",
    "#ff55ac",
    "#0090ff",
    "#06d3c4",
    "#ffbc32",
    "#2ccc44",
    "#ff3976",
    "#6173d6",
    "#914ce5",
    "#42b1cc",
    "#ff55ac",
    "#0090ff",
    "#06d3c4",
    "#ffbc32",
    "#2ccc44",
    "#ff3976",
    "#6173d6",
    "#914ce5",
    "#42b1cc",
    "#ff55ac",
    "#0090ff",
    "#06d3c4",
    "#ffbc32",
    "#2ccc44",
    "#ff3976",
    "#6173d6",
    "#914ce5",
    "#42b1cc",
    "#ff55ac",
    "#0090ff",
    "#06d3c4",
    "#ffbc32",
    "#2ccc44",
    "#ff3976",
    "#6173d6",
    "#914ce5",
    "#42b1cc",
    "#ff55ac",
    "#0090ff",
    "#06d3c4",
    "#ffbc32",
    "#2ccc44",
    "#ff3976",
    "#6173d6",
    "#914ce5",
    "#42b1cc",
    "#ff55ac",
    "#0090ff",
    "#06d3c4",
    "#ffbc32",
    "#2ccc44",
    "#ff3976",
    "#6173d6",
    "#914ce5",
    "#42b1cc",
    "#ff55ac"
  ];
  let option = {
    title: {
      text: "{name|" + title + "}\n{val|" + sum + "}",
      top: "center",
      left: "center",
      textStyle: {
        rich: {
          name: {
            fontSize: 16,
            fontWeight: "normal",
            color: "#666666",
            padding: [10, 0]
          },
          val: {
            fontSize: 20,
            fontWeight: "bold",
            color: "#D95E5A"
          }
        }
      }
    },
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
          "元</br>" +
          "占比：" +
          parms.percent +
          "%";
        return str;
      }
    },
    series: [
      {
        type: "pie",
        center: ["50%", "50%"],
        radius: ["40%", "70%"],
        clockwise: true,
        avoidLabelOverlap: true,
        hoverOffset: 15,
        itemStyle: {
          normal: {
            color: function(params) {
              return colorList[params.dataIndex];
            }
          }
        },
        label: {
          show: true,
          position: "outside",
          formatter: "{a|{b}：{d}%}\n{hr|}",
          rich: {
            hr: {
              backgroundColor: "t",
              borderRadius: 3,
              width: 3,
              height: 3,
              padding: [3, 3, 0, -12]
            },
            a: {
              padding: [-30, 15, -20, 5]
            }
          }
        },
        labelLine: {
          normal: {
            length: 15,
            length2: 20,
            lineStyle: {
              width: 1
            }
          }
        },
        data: data
      }
    ]
  };
  return option;
}
export { setDepartmentChartOption, setDepartmentRingOption };
