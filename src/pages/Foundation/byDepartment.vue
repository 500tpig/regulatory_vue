<template>
  <q-page>
    <page-base-scroll content_class="q-pt-lg q-mb-xl">
      <transition-group
        appear
        enter-active-class="animated bounceInLeft"
        leave-active-class="animated bounceOutRight"
      >
        <!-- We wrap a "p" tag and a QBtn -->
        <p key="text">
          Lorem Ipsum
        </p>
        <q-btn key="email-button" color="secondary" icon="mail" label="Email" />
      </transition-group>
    </page-base-scroll>
  </q-page>
</template>

<script>
import pageBaseScroll from "components/utils/PageScroll";
export default {
  components: { pageBaseScroll: pageBaseScroll }
};
</script>

<style></style>
