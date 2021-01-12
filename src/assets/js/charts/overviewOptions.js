import { maxIndex } from "d3";
import echarts from "echarts";
import { calculate } from "../util/common";
function setLineChartOption(chartData, searchParam) {
  let xAxis = [];
  let data = [];
  chartData.map(item => {
    let month =
      item.chargingTime.slice(0, 4) + "-" + item.chargingTime.slice(4);
    xAxis.push(month);
    data.push(item.totalCost);
  });
  let title = "";
  title +=
    searchParam.chargingTime[0].slice(0, 4) +
    "-" +
    searchParam.chargingTime[0].slice(4, 6);
  title += " 至 ";
  title +=
    searchParam.chargingTime[1].slice(0, 4) +
    "-" +
    searchParam.chargingTime[1].slice(4, 6);
  if (searchParam.type === "OC") {
    title += " 门诊 ";
  } else if (searchParam.type === "HC") {
    title += " 住院 ";
  } else {
    title += " 门诊住院 ";
  }

  let option = {
    title: {
      text: title + "总医疗费用",
      left: "5%",
      top: "1%"
    },
    tooltip: {
      trigger: "axis"
    },
    grid: {
      top: "10%",
      bottom: "15%"
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
    xAxis: [
      {
        type: "category",
        data: xAxis,
        axisLine: {
          lineStyle: {
            color: "#999"
          }
        }
      }
    ],
    yAxis: [
      {
        type: "value",
        splitNumber: 4,
        splitLine: {
          lineStyle: {
            type: "dashed",
            color: "#DDD"
          }
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: "#333"
          }
        },
        nameTextStyle: {
          color: "#999"
        },
        splitArea: {
          show: false
        }
      }
    ],
    series: [
      {
        name: "金额",
        type: "line",
        data: data,
        lineStyle: {
          normal: {
            width: 8,
            color: {
              type: "linear",

              colorStops: [
                {
                  offset: 0,
                  color: "#A9F387" // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#48D8BF" // 100% 处的颜色
                }
              ],
              globalCoord: false // 缺省为 false
            },
            shadowColor: "rgba(72,216,191, 0.3)",
            shadowBlur: 10,
            shadowOffsetY: 20
          }
        },
        itemStyle: {
          normal: {
            color: "#fff",
            borderWidth: 10,
            /*shadowColor: 'rgba(72,216,191, 0.3)',
                shadowBlur: 100,*/
            borderColor: "#A9F387"
          }
        },
        smooth: true
      }
    ]
  };
  return option;
}
function setdrugRadarChartOption(radarData) {
  let max1 = 0;
  let max2 = 0;
  let temp = radarData.data[0];
  let data = [];
  let indicatorname = [
    "甲类药品项目金额",
    "乙类药品自付",
    "(国家级)基本药品项目金额",
    "(省级)基本药品项目金额",
    "(市级)基本药品项目金额"
  ];
  for (let index = 0; index < indicatorname.length; index++) {
    const element = indicatorname[index];
    data.push(temp[element]);
    if (index <= 1) {
      max1 = calculate.Add(temp[element], max1);
    } else {
      max2 = calculate.Add(temp[element], max2);
    }
  }
  let maxdata = [max1, max1, max2, max2, max2];

  function contains(arrays, obj) {
    let i = arrays.length;
    while (i--) {
      if (arrays[i] === obj) {
        return i;
      }
    }
    return false;
  }

  let indicator = [];
  for (let i = 0; i < indicatorname.length; i++) {
    indicator.push({
      name: indicatorname[i],
      max: maxdata[i]
    });
  }

  function innerdata(i) {
    let innerdata = [];
    for (let j = 0; j < data.length; j++) {
      if (j <= 1) {
        innerdata.push(max1 - calculate.Div(max1, 5) * i);
      } else {
        innerdata.push(max2 - calculate.Div(max2, 5) * i);
      }
    }
    return innerdata;
  }

  let optionData = getData(data);
  function getData(data) {
    let res = {
      series: [
        {
          type: "radar",
          symbolSize: 10,
          symbol: "circle",
          areaStyle: {
            color: "#39B2FF",
            opacity: 0.3
          },
          lineStyle: {
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: "#00A2FF"
                },
                {
                  offset: 1,
                  color: "#0060FF"
                }
              ],
              false
            ),
            width: 3
          },
          itemStyle: {
            color: "#fff ",
            borderColor: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: "#00DEFF"
                },
                {
                  offset: 1,
                  color: "#1598FF"
                }
              ],
              false
            ),
            borderWidth: 4,
            opacity: 1
          },
          label: {
            show: false
          },
          data: [
            {
              value: data
            }
          ],
          z: 100
        }
      ]
    };
    for (let i = 0; i < data.length; i++) {
      res.series.push({
        type: "radar",
        data: [
          {
            value: innerdata(i)
          }
        ],
        symbol: "none",
        lineStyle: {
          width: 0
        },
        itemStyle: {
          color: "#fff"
        },
        areaStyle: {
          color: "#fff",
          shadowColor: "rgba(14,122,191,0.15)",
          shadowBlur: 30,
          shadowOffsetY: 20
        }
      });
    }
    return res;
  }
  let option = {
    backgroundColor: "#fff",
    tooltip: {
      formatter: function() {
        let html = "";
        for (let i = 0; i < data.length; i++) {
          html += indicatorname[i] + " : " + data[i] + "元<br>";
        }
        return html;
      }
    },
    radar: {
      indicator: indicator,
      splitArea: {
        show: true,
        areaStyle: {
          color: "#fff",
          shadowColor: "rgba(14,122,191,0.19)",
          shadowBlur: 30,
          shadowOffsetY: 20
        }
      },
      splitLine: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisLabel: {
        show: false
      },
      name: {
        textStyle: {
          rich: {
            a: {
              fontSize: "17",
              color: "#333",
              align: "left",
              lineHeight: "30",
              fontWeight: "bold"
            },
            b: {
              fontSize: "15",
              color: "#666",
              align: "left"
            }
          }
        },
        formatter: function(params, index) {
          let i = contains(indicatorname, params);
          return "{a|" + data[i] + "元}\n" + "{b|" + params + "}";
        }
      }
    },
    series: optionData.series
  };
  return option;
}
function setoVerallPlanningOption(overallPlanning, searchParam) {
  let dashedPic =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAM8AAAAOBAMAAAB6G1V9AAAAD1BMVEX////Kysrk5OTj4+TJycoJ0iFPAAAAG0lEQVQ4y2MYBaNgGAMTQQVFOiABhlEwCugOAMqzCykGOeENAAAAAElFTkSuQmCC";
  let colorArr = ["#ff4343", "#f69846", "#f6d54a", "#45dbf7", "#44aff0"];
  let color = ["", "", "", "", ""];
  console.log(overallPlanning);
  let temp = overallPlanning.data[0];
  let chartData = [];
  let name = [
    "统筹一段费用",
    "统筹二段费用",
    "统筹三段费用",
    "统筹四段费用",
    "统筹五段费用"
  ];
  let sortArr = [];

  for (let index = 0; index < name.length; index++) {
    const element = name[index];
    sortArr.push(temp[element]);
    chartData.push({
      name: element,
      value: temp[element],
      unit: "元"
    });
  }
  // sortArr.sort();
  console.log(sortArr);

  let colorTemp = [1, 1, 1, 1, 1];

  for (let index = 0; index < sortArr.length; index++) {
    let max = 0;
    let maxIndex = 0;
    for (let i = 0; i < sortArr.length; i++) {
      if (max <= sortArr[i] && colorTemp[i] === 1) {
        max = sortArr[i];
        maxIndex = i;
      }
    }
    colorTemp[maxIndex] = 0;
    console.log(maxIndex);
    // console.log(maxIndex);
    color[maxIndex] = colorArr[index];
  }

  let arrName = [];
  let arrValue = [];
  let sum = 0;
  let pieSeries = [],
    lineYAxis = [];

  // 数据处理
  chartData.forEach((v, i) => {
    arrName.push(v.name);
    arrValue.push(v.value);
    sum = sum + v.value;
  });

  // 图表option整理
  chartData.forEach((v, i) => {
    pieSeries.push({
      name: "统筹费用情况",
      type: "pie",
      clockWise: false,
      hoverAnimation: false,
      radius: [75 - i * 15 + "%", 67 - i * 15 + "%"],
      center: ["40%", "50%"],
      label: {
        show: false
      },
      data: [
        {
          value: v.value,
          name: v.name
        },
        {
          value: sum - v.value,
          name: "",
          itemStyle: {
            color: "rgba(0,0,0,0)"
          }
        }
      ]
    });
    pieSeries.push({
      name: "",
      type: "pie",
      silent: true,
      z: 1,
      clockWise: false, //顺时加载
      hoverAnimation: false, //鼠标移入变大
      radius: [75 - i * 15 + "%", 67 - i * 15 + "%"],
      center: ["40%", "50%"],
      label: {
        show: false
      },
      data: [
        {
          value: 7.5,
          itemStyle: {
            color: "#E3F0FF"
          }
        },
        {
          value: 2.5,
          name: "",
          itemStyle: {
            color: "rgba(0,0,0,0)"
          }
        }
      ]
    });
    v.percent = ((v.value / sum) * 100).toFixed(1) + "%";
    lineYAxis.push({
      value: i,
      textStyle: {
        rich: {
          circle: {
            color: color[i],
            padding: [0, 5]
          }
        }
      }
    });
  });

  let option = {
    // title: {
    //   text: "统筹费用情况",
    //   textStyle: {
    //     fontSize: 20,
    //     fontWeight: 500
    //   },
    //   left: "center",
    //   top: "4%"
    // },
    backgroundColor: "#fff",
    color: color,
    grid: {
      top: "12%",
      bottom: "54%",
      left: "40%",
      containLabel: false
    },
    yAxis: [
      {
        type: "category",
        inverse: true,
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          formatter: function(params) {
            let item = chartData[params];
            return (
              "{line|}{circle|●}{name|" +
              item.name +
              "}{bd||}{percent|" +
              item.percent +
              "}{value|" +
              item.value +
              "}{unit|  元}"
            );
          },
          interval: 0,
          inside: true,
          textStyle: {
            color: "#333",
            fontSize: 14,
            rich: {
              line: {
                width: 100,
                height: 10,
                backgroundColor: { image: dashedPic }
              },
              name: {
                color: "#666",
                fontSize: 14
              },
              bd: {
                color: "#ccc",
                padding: [0, 5],
                fontSize: 14
              },
              percent: {
                color: "#333",
                fontSize: 14
              },
              value: {
                color: "#333",
                fontSize: 16,
                fontWeight: 500,
                padding: [0, 0, 0, 20]
              },
              unit: {
                fontSize: 14
              }
            }
          },
          show: true
        },
        data: lineYAxis
      }
    ],
    xAxis: [
      {
        show: false
      }
    ],
    series: pieSeries
  };
  return option;
}
export {
  setLineChartOption,
  setdrugRadarChartOption,
  setoVerallPlanningOption
};
