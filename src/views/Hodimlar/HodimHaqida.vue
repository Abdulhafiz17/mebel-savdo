<template>
  <h3>
    <span class="fa fa-user" /> {{ user ? "Hodim " + user.name : "Hodim" }}
  </h3>
  <div class="row my-1">
    <div class="col-md-5">
      <input
        type="date"
        class="form-control form-control-sm"
        v-model="from_date_2"
      />
    </div>
    <div class="col-md-5">
      <input
        type="date"
        class="form-control form-control-sm"
        v-model="to_date_2"
      />
    </div>
    <div class="col-md-2">
      <button
        class="btn btn-sm btn-block btn-outline-secondary"
        @click="getOrders(0, 100)"
      >
        <i class="far fa-circle-check" />
      </button>
    </div>
  </div>
  <div class="responsive" style="max-height: 65vh">
    <ul class="list-group">
      <li
        class="list-group-item"
        v-for="item in orders"
        :key="item"
        :id="item.id"
        @click="$refs.orderModal.start(item.id)"
      >
        <span class="text-left">
          <h5>Buyurtma - {{ item.ordinal_number }}</h5>
          <p class="m-0">
            Mijoz: {{ item.customer ? item.customer.name : "Umumiy" }}
          </p>
        </span>
        <strong>{{ item.time.substring(0, item.time.length - 9) }}</strong>
      </li>
    </ul>
    <Pagination :page="page" :pages="pages" :limit="limit" @get="getOrders" />
  </div>
  <orderModal ref="orderModal" />
</template>

<script>
import * as api from "@/components/Api/Api";
import Pagination from "../../components/Pagination/Pagination.vue";
import orderModal from "@/components/order/orderModal.vue";
export default {
  name: "Hodim",
  components: { Pagination, orderModal },
  data() {
    return {
      page: 0,
      pages: 1,
      limit: 100,
      user: null,
      from_date_2: "",
      to_date_2: "",
      orders: [],
    };
  },
  created() {
    this.getUser(0, 100);
  },
  methods: {
    getUser(page, limit) {
      api.thisUser(this.$route.params.id).then((Response) => {
        this.user = Response.data;
        this.getOrders(page, limit);
      });
    },
    getOrders(page, limit) {
      const seller_id = this.user.role !== "worker" ? this.$route.params.id : 0;
      const worker_id = this.user.role == "worker" ? this.$route.params.id : 0;
      api
        .orders(
          this.from_date_2,
          this.to_date_2,
          true,
          seller_id,
          worker_id,
          "true",
          page,
          limit
        )
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.orders = Response.data.data;
          this.orders.forEach((item) => {
            item.trades = [];
          });
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
