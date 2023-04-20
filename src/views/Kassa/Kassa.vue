<template>
  <div class="row">
    <div class="col-md-2" v-if="order">
      {{ `${order.ordinal_number} - buyurtma` }}
    </div>
    <div class="col-md-10">
      <button class="btn btn-sm m-1 btn-outline-success" @click="addOrder()">
        <i class="fa fa-circle-plus" />
      </button>
      <div
        class="btn-group btn-group-sm m-1"
        v-for="item in orders"
        :key="item"
      >
        <button
          :class="
            order == item ? 'btn btn-primary' : 'btn btn-outline-secondary'
          "
          @click="
            order = item;
            getTrades(order);
          "
        >
          {{ "№ " + item.ordinal_number }}
        </button>
        <button class="btn btn-danger" @click="deleteOrder(item.id)">
          <i class="far fa-circle-xmark" />
        </button>
      </div>
    </div>
  </div>

  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1">
      <form @submit.prevent="addTrade(trade)" v-if="order">
        <div class="intpu-group input-group-sm">
          <input
            id="barcode"
            class="form-control text-center"
            type="search"
            placeholder="code"
            list="products"
            v-model="barcode"
            @keyup="getProduct(barcode)"
          />
          <datalist id="products">
            <option
              v-for="item in products"
              :key="item"
              :value="item.Products.code"
            >
              {{ item.Products.articul }}
            </option>
          </datalist>
        </div>
      </form>
    </div>
    <div class="col-md-4">
      <span v-if="order_balance.total_price">
        Buyurtma balansi:
        <strong>
          {{ Intl.NumberFormat().format(order_balance.total_price) + " so'm" }}
        </strong>
      </span>
    </div>
  </div>

  <div class="responsive my-1">
    <table class="table table-sm text-center table-hover table-borderless">
      <thead>
        <tr>
          <th>№</th>
          <th>Mahsulot</th>
          <th>Hajm</th>
          <th>Narxi</th>
          <th>Chegirma</th>
          <th>To'lov</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, n) in trades" :key="item">
          <td>{{ n + 1 }}</td>
          <td>
            {{
              item.Categories.name +
              " - " +
              item.Products.name +
              " " +
              item.Products.articul +
              " " +
              item.Products.name2
            }}
          </td>
          <td>
            <div class="input-group input-group-sm w-50 mx-auto">
              <button
                class="btn btn-outline-secondary"
                @click="putTrade('<', item)"
              >
                <i class="fa fa-minus" />
              </button>
              <input
                class="form-control text-center"
                type="number"
                v-model="item.sum_quantity"
                min="0"
                :max="item.quantity"
                step="any"
              />
              <button
                class="btn btn-outline-secondary"
                @click="putTrade('>', item)"
              >
                <i class="fa fa-plus" />
              </button>
            </div>
          </td>
          <td>
            <form @submit.prevent="putTrade('', item)">
              <div class="input-group input-group-sm w-75 mx-auto">
                <input
                  type="number"
                  step="any"
                  min="0"
                  required
                  :disabled="disable[0]"
                  class="form-control text-center"
                  v-model="item.Trades.price"
                  @click="toggleDisable(0)"
                  @focusout="
                    toggleDisable();
                    putTrade('', item);
                  "
                />
                <div class="input-group-append">
                  <div class="input-group-text">so'm</div>
                </div>
              </div>
            </form>
          </td>
          <td>
            <!-- <form @submit.prevent="putTrade('', item)" id="form-discount" /> -->
            <form @submit.prevent="countPrice(item)" id="form-discount-1" />
            <div class="input-group input-group-sm">
              <input
                type="number"
                step="any"
                min="0"
                required
                :disabled="disable[1]"
                class="form-control text-center"
                form="form-discount"
                v-model="item.Trades.discount"
                @click="
                  item.Trades.discount ? false : (item.Trades.discount = null);
                  toggleDisable(1);
                "
                @focusout="
                  item.Trades.discount ? false : (item.Trades.discount = 0);
                  toggleDisable();
                  putTrade('discount', item);
                "
              />
              <div class="input-group-text">so'm</div>
              <input
                type="number"
                step="any"
                min="0"
                required
                :disabled="disable[2]"
                class="form-control text-center"
                form="form-discount-1"
                v-model="item.Trades.discount_percent"
                @click="
                  item.Trades.discount_percent
                    ? false
                    : (item.Trades.discount_percent = null);
                  toggleDisable(2);
                "
                @focusout="
                  item.Trades.discount_percent
                    ? false
                    : (item.Trades.discount_percent = 0);
                  toggleDisable();
                  countPrice(item);
                "
              />
              <div class="input-group-text">%</div>
            </div>
            <div
              class="input-group input-group-sm"
              v-if="item.Trades.price == item.Trades.discount"
            >
              {{ item.Trades.comment }}
            </div>
          </td>
          <td>
            <span
              :class="
                !item.Trades.discount
                  ? item.Trades.price - item.Trades.discount >
                    item.Products.sotuv_narx
                    ? 'text-success'
                    : item.Trades.price - item.Trades.discount <=
                        item.Products.sotuv_narx &&
                      item.Trades.price - item.Trades.discount >=
                        item.Products.oxirgi_narx
                    ? 'text-warning'
                    : 'text-danger'
                  : ''
              "
            >
              {{
                Intl.NumberFormat().format(
                  (item.Trades.price - item.Trades.discount) * item.sum_quantity
                ) + " so'm"
              }}
            </span>
          </td>
          <td>
            <button
              class="btn btn-sm btn-outline-danger"
              @click="putTrade('delete', item)"
            >
              <i class="fa fa-trash" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <Bar />

  <div class="modal fade" id="confirm">
    <div class="modal-dialog">
      <div class="modal-content">
        <form @submit.prevent="confirmOrder(order_confirm)" v-if="order">
          <div class="modal-body">
            <div class="row my-1">
              <div class="col-md-12">
                <h4>
                  Buyurtma balansi:
                  <strong>
                    {{
                      Intl.NumberFormat().format(order_balance.total_price) +
                      " so'm"
                    }}
                  </strong>
                </h4>
              </div>
            </div>
            <h5>Mijoz</h5>
            <div class="row my-1">
              <label class="col-md-4">
                <input
                  class="form-radio"
                  type="radio"
                  value="none"
                  v-model="customer_type"
                />
                Umumiy
              </label>
              <label class="col-md-4">
                <input
                  class="form-radio"
                  type="radio"
                  value="customer"
                  v-model="customer_type"
                />
                Doimiy
              </label>
              <label class="col-md-4">
                <input
                  class="form-radio"
                  type="radio"
                  value="new"
                  v-model="customer_type"
                />
                Yangi
              </label>
            </div>
            <div class="row my-1" v-if="customer_type == 'customer'">
              <div class="col-md-12">
                <div class="dropdown">
                  <button
                    class="btn btn-sm btn-block btn-secondary dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    {{ customer ? customer.name : "Mijoz tanlang" }}
                  </button>
                  <div
                    class="dropdown-menu w-100"
                    aria-labelledby="dropdownMenuButton"
                  >
                    <input
                      class="form-control form-control-sm"
                      type="text"
                      placeholder="qidiruv"
                      v-model="customer_search"
                    />
                    <div class="scroll-menu" @scroll="scrolling(dropdown_menu)">
                      <button
                        type="button"
                        v-for="item in customers"
                        :key="item"
                        class="dropdown-item"
                        @click="(customer = item), (customer_search = '')"
                      >
                        {{ `${item.name} +998${item.phone}` }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row my-1" v-if="customer_type == 'new'">
              <div class="col-md-6 mb-1">
                <input
                  type="text"
                  class="form-control form-control-sm"
                  placeholder="ism"
                  required
                  v-model="order_confirm.customer_name"
                />
              </div>
              <div class="col-md-6 mb-1">
                <div class="input-group input-group-sm">
                  <div class="input-group-prepend">
                    <div class="input-group-text">+998</div>
                  </div>
                  <input
                    type="phone"
                    minlength="9"
                    maxlength="9"
                    class="form-control"
                    placeholder="tel"
                    required
                    v-model="order_confirm.customer_phone"
                  />
                </div>
              </div>
              <div class="col-md-6 mb-1">
                <input
                  type="date"
                  class="form-control form-control-sm"
                  required
                  v-model="order_confirm.customer_birthday"
                />
              </div>
              <div class="col-md-6 mb-1">
                <select
                  class="form-select form-select-sm"
                  required
                  v-model="order_confirm.customer_type"
                >
                  <option hidden value="">mijoz turi</option>
                  <option value="premium">premium</option>
                  <option value="umumiy">umumiy</option>
                </select>
              </div>
              <div class="col-md-12 mb-1">
                <input
                  type="text"
                  class="form-control form-control-sm"
                  required
                  placeholder="manzil"
                  v-model="order_confirm.customer_address"
                />
              </div>
              <div class="col-md-12 mb-1">
                <div class="row">
                  <div class="col-md-6 mb-1">
                    <input
                      type="text"
                      class="form-control form-control-sm"
                      required
                      placeholder="uzunlik"
                      v-model="order_confirm.customer_lat"
                    />
                  </div>
                  <div class="col-md-6 mb-1">
                    <input
                      type="text"
                      class="form-control form-control-sm"
                      required
                      placeholder="kenglik"
                      v-model="order_confirm.customer_long"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row my-1" v-if="customer_type">
              <div class="col-md-12">
                To'lov summa
                <div class="row my-1">
                  <div class="col-md-6">
                    <div class="input-group input-group-sm">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        :max="max(order_confirm.money[0].paid_money)"
                        class="form-control form-control-sm"
                        v-model="order_confirm.money[0].paid_money"
                      />
                      <div class="input-group-append">
                        <div class="input-group-text">naxt</div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="input-group input-group-sm">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        :max="max(order_confirm.money[1].paid_money)"
                        class="form-control form-control-sm"
                        v-model="order_confirm.money[1].paid_money"
                      />
                      <div class="input-group-append">
                        <div class="input-group-text">plastik</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div :class="customer_type == 'none' ? 'col-md-12' : 'col-md-6'">
                Chegirma summa
                <input
                  type="number"
                  min="0"
                  :max="max(order_confirm.discount)"
                  step="any"
                  class="form-control form-control-sm"
                  placeholder="chegirma summa"
                  v-model="order_confirm.discount"
                />
              </div>
              <div :class="customer_type == 'none' ? 'col-md-12' : 'col-md-6'">
                Yetkazilganda olinadigan summa
                <input
                  type="number"
                  min="0"
                  :max="max(order_confirm.delivery_money)"
                  step="any"
                  class="form-control form-control-sm"
                  placeholder="yakuniy summa"
                  v-model="order_confirm.delivery_money"
                />
              </div>
              <div class="col-md-12" v-if="customer_type !== 'none'">
                Nasiya summa
                <input
                  type="number"
                  min="0"
                  :max="max(loan_price)"
                  class="form-control form-control-sm"
                  placeholder="nasiya summa"
                  v-model="loan_price"
                />
              </div>
              <div class="col-md-12 my-1" v-if="loan_price">
                Nasiya qaytarish sanasi
                <input
                  type="date"
                  class="form-control form-control-sm"
                  required
                  v-model="order_confirm.loan_repayment_date"
                />
              </div>
              <div class="col-md-12 my-1">
                Kassa
                <select
                  class="form-select form-select-sm"
                  required
                  v-model="order_confirm.kassa_id"
                >
                  <option v-for="item in cashiers" :key="item" :value="item.id">
                    {{ item.name }}
                  </option>
                </select>
              </div>
              <div class="col-md-12 my-1">
                Hodim
                <select
                  class="form-select form-select-sm"
                  @click="users.length ? false : getUsers()"
                  v-model="order_confirm.seller_id"
                >
                  <option v-for="item in users" :key="item" :value="item.id">
                    {{ item.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-primary">
              <i class="far fa-circle-check" />
            </button>
            <button
              class="btn btn-outline-danger"
              data-dismiss="modal"
              close-confirmation
            >
              <i class="far fa-circle-xmark" />
            </button>
          </div>
        </form>
        <div class="modal-body" v-if="!order">
          <h4>Buyurtma mavjud emas</h4>
        </div>
        <div class="modal-footer" v-if="!order">
          <button class="btn btn-outline-danger" data-dismiss="modal">
            <i class="far fa-circle-xmark" />
          </button>
        </div>
      </div>
    </div>
  </div>

  <check :order-id="order?.id" ref="check" />
</template>

<script>
import Bar from "./BottomBar.vue";
import check from "../../components/order/check.vue";
import * as api from "@/components/Api/Api";
import swal from "sweetalert";
export default {
  name: "Kassa",
  components: { Bar, check },
  data() {
    return {
      cashiers: [],
      page: 0,
      pages: 1,
      limit: 50,
      barcode: "",
      products: [],
      order: null,
      order_balance: {
        currency: null,
        currency_id: null,
        total_price: null,
      },
      orders: [],
      trade: {
        code: null,
        quantity: 1,
        price: 0,
        discount: 0,
        order_id: 0,
        comment: "",
      },
      trades: [],
      customer_type: "",
      customer: null,
      customer_search: "",
      customers: [],
      dropdown_menu: null,
      order_confirm: {
        id: 0,
        customer_name: "",
        customer_phone: null,
        customer_birthday: "",
        customer_type: "",
        customer_address: "",
        customer_long: "",
        customer_lat: "",
        discount: null,
        money: [
          {
            paid_money: null,
            type: "naxt",
          },
          {
            paid_money: null,
            type: "plastik",
          },
        ],
        loan_repayment_date: null,
        seller_id: 0,
        comment: "",
        worker_id: 0,
        ustanovshik_id: 0,
        delivery_money: null,
        kassa_id: 0,
      },
      loan_price: null,
      users: [],
      order_id: null,
      order_check: false,
      disable: [false, false, false, false, false],
    };
  },
  created() {
    this.get(0, 100);
    this.getCashiers();
  },
  mounted() {
    if (this.order) {
      document.querySelector("#barcode").focus();
    }
    document.querySelector("[confirm-modal-button]").onclick = () => {
      this.order_confirm.money[0].paid_money = this.order_balance.total_price;
    };
  },
  watch: {
    customer_type(customer_type) {
      if (customer_type == "customer") {
        api.customers(0, this.limit, this.customer_search).then((Response) => {
          this.customers = Response.data.data;
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.dropdown_menu = document.querySelector(".scroll-menu");
        });
      } else if (customer_type == "none") {
        this.order_confirm.customer_name = null;
        this.order_confirm.customer_phone = 0;
        this.order_confirm.customer_birthday = null;
        this.order_confirm.customer_type = null;
      } else if (customer_type == "new") {
        this.customer = null;
        this.order_confirm.customer_name = null;
        this.order_confirm.customer_phone = null;
        this.order_confirm.customer_birthday = null;
        this.order_confirm.customer_type = "";
      }
    },
    customer_search(search) {
      api.customers(0, this.limit, search).then((Response) => {
        this.customers = Response.data.data;
        this.page = Response.data.current_page;
        this.pages = Response.data.pages;
      });
    },
    customer(customer) {
      if (customer) {
        this.order_confirm.customer_name = customer.name;
        this.order_confirm.customer_phone = customer.phone;
        this.order_confirm.customer_birthday = customer.birthday;
        this.order_confirm.customer_type = customer.type;
        this.order_confirm.customer_address = customer.address;
        this.order_confirm.customer_long = customer.map_long;
        this.order_confirm.customer_lat = customer.map_lat;
      }
    },
  },
  methods: {
    max(price) {
      return (
        this.order_balance.total_price -
        (this.order_confirm.money[0].paid_money +
          this.order_confirm.money[1].paid_money +
          this.order_confirm.discount +
          this.order_confirm.delivery_money +
          this.loan_price) +
        price
      );
    },
    toggleDisable(index) {
      let timeout;
      clearTimeout(timeout);
      if (index !== undefined) {
        for (let i = 0; i < this.disable.length; i++) {
          if (index !== i) {
            this.disable[i] = true;
          }
        }
      } else {
        timeout = setTimeout(() => {
          for (let i = 0; i < this.disable.length; i++) {
            this.disable[i] = false;
          }
        }, 100);
      }
    },
    get(page, limit) {
      api.orders("", "", false, 0, 0, 0, "", page, limit).then((Response) => {
        this.orders = Response.data.data;
        if (this.orders.length) {
          this.order = this.orders[0];
          this.getTrades(this.order);
        } else {
          this.order = null;
          this.order_balance = {
            currency: null,
            currency_id: null,
            total_price: null,
          };
        }
      });
    },
    getCashiers() {
      api.kassa("", 0, localStorage["branch_id"]).then((res) => {
        this.cashiers = res.data;
      });
    },
    getTrades(order) {
      api.trades(order.id, 0, 50).then((Response) => {
        this.trades = Response.data.data;
        this.trades.forEach((item) => {
          item.Trades.discount_percent = this.countPercent(item);
          if (!item.Trades.discount) item.Discounts = null;
        });
        this.getBalance(this.order.id);
      });
    },
    getBalance(id) {
      api.tradeBalance(id).then((Response) => {
        this.order_balance = Response.data;
        document.querySelector("#barcode").focus();
      });
    },
    addOrder() {
      api.createOrder().then((Response) => {
        api.success().then(() => {
          this.get(0, 50);
        });
      });
    },
    deleteOrder(id) {
      api.removeOrder(id).then((Response) => {
        api.success().then(() => {
          this.get(0, 50);
        });
      });
    },
    confirmOrder(order) {
      if (order.customer_phone == null) {
        swal({
          icon: "warning",
          title: "Mijoz tanlang !",
          timer: 1500,
        });
      } else {
        order.id = this.order.id;
        order.money[0].paid_money = order.money[0].paid_money || 0;
        order.money[1].paid_money = order.money[1].paid_money || 0;
        order.discount = order.discount || 0;
        order.delivery_money = order.delivery_money || 0;
        api.confirmationOrder(order).then((Response) => {
          document.querySelector("[close-confirmation]").click();
          this.order_confirm = {
            id: 0,
            customer_name: "",
            customer_phone: null,
            customer_birthday: "",
            customer_type: "",
            customer_address: "",
            customer_long: "",
            customer_lat: "",
            discount: null,
            money: [
              {
                paid_money: null,
                type: "naxt",
              },
              {
                paid_money: null,
                type: "plastik",
              },
            ],
            loan_repayment_date: null,
            seller_id: 0,
            comment: "",
            worker_id: 0,
            delivery_money: null,
          };
          this.trades = [];
          api.success().then(() => {
            this.printOrder();
          });
        });
      }
    },
    getProduct(code) {
      if (code) {
        api.productsForTrade(code, 0, 50).then((Response) => {
          this.products = Response.data.data;
        });
      } else {
        this.products = [];
      }
    },
    addTrade(trade) {
      if (this.barcode) {
        trade.code = this.barcode;
        trade.order_id = this.order.id;
        api.toTrade(trade).then(
          (Response) => {
            this.barcode = "";
            api.success().then(() => {
              this.products = [];
              this.getTrades(this.order);
            });
          },
          () => {
            this.barcode = "";
            this.products = [];
            document.querySelector("#barcode").focus();
          }
        );
      }
    },
    countCurrency(trade, price) {
      const product_currency = trade.currency_pr,
        trade_currency = trade.Products.currency_savdo;
      return (price * product_currency.price) / trade_currency.price;
    },
    putTrade(type, trade) {
      let status = null;
      let data = {
        code: trade.Trades.code,
        quantity: null,
        price: trade.Trades.price,
        discount: trade.Trades.discount,
        order_id: this.order.id,
        comment: trade.Trades.comment,
      };
      if (type == "<") {
        data.quantity = 1;
        status = false;
      } else if (type == ">") {
        data.quantity = 1;
        status = true;
      } else if (type == "delete") {
        data.discount = 0;
        data.quantity = trade.sum_quantity;
        status = false;
      } else {
        // data.quantity = trade.sum_quantity;
        data.quantity = 0;
        status = true;
      }
      if (
        trade.Trades.price == trade.Trades.discount &&
        !trade.Trades.comment
      ) {
        this.addCommentToTrade(trade);
      }
      api.updateTrade(status, data).then(
        (Response) => {
          this.getTrades(this.order);
        },
        () => {
          this.getTrades(this.order);
        }
      );
    },
    addCommentToTrade(trade) {
      swal({
        icon: "info",
        title: "Izoh kiriting !",
        text: "Ushbu chegirma uchun izoh talab etiladi",
        closeOnEsc: false,
        closeOnClickOutside: false,
        content: {
          element: "input",
          attributes: {
            class: "form-control",
          },
        },
      }).then((value) => {
        if (value) {
          trade.Trades.comment = value;
          this.putTrade("", trade);
        } else {
          this.addCommentToTrade(trade);
        }
      });
    },
    countPercent(trade) {
      let percent;
      if (trade.Trades.discount) {
        percent = (trade.Trades.discount * 100) / trade.Trades.price;
      } else {
        percent = 0;
      }
      return percent;
    },
    countPrice(trade) {
      if (trade.Trades.discount_percent) {
        trade.Trades.discount =
          (trade.Trades.price / 100) * trade.Trades.discount_percent;
      } else {
        trade.Trades.discount = 0;
      }
      this.putTrade("discount", trade);
    },
    getUsers() {
      api
        .users(localStorage.getItem("branch_id"), 0, ["seller"], 0, 50)
        .then((Response) => {
          this.users = Response.data.data;
        });
    },
    scrolling(menu) {
      if (menu.scrollTop + menu.clientHeight >= menu.scrollHeight) {
        if (this.page < this.pages - 1) {
          api
            .customers(this.page + 1, this.limit, this.customer_search)
            .then((Response) => {
              this.customers = this.customers.concat(Response.data.data);
              this.page = Response.data.current_page;
              this.pages = Response.data.pages;
            });
        }
      }
    },
    printOrder() {
      this.order_check = false;
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
          this.$refs.check.start();
        } else {
          this.get(0, 100);
        }
      });
    },
  },
};
</script>

<style scoped>
.responsive {
  max-height: 65vh;
}

.col-md-2 {
  display: flex;
  justify-content: center;
  align-items: center;
}

.col-md-10 {
  overflow-x: auto;
  display: flex;
  flex-wrap: nowrap;
}

::-webkit-scrollbar {
  height: 10px;
}

.btn-group > button {
  box-shadow: none;
}

.scroll-menu {
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 200px;
}

td {
  vertical-align: middle;
}

img {
  width: 65%;
}

label {
  cursor: pointer;
}

input[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
}

input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
