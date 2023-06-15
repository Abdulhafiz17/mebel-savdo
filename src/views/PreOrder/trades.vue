<template>
  <div class="table-responsive" style="height: 85vh; table-layout: fixed">
    <table class="table table-sm table-hover">
      <thead>
        <tr>
          <th>Kategoriya</th>
          <th>Kodi</th>
          <th>Artikul</th>
          <th>Nomi</th>
          <th>Miqdor</th>
          <th>Narx</th>
          <th>Chegirma</th>
          <th>To'lov</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in trades.data" :key="item">
          <td>{{ item.Warehouse_products.category.name }}</td>
          <td>{{ item.Warehouse_products.name2 }}</td>
          <td>{{ item.Warehouse_products.articul }}</td>
          <td>{{ item.Warehouse_products.name }}</td>
          <td>
            <div class="input-group input-group-sm">
              <input
                class="form-control"
                type="number"
                step="any"
                min="0.1"
                required
                v-model="item.Trades_pre_order.quantity"
                @change="putTrade(item)"
              />
              <div class="input-group-text">dona</div>
            </div>
          </td>
          <td>
            <div class="input-group input-group-sm">
              <input
                class="form-control"
                type="number"
                step="any"
                min="0.1"
                required
                v-model="item.Trades_pre_order.price"
                @change="putTrade(item)"
              />
              <div class="input-group-text">so'm</div>
            </div>
          </td>
          <td>
            <div class="input-group input-group-sm">
              <input
                class="form-control"
                type="number"
                step="any"
                min="0.1"
                v-model="item.Trades_pre_order.discount"
                @change="putTrade(item)"
              />
              <div class="input-group-text">so'm</div>
            </div>
          </td>
          <td>
            {{
              $util.currency(
                (item.Trades_pre_order.price - item.Trades_pre_order.discount) *
                  item.Trades_pre_order.quantity
              ) + " so'm"
            }}
          </td>
          <td>
            <button
              class="btn btn-sm btn-outline-danger"
              @click="deleteTrade(item.Trades_pre_order.id)"
            >
              <i class="fa fa-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="10">
            <Pagination
              :page="trades.current_page"
              :pages="trades.pages"
              :limit="trades.limit"
              @get="getTrades"
            />
          </td>
        </tr>
      </tfoot>
    </table>
  </div>

  <div class="modal fade" id="add-trade" data-backdrop="static">
    <div class="modal-dialog">
      <form class="modal-content" @submit.prevent="postTrade()">
        <div class="modal-header">
          <h4>Mahsulot qo'shish</h4>
        </div>
        <div class="modal-body">
          <div class="row gap-1 text-left">
            <div class="col-12">
              Ombor
              <div class="dropdown">
                <button
                  id="warehouseDropdown"
                  type="button"
                  class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
                  data-toggle="dropdown"
                  @click="getWarehouses()"
                >
                  {{ warehouse?.name || "Ombor tanlang" }}
                </button>
                <div
                  class="dropdown-menu w-100 p-1"
                  aria-labelledby="warehouseDropdown"
                >
                  <ul
                    class="list-group p-1 responsive"
                    style="max-height: 25vh"
                  >
                    <li
                      class="list-group-item p-2"
                      v-for="item in warehouses"
                      :key="item"
                      @click="
                        warehouse = item;
                        products = {
                          current_page: 0,
                          pages: 1,
                          limit: 25,
                          data: [],
                        };
                        product = null;
                      "
                    >
                      {{ item.name }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-12" v-if="warehouse">
              Mahsulot
              <div class="dropdown">
                <button
                  id="customerDropdown"
                  type="button"
                  class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
                  data-toggle="dropdown"
                  @click="getProducts()"
                >
                  {{
                    product
                      ? product.Warehouse_products.category.name +
                        " - " +
                        product.Warehouse_products.name2 +
                        " " +
                        product.Warehouse_products.articul +
                        " " +
                        product.Warehouse_products.name
                      : "Mahsulot tanlang"
                  }}
                  <span class="badge bg-success">
                    {{
                      product
                        ? $util.currency(
                            branch_name == "ОПТОМ"
                              ? product.Warehouse_products.optom_price
                              : product.Warehouse_products.trade_price
                          ) +
                          " " +
                          product.currency
                        : ""
                    }}
                  </span>
                </button>
                <div
                  class="dropdown-menu w-100 p-1"
                  aria-labelledby="customerDropdown"
                >
                  <input
                    class="form-control form-control-sm"
                    placeholder="qidiruv"
                    v-model="search"
                    @keyup="getProducts()"
                  />
                  <ul
                    class="list-group p-1 responsive"
                    style="max-height: 25vh"
                    @scroll="scrollProducts($event)"
                  >
                    <li
                      class="list-group-item p-2"
                      :class="{ 'border border-primary': findProduct(item) }"
                      v-for="item in products.data"
                      :key="item"
                      @click="
                        // product = item;
                        !findProduct(item) && products_for_trade.push(item)
                      "
                    >
                      {{
                        item.Warehouse_products.category.name +
                        " - " +
                        item.Warehouse_products.name2 +
                        " " +
                        item.Warehouse_products.articul +
                        " " +
                        item.Warehouse_products.name
                      }}
                      <span class="badge bg-success">
                        {{
                          $util.currency(item.Warehouse_products.tan_narx) +
                          " " +
                          item.currency
                        }}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-12">
              <ul class="list-group">
                <li
                  class="list-group-item"
                  v-for="(item, index) in products_for_trade"
                  :key="item"
                >
                  <div>
                    {{
                      item.Warehouse_products.category.name +
                      " - " +
                      item.Warehouse_products.name2 +
                      " " +
                      item.Warehouse_products.articul +
                      " " +
                      item.Warehouse_products.name
                    }}
                    <span class="badge bg-success">
                      {{
                        $util.currency(
                          branch_name == "ОПТОМ"
                            ? item.Warehouse_products.optom_price
                            : item.Warehouse_products.trade_price
                        ) +
                        " " +
                        item.currency
                      }}
                    </span>
                    <div class="row p-1" v-if="branch_name == 'ОПТОМ'">
                      <div class="col-6">
                        <button
                          type="button"
                          class="btn btn-sm btn-block btn-outline-primary"
                          @click="
                            item.price = countCurrency(item, 'optom_price')
                          "
                        >
                          Optom narx
                        </button>
                      </div>
                      <div class="col-6">
                        <button
                          type="button"
                          class="btn btn-sm btn-block btn-outline-primary"
                          @click="
                            item.price = countCurrency(item, 'ishonch_price')
                          "
                        >
                          Ishonch narx
                        </button>
                      </div>
                    </div>
                    <div class="input-group input-group-sm p-1">
                      <input
                        type="number"
                        class="form-control"
                        min="0"
                        step="any"
                        required
                        v-model="item.price"
                      />
                      <div class="input-group-text">so'm</div>
                    </div>
                  </div>
                  <button
                    class="btn btn-sm btn-danger"
                    @click="products_for_trade.splice(index, 1)"
                  >
                    <i class="fa fa-sm fa-trash"></i>
                  </button>
                </li>
              </ul>
            </div>
            <!-- <label class="col-12" v-if="product">
              Miqdor
              <div class="input-group input-group-sm">
                <input
                  class="form-control"
                  type="number"
                  step="any"
                  min="0.1"
                  required
                  v-model="trade.quantity"
                />
                <div class="input-group-text">dona</div>
              </div>
            </label>
            <label class="col-12" v-if="product">
              Narx
              <div class="input-group input-group-sm">
                <input
                  class="form-control"
                  type="number"
                  step="any"
                  min="0.1"
                  required
                  v-model="trade.price"
                />
                <div class="input-group-text">so'm</div>
              </div>
            </label>
            <label class="col-12" v-if="product">
              Chegirma
              <div class="input-group input-group-sm">
                <input
                  class="form-control"
                  type="number"
                  step="any"
                  min="0.1"
                  v-model="trade.discount"
                />
                <div class="input-group-text">so'm</div>
              </div>
            </label> -->
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-primary">
            <i class="far fa-circle-check"></i>
          </button>
          <button
            class="btn btn-outline-danger"
            data-dismiss="modal"
            close-trade-modal
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
import Pagination from "@/components/Pagination/Pagination.vue";
export default {
  name: "trades",
  props: {
    order: null,
  },
  components: { Pagination },
  data() {
    return {
      branch_name: localStorage["branch_name"],
      warehouses: [],
      warehouse: null,
      search: "",
      products: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
      product: null,
      products_for_trade: [],
      trade: {
        warehouse_pr_id: 0,
        quantity: null,
        price: null,
        discount: null,
        pre_order_id: 0,
      },
      trades: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
    };
  },
  created() {
    this.getTrades(0, 25);
  },
  methods: {
    getTrades(page, limit) {
      api
        .preOrderTrades(this.order.Pre_orders.id, 0, page, limit)
        .then((res) => {
          this.trades = res.data;
          this.getBalance();
        });
    },
    getBalance() {
      api.preOrderTradeBalance(this.order.Pre_orders.id).then((res) => {
        this.$parent.balance = res.data;
      });
    },
    postTrade() {
      // this.trade.pre_order_id = this.order.Pre_orders.id;
      // this.trade.warehouse_pr_id = this.product.Warehouse_products.id;
      // this.trade.discount = this.trade.discount || 0;
      let data = [];
      this.products_for_trade.forEach((item) => {
        data.push({
          warehouse_pr_id: item.Warehouse_products.id,
          quantity: 1,
          price: item.price,
          discount: 0,
          pre_order_id: this.order.Pre_orders.id,
        });
      });
      api.tradeToPreOrder2(data).then(() => {
        api.success("close-trade-modal").then(() => {
          this.warehouse = null;
          this.product = null;
          this.products_for_trade = [];
          this.trade = {
            warehouse_pr_id: 0,
            quantity: null,
            price: null,
            discount: null,
            pre_order_id: 0,
          };
          this.getTrades(0, 25);
        });
      });
    },
    putTrade(item) {
      const data = {
        id: item.Trades_pre_order.id,
        quantity: item.Trades_pre_order.quantity,
        price: item.Trades_pre_order.price,
        discount: item.Trades_pre_order.discount || 0,
      };
      api.updateTradeToPreOrder(data).then(() => {
        api.success();
      });
    },
    deleteTrade(id) {
      api.deleteTradeToPreOrder(id).then(() => {
        api.success().then(() => {
          this.getTrades(0, 25);
        });
      });
    },
    getWarehouses() {
      api.warehouses().then((res) => {
        this.warehouses = res.data;
      });
    },
    getProducts() {
      api
        .warehouseProducts(this.warehouse.id, this.search, 0, 0, 25, false)
        .then((res) => {
          this.products.current_page = res.data.current_page;
          this.products.pages = res.data.pages;
          this.products.limit = res.data.limit;
          this.products.data = res.data.data;
          this.products.data.forEach((item) => {
            item.price =
              this.branch_name == "ОПТОМ"
                ? this.countCurrency(item, "optom_price")
                : this.countCurrency(item, "trade_price");
          });
        });
    },
    scrollProducts(event) {
      const div = event.target;
      if (div.scrollTop + div.clientHeight == div.scrollHeight) {
        if (this.products.current_page < this.products.pages - 1) {
          api
            .warehouseProducts(
              this.warehouse.id,
              this.search,
              0,
              this.products.current_page + 1,
              25,
              false
            )
            .then((res) => {
              this.products.current_page = res.data.current_page;
              this.products.data = this.products.data.concat(res.data.data);
              this.products.data.forEach((item) => (item.price = null));
            });
        }
      }
    },
    findProduct(product) {
      const result = this.products_for_trade.find((item) => {
        return item.Warehouse_products.id == product.Warehouse_products.id;
      });
      return result;
    },
    countCurrency(product, price) {
      return product.Warehouse_products[price] * product.trade_cur.price;
    },
  },
};
</script>
