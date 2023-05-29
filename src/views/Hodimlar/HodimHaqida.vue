<template>
  <h3>
    <span class="fa fa-user" /> {{ user ? "Hodim " + user.name : "Hodim" }}
  </h3>
  <ul
    class="nav nav-pills nav-justified mb-3"
    id="pills-tab"
    role="tablist"
    v-if="tab"
  >
    <li class="nav-item" role="presentation" v-if="order">
      <button
        class="nav-link"
        :class="{ active: template == 1 }"
        id="orders-tab"
        data-bs-toggle="pill"
        data-bs-target="#orders"
        type="button"
        role="tab"
        aria-controls="orders"
        aria-selected="true"
        @click="
          template = 1;
          from_date_2 = '';
          to_date_2 = '';
          getOrders(0, 25);
        "
      >
        Buyurtmalar
      </button>
    </li>
    <li class="nav-item" role="presentation" v-if="pre_order">
      <button
        class="nav-link"
        :class="{ active: template == 2 }"
        id="pre-orders-tab"
        data-bs-toggle="pill"
        data-bs-target="#pre-orders"
        type="button"
        role="tab"
        aria-controls="pre-orders"
        aria-selected="true"
        @click="template = 2"
      >
        Oldindan buyurtmalar
      </button>
    </li>
    <li class="nav-item" role="presentation" v-if="transfer">
      <button
        class="nav-link"
        :class="{ active: template == 3 }"
        id="transfers-tab"
        data-bs-toggle="pill"
        data-bs-target="#transfers"
        type="button"
        role="tab"
        aria-controls="transfers"
        aria-selected="true"
        @click="template = 3"
      >
        Transfer
      </button>
    </li>
  </ul>
  <div class="tab-content" id="pills-tabContent">
    <div
      class="tab-pane fade"
      :class="{ 'show active': template == 1 }"
      id="orders"
      role="tabpanel"
      aria-labelledby="orders-tab"
    >
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
      <div class="responsive" :style="{ height: tab ? '75vh' : '80vh' }">
        <ul class="list-group">
          <li
            class="list-group-item"
            v-for="item in orders"
            :key="item"
            :id="item.id"
            @click="$refs.orderModal.start(item.id)"
          >
            <span class="text-left">
              <strong>Buyurtma - {{ item.ordinal_number }}</strong>
              <p class="m-0">
                Mijoz: {{ item.customer ? item.customer.name : "Umumiy" }}
              </p>
            </span>
            <strong>{{ item.time.substring(0, item.time.length - 9) }}</strong>
          </li>
        </ul>
        <Pagination
          :page="page"
          :pages="pages"
          :limit="limit"
          @get="getOrders"
        />
      </div>
    </div>
    <div
      class="tab-pane fade"
      :class="{ 'show active': template == 2 }"
      id="pre-orders"
      role="tabpanel"
      aria-labelledby="pre-orders-tab"
    >
      <preOrders
        :user-id="Number($route.params.id)"
        :parent-role="user?.role"
        v-if="template == 2"
      />
    </div>
    <div
      class="tab-pane fade"
      :class="{ 'show active': template == 3 }"
      id="transfers"
      role="tabpanel"
      aria-labelledby="transfers-tab"
    >
      <Transfer
        :user-id="Number($route.params.id)"
        :parent-role="user?.role"
        v-if="template == 3"
      />
    </div>
  </div>
  <orderModal ref="orderModal" />
</template>

<script>
import * as api from "@/components/Api/Api";
import Pagination from "../../components/Pagination/Pagination.vue";
import orderModal from "@/components/order/orderModal.vue";
import preOrders from "../PreOrder/preOrders.vue";
import Transfer from "../Logistika/Transfer.vue";
export default {
  name: "Hodim",
  components: { Pagination, orderModal, preOrders, Transfer },
  data() {
    return {
      template: 1,
      page: 0,
      pages: 1,
      limit: 100,
      user: null,
      from_date_2: "",
      to_date_2: "",
      orders: [],
    };
  },
  computed: {
    tab() {
      if (
        ["seller", "warehouseman", "worker", "ustanovshik"].includes(
          this.user?.role
        )
      )
        return true;
      else return false;
    },
    order() {
      if (["seller", "worker", "ustanovshik"].includes(this.user?.role))
        return true;
      else return false;
    },
    pre_order() {
      if (
        ["seller", "warehouseman", "worker", "ustanovshik"].includes(
          this.user?.role
        )
      )
        return true;
      else return false;
    },
    transfer() {
      if (["warehouseman", "worker", "ustanovshik"].includes(this.user?.role))
        return true;
      else return false;
    },
  },
  created() {
    this.getUser(0, 100);
  },
  methods: {
    getUser(page, limit) {
      api.thisUser(this.$route.params.id).then((Response) => {
        this.user = Response.data;
        if (this.user?.role == "warehouseman") this.template = 2;
        else this.getOrders(page, limit);
      });
    },
    getOrders(page, limit) {
      const seller_id = this.user.role == "seller" ? this.$route.params.id : 1;
      const worker_id = this.user.role == "worker" ? this.$route.params.id : 1;
      const ustanovshik_id =
        this.user.role == "ustanovshik" ? this.$route.params.id : 1;
      api
        .orders(
          this.from_date_2,
          this.to_date_2,
          true,
          seller_id,
          worker_id,
          ustanovshik_id,
          0,
          "true",
          "",
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
