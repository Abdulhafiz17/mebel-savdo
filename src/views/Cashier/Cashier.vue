<template>
  <h3><span class="fa fa-cash-register" /> {{ "Kassa " + cashier?.name }}</h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1">
      {{ $util.currency(cashier?.balance) + " so'm" }}
    </div>
    <div class="col-md-4">
      <button
        class="btn btn-sm btn-block btn-outline-primary"
        @click="$refs.PaymentModal.start(cashier)"
      >
        Boshqa kassaga pul o'tkazish
      </button>
    </div>
  </div>
  <hr />

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
        @click="template = 'income'"
      >
        Kirim
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
        @click="template = 'expense'"
      >
        Chiqim
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
      <income v-if="template == 'income'" />
    </div>
    <div
      class="tab-pane fade"
      id="pills-profile"
      role="tabpanel"
      aria-labelledby="pills-profile-tab"
    >
      <expense v-if="template == 'expense'" />
    </div>
  </div>
  <PaymentModal ref="PaymentModal" between-cashiers />
</template>

<script>
import * as api from "@/components/Api/Api.js";
import income from "./income.vue";
import expense from "./expense.vue";
import PaymentModal from "./paymentModal.vue";
export default {
  name: "Cashier",
  components: { income, expense, PaymentModal },
  data() {
    return {
      template: "income",
      cashier: null,
    };
  },
  created() {
    this.getCashier();
  },
  methods: {
    getCashier() {
      api.kassa("", this.$route.params.id, 0).then((res) => {
        this.cashier = res.data;
      });
    },
    reset() {
      const template = this.template;
      this.template = "";
      setTimeout(() => {
        this.template = template;
        this.getCashier();
      }, 100);
    },
  },
};
</script>
