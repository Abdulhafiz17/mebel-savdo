<template>
  <h4 v-if="!parent_user_id">Oldindan buyurtmalar</h4>
  <div class="row">
    <div class="col text-left"></div>
    <div class="col text-right">
      <button
        class="btn btn-sm btn-outline-info"
        data-toggle="modal"
        data-target="#filter"
      >
        <i class="fa fa-filter"></i>
      </button>
    </div>
  </div>
  <hr v-if="!parent_user_id" />

  <div
    class="table-responsive"
    :style="{
      height:
        parent_role == 'customer' ? '65vh' : parent_user_id ? '75vh' : '80vh',
    }"
  >
    <div class="row">
      <div class="col-md-4 my-1" v-for="item in orders.data" :key="item">
        <div class="card shadow h-100">
          <div class="card-body flex">
            <div>
              <p>
                <strong>ID:</strong>
                {{ item.Pre_orders.id }}
              </p>
              <p>
                <i class="fa fa-calendar-alt"></i>
                {{ item.Pre_orders.time.replace("T", " ").substring(0, 16) }}
              </p>
              <p>
                <i class="fa fa-calendar-alt"></i>
                {{ item.Pre_orders.date }}
              </p>
              <p>
                <i class="fa fa-handshake"></i>
                {{ item.Customers?.name }}
              </p>
              <p v-if="item.Customers">
                <i class="fa fa-phone"></i>
                <a :href="`tel:+998${item.Customers.phone}`">
                  {{ "+998 " + item.Customers?.phone }}
                </a>
              </p>
              <p v-if="item.Pre_orders.etaj">
                <i class="fa fa-building"></i>
                Ko'p qavatli
              </p>
              <p v-if="item.Pre_orders.city">
                <i class="fa fa-road"></i>
                Shahardan tashqari
              </p>
              <p v-if="item.Pre_orders.comment">
                <i class="fa fa-comment"></i>
                {{ item.Pre_orders.comment }}
              </p>
              <p v-if="item.Pre_orders.delivery_money_user == role">
                <i class="fa fa-money-bill"></i>
                <strong class="bg-success rounded">
                  {{ $util.currency(item.Pre_orders.delivery_money) + " so'm" }}
                </strong>
              </p>
              <p v-if="item.worker">
                <i class="fa fa-truck"></i>
                {{ item.worker }}
              </p>
              <p v-if="item.ustanovshik">
                <i class="fa fa-tools"></i>
                {{ item.ustanovshik }}
              </p>
            </div>
            <div class="row">
              <div class="col">
                <button
                  class="btn btn-sm btn-block btn-outline-info"
                  @click="$refs.preOrderModal.start(item.Pre_orders.id)"
                >
                  <i class="fa fa-info"></i>
                </button>
              </div>
              <div
                class="col"
                v-if="role == 'operator' && !item.Pre_orders.operator_status"
              >
                <button
                  class="btn btn-sm btn-block btn-outline-success"
                  @click="putOperator(item.Pre_orders.id)"
                >
                  <i class="fa fa-check"></i>
                </button>
              </div>
              <div
                class="col"
                v-if="
                  ['branch_admin', 'cashier'].includes(role) &&
                  !['done', 'false'].includes(item.Pre_orders.status)
                "
              >
                <button
                  class="btn btn-sm btn-block btn-outline-primary"
                  @click="$refs.takeIncomeModal.start(item.Pre_orders.id)"
                >
                  <i class="fa fa-coins"></i>
                </button>
              </div>
              <div
                class="col"
                v-if="
                  ['worker', 'ustanovshik', 'warehouseman'].includes(role) &&
                  ['wait', 'logistika'].includes(item.Pre_orders.status)
                "
              >
                <button
                  class="btn btn-sm btn-block btn-outline-success"
                  @click="check(item.Pre_orders.id)"
                >
                  <i class="fa fa-check"></i>
                </button>
              </div>
              <div
                class="col"
                v-if="
                  ['branch_admin', 'logistika'].includes(role) &&
                  !['warehouseman', 'logistika'].includes(
                    item.Pre_orders.status
                  )
                "
              >
                <button
                  class="btn btn-sm btn-block btn-outline-warning"
                  @click="$refs.updatePreOrderModal.start(item)"
                >
                  <i class="fa fa-edit"></i>
                </button>
              </div>
              <div
                class="col"
                v-if="
                  role == 'logistika' &&
                  item.Pre_orders.status == 'warehouseman'
                "
              >
                <button
                  class="btn btn-sm btn-block btn-outline-success"
                  data-toggle="modal"
                  data-target="#pre-order"
                  @click="update_pre_order_logistika.id = item.Pre_orders.id"
                >
                  <i class="fa fa-check"></i>
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

  <div class="modal fade" id="filter">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header"><h5>Filter</h5></div>
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
              <select
                class="form-select"
                v-model="filter.status"
                @change="
                  filter.status !== 'logistika_user'
                    ? ((filter.worker = null), (filter.ustanovshik = null))
                    : false
                "
              >
                <option value="false" v-if="['branch_admin'].includes(role)">
                  Faol
                </option>
                <option
                  value="wait"
                  v-if="
                    ['branch_admin', 'warehouseman', 'cashier'].includes(role)
                  "
                >
                  Kutish
                </option>
                <option
                  value="warehouseman"
                  v-if="
                    [
                      'branch_admin',
                      'warehouseman',
                      'logistika',
                      'cashier',
                    ].includes(role)
                  "
                >
                  Omborchi
                </option>
                <option
                  value="logistika"
                  v-if="
                    [
                      'branch_admin',
                      'warehouseman',
                      'logistika',
                      'cashier',
                    ].includes(role)
                  "
                >
                  Logistika
                </option>
                <option
                  value="logistika_user"
                  v-if="
                    [
                      'branch_admin',
                      'warehouseman',
                      'logistika',
                      'worker',
                      'ustanovshik',
                      'cashier',
                    ].includes(role)
                  "
                >
                  Logistika hodim biriktirilgan
                </option>
                <option value="done">Yakunlangan</option>
              </select>
            </div>
            <div class="col-12" v-if="role == 'branch_admin'">
              Mijoz
              <div class="dropdown">
                <button
                  id="customerDropdown"
                  class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
                  data-toggle="dropdown"
                  @click="getCustomers()"
                >
                  {{ filter.customer?.name || "Mijoz tanlang" }}
                </button>
                <div
                  class="dropdown-menu w-100 p-1"
                  aria-labelledby="customerDropdown"
                >
                  <ul
                    class="list-group p-1 responsive"
                    style="max-height: 25vh"
                    @scroll="scrollCustomers($event)"
                  >
                    <li
                      class="list-group-item p-2"
                      v-for="item in customers.data"
                      :key="item"
                      @click="filter.customer = item"
                    >
                      {{ item.name }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div
              class="col-12"
              v-if="
                ['admin', 'branch_admin', 'logistika'].includes(role) &&
                parent_role !== 'seller'
              "
            >
              Sotuvchi
              <div class="dropdown">
                <button
                  id="customerDropdown"
                  class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
                  data-toggle="dropdown"
                  @click="getUsers('seller')"
                >
                  {{ filter.seller?.name || "Sotuvchi tanlang" }}
                </button>
                <div
                  class="dropdown-menu w-100 p-1"
                  aria-labelledby="customerDropdown"
                >
                  <ul
                    class="list-group p-1 responsive"
                    style="max-height: 25vh"
                    @scroll="scrollUsers($event, 'seller')"
                  >
                    <li
                      class="list-group-item p-2"
                      v-for="item in users.data"
                      :key="item"
                      @click="filter.seller = item"
                    >
                      {{ item.name }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div
              class="col-12"
              v-if="
                filter.status == 'logistika_user' &&
                role !== 'worker' &&
                role !== 'ustanovshik'
              "
            >
              Haydovchi
              <div class="dropdown">
                <button
                  id="customerDropdown"
                  class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
                  data-toggle="dropdown"
                  @click="getUsers('worker')"
                >
                  {{ filter.worker?.name || "Haydovchi tanlang" }}
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
                      @click="filter.worker = item"
                    >
                      {{ item.name }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div
              class="col-12"
              v-if="
                filter.status == 'logistika_user' &&
                role !== 'worker' &&
                role !== 'ustanovshik'
              "
            >
              Ustanovshik
              <div class="dropdown">
                <button
                  id="customerDropdown"
                  class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
                  data-toggle="dropdown"
                  @click="getUsers('ustanovshik')"
                >
                  {{ filter.ustanovshik?.name || "Ustanovshik tanlang" }}
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
                      @click="filter.ustanovshik = item"
                    >
                      {{ item.name }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div
              class="col-12"
              v-if="
                ['admin', 'branch_admin'].includes(role) &&
                filter.status == 'logistika'
              "
            >
              Omborchi
              <div class="dropdown">
                <button
                  id="customerDropdown"
                  class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
                  data-toggle="dropdown"
                  @click="getUsers('warehouseman')"
                >
                  {{ filter.warehouseman?.name || "Omborchi tanlang" }}
                </button>
                <div
                  class="dropdown-menu w-100 p-1"
                  aria-labelledby="customerDropdown"
                >
                  <ul
                    class="list-group p-1 responsive"
                    style="max-height: 25vh"
                    @scroll="scrollUsers($event, 'warehouseman')"
                  >
                    <li
                      class="list-group-item p-2"
                      v-for="item in users.data"
                      :key="item"
                      @click="filter.warehouseman = item"
                    >
                      {{ item.name }}
                    </li>
                  </ul>
                </div>
              </div>
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
              filter = default_filter;
              getOrders(0, 25);
            "
          >
            <i class="fa fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="pre-order">
    <div class="modal-dialog">
      <form class="modal-content" @submit.prevent="updatePreOrderLogistika()">
        <div class="modal-header"><h5>Tahrirlash</h5></div>
        <div class="modal-body">
          <div class="row gap-1 text-left">
            <div class="col-12" v-if="role == 'logistika'">
              Pulni olib keluvchi hodim
              <div class="row">
                <div class="col-6">
                  <button
                    type="button"
                    class="btn btn-sm btn-block"
                    :class="
                      update_pre_order_logistika.delivery_money_user == 'worker'
                        ? 'btn-primary'
                        : 'btn-outline-primary'
                    "
                    @click="
                      update_pre_order_logistika.delivery_money_user = 'worker'
                    "
                  >
                    Haydovchi
                  </button>
                </div>
                <div class="col-6">
                  <button
                    type="button"
                    class="btn btn-sm btn-block"
                    :class="
                      update_pre_order_logistika.delivery_money_user ==
                      'ustanovshik'
                        ? 'btn-primary'
                        : 'btn-outline-primary'
                    "
                    @click="
                      update_pre_order_logistika.delivery_money_user =
                        'ustanovshik'
                    "
                  >
                    Ustanovshik
                  </button>
                </div>
              </div>
            </div>
            <div class="col-12" v-if="role == 'logistika'">
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
            <div class="col-12" v-if="role == 'logistika'">
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
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-primary" :disabled="!worker">
            <i class="far fa-circle-check"></i>
          </button>
          <button
            class="btn btn-outline-danger"
            data-dismiss="modal"
            close-update-pre-order-modal
          >
            <i class="far fa-circle-xmark"></i>
          </button>
        </div>
      </form>
    </div>
  </div>

  <updatePreOrderModal ref="updatePreOrderModal" />

  <preOrderModal ref="preOrderModal" />

  <takeIncomeModal
    ref="takeIncomeModal"
    v-if="['branch_admin', 'cashier'].includes(role)"
  />
</template>

<script>
import * as api from "@/components/Api/Api";
import Pagination from "@/components/Pagination/Pagination.vue";
import updatePreOrderModal from "./updatePreOrderModal.vue";
import preOrderModal from "@/components/order/preOrderModal.vue";
import takeIncomeModal from "./takeIncomeModal.vue";
export default {
  name: "preOrders",
  props: {
    userId: Number,
    parentRole: String,
  },
  components: {
    Pagination,
    updatePreOrderModal,
    preOrderModal,
    takeIncomeModal,
  },
  data() {
    return {
      role: localStorage["role"],
      user_id: localStorage["user_id"],
      search_customers: "",
      customers: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
      search_users: "",
      users: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
      filter: {
        status: "",
        operator_status: "",
        customer: null,
        seller: null,
        worker: null,
        ustanovshik: null,
        warehouseman: null,
      },
      orders: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
      worker: null,
      ustanovshik: null,
      update_pre_order_logistika: {
        id: 0,
        worker_id: 0,
        ustanovshik_id: 0,
        delivery_money_user: "worker",
      },
    };
  },
  computed: {
    branch_id() {
      return this.role == "branch_admin" ? localStorage["branch_id"] : 0;
    },
    default_filter() {
      let status = "";
      if (this.role == "warehouseman") status = "wait";
      else if (this.role == "logistika") status = "warehouseman";
      else if (this.role == "worker" || this.role == "ustanovshik")
        status = "logistika";
      else status = "done";
      return {
        status: status,
        customer: null,
        seller: null,
        worker: null,
        ustanovshik: null,
        warehouseman: null,
      };
    },
    parent_user_id() {
      return this.$props.userId;
    },
    parent_role() {
      return this.$props.parentRole;
    },
  },
  created() {
    if (this.role == "warehouseman") this.filter.status = "wait";
    else if (this.role == "logistika") this.filter.status = "warehouseman";
    else if (this.role == "worker" || this.role == "ustanovshik")
      this.filter.status = "logistika_user";
    else this.filter.status = "done";
    if (this.role == "operator") this.filter.operator_status = "false";
    this.getOrders(0, 25);
  },
  methods: {
    getOrders(page, limit) {
      let customer_id = this.filter.customer?.id || 0;
      let seller_id = this.filter.seller?.id || 0;
      let worker_id = this.filter.worker?.id || 0;
      let ustanovshik_id = this.filter.ustanovshik?.id || 0;
      let warehouseman_id = this.filter.warehouseman?.id || 0;
      let worker = "";
      let status = this.filter.status;
      if (this.role == "warehouseman") {
        if (status == "warehouseman") warehouseman_id = this.user_id;
        else warehouseman_id = 0;
      } else if (this.role == "worker") {
        worker = "true";
        worker_id = this.user_id;
      } else if (this.role == "ustanovshik") {
        ustanovshik_id = this.user_id;
      } else if (this.role == "operator") {
        worker = "true";
      } else {
        if (this.filter.status == "logistika_user") {
          status = "logistika";
          worker = "true";
        } else {
          worker = "false";
        }
      }
      if (this.filter.status == "done") worker = "true";
      else worker = "false";
      if (this.parent_role == "seller") seller_id = this.parent_user_id;
      else if (this.parent_role == "warehouseman")
        warehouseman_id = this.parent_user_id;
      else if (this.parent_role == "worker") worker_id = this.parent_user_id;
      else if (this.parent_role == "ustanovshik")
        ustanovshik_id = this.parent_user_id;
      else if (this.parent_role == "customer")
        customer_id = this.parent_user_id;
      api
        .preOrders(
          customer_id,
          seller_id,
          this.branch_id,
          status,
          worker_id,
          ustanovshik_id,
          worker,
          warehouseman_id,
          this.filter.operator_status,
          page,
          limit
        )
        .then((res) => {
          this.orders = res.data;
        });
    },
    getCustomers() {
      api.customers(0, 25, this.search_customers).then((res) => {
        this.customers = res.data;
      });
    },
    scrollCustomers(event) {
      const element = event.target;
      if (element.scrollTop + element.clientHeight >= element.scrollHeight) {
        if (this.customers.current_page < this.customers.pages) {
          api
            .customers(
              this.customers.current_page + 1,
              25,
              this.search_customers
            )
            .then((res) => {
              this.customers.current_page = res.data.current_page;
              this.customers.pages = res.data.pages;
              this.customers.data = this.customers.data.concat(res.data.data);
            });
        }
      }
    },
    getUsers(role) {
      api.users(this.branch_id, 0, [role], 0, 25).then((res) => {
        this.users = res.data;
      });
    },
    scrollUsers(event, role) {
      const element = event.target;
      if (element.scrollTop + element.clientHeight >= element.scrollHeight) {
        if (this.users.current_page < this.users.pages) {
          api
            .users(this.branch_id, 0, [role], this.users.current_page + 1, 25)
            .then((res) => {
              this.users.current_page = res.data.current_page;
              this.users.pages = res.data.pages;
              this.users.data = this.users.data.concat(res.data.data);
            });
        }
      }
    },
    check(id) {
      if (this.role == "warehouseman") this.warehousemanPreOrder(id);
      else if (this.role == "worker" || this.role == "ustanovshik")
        this.deliveredPreOrder(id);
    },
    warehousemanPreOrder(id) {
      api.warehousemanPreOrder(id).then(() => {
        api.success().then(() => {
          this.getOrders(0, 25);
        });
      });
    },
    logistikaPreOrder(id) {
      api.logistikaPreOrder(id).then(() => {
        api.success().then(() => {
          this.getOrders(0, 25);
        });
      });
    },
    deliveredPreOrder(id) {
      api.deliveredPreOrder(id).then(() => {
        api.success().then(() => {
          this.getOrders(0, 25);
        });
      });
    },
    updatePreOrderLogistika() {
      this.update_pre_order_logistika.worker_id = this.worker.id;
      this.update_pre_order_logistika.ustanovshik_id =
        this.ustanovshik?.id || 0;
      api.logistikaPreOrder(this.update_pre_order_logistika).then(() => {
        api.success("close-update-pre-order-modal").then(() => {
          this.worker = null;
          this.ustanovshik = null;
          this.getOrders(0, 25);
        });
      });
    },
    putOperator(id) {
      api.operatorOrder(id, "pre_order").then(() => {
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
  width: 100%;
  margin: 0 0 5px 0;
}

i,
strong {
  padding: 0 5px;
}

.flex {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
