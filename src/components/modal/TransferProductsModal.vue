<template>
  <button
    v-show="false"
    data-toggle="modal"
    data-target="#transfer-product"
  ></button>
  <div class="modal fade" id="transfer-product">
    <div class="modal-dialog">
      <form class="modal-content" @submit.prevent="transferProduct()">
        <div class="modal-header"><h5>Transfer</h5></div>
        <div class="modal-body">
          <div class="row gap-1 text-left">
            <div class="col-12">
              Miqdor
              <div class="input-group">
                <input
                  type="number"
                  class="form-control"
                  min="0"
                  required
                  v-model="transfer_product.quantity"
                />
                <div class="input-group-text">dona</div>
              </div>
            </div>
            <div class="col-23">
              Ombor
              <select
                class="form-select"
                required
                v-model="transfer_product.to_"
              >
                <option v-for="item in warehouses" :key="item" :value="item.id">
                  {{ item.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-primary">
            <i class="far fa-circle-check"></i>
          </button>
          <button
            class="btn btn-outline-danger"
            data-dismiss="modal"
            close-transfer-product
          >
            <i class="far fa-circle-xmark"></i>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import * as api from "@/components/Api/Api.js";
export default {
  name: "TransferProductModal",
  emits: ["end"],
  data() {
    return {
      warehouses: [],
      transfer_product: {
        code: 0,
        quantity: null,
        to_: 0,
      },
    };
  },
  created() {
    this.getWarehouses();
  },
  methods: {
    start(code) {
      this.transfer_product = {
        code: code,
        quantity: null,
        to_: 0,
      };
      document.querySelector(`[data-target="#transfer-product"]`).click();
    },
    getWarehouses() {
      api.warehouses().then((res) => {
        this.warehouses = res.data;
      });
    },
    transferProduct() {
      api.transferProduct2(Array(this.transfer_product)).then(() => {
        api.success("close-transfer-product").then(() => {
          this.$emit("end");
        });
      });
    },
  },
};
</script>
