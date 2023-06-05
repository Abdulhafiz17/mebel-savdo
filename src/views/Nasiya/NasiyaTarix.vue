<template>
  <h3><span class="fa fa-hand-holding-usd" /> Nasiya</h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1">
      <!-- <div class="input-group input-group-sm">
        <input
          class="form-control"
          type="search"
          placeholder="Qidiruv"
          v-model="search"
        />
        <div class="input-group-append">
          <button
            class="btn btn-block btn-outline-secondary"
            data-toggle="modal"
            data-target="#hodimQoshish"
          >
            <span class="fa fa-user-plus" />
          </button>
        </div>
      </div> -->
    </div>
    <div class="col-md-4"></div>
  </div>
  <hr />
  <div class="body">
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
          @click="get(0, limit)"
        >
          To'lovlar tarixi
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
          @click="
            $refs.order.start($route.params.order_id);
            $refs.trades.start($route.params.order_id);
          "
        >
          Nasiya buyurtmasi
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
        <div class="table-responsive">
          <table class="table table-sm table-hover">
            <thead>
              <tr>
                <th>Summa</th>
                <th>Hodim</th>
                <th>Sana</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in payments" :key="i">
                <td>
                  {{ Intl.NumberFormat().format(i.Incomes.money) + " so'm" }}
                </td>
                <td>
                  {{ i.name }}
                </td>
                <td>
                  {{
                    i.Incomes.time
                      .replace("T", " ")
                      .substring(0, i.Incomes.time.length - 3)
                  }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3">
                  <Pagination
                    :page="page"
                    :pages="pages"
                    :limit="limit"
                    @get="get"
                  />
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <div
        class="tab-pane fade"
        id="pills-profile"
        role="tabpanel"
        aria-labelledby="pills-profile-tab"
      >
        <order ref="order" v-if="!loan?.Loans?.pre_order" />
        <trades ref="trades" v-if="!loan?.Loans?.pre_order" />
        <preOrder ref="order" v-if="loan?.Loans?.pre_order" />
        <preOrderTrades ref="trades" v-if="loan?.Loans?.pre_order" />
      </div>
    </div>
  </div>
</template>

<script>
import * as api from "@/components/Api/Api";
import order from "@/components/order/order.vue";
import preOrder from "@/components/order/preOrder.vue";
import trades from "@/components/order/trades.vue";
import preOrderTrades from "@/components/order/preOrderTrades.vue";
import Pagination from "@/components/Pagination/Pagination.vue";
export default {
  name: "NasiyaTarix",
  components: { Pagination, order, trades, preOrder, preOrderTrades },
  data() {
    return {
      loan: null,
      page: 0,
      pages: 1,
      limit: 100,
      page1: 0,
      pages1: 1,
      limit1: 100,
      payments: [],
    };
  },
  created() {
    this.getLoan();
    this.get(this.page, this.limit);
  },
  methods: {
    getLoan() {
      api.getLoan(0, this.$route.params.id).then((res) => {
        this.loan = res.data;
      });
    },
    get(page, limit) {
      api
        .incomes(this.$route.params.id, "loan", 0, page, limit)
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.limit = Response.data.limit;
          this.payments = Response.data.data;
        });
    },
  },
};
</script>

<style scoped>
.input-group {
  justify-content: center;
}
</style>
