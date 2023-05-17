<template>
  <div class="d-flex justify-content-between align-items-center">
    <strong>{{ order?.time.replace("T", " ").substring(0, 16) }}</strong>
    <strong>{{ order?.date }}</strong>
  </div>
  <hr />
  <div class="row mb-2" v-if="order && balance && price">
    <div :class="loan ? 'col-md-4' : 'col-md-6'">
      Buyurtma summasi
      <br />
      {{ $util.currency(balance.total_price) + " so'm" }}
    </div>
    <div :class="loan ? 'col-md-4' : 'col-md-6'">
      Yetkazilganda olinadigan summa
      <br />
      {{ $util.currency(order.delivery_money) + " so'm" }}
    </div>
    <div class="col-md-4" v-if="loan">
      Nasiya summa
      <br />
      {{ $util.currency(loan.Loans.money) + " so'm" }}
    </div>
    <div class="col-md-12 text-left" v-if="incomes.length">
      To'lov summa
      <p v-for="i in incomes" :key="i">
        {{
          $util.currency(i.Incomes.money) +
          " so'm " +
          i.Incomes.comment +
          " " +
          i.Incomes.time.replace("T", " ")
        }}
      </p>
      <span>
        <br />
      </span>
    </div>
  </div>
</template>

<script>
import * as api from "@/components/Api/Api.js";
export default {
  name: "preOrder",
  data() {
    return {
      order: null,
      balance: null,
      incomes: [],
      loan: null,
    };
  },
  computed: {
    price() {
      if (
        ["admin", "branch_admin", "seller", "cashier"].includes(
          this.$util.storage("role")
        )
      )
        return true;
      else return false;
    },
  },
  methods: {
    start(order_id) {
      this.order = null;
      this.balace = null;
      this.incomes = [];
      this.loan = null;

      this.getOrder(order_id);
      this.getBalance(order_id);
      this.getIncome(order_id);
      if (this.price) this.getLoan(order_id);
    },
    getOrder(id) {
      api.preOrder(id).then((res) => {
        this.order = res.data.Pre_orders;
      });
    },
    getBalance(id) {
      api.preOrderTradeBalance(id).then((res) => {
        this.balance = res.data;
      });
    },
    getIncome(id) {
      api.incomes(id, "pre_order", 0, 0, 100).then((res) => {
        this.incomes = res.data.data;
      });
    },
    getLoan(id) {
      api.orderLoan(id, 0).then((res) => {
        this.loan = res.data;
      });
    },
  },
};
</script>

<style scoped>
hr {
  margin-left: -15px;
  margin-right: -15px;
}

p {
  margin: 0;
  width: 100%;
}
</style>
