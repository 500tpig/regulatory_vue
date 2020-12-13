import { quick, calculate, getYearBetween, getLastDay } from "../util/common";
import echarts from "echarts";
function getMedian(arr) {
  if (arr.length % 2 == 0) {
    return calculate.Div(arr[arr.length / 2 - 1] + arr[arr.length / 2], 2, 2);
  } else {
    return arr[Math.floor(arr.length / 2)];
  }
}
function setCalendarYearChartOption(
  chartData,
  feeType,
  searchParam,
  portraitInfo
) {
  let yearArr = getYearBetween(
    searchParam.chargingTime[0].substring(0, 4),
    searchParam.chargingTime[1].substring(0, 4)
  );
  // 设置日历图数据
  let data = [];
  // 最大值
  let max = 0;
  // 设置要排序的数组
  let sortData = [];
  for (let index = 0; index < chartData.length; index++) {
    let element = chartData[index];
    if (index === 0) {
      max = element[feeType.value];
    } else {
      if (max <= element[feeType.value]) max = element[feeType.value];
    }
    let tempData = [];
    tempData.push(element.costDate);
    sortData.push(element[feeType.value]);
    tempData.push(element[feeType.value]);
    data.push(tempData);
  }
  // 设置calendar
  let setCalendar = [];
  // 设置series
  let setSeries = [];
  // 图表间距
  let top = 230;
  for (let index = 0; index < yearArr.length; index++) {
    let temp = {
      range: yearArr[index],
      cellSize: ["auto", 20],
      left: 70,
      right: 30,
      monthLabel: {
        nameMap: "cn"
      },
      dayLabel: {
        nameMap: "cn"
      }
    };
    let serie = {
      type: "heatmap",
      coordinateSystem: "calendar",
      calendarIndex: index,
      data: data,
      name: yearArr[index]
    };
    if (index === 0) {
      temp.top = 80;
    } else if (index === 1) {
      temp.top = top + 35;
    } else {
      top += 215;
      temp.top = top;
    }
    setCalendar.push(temp);
    setSeries.push(serie);
  }
  // 视觉映射区间设置
  let piecesArr = [];
  piecesArr = getMid(sortData, piecesArr);
  let option = {
    title: {
      top: 0,
      left: "left", //'center',
      text:
        portraitInfo.xming0 +
        " " +
        searchParam.chargingTime[0].substring(0, 4) +
        "年 至 " +
        searchParam.chargingTime[1].substring(0, 4) +
        "年 " +
        feeType.label +
        " 日历图"
    },
    tooltip: {
      textStyle: {
        fontWeight: 500
      },
      padding: [10, 10],
      formatter: p => {
        return (
          p.marker +
          "日期：" +
          p.data[0] +
          "</br>" +
          '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;"></span>' +
          feeType.label +
          "：" +
          p.data[1] +
          "元"
        );
      }
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
      max: max,
      itemGap: 30,
      pieces: piecesArr,
      inRange: {
        color: ["#50a3ba", "#eac736", "#d94e5d"]
      },
      type: "piecewise",
      orient: "horizontal",
      left: "center",
      top: "25",
      textStyle: {
        color: "#000"
      }
    },
    calendar: setCalendar,
    series: setSeries
  };
  return option;
}
function setCalendarMonthChartOption(chartData, feeType, calendarParam) {
  // 设置日历图数据
  let data = [];
  // 最大值
  let max = 0;
  // 设置要排序的数组
  let sortData = [];
  for (let index = 0; index < chartData.length; index++) {
    let element = chartData[index];
    if (index === 0) {
      max = element[feeType.value];
    } else {
      if (max <= element[feeType.value]) max = element[feeType.value];
    }
    let tempData = [];
    tempData.push(element.costDate);
    sortData.push(element[feeType.value]);
    tempData.push(element[feeType.value]);
    data.push(tempData);
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
  let lastDay = getLastDay(
    calendarParam.showMonth.substring(0, 4),
    calendarParam.showMonth.substring(4, 6)
  );
  let month =
    calendarParam.showMonth.substring(0, 4) +
    "-" +
    calendarParam.showMonth.substring(4, 6);
  let piecesArr = [];
  piecesArr = getMid(sortData, piecesArr);
  let option = {
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {
          show: true
        }
      }
    },
    tooltip: {
      textStyle: {
        fontWeight: 500
      },
      padding: [10, 10],
      formatter: p => {
        return (
          p.marker +
          "日期：" +
          p.data[0] +
          "</br>" +
          '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;"></span>' +
          feeType.label +
          "：" +
          p.data[1] +
          "元"
        );
      }
    },
    calendar: {
      left: "center",
      top: "center",
      orient: "vertical",
      cellSize: 90,
      range: month,
      yearLabel: {
        show: true,
        color: "#7fb93c",
        formatter: function(e) {
          return (
            e.start +
            "年 " +
            calendarParam.showMonth.substring(4, 6) +
            " 月" +
            " " +
            feeType.label
          );
        }
      },
      dayLabel: {
        firstDay: 1,
        margin: 5,
        color: "gray",
        nameMap: dataX,
        fontSize: 14
      },
      monthLabel: {
        show: false
      }
    },
    visualMap: {
      min: 0,
      max: max,
      // itemGap: 30,
      top: 10,
      right: 10,
      pieces: piecesArr,
      inRange: {
        color: ["#50a3ba", "#eac736", "#d94e5d"]
      },
      outOfRange: {
        color: "#999"
      },
      type: "piecewise",
      // orient: "horizontal",
      textStyle: {
        color: "#000"
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
        data: Array(lastDay)
          .fill(undefined)
          .map((v, index) => {
            return [month + `-${index + 1}`, index + 1];
          })
      },
      {
        type: "heatmap",
        coordinateSystem: "calendar",
        data: data
      }
    ]
  };
  return option;
}
function setGinsengContrastChartOption(chartData, comparisonParam) {
  /**
   * 最近本人发现了配置更简单，更容易理解，更容易修改，bug更少的写法
   * 所以更新了原图表，这里分享给大家
   * 不知道用以前写法的小伙伴有没有发现
   * 1.项目中如果数据为0的话，hover的时候用以前的写法文字会将圆点盖住...
   * 2.鼠标放上的时候，x轴Pointer文字可能会有些轻微的向上或向下的移动...
   * 3.文字下划线和文字见的距离过小，有的时候不是很符合需求...
   * 以下旧写法我都注释了哈，现在生效的是新写法，新写法我也解释说明了哦
   */
  /**
   * 这个注释建议看完代码再看哦
   * 1.如果axisLabel和axisPointer的margin相同，则padding[0]必须等于0
   * 2.实现效果axisLabel和AxisPointer的字体大小必须相同
   * 3.此配置实现效果axisLabel和axisPointer的margin必须相同
   * 其他配置同样可以实现效果，如lineHeight等
   * 这是我整理、删除多余相同配置项后总结出的，使用方便，便于封装复用
   * 适用于大多数图表的配置
   * 更复杂的样式还是要参考配置文档的哦😘😘😘
   */
  const colorList = ["#9E87FF", "#73DDFF", "#fe9a8b", "#F56948", "#9E87FF"];
  let xdata = [];
  let serieData = [];
  let lineStyles = [
    {
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
  ];
  chartData.map((item, index) => {
    let temp = [];
    for (let i = 0; i < item.data.length; i++) {
      const element = item.data[i];
      if (index === 0) {
        xdata.push(element.month);
      }
      temp.push(element[comparisonParam.feeType.value]);
    }
    let serie = {
      name: "参保人" + (index + 1),
      type: "line",
      data: temp,
      symbolSize: 1,
      symbol: "circle",
      smooth: true,
      showSymbol: false,
      lineStyle: lineStyles[index].lineStyle,
      itemStyle: lineStyles[index].itemStyle
    };
    serieData.push(serie);
  });
  let option = {
    backgroundColor: "#fff",
    title: {
      text: "就医轨迹对比",
      textStyle: {
        fontSize: 14,
        fontWeight: 500
      },
      left: "center",
      top: "0%"
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
      top: "5%",
      bottom: "12%"
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
        data: xdata,
        axisLine: {
          lineStyle: {
            color: "#DCE2E8"
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          // interval: 0,
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
            /**
             * 除了padding[0]建议必须是0之外，其他三项可随意设置
             * 和CSSpadding相同，[上，右，下，左]
             * 如果需要下边线超出文字，设左右padding即可，注：左右padding最好相同
             * padding[2]的10:  10 = 文字距下边线的距离 + 下边线的宽度
             * 如：UI图中文字距下边线距离为7 下边线宽度为2
             * 则padding: [0, 0, 9, 0]
             * */
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
                  /**
                   * 0.86 = （文字 + 文字距下边线的距离）/（文字 + 文字距下边线的距离 + 下边线的宽度）
                   * */
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
    dataZoom: [
      {
        show: true,
        start: 0,
        end: 100,
        handleSize: "100%",
        bottom: "0%",
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
    series: serieData
  };
  return option;
}
function getMid(sortData, piecesArr) {
  // 排序
  sortData = quick(sortData);
  // 中位数
  let mid1 = getMedian(sortData);
  let mid2;
  let mid3;
  if (sortData.length > 3) {
    if (sortData.length % 2 === 0) {
      let left = sortData.length / 2 - 1;
      let right = piecesArr.length / 2;
      mid2 = getMedian(sortData.slice(0, left));
      mid3 = getMedian(sortData.slice(right + 1, sortData.length));
    } else {
      let mid = Math.floor(sortData.length / 2);
      mid2 = getMedian(sortData.slice(0, mid));
      mid3 = getMedian(sortData.slice(mid + 1, sortData.length));
    }
    piecesArr.push({
      max: mid2
    });
    piecesArr.push({
      min: mid2,
      max: mid1
    });
    piecesArr.push({
      max: mid3,
      min: mid1
    });
    piecesArr.push({
      min: mid3
    });
  } else {
    piecesArr.push({
      max: mid1
    });
    piecesArr.push({
      min: mid1
    });
  }
  return piecesArr;
}
export {
  setCalendarYearChartOption,
  setCalendarMonthChartOption,
  setGinsengContrastChartOption
};
