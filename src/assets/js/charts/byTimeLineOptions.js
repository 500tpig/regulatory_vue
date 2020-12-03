import { formatDate, calculate } from "../util/common";
function setCalendarYearChartOption() {
  function getVirtulData() {
    var data = [["2012-01-11", 1]];
    return data;
  }
  let option = {
    title: {
      top: 5,
      left: "left", //'center',
      text: "###参保人2016-2018日历图"
    },
    tooltip: {
      position: "top"
    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {
          show: true
        }
      }
    },
    visualMap: {
      min: 0,
      max: 20,
      calculable: true,
      orient: "horizontal",
      left: "center",
      top: "top",
      inRange: {
        color: ["#02AC64", "#91CB61", "#F6C93F", "#F89D33", "#D0021B"]
      }
    },

    calendar: [
      {
        range: "2016",
        cellSize: ["auto", 15],
        left: 70,
        right: 30
      },
      {
        top: 230,
        range: "2017",
        cellSize: ["auto", 15],
        left: 70,
        right: 30
      },
      {
        top: 400,
        range: "2018",
        cellSize: ["auto", 15],
        left: 70,
        right: 30
      }
    ],
    series: [
      {
        type: "heatmap",
        coordinateSystem: "calendar",
        calendarIndex: 0,
        data: getVirtulData(2016),
        name: "2016"
      },
      {
        type: "heatmap",
        coordinateSystem: "calendar",
        calendarIndex: 1,
        data: getVirtulData(2017),
        name: "2017"
      },
      {
        type: "heatmap",
        coordinateSystem: "calendar",
        calendarIndex: 2,
        data: getVirtulData(2018),
        name: "2018"
      }
    ]
  };
}
function setCalendarMonthChartOption() {
  function getVirtulData(year) {
    year = year || "2017";
    var date = +echarts.number.parseDate(year + "-01-01");
    var end = +echarts.number.parseDate(+year + 1 + "-01-01");
    var dayTime = 3600 * 24 * 1000;
    var data = [];
    for (var time = date; time < end; time += dayTime) {
      data.push([
        echarts.format.formatTime("yyyy-MM-dd", time),
        Math.floor(Math.random() * 1000)
      ]);
    }
    return data;
  }
  var dataX = [
    "星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六"
  ];
  let option = {
    calendar: {
      left: "center",
      top: "center",
      orient: "vertical",
      cellSize: 80,
      range: "2017-10",
      yearLabel: {
        show: true,
        margin: 40,
        color: "#7fb93c",
        formatter: function(e) {
          console.log(e);
          return e.start + "年     2 月";
        }
      },
      dayLabel: {
        firstDay: 1,
        margin: 5,
        color: "gray",
        nameMap: dataX
      },
      monthLabel: {
        show: false
      }
    },
    visualMap: {
      type: "continuous",
      min: 0,
      max: 1000,
      inRange: {
        color: ["#02AC64", "#91CB61", "#F6C93F", "#F89D33", "#D0021B"]
      }
    },
    series: [
      {
        type: "scatter",
        coordinateSystem: "calendar",
        symbolSize: 1,
        itemStyle: {
          normal: {
            color: "rgba(0,0,0,0)"
          }
        },
        label: {
          normal: {
            show: true,
            offset: [25, -25],
            textStyle: {
              color: "#fff"
            }
          }
        },
        data: Array(31)
          .fill(undefined)
          .map((v, index) => {
            return [`2017-10-${index + 1}`, index + 1];
          })
      },
      {
        type: "heatmap",
        coordinateSystem: "calendar",
        data: getVirtulData(2017)
      }
    ]
  };
}
function setGinsengContrastChartOption() {
  /*
    最近本人发现了配置更简单，更容易理解，更容易修改，bug更少的写法
    
    所以更新了原图表，这里分享给大家
    
    不知道用以前写法的小伙伴有没有发现
    
    1.项目中如果数据为0的话，hover的时候用以前的写法文字会将圆点盖住...
    
    2.鼠标放上的时候，x轴Pointer文字可能会有些轻微的向上或向下的移动...
    
    3.文字下划线和文字见的距离过小，有的时候不是很符合需求...
    
    以下旧写法我都注释了哈，现在生效的是新写法，新写法我也解释说明了哦

*/

  /*

    这个注释建议看完代码再看哦
    
    1.如果axisLabel和axisPointer的margin相同，则padding[0]必须等于0
    
    2.实现效果axisLabel和AxisPointer的字体大小必须相同
    
    3.此配置实现效果axisLabel和axisPointer的margin必须相同
    
    其他配置同样可以实现效果，如lineHeight等
    
    这是我整理、删除多余相同配置项后总结出的，使用方便，便于封装复用
    
    适用于大多数图表的配置

    更复杂的样式还是要参考配置文档的哦😘😘😘

*/
  const colorList = ["#9E87FF", "#73DDFF", "#fe9a8b", "#F56948", "#9E87FF"];
  option = {
    backgroundColor: "#fff",
    title: {
      text: "就医轨迹对比",
      textStyle: {
        fontSize: 12,
        fontWeight: 400
      },
      left: "center",
      top: "5%"
    },
    legend: {
      icon: "circle",
      top: "5%",
      right: "5%",
      itemWidth: 6,
      itemGap: 20,
      textStyle: {
        color: "#556677"
      }
    },
    grid: {
      top: "10%"
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        label: {
          show: true,
          backgroundColor: "#fff",
          color: "#556677",
          borderColor: "rgba(0,0,0,0)",
          shadowColor: "rgba(0,0,0,0)",
          shadowOffsetY: 0
        },
        lineStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "red"
              },
              {
                offset: 0.5,
                color: "#48b3FF"
              },
              {
                offset: 1,
                color: "#d9efff"
              }
            ],
            global: false
          }
        }
      },
      backgroundColor: "#fff",
      textStyle: {
        color: "#5c6c7c"
      },
      padding: [10, 10],
      extraCssText: "box-shadow: 1px 0 2px 0 rgba(163,163,163,0.5)"
    },
    xAxis: [
      {
        type: "category",
        data: [
          "2016-01",
          "2016-02",
          "2016-03",
          "2016-04",
          "2016-05",
          "2016-06",
          "2016-07"
        ],
        axisLine: {
          lineStyle: {
            color: "#DCE2E8"
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          interval: 0,
          textStyle: {
            color: "#556677"
          },
          // 默认x轴字体大小
          fontSize: 12,
          // margin:文字到x轴的距离
          margin: 15
        },
        axisPointer: {
          label: {
            // padding: [11, 5, 7],
            padding: [0, 0, 10, 0],
            /*
    除了padding[0]建议必须是0之外，其他三项可随意设置
    
    和CSSpadding相同，[上，右，下，左]
    
    如果需要下边线超出文字，设左右padding即可，注：左右padding最好相同
    
    padding[2]的10:
    
    10 = 文字距下边线的距离 + 下边线的宽度
                
    如：UI图中文字距下边线距离为7 下边线宽度为2
    
    则padding: [0, 0, 9, 0]
                
                */
            // 这里的margin和axisLabel的margin要一致!
            margin: 15,
            // 移入时的字体大小
            fontSize: 12,
            backgroundColor: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "#fff" // 0% 处的颜色
                },
                {
                  // offset: 0.9,
                  offset: 0.86,
                  /*
0.86 = （文字 + 文字距下边线的距离）/（文字 + 文字距下边线的距离 + 下边线的宽度）
                        
                        */
                  color: "#fff" // 0% 处的颜色
                },
                {
                  offset: 0.86,
                  color: "#33c0cd" // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#33c0cd" // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
          }
        }
      }
    ],

    yAxis: [
      {
        type: "value",
        axisTick: {
          show: false
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "#DCE2E8"
          }
        },
        axisLabel: {
          textStyle: {
            color: "#556677"
          }
        },
        splitLine: {
          show: false
        }
      }
    ],
    series: [
      {
        name: "参保人1",
        type: "line",
        data: [10, 10, 30, 12, 15, 3, 7],
        symbolSize: 1,
        symbol: "circle",
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 5,
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            {
              offset: 0,
              color: "#9effff"
            },
            {
              offset: 1,
              color: "#9E87FF"
            }
          ]),
          shadowColor: "rgba(158,135,255, 0.3)",
          shadowBlur: 10,
          shadowOffsetY: 20
        },
        itemStyle: {
          normal: {
            color: colorList[0],
            borderColor: colorList[0]
          }
        }
      },
      {
        name: "参保人2",
        type: "line",
        data: [5, 12, 11, 14, 25, 16, 10],
        symbolSize: 1,
        symbol: "circle",
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 5,
          color: new echarts.graphic.LinearGradient(1, 1, 0, 0, [
            {
              offset: 0,
              color: "#73DD39"
            },
            {
              offset: 1,
              color: "#73DDFF"
            }
          ]),
          shadowColor: "rgba(115,221,255, 0.3)",
          shadowBlur: 10,
          shadowOffsetY: 20
        },
        itemStyle: {
          normal: {
            color: colorList[1],
            borderColor: colorList[1]
          }
        }
      },
      {
        name: "参保人3",
        type: "line",
        data: [150, 120, 170, 140, 500, 160, 110],
        symbolSize: 1,
        symbol: "circle",
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 5,
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            {
              offset: 0,
              color: "#fe9a"
            },
            {
              offset: 1,
              color: "#fe9a8b"
            }
          ]),
          shadowColor: "rgba(254,154,139, 0.3)",
          shadowBlur: 10,
          shadowOffsetY: 20
        },
        itemStyle: {
          normal: {
            color: colorList[2],
            borderColor: colorList[2]
          }
        }
      }
    ]
  };
}
