<template>
  <div class="table-responsive mt-1" v-if="trades.data.length">
    <table class="table table-sm table-hover">
      <thead>
        <tr>
          <th>Kategoriya</th>
          <th>Kodi</th>
          <th>Artikul</th>
          <th>Nomi</th>
          <th v-if="price">Narx</th>
          <th v-if="price">Chegirma</th>
          <th>Miqdor</th>
          <th v-if="price">Qaytarilgan</th>
          <th v-if="price">Summa</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in trades.data" :key="i">
          <td>
            {{ i.Categories.name }}
          </td>
          <td>
            {{ i.Products.name2 }}
          </td>
          <td>
            {{ i.Products.articul }}
          </td>
          <td>
            {{ i.Products.name }}
          </td>
          <td v-if="price">
            {{ Intl.NumberFormat().format(i.Trades.price) + " so'm" }}
          </td>
          <td v-if="price">
            {{ Intl.NumberFormat().format(i.Trades.discount) + " so'm" }}
          </td>
          <td>
            {{ i.sum_quantity + " dona" }}
          </td>
          <td v-if="price">
            {{ findProduct(i) + " dona" }}
          </td>
          <td v-if="price">
            {{
              Intl.NumberFormat().format(
                (i.Trades.price - i.Trades.discount) * i.sum_quantity
              ) + " so'm"
            }}
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
</template>

<script>
import * as api from "@/components/Api/Api.js";
import Pagination from "@/components/Pagination/Pagination.vue";
export default {
  name: "trades",
  components: { Pagination },
  data() {
    return {
      order_id: 0,
      trades: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
      returned_products: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
    };
  },
  computed: {
    price() {
      if (
        ["admin", "branch_admin", "seller"].includes(this.$util.storage("role"))
      )
        return true;
      else return false;
    },
  },
  methods: {
    start(order_id) {
      this.trades = {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      };
      this.returned_products = {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      };
      this.order_id = order_id;

      this.getTrades(0, 25);
    },
    getTrades(page, limit) {
      api.trades(this.order_id, page, limit).then((Response) => {
        this.trades = Response.data;
        this.getReturnedProducts();
      });
    },
    getReturnedProducts() {
      api.returnedProducts(this.order_id, 0, 100).then((Response) => {
        this.returned_products = Response.data;
      });
    },
    findProduct(trade) {
      const product = this.returned_products.data.find((item) => {
        return trade.Trades.code == item.Returned_products.code;
      });
      if (product) {
        return product.sum_quantity;
      } else {
        return 0;
      }
    },
  },
};
</script>
