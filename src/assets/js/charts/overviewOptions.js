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
    toolbox: {
      //可视化的工具箱
      show: true,
      right: "5%",
      top: "0%",
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
      toolbox: {
        show: true,
        right: "3%",
        feature: {
          saveAsImage: {
            show: true
          }
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
    toolbox: {
      show: true,
      right: "3%",
      feature: {
        saveAsImage: {
          show: true
        }
      }
    },
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

function setSubsidyChartOption(subsidyData) {
  let data = [];
  let xdata = [];
  let temp = subsidyData.data[0];
  for (const key in temp) {
    if (Object.hasOwnProperty.call(temp, key)) {
      const element = temp[key];
      data.push(element);
      xdata.push(key);
    }
  }
  let option = {
    backgroundColor: "#00265f",
    toolbox: {
      show: true,
      right: "3%",
      iconStyle: {
        normal: {
          borderColor: "#1990DA"
        }
      },
      feature: {
        saveAsImage: {
          show: true
        }
      }
    },
    title: {
      text: "补贴额度",
      x: "center",
      y: "4%",
      textStyle: {
        color: "#fff",
        fontSize: "22"
      },
      subtextStyle: {
        color: "#90979c",
        fontSize: "16"
      }
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    grid: {
      top: "15%",
      right: "8%",
      left: "8%",
      bottom: "12%"
    },
    xAxis: [
      {
        type: "category",
        data: xdata,
        axisLine: {
          lineStyle: {
            color: "rgba(255,255,255,0.12)"
          }
        },
        axisLabel: {
          margin: 10,
          color: "#e2e9ff",
          textStyle: {
            fontSize: 14
          }
        }
      }
    ],
    yAxis: [
      {
        name: "单位：元",
        axisLabel: {
          formatter: "{value}",
          color: "#e2e9ff"
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: "rgba(255,255,255,1)"
          }
        },
        splitLine: {
          lineStyle: {
            color: "rgba(255,255,255,0.12)"
          }
        }
      }
    ],
    series: [
      {
        type: "bar",
        data: data,
        barWidth: "20px",
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: "rgba(0,244,255,1)" // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "rgba(0,77,167,1)" // 100% 处的颜色
                }
              ],
              false
            ),
            barBorderRadius: [30, 30, 30, 30],
            shadowColor: "rgba(0,160,221,1)",
            shadowBlur: 4
          }
        },
        label: {
          normal: {
            show: true,
            lineHeight: 30,
            width: 100,
            height: 30,
            backgroundColor: "rgba(0,160,221,0.1)",
            borderRadius: 200,
            position: ["-8", "-60"],
            distance: 1,
            formatter: ["    {d|●}", " {a|{c}}     \n", "    {b|}"].join(","),
            rich: {
              d: {
                color: "#3CDDCF"
              },
              a: {
                color: "#fff",
                align: "center"
              },
              b: {
                width: 1,
                height: 30,
                borderWidth: 1,
                borderColor: "#234e6c",
                align: "left"
              }
            }
          }
        }
      }
    ]
  };
  return option;
}
function setDrugRankingChartOption(drugRanking) {
  let yData = [];
  let data = [];
  let temp = drugRanking.data;
  temp.map(item => {
    data.push(item.drugCost);
    yData.push(item.drug);
  });
  data.reverse();
  yData.reverse();
  let option = {
    toolbox: {
      show: true,
      right: "3%",
      feature: {
        saveAsImage: {
          show: true
        }
      }
    },
    tooltip: {
      trigger: "axis",
      show: true,
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "" // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {
      selectedMode: false
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true
    },
    xAxis: [
      {
        splitLine: {
          show: false
        },
        type: "value",
        show: false
      }
    ],
    yAxis: [
      {
        splitLine: {
          show: false
        },
        axisLine: {
          //y轴
          show: false
        },
        type: "category",
        axisTick: {
          show: false
        },
        data: yData,
        axisLabel: {}
      }
    ],
    series: [
      {
        name: "药品花费",
        type: "bar",
        barWidth: 30, // 柱子宽度
        label: {
          show: true,
          position: "right", // 位置
          color: "#1CD8A8",
          fontSize: 14,
          fontWeight: "bold", // 加粗
          distance: 5 // 距离
        }, // 柱子上方的数值
        itemStyle: {
          barBorderRadius: [0, 20, 20, 0], // 圆角（左上、右上、右下、左下）
          color: new echarts.graphic.LinearGradient(
            0,
            0,
            1,
            0,
            ["#2FAEF2", "#1CD8A8"].map((color, offset) => ({
              color,
              offset
            }))
          ) // 渐变
        },
        data: data
      }
    ]
  };
  return option;
}
export {
  setLineChartOption,
  setdrugRadarChartOption,
  setoVerallPlanningOption,
  setSubsidyChartOption,
  setDrugRankingChartOption
};
