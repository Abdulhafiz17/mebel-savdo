<template>
  <h4 v-if="false">Savdo</h4>
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
      <div class="row">
        <div class="col-6">
          <button
            class="btn btn-sm btn-block btn-outline-primary"
            data-toggle="modal"
            data-target="#sum"
          >
            <span class="fa fa-money-bill" />
          </button>
        </div>
        <div class="col-6">
          <button
            class="btn btn-sm btn-block btn-outline-secondary"
            @click="getSumStatistics()"
          >
            <span class="far fa-circle-check" /> Qidirish
          </button>
        </div>
      </div>
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

  <div
    v-if="template == 'card'"
    class="responsive p-1"
    style="max-height: 68vh"
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
            <ul class="list">
              <li>
                Jami savdo summasi
                <br />
                <strong>
                  {{ $util.currency(item.trade_total_price) + " so'm" }}
                </strong>
              </li>
              <hr />
              <li>
                Jami tan narx
                <br />
                <strong>
                  {{ $util.currency(item.trade_total_tan_narx) + " so'm" }}
                </strong>
              </li>
              <hr />
              <li>
                Vozvrat summasi
                <br />
                <strong>
                  {{ $util.currency(item.returned_price) + " so'm" }}
                </strong>
              </li>
              <hr />
              <li>
                Chiqim
                <strong v-for="item2 in item.expenses" :key="item">
                  <br />
                  {{ $util.format(item2.sum_price) + " so'm" }}
                </strong>
              </li>
              <hr />
              <li>
                Kpi
                <br />
                <strong>
                  {{ $util.currency(item.total_kpi) + " so'm" }}
                </strong>
              </li>
              <hr />
              <li>
                Daromad
                <br />
                <strong>
                  {{ $util.currency(item.total_profit) + " so'm" }}
                </strong>
              </li>
            </ul>
            <div v-if="false">
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
                    data-dismiss="modal"
                    @click="$refs.orderModal.start(item.id)"
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

  <div class="modal fade" id="sum">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Jami</h4>
        </div>
        <div class="modal-body">
          <div v-for="item in sum" :key="item">
            <strong>{{ item.day }}</strong>
            <ul class="list">
              <li>
                Jami savdo summasi
                <br />
                <strong>
                  {{ $util.currency(item.trade_total_price) + " so'm" }}
                </strong>
              </li>
              <hr />
              <li>
                Jami tan narx
                <br />
                <strong>
                  {{ $util.currency(item.trade_total_tan_narx) + " so'm" }}
                </strong>
              </li>
              <hr />
              <li>
                Vozvrat summasi
                <br />
                <strong>
                  {{ $util.currency(item.returned_price) + " so'm" }}
                </strong>
              </li>
              <hr />
              <li>
                Chiqim
                <strong v-for="item2 in item.expenses" :key="item">
                  <br />
                  {{ $util.format(item2.sum_price) + " so'm" }}
                </strong>
              </li>
              <hr />
              <li>
                Kpi
                <br />
                <strong>
                  {{ $util.currency(item.total_kpi) + " so'm" }}
                </strong>
              </li>
              <hr />
              <li>
                Daromad
                <br />
                <strong>
                  {{ $util.currency(item.total_profit) + " so'm" }}
                </strong>
              </li>
            </ul>
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

  <orderModal printable="true" returnable="true" ref="orderModal" />
</template>

<script>
import * as api from "@/components/Api/Api";
import orderModal from "@/components/order/orderModal.vue";
export default {
  name: "Sales",
  props: ["branch_currency"],
  components: { orderModal },
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
      template: "chart",
    };
  },
  created() {
    this.getUsers();
  },
  mounted() {},
  methods: {
    benefit(data) {
      return (
        data.trade_total_price +
        data.trade_from_comp_total_price -
        (data.trade_total_tan_narx + data.trade_from_comp_total_tan_narx) -
        data.order_discount -
        (data.trade_total_discount + data.trade_from_comp_total_discount) -
        data.expense_sum -
        data.returned_price
      );
    },
    countPercentPrice(sum, percent) {
      return (sum / 100) * percent;
    },
    getUsers() {
      this.template = "card";
      // api.users(this.branch_id, 0, 0, 25).then((Response) => {
      //   this.users = Response.data.data;
      this.getSumStatistics();
      // });
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

.modal-body .list-group-item {
  padding: 5px 10px;
}

.list {
  gap: 0;
}
</style>
