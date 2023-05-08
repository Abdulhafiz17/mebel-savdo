<template>
  <button
    v-show="false"
    data-toggle="modal"
    data-target="#take-income"
  ></button>
  <div class="modal fade" id="take-income">
    <div class="modal-dialog">
      <form class="modal-content" @submit.prevent="takeIncome()">
        <div class="modal-header"><h5>Buyurtma uchun pul olish</h5></div>
        <div class="modal-body">
          <div class="row gap-1 text-left">
            <div class="col-12">
              Summa
              <div class="input-group input-group-sm">
                <input
                  type="number"
                  step="any"
                  min="0.1"
                  class="form-control"
                  required
                  v-model="income.money"
                />
                <div class="input-group-append">
                  <select
                    class="form-select form-select-sm"
                    required
                    v-model="income.currency_id"
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
                <div class="input-group-append">
                  <select
                    class="form-select form-select-sm"
                    required
                    v-model="income.comment"
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
                v-model="income.kassa_id"
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
            <i class="far fa-circle-check"></i>
          </button>
          <button
            class="btn btn-outline-danger"
            data-dismiss="modal"
            close-take-income-modal
          >
            <i class="far fa-circle-xmark"></i>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import * as api from "@/components/Api/Api";
export default {
  name: "takeIncomeModal",
  data() {
    return {
      branch_id: localStorage["branch_id"] || 0,
      currencies: [],
      cashiers: [],
      income: {
        money: null,
        currency_id: 0,
        from_: 0,
        comment: "",
        kassa_id: 0,
      },
    };
  },
  created() {
    this.getCurrencies();
    this.getCashiers();
  },
  methods: {
    start(id) {
      this.income = {
        money: null,
        currency_id: 0,
        from_: id,
        comment: "",
        kassa_id: 0,
      };
      document.querySelector(`[data-target="#take-income"]`).click();
    },
    getCurrencies() {
      api.currencies().then((res) => {
        this.currencies = res.data;
      });
    },
    getCashiers() {
      api.kassa("", 0, this.branch_id).then((res) => {
        this.cashiers = res.data;
      });
    },
    takeIncome() {
      api.takeIncomeFromPreOrder(this.income).then(() => {
        api.success("close-take-income-modal").then(() => {
          this.$parent.getOrders(0, 25);
        });
      });
    },
  },
};
</script>
