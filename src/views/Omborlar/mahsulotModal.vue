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
            Kpi ustanovka narxi
            <div class="input-group">
              <input
                type="number"
                step="any"
                min="1"
                class="form-control"
                required
                v-model="update_product.kpi"
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
                v-model="update_product.kpi_trade"
              />
              <div class="input-group-text">so'm</div>
            </div>
          </div>
          <div class="text-left">
            Minimal qoldiq
            <div class="input-group">
              <input
                type="number"
                step="any"
                min="1"
                class="form-control"
                required
                v-model="update_product.warning_quantity"
              />
            </div>
          </div>
          <div class="text-left">
            Optom narx
            <div class="input-group">
              <input
                type="number"
                step="any"
                min="1"
                class="form-control"
                required
                v-model="update_product.optom_price"
              />
              <div class="input-group-append">
                <select
                  class="form-select"
                  required
                  v-model="update_product.trade_currency_id"
                >
                  <option
                    v-for="item in currencies"
                    :key="item"
                    :value="item.id"
                  >
                    {{ item.currency }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div class="text-left">
            Sotuv narx
            <div class="input-group">
              <input
                type="number"
                step="any"
                min="1"
                class="form-control"
                required
                v-model="update_product.trade_price"
              />
              <div class="input-group-text">so'm</div>
            </div>
          </div>
          <div class="text-left">
            Ishonch narx
            <div class="input-group">
              <input
                type="number"
                step="any"
                min="1"
                class="form-control"
                required
                v-model="update_product.ishonch_price"
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
  emits: {
    close: null,
  },
  data() {
    return {
      currencies: [],
      update_product: {
        category_id: 0,
        articul: "",
        name: "",
        name2: "",
        kpi: null,
        kpi_trade: null,
        warning_quantity: null,
        trade_price: 0,
        optom_price: 0,
        ishonch_price: 0,
        trade_currency_id: 0,
      },
      product: null,
    };
  },
  computed: {
    currency() {
      return this.currencies.find((item) => {
        return this.update_product.trade_currency_id == item.id;
      })?.currency;
    },
  },
  created() {
    this.getCurrencies();
  },
  methods: {
    start(product) {
      this.product = product;
      this.update_product.category_id = product.Warehouse_products.category.id;
      this.update_product.articul = product.Warehouse_products.articul;
      this.update_product.name = product.Warehouse_products.name;
      this.update_product.name2 = product.Warehouse_products.name2;
      this.update_product.kpi = product.Warehouse_products.kpi;
      this.update_product.kpi_trade = product.Warehouse_products.kpi_trade;
      this.update_product.warning_quantity =
        product.Warehouse_products.warning_quantity;
      this.update_product.trade_price = product.Warehouse_products.trade_price;
      this.update_product.optom_price = product.Warehouse_products.optom_price;
      this.update_product.ishonch_price =
        product.Warehouse_products.ishonch_price;
      this.update_product.trade_currency_id =
        product.Warehouse_products.trade_currency_id;
      document.querySelector(`[put-modal-button]`).click();
    },
    getCurrencies() {
      api.currencies().then((res) => {
        this.currencies = res.data;
      });
    },
    putProduct() {
      api.updateKpiWarehouseProduct(this.update_product).then(() => {
        api.success("close-put-modal").then(() => {
          this.$emit("close");
        });
      });
    },
  },
};
</script>
