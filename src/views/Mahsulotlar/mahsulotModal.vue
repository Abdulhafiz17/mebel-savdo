<template>
  <button
    v-show="false"
    data-toggle="modal"
    data-target="#put"
    put-modal-button
  ></button>
  <div class="modal fade" id="put">
    <div class="modal-dialog">
      <form class="modal-content" @submit.prevent="postOrder()">
        <div class="modal-header">
          <h4>Ombordan mahsulot olish</h4>
        </div>
        <div class="modal-body">
          <h5>
            {{
              product?.Warehouse_products?.category?.name +
              " " +
              product?.Warehouse_products?.articul +
              " " +
              product?.Warehouse_products?.name
            }}
          </h5>
          <div class="row gap-1 text-left">
            <div class="col-12">
              Miqdor
              <div class="input-group">
                <input
                  type="number"
                  step="any"
                  min="1"
                  class="form-control"
                  required
                  v-model="quantity"
                />
                <div class="input-group-text">dona</div>
              </div>
            </div>
            <div class="col-12">
              Sana
              <input type="date" class="form-control" required v-model="date" />
            </div>
            <div class="col-12">
              Izoh
              <textarea
                class="form-control"
                cols="30"
                rows="2"
                v-model="comment"
              ></textarea>
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
            close-put-modal
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
  name: "mahsulotModal",
  data() {
    return {
      product: null,
      quantity: null,
      warehouse_id: null,
      date: "",
      comment: "",
    };
  },
  methods: {
    start(product) {
      this.product = product;
      this.warehouse_id = product.Warehouses.id;
      document.querySelector(`[put-modal-button]`).click();
    },
    postOrder() {
      const data = {
        category_id: this.product.Warehouse_products.category_id,
        articul: this.product.Warehouse_products.articul,
        name: this.product.Warehouse_products.name,
        name2: this.product.Warehouse_products.name2,
        quantity: this.quantity,
        warehouse_id: this.warehouse_id,
        date: this.date,
        comment: this.comment,
      };
      api.createOrderFromBranch(data).then(() => {
        api.success("close-put-modal").then(() => {
          this.$parent.get();
        });
      });
    },
  },
};
</script>
