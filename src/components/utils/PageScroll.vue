<template>
  <q-scroll-area class="proj-con" :class="scroll_class">
    <div class="layout-padding" :class="content_class">
      <slot></slot>
    </div>
  </q-scroll-area>
</template>
<style lang="stylus">
.proj-con
  height calc(100vh - 50px)
</style>

<script>
export default {
  data() {
    return {};
  },
  props: {
    content_class: String,
    scroll_class: String
  }
};
</script>
