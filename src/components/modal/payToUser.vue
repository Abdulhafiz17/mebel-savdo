<template>
  <button
    v-show="false"
    data-toggle="modal"
    data-target="#payToUser"
    pay-modal-button
  ></button>
  <div class="modal fade" id="payToUser">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>{{ user?.name }} ga pul berish</h4>
        </div>
        <form @submit.prevent="payToUser()">
          <div class="modal-body">
            <div class="row gap-1 text-left">
              <div class="col-12">
                Kassa
                <select
                  class="form-select"
                  required
                  v-model="paying.kassa_id"
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
                    step="any"
                    min="0"
                    class="form-control"
                    placeholder="summa"
                    required
                    v-model="paying.price"
                  />
                  <div class="input-group-append">
                    <div class="input-group-text">
                      {{ cashier?.currency?.currency || "valyuta" }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-12">
                Izoh
                <textarea
                  type="textarea"
                  class="form-control"
                  placeholder="izoh"
                  v-model="paying.comment"
                ></textarea>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-primary">
              <i class="far fa-circle-check" />
            </button>
            <button
              class="btn btn-outline-danger"
              data-dismiss="modal"
              close-pay-modal
            >
              <i class="far fa-circle-xmark" />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from "@/components/Api/Api.js";
export default {
  name: "payToUser",
  emits: {
    end: null,
  },
  data() {
    return {
      role: localStorage["role"],
      branch_id: localStorage["branch_id"],
      user: null,
      cashiers: [],
      cashier: null,
      paying: {
        price: null,
        currency_id: 0,
        source: 0,
        comment: "",
        kassa_id: 0,
      },
    };
  },
  created() {
    this.getCashiers();
  },
  methods: {
    start(user) {
      this.user = user;
      this.cashier = null;
      this.paying = {
        price: null,
        currency_id: 0,
        source: this.user.id,
        comment: "",
        kassa_id: 0,
      };
      document.querySelector(`[pay-modal-button]`).click();
    },
    getCashiers() {
      const branch_id = this.role == "branch_admin" ? this.branch_id : 0;
      api.kassa("", 0, branch_id).then((res) => {
        this.cashiers = res.data;
      });
    },
    setCashier() {
      this.cashier = this.cashiers.find((item) => {
        return item.id == this.paying.kassa_id;
      });
      this.paying.currency_id = this.cashier.currency_id;
    },
    payToUser() {
      api.payForUser(this.paying).then(() => {
        api.success("close-pay-modal").then(() => {
          this.$emit("end");
        });
      });
    },
  },
};
</script>
