<template>
  <h3><span class="fa fa-hand-holding-usd" /> Nasiyalar</h3>
  <div class="row">
    <div class="col-md-3"></div>
    <div class="col-md-6 my-1">
      <h4>
        Umumiy nasiya:
        {{
          sum_loan
            ? (sum_loan.sum_loan_price
                ? _.format(sum_loan.sum_loan_price)
                : 0) + " so'm"
            : ""
        }}
      </h4>
    </div>
    <div class="col-md-3"></div>
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
          @click="
            customer_id = 0;
            mijozlar = [];
            page = 0;
            pages = 1;
            limit = 25;
            getFalse(0, 25);
          "
        >
          Faol
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
            customer_id = 0;
            mijozlar = [];
            page = 0;
            pages = 1;
            limit = 25;
            getTrue(0, 25);
          "
        >
          Yakunlangan
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
        <div class="table-responsive">
          <table class="table table-sm table-hover">
            <thead>
              <tr>
                <th>
                  <select
                    class="form-select form-select-sm"
                    v-model="customer_id"
                    @change="getFalse(0, limit)"
                  >
                    <option value="0">Mijoz</option>
                    <option v-for="i in mijozlar" :key="i" :value="i.id">
                      {{ i.name }}
                    </option>
                  </select>
                </th>
                <th>Summa</th>
                <th>Muddat</th>
                <th>Qaytarish sanasi</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in loans" :key="i">
                <td>{{ i.Customers.name }}</td>
                <td>
                  {{ Intl.NumberFormat().format(i.Loans.residual) + " so'm" }}
                </td>
                <td>
                  <span
                    class="rounded p-1"
                    :class="
                      countDays(i.Loans.return_date) > 10
                        ? 'bg-success'
                        : countDays(i.Loans.return_date) <= 10 &&
                          countDays(i.Loans.return_date) > 5
                        ? 'bg-warning'
                        : 'bg-danger'
                    "
                  >
                    {{ countDays(i.Loans.return_date) + " kun" }}
                  </span>
                </td>
                <td>
                  {{ i.Loans.return_date }}
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <router-link
                      :to="`/nasiya/${i.Loans.id}/${i.Loans.order_id}`"
                      class="btn btn-outline-info"
                    >
                      <i class="fa fa-info" />
                    </router-link>
                    <button
                      class="btn btn-outline-success"
                      data-toggle="modal"
                      data-target="#pay"
                      @click="
                        loan = i;
                        loan_price = null;
                      "
                    >
                      <i class="fa fa-coins" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="5">
                  <Pagination
                    :page="page"
                    :pages="pages"
                    :limit="limit"
                    @get="getFalse"
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
        <div class="table-responsive">
          <table class="table table-sm table-hover">
            <thead>
              <tr>
                <th>
                  <select
                    class="form-select form-select-sm"
                    v-model="customer_id"
                    @change="getTrue(0, limit)"
                  >
                    <option value="0">Mijoz</option>
                    <option v-for="i in mijozlar" :key="i" :value="i.id">
                      {{ i.name }}
                    </option>
                  </select>
                </th>
                <th>Summa</th>
                <th>Qaytarish sanasi</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in loans_true" :key="i">
                <td>{{ i.Customers.name }}</td>
                <td>
                  {{ Intl.NumberFormat().format(i.Loans.money) + " so'm" }}
                </td>
                <td>{{ i.Loans.return_date }}</td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <router-link
                      :to="`/nasiya/${i.Loans.id}/${i.Loans.order_id}`"
                      class="btn btn-outline-info"
                    >
                      <i class="fa fa-info" />
                    </router-link>
                  </div>
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
                    @get="getTrue"
                  />
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="pay">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Nasiya uchun to'lov</h4>
        </div>
        <form @submit.prevent="post(loan)">
          <div class="modal-body">
            <div class="row gap-1 text-left">
              <div class="col-md-12">
                Summa
                <div class="input-group input-group-sm">
                  <input
                    type="number"
                    step="any"
                    min="0"
                    class="form-control"
                    placeholder="summa"
                    required
                    v-model="loan_price"
                  />
                  <div class="input-group-append">
                    <div class="input-group-text">
                      {{ cashier?.currency?.currency || "valyuta" }}
                    </div>
                  </div>
                  <div class="input-group-append">
                    <select
                      class="form-select form-select-sm"
                      required
                      v-model="loan_price_type"
                    >
                      <option value="naxt">naxt</option>
                      <option value="plastik">plastik</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="col-12">
                Kassa
                <select
                  class="form-select form-select-sm"
                  required
                  v-model="cashier_id"
                  @change="setCashier()"
                >
                  <option v-for="item in cashiers" :key="item" :value="item.id">
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
import Pagination from "@/components/Pagination/Pagination.vue";
export default {
  name: "Nasiyalar",
  components: { Pagination },
  data() {
    return {
      _: Intl.NumberFormat(),
      cashiers: [],
      cashier: null,
      page: 0,
      pages: 1,
      limit: 25,
      loans: [],
      loans_true: [],
      loan: null,
      loan_price: null,
      loan_price_type: "naxt",
      cashier_id: 0,
      mijozlar: [],
      customer_id: 0,
      sum_loan: null,
    };
  },
  created() {
    this.getCashiers();
    this.getFalse(this.page, this.limit);
  },
  methods: {
    getCashiers() {
      const branch_id = localStorage["branch_id"] || 0;
      api.kassa("", 0, branch_id).then((res) => {
        this.cashiers = res.data;
      });
    },
    setCashier() {
      this.cashier = this.cashiers.find((item) => {
        return item.id == this.cashier_id;
      });
    },
    getFalse(page, limit) {
      api.loans(false, this.customer_id, page, limit).then((Response) => {
        this.page = Response.data.current_page;
        this.pages = Response.data.pages;
        this.limit = Response.data.limit;
        this.loans = Response.data.data;
        this.sum_loan = Response.data.sum_loans_data;
        this.loans.forEach((item) => {
          if (
            this.mijozlar.find((mijoz) => {
              return mijoz.id == item.Customers.id;
            }) == undefined
          ) {
            this.mijozlar.push(item.Customers);
          }
        });
      });
    },
    getTrue(page, limit) {
      api.loans(true, this.customer_id, page, limit).then((Response) => {
        this.page = Response.data.current_page;
        this.pages = Response.data.pages;
        this.limit = Response.data.limit;
        this.loans_true = Response.data.data;
        this.loans_true.forEach((item) => {
          if (
            this.mijozlar.find((mijoz) => {
              return mijoz.id == item.Customers.id;
            }) == undefined
          ) {
            this.mijozlar.push(item.Customers);
          }
        });
      });
    },
    post(loan) {
      api
        .takeLoan(
          loan.Loans.id,
          this.loan_price,
          this.loan_price_type,
          this.cashier_id
        )
        .then((Response) => {
          document.querySelectorAll("[data-dismiss]")[0].click();
          this.loan_price = null;
          this.cashier_id = 0;
          this.cashier = null;
          api.success().then(() => {
            this.getFalse(0, 25);
          });
        });
    },
    countDays(date) {
      let date_1 = new Date(date),
        date_2 = new Date(),
        difference = date_1.getTime() - date_2.getTime(),
        days = Math.ceil(difference / (1000 * 3600 * 24));
      return days;
    },
  },
};
</script>

<style scoped>
.input-group {
  justify-content: center;
}

.table-responsive {
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 70vh;
}
</style>
