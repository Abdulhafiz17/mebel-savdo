<template>
  <button
    v-show="false"
    data-toggle="modal"
    data-target="#put"
    put-modal-button
  ></button>
  <div class="modal fade" id="put">
    <div class="modal-dialog">
      <form class="modal-content" @submit.prevent="putProduct()">
        <div class="modal-header">
          <h4>Kpi biriktirish</h4>
        </div>
        <div class="modal-body">
          <h5>
            {{
              product?.Warehouse_products?.category?.name +
              " " +
              product?.Warehouse_products?.name +
              " " +
              product?.Warehouse_products?.articul +
              " " +
              product?.Warehouse_products?.name2
            }}
          </h5>
          <div class="text-left">
            Kpi narxi
            <div class="input-group">
              <input
                type="number"
                step="any"
                min="1"
                class="form-control"
                required
                v-model="kpi"
              />
              <div class="input-group-text">so'm</div>
            </div>
          </div>
          <div class="text-left">
            Kpi savdo narxi
            <div class="input-group">
              <input
                type="number"
                step="any"
                min="1"
                class="form-control"
                required
                v-model="kpi_trade"
              />
              <div class="input-group-text">so'm</div>
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
      kpi: null,
      kpi_trade: null,
    };
  },
  methods: {
    start(product) {
      this.product = product;
      this.kpi = product.Warehouse_products.kpi;
      this.kpi_trade = product.Warehouse_products.kpi_trade;
      document.querySelector(`[put-modal-button]`).click();
    },
    putProduct() {
      const data = {
        category_id: this.product.Warehouse_products.category_id,
        articul: this.product.Warehouse_products.articul,
        name: this.product.Warehouse_products.name,
        kpi: this.kpi,
        kpi_trade: this.kpi_trade,
      };
      api.updateKpiWarehouseProduct(data).then(() => {
        api.success("close-put-modal").then(() => {
          this.$parent.page = 0;
          this.$parent.pages = 1;
          this.$parent.limit = 50;
          this.$parent.getCategories(0, 50);
        });
      });
    },
  },
};
</script>
