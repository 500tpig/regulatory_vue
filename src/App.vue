<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: "App",
  created() {
    // 添加对<q-icon name =“ app：....” />的
    // 支持的示例，
    // 其中包括对Quasar组件的
    // 所有“icon”属性的支持

    this.$q.iconMapFn = iconName => {
      // iconName是QIcon“name”属性的内容

      // 您的自定义方法，以下
      // 仅是示例：
      if (iconName.startsWith("icon-") === true) {
        return {
          cls: "iconfont " + iconName
        };
      }

      // 当我们不从iconMapFn返回任何内容时，
      // 默认的Quasar图标映射
      // 将接管
    };
  }
};
</script>
<style lang="scss">
html {
  overflow: hidden;
}
body {
  overflow: hidden;
}
main {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  color: #f1f1f1;
  letter-spacing: 0.5px;
  word-spacing: 1.5px;
  height: auto;
  .text-OC {
    color: #4aa79c;
  }
  .text-HC {
    color: #e64b2a;
  }
  .text-Date {
    color: #cd4a43;
  }
  .text-knowledgeGraphDrug {
    color: #699759;
  }
  .text-knowledgeGraphMoney {
    color: #5996e5;
  }
  .q-card {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  }
  .el-range-editor.is-active,
  .el-range-editor.is-active:hover {
    border: 1px solid $primary;
  }
  .el-input__inner {
    border: 1px solid rgba(0, 0, 0, 0.24);
    text-align: center;
  }
}
</style>
