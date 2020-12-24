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
      return 10;
    }
    case "DiagnosticEventsOC": {
      return 15;
    }
    case "DiagnosticEventsHC": {
      return 15;
    }
    default: {
      return 5;
    }
  }
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
    default: {
      return colorList[10];
    }
  }
}

export { generateR, generateColor };
