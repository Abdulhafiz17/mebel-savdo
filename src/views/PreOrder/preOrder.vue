<template>
  <div class="row">
    <div class="col-md-3"><h4>Oldindan buyurtma</h4></div>
    <div class="col text-right">
      <div class="btn-group btn-group-sm">
        <router-link to="/pre-orders" class="btn btn-outline-secondary">
          Buyurtmalar tarixi
        </router-link>
        <button
          class="btn btn-outline-success"
          v-if="!order"
          @click="createOrder()"
        >
          Buyurtma ochish
        </button>
        <button
          v-if="order"
          class="btn btn-outline-success"
          data-toggle="modal"
          data-target="#confirm-order"
        >
          Buyurtmani tasdiqlash
        </button>
        <button class="btn btn-outline-danger" v-if="order">
          Buyurtmani o'chirish
        </button>
        <button
          class="btn btn-outline-primary"
          v-if="order"
          data-toggle="modal"
          data-target="#add-trade"
        >
          Mahsulot qo'shish
        </button>
      </div>
    </div>
  </div>
  <hr />

  <trades v-if="order" :order="order" ref="trades" />

  <div class="modal fade" id="confirm-order">
    <div class="modal-dialog">
      <form class="modal-content" @submit.prevent="updateOrder()">
        <div class="modal-header">
          <h4>Buyurtmani tasdiqlash</h4>
        </div>
        <div class="modal-body">
          <div class="row gap-2 text-left">
            <div class="col-12">
              <div class="dropdown">
                <button
                  id="customerDropdown"
                  type="button"
                  class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
                  data-toggle="dropdown"
                  @click="getCustomers()"
                >
                  {{ customer?.name || "Mijoz tanlang" }}
                </button>
                <div
                  class="dropdown-menu w-100 p-1"
                  aria-labelledby="customerDropdown"
                >
                  <input
                    class="form-control form-control-sm"
                    placeholder="qidiruv"
                    v-model="search_customers"
                    @keyup="getCustomers()"
                  />
                  <ul
                    class="list-group p-1 responsive"
                    style="max-height: 25vh"
                    @scroll="scrollCustomers($event)"
                  >
                    <li
                      class="list-group-item p-2"
                      v-for="item in customers.data"
                      :key="item"
                      @click="customer = item"
                    >
                      {{ item.name }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-12">
              <div class="dropdown">
                <button
                  id="customerDropdown"
                  type="button"
                  class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
                  data-toggle="dropdown"
                  @click="getUsers()"
                >
                  {{ user?.name || "Sotuvchi tanlang" }}
                </button>
                <div
                  class="dropdown-menu w-100 p-1"
                  aria-labelledby="customerDropdown"
                >
                  <ul
                    class="list-group p-1 responsive"
                    style="max-height: 25vh"
                    @scroll="scrollUsers($event)"
                  >
                    <li
                      class="list-group-item p-2"
                      v-for="item in users.data"
                      :key="item"
                      @click="user = item"
                    >
                      {{ item.name }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-12">
              <div class="row">
                <div class="col-6">
                  <button
                    type="button"
                    class="btn btn-sm btn-block"
                    :class="
                      update_order.etaj ? 'btn-primary' : 'btn-outline-primary'
                    "
                    @click="update_order.etaj = !update_order.etaj"
                  >
                    Ko'p qavatli
                  </button>
                </div>
                <div class="col-6">
                  <button
                    type="button"
                    class="btn btn-sm btn-block"
                    :class="
                      update_order.city ? 'btn-primary' : 'btn-outline-primary'
                    "
                    @click="update_order.city = !update_order.city"
                  >
                    Shahardan tashqari
                  </button>
                </div>
              </div>
            </div>
            <div class="col-12">
              Chegirma
              <div class="input-group input-group-sm">
                <input
                  type="number"
                  class="form-control"
                  step="any"
                  min="0"
                  placeholder="summa"
                  v-model="update_order.discount"
                />
                <div class="input-group-text">so'm</div>
              </div>
            </div>
            <div class="col-12">
              Yetkazilganda olinadigan summa
              <div class="input-group input-group-sm">
                <input
                  type="number"
                  class="form-control"
                  step="any"
                  min="0"
                  placeholder="summa"
                  v-model="update_order.delivery_money"
                />
                <div class="input-group-text">so'm</div>
              </div>
            </div>
            <div class="col-12">To'lov</div>
            <div
              class="col-12"
              v-for="(item, i) in update_order.incomes"
              :key="item"
            >
              <div class="input-group input-group-sm">
                <input
                  class="form-control"
                  type="number"
                  step="any"
                  min="0.1"
                  placeholder="summa"
                  required
                  v-model="item.money"
                />
                <div class="input-group-append">
                  <select
                    class="form-select form-select-sm"
                    v-model="item.comment"
                  >
                    <option
                      v-for="item1 in $util.payment_types"
                      :key="item1"
                      :value="item1"
                      :disabled="
                        update_order.incomes.find(
                          (item2) => item2.comment == item1
                        )
                      "
                    >
                      {{ item1 }}
                    </option>
                  </select>
                </div>
                <div class="input-group-text">
                  {{ cashier?.currency?.currency || "valyuta" }}
                </div>
                <div class="input-group-append">
                  <button
                    v-if="
                      i == 0 &&
                      update_order.incomes.length < $util.payment_types.length
                    "
                    class="btn btn-sm btn-outline-success"
                    @click="
                      update_order.incomes.push({
                        money: null,
                        comment: '',
                        kassa_id: 0,
                      })
                    "
                  >
                    <i class="fa fa-plus"></i>
                  </button>
                  <button
                    v-else
                    class="btn btn-sm btn-outline-danger"
                    @click="update_order.incomes.splice(i, 1)"
                  >
                    <i class="fa fa-xmark"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="col-12">
              Kassa
              <select
                class="form-select form-select-sm"
                required
                v-model="cashier_id"
                @click="getCashiers()"
                @change="
                  update_order.incomes.forEach((item) => {
                    item.kassa_id = cashier_id;
                  });
                  setCashier();
                "
              >
                <option v-for="item in cashiers" :key="item" :value="item.id">
                  {{ item.name }}
                </option>
              </select>
            </div>
            <div class="col-12">
              Topshirish sana
              <input
                type="date"
                class="form-control form-control-sm"
                required
                v-model="update_order.date"
              />
            </div>
            <div class="col-12">
              Izoh
              <input
                type="text"
                class="form-control form-control-sm"
                v-model="update_order.comment"
              />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            class="btn btn-outline-primary"
            :disabled="!customer || !user"
          >
            <i class="far fa-circle-check"></i>
          </button>
          <button
            class="btn btn-outline-danger"
            data-dismiss="modal"
            close-update-order-modal
          >
            <i class="far fa-circle-xmark"></i>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import * as api from "@/components/Api/Api";
import trades from "./trades.vue";
export default {
  name: "preOrder",
  components: { trades },
  data() {
    return {
      branch_id: localStorage["branch_id"],
      order: null,
      search_customers: "",
      customers: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
      customer: null,
      users: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
      user: null,
      cashiers: [],
      cashier: null,
      cashier_id: 0,
      update_order: {
        id: 0,
        customer_id: 0,
        comment: "",
        date: "",
        seller_id: 0,
        discount: null,
        delivery_money: null,
        etaj: false,
        city: false,
        incomes: [
          {
            money: null,
            comment: "naxt",
            kassa_id: 0,
          },
        ],
      },
    };
  },
  created() {
    this.getOrder();
  },
  methods: {
    getOrder() {
      api
        .preOrders(0, 0, this.branch_id, "false", 0, 0, "", 0, 0, 1)
        .then((res) => {
          if (res.data.data.length) {
            this.order = res.data.data[0];
            // this.$refs.trades.start(res.data.data[0]);
          } else {
            this.order = null;
          }
        });
    },
    createOrder() {
      api.createPreOrder().then(() => {
        api.success().then(() => {
          this.getOrder();
        });
      });
    },
    updateOrder() {
      this.update_order.id = this.order.Pre_orders.id;
      this.update_order.customer_id = this.customer.id;
      this.update_order.seller_id = this.user.id;
      this.update_order.discount = this.update_order.discount || 0;
      this.update_order.delivery_money = this.update_order.delivery_money || 0;
      api.updatePreOrder(this.update_order).then(() => {
        api.success("close-update-order-modal").then(() => {
          this.customer = null;
          this.user = null;
          this.cashier_id = 0;
          this.update_order = {
            id: 0,
            customer_id: 0,
            comment: "",
            date: "",
            seller_id: 0,
            discount: null,
            delivery_money: null,
            etaj: false,
            city: false,
            incomes: [
              {
                money: null,
                comment: "naxt",
                kassa_id: 0,
              },
            ],
          };
          this.getOrder();
        });
      });
    },
    getCustomers() {
      api.customers(0, 25, this.search_customers).then((res) => {
        this.customers = res.data;
      });
    },
    scrollCustomers(event) {
      if (this.checkEndOfScroll(event.target)) {
        if (this.customers.current_page < this.customers.pages - 1) {
          api
            .customers(
              this.customers.current_page + 1,
              25,
              this.search_customers
            )
            .then((res) => {
              this.customers.current_page = res.data.current_page;
              this.customers.data = this.customers.data.concat(res.data.data);
            });
        }
      }
    },
    getUsers() {
      api.users(this.branch_id, 0, ["seller"], 0, 25).then((res) => {
        this.users = res.data;
      });
    },
    scrollUsers(event) {
      if (this.checkEndOfScroll(event.target)) {
        if (this.users.current_page < this.users.pages - 1) {
          api
            .users(
              this.branch_id,
              0,
              ["seller"],
              this.users.current_page + 1,
              25
            )
            .then((res) => {
              this.users.current_page = res.data.current_page;
              this.users.data = this.users.data.concat(res.data.data);
            });
        }
      }
    },
    getCashiers() {
      api.kassa("", 0, this.branch_id).then((res) => {
        this.cashiers = res.data;
      });
    },
    setCashier() {
      this.cashier = this.cashiers.find((item) => {
        return item.id == this.cashier_id;
      });
    },
    checkEndOfScroll(element) {
      if (element.scrollTop + element.clientHeight == element.scrollHeight)
        return true;
      else return false;
    },
  },
};
</script>
