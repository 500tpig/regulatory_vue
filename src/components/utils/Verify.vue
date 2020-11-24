<template>
  <slide-verify
    :l="42"
    :r="10"
    :w="310"
    :h="155"
    slider-text="请滑动验证"
    @success="onSuccess"
    @fail="onFail"
    @refresh="onRefresh"
    :imgs="images"
  ></slide-verify>
</template>

<script>
export default {
  name: "SliderVerify",
  data() {
    return {
      msg: "",
      images: [require("assets/image/pp.png")]
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
