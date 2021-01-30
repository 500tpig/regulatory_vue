import echarts from "echarts";
import { calculate } from "../util/common";
function fourRingOption(optionData) {
  let option = {
    series: [
      {
        name: "个人支付",
        type: "pie",
        radius: ["36%", "42%"],
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
                formatter: "\n\n120623",
                textStyle: {
                  color: "#007ac6",
                  fontSize: 26
                }
              }
            }
          }
        ]
      },
      {
        name: "医保支付",
        type: "pie",
        radius: ["36%", "42%"],
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
                formatter: "\n\n241246",
                textStyle: {
                  color: "#FDC830",
                  fontSize: 26
                }
              }
            }
          }
        ]
      },
      {
        name: "医疗费用",
        type: "pie",
        radius: ["36%", "42%"],
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
                formatter: "\n\n361869",
                textStyle: {
                  color: "#f125ff",
                  fontSize: 26
                }
              }
            }
          }
        ]
      },
      {
        name: "剔除金额",
        type: "pie",
        radius: ["36%", "42%"],
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
                formatter: "\n\n83541",
                textStyle: {
                  color: "#FF416C",
                  fontSize: 26
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
  let value = 50.24;
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
  // 未处理个数
  let value = 40;
  let sum = 100;
  // 占比
  let proportion = calculate.Div(value, sum, 2);
  let color = "";
  console.log(proportion);
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
            color: "#0ab7ff",
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
            return value + "%";
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
export { fourRingOption, healthCareAccountedOption, dashboardOption };
