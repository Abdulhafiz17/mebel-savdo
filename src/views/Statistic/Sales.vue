<template>
  <h4>Savdo</h4>
  <div class="row my-1">
    <div class="col-md-4 my-1">
      <input
        class="form-control form-control-sm"
        type="date"
        v-model="from_date"
      />
    </div>
    <div class="col-md-4 my-1">
      <input
        class="form-control form-control-sm"
        type="date"
        v-model="to_date"
      />
    </div>
    <div class="col-md-3 my-1">
      <button
        class="btn btn-sm btn-block btn-outline-secondary"
        @click="getSumStatistics()"
      >
        <span class="far fa-circle-check" /> Qidirish
      </button>
    </div>
    <div class="col-md-1 my-1">
      <div class="btn-group btn-group-sm w-100">
        <button
          :class="`btn w-100 btn${
            template == 'chart' ? '-' : '-outline-'
          }success template`"
          @click="template = 'chart'"
          @click.passive="prepareChart(days)"
        >
          <i class="fa fa-chart-line" />
        </button>
        <button
          :class="`btn w-100 btn${
            template == 'card' ? '-' : '-outline-'
          }primary template`"
          @click="template = 'card'"
        >
          <i class="fa fa-th-large" />
        </button>
      </div>
    </div>
  </div>
  <div id="sChart" v-if="template == 'chart'">
    <canvas id="salesChart" width="600" height="250" />
  </div>

  <!-- <ul class="list-group" v-if="template == 'card'">
    <li class="list-group-item" data-toggle="modal" data-target="#sum">
      <strong>Umumiy</strong>
    </li>
  </ul> -->

  <div
    v-if="template == 'card'"
    class="responsive p-1"
    style="max-height: 70vh"
  >
    <div class="row">
      <div class="col-md-4 col-sm-6 my-1" v-for="item in days" :key="item">
        <div class="card shadow day">
          <div
            class="card-body"
            data-toggle="modal"
            data-target="#day"
            @click="day = item"
          >
            <strong>{{ item.day }}</strong>
            <hr />
            <span>
              Umumiy tan narx:
              <strong>
                {{ _.format(item.trade_total_tan_narx) + " so'm" }}
              </strong>
            </span>
            <span>
              Umumiy savdo:
              <strong>
                {{ _.format(item.trade_total_price) + " so'm" }}
              </strong>
            </span>
            <span>
              Vozvrat:
              <strong>
                {{ _.format(item.returned_price) + " so'm" }}
              </strong>
            </span>
            <hr />
            <strong>Kirim</strong>
            <span v-show="item.incomes_trade.length">
              Savdo:
              <strong>
                <span
                  v-for="item2 in item.incomes_trade"
                  :key="item2"
                  v-show="item2.sum_price"
                >
                  {{ _.format(item2.sum_price) + " so'm " + item2.type }}
                </span>
              </strong>
            </span>
            <span v-show="item.incomes_delivered.length">
              Yetkazib berilganda:
              <strong>
                <span
                  v-for="item2 in item.incomes_delivered"
                  :key="item2"
                  v-show="item2.sum_price"
                >
                  {{ _.format(item2.sum_price) + " so'm" }}
                </span>
              </strong>
            </span>
            <span v-show="item.incomes_loan.length">
              Nasiya:
              <strong>
                <span
                  v-for="item2 in item.incomes_loan"
                  :key="item2"
                  v-show="item2.sum_price"
                >
                  {{ _.format(item2.sum_price) + " so'm " + item2.type }}
                </span>
              </strong>
            </span>
            <hr />
            <span>
              Chiqimlar:
              <strong>
                <span v-for="item2 in item.expenses" :key="item">
                  {{ _.format(item2.sum_price) + " so'm" }} <br />
                </span>
              </strong>
            </span>
            <hr />
            <span>
              Daromad:
              <strong
                :class="
                  item.total_profit > 0
                    ? 'text-success'
                    : item.total_profit < 0
                    ? 'text-danger'
                    : ''
                "
              >
                {{ _.format(item.total_profit) + " so'm" }}
              </strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="sum">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-body">
          <div class="row" v-for="item in sum" :key="item">
            <div class="col-md-4 mb-1">
              <div class="card shadow">
                <div class="card-body p-2">
                  Umumiy tan narx
                  <br />
                  <strong>
                    {{ _.format(item.trade_total_tan_narx) + " so'm" }}
                  </strong>
                  <hr />
                  Umumiy savdo
                  <br />
                  <strong>
                    {{ _.format(item.trade_total_price) + " so'm" }}
                  </strong>
                  <hr />
                  Vozvrat
                  <br />
                  <strong>
                    {{ _.format(item.returned_price) + " so'm" }}
                  </strong>
                </div>
              </div>
            </div>
            <div class="col-md-4 mb-1">
              <div class="card shadow">
                <div class="card-body p-2">
                  Kirim
                  <hr />
                  <span v-show="item.incomes_trade.length">
                    Savdo
                    <br />
                    <strong>
                      <span
                        v-for="item2 in item.incomes_trade"
                        :key="item2"
                        v-show="item2.sum_price"
                      >
                        {{ _.format(item2.sum_price) + " so'm " + item2.type }}
                        <br />
                      </span>
                    </strong>
                  </span>
                  <span v-show="item.incomes_loan.length">
                    <hr />
                    Nasiya
                    <br />
                    <strong>
                      <span
                        v-for="item2 in item.incomes_loan"
                        :key="item2"
                        v-show="item2.sum_price"
                      >
                        {{ _.format(item2.sum_price) + " so'm " + item2.type }}
                        <br />
                      </span>
                    </strong>
                  </span>
                </div>
              </div>
            </div>
            <div class="col-md-4 mb-1">
              <div class="card shadow">
                <div class="card-body p-2">
                  Chiqimlar
                  <hr />
                  <strong>
                    <span v-for="item2 in item.expenses" :key="item">
                      {{ _.format(item2.sum_price) + " so'm" }}
                      <br />
                    </span>
                  </strong>
                </div>
              </div>
            </div>
            <div class="col-md-12">
              <div class="card shadow">
                <div class="card-body p-2">
                  <div class="row">
                    <div class="col-md-4">
                      Adminga beriladigan summa <br />
                      <strong>{{
                        _.format(item.admin_price) + " so'm"
                      }}</strong>
                    </div>
                    <div class="col-md-4">
                      Chegirmadan qolgan summa <br />
                      <strong class="text-success">
                        {{ _.format(item.trade_total_discount) + " so'm" }}
                      </strong>
                    </div>
                    <div class="col-md-4">
                      Ish xaqqi <br />
                      <strong
                        :class="
                          item.total_profit > 0
                            ? 'text-success'
                            : item.total_profit < 0
                            ? 'text-danger'
                            : ''
                        "
                      >
                        {{ _.format(item.total_profit) + " so'm" }}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-danger" data-dismiss="modal">
            <i class="far fa-circle-xmark"></i>
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="day">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header" v-if="day">
          <h4>{{ day.day }}</h4>
        </div>
        <div class="modal-body">
          <div class="responsive" style="min-height: 60vh" v-if="day">
            <!-- <ul
              class="nav nav-pills nav-justified m-2"
              id="pills-tab"
              role="tablist"
            >
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link btn-sm active"
                  :id="`pills-savdo-tab`"
                  data-bs-toggle="pill"
                  :data-bs-target="`#pills-savdo`"
                  type="button"
                  role="tab"
                  :aria-controls="`pills-savdo`"
                  aria-selected="true"
                >
                  Savdolar
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link btn-sm"
                  :id="`pills-category-tab`"
                  data-bs-toggle="pill"
                  :data-bs-target="`#pills-category`"
                  type="button"
                  role="tab"
                  :aria-controls="`pills-category`"
                  aria-selected="true"
                >
                  Kategoriyalar
                </button>
              </li>
            </ul> -->
            <div class="tab-content" id="pills-tabContent">
              <div
                class="tab-pane fade show active"
                :id="`pills-savdo`"
                role="tabpanel"
                :aria-labelledby="`pills-savdo-tab`"
              >
                <ul class="list-group" v-if="day.orders.length">
                  <li
                    class="list-group-item"
                    v-for="item in day.orders"
                    :key="item"
                    @click="
                      order = item;
                      getLoan(item);
                    "
                    data-toggle="modal"
                    data-target="#order"
                  >
                    <h6>Buyurtma raqami - {{ item.ordinal_number }}</h6>
                    <h6>
                      Mijoz:
                      {{ item.customer ? item.customer.name : "Umumiy" }}
                    </h6>
                  </li>
                </ul>
                <strong v-if="!day.orders.length">
                  Ma'lumot mavjud emas
                </strong>
              </div>
              <!-- <div
                class="tab-pane fade"
                :id="`pills-category`"
                role="tabpanel"
                :aria-labelledby="`pills-category-tab`"
              >
                <ul class="list-group" v-if="day.trade_cat_data.length">
                  <li
                    class="list-group-item"
                    v-for="item in day.trade_cat_data"
                    :key="item"
                  >
                    <h6>{{ item.cat }}</h6>
                    <h6>
                      {{ _.format(item.trade_price) + " " + branch_currency }}
                    </h6>
                  </li>
                </ul>
                <strong v-if="!day.trade_cat_data.length">
                  Ma'lumot mavjud emas
                </strong>
              </div> -->
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            class="btn btn-outline-danger"
            data-dismiss="modal"
            close-day-modal
          >
            <i class="far fa-circle-xmark" />
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="order">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5>Buyurtma</h5>
          <button
            class="btn btn-outline-info"
            @click="routerToReturn()"
            v-if="role == 'branch_admin'"
          >
            <i class="fa fa-undo" />
          </button>
        </div>
        <div class="modal-body">
          <div
            class="responsive"
            style="min-height: 70vh; zoom: 90%"
            v-if="order"
          >
            <div class="row my-1" v-if="order && order.income && order.balance">
              <div class="row my-1" v-if="order && income.length && balance">
                <div class="col-md-3">
                  Buyurtma summasi
                  <br />
                  {{
                    Intl.NumberFormat().format(balance.total_price) + " so'm"
                  }}
                </div>
                <div class="col-md-3">
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
                <div class="col-md-3">
                  Yetkazilganda olinadigan summa
                  <br />
                  {{
                    Intl.NumberFormat().format(order.delivery_money) + " so'm"
                  }}
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
            </div>
            <div class="table-responsive my-1" v-if="order.trades">
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
                  <tr v-for="i in order.trades" :key="i">
                    <td>
                      {{ i.Categories.name + " - " + i.Products.articul }}
                    </td>
                    <td>
                      {{ Intl.NumberFormat().format(i.Trades.price) + " so'm" }}
                    </td>
                    <td>
                      {{
                        Intl.NumberFormat().format(i.Trades.discount) + " so'm"
                      }}
                    </td>
                    <td>
                      {{ i.sum_quantity + " dona" }}
                    </td>
                    <td>
                      {{
                        (order.returned_products.find((item) => {
                          return i.Trades.code == item.Returned_products.code;
                        })
                          ? order.returned_products.find((item) => {
                              return (
                                i.Trades.code == item.Returned_products.code
                              );
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
              </table>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-primary" @click="$refs.check.start()">
            <i class="fa fa-print"></i>
          </button>
          <button
            class="btn btn-outline-danger"
            data-dismiss="modal"
            close-order-modal
          >
            <i class="far fa-circle-xmark" />
          </button>
        </div>
      </div>
    </div>
  </div>

  <check :order-id="order?.id" ref="check" />
</template>

<script>
import check from "@/components/order/check.vue";
import * as api from "@/components/Api/Api";
export default {
  name: "Sales",
  props: ["branch_currency"],
  components: { check },
  data() {
    return {
      _: Intl.NumberFormat(),
      branch_id: this.$route.params.id,
      role: localStorage["role"],
      page: 0,
      pages: 1,
      limit: 50,
      page_2: 0,
      pages_2: 1,
      limit_2: 50,
      from_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString()
        .substring(0, 10),
      to_date: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() + 1
      )
        .toISOString()
        .substring(0, 10),
      users: [],
      sum: null,
      days: [],
      day: null,
      order: null,
      template: "chart",
    };
  },
  created() {
    this.getUsers();
  },
  mounted() {},
  methods: {
    countPercentPrice(sum, percent) {
      return (sum / 100) * percent;
    },
    getUsers() {
      this.template = "chart";
      api.users(this.branch_id, 0, 25).then((Response) => {
        this.users = Response.data.data;
        this.getSumStatistics();
      });
    },
    getSumStatistics() {
      api
        .tradeSumStatistics(this.from_date, this.to_date, this.branch_id)
        .then((res) => {
          this.sum = res.data;
          this.getDays();
        });
    },
    getDays() {
      api
        .statisticOrders(this.from_date, this.to_date, this.$route.params.id)
        .then((Response) => {
          this.days = Response.data.splice(1, Response.data.length);
          this.days = this.days.sort((a, b) => {
            let x = new Date(a.day),
              y = new Date(b.day);
            return x < y ? 1 : x > y ? -1 : 0;
          });
          if (this.days.length) {
            this.prepareChart(this.days);
          }
        });
    },
    getLoan(order) {
      this.order.loan = null;
      this.order.income = [];
      this.order.balance = null;
      this.order.trades = [];
      this.order.returned_products = [];
      if (order.customer) {
        api.loan(order.customer.id).then((Response) => {
          order.loan = Response.data;
          this.getIncome(order);
        });
      } else {
        this.getIncome(order);
      }
    },
    getIncome(order) {
      api.incomes(order.id, "order", 0, 100).then((Response) => {
        this.order.income = Response.data.data;
        this.getBalance(order);
      });
    },
    getBalance(order) {
      api.tradeBalance(order.id).then((Response) => {
        this.order.balance = Response.data;
        this.getTrades(order, 0, 100);
      });
    },
    getTrades(order, page, limit) {
      api.trades(order.id, page, limit).then((Response) => {
        this.page_2 = Response.data.current_page;
        this.pages_2 = Response.data.pages;
        this.order.trades = Response.data.data;
        this.getReturnedProducts(order, page, limit);
      });
    },
    getReturnedProducts(order, page, limit) {
      api.returnedProducts(order.id, page, limit).then((Response) => {
        this.order.returned_products = Response.data.data;
      });
    },
    prepareChart(days) {
      let canvas,
        labels = [],
        savdo = [],
        chegirma = [],
        returned = [],
        chiqim = [],
        daromad = [];
      document.getElementById("salesChart").remove();
      canvas = document.createElement("canvas");
      canvas.id = "salesChart";
      canvas.height = 200;
      canvas.width = 600;
      document.getElementById("sChart").append(canvas);
      for (let i = 0; i < days.length; i++) {
        labels.push(days[i].day);
        savdo.push(days[i].trade_total_price);
        chegirma.push(
          days[i].order_total_discount + days[i].trade_total_discount
        );
        returned.push(days[i].returned_price);
        chiqim.push(days[i].expense_price);
        daromad.push(days[i].total_profit);
        if (i == days.length - 1) {
          this.createChart(labels, savdo, chegirma, returned, chiqim, daromad);
        }
      }
    },
    createChart(labels, savdo, chegirma, returned, chiqim, daromad) {
      const ctx = document.getElementById("salesChart").getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Savdo",
              data: savdo,
              backgroundColor: ["rgba(54, 162, 235, 0.2)"],
              borderColor: ["rgba(54, 162, 235, 1)"],
              borderWidth: 1,
            },
            {
              label: "Chegirma",
              data: chegirma,
              backgroundColor: ["rgb(127, 255, 212, .2)"],
              borderColor: ["rgb(127, 255, 212)"],
              borderWidth: 1,
            },
            {
              label: "Vozvrat",
              data: returned,
              backgroundColor: ["rgba(255, 255, 0, .1)"],
              borderColor: ["rgb(255, 165, 0)"],
              borderWidth: 1,
            },
            {
              label: "Chiqim",
              data: chiqim,
              backgroundColor: ["rgba(255, 99, 132, 0.2)"],
              borderColor: ["rgba(255, 99, 132, 1)"],
              borderWidth: 1,
            },
            {
              label: "Daromad / Zarar",
              data: daromad,
              backgroundColor: ["rgba(75, 192, 192, 0.2)"],
              borderColor: ["rgba(75, 192, 192, 1)"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    },
    routerToReturn() {
      localStorage.setItem("order_id_for_return", this.order.id);
      document.querySelector("[close-day-modal]").click();
      document.querySelector("[close-order-modal]").click();
      this.$router.push("/return");
    },
  },
};
</script>

<style scoped>
.responsive {
  max-height: 60vh;
}

.template {
  box-shadow: none;
}

.card {
  height: 100%;
}

.day {
  cursor: pointer;
}

.day span {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
