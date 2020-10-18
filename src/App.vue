<template>
  <div id="q-app">
    <keep-alive> <router-view /></keep-alive>
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
main {
  background: #eef0f3;
}
</style>
