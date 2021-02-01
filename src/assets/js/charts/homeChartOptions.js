import echarts from "echarts";
import { calculate } from "../util/common";
function fourRingOption(optionData) {
  let data = optionData[0];
  let option = {
    tooltip: {
      trigger: "item",
      borderColor: "rgba(255,255,255,.3)",
      backgroundColor: "rgba(13,5,30,.6)",
      borderWidth: 1,
      padding: 5,
      formatter: function(parms) {
        let str = "";
        if (parms.data.name === "个人支付") {
          str +=
            parms.data.name +
            "</br>" +
            "金额：" +
            data.individual +
            "元</br>" +
            "占比：" +
            calculate.Mul(calculate.Div(data.individual, data.total), 100, 2) +
            "%";
        }
        if (parms.data.name === "医保支付") {
          str +=
            parms.data.name +
            "</br>" +
            "金额：" +
            data.fundPayment +
            "元</br>" +
            "占比：" +
            calculate.Mul(calculate.Div(data.fundPayment, data.total), 100, 2) +
            "%";
        }
        if (parms.data.name === "医疗费用") {
          str += parms.data.name + "</br>" + "金额：" + data.total + "元</br>";
        }
        if (parms.data.name === "剔除金额") {
          str +=
            parms.data.name +
            "</br>" +
            "金额：" +
            data.excludingAmount +
            "元</br>" +
            "占比：" +
            calculate.Mul(
              calculate.Div(data.excludingAmount, data.total),
              100,
              2
            ) +
            "%";
        }
        return str;
      }
    },
    series: [
      {
        name: "个人支付",
        type: "pie",
        radius: ["40%", "48%"],
        center: ["25%", "30%"],
        startAngle: 225,
        color: [
          new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "#00a2ff"
            },
            {
              offset: 1,
              color: "#70ffac"
            }
          ]),
          "transparent"
        ],
        labelLine: {
          normal: {
            show: false
          }
        },
        label: {
          normal: {
            position: "center"
          }
        },
        data: [
          {
            value: 75,
            name: "个人支付",
            label: {
              normal: {
                formatter: "个人支付",
                textStyle: {
                  color: "#fff",
                  fontSize: 16
                }
              }
            }
          },
          {
            value: 25,
            name: "%",
            label: {
              normal: {
                formatter: "\n\n" + data.individual,
                textStyle: {
                  color: "#007ac6",
                  fontSize: 24,
                  fontWeight: 500
                }
              }
            }
          }
        ]
      },
      {
        name: "医保支付",
        type: "pie",
        radius: ["40%", "48%"],
        center: ["75%", "30%"],
        startAngle: 225,
        color: [
          new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "#FDC830"
            },
            {
              offset: 1,
              color: "#F37335"
            }
          ]),
          "transparent"
        ],
        labelLine: {
          normal: {
            show: false
          }
        },
        label: {
          normal: {
            position: "center"
          }
        },
        data: [
          {
            value: 75,
            name: "医保支付",
            label: {
              normal: {
                formatter: "医保支付",
                textStyle: {
                  color: "#fff",
                  fontSize: 16
                }
              }
            }
          },
          {
            value: 25,
            name: "%",
            label: {
              normal: {
                formatter: "\n\n" + data.fundPayment,
                textStyle: {
                  color: "#FDC830",
                  fontSize: 22,
                  fontWeight: 500
                }
              }
            }
          }
        ]
      },
      {
        name: "医疗费用",
        type: "pie",
        radius: ["40%", "48%"],
        center: ["25%", "75%"],
        startAngle: 225,
        labelLine: {
          normal: {
            show: false
          }
        },
        label: {
          normal: {
            position: "center"
          }
        },
        data: [
          {
            value: 75,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#f125ff"
                  },
                  {
                    offset: 1,
                    color: "#2dcbff"
                  }
                ])
              }
            },
            name: "医疗费用",
            label: {
              normal: {
                formatter: "医疗费用",
                textStyle: {
                  color: "#fff",
                  fontSize: 16
                }
              }
            }
          },
          {
            value: 25,
            name: "%",
            label: {
              normal: {
                formatter: "\n\n" + data.total,
                textStyle: {
                  color: "#f125ff",
                  fontSize: 23,
                  fontWeight: 500
                }
              }
            }
          }
        ]
      },
      {
        name: "剔除金额",
        type: "pie",
        radius: ["40%", "48%"],
        center: ["75%", "75%"],
        startAngle: 225,
        labelLine: {
          normal: {
            show: false
          }
        },
        label: {
          normal: {
            position: "center"
          }
        },
        data: [
          {
            value: 75,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#FF416C"
                  },
                  {
                    offset: 1,
                    color: "#FF4B2B"
                  }
                ])
              }
            },
            name: "剔除金额",
            label: {
              normal: {
                formatter: "剔除金额",
                textStyle: {
                  color: "#fff",
                  fontSize: 16
                }
              }
            }
          },
          {
            value: 25,
            name: "%",
            label: {
              normal: {
                formatter: "\n\n" + data.excludingAmount,
                textStyle: {
                  color: "#FF416C",
                  fontSize: 24,
                  fontWeight: 500
                }
              }
            }
          }
        ]
      }
    ]
  };
  return option;
}
function healthCareAccountedOption(optionData, angles) {
  let angle = angles; //角度，用来做简单的动画效果的
  let data = optionData[0];
  let value = calculate.Mul(
    calculate.Div(data.fundPayment, data.total),
    100,
    2
  );

  let option = {
    // backgroundColor: "#000E1A",
    title: {
      text: "{a|" + value + "}{c|%}",
      x: "center",
      y: "center",
      textStyle: {
        rich: {
          a: {
            fontSize: 22,
            color: "#29EEF3"
          },

          c: {
            fontSize: 16,
            color: "#ffffff"
            // padding: [5,0]
          }
        }
      }
    },

    series: [
      // 紫色
      {
        name: "ring5",
        type: "custom",
        coordinateSystem: "none",
        renderItem: function(params, api) {
          return {
            type: "arc",
            shape: {
              cx: api.getWidth() / 2,
              cy: api.getHeight() / 2,
              r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.7,
              startAngle: ((0 + angle) * Math.PI) / 180,
              endAngle: ((90 + angle) * Math.PI) / 180
            },
            style: {
              stroke: "#8383FA",
              fill: "transparent",
              lineWidth: 1.5
            },
            silent: true
          };
        },
        data: [0]
      },
      {
        name: "ring5", //紫点
        type: "custom",
        coordinateSystem: "none",
        renderItem: function(params, api) {
          let x0 = api.getWidth() / 2;
          let y0 = api.getHeight() / 2;
          let r = (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.7;
          let point = getCirlPoint(x0, y0, r, 90 + angle);
          return {
            type: "circle",
            shape: {
              cx: point.x,
              cy: point.y,
              r: 4
            },
            style: {
              stroke: "#8450F9", //绿
              fill: "#8450F9"
            },
            silent: true
          };
        },
        data: [0]
      },
      // 蓝色

      {
        name: "ring5",
        type: "custom",
        coordinateSystem: "none",
        renderItem: function(params, api) {
          return {
            type: "arc",
            shape: {
              cx: api.getWidth() / 2,
              cy: api.getHeight() / 2,
              r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.7,
              startAngle: ((180 + angle) * Math.PI) / 180,
              endAngle: ((270 + angle) * Math.PI) / 180
            },
            style: {
              stroke: "#4386FA",
              fill: "transparent",
              lineWidth: 1.5
            },
            silent: true
          };
        },
        data: [0]
      },
      {
        name: "ring5", // 蓝色
        type: "custom",
        coordinateSystem: "none",
        renderItem: function(params, api) {
          let x0 = api.getWidth() / 2;
          let y0 = api.getHeight() / 2;
          let r = (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.7;
          let point = getCirlPoint(x0, y0, r, 180 + angle);
          return {
            type: "circle",
            shape: {
              cx: point.x,
              cy: point.y,
              r: 4
            },
            style: {
              stroke: "#4386FA", //绿
              fill: "#4386FA"
            },
            silent: true
          };
        },
        data: [0]
      },

      {
        name: "ring5",
        type: "custom",
        coordinateSystem: "none",
        renderItem: function(params, api) {
          return {
            type: "arc",
            shape: {
              cx: api.getWidth() / 2,
              cy: api.getHeight() / 2,
              r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.75,
              startAngle: ((270 + -angle) * Math.PI) / 180,
              endAngle: ((40 + -angle) * Math.PI) / 180
            },
            style: {
              stroke: "#0CD3DB",
              fill: "transparent",
              lineWidth: 1.5
            },
            silent: true
          };
        },
        data: [0]
      },
      // 橘色

      {
        name: "ring5",
        type: "custom",
        coordinateSystem: "none",
        renderItem: function(params, api) {
          return {
            type: "arc",
            shape: {
              cx: api.getWidth() / 2,
              cy: api.getHeight() / 2,
              r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.75,
              startAngle: ((90 + -angle) * Math.PI) / 180,
              endAngle: ((220 + -angle) * Math.PI) / 180
            },
            style: {
              stroke: "#FF8E89",
              fill: "transparent",
              lineWidth: 1.5
            },
            silent: true
          };
        },
        data: [0]
      },
      {
        name: "ring5",
        type: "custom",
        coordinateSystem: "none",
        renderItem: function(params, api) {
          let x0 = api.getWidth() / 2;
          let y0 = api.getHeight() / 2;
          let r = (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.75;
          let point = getCirlPoint(x0, y0, r, 90 + -angle);
          return {
            type: "circle",
            shape: {
              cx: point.x,
              cy: point.y,
              r: 4
            },
            style: {
              stroke: "#FF8E89", //粉
              fill: "#FF8E89"
            },
            silent: true
          };
        },
        data: [0]
      },
      {
        name: "ring5", //绿点
        type: "custom",
        coordinateSystem: "none",
        renderItem: function(params, api) {
          let x0 = api.getWidth() / 2;
          let y0 = api.getHeight() / 2;
          let r = (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.75;
          let point = getCirlPoint(x0, y0, r, 270 + -angle);
          return {
            type: "circle",
            shape: {
              cx: point.x,
              cy: point.y,
              r: 4
            },
            style: {
              stroke: "#0CD3DB", //绿
              fill: "#0CD3DB"
            },
            silent: true
          };
        },
        data: [0]
      },
      {
        name: "医保支付占比",
        type: "pie",
        radius: ["62%", "50%"],
        silent: true,
        clockwise: true,
        startAngle: 90,
        z: 0,
        zlevel: 0,
        label: {
          normal: {
            position: "center"
          }
        },
        data: [
          {
            value: value,
            name: "",
            itemStyle: {
              normal: {
                color: {
                  // 完成的圆环的颜色
                  colorStops: [
                    {
                      offset: 0,
                      color: "#A098FC" // 0% 处的颜色
                    },
                    {
                      offset: 0.3,
                      color: "#4386FA" // 0% 处的颜色
                    },
                    {
                      offset: 0.6,
                      color: "#4FADFD" // 0% 处的颜色
                    },
                    {
                      offset: 0.8,
                      color: "#0CD3DB" // 100% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "#646CF9" // 100% 处的颜色
                    }
                  ]
                }
              }
            }
          },
          {
            value: 100 - value,
            name: "",
            label: {
              normal: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                color: "#173164"
              }
            }
          }
        ]
      },
      {
        name: "医保支付占比",
        type: "pie",
        radius: ["42%", "45%"],
        silent: true,
        clockwise: true,
        startAngle: 270,
        z: 0,
        zlevel: 0,
        label: {
          normal: {
            position: "center"
          }
        },
        data: [
          {
            value: value,
            name: "",
            itemStyle: {
              normal: {
                color: {
                  // 完成的圆环的颜色
                  colorStops: [
                    {
                      offset: 0,
                      color: "#00EDF3" // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "#646CF9" // 100% 处的颜色
                    }
                  ]
                }
              }
            }
          },
          {
            value: 100 - value,
            name: "",
            label: {
              normal: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                color: "#173164"
              }
            }
          }
        ]
      }
    ]
  };

  //获取圆上面某点的坐标(x0,y0表示坐标，r半径，angle角度)
  function getCirlPoint(x0, y0, r, angle) {
    let x1 = x0 + r * Math.cos((angle * Math.PI) / 180);
    let y1 = y0 + r * Math.sin((angle * Math.PI) / 180);
    return {
      x: x1,
      y: y1
    };
  }
  return option;
}
function dashboardOption(optionData) {
  let data = optionData[0];
  // 未处理个数
  let value = data.excluding;
  let sum = data.total;
  // 占比
  let proportion = calculate.Mul(calculate.Div(value, sum), 100, 2);

  let color = "";
  if (proportion <= 0.2) {
    color = "#00a65a";
  } else if (proportion > 0.2 && proportion <= 0.4) {
    color = "#2b64fc";
  } else if (proportion > 0.4 && proportion <= 0.6) {
    color = "#f39c11";
  } else if (proportion > 0.6) {
    color = "#fa4e4b";
  }
  let option = {
    // backgroundColor: "#003366",
    // tooltip: {
    //   position: "inside",
    //   formatter: "",
    //   textStyle: {
    //     fontSize: 10
    //   }
    // },
    series: [
      {
        name: "刻度",
        type: "gauge",
        center: ["50%", "65%"],
        radius: "90%",
        min: 0, //最小刻度
        max: 100, //最大刻度
        splitNumber: 8, //刻度数量
        startAngle: 180,
        endAngle: 0,
        axisLine: {
          show: true,
          lineStyle: {
            width: 1,
            color: [[1, "rgba(0,0,0,0)"]]
          }
        }, //仪表盘轴线
        axisLabel: {
          show: true,
          color: "#0ab7ff",
          fontSize: 15,
          distance: -50,
          formatter: function(v) {
            return v + "%";
          }
        }, //刻度标签。
        axisTick: {
          show: true,
          splitNumber: 5,
          lineStyle: {
            color: "#0ab7ff",
            width: 1
          },
          length: -3
        }, //刻度样式
        splitLine: {
          show: true,
          length: -5,
          lineStyle: {
            color: "#0ab7ff"
          }
        } //分隔线样式
      },
      {
        type: "gauge",
        radius: "80%",
        center: ["50%", "65%"],
        splitNumber: 0, //刻度数量
        startAngle: 180,
        endAngle: 0,
        axisLine: {
          show: true,
          lineStyle: {
            width: 50,
            color: [
              [0.2, "#00a65a"],
              [0.4, "#2b64fc"],
              [0.6, "#f39c11"],
              [1, "#fa4e4b"]
            ]
          }
        },
        //分隔线样式。
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        axisTick: {
          show: false
        },
        pointer: {
          show: true,
          length: "80%",
          width: "2%"
        },
        title: {
          show: true,
          offsetCenter: [0, "60%"], // x, y，单位px
          textStyle: {
            fontWeight: "bold",
            color: "color",
            fontSize: 20
          }
        },
        //仪表盘详情，用于显示数据。
        detail: {
          show: true,
          offsetCenter: [0, "30%"],
          color: color,
          formatter: function(value) {
            // if (value <= 20) {
            //   return "有发展空间";
            // } else if (value <= 40) {
            //   return "健康";
            // } else if (value <= 60) {
            //   return "预警";
            // } else {
            //   return "过度";
            // }
            return proportion + "%";
          },
          textStyle: {
            fontSize: 26
          }
        },
        data: [
          {
            name: "反馈未处理 " + value + " 个",
            value: value
          }
        ]
      }
      //   {
      //     // 仅显示tooltip用
      //     type: "pie",
      //     radius: "90%",
      //     hoverAnimation: true,
      //     label: {
      //       normal: {
      //         show: false,
      //         position: "center"
      //       }
      //     },
      //     labelLine: {
      //       normal: {
      //         show: false
      //       }
      //     },
      //     z: 3,
      //     zlevel: 0,
      //     itemStyle: {
      //       borderWidth: 0
      //     },
      //     data: [
      //       {
      //         value: 50,
      //         name: "",
      //         label: {
      //           normal: {
      //             show: false
      //           }
      //         },
      //         itemStyle: {
      //           normal: {
      //             color: "transparent"
      //           }
      //         }
      //       }
      //     ]
      //   }
    ]
  };
  return option;
}
function costDetailsOption(costDetails, param) {
  let XName = [];
  let data1 = [];
  let data = [{ coords: [] }];
  costDetails.map(item => {
    let temp = [];
    XName.push(item[param.type]);
    data1.push(item.excludingAmount);
    temp.push(item[param.type]);
    temp.push(item.excludingAmount);
    data[0].coords.push(temp);
  });
  let img = [
    "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABRCAYAAABFTSEIAAAACXBIWXMAAAsSAAALEgHS3X78AAAEp0lEQVR42u3cz4sjRRTA8W9Vd3Vn8mMmjj9WQWSRZQ+CsH+B7MnDIgiCd0E8CYJ/gOAIelo8ehUP/gF6WLw5/gMueFP2sIcF0dHd2Z1kknR11fOQZJJJMtlZd03H7HtQpNOTnpn+8Lrm1etmjIig8e/DKoECKqACKqCGAiqgAiqghgIqoAIqoIYCKqACKqCGAiqgAiqghgIqoAJudKTr+osZMNPvBUQBHwHsPF9fB9R0DeHMOQ6T6WOrhEzXBM4swDOL0M6CrArRVoq3t2dGUIb9fTvatg8ZZup1PDBgzPmy98mey6qfzjLz2WaWjEUZKEvGyi9nWyneMOvGIyFQo2Sbg4MUSChpU9IeTTUpJdsEajPZOJeJG5uBZj7rLLduWS5dGm6XNLEELOFUFj54ACJCaychkpDSASK3bwsXL0YgVpWJKwM0iy9Zy8HdGru7jvt3Pbu7w0wES7drTwAbjTHMGCsQcIAnYTC1/wRx0wEnl27JNgZI8HQ6Kc1mQq83RNzaMjPzXqDbjTQaJRFLxIyyMSxAXEkWrhrQzAAmo5HOjCQf7jflILxOkohL+aUPgV4vEGNJo+E5PAy02+UIMEwBxo0CPDP7Dg5SnEtpt1PA0e87XO25FOoh8IYIH2Y5b45RzGAQBiIltZoHxqMcjbksXAVgdc2EQMYzzzdotyeZWKuleULXJtwT4SODfC2QCWR+IF9KnjuX1Xbo99Op7LVE8iXlz0YBTk5SyLEEjo5OLuccEoFUvHfO+reuUPx4zftXAIcx1hdcF+/TvFab4A0Bs0VwqyhpVnkJT89/Q4DDQ0e77YCMwIUsFMeFZD856699URRvX4nxE4A/jbnxXp7v4Zw3ReGNSDHI8wFQjIafuoyn58L/fB6sth/Ybg9fez2TRC6QZcZYvgHsazF+MP7YCyLXcM7gvSXLDGBqYDg+NhwdmSpPoTrAkub0W+f4FSB1fDucIunMHSLpO8WAH0rSy8u+19MBCHB4OHzd2pI+CEUhpigEiN+l6WcdY252jLn5s7Wf472ImPcN8pUl/tEHoV4XWq1Ke4KrLmPsTA3oODpytFoOyJKSyzHyMSIxteWngMW5cSEdDJQUhTdZVgxOz3/+jFJm4+bA2e5JpNU6WZ4Fw99JwnWMKccwpeddP+B7GZTNUPKqybJy0O+Hs1YfMz9swwvpB8fbGDG0GuGkkK7V0hxSmZQpABI8l2z0v3sJf50qpAMJCd2qCulql3LD1lRGQjm7lEsDz0rkxTQOfiPPxUBcuJTbbhss/Y1eyi3NwsmKInmkZsKk5gtPUzNhvp11507CSy/X6XYStpvFudpZw1ZWIOF4Cq6SdtbKbioJyAhRTu3u9yMJXerN+ugvaQQsjcZ8Q3VnZwxlSDhe1lB9GjrSw5b+1avT8+Jw+979nNaOI6U3KpTrWAosxVQmygK4ld8X0ZtK/7eViExD7O1NQPb3T7fsl4/4sBpwYzPwjFbTo95Yl9l9Vd1YN1X/147HebSjary1AHyc5qc+XLQEQx9ve8Kg6xr6hKoCKqACKqCGAiqgAiqghgIqoAIqoIYCKqACKqCGAiqgAiqghgIq4JrHP8fEWV8FMTmOAAAAAElFTkSuQmCC",
    "image://data:image/png;base64,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",
    "image://data:image/png;base64,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",
    "image://data:image/png;base64,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"
  ];
  let title = "";
  if (param.type === "department") {
    title = "科室";
  } else if (param.type === "drugInspection") {
    title = "药品检查";
  } else if (param.type === "doctor") {
    title = "医生";
  } else if (param.type === "insured") {
    title = "参保人";
  }
  let option = {
    // backgroundColor: "#0e2147",
    title: {
      text: title + " 剔除费用情况",
      left: "5%",
      top: "1%",
      textStyle: {
        color: "#fff",
        fontSize: "22"
      }
    },
    toolbox: {
      //可视化的工具箱
      show: true,
      right: "4%",
      top: "2%",
      iconStyle: {
        normal: {
          borderColor: "#1990DA"
        }
      },
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
              if (item.name === "滑行的光点") {
              } else {
                tdHeaders += "<td>" + item.name + "</td>"; //组装表头
              }
            });
            let table =
              '<div class="table-responsive"><table class="table table-bordered table-striped table-hover" style="text-align:center;color:#222831;"><tbody><tr>' +
              tdHeaders +
              "</tr>";
            let tdBodys = ""; //数据
            for (let i = 0, l = axisData.length; i < l; i++) {
              for (let j = 0; j < 1; j++) {
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
      // bottom: "20%"
      containLabel: true
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
        textStyle: {
          color: "#FFFFFF"
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
      type: "scroll",
      data: param.type,
      itemWidth: 18,
      itemHeight: 12,
      textStyle: {
        color: "#00ffff",
        fontSize: 14
      }
    },
    yAxis: [
      {
        type: "value",
        position: "left",
        nameTextStyle: {
          color: "#00FFFF"
        },
        splitLine: {
          lineStyle: {
            type: "dashed",
            color: "rgba(135,140,147,0.8)"
          }
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          formatter: "{value}",
          color: "#fff",
          fontSize: 14
        }
      }
    ],
    xAxis: [
      {
        type: "category",
        axisTick: {
          show: false
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: "#0696f9"
          }
        },
        axisLabel: {
          rotate: 30,
          inside: false,
          textStyle: {
            color: "#fff", // x轴颜色
            fontWeight: "normal",
            fontSize: "14",
            lineHeight: 22
          }
        },
        data: XName
      }
    ],
    series: [
      {
        symbolSize: 150,
        symbol: img[2],
        name: "剔除金额",
        type: "line",
        data: data1,
        itemStyle: {
          normal: {
            borderWidth: 5,
            color: "#0696f9"
          }
        }
      },
      {
        name: "滑行的光点",
        type: "lines",
        coordinateSystem: "cartesian2d",
        symbolSize: 30,
        polyline: true,
        effect: {
          show: true,
          trailLength: 0,
          symbol: "arrow",
          period: 10, //光点滑动速度
          symbolSize: 150,
          symbol: img[0]
        },
        lineStyle: {
          normal: {
            width: 1,
            opacity: 0.6,
            curveness: 0.2
          }
        },
        data: data
      }
    ]
  };
  return option;
}
function numberOfPenaltyOption(chartData, param) {
  function contains(arr, dst) {
    let i = arr.length;
    while ((i -= 1)) {
      if (arr[i] == dst) {
        return i;
      }
    }
    return false;
  }
  let times = [];
  let departments = [];
  chartData.map(item => {
    times.push(item.times);
    departments.push(item[param.type]);
  });
  let attackSourcesColor = [
    "#f36c6c",
    "#e6cf4e",
    "#20d180",
    "#0093ff",
    "#1089E7",
    "#F57474",
    "#56D0E3",
    "#1089E7",
    "#F57474",
    "#1089E7",
    "#F57474",
    "#F57474"
  ];

  function attackSourcesDataFmt(sData) {
    let sss = [];
    sData.forEach(function(item, i) {
      let itemStyle = {
        color: i > 3 ? attackSourcesColor[3] : attackSourcesColor[i]
      };
      sss.push({
        value: item,
        itemStyle: itemStyle
      });
    });
    return sss;
  }
  let title = "";
  if (param.type === "department") {
    title = "科室";
  } else if (param.type === "drugInspection") {
    title = "药品检查";
  } else if (param.type === "doctor") {
    title = "医生";
  } else if (param.type === "insured") {
    title = "参保人";
  }
  let option = {
    toolbox: {
      show: true,
      feature: {
        dataView: {
          //数据视图
          show: true,
          readOnly: true,
          optionToContent: function(opt) {
            let axisData = opt.yAxis[0].data;
            let series = opt.series[0].data;
            let tdHeaders = "<td>科室</td>"; //表头
            // series.forEach(function(item) {
            //   tdHeaders += "<td>" + item.name + "</td>"; //组装表头
            // });
            let table =
              '<div class="table-responsive"><table class="table table-bordered table-striped table-hover" style="text-align:center;color:#222831;"><tbody><tr>' +
              tdHeaders +
              "</tr>";
            let tdBodys = ""; //数据
            for (let index = 0; index < series.length; index++) {
              const element = series[index];
              tdBodys += "<td>" + series[index].value + "次</td>"; //组装表数据
              table +=
                '<tr><td style="padding: 0 10px">' +
                axisData[index] +
                "</td>" +
                tdBodys +
                "</tr>";
              tdBodys = "";
            }

            table += "</tbody></table></div>";
            return table;
          }
        },
        restore: {},
        saveAsImage: {
          show: true,
          excludeComponents: ["toolbox"],
          pixelRatio: 2,
          type: ["png"],
          title: ["保存"]
        }
      }
    },
    tooltip: {
      show: true,
      backgroundColor: "rgba(21,52,93,1)", //背景颜色（此时为默认色）
      textStyle: {
        fontSize: 16
      }
      // trigger: 'axis',
      // axisPointer: {
      //    type: 'shadow'
      // }
    },
    title: {
      text: title + " 剔除次数",
      // left: "3%",
      top: "3%"
    },
    legend: {
      show: false
    },
    grid: {
      left: 140,
      bottom: 30
    },
    dataZoom: [
      {
        type: "slider",
        yAxisIndex: 0,
        zoomLock: true,
        width: 20,
        handleSize: "100%",
        showDetail: false,
        start: 0,
        end: 50,
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
        type: "inside",
        id: "insideY",
        yAxisIndex: 0,
        start: 0,
        end: 50,
        zoomOnMouseWheel: false,
        moveOnMouseMove: true,
        moveOnMouseWheel: true
      }
    ],
    xAxis: {
      type: "value",

      splitLine: {
        show: false
      },
      axisLabel: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      }
    },
    yAxis: {
      type: "category",
      inverse: true,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisPointer: {
        label: {
          show: true,
          margin: 30
        }
      },
      data: departments,
      axisLabel: {
        margin: 140,
        fontSize: 14,
        align: "left",
        color: "#333",
        rich: {
          nt1: {
            color: "#fff",
            backgroundColor: attackSourcesColor[0],
            width: 25,
            height: 25,
            align: "center",
            borderRadius: 100
          },
          nt2: {
            color: "#fff",
            backgroundColor: attackSourcesColor[1],
            width: 25,
            height: 25,
            align: "center",
            borderRadius: 100
          },
          nt3: {
            color: "#fff",
            backgroundColor: attackSourcesColor[2],
            width: 25,
            height: 25,
            align: "center",
            borderRadius: 100
          },
          nt: {
            color: "#fff",
            backgroundColor: attackSourcesColor[3],
            width: 25,
            height: 25,
            align: "center",
            borderRadius: 100
          },
          title1: {
            backgroundColor: attackSourcesColor[0],
            color: "#fff",
            width: 90,
            align: "left",
            borderRadius: 5,
            padding: 5
          },
          title2: {
            backgroundColor: attackSourcesColor[1],
            color: "#fff",
            width: 90,
            align: "left",
            borderRadius: 5,
            padding: 5
          },
          title3: {
            backgroundColor: attackSourcesColor[2],
            color: "#fff",
            width: 90,
            align: "left",
            borderRadius: 5,
            padding: 5
          },
          title: {
            backgroundColor: attackSourcesColor[3],
            color: "#fff",
            width: 90,
            align: "left",
            borderRadius: 5,
            padding: 5
          }
        },
        formatter: function(value, index) {
          index = contains(departments, value) + 1;
          if (index - 1 < 3) {
            return [
              "{nt" +
                index +
                "|" +
                index +
                "}" +
                "  {title" +
                index +
                "|" +
                value +
                "}"
            ].join("\n");
          } else {
            return ["{nt|" + index + "}" + "  {title|" + value + "}"].join(
              "\n"
            );
          }
        }
      }
    },
    series: [
      {
        z: 2,
        //name: 'value',
        type: "bar",
        barWidth: "25px",
        animationDuration: 1500,
        data: attackSourcesDataFmt(times),
        /**
             * es写法
             attackSourcesData.map((item, i) => {
                itemStyle = {
                    color: i > 3 ? colorList[3] : colorList[i]
                }
                return {
                    value: item,
                    itemStyle: itemStyle
                };
            }),
            */
        itemStyle: {
          normal: {
            color: function(params) {
              return attackSourcesColor[
                params.dataIndex > 3 ? 3 : params.dataIndex
              ];
            },
            barBorderRadius: 5
          }
        },
        label: {
          show: true,
          formatter: function(a) {
            return a.value + "次";
          },
          position: "right",
          color: "#838098",
          fontWeight: 500,
          fontSize: 14,
          offset: [5, 0]
        }
      }
    ]
  };
  return option;
}
// https://www.makeapie.com/editor.html?c=x06vA7qS2X
function roseChartOption(param) {
  let legenddata = [
    { name: "智能审核人工导入", abnormalAmount: 85840, proportion: "35%" },
    { name: "住院限制支付药品", abnormalAmount: 80589, proportion: "9%" },
    { name: "诊疗项目限儿童使用", abnormalAmount: 57786, proportion: "3%" },
    { name: "人工剔除", abnormalAmount: 43938, proportion: "35%" },
    {
      name: "超医保诊疗项目范围收费",
      abnormalAmount: 29566,
      proportion: "0.7%"
    },
    {
      name: "医用材料使用与项目不匹配",
      abnormalAmount: 29406,
      proportion: "9%"
    },
    { name: "重复用药", abnormalAmount: 29406, proportion: "1%" },
    {
      name: "仪器辅助操作与手术重复收费",
      abnormalAmount: 11812,
      proportion: "6%"
    },
    {
      name: "中药饮片单味出现时不支付",
      abnormalAmount: 11811,
      proportion: "0.023%"
    },
    { name: "中医辨证论治不匹配", abnormalAmount: 9332, proportion: "0.015%" },
    {
      name: "超时间收费,项目超限次",
      abnormalAmount: 7469,
      proportion: "1%"
    },
    {
      name: "项目超限次（单次住院）",
      abnormalAmount: 6909,
      proportion: "0.03%"
    },
    { name: "限工伤保险支付", abnormalAmount: 6235, proportion: "0.37%" },
    { name: "第二麻醉半价收费", abnormalAmount: 4046, proportion: "0.02%" }
  ];
  let option = {
    dataset: {
      source: [
        ["Country", "abnormalAmount", "SQRT", "proportion"],
        ["智能审核人工导入", 85840, 292.9846412, "35%"],
        ["住院限制支付药品", 80589, 283.8820177, "9%"],
        ["诊疗项目限儿童使用", 57786, 240.3871877, "3%"],
        ["人工剔除", 43938, 209.6139308, "35%"],
        ["超医保诊疗项目范围收费", 29566, 171.9476665, "0.7%"],
        ["医用材料使用与项目不匹配", 29566, 171.5476665, "9%"],
        ["重复用药", 29406, 171.4817775, "1%"],
        ["仪器辅助操作与手术重复收费", 11812, 108.6830254, "6%"],
        ["中药饮片单味出现时不支付", 11811, 108.6784247, "0.023%"],
        ["中医辨证论治不匹配", 9332, 96.60227741, "0.015%"],
        ["超时间收费,项目超限次", 7469, 86.42337647, "1%"],
        ["项目超限次（单次住院）", 6909, 83.12039461, "0.03%"],
        ["限工伤保险支付", 6235, 78.96201618, "0.37%"],
        ["第二麻醉半价收费", 4046, 63.60817558, "0.02%"]
      ]
    },
    toolbox: {
      show: true, //false则不显示工具栏
      feature: {
        saveAsImage: { show: true, type: "jpeg" }
      }
    },
    title: {
      text: "违规名称的金额和占比",
      subtext: param.chargingTime[0] + " 至 " + param.chargingTime[1],
      x: "60%",
      y: "150",
      textStyle: {
        fontSize: 22,
        fontWeight: "bold",
        fontFamily: "Microsoft YaHei",
        color: "#000"
      },
      subtextStyle: {
        fontStyle: "italic",
        fontSize: 14
      }
    },
    legend: {
      itemGap: 20,
      x: "52%", //水平位置，【left\center\right\数字】
      y: "240", //垂直位置，【top\center\bottom\数字】
      align: "left", //字在图例的左边或右边【left/right】
      orient: "vertical", //图例方向【horizontal/vertical】
      icon: "circle", //图例形状【circle\rect\roundRect\triangle\diamond\pin\arrow\none】
      //图例文字
      textStyle: {
        fontFamily: "微软雅黑",
        color: "#000"
      },
      data: [
        "智能审核人工导入",
        "住院限制支付药品",
        "诊疗项目限儿童使用",
        "人工剔除",
        "超医保诊疗项目范围收费",
        "医用材料使用与项目不匹配",
        "重复用药",
        "仪器辅助操作与手术重复收费",
        "中药饮片单味出现时不支付",
        "",
        "中医辨证论治不匹配",
        "超时间收费,项目超限次",
        "项目超限次（单次住院）",
        "限工伤保险支付",
        "第二麻醉半价收费"
      ],
      formatter: function(params) {
        for (var i = 0; i < legenddata.length; i++) {
          if (legenddata[i].name == params) {
            return (
              params +
              "\t异常金额:" +
              legenddata[i].abnormalAmount +
              "\t占比:" +
              legenddata[i].proportion
            );
          }
        }
      }
    },

    calculable: true,
    series: [
      {
        name: "半径模式",
        type: "pie",
        clockWise: false,
        radius: [20, 400],
        center: ["35%", "62%"],
        roseType: "area",
        encode: {
          itemName: "Country",
          value: "SQRT"
        },
        itemStyle: {
          normal: {
            color: function(params) {
              var colorList = [
                "#a71a4f",
                "#bc1540",
                "#c71b1b",
                "#d93824",
                "#ce4018",
                "#d15122",
                "#e7741b",
                "#e58b3d",
                "#e59524",
                "#dc9e31",
                "#da9c2d",
                "#d2b130",
                "#bbd337",
                "#8cc13f",
                "#67b52d",
                "#53b440",
                "#48af54",
                "#479c7f",
                "#48a698",
                "#57868c"
              ];
              return colorList[params.dataIndex];
            },
            label: {
              position: "inside",
              textStyle: {
                fontWeight: "bold",
                fontFamily: "Microsoft YaHei",
                color: "#FAFAFA",
                fontSize: 10
              },
              //formatter:'{b} \n{@abnormalAmount}例 \n死亡{@proportion}',//注意这里大小写敏感哦
              formatter: function(params) {
                console.log("参数列表", params);
                if (params.data[1] > 9000) {
                  return (
                    params.data[0] +
                    "\n" +
                    params.data[1] +
                    "元" +
                    "\n" +
                    "占比" +
                    params.data[3] +
                    ""
                  );
                } else {
                  return "";
                }
              }
            }
          }
        }
      },
      {
        name: "透明圆圈",
        type: "pie",
        radius: [10, 27],
        center: ["35%", "62%"],
        itemStyle: {
          color: "rgba(250, 250, 250, 0.3)"
        },
        data: [{ value: 10, name: "" }]
      },
      {
        name: "透明圆圈",
        type: "pie",
        radius: [10, 35],
        center: ["35%", "62%"],
        itemStyle: {
          color: "rgba(250, 250, 250, 0.3)"
        },
        data: [{ value: 10, name: "" }]
      }
    ]
  };
  return option;
}
function violationOfNumberOption() {
  option = {
    backgroundColor: "#01004C",
    title: {},
    tooltip: {
      trigger: "axis"
    },
    legend: {
      data: ["信息科技", "大消费"],
      textStyle: {
        color: "#fff"
      }
    },
    toolbox: {
      show: true,
      feature: {
        mark: {
          show: true
        },
        dataView: {
          show: true,
          readOnly: false
        },
        magicType: {
          show: true,
          type: ["line", "bar"]
        },
        restore: {
          show: true
        },
        saveAsImage: {
          show: true
        }
      }
    },
    calculable: true,
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        data: ["一月份", "二月份", "三月份", "四月份", "五月份", "六月份"],
        axisLabel: {
          show: true,
          textStyle: {
            color: "#ffffff", //X轴文字颜色
            fontSize: 16
          }
        }
      }
    ],
    yAxis: [
      {
        type: "value",
        axisLabel: {
          formatter: "{value} ",
          color: "#ffffff",
          textStyle: {
            fontSize: 16
          }
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "#ccc"
          }
        }
      }
    ],
    series: [
      {
        name: "信息科技",
        type: "line",
        data: [1, 4, 2, 5, 1, 2, 1],
        lineStyle: {
          normal: {
            width: 8,
            color: {
              type: "linear",

              colorStops: [
                {
                  offset: 0,
                  color: "#57BD9F" // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#19BC8C" // 100% 处的颜色
                }
              ],
              globalCoord: false // 缺省为 false
            },
            shadowColor: "rgba(72,216,191, 0.3)",
            shadowBlur: 6,
            shadowOffsetY: 10
          }
        },
        itemStyle: {
          normal: {
            color: "#57BD9F",
            borderWidth: 10,
            borderColor: "#57BD9F"
          }
        },
        markPoint: {
          data: [
            {
              type: "max",
              name: "最大值"
            },
            {
              type: "min",
              name: "最小值"
            }
          ]
        }
      }
    ]
  };
}
export {
  fourRingOption,
  healthCareAccountedOption,
  dashboardOption,
  costDetailsOption,
  numberOfPenaltyOption,
  roseChartOption,
  violationOfNumberOption
};
