var colorList = [
  "#4c8eda",
  "#569480",
  "#f16667",
  "#ffffff",
  "#c990c0",
  "#f79767",
  "#57c7e3",
  "#d9c8ae",
  "#ecb5c9",
  "#ffc454",
  "#8dcc93"
];

// 根据节点类型返回节点半径
function generateR(d) {
  switch (d.group) {
    case "Person": {
      return 25;
    }
    case "Date": {
      return 15;
    }
    case "DiagnosticEventsOC": {
      return 18;
    }
    case "DiagnosticEventsHC": {
      return 18;
    }
    default: {
      return 10;
    }
  }
}
// 根据节点类型返回节点信息
function generateTooltip(d) {
  let data = [
    {
      label: "节点类型",
      value: d.properties.nodeName
    },
    {
      label: "图谱ID",
      value: d.id
    }
  ];

  if (d.group === "Person") {
    data.push({
      label: "姓名",
      value: d.properties.name
    });
    data.push({
      label: "性别",
      value: d.properties.sex
    });
    data.push({
      label: "参保人ID",
      value: d.properties.id
    });
    data.push({
      label: "出生日期",
      value: d.properties.birthday
    });
  } else if (d.group === "Date") {
    data.push({
      label: "日期",
      value: d.properties.date
    });
  } else if (
    d.group === "DiagnosticEventsOC" ||
    d.group === "DiagnosticEventsHC"
  ) {
    data.push({
      label: "医院ID",
      value: d.properties.hospitalID
    });
    data.push({
      label: "参保人ID",
      value: d.properties.personId
    });
    data.push({
      label: "科室",
      value: d.properties.department
    });
    data.push({
      label: "单据流水号",
      value: d.properties.documentSerialNumber
    });
    if (d.group === "DiagnosticEventsOC") {
      data.push({
        label: "门诊流水号",
        value: d.properties.serialNumber
      });
    } else {
      data.push({
        label: "住院流水号",
        value: d.properties.serialNumber
      });
    }
    data.push({
      label: "费用日期",
      value: d.properties.date
    });
  } else if (d.group === "knowledgeGraphDrug") {
    data.push({
      label: "药品ID",
      value: d.properties.drugId
    });
    data.push({
      label: "处方ID",
      value: d.properties.prescriptionId
    });
    data.push({
      label: "药品名称",
      value: d.properties.drug
    });
    data.push({
      label: "取药数量",
      value: d.properties.drugNum
    });
    data.push({
      label: "药物费用",
      value: d.properties.drugCost
    });
    data.push({
      label: "医保项目",
      value: d.properties.isMP
    });
  } else if (d.group === "knowledgeGraphMoney") {
    data.push({
      label: "个人支付",
      value: d.properties.individualPay
    });
    data.push({
      label: "医保支付",
      value: d.properties.medicarePay
    });
    data.push({
      label: "医疗总费用",
      value: d.properties.totalCost
    });
    data.push({
      label: "药品费用",
      value: d.properties.drugCost
    });
  }
  return data;
}
// 根据节点类型返回节点颜色
function generateColor(d) {
  switch (d.group) {
    case "Person": {
      return "url(#Person)";
    }
    case "DiagnosticEventsOC": {
      return "url(#DiagnosticEventsOC)";
    }
    case "DiagnosticEventsHC": {
      return "url(#DiagnosticEventsHC)";
    }
    case "Date": {
      return "url(#Date)";
    }
    case "knowledgeGraphDrug": {
      return "url(#knowledgeGraphDrug)";
    }
    case "knowledgeGraphMoney": {
      return "url(#knowledgeGraphMoney)";
    }
    default: {
      return colorList[10];
    }
  }
}

export { generateR, generateColor, generateTooltip };
