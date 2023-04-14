<template>
  <h3><span class="fa fa-wallet" /> Chiqim</h3>
  <div class="row">
    <div class="col-md"></div>
    <div class="col-md my-1" v-if="role == 'branch_admin'">
      <div class="btn-group btn-group-sm">
        <button
          class="btn btn-outline-secondary float-right"
          data-toggle="modal"
          data-target="#addExpense"
          @click="getData(page, limit)"
        >
          <span class="fa fa-list" />
        </button>
        <button
          class="btn btn-outline-secondary"
          data-toggle="modal"
          data-target="#expense"
          @click="getData(page, limit)"
        >
          <span class="fa fa-coins" /> Doimiy
        </button>
        <button
          class="btn btn-outline-secondary"
          data-toggle="modal"
          data-target="#variable"
        >
          <span class="fa fa-coins" /> Bir marttalik
        </button>
      </div>
    </div>
    <div class="col-md"></div>
  </div>
  <hr />

  <Fixed
    @getExpenses="getData"
    :expenses="chiqimlar"
    v-if="expense == 'fixed'"
  />

  <div class="modal fade" id="addExpense">
    <div class="modal-dialog">
      <div class="modal-content">
        <ul
          class="nav nav-pills nav-justified m-2"
          id="pills-tab"
          role="tablist"
        >
          <li class="nav-item" role="presentation">
            <button
              class="nav-link active"
              id="pills-new-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-new"
              type="button"
              role="tab"
              aria-controls="pills-new"
            >
              Yangi chiqim turi qo'shish
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link"
              id="pills-edit-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-edit"
              type="button"
              role="tab"
              aria-controls="pills-edit"
            >
              Tahrirlash
            </button>
          </li>
        </ul>
        <hr />
        <div class="tab-content" id="pills-tabContent">
          <div
            class="tab-pane fade show active"
            id="pills-new"
            role="tabpanel"
            aria-labelledby="pills-new-tab"
          >
            <form @submit.prevent="post(addExpense)">
              <div class="modal-body">
                <h4>Yangi chiqim turi qo'shish</h4>
                <div class="row">
                  <div class="col-md-10 mx-auto">
                    <div class="input-group input-group-sm">
                      <input
                        class="form-control"
                        type="text"
                        placeholder="nomi"
                        required
                        v-model="addExpense.name"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button class="btn btn-outline-primary">
                  <span class="far fa-circle-check" />
                </button>
                <button
                  id="close_modal"
                  class="btn btn-outline-danger"
                  data-dismiss="modal"
                >
                  <span class="far fa-circle-xmark" />
                </button>
              </div>
            </form>
          </div>
          <div
            class="tab-pane fade"
            id="pills-edit"
            role="tabpanel"
            aria-labelledby="pills-edit-tab"
          >
            <div class="modal-body">
              <div class="row gap-1">
                <div
                  class="col-md-10 mx-auto"
                  v-for="chiqim in chiqimlar"
                  :key="chiqim"
                >
                  <form @submit.prevent="putData(chiqim)">
                    <div class="input-group input-group-sm">
                      <input
                        class="form-control"
                        type="text"
                        placeholder="nomi"
                        required
                        v-model="chiqim.name"
                      />
                      <div class="input-group-append">
                        <button class="btn btn-outline-warning">
                          <span class="fa fa-edit" />
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-outline-danger" data-dismiss="modal">
                <span class="far fa-circle-xmark" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="expense">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Doimiy chiqim</h4>
        </div>
        <form @submit.prevent="payToFixed(payToFixedExpense)">
          <div class="modal-body">
            <div class="row gap-1">
              <div class="col-md-10 mx-auto">
                <select
                  class="form-select form-select-sm"
                  required
                  v-model="payToFixedExpense.source"
                >
                  <option hidden value="">Chiqim turini tanlang</option>
                  <option
                    v-for="chiqim in chiqimlar"
                    :key="chiqim"
                    :value="chiqim.id"
                  >
                    {{ chiqim.name }}
                  </option>
                </select>
              </div>
              <div class="col-md-10 mx-auto" v-if="payToFixedExpense.source">
                <div class="input-group input-group-sm">
                  <input
                    class="form-control"
                    type="number"
                    min="0"
                    placeholder="chiqim summasi"
                    required
                    v-model="payToFixedExpense.price"
                  />
                  <div class="input-group-append">
                    <select
                      class="form-control form-control-sm"
                      v-model="payToFixedExpense.currency_id"
                      @click="kurslar.length ? '' : getCurrency()"
                    >
                      <option
                        v-for="item in kurslar"
                        :key="item"
                        :value="item.id"
                      >
                        {{ item.currency }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="col-md-10 mx-auto" v-if="payToFixedExpense.source">
                <textarea
                  class="form-control form-control-sm"
                  placeholder="izoh"
                  rows="3"
                  v-model="payToFixedExpense.comment"
                />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-primary">
              <span class="far fa-circle-check" />
            </button>
            <button
              id="close-modal"
              class="btn btn-outline-danger"
              data-dismiss="modal"
              @click="payToFixedExpense.source = ''"
            >
              <span class="far fa-circle-xmark" />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div class="modal fade" id="variable">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Bir marttalik chiqim</h4>
        </div>
        <form @submit.prevent="payToVariable(payToVariableExpense)">
          <div class="modal-body">
            <div class="row gap-1">
              <div class="col-md-10 mx-auto">
                <div class="input-group input-group-sm">
                  <input
                    class="form-control"
                    type="number"
                    min="0"
                    placeholder="chiqim summasi"
                    required
                    v-model="payToVariableExpense.price"
                  />
                  <div class="input-group-append">
                    <select
                      class="form-select form-select-sm"
                      required
                      v-model="payToVariableExpense.currency_id"
                      @click="kurslar.length ? '' : getCurrency()"
                    >
                      <option
                        v-for="item in kurslar"
                        :key="item"
                        :value="item.id"
                      >
                        {{ item.currency }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="col-md-10 mx-auto">
                <textarea
                  class="form-control"
                  placeholder="izoh"
                  v-model="payToVariableExpense.comment"
                />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-primary">
              <span class="far fa-circle-check" />
            </button>
            <button
              id="close"
              class="btn btn-outline-danger"
              data-dismiss="modal"
            >
              <span class="far fa-circle-xmark" />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from "@/components/Api/Api";
import Variable from "./BirMarttalik.vue";
import Fixed from "./Doimiy.vue";
export default {
  name: "Expense",
  components: { Variable, Fixed },
  data() {
    return {
      role: localStorage["role"],
      page: 0,
      pages: 1,
      limit: 100,
      expense: "",
      chiqimlar: [],
      kurslar: [],
      historyVariable: [],
      addExpense: {
        name: "",
      },
      payToFixedExpense: {
        price: null,
        currency_id: "",
        source: "",
        comment: "",
        admin_currency: "",
      },
      payToVariableExpense: {
        price: null,
        currency_id: "",
        source: 0,
        comment: "",
        admin_currency: "",
      },
    };
  },
  created() {
    this.expense = "fixed";
    this.getCurrency();
  },
  methods: {
    getData() {
      api.fixedExpenses().then((Response) => {
        this.chiqimlar = Response.data;
      });
    },
    getCurrency() {
      api.currencies().then((Response) => {
        this.kurslar = Response.data;
        this.payToFixedExpense.currency_id = this.kurslar[0].id;
        this.payToVariableExpense.currency_id = this.kurslar[0].id;
      });
    },
    post(data) {
      api.createFixedExpense(data).then((Response) => {
        document.querySelector("#close_modal").click();
        api.success().then(() => {
          this.addExpense.name = "";
          this.getData();
        });
      });
    },
    payToFixed(data) {
      this.expense = "";
      this.payToFixedExpense.currency_id = Number(
        this.payToFixedExpense.currency_id
      );
      this.payToFixedExpense.source = Number(this.payToFixedExpense.source);
      data.comment = data.comment ? data.comment : " ";
      api.payForFixedExpense(data).then((Response) => {
        this.payToFixedExpense = {
          price: null,
          currency_id: "",
          source: "",
          comment: "",
        };
        document.querySelector("#close-modal").click();
        api.success().then(() => {
          this.expense = "fixed";
        });
      });
    },
    payToVariable(data) {
      this.expense = "";
      this.payToVariableExpense.currency_id = Number(
        this.payToVariableExpense.currency_id
      );
      this.payToVariableExpense.source = Number(
        this.payToVariableExpense.source
      );
      data.comment = data.comment ? data.comment : " ";
      api.payForVariableExpense(data).then((Response) => {
        this.payToVariableExpense = {
          price: null,
          currency_id: "",
          source: "",
          comment: "",
        };
        document.querySelector("#close").click();
        api.success().then(() => {
          this.expense = "variable";
        });
      });
    },
    putData(data) {
      api.updateFixedexpense(data).then((Response) => {
        api.success();
      });
    },
  },
};
</script>

<style></style>
