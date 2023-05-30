<template>
  <h3>
    {{ role == "operator" ? "Magazindan  ketgan buyurtmalar" : "Transport" }}
  </h3>
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
    <div class="col-md-4"></div>
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
            <p v-if="item.customer">
              <i class="fa fa-handshake"></i>
              {{ item.customer?.name }}
            </p>
            <p v-if="item.customer">
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
            <p v-if="item.delivery_money_user == role">
              <i class="fa fa-coins"></i>
              <strong class="bg-success rounded">
                {{ currency.format(item.delivery_money) }}
              </strong>
              so'm
            </p>
            <p v-if="item.comment">
              <i class="fa fa-comment"></i>
              {{ item.comment }}
            </p>
            <div class="row">
              <div class="col" v-if="!item.delivered && role == 'logistika'">
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
              <div
                class="col"
                v-if="role == 'operator' && !item.operator_status"
              >
                <button
                  class="btn btn-sm btn-block btn-outline-success"
                  @click="putOperator(item.id)"
                >
                  <i class="fa fa-check"></i>
                </button>
              </div>
              <div
                class="col"
                v-if="
                  !item.delivered && (role == 'worker' || role == 'ustanovshik')
                "
              >
                <button
                  class="btn btn-sm btn-block btn-outline-success"
                  @click="putOrder(item.id)"
                >
                  <i class="far fa-circle-check"></i>
                </button>
              </div>
              <div
                class="col"
                v-if="item.status == true && role == 'logistika'"
              >
                <button
                  class="btn btn-sm btn-block btn-outline-primary"
                  @click="$refs.ServiceModal.start(item.id, 'order')"
                >
                  <i class="fa fa-gear"></i>
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
            <div class="col-12" v-if="role == 'operator'">
              Status
              <select class="form-select" v-model="filter.operator_status">
                <option value="false">Faol</option>
                <option value="true">Yakunlangan</option>
              </select>
            </div>
            <div class="col-12" v-if="role !== 'operator'">
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
              Gruzchik
              <div class="dropdown">
                <button
                  id="gruzchikDropdown"
                  class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
                  data-toggle="dropdown"
                  @click="getUsers('gruzchik')"
                >
                  {{ filter.gruzchik?.name || "Gruzchik tanlang" }}
                </button>
                <div
                  class="dropdown-menu w-100 p-1"
                  aria-labelledby="gruzchikDropdown"
                >
                  <ul
                    class="list-group p-1 responsive"
                    style="max-height: 25vh"
                    @scroll="scrollUsers($event, 'gruzchik')"
                  >
                    <li
                      class="list-group-item p-2"
                      v-for="item in users.data"
                      :key="item"
                      @click="filter.gruzchik = item"
                    >
                      {{ item.name }}
                    </li>
                  </ul>
                </div>
              </div>
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
              filter = {
                status: role == 'operator' ? 'true' : 'false',
                operator_status: role == 'operator' ? 'false' : '',
                gruzchik: null,
                attached: true,
                from_time: '',
                to_time: '',
              };
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
    <div class="modal-dialog">
      <form class="modal-content" @submit.prevent="attachOrder()">
        <div class="modal-header">
          <h5>Buyurtma</h5>
        </div>
        <div class="modal-body">
          <div class="row gap-1 text-left">
            <div class="col-12">
              Pulni olib keluvchi hodim
              <div class="row">
                <div class="col-6">
                  <button
                    type="button"
                    class="btn btn-sm btn-block"
                    :class="
                      attach.delivery_money_user == 'worker'
                        ? 'btn-primary'
                        : 'btn-outline-primary'
                    "
                    @click="attach.delivery_money_user = 'worker'"
                  >
                    Haydovchi
                  </button>
                </div>
                <div class="col-6">
                  <button
                    type="button"
                    class="btn btn-sm btn-block"
                    :class="
                      attach.delivery_money_user == 'ustanovshik'
                        ? 'btn-primary'
                        : 'btn-outline-primary'
                    "
                    @click="attach.delivery_money_user = 'ustanovshik'"
                  >
                    Ustanovshik
                  </button>
                </div>
              </div>
            </div>
            <div class="col-12">
              Haydovchi biriktirish
              <div class="dropdown">
                <button
                  id="customerDropdown"
                  class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
                  data-toggle="dropdown"
                  @click="getUsers('worker')"
                >
                  {{ worker?.name || "Haydovchi tanlang" }}
                </button>
                <div
                  class="dropdown-menu w-100 p-1"
                  aria-labelledby="customerDropdown"
                >
                  <ul
                    class="list-group p-1 responsive"
                    style="max-height: 25vh"
                    @scroll="scrollUsers($event, 'worker')"
                  >
                    <li
                      class="list-group-item p-2"
                      v-for="item in users.data"
                      :key="item"
                      @click="worker = item"
                    >
                      {{ item.name }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-12">
              Ustanovshik biriktirish
              <div class="dropdown">
                <button
                  id="customerDropdown"
                  class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
                  data-toggle="dropdown"
                  @click="getUsers('ustanovshik')"
                >
                  {{ ustanovshik?.name || "Ustanovshik tanlang" }}
                </button>
                <div
                  class="dropdown-menu w-100 p-1"
                  aria-labelledby="customerDropdown"
                >
                  <ul
                    class="list-group p-1 responsive"
                    style="max-height: 25vh"
                    @scroll="scrollUsers($event, 'ustanovshik')"
                  >
                    <li
                      class="list-group-item p-2"
                      v-for="item in users.data"
                      :key="item"
                      @click="ustanovshik = item"
                    >
                      {{ item.name }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-12">
              Gruzchik biriktirish
              <div class="dropdown">
                <button
                  id="gruzchikDropdown"
                  class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
                  data-toggle="dropdown"
                  @click="getUsers('gruzchik')"
                >
                  {{ gruzchik?.name || "Gruzchik tanlang" }}
                </button>
                <div
                  class="dropdown-menu w-100 p-1"
                  aria-labelledby="gruzchikDropdown"
                >
                  <ul
                    class="list-group p-1 responsive"
                    style="max-height: 25vh"
                    @scroll="scrollUsers($event, 'gruzchik')"
                  >
                    <li
                      class="list-group-item p-2"
                      v-for="item in users.data"
                      :key="item"
                      @click="gruzchik = item"
                    >
                      {{ item.name }}
                    </li>
                  </ul>
                </div>
              </div>
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
          <button class="btn btn-outline-primary" :disabled="!worker">
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

  <ServiceModal ref="ServiceModal" />
</template>

<script>
import * as api from "@/components/Api/Api.js";
import Pagination from "@/components/Pagination/Pagination.vue";
import ServiceModal from "@/components/modal/serviceModal.vue";
import orderModal from "@/components/order/orderModal.vue";
import swal from "sweetalert";
export default {
  name: "Transport",
  components: { Pagination, orderModal, ServiceModal },
  data() {
    return {
      role: localStorage["role"],
      currency: Intl.NumberFormat(),
      user_id: localStorage["user_id"],
      users: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
      filter: {
        status: "false",
        operator_status: "",
        gruzchik: null,
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
      worker: null,
      ustanovshik: null,
      gruzchik: null,
      attach: {
        order_id: 0,
        worker_id: 0,
        ustanovshik_id: 0,
        gruzchik_id: 0,
        etaj: false,
        city: false,
        delivery_money_user: "",
      },
    };
  },
  created() {
    if (["worker", "ustanovshik"].includes(this.role)) {
      this.getUser();
    } else if (this.role !== "operator") {
      this.getUsers();
    }
    if (this.role == "operator") {
      this.filter.status = "true";
      this.filter.operator_status = "false";
    }
    this.getOrders(0, 25);
  },
  methods: {
    getUser() {
      api.user().then((res) => {
        this.user = res.data;
      });
    },
    getUsers(role) {
      api.users(0, 0, [role], "", 0, 25).then((res) => {
        this.users = res.data;
      });
    },
    scrollUsers(event, role) {
      const element = event.target;
      if (element.scrollTop + element.clientHeight >= element.scrollHeight) {
        if (this.users.current_page < this.users.pages) {
          api
            .users(0, 0, [role], "", this.users.current_page + 1, 25)
            .then((res) => {
              this.users.current_page = res.data.current_page;
              this.users.pages = res.data.pages;
              this.users.data = this.users.data.concat(res.data.data);
            });
        }
      }
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
      const gruzchik_id = this.filter.gruzchik?.id || 0;
      api
        .orders(
          this.filter.from_time,
          this.filter.to_time,
          "true",
          0,
          worker_id,
          ustanovshik_id,
          gruzchik_id,
          this.filter.status,
          this.filter.operator_status,
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
      this.attach.worker_id = this.worker.id;
      this.attach.ustanovshik_id = this.ustanovshik?.id || 0;
      this.attach.gruzchik_id = this.gruzchik?.id || 0;
      api.attachLogistika(this.attach).then(() => {
        api.success("close-attach-modal").then(() => {
          this.worker = null;
          this.ustanovshik = null;
          this.attach = {
            order_id: 0,
            worker_id: 0,
            ustanovshik_id: 0,
            gruzchik_id: 0,
            etaj: false,
            city: false,
          };
          swal({
            icon: "info",
            title: "Buyurtma cheki chiqarilsinmi ?",
            buttons: {
              confirm: {
                visible: true,
                text: "Ok",
                value: true,
              },
              cancel: {
                visible: true,
                text: "Bekor qilish",
                value: false,
              },
            },
          }).then((value) => {
            if (value) {
              this.$refs.orderModal.print(this.order.id);
            }
            this.getOrders(0, 25);
          });
        });
      });
    },
    putOperator(id) {
      api.operatorOrder(id, "order").then(() => {
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
