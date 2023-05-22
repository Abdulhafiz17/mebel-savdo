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
          <preOrder
            ref="order"
            v-if="['admin', 'branch_admin', 'cashier'].includes(role)"
          />
          <preOrderTrades ref="trades" />
          <hr />
          <div class="d-flex justify-content-end">
            <button
              class="btn btn-outline-success mx-1"
              data-dismiss="modal"
              @click="$refs.orderGallery.start(order_id, 'pre_order')"
            >
              <i class="fa fa-image"></i>
            </button>
            <button
              v-if="printable"
              class="btn btn-outline-primary mx-1"
              @click="$refs.check.start(order)"
            >
              <i class="fa fa-print"></i>
            </button>
            <button
              v-if="returnable"
              class="btn btn-outline-info mx-1"
              @click="routerToReturn()"
            >
              <i class="fa fa-undo" />
            </button>
            <button class="btn btn-outline-danger mx-1" data-dismiss="modal">
              <i class="far fa-circle-xmark" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <check :order-id="order_id" ref="check" />

  <orderGallery ref="orderGallery" />
</template>

<script>
import preOrder from "./preOrder.vue";
import preOrderTrades from "./preOrderTrades.vue";
import check from "@/components/order/preOrderCheck.vue";
import orderGallery from "./orderGallery.vue";
export default {
  name: "preOrderModal",
  props: {
    printable: { default: false },
    returnable: { default: false },
  },
  components: { preOrder, preOrderTrades, check, orderGallery },
  data() {
    return {
      role: localStorage["role"],
      order_id: 0,
      order: null,
      timeout: null,
    };
  },
  methods: {
    start(order_id, order) {
      this.order_id = order_id;
      this.order = order;

      if (["admin", "branch_admin", "cashier"].includes(this.role))
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
    routerToReturn() {
      localStorage.setItem("order_id_for_return", this.order_id);
      const buttons = document.querySelectorAll(`[data-dismiss="modal"]`);
      buttons.forEach((item) => {
        item.click();
      });
      this.$router.push("/return");
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
