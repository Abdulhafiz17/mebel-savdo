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
          <span class="text-left">
            <h4>Buyurtmani tasdiqlash</h4>
            <strong>{{ $util.currency(balance?.total_price) }}</strong> so'm
          </span>
        </div>
        <div class="modal-body">
          <div class="row gap-1 text-left">
            <div class="col-12">
              <div class="dropdown">
                <div class="btn-group btn-group-sm w-100">
                  <button
                    id="customerDropdown"
                    type="button"
                    class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
                    data-toggle="dropdown"
                    @click="getCustomers()"
                  >
                    {{ customer?.name || "Mijoz tanlang" }}
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-success"
                    data-toggle="modal"
                    data-target="#yangiMijoz"
                  >
                    <i class="fa fa-user-plus"></i>
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
              Nasiya
              <div class="input-group input-group-sm">
                <input
                  type="number"
                  class="form-control"
                  step="any"
                  min="0"
                  placeholder="summa"
                  v-model="update_order.loan"
                />
                <div class="input-group-text">so'm</div>
              </div>
            </div>
            <div class="col-12" v-if="update_order.loan">
              Nasiya qaytarish sana
              <input
                type="date"
                class="form-control form-control-sm"
                required
                v-model="update_order.loan_repayment_date"
              />
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
              Manzil / Izoh
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

  <div class="modal fade" id="yangiMijoz">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Yangi mijoz qo'shish</h4>
        </div>
        <form @submit.prevent="postCustomer()">
          <div class="modal-body">
            <div class="row gap-1 text-left">
              <div class="col-md-12">
                Ism
                <input
                  class="form-control form-control-sm"
                  type="text"
                  placeholder="ism"
                  required
                  v-model="yangiMijoz.name"
                />
              </div>
              <div class="col-md-12">
                Telefon raqam
                <div class="input-group input-group-sm">
                  <div class="input-group-prepend">
                    <div class="input-group-text">+998</div>
                  </div>
                  <input
                    class="form-control"
                    type="tel"
                    minlength="9"
                    maxlength="9"
                    placeholder="tel"
                    required
                    v-model="yangiMijoz.phone"
                  />
                </div>
              </div>
              <div class="col-md-12">
                Tug'ilgan sana
                <input
                  class="form-control form-control-sm"
                  type="date"
                  required
                  v-model="yangiMijoz.birthday"
                />
              </div>
              <div class="col-md-12">
                Toifa
                <select
                  class="form-select form-select-sm"
                  v-model="yangiMijoz.type"
                >
                  <option value="Premium">Premium</option>
                  <option value="Narx">Narx</option>
                  <option value="Umumiy">Umumiy</option>
                  <option value="Qora ro'yxat">Qora ro'yxat</option>
                </select>
              </div>
              <div class="col-md-12">
                Geo joylashuv
                <div class="row">
                  <div class="col-6">
                    <div class="input-group input-group-sm">
                      <input
                        type="text"
                        class="form-control form-control-sm"
                        placeholder="uzunlik"
                        required
                        v-model="yangiMijoz.map_long"
                      />
                      <div class="input-group-text">uzunlik</div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="input-group input-group-sm">
                      <input
                        type="text"
                        class="form-control form-control-sm"
                        placeholder="kenglik"
                        required
                        v-model="yangiMijoz.map_lat"
                      />
                      <div class="input-group-text">kenglik</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-primary">
              <span class="far fa-circle-check" />
            </button>
            <button
              close-modal
              class="btn btn-outline-danger"
              data-dismiss="modal"
            >
              <span class="far fa-circle-xmark" />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <preOrderCheck ref="preOrderCheck" :order-id="0" />
</template>

<script>
import * as api from "@/components/Api/Api";
import trades from "./trades.vue";
import preOrderCheck from "@/components/order/preOrderCheck.vue";
import swal from "sweetalert";
export default {
  name: "preOrder",
  components: { trades, preOrderCheck },
  data() {
    return {
      branch_id: localStorage["branch_id"],
      order: null,
      balance: null,
      search_customers: "",
      customers: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
      yangiMijoz: {
        name: "",
        phone: null,
        birthday: "",
        type: "",
        address: "",
        map_long: "",
        map_lat: "",
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
        loan: null,
        loan_repayment_date: "",
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
        .preOrders(
          "",
          "",
          0,
          0,
          this.branch_id,
          "false",
          0,
          0,
          0,
          "",
          0,
          "",
          "",
          0,
          1
        )
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
      this.update_order.loan_repayment_date =
        this.update_order.loan_repayment_date || null;
      api.updatePreOrder(this.update_order).then(() => {
        api.success("close-update-order-modal").then(() => {
          this.order = null;
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
            loan: null,
            loan_repayment_date: "",
            incomes: [
              {
                money: null,
                comment: "naxt",
                kassa_id: 0,
              },
            ],
          };
          swal({
            icon: "info",
            title: "Buyurtma cheki chiqarilsinmi ?",
            buttons: {
              confirm: {
                visible: true,
                text: "Ok",
                value: true,
              },
              cancel: {
                visible: true,
                text: "Bekor qilish",
                value: false,
              },
            },
          }).then((value) => {
            if (value) {
              this.$refs.preOrderCheck.start(this.order.Pre_orders.id);
            }
            this.getOrder();
          });
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
    postCustomer() {
      api.createCustomer(this.yangiMijoz).then(() => {
        this.yangiMijoz = {
          name: "",
          phone: null,
          birthday: "",
          type: "",
          address: "",
          map_long: "",
          map_lat: "",
        };
        api.success("close-modal").then(() => {
          this.getCustomers();
        });
      });
    },
    getUsers() {
      api.users(this.branch_id, 0, ["seller"], "", 0, 25).then((res) => {
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
