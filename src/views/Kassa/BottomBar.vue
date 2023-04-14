<template>
  <div class="main">
    <nav class="navbar">
      <button
        class="btn btn-lg btn-outline-success"
        data-toggle="modal"
        data-target="#confirm"
        confirm-modal-button
      >
        <span class="far fa-circle-check" /> Tasdiqlash
      </button>
      <!-- <button
        class="btn btn-sm btn-outline-secondary"
        data-toggle="modal"
        data-target="#dailyReport"
        @click="getDailyReport()"
      >
        <span class="fa fa-history" /> Kunlik hisobot
      </button> -->
      <!-- <router-link to="/expense" class="btn btn-sm btn-outline-secondary">
        <span class="fa fa-wallet" /> Chiqim
      </router-link> -->
      <!-- <router-link class="btn btn-sm btn-outline-secondary" to="/">
        <span class="fa fa-sign-out" /> Chiqish
      </router-link> -->
    </nav>
  </div>
  <div class="modal fade" id="dailyReport">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">
          <!-- <div class="modal-image">
            <code>{ logo }</code>
          </div> -->
          <ul class="list-group" v-if="report">
            <li class="list-group-item">
              <h5>Umumiy savdo</h5>
              <strong>
                {{ _.format(report.trade_price) + " " + report.trade_currency }}
              </strong>
            </li>
            <hr />
            <li class="list-group-item">
              <h5>Kirim</h5>
              <strong>
                <span
                  v-for="(income, index) in report.income_data"
                  :key="income"
                >
                  {{
                    (index !== 0 ? ", " : "") +
                    _.format(income.total_income) +
                    " " +
                    income.currency +
                    " (" +
                    income.comment +
                    ")"
                  }}
                </span>
              </strong>
            </li>
            <hr />
            <!-- </ul>
          <ul class="list-group" v-if="report"> -->
            <li class="list-group-item">
              <h5>Chiqim</h5>
              <strong></strong>
            </li>
            <li
              class="list-group-item"
              v-for="expense in report.expense_data"
              :key="expense"
            >
              <h6>
                {{
                  expense.type == "variable_expense"
                    ? "Umumiy"
                    : expense.type == "fixes_expense"
                    ? "Doimiy"
                    : expense.type == "to_admin"
                    ? "Adminga berilgan"
                    : expense.type == "to_user"
                    ? "Hodimga berilgan"
                    : expense.type == "returned_product"
                    ? "Qaytarib olingan mahsulot"
                    : ""
                }}
              </h6>
              <strong>
                {{ _.format(expense.total_expense) + " " + expense.currency }}
              </strong>
            </li>
            <hr />
            <li class="list-group-item">
              <h5>Nasiya</h5>
              <strong>{{
                _.format(report.loan) + " " + report.trade_currency
              }}</strong>
            </li>
          </ul>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-primary">
            <i class="fa fa-print" />
          </button>
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
export default {
  name: "Bar",
  data() {
    return {
      _: Intl.NumberFormat(),
      report: null,
      expense_price: 0,
    };
  },
  methods: {
    getDailyReport() {
      let date = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() + 1
      )
        .toISOString()
        .substring(0, 10);
      let branch_id = localStorage.getItem("branch_id");
      api.statisticDaily(date, branch_id).then((Response) => {
        this.report = Response.data;
      });
    },
  },
};
</script>

<style scoped>
div.main {
  position: fixed;
  width: 94%;
  bottom: 1%;
  left: 4%;
  right: 2%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(2px);
  /* padding: 10px; */
  /* border: 1px solid white; */
}

.dark div.main {
  background: rgba(0, 0, 0, 0.2);
}

nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1px solid gray;
  border-radius: 4px;
}

h5 {
  margin: 0;
}
h6 {
  margin: 0;
}
</style>
