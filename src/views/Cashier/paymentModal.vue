<template>
  <button
    v-show="false"
    data-toggle="modal"
    data-target="#payment"
    payment-modal-button
  ></button>
  <div class="modal fade" id="payment">
    <div class="modal-dialog">
      <form class="modal-content" @submit.prevent="postPayment()">
        <div class="modal-header">
          <h4>Pul {{ betweenCashiers ? "o'tkazish" : "olish" }}</h4>
        </div>
        <div class="modal-body">
          <div class="row gap-2 text-left">
            <div class="col-12" v-if="type == 'from_branch'">
              Kassa
              <select
                class="form-select"
                required
                v-model="payment.to_id"
                @change="setCashier()"
              >
                <option v-for="item in cashiers" :key="item" :value="item.id">
                  {{ item.name }}
                </option>
              </select>
            </div>
            <div class="col-12" v-else>
              Kassa
              <select
                class="form-select"
                required
                v-model="payment.to_id"
                @change="setCashier()"
              >
                <option v-for="item in cashiers" :key="item" :value="item.id">
                  {{ item.name }}
                </option>
              </select>
            </div>
            <div class="col-12">
              Summa
              <div class="input-group">
                <input
                  type="number"
                  min="1"
                  :max="cashier?.balance"
                  class="form-control"
                  required
                  v-model="payment.money"
                />
                <div class="input-group-text">
                  {{ to_cashier?.currency?.currency || "valyuta" }}
                </div>
              </div>
            </div>
            <div class="col-12" v-if="betweenCashiers">
              Ushbu kassadan olinadigan summa
              <div class="input-group">
                <strong>
                  {{
                    $util.currency(count_price) +
                    " " +
                    (cashier?.currency?.currency || "valyuta")
                  }}
                </strong>
              </div>
            </div>
            <div class="col-12">
              Izoh
              <textarea
                class="form-control"
                rows="2"
                v-model="payment.comment"
              ></textarea>
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
            close-payment-modal
          >
            <i class="far fa-circle-xmark"></i>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import * as api from "@/components/Api/Api.js";
export default {
  name: "paymentModal",
  props: {
    betweenCashiers: Boolean,
  },
  data() {
    return {
      cashiers: [],
      cashier: null,
      to_cashier: null,
      payment: {
        from_kassa_id: null,
        to_id: 0,
        money: null,
        comment: "",
      },
    };
  },
  computed: {
    type() {
      return this.cashier?.branch_id ? "from_branch" : "from_admin";
    },
    count_price() {
      return (
        (this.payment.money / this.cashier?.currency?.price) *
          this.to_cashier?.currency?.price || 0
      );
    },
  },
  methods: {
    start(cashier) {
      this.cashier = cashier;
      this.payment = {
        from_kassa_id: null,
        to_id: 0,
        money: null,
        comment: "",
      };
      this.getCashiers();
      document.querySelector(`[payment-modal-button]`).click();
    },
    getCashiers() {
      const branch_id = this.cashier?.branch_id || 0;
      api.kassa("", 0, branch_id).then((res) => {
        this.cashiers = res.data;
      });
    },
    setCashier() {
      this.to_cashier = this.cashiers.find((item) => {
        return item.id == this.payment.to_id;
      });
    },
    postPayment() {
      this.payment.from_kassa_id = this.cashier.id;
      let request = "";
      if (this.$props.betweenCashiers) {
        request = "transferToSecondKassa";
        this.payment.money = this.count_price;
      } else {
        request =
          this.type == "from_branch"
            ? "takeMoneyFromBranchKassa"
            : "takeMoneyFromAdminKassa";
      }
      api[request](this.payment).then(() => {
        api.success("close-payment-modal").then(() => {
          if (this.$props.betweenCashiers) this.$parent.reset();
          else this.$parent.getCashiers();
        });
      });
    },
  },
};
</script>
