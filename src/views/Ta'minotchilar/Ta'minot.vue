<template>
  <h3><span class="fa fa-box" /> Ta'minot</h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1">
      <div class="btn-group" v-if="supplyType && !party?.warehouseman">
        <button
          class="btn btn-sm btn-outline-secondary"
          data-toggle="modal"
          data-target="#addTaminotchi"
        >
          <i class="fa fa-circle-plus" /> Ta'minotchi qo'shish
        </button>
        <button
          class="btn btn-sm btn-outline-success"
          data-toggle="modal"
          data-target="#confirm"
          @click="getWarehouses(0, 100)"
        >
          <i class="far fa-circle-check" /> Yakunlash
        </button>
      </div>
    </div>
    <div class="col-md-4">
      <button
        v-if="
          party?.warehouseman &&
          !party?.warehouseman_id &&
          role == 'warehouseman'
        "
        class="btn btn-sm btn-block btn-outline-success"
        @click="confirmParty()"
      >
        <i class="far fa-circle-check" /> Tasdiqlash
      </button>
    </div>
  </div>
  <!-- <div class="row">
    <div class="col-md-6">
      <b>Mahsulot: </b>
      <span v-for="item in totalPrice" :key="item">
        {{ item.total_price }} {{ item.Supplies.currency.currency }}
        <i class="fa fa-coin" />
      </span>
    </div>
    <div class="col-md-6">
      <b>Chiqim: </b>
      <span v-for="item in totalExpense" :key="item">
        {{ item.total_expence_price }} {{ item.Expenses.currency.currency }}
        <i class="fa fa-coin" />
      </span>
    </div>
  </div> -->
  <hr />

  <ul
    class="nav nav-pills nav-justified mb-3"
    id="pills-tab"
    role="tablist"
    v-if="role !== 'warehouseman'"
  >
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
        Mahsulotlar
        <span v-for="(item, index) in totalPrice" :key="item">
          {{
            (index !== 0 ? ", " : "") +
            Intl.NumberFormat().format(item.total_price)
          }}
          {{ item.Supplies.currency.currency }}
        </span>
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
      >
        Xarajatlar
        <span v-for="(item, index) in totalExpense" :key="item">
          {{
            (index !== 0 ? ", " : "") +
            Intl.NumberFormat().format(item.total_expence_price)
          }}
          {{ item.Expenses.currency.currency }}
        </span>
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
      <div
        class="row"
        v-if="supplyType && !party?.warehouseman && role !== 'warehouseman'"
      >
        <div class="col-md-12">
          <form @submit.prevent="post()">
            <div class="row m-1">
              <div class="col-md-6 my-1">
                <select
                  class="form-select form-select-sm"
                  required
                  v-model="supply.market_id"
                  @click="markets.length ? '' : getMarkets(0, 100)"
                >
                  <option hidden value="">Ta'minotchi</option>
                  <option v-for="item in markets" :key="item" :value="item.id">
                    {{ item.name }}
                  </option>
                </select>
              </div>
              <div class="col-md-6 my-1">
                <div class="dropdown">
                  <button
                    id="customerDropdown"
                    type="button"
                    class="btn btn-sm btn-block btn-outline-secondary dropdown-toggle"
                    data-toggle="dropdown"
                    @click="getProductExamples()"
                  >
                    {{
                      example
                        ? example.Product_examples.name +
                          " " +
                          example.Product_examples.articul +
                          " " +
                          example.Product_examples.code
                        : "Mahsulot"
                    }}
                  </button>
                  <div
                    class="dropdown-menu w-100 p-1"
                    aria-labelledby="customerDropdown"
                  >
                    <input
                      type="text"
                      class="form-control form-control-sm"
                      placeholder="qidiruv"
                      v-model="search_example"
                      @keyup="getProductExamples()"
                    />
                    <ul
                      class="list-group p-1 responsive"
                      style="max-height: 25vh"
                      @scroll="scrollProductExamples($event)"
                    >
                      <li
                        class="list-group-item p-2"
                        v-for="item in examples.data"
                        :key="item"
                        @click="example = item"
                      >
                        {{
                          item.Product_examples.code +
                          " - " +
                          item.Product_examples.name +
                          " - " +
                          item.Product_examples.articul +
                          " - " +
                          item.Categories.name
                        }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="col-md-5 my-1">
                <div class="input-group input-group-sm">
                  <input
                    class="form-control"
                    type="number"
                    min="1"
                    placeholder="miqdor"
                    required
                    v-model="supply.quantity"
                  />
                  <div class="input-group-text">dona</div>
                </div>
              </div>
              <div class="col-md-5 my-1">
                <div class="input-group input-group-sm">
                  <input
                    class="form-control form-control-sm"
                    type="number"
                    min="1"
                    step="any"
                    placeholder="narx"
                    required
                    v-model="supply.price"
                  />
                  <div class="input-group-append">
                    <select
                      class="form-select form-select-sm"
                      required
                      v-model="supply.currency_id"
                      @click="currencies.length ? '' : getCurrencies()"
                    >
                      <option
                        v-for="item in currencies"
                        :key="item"
                        :value="item.id"
                      >
                        {{ item.currency }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="col-md-2 my-1">
                <button
                  class="btn btn-sm btn-block btn-outline-secondary"
                  :disabled="!example"
                >
                  <i class="far fa-circle-check" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div class="responsive">
        <div class="row">
          <div
            class="col-md-11 mx-auto my-1"
            v-for="item in supplies"
            :key="item"
          >
            <details>
              <summary>
                <h5>
                  {{ item.market }}
                </h5>
              </summary>
              <div class="table-responsive text-center">
                <table class="table table-sm table-hover table-borderless">
                  <thead>
                    <tr>
                      <th>Kategoriya</th>
                      <th>Kodi</th>
                      <th>Artikul</th>
                      <th>Nomi</th>
                      <th v-if="role !== 'warehouseman'">Narx</th>
                      <th>Soni</th>
                      <th v-if="role !== 'warehouseman'">Summa</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in item.supplies" :key="item">
                      <td>{{ item.category.name }}</td>
                      <td>
                        {{ item.name2 }}
                      </td>
                      <td>
                        {{ item.articul }}
                      </td>
                      <td>
                        {{ item.name }}
                      </td>
                      <td v-if="role !== 'warehouseman'">
                        {{ Intl.NumberFormat().format(item.price) }}
                        {{ item.currency.currency }}
                      </td>
                      <td>{{ item.quantity }} dona</td>
                      <td v-if="role !== 'warehouseman'">
                        {{
                          Intl.NumberFormat().format(item.quantity * item.price)
                        }}
                        {{ item.currency.currency }}
                      </td>
                      <td>
                        <button
                          class="btn btn-sm btn-outline-danger"
                          @click="remove(item.id)"
                        >
                          <i class="fa fa-trash" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
    <div
      class="tab-pane fade"
      id="pills-profile"
      role="tabpanel"
      aria-labelledby="pills-profile-tab"
    >
      <div
        class="row"
        v-if="supplyType && !party?.warehouseman && role !== 'warehouseman'"
      >
        <div class="col-md-11 mx-auto">
          <form @submit.prevent="postExpense(expense)">
            <div class="row my-1">
              <div class="col-md-5 my-1">
                <div class="input-group input-group-sm">
                  <input
                    class="form-control"
                    type="number"
                    min="1"
                    placeholder="chiqim summasi"
                    required
                    v-model="expense.price"
                  />
                  <div class="input-group-append">
                    <select
                      class="form-select form-select-sm"
                      required
                      v-model="expense.currency_id"
                      @click="currencies.length ? '' : getCurrencies()"
                    >
                      <option
                        v-for="item in currencies"
                        :key="item"
                        :value="item.id"
                      >
                        {{ item.currency }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="col-md-6 my-1">
                <input
                  class="form-control form-control-sm"
                  type="text"
                  placeholder="izoh"
                  required
                  v-model="expense.comment"
                />
              </div>
              <div class="col-md-1 my-1">
                <button class="btn btn-sm btn-block btn-outline-secondary">
                  <i class="far fa-circle-check" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div class="responsive">
        <div class="row my-1">
          <div class="col-md-11 mx-auto">
            <ul class="list-group">
              <li class="list-group-item" v-for="item in expenses" :key="item">
                <span>
                  <strong>Summa: </strong>
                  {{ Intl.NumberFormat().format(item.Expenses.price) }}
                  {{ item.Expenses.currency.currency }}
                  <br />
                  <b>Izoh: </b>{{ item.Expenses.comment }}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="addTaminotchi">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Ta'minotchi qo'shish</h4>
        </div>
        <form @submit.prevent="postMarket(addTaminotchi)">
          <div class="modal-body">
            <div class="row gap-2">
              <div class="col-10 mx-auto">
                Ism
                <input
                  class="form-control form-control-sm"
                  type="text"
                  placeholder="ism"
                  required
                  v-model="addTaminotchi.name"
                />
              </div>
              <div class="col-10 mx-auto">
                Telefon raqami
                <div class="input-group input-group-sm">
                  <div class="input-group-prepend">
                    <div class="input-group-text">+</div>
                  </div>
                  <input
                    class="form-control"
                    type="tel"
                    placeholder="tel"
                    minlength="9"
                    required
                    v-model="addTaminotchi.phone"
                  />
                </div>
              </div>
              <div class="col-10 mx-auto">
                Manzil
                <input
                  class="form-control form-control-sm"
                  type="text"
                  placeholder="manzil"
                  required
                  v-model="addTaminotchi.address"
                />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-primary">
              <span class="far fa-circle-check" />
            </button>
            <button
              id="close-modal"
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

  <div class="modal fade" id="confirm">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">
          <div class="row">
            <div class="col-md-12">
              <span v-for="(item, index) in totalExpense" :key="item">
                {{ Intl.NumberFormat().format(item.total_expence_price) }}
                {{ item.Expenses.currency.currency }}
                <span v-if="index !== totalExpense.length - 1">, </span>
              </span>
              <label>
                <form @submit.prevent="updateParty()" id="form-confirmation">
                  Chiqimlarni yaxlitlash uchun valyuta turini tanlang
                  <div class="input-group input-group-sm mt-1">
                    <select
                      class="form-select form-select-sm"
                      required
                      v-model="currency_id"
                      @click="currencies.length ? '' : getCurrencies()"
                    >
                      <option
                        v-for="item in currencies"
                        :key="item"
                        :value="item.id"
                      >
                        {{ item.currency }}
                      </option>
                    </select>
                  </div>
                </form>
              </label>
            </div>
            <div class="col-md-12">
              <!-- <label> -->
              Chiqimlarni yaxlitlash turini tanlang
              <div class="row">
                <div class="col-md-6">
                  <label
                    :class="`btn btn${to_price ? '-outline-' : '-'}secondary`"
                  >
                    <input type="radio" v-model="to_price" :value="false" />
                    Mahsulot miqdori bo'yicha
                  </label>
                </div>
                <div class="col-md-6">
                  <label
                    :class="`btn btn${to_price ? '-' : '-outline-'}secondary`"
                  >
                    <input type="radio" v-model="to_price" :value="true" />
                    Mahsulot narxi bo'yicha
                  </label>
                </div>
              </div>
              <!-- <select
                  form="form-confirmation"
                  class="form-select form-select-sm"
                  required
                  v-model="to_price"
                >
                  <option :value="false">Mahsulot miqdori bo'yicha</option>
                  <option :value="true">Mahsulot narxi bo'yicha</option>
                </select> -->
              <!-- </label> -->
            </div>
            <div class="col-md-12">
              <h4>Omborni tanlang</h4>
              <!-- <div class="row">
                <div class="col-md-6 my-1">
                  <button
                    :class="`tab btn btn-block btn${
                      to_branch ? '-outline-' : '-'
                    }secondary`"
                    @click="to_branch = false"
                  >
                    <i class="fa fa-warehouse" /> Omborga yuborish
                  </button>
                </div>
                <div class="col-md-6 my-1">
                  <button
                    :class="`tab btn btn-block btn${
                      to_branch ? '-' : '-outline-'
                    }secondary`"
                    @click="to_branch = true"
                  >
                    <i class="fa fa-code-branch" /> Filialga yuborish
                  </button>
                </div>
              </div> -->
            </div>
            <div class="col-md-12">
              <ul class="list-group" v-if="!to_branch">
                <button
                  form="form-confirmation"
                  class="list-group-item"
                  v-for="item in warehouses"
                  :key="item"
                  @click="to_id = item.id"
                >
                  {{ item.name }}
                </button>
              </ul>
              <ul class="list-group" v-if="to_branch">
                <button
                  form="form-confirmation"
                  class="list-group-item"
                  v-for="item in branches"
                  :key="item"
                  @click="to_id"
                >
                  {{ item.name }}
                </button>
              </ul>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-danger" data-dismiss="modal">
            <i class="far fa-circle-xmark" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from "@/components/Api/Api";
import swal from "sweetalert";
export default {
  name: "Ta'minot",
  data() {
    return {
      role: localStorage["role"],
      branch_id: localStorage["branch_id"],
      supplyType: false,
      party: null,
      markets: [],
      search_example: "",
      examples: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
      example: null,
      currencies: [],
      supplies: [],
      warehouses: [],
      branches: [],
      expenses: [],
      totalPrice: [],
      totalExpense: [],
      supply: {
        category_id: null,
        articul: null,
        name: null,
        name2: null,
        quantity: null,
        price: null,
        currency_id: "",
        market_id: "",
        party_id: this.$route.params.id,
      },
      expense: {
        price: null,
        currency_id: "",
        source: null,
        comment: null,
      },
      addTaminotchi: {
        name: null,
        phone: null,
        address: null,
      },
      currency_id: "",
      to_branch: false,
      to_price: false,
      to_id: 0,
    };
  },
  created() {
    this.getParty();
    this.getMarkets(0, 25);
    this.getCurrencies();
    this.get(0, 100);
  },
  methods: {
    get() {
      this.getBalances();
      this.getSupplies(0, 25);
      this.getExpenses(0, 25);
    },
    getParty() {
      api.party(this.$route.params.id).then((res) => {
        this.party = res.data;
        this.supplyType = !res.data.status;
      });
    },
    getMarkets(page, limit) {
      api.markets(page, limit).then((Response) => {
        this.markets = Response.data.data;
      });
    },
    getBalances() {
      api.partyBalances(this.$route.params.id).then((Response) => {
        this.totalPrice = Response.data.total_price;
        this.totalExpense = Response.data.total_expence_price;
      });
    },
    getExpenses(page, limit) {
      api.partyExpenses(this.$route.params.id, page, limit).then((Response) => {
        this.expenses = Response.data.data;
      });
    },
    getSupplies(page, limit) {
      this.supplies = [];
      api.supplies(0, this.$route.params.id, page, limit).then((Response) => {
        if (Response.data.data.length) {
          this.replace(Response.data.data);
        }
      });
    },
    getProductExamples() {
      api.productExamples(this.search_example, 0, 0, 25).then((res) => {
        this.examples = res.data;
      });
    },
    scrollProductExamples(event) {
      const div = event.target;
      if (div.scrollTop + div.clientHeight == div.scrollHeight) {
        if (this.examples.current_page < this.examples.pages - 1) {
          api
            .productExamples(
              this.search_example,
              0,
              this.examples.current_page + 1,
              25
            )
            .then((res) => {
              this.examples.current_page = res.data.current_page;
              this.examples.data = this.examples.data.concat(res.data.data);
            });
        }
      }
    },
    replace(data) {
      for (let i = 0; i < this.markets.length; i++) {
        if (
          data.find((item) => {
            return item.market_id == this.markets[i].id;
          })
        ) {
          this.supplies.push({
            market: this.markets[i].name,
            supplies: data.filter((item) => {
              return item.market_id == this.markets[i].id;
            }),
          });
          this.supplies.sort((x, y) => {
            let a = x.market,
              b = y.market;
            return a > b ? 1 : a == b ? 0 : -1;
          });
        }
      }
    },
    getCurrencies() {
      api.currencies().then((Response) => {
        this.currencies = Response.data;
        this.supply.currency_id = this.currencies[0].id;
        this.expense.currency_id = this.currencies[0].id;
        this.currency_id = this.currencies[0].id;
      });
    },
    getWarehouses(page, limit) {
      api.warehouses(page, limit).then((Response) => {
        this.warehouses = Response.data;
        this.getBranches();
      });
    },
    getBranches() {
      api.branches().then((Response) => {
        this.branches = Response.data.branch;
      });
    },
    post() {
      this.supply.articul = this.example.Product_examples.articul;
      this.supply.category_id = this.example.Categories.id;
      this.supply.name = this.example.Product_examples.name;
      this.supply.name2 = this.example.Product_examples.code;
      api.takeSupply(this.supply).then((Response) => {
        api.success().then(() => {
          this.supply.quantity = null;
          this.supply.price = null;
          this.supply.currency_id = this.currencies[0].id;
          this.get();
        });
      });
    },
    postExpense(data) {
      data.source = Number(this.$route.params.id);
      api.payForPartyExpense(data).then((Response) => {
        api.success().then(() => {
          this.expense.price = null;
          this.expense.currency_id = "";
          this.expense.comment = null;
          this.get();
        });
      });
    },
    postMarket(data) {
      api.createMarket(data).then((Response) => {
        document.querySelector("#close-modal").click();
        api.success().then(() => {
          this.addTaminotchi = {
            name: null,
            phone: null,
            address: null,
          };
          this.getMarkets(0, 100);
        });
      });
    },
    remove(id) {
      swal({
        icon: "warning",
        title: "Ushbu mahsulot o'chirilsinmi ?",
        buttons: {
          confirm: true,
          cancel: true,
        },
        dangerMode: true,
      }).then((value) => {
        if (value) {
          api.removeSupply(id).then((Response) => {
            api.success().then(() => {
              this.get();
            });
          });
        }
      });
    },
    updateParty() {
      api
        .updateParty(
          this.$route.params.id,
          this.to_id,
          this.currency_id,
          this.to_branch,
          this.to_price
        )
        .then((Response) => {
          document.querySelectorAll("[data-dismiss]")[1].click();
          api.success().then(() => {
            this.$router.push("/taminotlar");
          });
        });
    },
    confirmParty() {
      api
        .confirmationParty(this.$route.params.id, this.to_branch)
        .then((Response) => {
          document.querySelectorAll("[data-dismiss]")[1].click();
          api.success().then(() => {
            this.$router.push(`/ombor-taminotlar/${this.branch_id}`);
          });
        });
    },
  },
};
</script>

<style scoped>
details {
  border: 2px solid gray;
}

.modal .modal-body li {
  cursor: pointer;
}

li span {
  text-align: left;
}

.responsive {
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 65vh;
}

.tab {
  box-shadow: none;
}
</style>
