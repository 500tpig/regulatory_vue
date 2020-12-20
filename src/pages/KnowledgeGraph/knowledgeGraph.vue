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
import { pickerOptions, shallowCopyObj } from "assets/js/util/common";
import specificTable from "components/utils/specificTable";
import { EleResize } from "assets/js/util/esresize";
export default {
  components: { pageBaseScroll },
  data() {
    return {
      searchParam: {
        personList: ["B4009B864068C706A0ED408167E7A03AFCCA8BF95E698A30"],
        chargingTime: ["20160701", "20161231"]
      }
    };
  },
  methods: {
    async query() {
      let param = {};
      param = shallowCopyObj(this.searchParam, param);
      param.startDate = this.searchParam.chargingTime[0];
      param.endDate = this.searchParam.chargingTime[1];
      let personData = [];
      await this.$http
        .post("/knowledgeGraph/query", param)
        .then(res => {
          if (res.status === 200) {
            personData = res.data.data;
          }
        })
        .catch(e => {});
      console.log(personData);
    }
  },
  mounted() {
    this.query();
  }
};
</script>

<style></style>
