<template>
  <div class="row">
    <div class="col-md-3">Oldindan buyurtma</div>
    <div class="col-md">
      <button
        class="btn btn-sm btn-outline-success mb-1"
        :disabled="order"
        @click="createOrder()"
      >
        Buyurtma ochish
      </button>
    </div>
  </div>
</template>

<script>
import * as api from "@/components/Api/Api";
export default {
  name: "preOrder",
  data() {
    return {
      branch_id: localStorage["branch_id"],
      order: null,
    };
  },
  created() {
    this.getOrder();
  },
  methods: {
    getOrder() {
      api.preOrders(0, 0, this.branch_id, false, 0, 0, 0, 1).then((res) => {
        this.order = res.data.data[0];
      });
    },
    createOrder() {
      api.createPreOrder().then(() => {
        api.success().then(() => {
          this.getOrder();
        });
      });
    },
  },
};
</script>
