<template>
  <h3>Transport</h3>
  <div class="row">
    <div class="col-md-4">
      <button
        class="btn btn-sm btn-block btn-outline-info"
        data-toggle="modal"
        data-target="#filter"
      >
        <i class="fa fa-filter"></i>
      </button>
    </div>
    <div class="col-md-4">{{ currency.format(user?.balance) + " so'm" }}</div>
    <div class="col-md-4">
      <router-link class="btn btn-sm btn-block btn-outline-secondary" to="/">
        <i class="fa fa-sign-out"></i> Chiqish
      </router-link>
    </div>
  </div>

  <div class="responsive" style="max-height: 84vh">
    <div class="row">
      <div class="col-md-4 my-1" v-for="item in orders.data" :key="item">
        <div class="card shadow">
          <div class="card-body">
            <p>
              <i class="fa fa-calendar-alt"></i>
              {{ item.time.replace("T", " ").substring(0, 16) }}
            </p>
            <p>
              <i class="fa fa-handshake"></i>
              {{ item.customer?.name }}
            </p>
            <p>
              <i class="fa fa-phone"></i>
              <a :href="`tel:+998${item.customer?.phone}`">
                {{ "+998" + item.customer?.phone }}
              </a>
            </p>
            <p>
              <i class="fa fa-map"></i>
              {{ item.customer?.address }}
              <br />
              <i class="fa fa-location-dot"></i> {{ item.customer?.map_lat }} ;
              {{ item.customer?.map_long }}
            </p>
            <p>
              <i class="fa fa-coins"></i>
              <strong>
                {{ currency.format(item.delivery_money) }}
              </strong>
              so'm
            </p>
            <p>
              <i class="fa fa-comment"></i>
              {{ item.comment }}
            </p>
            <div class="row">
              <div class="col">
                <a
                  class="btn btn-sm btn-block btn-outline-primary"
                  target="_blank"
                  :href="`https://www.google.com/maps/@${item.customer?.map_lat},${item.customer?.map_long},20z`"
                >
                  <i class="fa fa-location-dot"></i>
                </a>
              </div>
              <div class="col">
                <button
                  class="btn btn-sm btn-block btn-outline-info"
                  @click="$refs.orderModal.start(item.id)"
                >
                  <i class="fa fa-info"></i>
                </button>
              </div>
              <div class="col">
                <button
                  class="btn btn-sm btn-block btn-outline-success"
                  @click="putOrder(item.id)"
                >
                  <i class="far fa-circle-check"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12">
        <Pagination
          :page="orders.current_page"
          :pages="orders.pages"
          :limit="orders.limit"
          @get="getOrders"
        />
      </div>
    </div>
  </div>

  <orderModal ref="orderModal" />

  <div class="modal fade" id="filter">
    <div class="modal-dialog modal-sm">
      <div class="modal-content">
        <div class="modal-header">
          <h5>Filter</h5>
        </div>
        <div class="modal-body">
          <div class="row gap-1">
            <div class="col-12">
              Status
              <select class="form-select" v-model="filter.status">
                <option value="false">yetkazilmagan</option>
                <option value="true">yetkazilgan</option>
              </select>
            </div>
            <div class="col-12">
              Dan
              <input
                type="date"
                class="form-control"
                required
                v-model="filter.from_time"
              />
            </div>
            <div class="col-12">
              Gacha
              <input
                type="date"
                class="form-control"
                required
                v-model="filter.to_time"
              />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            class="btn btn-outline-primary"
            data-dismiss="modal"
            @click="getOrders(0, 25)"
          >
            <i class="far fa-circle-check"></i>
          </button>
          <button
            class="btn btn-outline-danger"
            data-dismiss="modal"
            @click="
              filter = { status: false, from_time: '', to_time: '' };
              getOrders(0, 25);
            "
          >
            <i class="far fa-circle-xmark"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from "@/components/Api/Api.js";
import Pagination from "@/components/Pagination/Pagination.vue";
import orderModal from "@/components/order/orderModal.vue";
export default {
  name: "Transport",
  components: { Pagination, orderModal },
  data() {
    return {
      currency: Intl.NumberFormat(),
      worker_id: localStorage["user_id"],
      user: null,
      filter: {
        status: false,
        from_time: "",
        to_time: "",
      },
      orders: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
      order: null,
    };
  },
  created() {
    this.getUser();
    this.getOrders(0, 25);
  },
  methods: {
    getUser() {
      api.user().then((res) => {
        this.user = res.data;
      });
    },
    getOrders(page = 0, limit = 25) {
      api
        .orders(
          this.filter.from_time,
          this.filter.to_time,
          true,
          0,
          this.worker_id,
          this.filter.status,
          page,
          limit
        )
        .then((res) => {
          this.orders = res.data;
        });
    },
    putOrder(id) {
      api.deliverOrder(id).then((res) => {
        api.success().then(() => {
          this.getOrders(0, 25);
        });
      });
    },
  },
};
</script>

<style scoped>
p {
  margin: 0;
  width: 100%;
}

p i {
  padding: 5px;
}
</style>
