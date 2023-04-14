<template>
  <h3>
    <span class="fa fa-handshake" />
    {{ customer ? "Mijoz " + customer.name : "Mijoz" }}
  </h3>
  <div class="row">
    <div class="col-md-1"></div>
    <div
      class="col-md-10 my-1 d-flex justify-content-around align-items-center text-center"
    >
      <span>
        Umumiy savdo:
        <strong>{{ Intl.NumberFormat().format(sum_trade) }} so'm</strong>
      </span>
      <span>
        Umumiy chegirma:
        <strong>{{ Intl.NumberFormat().format(sum_discount) }} so'm</strong>
      </span>
      <span>
        Umumiy qaytarilgan mahsulot:
        <strong>{{ Intl.NumberFormat().format(sum_return) }} so'm</strong>
      </span>
    </div>
    <div class="col-md-1"></div>
  </div>
  <hr />
  <div class="body">
    <details v-for="item in orders" :key="item" :id="item.id">
      <summary @click="getLoan(item)">
        <h5>Buyurtma - {{ item.ordinal_number }}</h5>
        <strong>{{ item.time.substring(0, item.time.length - 9) }}</strong>
      </summary>
      <div class="row my-1" v-if="order && income.length && balance">
        <div class="col-md-4">
          Buyurtma summasi
          <br />
          {{ Intl.NumberFormat().format(balance.total_price) + " so'm" }}
        </div>
        <div class="col-md-4">
          To'lov summa
          <br />
          <span v-for="(i, index) in income" :key="i">
            {{
              i.Incomes.comment +
              ": " +
              Intl.NumberFormat().format(i.Incomes.money) +
              " so'm" +
              (index !== income.length - 1 ? ", " : "")
            }}
            <br />
          </span>
        </div>
        <div class="col-md-4">
          Nasiya summa
          <br />
          {{
            Intl.NumberFormat().format(
              balance.total_price -
                (income[0].Incomes.money +
                  (income[1] ? income[1].Incomes.money : 0)) -
                order.discount >
                0
                ? balance.total_price -
                    (income[0].Incomes.money +
                      (income[1] ? income[1].Incomes.money : 0)) -
                    order.discount
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
                {{ i.Categories.name + " - " + i.Products.articul }}
              </td>
              <td>
                {{ Intl.NumberFormat().format(i.Trades.price) + " so'm" }}
              </td>
              <td>
                {{ Intl.NumberFormat().format(i.Trades.discount) + " so'm" }}
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
                  ) + " so'm"
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
    <Pagination :page="page" :pages="pages" :limit="limit" @get="getOrders" />
  </div>
</template>

<script>
import * as api from "@/components/Api/Api";
import Pagination from "@/components/Pagination/Pagination.vue";
export default {
  name: "Mijoz",
  components: { Pagination },
  data() {
    return {
      page: 0,
      pages: 1,
      limit: 50,
      page_2: 0,
      pages_2: 1,
      limit_2: 50,
      from_date: "",
      to_date: "",
      customer: null,
      sum_trade: null,
      sum_discount: null,
      sum_return: null,
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
    this.getCustomer(0, 50);
  },
  methods: {
    getCustomer(page, limit) {
      api.customer(this.$route.params.id).then((Response) => {
        this.customer = Response.data;
        this.getOrders(page, limit);
      });
    },
    getOrders(page, limit) {
      api
        .customerOrders(
          this.$route.params.id,
          this.from_date,
          this.to_date,
          page,
          limit
        )
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.orders = Response.data.data;
          this.sum_trade = Response.data.sum_trade_balance;
          this.sum_discount = Response.data.sum_discount;
          this.sum_return = Response.data.sum_returned_money;
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

<style></style>
