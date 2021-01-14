<template>
  <q-card class="q-pa-md row" style="max-width: 80vw;">
    <q-table
      :title="title"
      :data="data"
      :columns="columns"
      row-key="no"
      :filter="filter"
      :selected-rows-label="getSelectedString"
      :selection="selection"
      :selected.sync="selected"
      :rows-per-page-options="pageOptions"
      class="my-sticky-header-table"
    >
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Search"
          :input-style="{ color: '#FFFFFF' }"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
    <div class="q-ml-md">
      <div class="row justify-center q-pa-md">
        <div class="text-h6">已选{{ title }}</div>
      </div>
      <q-scroll-area style="height: 400px;width:400px;">
        <div style="width:100%;" class="row wrap justify-center">
          <q-chip
            v-for="(item, index) in selected"
            :key="index"
            removable
            color="primary"
            text-color="white"
            @remove="remove(index)"
          >
            {{ item.column }}
            <q-tooltip
              content-class="bg-white text-black shadow-4 text-weight-medium"
              :offset="[10, 10]"
            >
              {{ item.column }}
            </q-tooltip>
          </q-chip>
        </div>
      </q-scroll-area>
      <div class="row justify-evenly">
        <q-btn color="warning" label="Reset" @click="reset" class="q-mt-sm" />
        <q-btn
          color="primary"
          label="Confirm"
          @click="confirm"
          class="q-mt-sm"
        />
      </div>
    </div>
  </q-card>
</template>
<script>
export default {
  props: {
    url: String,
    searchParam: Object,
    columns: Array,
    title: String,
    selection: String
  },
  // props: ["url", "searchParam", "columns", "title", selection:],
  data() {
    return {
      pageOptions: [10, 15, 20, 25, 50, 0],
      filter: "",
      selected: [],
      data: []
    };
  },
  methods: {
    confirm() {
      this.$emit("selectConfirm", this.selected);
    },
    reset() {
      this.selected = [];
    },
    remove(index) {
      this.selected.splice(index, 1);
    },
    getSelectedString() {
      return this.selected.length === 0
        ? ""
        : `${this.selected.length} record${
            this.selected.length > 1 ? "s" : ""
          } selected of ${this.data.length}`;
    }
  },
  mounted() {
    let param = {
      endDate: this.searchParam.chargingTime[1],
      startDate: this.searchParam.chargingTime[0],
      type: this.searchParam.type
    };
    this.$http
      .post(this.url, param)
      .then(res => {
        if (res.status === 200) {
          this.data = res.data.data;
        }
      })
      .catch(() => {});
  }
};
</script>

<style lang="sass">
.my-sticky-header-table
  /* height or max-height is important */
  max-height: 508px
  min-width: 550px

  .q-table__middle::-webkit-scrollbar
    display: none

  .q-table__top,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #018DA7
    color: #FFFFFF
  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
</style>
