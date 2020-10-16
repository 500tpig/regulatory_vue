<template>
  <slide-verify
    :l="42"
    :r="10"
    :w="310"
    :h="155"
    slider-text="msg"
    @success="onSuccess"
    @fail="onFail"
    @refresh="onRefresh"
  ></slide-verify>
</template>

<script>
export default {
  name: "SliderVerify",
  data() {
    return {
      msg: "",
      images: []
    };
  },
  methods: {
    onSuccess() {
      this.$emit("callback");
    },
    onFail() {
      this.msg = "验证失败，请重试";
    },
    onRefresh() {
      this.msg = "";
    }
  }
};
</script>

<style></style>
