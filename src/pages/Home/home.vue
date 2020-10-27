<template>
  <q-page>
    <page-base-scroll content_class="byTIme q-py-lg"> </page-base-scroll>
  </q-page>
</template>

<script>
import pageBaseScroll from "components/utils/PageScroll";

export default {
  components: { pageBaseScroll: pageBaseScroll },

  data() {
    return {
      image: require("assets/image/1.png")
    };
  }
};
</script>

<style scoped></style>
