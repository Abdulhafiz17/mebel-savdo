<template>
  <div
    class="table-responsive shadow"
    style="height: 85vh; table-layout: fixed"
  >
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
                      ? product.Categories.name +
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
                        ? $util.currency(product.Warehouse_products.tan_narx) +
                          " so'm"
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
                      v-for="item in products.data"
                      :key="item"
                      @click="product = item"
                    >
                      {{
                        item.Categories.name +
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
                          " so'm"
                        }}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <label class="col-12" v-if="product">
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
            </label>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-primary" v-if="product">
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
      search: "",
      products: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
      product: null,
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
      api.preOrderTrades(this.order.Pre_orders.id, page, limit).then((res) => {
        this.trades = res.data;
      });
    },
    postTrade() {
      this.trade.pre_order_id = this.order.Pre_orders.id;
      this.trade.warehouse_pr_id = this.product.Warehouse_products.id;
      this.trade.discount = this.trade.discount || 0;
      api.tradeToPreOrder(this.trade).then(() => {
        api.success("close-trade-modal").then(() => {
          this.product = null;
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
    getProducts() {
      const search = this.search.length ? Array({ search: this.search }) : [];
      api.allProducts(search, 0, 25, 0, 25).then((res) => {
        this.products.current_page = res.data.current_page_w;
        this.products.pages = res.data.pages_w;
        this.products.limit = res.data.limit_w;
        this.products.data = res.data.data_w;
      });
    },
    scrollProducts(event) {
      const div = event.target;
      if (div.scrollTop + div.clientHeight == div.scrollHeight) {
        if (this.products.current_page < this.products.pages - 1) {
          const search = this.search.length
            ? Array({ search: this.search })
            : [];
          api
            .allProducts(search, this.products.current_page + 1, 25, 0, 25)
            .then((res) => {
              this.products.current_page = res.data.current_page_w;
              this.products.data = this.products.data.concat(res.data.data_w);
            });
        }
      }
    },
  },
};
</script>
