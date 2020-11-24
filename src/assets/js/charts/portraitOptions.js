import { formatDate, calculate } from "../util/common";
function setPortraitMonthlyOption(chartData) {
  let month = [];
  let individualPay = [];
  let totalCost = [];
  let medicarePay = [];
  let title = {};
  chartData.map(item => {
    month.push(formatDate(item.month));
    individualPay.push(item.individualPay);
    totalCost.push(item.totalCost);
    medicarePay.push(item.medicarePay);
  });
  let Option = {
    title: title,
    toolbox: {
      //可视化的工具箱
      show: true,
      right: "5%",
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
      data: month,
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
function setProportionOfMedicalOption(chartData) {
  let totalCost = 0;
  let medicarePay = 0;
  let individualPay = 0;
  chartData.map(item => {
    totalCost = calculate.Add(totalCost, item.totalCost);
    medicarePay = calculate.Add(medicarePay, item.medicarePay);
    individualPay = calculate.Add(individualPay, item.individualPay);
  });
  let color = ["#61C378", "#7367F0"];

  let option = {
    color: color,
    title: {
      text: "{name|医疗总费用}\n{val|" + totalCost + "}",
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
            fontSize: 24,
            fontWeight: "bold",
            color: "#D95E5A"
          }
        }
      }
    },
    toolbox: {
      //可视化的工具箱
      show: true,
      right: "2%",
      top: "2%",
      feature: {
        restore: {
          //重置
          show: true
        },
        saveAsImage: {
          //保存图片
          show: true
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
    legend: {
      type: "scroll",
      orient: "vertical",
      left: "2%",
      align: "auto",
      top: "middle",
      data: ["医保支付", "个人支付"]
    },
    series: [
      {
        type: "pie",
        radius: ["50%", "75%"],
        center: ["50%", "50%"],
        data: [
          {
            name: "医保支付",
            value: medicarePay
          },
          {
            name: "个人支付",
            value: individualPay
          }
        ],
        // hoverAnimation: false,
        itemStyle: {
          normal: {
            borderColor: "#fff",
            borderWidth: 2
          }
        },
        labelLine: {
          normal: {
            length: 10,
            length2: 160,
            lineStyle: {
              color: "#e6e6e6"
            }
          }
        },
        label: {
          normal: {
            formatter: params => {
              return (
                "{icon|●}{name|" +
                params.name +
                "}{value|" +
                (params.value / 10000).toFixed(2) +
                "万元}"
              );
            },
            padding: [0, -170, 25, -180],
            rich: {
              icon: {
                fontSize: 16
              },
              name: {
                fontSize: 14,
                padding: [0, 10, 0, 4],
                color: "#666666"
              },
              value: {
                fontSize: 18,
                fontWeight: "bold",
                color: "#333333"
              }
            }
          }
        }
      }
    ]
  };
  return option;
}
function setPortraitRingChartOption(chartData, month) {
  let OC = { individualPay: 0, totalCost: 0, medicarePay: 0 };
  let HC = { individualPay: 0, totalCost: 0, medicarePay: 0 };
  chartData.OC.map(item => {
    OC.totalCost = calculate.Add(OC.totalCost, item.totalCost);
    OC.medicarePay = calculate.Add(OC.medicarePay, item.medicarePay);
    OC.individualPay = calculate.Add(OC.individualPay, item.individualPay);
  });
  chartData.HC.map(item => {
    HC.totalCost = calculate.Add(HC.totalCost, item.totalCost);
    HC.medicarePay = calculate.Add(HC.medicarePay, item.medicarePay);
    HC.individualPay = calculate.Add(HC.individualPay, item.individualPay);
  });
  let echartData = {
    inner: [
      {
        value: OC.totalCost,
        unit: "元",
        name: "门诊收费"
      },
      {
        value: HC.totalCost,
        unit: "元",
        name: "住院收费"
      }
    ],
    outer: [
      {
        value: OC.individualPay,
        unit: "元",
        name: "门诊个人支付"
      },
      {
        value: HC.individualPay,
        unit: "元",
        name: "医院个人支付"
      },
      {
        value: OC.medicarePay,
        unit: "元",
        name: "门诊医保支付"
      },
      {
        value: HC.medicarePay,
        unit: "元",
        name: "医院医保支付"
      }
    ]
  };
  let option = {
    // title: {
    //   text: month + "占比情况",
    //   bottom: "1%",
    //   x: "center"
    // },
    toolbox: {
      //可视化的工具箱
      show: true,
      right: "2%",
      top: "2%",
      feature: {
        restore: {
          //重置
          show: true
        },
        saveAsImage: {
          //保存图片
          show: true
        }
      }
    },
    legend: {
      type: "scroll",
      // orient: "vertical",
      left: "center",
      align: "auto",
      top: "bottom",
      data: [
        "门诊收费",
        "住院收费",
        "门诊个人支付",
        "门诊医保支付",
        "医院个人支付",
        "医院医保支付"
      ]
    },
    color: ["#00b8a9", "#ff5722", "#f6416c", "#ffde7d", "#a2d5f2", "#f67280"],
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
        name: "费用情况",
        type: "pie",
        radius: [0, "40%"],
        itemStyle: {
          normal: {
            borderColor: "#fff",
            borderWidth: 2
          }
        },
        label: {
          normal: {
            position: "inner"
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data: echartData.inner
      },
      {
        name: "费用情况",
        type: "pie",
        radius: ["55%", "70%"],
        avoidLabelOverlap: true,
        data: echartData.outer,
        labelLine: {
          normal: {
            length: 20,
            length2: 140,
            lineStyle: {
              color: "#e6e6e6"
            }
          }
        },
        label: {
          normal: {
            formatter: params => {
              return (
                "{icon|●}{name|" +
                params.name +
                " " +
                "}{percent|" +
                params.percent.toFixed(1) +
                "%}{value|" +
                "}"
              );
            },
            padding: [0, -150, 25, -150],
            rich: {
              color: "#333",
              icon: {
                fontSize: 16
              },
              name: {
                fontSize: 14,
                padding: [0, 5, 0, 5],
                color: "#666666"
              },
              percent: {
                color: "#333",
                padding: [0, 5, 0, 0],
                fontSize: 16,
                fontWeight: "bold",
                color: "#333333"
              }
            }
          }
        }
      }
    ]
  };
  return option;
}
export {
  setPortraitMonthlyOption,
  setProportionOfMedicalOption,
  setPortraitRingChartOption
};
