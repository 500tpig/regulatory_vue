import { accAdd, calculate, formatDate } from "../util/common";
import "assets/js/util/lodash";
function setAgeGroupChartOption(chartData, isDrillDown) {
  let ageGroups = [];
  let individualPay = [];
  let totalCost = [];
  let medicarePay = [];
  let title = {};
  chartData.map(item => {
    ageGroups.push(item.ageScope);
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
      data: ageGroups,
      axisLabel: {
        // interval: 0,
        // rotate: 30
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
function setAgeGroupDoubleHistogramOption(
  doubleHistogramData,
  type,
  searchParam
) {
  let title = "";
  let typeTitle = "";
  if (searchParam.type === "OC") {
    typeTitle = "门诊";
  } else if (searchParam.type === "HC") {
    typeTitle = "住院";
  } else {
    typeTitle = "门诊住院";
  }
  title +=
    formatDate(searchParam.chargingTime[0]) +
    " 至 " +
    formatDate(searchParam.chargingTime[1]) +
    " " +
    typeTitle +
    "年龄";
  if (type === "totalCost") {
    title += "总医疗费用";
  } else if (type === "individualPay") {
    title += "个人支付费用";
  } else {
    title += "医保支付费用";
  }
  let data = {
    OC: {
      name: "门诊",
      data: []
    },
    HC: {
      name: "住院",
      data: []
    }
  };
  let sum = {
    OC: 0,
    HC: 0
  };
  for (let key in doubleHistogramData) {
    let temp = doubleHistogramData[key];
    temp.map(item => {
      let tempObj = {};
      tempObj.value = item[type];
      sum[key] = accAdd(sum[key], item[type]);
      tempObj.label = item.ageScope;
      data[key].data.push(tempObj);
    });
  }
  let yAxisData = new Set();
  let legendData = [];
  _.forEach(data, d => {
    legendData.push(d.name);
    _.forEach(d.data, item => {
      yAxisData.add(item.label);
    });
  });

  let top = 30;
  let bottom = 60;

  yAxisData = [...yAxisData];

  let option = {
    title: {
      show: true, //显示策略，默认值true,可选为：true（显示） | false（隐藏）
      text: title, //主标题文本，'\n'指定换行
      x: "center", // 水平安放位置，默认为左对齐，可选为：
      // 'center' ¦ 'left' ¦ 'right'
      // ¦ {number}（x坐标，单位px）
      y: "top", // 垂直安放位置，默认为全图顶端，可选为：
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
    toolbox: {
      //可视化的工具箱
      show: true,
      right: "5%",
      top: "0%",
      feature: {
        restore: {
          //重置
          show: true
        },
        saveAsImage: {
          //保存图片
          show: true
        },
        dataZoom: {
          show: true
        },
        magicType: {
          //动态类型切换
          type: ["bar", "line"]
        }
      }
    },
    tooltip: {
      show: true,
      trigger: "axis",
      formatter: function(parms) {
        var str =
          parms[0].marker +
          parms[0].seriesName +
          " " +
          parms[0].name +
          "</br>" +
          "金额：" +
          parms[0].value +
          "元</br>";
        if (parms[0].seriesName === "门诊")
          str +=
            "占比：" +
            calculate.Mul(calculate.Div(parms[0].value, sum.OC), 100, 2) +
            "%";
        else
          str +=
            "占比：" +
            calculate.Mul(calculate.Div(parms[0].value, sum.HC), 100, 2) +
            "%";
        return str;
      },
      axisPointer: {
        type: "shadow"
      }
    },
    legend: {
      left: "center",
      bottom: 24,
      itemWidth: 15,
      itemHeight: 11,
      itemGap: 20,
      borderRadius: 4,
      textStyle: {
        color: "#262C41",
        fontSize: 14
      },
      data: legendData
    },
    grid: [
      {
        left: "8%",
        width: "32%",
        containLabel: true,
        bottom
      },
      {
        left: "50%",
        width: "0%",
        bottom: bottom + 16
      },
      {
        right: "8%",
        width: "32%",
        containLabel: true,
        bottom
      }
    ].map(item =>
      _.merge(
        {
          top
        },
        item
      )
    ),
    xAxis: [
      {
        type: "value",
        inverse: true,
        axisLabel: {
          show: true
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: true
        }
      },
      {
        gridIndex: 1,
        show: true
      },
      {
        gridIndex: 2,
        type: "value",
        axisLabel: {
          show: true
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: true
        }
      }
    ].map(item =>
      _.merge(item, {
        axisLabel: {
          color: "#949AA8",
          margin: 0
        },
        splitLine: {
          lineStyle: {
            color: "#E0E0E0",
            type: "dashed"
          }
        }
      })
    ),
    yAxis: [
      {
        position: "right",
        axisLabel: {
          show: false
        },
        axisLine: {
          show: true
        }
      },
      {
        gridIndex: 1,
        position: "center",
        axisLabel: {
          align: "center",
          padding: [8, 0, 0, 0],
          fontSize: 12,
          color: `#262C41`
        },
        axisLine: {
          show: false
        }
      },
      {
        gridIndex: 2,
        position: "left",
        axisLabel: {
          show: false
        },
        axisLine: {
          show: true
        }
      }
    ].map(item => {
      return _.merge(item, {
        type: "category",
        inverse: false,
        axisLine: {
          lineStyle: {
            color: "#E0E0E0"
          }
        },
        axisTick: {
          show: false
        },
        data: yAxisData
      });
    }),
    series: [
      {
        name: _.get(data, "OC.name"),
        label: {
          position: "left",
          formatter: function(a) {
            let value = a.value;
            if (value > 100000000)
              return calculate.Div(value, 100000000, 2) + "亿元";
            else if (value > 10000)
              return calculate.Div(value, 10000, 2) + "万元";
            return value.toFixed(2) + "元";
          }
        },
        itemStyle: {
          color: "#01C5B2",
          barBorderRadius: [4, 0, 0, 4]
        },
        data: _.map(_.get(data, "OC.data"), d => d.value)
      },
      {
        xAxisIndex: 2,
        yAxisIndex: 2,
        name: _.get(data, "HC.name"),
        label: {
          position: "right",
          formatter: function(a) {
            let value = a.value;
            if (value > 100000000)
              return calculate.Div(value, 100000000, 2) + "亿元";
            else if (value > 10000)
              return calculate.Div(value, 10000, 2) + "万元";
            return value.toFixed(2) + "元";
          }
        },
        itemStyle: {
          color: "#FB6F6C",
          barBorderRadius: [0, 4, 4, 0]
        },
        data: _.map(_.get(data, "HC.data"), d => d.value)
      }
    ].map(item =>
      _.merge(item, {
        type: "bar",
        barWidth: 11,
        label: {
          show: true,
          fontFamily: "Rubik-Medium",
          fontSize: 14,
          distance: 10
        }
      })
    )
  };
  return option;
}
export { setAgeGroupChartOption, setAgeGroupDoubleHistogramOption };
