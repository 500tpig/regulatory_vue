import { exportFile } from "quasar";
function getMonthLastDay(str) {
  let year = str.substring(0, 4);
  let month = str.substring(4, 6);
  let lastDay = new Date(year, month, 0).getDate();
  return year + month + lastDay;
}
//字符串转日期格式，strDate要转为日期格式的字符串
function formatDateTime(date, format) {
  if (!date) return;
  if (!format) format = "yyyy-MM-dd";
  switch (typeof date) {
    case "string":
      date = new Date(date.replace(/-/, "/"));
      break;
    case "number":
      date = new Date(date);
      break;
  }
  if (!date instanceof Date) return;
  let dict = {
    yyyy: date.getFullYear(),
    M: date.getMonth() + 1,
    d: date.getDate(),
    H: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds(),
    MM: ("" + (date.getMonth() + 101)).substr(1),
    dd: ("" + (date.getDate() + 100)).substr(1),
    HH: ("" + (date.getHours() + 100)).substr(1),
    mm: ("" + (date.getMinutes() + 100)).substr(1),
    ss: ("" + (date.getSeconds() + 100)).substr(1)
  };
  return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function() {
    return dict[arguments[0]];
  });
}
function formatDate(strDate) {
  let year = strDate.substring(0, 4);
  let month = strDate.substring(4, 6);
  let day = "";
  if (strDate.length > 6) day = strDate.substring(6, 8);
  if (strDate.length === 6) return year + "-" + month;
  else return year + "-" + month + "-" + day;
}
function shallowCopyObj(originalObj, targetObj) {
  for (let key in originalObj) {
    targetObj[key] = originalObj[key];
  }
  return targetObj;
}
//js 小数相加精确结果
function accAdd(arg1, arg2) {
  if (isNaN(arg1)) {
    arg1 = 0;
  }
  if (isNaN(arg2)) {
    arg2 = 0;
  }
  arg1 = Number(arg1);
  arg2 = Number(arg2);
  var r1, r2, m, c;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  c = Math.abs(r1 - r2);
  m = Math.pow(10, Math.max(r1, r2));
  if (c > 0) {
    var cm = Math.pow(10, c);
    if (r1 > r2) {
      arg1 = Number(arg1.toString().replace(".", ""));
      arg2 = Number(arg2.toString().replace(".", "")) * cm;
    } else {
      arg1 = Number(arg1.toString().replace(".", "")) * cm;
      arg2 = Number(arg2.toString().replace(".", ""));
    }
  } else {
    arg1 = Number(arg1.toString().replace(".", ""));
    arg2 = Number(arg2.toString().replace(".", ""));
  }
  return (arg1 + arg2) / m;
}
const pickerOptions = {
  shortcuts: [
    {
      text: "本月",
      onClick(picker) {
        picker.$emit("pick", [new Date(), new Date()]);
      }
    },
    {
      text: "今年至今",
      onClick(picker) {
        const end = new Date();
        const start = new Date(new Date().getFullYear(), 0);
        picker.$emit("pick", [start, end]);
      }
    },
    {
      text: "最近六个月",
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setMonth(start.getMonth() - 6);
        picker.$emit("pick", [start, end]);
      }
    }
  ]
};
// js小数相加减乘除
const calculate = {
  /*
        函数，加法函数，用来得到精确的加法结果 
        说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
        参数：arg1：第一个加数；arg2第二个加数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数）
        调用：Calc.Add(arg1,arg2,d) 
        返回值：两数相加的结果
        */
  Add: function(arg1, arg2) {
    (arg1 = arg1.toString()), (arg2 = arg2.toString());
    var arg1Arr = arg1.split("."),
      arg2Arr = arg2.split("."),
      d1 = arg1Arr.length == 2 ? arg1Arr[1] : "",
      d2 = arg2Arr.length == 2 ? arg2Arr[1] : "";
    var maxLen = Math.max(d1.length, d2.length);
    var m = Math.pow(10, maxLen);
    var result = Number(((arg1 * m + arg2 * m) / m).toFixed(maxLen));
    var d = arguments[2];
    return typeof d === "number" ? Number(result.toFixed(d)) : result;
  },
  /*
        函数：减法函数，用来得到精确的减法结果 
        说明：函数返回较为精确的减法结果。
        参数：arg1：第一个加数；arg2第二个加数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数
        调用：Calc.Sub(arg1,arg2) 
        返回值：两数相减的结果
        */
  Sub: function(arg1, arg2) {
    return Calc.Add(arg1, -Number(arg2), arguments[2]);
  },
  /*
        函数：乘法函数，用来得到精确的乘法结果 
        说明：函数返回较为精确的乘法结果。
        参数：arg1：第一个乘数；arg2第二个乘数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数)
        调用：Calc.Mul(arg1,arg2) 
        返回值：两数相乘的结果
        */
  Mul: function(arg1, arg2) {
    var r1 = arg1.toString(),
      r2 = arg2.toString(),
      m,
      resultVal,
      d = arguments[2];
    m =
      (r1.split(".")[1] ? r1.split(".")[1].length : 0) +
      (r2.split(".")[1] ? r2.split(".")[1].length : 0);
    resultVal =
      (Number(r1.replace(".", "")) * Number(r2.replace(".", ""))) /
      Math.pow(10, m);
    return typeof d !== "number"
      ? Number(resultVal)
      : Number(resultVal.toFixed(parseInt(d)));
  },
  /*
        函数：除法函数，用来得到精确的除法结果 
        说明：函数返回较为精确的除法结果。
        参数：arg1：除数；arg2被除数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数)
        调用：Calc.Div(arg1,arg2) 
        返回值：arg1除于arg2的结果
        */
  Div: function(arg1, arg2) {
    var r1 = arg1.toString(),
      r2 = arg2.toString(),
      m,
      resultVal,
      d = arguments[2];
    m =
      (r2.split(".")[1] ? r2.split(".")[1].length : 0) -
      (r1.split(".")[1] ? r1.split(".")[1].length : 0);
    resultVal =
      (Number(r1.replace(".", "")) / Number(r2.replace(".", ""))) *
      Math.pow(10, m);
    return typeof d !== "number"
      ? Number(resultVal)
      : Number(resultVal.toFixed(parseInt(d)));
  }
};
// 将民族对应码转化为文字
function Nation(key) {
  let name = new Array(
    "汉族",
    "蒙古族",
    "回族",
    "藏族",
    "维吾尔族",
    "苗族",
    "彝族",
    "壮族",
    "布依族",
    "朝鲜族",
    "满族",
    "侗族",
    "瑶族",
    "白族",
    "土家族",
    "哈尼族",
    "哈萨克族",
    "傣族",
    "黎族",
    "傈僳族",
    "佤族",
    "畲族",
    "高山族",
    "拉祜族",
    "水族",
    "东乡族",
    "纳西族",
    "景颇族",
    "柯尔克孜族",
    "土族",
    "达斡尔族",
    "仫佬族",
    "羌族",
    "布朗族",
    "撒拉族",
    "毛南族",
    "仡佬族",
    "锡伯族",
    "阿昌族",
    "普米族",
    "塔吉克族",
    "怒族",
    "乌孜别克族",
    "俄罗斯族",
    "鄂温克族",
    "德昂族",
    "保安族",
    "裕固族",
    "京族",
    "塔塔尔族",
    "独龙族",
    "鄂伦春族",
    "赫哲族",
    "门巴族",
    "珞巴族",
    "基诺族",
    "其他",
    "外国血统"
  );
  return name[parseInt(key) - 1];
}
/*根据出生日期算出年龄*/
function jsGetAge(strBirthday) {
  var returnAge;
  var strBirthdayArr = strBirthday.split("-");
  var birthYear = strBirthdayArr[0];
  var birthMonth = strBirthdayArr[1];
  var birthDay = strBirthdayArr[2];

  let d = new Date();
  var nowYear = d.getFullYear();
  var nowMonth = d.getMonth() + 1;
  var nowDay = d.getDate();

  if (nowYear == birthYear) {
    returnAge = 0; //同年 则为0岁
  } else {
    var ageDiff = nowYear - birthYear; //年之差
    if (ageDiff > 0) {
      if (nowMonth == birthMonth) {
        var dayDiff = nowDay - birthDay; //日之差
        if (dayDiff < 0) {
          returnAge = ageDiff - 1;
        } else {
          returnAge = ageDiff;
        }
      } else {
        var monthDiff = nowMonth - birthMonth; //月之差
        if (monthDiff < 0) {
          returnAge = ageDiff - 1;
        } else {
          returnAge = ageDiff;
        }
      }
    } else {
      returnAge = -1; //返回-1 表示出生日期输入错误 晚于今天
    }
  }

  return returnAge; //返回周岁年龄
}
function getportraitPhoto(age, sex) {
  let photo = "";
  if (age >= 0 && age <= 6) {
    photo += "baby";
  } else if (age >= 7 && age <= 12) {
    photo += "child";
  } else if (age >= 13 && age <= 30) {
    photo += "youth";
  } else if (age >= 31 && age <= 69) {
    photo += "wrinkly";
  } else {
    photo += "elderly";
  }
  if (sex === 1) {
    photo += "Boy";
  } else {
    photo += "Girl";
  }
  return photo + ".png";
}
function getYearBetween(start, end) {
  let result = [];
  let startTime = new Date(start);
  let endTime = new Date(end);
  while (endTime - startTime >= 0) {
    let year = startTime.getFullYear();
    result.push(year);
    startTime.setFullYear(startTime.getFullYear() + 1);
  }
  return result;
}
//获得某月的最后一天
function getLastDay(year, month) {
  let new_year = year; //取当前的年份
  let new_month = month++; //取下一个月的第一天，方便计算（最后一天不固定）
  if (month > 12) {
    new_month -= 12; //月份减
    new_year++; //年份增
  }
  let new_date = new Date(new_year, new_month, 1); //取当年当月中的第一天
  return new Date(new_date.getTime() - 1000 * 60 * 60 * 24).getDate(); //获取当月最后一天日期
}
// 快排
function quick(arr) {
  if (arr.length <= 1) {
    return arr;
  }
  var left = [],
    right = [],
    k = arr.splice(0, 1)[0];
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] > k) {
      right.push(arr[i]);
    } else {
      left.push(arr[i]);
    }
  }
  return quick(left).concat([k], quick(right));
}
function isObjArr(value) {
  if (Object.prototype.toString.call(value) === "[object Array]") {
    return "Array";
  } else if (Object.prototype.toString.call(value) === "[object Object]") {
    return "Object";
  } else {
    return "error";
  }
}

function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`;
}

function exportTable(columns, data) {
  // naive encoding to csv format
  const content = [columns.map(col => wrapCsvValue(col.label))]
    .concat(
      data.map(row =>
        columns
          .map(col =>
            wrapCsvValue(
              typeof col.field === "function"
                ? col.field(row)
                : row[col.field === void 0 ? col.name : col.field],
              col.format
            )
          )
          .join(",")
      )
    )
    .join("\r\n");
  const status = exportFile("table-export.csv", content, "text/csv");
  if (status !== true) {
    this.$q.notify({
      message: "Browser denied file download...",
      color: "negative",
      icon: "warning"
    });
  }
}
export {
  getMonthLastDay,
  accAdd,
  formatDate,
  formatDateTime,
  pickerOptions,
  shallowCopyObj,
  calculate,
  Nation,
  jsGetAge,
  getportraitPhoto,
  getYearBetween,
  quick,
  getLastDay,
  isObjArr,
  exportTable
};
