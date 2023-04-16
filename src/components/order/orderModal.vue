<template>
  <button
    v-show="false"
    data-toggle="modal"
    data-target="#order"
    order-modal-button
  ></button>
  <div class="modal fade" id="order">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-body">
          <order ref="order" />
          <trades ref="trades" />
          <hr />
          <div class="d-flex justify-content-end">
            <button class="btn btn-outline-danger" data-dismiss="modal">
              <i class="far fa-circle-xmark" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import order from "./order.vue";
import trades from "./trades.vue";
export default {
  name: "orderModal",
  components: { order, trades },
  data() {
    return {
      timeout: null,
    };
  },
  methods: {
    start(order_id) {
      this.$refs.order.start(order_id);
      this.$refs.trades.start(order_id);
      this.showModal();
    },
    showModal() {
      this.timeout = null;
      this.timeout = setTimeout(() => {
        document.querySelector(`[order-modal-button]`).click();
      }, 100);
    },
  },
};
</script>

<style scoped>
hr {
  margin-left: -15px;
  margin-right: -15px;
}
</style>
