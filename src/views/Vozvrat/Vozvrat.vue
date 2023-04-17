<template>
  <h3><span class="fa fa-undo" /> Mahsulot qaytarish</h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1"></div>
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
        >
          Mahsulot qaytarib olish
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
          @click="
            order = null;
            loan = null;
            income = [];
            balance = null;
            trades = [];
            loans = [];
            page = 0;
            pages = 1;
            limit = 100;
            getReturnedProducts(0, 100);
          "
        >
          Qaytarib olingan mahsulotlar
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
        <div class="row my-1">
          <div class="col-md-4"></div>
          <div class="col-md-4 my-1">
            <form @submit.prevent="getOrder(order_id)">
              <input
                type="search"
                id="order_id"
                class="form-control form-control-sm"
                placeholder="buyurtma id"
                required
                v-model="order_id"
              />
            </form>
          </div>
          <div class="col-md-4"></div>
        </div>
        <div class="row my-1" v-if="order && loan && balance">
          <div class="col-md-3"></div>
          <div class="col-md-6 d-flex">
            <span>
              <h5>Buyurtma - {{ order.Orders.ordinal_number }}</h5>
            </span>
            <span>
              <h5>Mijoz: {{ order.mijoz }}</h5>
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
          </div>
          <div class="col-md-3">
            <div class="dropdown">
              <button
                class="btn dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                @click="getLoans()"
              >
                Umumiy nasiya:
                {{
                  loan.total_loan_price
                    ? Intl.NumberFormat().format(loan.total_loan_price) +
                      " so'm"
                    : 0
                }}
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <li class="dropdown-item" v-for="i in loans" :key="i">
                  {{
                    `${Intl.NumberFormat().format(
                      i.Loans.money
                    )} so'm / ${Intl.NumberFormat().format(
                      i.Loans.residual
                    )} so'm ${i.Loans.return_date}`
                  }}
                  <router-link
                    :to="`/nasiya/${i.Loans.id}/${i.Loans.order_id}`"
                    class="btn btn-sm btn-info"
                  >
                    <i class="fa fa-info" />
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="row my-1" v-if="order && income.length && balance">
          <div class="col-md-3">
            Buyurtma summasi
            <br />
            {{ Intl.NumberFormat().format(balance.total_price) + " so'm" }}
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
        <div class="table-responsive first my-1" v-if="trades.length">
          <table class="table table-sm table-hover">
            <thead>
              <tr>
                <th>Mahsulot</th>
                <th>Narx</th>
                <th>Chegirma</th>
                <th>Miqdor</th>
                <th>Summa</th>
                <th></th>
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
                  {{ i.sum_quantity }}
                  <span class="text-danger">
                    {{
                      returned_products.find((item) => {
                        return i.Trades.code == item.Returned_products.code;
                      })
                        ? " (-" +
                          returned_products.find((item) => {
                            return i.Trades.code == item.Returned_products.code;
                          }).sum_quantity +
                          ")"
                        : ""
                    }}
                  </span>
                  {{ " dona" }}
                </td>
                <td>
                  {{
                    Intl.NumberFormat().format(
                      (i.Trades.price - i.Trades.discount) * i.sum_quantity
                    ) + " so'm"
                  }}
                </td>
                <td>
                  <button
                    class="btn btn-sm btn-outline-secondary"
                    data-toggle="modal"
                    data-target="#return"
                    :disabled="
                      returned_products.length
                        ? returned_products.find((item) => {
                            return i.Trades.code == item.Returned_products.code;
                          })
                          ? returned_products.find((item) => {
                              return (
                                i.Trades.code == item.Returned_products.code
                              );
                            }).sum_quantity == i.sum_quantity
                            ? true
                            : false
                          : false
                        : false
                    "
                    @click="product = i"
                  >
                    <i class="fa fa-undo" />
                  </button>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="6">
                  <Pagination
                    :page="page"
                    :pages="pages"
                    :limit="limit"
                    @get="getTrades"
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
        <div class="table-responsive second my-1">
          <table class="table table-sm table-hover">
            <thead>
              <tr>
                <th>Mahsulot</th>
                <th>Miqdor</th>
                <th>Hodim</th>
                <th>Sana</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in returned_products" :key="i">
                <td>
                  {{ `${i.Categories?.name} - ${i.Products?.articul}` }}
                </td>
                <td>
                  {{ i.sum_quantity + " dona" }}
                </td>
                <td>{{ i.user }}</td>
                <td>
                  {{
                    i.Returned_products.time
                      .replace("T", " ")
                      .substring(i.Returned_products.time.length - 3, 0)
                  }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4">
                  <Pagination
                    :page="page"
                    :pages="pages"
                    :limit="limit"
                    @get="getReturnedProducts"
                  />
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="return">
    <div class="modal-dialog">
      <div class="modal-content" v-if="product">
        <div class="modal-header">
          <h4>
            {{ `${product.Categories.name} - ${product.Products.articul}` }}
            dan qaytarib olish
          </h4>
        </div>
        <form @submit.prevent="postReturn(return_product)">
          <div class="modal-body">
            <div class="row my-1">
              <label class="col-md-12">
                Miqdori
                <div class="input-group input-group-sm">
                  <input
                    type="number"
                    step="any"
                    min="0"
                    :max="product.sum_quantity"
                    class="form-control"
                    placeholder="miqdor"
                    required
                    v-model="return_product.quantity"
                    @keyup="count('quantity', return_product)"
                  />
                  <div class="input-group-append">
                    <div class="input-group-text">dona</div>
                  </div>
                </div>
              </label>
            </div>
            <div class="row my-1" v-if="loan.total_loan_price">
              <label class="col-md-6">
                <input
                  type="radio"
                  :value="true"
                  v-model="return_product.status"
                />
                Nasiyadan ayrish
              </label>
              <label class="col-md-6">
                <input
                  type="radio"
                  :value="false"
                  v-model="return_product.status"
                />
                Faqat kassadan qaytarish
              </label>
            </div>
            <div class="row my-1">
              <label
                :class="
                  return_product.status ? 'col-md-6 mb-1' : 'col-md-12 mb-1'
                "
              >
                Pul qaytarib berish
                <div class="input-group input-group-sm">
                  <input
                    type="number"
                    step="any"
                    min="0"
                    class="form-control"
                    placeholder="summa"
                    :required="!return_product.status"
                    v-model="return_product.price"
                  />
                  <div class="input-group-append">
                    <div class="input-group-text">so'm</div>
                  </div>
                </div>
              </label>
              <label class="col-md-6 mb-1" v-if="return_product.status">
                Nasiyadan ayrish
                <div class="input-group input-group-sm">
                  <input
                    type="number"
                    step="any"
                    min="0"
                    :max="
                      (product.Trades.price - product.Trades.discount) *
                        return_product.quantity >=
                      loan.total_loan_price
                        ? loan.total_loan_price
                        : (product.Trades.price - product.Trades.discount) *
                          return_product.quantity
                    "
                    class="form-control"
                    placeholder="summa"
                    required
                    v-model="return_product.loan_price"
                    @keyup="count('loan', return_product)"
                  />
                  <div class="input-group-append">
                    <div class="input-group-text">so'm</div>
                  </div>
                </div>
              </label>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-primary">
              <i class="far fa-circle-check" />
            </button>
            <button class="btn btn-outline-danger" data-dismiss="modal">
              <i class="far fa-circle-xmark" />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from "@/components/Api/Api";
import swal from "sweetalert";
import Pagination from "@/components/Pagination/Pagination.vue";
export default {
  name: "ReturnProduct",
  components: { Pagination },
  data() {
    return {
      page: 0,
      pages: 1,
      limit: 100,
      order_id: null,
      order: null,
      loan: null,
      income: [],
      balance: null,
      trades: [],
      loans: [],
      product: null,
      return_product: {
        quantity: null,
        price: null,
        loan_price: 0,
        status: true,
      },
      returned_products: [],
    };
  },
  created() {
    let order_id = localStorage.getItem("order_id_for_return");
    if (order_id) {
      this.order_id = order_id;
      this.getOrder(order_id);
    }
  },
  mounted() {},
  beforeUnmount() {
    localStorage.removeItem("order_id_for_return");
  },
  methods: {
    getOrder(id) {
      this.loan = null;
      this.income = [];
      this.balance = null;
      this.trades = [];
      this.loans = [];
      this.product = null;
      this.return_product = {
        quantity: null,
        price: null,
        loan_price: 0,
        status: true,
      };
      api.order(id).then((Response) => {
        this.order = Response.data;
        if (this.order) {
          this.getLoan(id);
        } else {
          swal({
            icon: "warning",
            title: "Bunday buyurtma topilmadi",
            timer: 2500,
          }).then(() => {
            document.querySelector("#order_id").focus();
          });
        }
      });
      this.order_id = null;
    },
    getLoan(id) {
      api.loan(this.order.Orders.customer_id).then((Response) => {
        this.loan = Response.data;
        if (this.loan.total_loan_price) {
          this.return_product.status = true;
        } else {
          this.return_product.status = false;
        }
        this.getIncome(id);
      });
    },
    getIncome(id) {
      api.incomes(id, "order", 0, 0, 100).then((Response) => {
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
      api.trades(this.order.Orders.id, page, limit).then((Response) => {
        this.trades = Response.data.data;
        this.getReturnedProducts(0, 100);
      });
    },
    getLoans() {
      api
        .loans(false, this.order.Orders.customer_id, 0, 100)
        .then((Response) => {
          this.loans = Response.data.data;
        });
    },
    count(status, data) {
      if (status == "quantity") {
        data.price =
          (this.product.Trades.price - this.product.Trades.discount) *
          data.quantity;
      } else if (status == "loan") {
        data.price = data.price - data.loan_price;
      }
    },
    postReturn(data) {
      api.returnProduct(this.product.Trades.id, data).then((Response) => {
        this.order = null;
        this.loan = null;
        this.income = [];
        this.balance = null;
        this.trades = [];
        this.loans = [];
        this.product = null;
        api.success(0).then(() => {});
      });
    },
    getReturnedProducts(page, limit) {
      let id = this.order ? this.order.Orders.id : 0;
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

.table-responsive.first {
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 50vh;
}

.table-responsive.second {
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 70vh;
}

.col-md-6.d-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdown-item {
  padding: 5px;
}

label {
  cursor: pointer;
}
</style>
