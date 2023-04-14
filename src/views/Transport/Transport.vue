<template>
  <h3>Transport</h3>
  <div class="row">
    <div class="col-md-4">
      <select
        class="form-select form-select-sm"
        v-model="status"
        @change="getOrders(0, 25)"
      >
        <option value="false">yetkazilmagan</option>
        <option value="true">yetkazilgan</option>
      </select>
    </div>
    <div class="col-md-4">{{ currency.format(user?.balance) + " so'm" }}</div>
    <div class="col-md-4">
      <router-link class="btn btn-sm btn-block btn-outline-secondary" to="/">
        <i class="fa fa-sign-out"></i> Chiqish
      </router-link>
    </div>
  </div>

  <div class="responsive" style="max-height: 84vh">
    <div class="row">
      <div class="col-md-4 my-1" v-for="item in orders.data" :key="item">
        <div class="card shadow">
          <div class="card-body">
            <p>
              <i class="fa fa-calendar-alt"></i>
              {{ item.time.replace("T", " ").substring(0, 16) }}
            </p>
            <p>
              <i class="fa fa-handshake"></i>
              {{ item.customer?.name }}
            </p>
            <p>
              <i class="fa fa-phone"></i>
              <a :href="`tel:+998${item.customer?.phone}`">
                {{ "+998" + item.customer?.phone }}
              </a>
            </p>
            <p>
              <i class="fa fa-map"></i>
              {{ item.customer?.address }}
              <br />
              <i class="fa fa-location-dot"></i> {{ item.customer?.map_lat }} ;
              {{ item.customer?.map_long }}
            </p>
            <p>
              <i class="fa fa-coins"></i>
              <strong>
                {{ currency.format(item.delivery_money) }}
              </strong>
              so'm
            </p>
            <p>
              <i class="fa fa-comment"></i>
              {{ item.comment }}
            </p>
            <div class="row">
              <div class="col">
                <a
                  class="btn btn-sm btn-block btn-outline-primary"
                  target="_blank"
                  :href="`https://www.google.com/maps/@${item.customer?.map_lat},${item.customer?.map_long},20z`"
                >
                  <i class="fa fa-location-dot"></i>
                </a>
              </div>
              <div class="col">
                <button
                  class="btn btn-sm btn-block btn-outline-info"
                  @click="
                    order = item;
                    getLoan(item);
                  "
                  data-toggle="modal"
                  data-target="#order"
                >
                  <i class="fa fa-info"></i>
                </button>
              </div>
              <div class="col">
                <button
                  class="btn btn-sm btn-block btn-outline-success"
                  @click="putOrder(item.id)"
                >
                  <i class="far fa-circle-check"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12">
        <Pagination
          :page="orders.current_page"
          :pages="orders.pages"
          :limit="orders.limit"
          @get="getOrders"
        />
      </div>
    </div>
  </div>

  <div class="modal fade" id="order">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5>Buyurtma</h5>
        </div>
        <div class="modal-body">
          <div
            class="responsive"
            style="min-height: 70vh; zoom: 90%"
            v-if="order"
          >
            <div class="row my-1" v-if="order && order.income && order.balance">
              <div class="col-md-4">
                Buyurtma summasi
                <br />
                {{
                  Intl.NumberFormat().format(order.balance.total_price) +
                  " so'm"
                }}
              </div>
              <div class="col-md-4">
                To'lov summa
                <br />
                <span v-for="(i, index) in order.income" :key="i">
                  {{
                    i.Incomes.comment +
                    ": " +
                    Intl.NumberFormat().format(i.Incomes.money) +
                    " so'm" +
                    (index !== order.income.length - 1 ? ", " : "")
                  }}
                  <br />
                </span>
              </div>
              <div class="col-md-4">
                Nasiya summa
                <br />
                {{
                  Intl.NumberFormat().format(
                    order.balance.total_price -
                      (order.income[0].Incomes.money +
                        (order.income[1] ? order.income[1].Incomes.money : 0)) -
                      order.discount >
                      0
                      ? order.balance.total_price -
                          (order.income[0].Incomes.money +
                            (order.income[1]
                              ? order.income[1].Incomes.money
                              : 0)) -
                          order.discount
                      : 0
                  ) + " so'm"
                }}
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
</template>

<script>
import * as api from "@/components/Api/Api.js";
import Pagination from "@/components/Pagination/Pagination.vue";
export default {
  name: "Transport",
  components: { Pagination },
  data() {
    return {
      currency: Intl.NumberFormat(),
      worker_id: localStorage["user_id"],
      user: null,
      status: false,
      orders: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
      order: null,
    };
  },
  created() {
    this.getUser();
    this.getOrders(0, 25);
  },
  methods: {
    getUser() {
      api.user().then((res) => {
        this.user = res.data;
      });
    },
    getOrders(page = 0, limit = 25) {
      api
        .orders("", "", true, 0, this.worker_id, this.status, page, limit)
        .then((res) => {
          this.orders = res.data;
        });
    },
    putOrder(id) {
      api.deliverOrder(id).then((res) => {
        api.success().then(() => {
          this.getOrders(0, 25);
        });
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
  },
};
</script>

<style scoped>
p {
  margin: 0;
  width: 100%;
}

p i {
  padding: 5px;
}
</style>
