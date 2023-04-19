<template>
  <h3><span class="fa fa-cash-register" /> Kassalar</h3>
  <div class="row">
    <div class="col-md-4">
      <div class="input-group input-group-sm">
        <input
          class="form-control"
          type="search"
          placeholder="Qidiruv"
          v-model="search"
          @keyup="getCashiers()"
        />
        <div class="input-group-append">
          <div class="input-group-text">
            <i class="fa fa-search" />
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4">
      <button
        v-if="add_cashier"
        class="btn btn-sm btn-block btn-outline-secondary"
        @click="$refs.cashierModal.start('post')"
      >
        <span class="fa fa-plus" /> Kassa qo'shish
      </button>
    </div>
  </div>
  <hr />

  <div class="responsive" style="max-height: 80vh">
    <div class="row my-1">
      <div class="col-md-4 mb-1" v-for="item in cashiers" :key="item">
        <div class="card shadow">
          <div class="card-body">
            <p>
              <i class="fa fa-lg fa-cash-register"></i>
              {{ item.name }}
            </p>
            <p>
              <i class="fa fa-lg fa-comment"></i>
              {{ item.comment }}
            </p>
            <p>
              <i class="fa fa-lg fa-coins"></i>
              {{ $util.currency(item.balance) + " so'm" }}
            </p>
            <div class="row mt-1">
              <div class="col">
                <router-link
                  :to="`/cashier/${item.id}`"
                  class="btn btn-sm btn-block btn-outline-primary"
                >
                  <i class="fa fa-eye"></i>
                </router-link>
              </div>
              <div class="col">
                <router-link
                  :to="`/cashierHistory/${item.id}`"
                  class="btn btn-sm btn-block btn-outline-secondary"
                >
                  <i class="fa fa-history"></i>
                </router-link>
              </div>
              <div
                class="col"
                v-if="
                  role == 'admin' ||
                  (role == 'cashier' && $route.query.branch_id)
                "
              >
                <button
                  class="btn btn-sm btn-block btn-outline-success"
                  @click="$refs.PaymentModal.start(item)"
                >
                  <i class="fa fa-coins"></i>
                </button>
              </div>
              <div class="col">
                <button
                  class="btn btn-sm btn-block btn-outline-warning"
                  @click="$refs.cashierModal.start('put', item)"
                >
                  <i class="fa fa-edit"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <cashierModal ref="cashierModal" />

  <PaymentModal ref="PaymentModal" />
</template>

<script>
import * as api from "@/components/Api/Api.js";
import cashierModal from "./cashierModal.vue";
import PaymentModal from "./paymentModal.vue";
export default {
  name: "Cashiers",
  components: { cashierModal, PaymentModal },
  data() {
    return {
      role: localStorage["role"],
      branch_id: this.$route.query.branch_id || 0,
      search: "",
      cashiers: [],
    };
  },
  computed: {
    add_cashier() {
      if (
        (this.$route.query.branch_id &&
          (this.role == "branch_admin" || this.role == "seller")) ||
        (!this.$route.query.branch_id && this.role == "admin")
      )
        return true;
      else return false;
    },
  },
  created() {
    this.getCashiers();
  },
  methods: {
    getCashiers() {
      api.kassa(this.search, 0, this.branch_id).then((res) => {
        this.cashiers = res.data;
      });
    },
  },
};
</script>

<style scoped>
p {
  margin: 0 0 5px 0;
  width: 100%;
}

p:last-of-type {
  margin: 0;
}
</style>
