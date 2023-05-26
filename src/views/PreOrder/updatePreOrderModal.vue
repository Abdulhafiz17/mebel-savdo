<template>
  <button
    v-show="false"
    data-toggle="modal"
    data-target="#pre-order-update"
  ></button>
  <div class="modal fade" id="pre-order-update">
    <div class="modal-dialog">
      <form class="modal-content" @submit.prevent="updatePreOrder()">
        <div class="modal-header"><h5>Tahrirlash</h5></div>
        <div class="modal-body">
          <div class="row gap-1 text-left">
            <div class="col-12" v-if="role == 'branch_admin'">
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
            <div class="col-12" v-if="role == 'branch_admin'">
              <div class="dropdown">
                <button
                  id="customerDropdown"
                  type="button"
                  class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
                  data-toggle="dropdown"
                  @click="getUsers('seller')"
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
                    @scroll="scrollUsers($event, 'seller')"
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
            <div class="col-12" v-if="role == 'branch_admin'">
              <div class="row">
                <div class="col-6">
                  <button
                    type="button"
                    class="btn btn-sm btn-block"
                    :class="order.etaj ? 'btn-primary' : 'btn-outline-primary'"
                    @click="order.etaj = !order.etaj"
                  >
                    Ko'p qavatli
                  </button>
                </div>
                <div class="col-6">
                  <button
                    type="button"
                    class="btn btn-sm btn-block"
                    :class="order.city ? 'btn-primary' : 'btn-outline-primary'"
                    @click="order.city = !order.city"
                  >
                    Shahardan tashqari
                  </button>
                </div>
              </div>
            </div>
            <div class="col-12" v-if="role == 'branch_admin'">
              Topshirish sana
              <input
                type="date"
                class="form-control form-control-sm"
                required
                v-model="order.date"
              />
            </div>
            <div class="col-12" v-if="role == 'branch_admin'">
              Izoh
              <input
                type="text"
                class="form-control form-control-sm"
                v-model="order.comment"
              />
            </div>
            <div class="col-12" v-if="role == 'logistika'">
              Pulni olib keluvchi hodim
              <div class="row">
                <div class="col-6">
                  <button
                    type="button"
                    class="btn btn-sm btn-block"
                    :class="
                      order.delivery_money_user == 'worker'
                        ? 'btn-primary'
                        : 'btn-outline-primary'
                    "
                    @click="order.delivery_money_user = 'worker'"
                  >
                    Haydovchi
                  </button>
                </div>
                <div class="col-6">
                  <button
                    type="button"
                    class="btn btn-sm btn-block"
                    :class="
                      order.delivery_money_user == 'ustanovshik'
                        ? 'btn-primary'
                        : 'btn-outline-primary'
                    "
                    @click="order.delivery_money_user = 'ustanovshik'"
                  >
                    Ustanovshik
                  </button>
                </div>
              </div>
            </div>
            <div class="col-12" v-if="role == 'logistika'">
              Haydovchi biriktirish
              <div class="dropdown">
                <button
                  id="customerDropdown"
                  class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
                  data-toggle="dropdown"
                  @click="getUsers('worker')"
                >
                  {{ worker?.name || "Haydovchi tanlang" }}
                </button>
                <div
                  class="dropdown-menu w-100 p-1"
                  aria-labelledby="customerDropdown"
                >
                  <ul
                    class="list-group p-1 responsive"
                    style="max-height: 25vh"
                    @scroll="scrollUsers($event, 'worker')"
                  >
                    <li
                      class="list-group-item p-2"
                      v-for="item in users.data"
                      :key="item"
                      @click="worker = item"
                    >
                      {{ item.name }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-12" v-if="role == 'logistika'">
              Ustanovshik biriktirish
              <div class="dropdown">
                <button
                  id="customerDropdown"
                  class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
                  data-toggle="dropdown"
                  @click="getUsers('ustanovshik')"
                >
                  {{ ustanovshik?.name || "Ustanovshik tanlang" }}
                </button>
                <div
                  class="dropdown-menu w-100 p-1"
                  aria-labelledby="customerDropdown"
                >
                  <ul
                    class="list-group p-1 responsive"
                    style="max-height: 25vh"
                    @scroll="scrollUsers($event, 'ustanovshik')"
                  >
                    <li
                      class="list-group-item p-2"
                      v-for="item in users.data"
                      :key="item"
                      @click="ustanovshik = item"
                    >
                      {{ item.name }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            class="btn btn-outline-primary"
            :disabled="
              role == 'branch_admin'
                ? !customer || !user
                : role == 'logistika'
                ? !worker
                : 'false'
            "
          >
            <i class="far fa-circle-check"></i>
          </button>
          <button
            class="btn btn-outline-danger"
            data-dismiss="modal"
            close-edit-pre-order-modal
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
export default {
  name: "updatePreOrderModal",
  data() {
    return {
      role: localStorage["role"],
      branch_id: localStorage["branch_id"],
      search_customers: "",
      customers: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
      customer: null,
      search_users: "",
      users: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
      user: null,
      worker: null,
      ustanovshik: null,
      order: {
        date: "",
        id: 0,
        customer_id: 0,
        user_id: 0,
        status: "",
        delivery_money: 0,
        worker_id: 0,
        ustanovshik_id: 0,
        city: false,
        delivery_money_user: "",
        comment: "",
        time: "",
        seller_id: 0,
        branch_id: 0,
        discount: 0,
        logistika_id: 0,
        etaj: false,
        warehouseman_id: 0,
      },
      incomes: [
        {
          money: null,
          comment: "",
          kassa_id: 0,
        },
      ],
    };
  },
  computed: {
    toggle_button() {
      return document.querySelector(`[data-target="#pre-order-update"]`);
    },
  },
  methods: {
    start(data) {
      this.customer = data.Customers;
      this.user = {
        id: data.Pre_orders.seller_id,
        name: data.user,
      };
      this.order = data.Pre_orders;
      this.toggle_button.click();
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
    getUsers(role) {
      api.users(this.branch_id, 0, [role], "", 0, 25).then((res) => {
        this.users = res.data;
      });
    },
    scrollUsers(event, role) {
      if (this.checkEndOfScroll(event.target)) {
        if (this.users.current_page < this.users.pages - 1) {
          api
            .users(
              this.branch_id,
              0,
              [role],
              "",
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
    getUsers(role) {
      api.users(this.branch_id, 0, [role], "", 0, 25).then((res) => {
        this.users = res.data;
      });
    },
    scrollUsers(event, role) {
      const element = event.target;
      if (element.scrollTop + element.clientHeight >= element.scrollHeight) {
        if (this.users.current_page < this.users.pages) {
          api
            .users(
              this.branch_id,
              0,
              [role],
              "",
              this.users.current_page + 1,
              25
            )
            .then((res) => {
              this.users.current_page = res.data.current_page;
              this.users.pages = res.data.pages;
              this.users.data = this.users.data.concat(res.data.data);
            });
        }
      }
    },
    checkEndOfScroll(element) {
      if (element.scrollTop + element.clientHeight == element.scrollHeight)
        return true;
      else return false;
    },
    updatePreOrder() {
      this.incomes.forEach((item) => {
        item.money = item.money || 0;
      });
      this.order.incomes = this.incomes;
      console.log(this.order);
      api.updatePreOrder(this.order).then(() => {
        api.success("close-edit-pre-order-modal").then(() => {
          this.$parent.getOrders(0, 25);
        });
      });
    },
  },
};
</script>
