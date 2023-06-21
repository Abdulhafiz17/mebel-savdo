<template>
  <h3>
    <span class="fa fa-truck-loading" />
    {{ market ? "Ta'minotchi " + market.name : "Ta'minotchi" }}
  </h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1">
      <span>{{
        balance.sum_quantity ? balance.sum_quantity + " dona mahsulot - " : ""
      }}</span>
      <span v-for="(item, index) in balance.balances" :key="item">
        {{
          (index == 0 ? "" : ", ") + Intl.NumberFormat().format(item.sum_price)
        }}
        {{ item.Supplies.currency.currency }}
      </span>
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
          Olingan ta'minotlar tarixi
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
          @click="getExpenses(0, limit)"
        >
          To'lovlar tarixi
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
        <form @submit.prevent="get(0, 100)">
          <div class="row">
            <div class="col-md-5 mb-1">
              <input
                class="form-control form-control-sm"
                type="date"
                v-model="from_time2"
              />
            </div>
            <div class="col-md-5 mb-1">
              <input
                class="form-control form-control-sm"
                type="date"
                v-model="to_time2"
              />
            </div>
            <div class="col-md-2 mb-1">
              <button class="btn btn-sm btn-block btn-outline-secondary">
                <i class="fa fa-search" />
              </button>
            </div>
          </div>
        </form>
        <div class="responsive">
          <div class="row">
            <div class="col-md-11 mx-auto">
              <details
                v-for="(item, index) in parties"
                :key="item"
                :id="index"
                :style="item.party.status ? '' : 'border: 2px dotted gray'"
              >
                <summary
                  @click="
                    !$event.target.parentElement.open
                      ? getSupplies(item, 0, limit, index)
                      : false
                  "
                >
                  <strong> {{ item.party.id }} </strong>
                  <span>
                    Status: {{ item.party.status ? "Yakunlangan" : "Faol" }}
                  </span>
                  <span> {{ item.party.sana }} </span>
                </summary>
                <div class="table-responsive">
                  <table class="table table-sm table-hover">
                    <thead>
                      <tr>
                        <th>Kategoriya</th>
                        <th>Kodi</th>
                        <th>Artikul</th>
                        <th>Nomi</th>
                        <th>Narx</th>
                        <th>Miqdor</th>
                        <th>Summa</th>
                        <th>Sana</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in item.supplies" :key="item">
                        <td>{{ item.category.name }}</td>
                        <td>{{ item.name2 }}</td>
                        <td>{{ item.articul }}</td>
                        <td>{{ item.name }}</td>
                        <td>
                          {{ Intl.NumberFormat().format(item.price) }}
                          {{ item.currency.currency }}
                        </td>
                        <td>{{ item.quantity }} dona</td>
                        <td>
                          {{
                            Intl.NumberFormat().format(
                              item.price * item.quantity
                            )
                          }}
                          {{ item.currency.currency }}
                        </td>
                        <td>
                          {{
                            item.time
                              .replace("T", " ")
                              .substring(0, item.time.length - 3)
                          }}
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colspan="6">
                          <div class="input-group input-group-sm">
                            <button
                              class="btn btn-sm"
                              @click="getSupplies(item, 0, limit, index)"
                              :disabled="page == 0"
                            >
                              <i class="fa fa-angle-double-left" />
                            </button>
                            <button
                              class="btn btn-sm"
                              @click="getSupplies(item, page - 1, limit, index)"
                              :disabled="page == 0"
                            >
                              <i class="fa fa-angle-left" />
                            </button>
                            <button class="btn btn-sm">
                              {{ page + 1 }}
                            </button>
                            <button
                              class="btn btn-sm"
                              @click="getSupplies(item, page + 1, limit, index)"
                              :disabled="page == pages - 1 || pages == 0"
                            >
                              <i class="fa fa-angle-right" />
                            </button>
                            <button
                              class="btn btn-sm"
                              @click="
                                getSupplies(item, pages - 1, limit, index)
                              "
                              :disabled="page == pages - 1 || pages == 0"
                            >
                              <i class="fa fa-angle-double-right" />
                            </button>
                            <div class="input-group-append">
                              <select
                                class="form-select form-select-sm"
                                v-model="limit"
                                @change="getSupplies(item, page, limit, index)"
                              >
                                <option disabled value="">limit</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                              </select>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </details>
            </div>
            <div class="col-md-11 my-1 mx-auto text-center">
              <Pagination
                :page="page"
                :pages="pages"
                :limit="limit"
                @get="get"
              />
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
        <form @submit.prevent="getExpenses(0, 100)">
          <div class="row">
            <div class="col-md-5 mb-1">
              <input
                class="form-control form-control-sm"
                type="date"
                v-model="from_time"
              />
            </div>
            <div class="col-md-5 mb-1">
              <input
                class="form-control form-control-sm"
                type="date"
                v-model="to_time"
              />
            </div>
            <div class="col-md-2 mb-1">
              <button class="btn btn-sm btn-block btn-outline-secondary">
                <i class="fa fa-search" />
              </button>
            </div>
          </div>
        </form>
        <div class="responsive">
          <table class="table table-sm table-hover">
            <thead>
              <tr>
                <th>Summa</th>
                <th>Izoh</th>
                <th>Kim tomonidan</th>
                <th>Sana</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in expenses" :key="item">
                <td>
                  {{
                    Intl.NumberFormat().format(item.Expenses.price) +
                    " " +
                    item.Expenses.currency.currency
                  }}
                </td>
                <td>{{ item.Expenses.comment }}</td>
                <td>{{ item.Expenses.user.name }}</td>
                <td>
                  {{
                    item.Expenses.time
                      .replace("T", " ")
                      .substring(0, item.Expenses.time.length - 3)
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
                    @get="getExpenses"
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
  name: "Taminotchi",
  components: { Pagination },
  data() {
    return {
      page: 0,
      pages: 1,
      limit: 50,
      market: null,
      from_time: "",
      to_time: "",
      from_time2: "",
      to_time2: "",
      parties: [],
      expenses: [],
      balance: {
        sum_quantity: null,
        balances: [],
      },
    };
  },
  created() {
    this.getMarket(0, 50);
  },
  methods: {
    getMarket(page, limit) {
      api.market(this.$route.params.id).then((Response) => {
        this.market = Response.data;
        this.get(page, limit);
      });
    },
    get(page, limit) {
      api
        .supplies(
          this.$route.params.id,
          0,
          page,
          limit,
          this.from_time2,
          this.to_time2
        )
        .then((Response) => {
          this.parties = Response.data.data.sort((x, y) => {
            let a = x.party.status,
              b = y.party.status;
            return a == b ? 0 : a > b ? 1 : -1;
          });
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.getBalance();
        });
    },
    getBalance() {
      api.marketBalance(this.$route.params.id).then((Response) => {
        this.balance.sum_quantity = null;
        this.balance.balances = Response.data;
        Response.data.forEach((item) => {
          this.balance.sum_quantity += item.sum_quantity;
        });
      });
    },
    getSupplies(data, page, limit, index) {
      let details = document.querySelectorAll("details");
      details.forEach((item) => {
        if (Number(item.id) !== index) {
          item.removeAttribute("open");
        }
      });
      api
        .supplies(this.$route.params.id, data.party.id, page, limit)
        .then((Response) => {
          data.supplies = Response.data.data.sort((x, y) => {
            let a = x.category.name,
              b = y.category.name;
            return a > b ? 1 : a == b ? 0 : -1;
          });
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
        });
    },
    getExpenses(page, limit) {
      api
        .marketExpenses(
          this.$route.params.id,
          page,
          limit,
          this.from_time,
          this.to_time
        )
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.expenses = Response.data.data;
        });
    },
  },
};
</script>

<style scoped>
.input-group {
  display: flex;
  justify-content: center;
}
.responsive {
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 65vh;
}

details {
  border: 2px solid gray;
}
</style>
