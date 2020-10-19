<template>
  <div class="q-pa-md">
    <div class="row justify-center q-gutter-sm">
      <q-intersection
        v-for="index in 2"
        :key="index"
        transition="scale"
        class="example-item"
      >
        <q-card class="q-ma-sm">
          <img src="https://cdn.quasar.dev/img/mountains.jpg" />

          <q-card-section>
            <div class="text-h6">Card #{{ index }}</div>
            <div class="text-subtitle2">by John Doe</div>
          </q-card-section>
        </q-card>
      </q-intersection>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      image: require("assets/image/1.png")
    };
  }
};
</script>

<style scoped></style>
