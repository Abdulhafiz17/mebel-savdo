<template>
  <div class="view responsive" v-show="show">
    <button class="btn btn-close btn-danger" @click="show = false"></button>
    <pre>{{ $parent.transfers_to_send }}</pre>
  </div>
</template>

<script>
export default {
  name: "transfer-receipt",
  data() {
    return {
      show: false,
    };
  },
};
</script>

<style scoped>
.view {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgb(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  z-index: 10;
}
</style>
