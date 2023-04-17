<template>
  <div class="d-flex justify-content-between align-items-center">
    <h5>{{ order?.ordinal_number + " - buyurtma" }}</h5>
    <strong>{{ order?.time.replace("T", " ").substring(0, 16) }}</strong>
  </div>
  <hr />
  <div class="row mb-2" v-if="order && incomes.length && balance">
    <div :class="loan ? 'col-md-3' : 'col-md-4'">
      Buyurtma summasi
      <br />
      {{ $util.currency(balance.total_price) + " so'm" }}
    </div>
    <div :class="loan ? 'col-md-3' : 'col-md-4'">
      To'lov summa
      <br />
      <span v-for="(i, index) in incomes" :key="i">
        {{
          i.Incomes.comment +
          ": " +
          $util.currency(i.Incomes.money) +
          " so'm" +
          (index !== incomes.length - 1 ? ", " : "")
        }}
        <br />
      </span>
    </div>
    <div :class="loan ? 'col-md-3' : 'col-md-4'">
      Yetkazilganda olinadigan summa
      <br />
      {{ $util.currency(order.delivery_money) + " so'm" }}
    </div>
    <div class="col-md-3" v-if="loan">
      Nasiya summa
      <br />
      {{ $util.currency(loan.Loans.money) + " so'm" }}
    </div>
  </div>
</template>

<script>
import * as api from "@/components/Api/Api.js";
export default {
  name: "order",
  data() {
    return {
      order: null,
      balance: null,
      incomes: [],
      loan: null,
    };
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
      this.getLoan(order_id);
    },
    getOrder(id) {
      api.order(id).then((res) => {
        this.order = res.data.Orders;
      });
    },
    getBalance(id) {
      api.tradeBalance(id).then((res) => {
        this.balance = res.data;
      });
    },
    getIncome(id) {
      api.incomes(id, "order", 0, 100).then((res) => {
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
</style>
