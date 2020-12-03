<template>
  <q-page class="">
    <page-base-scroll content_class="q-mt-md q-px-md">
      <!-- <div class="row">
        <div class="col-6 row">
          <q-card class="col-11 row q-pa-md"> </q-card>
        </div>
        <div class="col-6 row">
          <q-card class="col-11 row q-pa-md"> </q-card>
        </div>
      </div> -->
    </page-base-scroll>
  </q-page>
</template>

<script>
import pageBaseScroll from "components/utils/PageScroll";
import {
  pickerOptions,
  shallowCopyObj,
  formatDate,
  Nation,
  jsGetAge
} from "assets/js/util/common";
import specificTable from "components/utils/specificTable";
import { EleResize } from "assets/js/util/esresize";
export default {
  components: { pageBaseScroll },
  data() {
    return {
      searchParam: {
        personId: "B4009B864068C706A0ED408167E7A03AFCCA8BF95E698A30",
        chargingTime: ["20160701", "20161231"]
      }
    };
  },
  methods: {},
  mounted() {}
};
</script>

<style></style>
