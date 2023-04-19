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
    <div class="col-md-4">
      <div v-if="role == 'worker'">
        {{ currency.format(user?.balance) + " so'm" }}
      </div>
    </div>
    <div class="col-md-4"></div>
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
              <div class="col" v-if="!item.delivered">
                <button
                  class="btn btn-sm btn-block btn-outline-warning"
                  data-toggle="modal"
                  data-target="#update"
                  @click="order = item"
                >
                  <i class="fa fa-edit"></i>
                </button>
              </div>
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
              <div class="col" v-if="!item.delivered && role !== 'logistika'">
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
          <div class="row gap-1 text-left">
            <div class="col-12">
              Status
              <select class="form-select" v-model="filter.status">
                <option value="false">yetkazilmagan</option>
                <option value="true">yetkazilgan</option>
              </select>
            </div>
            <div class="col-12" v-if="filter.status == 'false'">
              Status
              <select class="form-select" v-model="filter.attached">
                <option :value="true">hodim biriktirilgan</option>
                <option :value="false">hodim biriktirilmagan</option>
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

  <div class="modal fade" id="update">
    <div class="modal-dialog modal-sm">
      <form class="modal-content" @submit.prevent="attachOrder()">
        <div class="modal-header">
          <h5>Buyurtma</h5>
        </div>
        <div class="modal-body">
          <div class="row gap-1 text-left">
            <div class="col-12">
              Haydovchi
              <select class="form-select" required v-model="attach.worker_id">
                <option
                  v-for="item in users.filter((item) => item.role == 'worker')"
                  :key="item"
                  :value="item.id"
                >
                  {{ item.name }}
                </option>
              </select>
            </div>
            <div class="col-12">
              Ustanovshik
              <select
                class="form-select"
                required
                v-model="attach.ustanovshik_id"
              >
                <option
                  v-for="item in users.filter(
                    (item) => item.role == 'ustanovshik'
                  )"
                  :key="item"
                  :value="item.id"
                >
                  {{ item.name }}
                </option>
              </select>
            </div>
            <div class="col-12">
              <button
                type="button"
                class="btn btn-block"
                :class="attach.etaj ? 'bg-primary' : ''"
                @click="attach.etaj = !attach.etaj"
              >
                Ko'p qavatli
              </button>
            </div>
            <div class="col-12">
              <button
                type="button"
                class="btn btn-block"
                :class="attach.city ? 'bg-primary' : ''"
                @click="attach.city = !attach.city"
              >
                Shahardan tashqari
              </button>
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
            close-attach-modal
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
import Pagination from "@/components/Pagination/Pagination.vue";
import orderModal from "@/components/order/orderModal.vue";
export default {
  name: "Transport",
  components: { Pagination, orderModal },
  data() {
    return {
      role: localStorage["role"],
      currency: Intl.NumberFormat(),
      user_id: localStorage["user_id"],
      user: null,
      users: [],
      filter: {
        status: "false",
        attached: true,
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
      attach: {
        order_id: 0,
        worker_id: 0,
        ustanovshik_id: 0,
        etaj: false,
        city: false,
      },
    };
  },
  created() {
    if (["worker", "ustanovshik"].includes(this.role)) {
      this.getUser();
    } else {
      this.getUsers();
    }
    this.getOrders(0, 25);
  },
  methods: {
    getUser() {
      api.user().then((res) => {
        this.user = res.data;
      });
    },
    getUsers() {
      api.users(0, 0, ["worker", "ustanovshik"], 0, 100).then((res) => {
        this.users = res.data.data;
      });
    },
    getOrders(page = 0, limit = 25) {
      const worker_id =
        this.role == "worker" ? this.user_id : this.filter.attached ? 1 : 0;
      const ustanovshik_id =
        this.role == "ustanovshik"
          ? this.user_id
          : this.filter.attached
          ? 1
          : 0;
      api
        .orders(
          this.filter.from_time,
          this.filter.to_time,
          true,
          0,
          worker_id,
          ustanovshik_id,
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
    attachOrder() {
      this.attach.order_id = this.order.id;
      api.attachLogistika(this.attach).then(() => {
        api.success("close-attach-modal").then(() => {
          this.attach = {
            order_id: 0,
            worker_id: 0,
            ustanovshik_id: 0,
            etaj: false,
            city: false,
          };
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
