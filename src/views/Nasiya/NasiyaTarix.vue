<template>
  <h3><span class="fa fa-hand-holding-usd" /> Nasiya</h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1">
      <!-- <div class="input-group input-group-sm">
        <input
          class="form-control"
          type="search"
          placeholder="Qidiruv"
          v-model="search"
        />
        <div class="input-group-append">
          <button
            class="btn btn-block btn-outline-secondary"
            data-toggle="modal"
            data-target="#hodimQoshish"
          >
            <span class="fa fa-user-plus" />
          </button>
        </div>
      </div> -->
    </div>
    <div class="col-md-4"></div>
  </div>
  <hr />
  <div class="body">
    <ul class="nav nav-pills nav-justified mb-3" id="pills-tab" role="tablist">
      <li class="nav-item" role="presentation">
        <button
          class="nav-link active"
          id="pills-home-tab"
          data-bs-toggle="pill"
          data-bs-target="#pills-home"
          type="button"
          role="tab"
          aria-controls="pills-home"
          aria-selected="true"
          @click="get(0, limit)"
        >
          To'lovlar tarixi
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          id="pills-profile-tab"
          data-bs-toggle="pill"
          data-bs-target="#pills-profile"
          type="button"
          role="tab"
          aria-controls="pills-profile"
          aria-selected="false"
          @click="getOrder()"
        >
          Nasiya buyurtmasi
        </button>
      </li>
    </ul>
    <div class="tab-content" id="pills-tabContent">
      <div
        class="tab-pane fade show active"
        id="pills-home"
        role="tabpanel"
        aria-labelledby="pills-home-tab"
      >
        <div class="table-responsive">
          <table class="table table-sm table-hover">
            <thead>
              <tr>
                <th>Summa</th>
                <th>Hodim</th>
                <th>Sana</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in payments" :key="i">
                <td>
                  {{ Intl.NumberFormat().format(i.Incomes.money) + " so'm" }}
                </td>
                <td>
                  {{ i.name }}
                </td>
                <td>
                  {{
                    i.Incomes.time
                      .replace("T", " ")
                      .substring(0, i.Incomes.time.length - 3)
                  }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3">
                  <Pagination
                    :page="page"
                    :pages="pages"
                    :limit="limit"
                    @get="get"
                  />
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <div
        class="tab-pane fade"
        id="pills-profile"
        role="tabpanel"
        aria-labelledby="pills-profile-tab"
      >
        <details v-if="order && income.length && balance">
          <summary>
            <span>
              <h5>Buyurtma - {{ order.Orders.ordinal_number }}</h5>
            </span>
            <span>
              <strong>
                {{
                  order.Orders.time
                    .replace("T", " ")
                    .substring(0, order.Orders.time.length - 3)
                }}
              </strong>
            </span>
          </summary>
          <ul class="list-group">
            <li class="list-group-item">
              Buyurtma summasi:
              {{ Intl.NumberFormat().format(balance.total_price) + " so'm" }}
            </li>
            <li class="list-group-item" v-if="order && balance">
              Chegirma summa:
              {{ Intl.NumberFormat().format(order.Orders.discount) + " so'm" }}
            </li>
            <li class="list-group-item">
              <span>
                To'lov summa:
                <span v-for="(i, index) in income" :key="i">
                  {{
                    (index == 0 ? "" : ", ") +
                    i.Incomes.comment +
                    ": " +
                    Intl.NumberFormat().format(i.Incomes.money) +
                    " so'm"
                  }}
                </span>
              </span>
            </li>
            <li class="list-group-item">
              Nasiya summa:
              {{
                Intl.NumberFormat().format(
                  balance.total_price -
                    (income[0].Incomes.money +
                      (income[1] ? income[1].Incomes.money : 0)) -
                    order.Orders.discount
                ) + " so'm"
              }}
            </li>
          </ul>
        </details>
        <div class="table-responsive my-1">
          <table class="table table-sm table-hover">
            <thead>
              <tr>
                <th>Mahsulot</th>
                <th>Narx</th>
                <th>Chegirma</th>
                <th>Miqdor</th>
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
                    Intl.NumberFormat().format(
                      (i.Trades.price - i.Trades.discount) * i.sum_quantity
                    ) + " so'm"
                  }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="5">
                  <Pagination
                    :page="page1"
                    :pages="pages1"
                    :limit="limit1"
                    @get="getTrades"
                  />
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from "@/components/Api/Api";
import Pagination from "@/components/Pagination/Pagination.vue";
export default {
  name: "NasiyaTarix",
  components: { Pagination },
  data() {
    return {
      page: 0,
      pages: 1,
      limit: 100,
      page1: 0,
      pages1: 1,
      limit1: 100,
      payments: [],
      order: null,
      income: [],
      balance: null,
      trades: [],
    };
  },
  created() {
    this.get(this.page, this.limit);
  },
  methods: {
    get(page, limit) {
      api
        .incomes(this.$route.params.id, "loan", page, limit)
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.limit = Response.data.limit;
          this.payments = Response.data.data;
        });
    },
    getOrder() {
      api.order(this.$route.params.order_id).then((Response) => {
        this.order = Response.data;
        this.getIncome(this.order.Orders.id);
      });
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
      api.trades(this.$route.params.order_id, page, limit).then((Response) => {
        this.page1 = Response.data.current_page;
        this.pages1 = Response.data.pages;
        this.limit1 = Response.data.limit;
        this.trades = Response.data.data;
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
