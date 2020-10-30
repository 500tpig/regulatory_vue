function getMonthLastDay(str) {
  let year = str.substring(0, 4);
  let month = str.substring(4, 6);
  let lastDay = new Date(year, month, 0).getDate();
  return year + month + lastDay;
}
//字符串转日期格式，strDate要转为日期格式的字符串
function formatDate(strDate) {
  let year = strDate.substring(0, 4);
  let month = strDate.substring(4, 6);
  let day = "";
  if (strDate.length > 6) day = strDate.substring(6, 8);
  return year + "-" + month + "-" + day;
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
export { getMonthLastDay, accAdd, formatDate, pickerOptions };
