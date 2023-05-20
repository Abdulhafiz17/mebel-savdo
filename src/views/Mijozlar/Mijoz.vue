<template>
  <h3>
    <span class="fa fa-handshake" />
    {{ customer ? "Mijoz " + customer.name : "Mijoz" }}
  </h3>
  <div class="row">
    <div class="col-md-1"></div>
    <div
      class="col-md-10 my-1 d-flex justify-content-around align-items-center text-center"
    >
      <span>
        Umumiy savdo:
        <strong>{{ Intl.NumberFormat().format(sum_trade) }} so'm</strong>
      </span>
      <span>
        Umumiy chegirma:
        <strong>{{ Intl.NumberFormat().format(sum_discount) }} so'm</strong>
      </span>
      <span>
        Umumiy qaytarilgan mahsulot:
        <strong>{{ Intl.NumberFormat().format(sum_return) }} so'm</strong>
      </span>
    </div>
    <div class="col-md-1"></div>
  </div>
  <hr />
  <div class="body">
    <ul class="nav nav-pills nav-justified mb-3" id="pills-tab" role="tablist">
      <li class="nav-item" role="presentation">
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
            from_date = '';
            to_date = '';
            getOrders(0, 25);
          "
        >
          Buyurtmalar
        </button>
      </li>
      <li class="nav-item" role="presentation">
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
              v-model="from_date"
            />
          </div>
          <div class="col-md-5">
            <input
              type="date"
              class="form-control form-control-sm"
              v-model="to_date"
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
        <div class="responsive" style="height: 65vh">
          <ul class="list-group">
            <li
              class="list-group-item"
              v-for="item in orders"
              :key="item"
              :id="item.id"
              @click="$refs.orderModal.start(item.id)"
            >
              <h5>Buyurtma - {{ item.ordinal_number }}</h5>
              <strong>{{
                item.time.substring(0, item.time.length - 9)
              }}</strong>
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
          parent-role="customer"
          v-if="template == 2"
        />
      </div>
    </div>
  </div>
  <orderModal ref="orderModal" />
</template>

<script>
import * as api from "@/components/Api/Api";
import Pagination from "@/components/Pagination/Pagination.vue";
import orderModal from "@/components/order/orderModal.vue";
import preOrders from "../PreOrder/preOrders.vue";
export default {
  name: "Mijoz",
  components: { Pagination, orderModal, preOrders },
  data() {
    return {
      template: 1,
      page: 0,
      pages: 1,
      limit: 50,
      page_2: 0,
      pages_2: 1,
      limit_2: 50,
      from_date: "",
      to_date: "",
      customer: null,
      sum_trade: null,
      sum_discount: null,
      sum_return: null,
      orders: [],
      trades: [],
      returned_products: [],
    };
  },
  created() {
    this.getCustomer(0, 50);
  },
  methods: {
    getCustomer(page, limit) {
      api.customer(this.$route.params.id).then((Response) => {
        this.customer = Response.data;
        this.getOrders(page, limit);
      });
    },
    getOrders(page, limit) {
      api
        .customerOrders(
          this.$route.params.id,
          this.from_date,
          this.to_date,
          page,
          limit
        )
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.orders = Response.data.data;
          this.sum_trade = Response.data.sum_trade_balance;
          this.sum_discount = Response.data.sum_discount;
          this.sum_return = Response.data.sum_returned_money;
        });
    },
  },
};
</script>

<style></style>
