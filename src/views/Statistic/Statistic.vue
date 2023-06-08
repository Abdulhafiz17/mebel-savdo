<template>
  <h3>
    <span class="fa fa-chart-line" />
    {{
      role == "admin"
        ? branch
          ? branch.name + " hisobotlari"
          : ""
        : "Hisobotlar"
    }}
  </h3>
  <div class="row">
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4 my-1"></div>
  </div>
  <hr />

  <ul class="nav nav-pills nav-justified mb-3" id="pills-tab" role="tablist">
    <li class="nav-item" role="presentation">
      <button
        class="nav-link"
        :class="{ active: tab == 1 }"
        id="false-tab"
        data-bs-toggle="pill"
        data-bs-target="#false"
        type="button"
        role="tab"
        aria-controls="false"
        aria-selected="true"
        @click="tab = 1"
      >
        Hisobotlar
      </button>
    </li>
    <li class="nav-item" role="presentation">
      <button
        class="nav-link"
        :class="{ active: tab == 2 }"
        id="true-tab"
        data-bs-toggle="pill"
        data-bs-target="#true"
        type="button"
        role="tab"
        aria-controls="true"
        aria-selected="false"
        @click="tab = 2"
      >
        Savdo jadvali
      </button>
    </li>
    <li class="nav-item" role="presentation">
      <button
        class="nav-link"
        :class="{ active: tab == 3 }"
        id="true-tab"
        data-bs-toggle="pill"
        data-bs-target="#true"
        type="button"
        role="tab"
        aria-controls="true"
        aria-selected="false"
        @click="tab = 3"
      >
        ABS hisobot
      </button>
    </li>
    <li class="nav-item" role="presentation">
      <button
        class="nav-link"
        :class="{ active: tab == 4 }"
        id="true-tab"
        data-bs-toggle="pill"
        data-bs-target="#true"
        type="button"
        role="tab"
        aria-controls="true"
        aria-selected="false"
        @click="tab = 4"
      >
        XYZ hisobot
      </button>
    </li>
  </ul>
  <div class="tab-content" id="pills-tabContent">
    <div
      class="tab-pane fade"
      :class="{ 'show active': tab == 1 }"
      id="false"
      role="tabpanel"
      aria-labelledby="false-tab"
    >
      <div class="responsive">
        <div class="row">
          <div class="col-md-12 my-1">
            <Sales
              :branch_currency="branch_currency"
              v-if="sales && tab == 1"
            />
          </div>
          <!-- <hr />
      <div class="col-md-12 my-1">
        <Products @setloading="setloading" v-if="products" />
      </div>
      <hr />
      <div class="col-md-12 my-1">
        <Users @setloading="setloading" v-if="users" />
      </div> -->
          <!-- <div class="col-md-12 my-1">
        <Expenses @setloading="setloading" />
      </div>
      <hr /> -->
        </div>
      </div>
    </div>
    <div
      class="tab-pane fade"
      :class="{ 'show active': tab == 2 }"
      id="true"
      role="tabpanel"
      aria-labelledby="true-tab"
    >
      <TradesForExcel v-if="tab == 2" />
    </div>
    <div
      class="tab-pane fade"
      :class="{ 'show active': tab == 3 }"
      id="true"
      role="tabpanel"
      aria-labelledby="true-tab"
    >
      <ABS v-if="tab == 3" />
    </div>
    <div
      class="tab-pane fade"
      :class="{ 'show active': tab == 4 }"
      id="true"
      role="tabpanel"
      aria-labelledby="true-tab"
    >
      <XYZ v-if="tab == 4" />
    </div>
  </div>
</template>

<script>
import Sales from "./Sales.vue";
import Expenses from "./Expenses.vue";
import Products from "./Products.vue";
import Users from "./Hodimlar.vue";
import * as api from "@/components/Api/Api";
import TradesForExcel from "@/components/table/TradesForExcel.vue";
import ABS from "./ABS.vue";
import XYZ from "./XYZ.vue";
export default {
  name: "Statistic",
  components: { Sales, Expenses, Products, Users, TradesForExcel, ABS, XYZ },
  data() {
    return {
      role: localStorage.getItem("role"),
      tab: 1,
      branch: null,
      branch_currency: null,
      sales: false,
      products: false,
      users: false,
    };
  },
  created() {
    this.getBranch();
  },
  methods: {
    getBranch() {
      api.branch(this.$route.params.id).then((Response) => {
        this.branch = Response.data.branch;
        this.getCurrencies();
      });
    },
    getCurrencies() {
      this.sales = true;
    },
  },
};
</script>

<style scoped>
.responsive {
  max-height: 85vh;
}
</style>
