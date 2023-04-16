<template>
  <h3>
    <span class="fa fa-user" /> {{ user ? "Hodim " + user.name : "Hodim" }}
  </h3>
  <div class="row my-1">
    <div class="col-md-5">
      <input
        type="date"
        class="form-control form-control-sm"
        v-model="from_date_2"
      />
    </div>
    <div class="col-md-5">
      <input
        type="date"
        class="form-control form-control-sm"
        v-model="to_date_2"
      />
    </div>
    <div class="col-md-2">
      <button
        class="btn btn-sm btn-block btn-outline-secondary"
        @click="getOrders(0, 100)"
      >
        <i class="far fa-circle-check" />
      </button>
    </div>
  </div>
  <div class="responsive" style="max-height: 65vh">
    <details v-for="item in orders" :key="item" :id="item.id">
      <summary @click="getLoan(item)">
        <h5>Buyurtma - {{ item.ordinal_number }}</h5>
        <h5>Mijoz: {{ item.customer ? item.customer.name : "Umumiy" }}</h5>
        <strong>{{ item.time.substring(0, item.time.length - 9) }}</strong>
      </summary>
      <div class="row my-1" v-if="order && income.length && balance">
        <div class="col-md-4">
          Buyurtma summasi
          <br />
          {{
            Intl.NumberFormat().format(balance.total_price) +
            " " +
            balance.currency
          }}
        </div>
        <div class="col-md-4">
          To'lov summa
          <br />
          <span v-for="(i, index) in income" :key="i">
            {{
              i.Incomes.comment +
              ": " +
              Intl.NumberFormat().format(i.Incomes.money) +
              " " +
              i.currency +
              (index !== income.length - 1 ? ", " : "")
            }}
            <br />
          </span>
        </div>
        <div class="col-md-3">
          Yetkazilganda olinadigan summa
          <br />
          {{ Intl.NumberFormat().format(order.delivery_money) + " so'm" }}
        </div>
        <div class="col-md-3">
          Nasiya summa
          <br />
          {{
            Intl.NumberFormat().format(
              balance.total_price -
                (income[0].Incomes.money +
                  (income[1] ? income[1].Incomes.money : 0)) -
                order.discount -
                order.delivery_money >
                0
                ? balance.total_price -
                    (income[0].Incomes.money +
                      (income[1] ? income[1].Incomes.money : 0)) -
                    order.discount -
                    order.delivery_money
                : 0
            ) + " so'm"
          }}
        </div>
      </div>
      <div class="table-responsive my-1" v-if="trades.length">
        <table class="table table-sm table-hover">
          <thead>
            <tr>
              <th>Mahsulot</th>
              <th>Narx</th>
              <th>Chegirma</th>
              <th>Miqdor</th>
              <th>Qaytarilgan</th>
              <th>Summa</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in trades" :key="i">
              <td>
                {{
                  i.Categories.name +
                  " - " +
                  i.Products.articul +
                  " - " +
                  i.Products.size
                }}
              </td>
              <td>
                {{
                  Intl.NumberFormat().format(i.Trades.price) +
                  " " +
                  i.Currencies.currency
                }}
              </td>
              <td>
                {{
                  Intl.NumberFormat().format(i.Trades.discount) +
                  " " +
                  i.Currencies.currency
                }}
              </td>
              <td>
                {{ i.sum_quantity + " dona" }}
              </td>
              <td>
                {{
                  (returned_products.find((item) => {
                    return i.Trades.code == item.Returned_products.code;
                  })
                    ? returned_products.find((item) => {
                        return i.Trades.code == item.Returned_products.code;
                      }).sum_quantity
                    : "0") + " dona"
                }}
              </td>
              <td>
                {{
                  Intl.NumberFormat().format(
                    (i.Trades.price - i.Trades.discount) * i.sum_quantity
                  ) +
                  " " +
                  i.Currencies.currency
                }}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="6">
                <Pagination
                  :page="page_2"
                  :pages="pages_2"
                  :limit="limit_2"
                  @get="getTrades"
                />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </details>
  </div>
  <Pagination :page="page" :pages="pages" :limit="limit" @get="getOrders" />
</template>

<script>
import * as api from "@/components/Api/Api";
import Pagination from "../../components/Pagination/Pagination.vue";
export default {
  name: "Hodim",
  components: { Pagination },
  data() {
    return {
      page: 0,
      pages: 1,
      limit: 100,
      page_2: 0,
      pages_2: 1,
      limit_2: 100,
      user: null,
      from_date: "",
      to_date: "",
      expenses: [],
      from_date_2: "",
      to_date_2: "",
      orders: [],
      order: null,
      loan: null,
      income: [],
      balance: null,
      trades: [],
      returned_products: [],
    };
  },
  created() {
    this.getUser(0, 100);
  },
  methods: {
    getUser(page, limit) {
      api.thisUser(this.$route.params.id).then((Response) => {
        this.user = Response.data;
        this.getOrders(page, limit);
      });
    },
    getOrders(page, limit) {
      api
        .orders(
          this.from_date_2,
          this.to_date_2,
          true,
          this.$route.params.id,
          0,
          "",
          page,
          limit
        )
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.orders = Response.data.data;
          this.orders.forEach((item) => {
            item.trades = [];
          });
        });
    },
    getLoan(order) {
      this.loan = null;
      this.income = [];
      this.balance = null;
      this.trades = [];
      this.returned_products = [];
      document.querySelectorAll("details").forEach((details) => {
        if (Number(details.id) !== order.id) {
          details.removeAttribute("open");
        }
      });
      this.order = order;
      if (order.customer) {
        api.loan(order.customer.id).then((Response) => {
          this.loan = Response.data;
          this.getIncome(order.id);
        });
      } else {
        this.getIncome(order.id);
      }
    },
    getIncome(id) {
      api.incomes(id, "order", 0, 100).then((Response) => {
        this.income = Response.data.data;
        this.getBalance(id);
      });
    },
    getBalance(id) {
      api.tradeBalance(id).then((Response) => {
        this.balance = Response.data;
        this.getTrades(0, 100);
      });
    },
    getTrades(page, limit) {
      api.trades(this.order.id, page, limit).then((Response) => {
        this.page_2 = Response.data.current_page;
        this.pages_2 = Response.data.pages;
        this.trades = Response.data.data;
        this.getReturnedProducts(this.order.id, page, limit);
      });
    },
    getReturnedProducts(id, page, limit) {
      api.returnedProducts(id, page, limit).then((Response) => {
        this.returned_products = Response.data.data;
      });
    },
  },
};
</script>

<style scoped>
.input-group {
  justify-content: center;
}
</style>
