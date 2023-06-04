<template>
  <h3 v-if="!parent_user_id">
    <span class="fa px-1 fa-arrow-up" /><span class="fa px-1 fa-arrow-down" />
    Transfer {{ branch ? `Filial ${branch.name}` : `` }}
  </h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4">
      <button
        v-if="role == 'worker'"
        class="btn btn-sm btn-block btn-outline-success"
        :disabled="!transfers_to_send.length"
        @click="acceptTransfers()"
      >
        Tasdiqlash
      </button>
      <button
        v-if="role == 'logistika'"
        class="btn btn-sm btn-block btn-outline-success"
        data-toggle="modal"
        data-target="#send-transfer"
        :disabled="!transfers_to_send.length"
      >
        Hodim biriktirish
      </button>
    </div>
  </div>
  <hr v-if="!parent_user_id" />
  <div
    class="table-responsive"
    :style="{ height: parent_user_id ? '75vh' : '80vh' }"
  >
    <table class="table table-sm table-hover">
      <thead>
        <tr>
          <th>
            <input
              v-if="['worker', 'logistika'].includes(role)"
              type="checkbox"
              :checked="
                transfers.data.length &&
                transfers.data.length == transfers_to_send.length
              "
              :disabled="filter.status !== 'filialga_berish_logistika'"
              @change="
                $event.target.checked
                  ? (transfers_to_send = transfers.data)
                  : (transfers_to_send = [])
              "
            />
          </th>
          <th>Kategoriya</th>
          <th>Kodi</th>
          <th>Artikul</th>
          <th>Nomi</th>
          <th>Soni</th>
          <th>Ombor</th>
          <th>Filial</th>
          <th>Status</th>
          <th>Sana</th>
          <th v-if="show_price">Narx</th>
          <th>
            <button
              class="btn btn-sm btn-outline-info"
              data-toggle="modal"
              data-target="#filter"
            >
              <i class="fa fa-filter"></i>
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in transfers.data" :key="item">
          <td>
            <input
              v-if="['worker', 'logistika'].includes(role)"
              type="checkbox"
              :value="item"
              :disabled="filter.status !== 'filialga_berish_logistika'"
              v-model="transfers_to_send"
            />
          </td>
          <td>
            {{ item.Warehouse_products.category.name }}
          </td>
          <td>
            {{ item.Warehouse_products.name2 }}
          </td>
          <td>
            {{ item.Warehouse_products.articul }}
          </td>
          <td>
            {{ item.Warehouse_products.name }}
          </td>
          <td>{{ item.Transfers.quantity }} dona</td>
          <td>{{ item.name }}</td>
          <td>{{ item.branch }}</td>
          <td>{{ status(item.Transfers.status) }}</td>
          <td>
            {{ item.Transfers.time.replace("T", " ").substring(0, 10) }}
          </td>
          <td v-if="show_price">
            {{
              _.format(item.Transfers.transfer_price) +
              " " +
              item.Currencies.currency
            }}
          </td>
          <td>
            <button
              v-if="
                ['worker', 'ustanovshik', 'warehouseman'].includes(role) &&
                !transfers_to_send.length
              "
              class="btn btn-sm btn-outline-success"
              @click="
                transfers_to_send.push(item);
                role == 'worker' || role == 'ustanovshik'
                  ? acceptTransfers()
                  : role == 'warehouseman'
                  ? transferProductWarehouseman()
                  : false;
              "
            >
              <i class="far fa-circle-check"></i>
            </button>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="15">
            <Pagination
              :page="transfers.current_page"
              :pages="transfers.pages"
              :limit="transfers.limit"
              @get="getTransfers"
            />
          </td>
        </tr>
      </tfoot>
    </table>
  </div>

  <div class="modal fade" id="filter">
    <div class="modal-dialog modal-sm">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Filter</h4>
        </div>
        <div class="modal-body">
          <div class="row gap-1 text-left">
            <div class="col-12" v-if="role !== 'branch_admin' && !branch_id">
              Filial
              <select class="form-select" v-model="filter.branch_id">
                <option v-for="item in branches" :key="item" :value="item.id">
                  {{ item.name }}
                </option>
              </select>
            </div>
            <div class="col-12" v-if="role !== 'warehouseman'">
              Ombor
              <select class="form-select" v-model="filter.warehouse_id">
                <option v-for="item in warehouses" :key="item" :value="item.id">
                  {{ item.name }}
                </option>
              </select>
            </div>
            <div class="col-12">
              Status
              <select class="form-select" v-model="filter.status">
                <option
                  value="filialga_berish_warehouseman"
                  v-if="['admin', 'warehouseman'].includes(role)"
                >
                  Kutish ombor
                </option>
                <option
                  value="filialga_berish_logistika"
                  v-if="['admin', 'logistika', 'warehouseman'].includes(role)"
                >
                  Kutish logistika
                </option>
                <option
                  value="filialga_berish_logistika_user"
                  v-if="
                    [
                      'admin',
                      'logistika',
                      'warehouseman',
                      'worker',
                      'ustanovshik',
                    ].includes(role)
                  "
                >
                  Logistika hodim biriktirilgan
                </option>
                <option
                  value="filialga_berish_kutish"
                  v-if="
                    [
                      'admin',
                      'branch_admin',
                      'logistika',
                      'warehouseman',
                      'worker',
                      'ustanovshik',
                    ].includes(role)
                  "
                >
                  Kutish filial
                </option>
                <option
                  value="filialga_berish_tasdiqlandi"
                  v-if="
                    [
                      'admin',
                      'branch_admin',
                      'logistika',
                      'warehouseman',
                      'worker',
                      'ustanovshik',
                    ].includes(role)
                  "
                >
                  Tasdiqlandi
                </option>
              </select>
            </div>
            <div class="col-12" v-if="['admin', 'logistika'].includes(role)">
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
            <div class="col-12" v-if="['admin', 'logistika'].includes(role)">
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
                v-model="filter.from_time"
              />
            </div>
            <div class="col-12">
              Gacha
              <input
                type="date"
                class="form-control"
                v-model="filter.to_time"
              />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            class="btn btn-outline-primary"
            data-dismiss="modal"
            @click="getTransfers(0, 25)"
          >
            <i class="far fa-circle-check"></i>
          </button>
          <button
            class="btn btn-outline-danger"
            data-dismiss="modal"
            @click="
              filter = {
                warehouse_id: 0,
                status: 'filialga_berish_logistika',
                branch_id: 0,
                from_time: '',
                to_time: '',
                worker_id: 0,
                ustanovshik_id: 0,
                gruzchik: null,
              };
              getTransfers(0, 25);
            "
          >
            <i class="fa fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="send-transfer">
    <div class="modal-dialog">
      <form class="modal-content" @submit.prevent="transferProducts()">
        <div class="modal-header">
          <h4>Hodim birikirish</h4>
        </div>
        <div class="modal-body">
          <div class="row gap-1 text-left">
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
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-primary" :disabled="!worker">
            <i class="far fa-circle-check"></i>
          </button>
          <button
            class="btn btn-outline-danger"
            data-dismiss="modal"
            close-transfer-modal
          >
            <i class="far fa-circle-xmark"></i>
          </button>
        </div>
      </form>
    </div>
  </div>

  <transferReceipt ref="receipt" />
</template>

<script>
import * as api from "@/components/Api/Api";
import Pagination from "@/components/Pagination/Pagination.vue";
import transferReceipt from "@/components/receipt/transfer.vue";
import swal from "sweetalert";
export default {
  name: "Transfer",
  props: {
    userId: Number,
    parentRole: String,
  },
  components: { Pagination, transferReceipt },
  data() {
    return {
      role: localStorage["role"],
      user_id: localStorage["user_id"],
      branch_id: this.$route.query.branch_id || 0,
      _: Intl.NumberFormat(),
      branch: null,
      warehouses: [],
      branches: [],
      filter: {
        warehouse_id: 0,
        status: "filialga_berish_logistika",
        branch_id: 0,
        from_time: "",
        to_time: "",
        worker: null,
        ustanovshik: null,
        gruzchik: null,
      },
      transfers: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
      users: [],
      worker: null,
      ustanovshik: null,
      gruzchik: null,
      transfers_to_send: [],
    };
  },
  computed: {
    parent_user_id() {
      return this.$props.userId;
    },
    parent_role() {
      return this.$props.parentRole;
    },
    show_price() {
      if (
        [
          "logistika",
          "worker",
          "ustanovshik",
          "gruzchik",
          "warehouseman",
        ].includes(this.role)
      )
        return false;
      else return true;
    },
  },
  created() {
    if (this.branch_id) this.getBranch();
    if (this.role == "warehouseman")
      this.filter.status = "filialga_berish_warehouseman";
    if (["admin", "logistika"].includes(this.role)) {
      this.filter.status = "filialga_berish_logistika";
      this.getUsers();
    } else if (["worker", "ustnaovshik"].includes(this.role)) {
      this.filter.status = "filialga_berish_logistika_user";
    }
    if (this.role == "branch_admin") {
      this.getWarehouses();
    } else if (this.role == "warehouseman") {
      this.getBranches();
    } else {
      this.getWarehouses();
      this.getBranches();
    }
    this.getTransfers(0, 25);
  },
  methods: {
    status(status) {
      if (status == "filialga_berish_warehouseman") return "Omborchi";
      else if (status == "filialga_berish_logistika") return "Logistika";
      else if (status == "filialga_berish_kutish") return "Filial kutish";
      else if (status == "filialga_berish_tasdiqlandi") return "Tasdiqlandi";
      else return "";
    },
    getBranch() {
      api.branch(this.branch_id).then((res) => {
        this.branch = res.data.branch;
      });
    },
    getWarehouses() {
      api.warehouses().then((res) => {
        this.warehouses = res.data;
      });
    },
    getBranches() {
      api.branches().then((res) => {
        this.branches = res.data.branch;
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
    getTransfers(page, limit) {
      let status = this.filter.status;
      let warehouse_id = this.filter.warehouse_id;
      let worker_id =
        this.role == "worker"
          ? this.user_id
          : this.role == "ustanovshik"
          ? 1
          : this.filter.worker?.id || 1;
      let ustanovshik_id =
        this.role == "ustanovshik"
          ? this.user_id
          : this.role == "worker"
          ? 1
          : this.filter.ustanovshik?.id || 1;
      let gruzchik_id = this.filter.gruzchik?.id || 0;
      if (this.filter.status == "filialga_berish_logistika_user")
        status = "filialga_berish_logistika";
      if (
        ["filialga_berish_warehouseman", "filialga_berish_logistika"].includes(
          this.filter.status
        )
      ) {
        worker_id = 0;
        ustanovshik_id = 0;
        if (this.role == "worker") worker_id = this.user_id;
        if (this.role == "ustanovshik") ustanovshik_id = this.user_id;
      } else {
        worker_id = 1;
        ustanovshik_id = 1;
        if (this.role == "worker") worker_id = this.user_id;
        if (this.role == "ustanovshik") ustanovshik_id = this.user_id;
      }
      if (this.role == "warehouseman") warehouse_id = localStorage["branch_id"];
      if (this.parent_role == "worker") worker_id = this.parent_user_id;
      else if (this.parent_role == "ustanovshik")
        ustanovshik_id = this.parent_user_id;
      api
        .transfers(
          warehouse_id,
          status,
          page,
          limit,
          this.filter.branch_id || this.branch_id,
          this.filter.from_time,
          this.filter.to_time,
          worker_id,
          ustanovshik_id,
          gruzchik_id
        )
        .then((Response) => {
          this.transfers = Response.data;
        });
    },
    transferProducts() {
      let data = [];
      this.transfers_to_send.forEach((item, index) => {
        data.push({
          transfer_id: item.Transfers.id,
          worker_id: this.worker.id,
          ustanovshik_id: this.ustanovshik?.id || 0,
          gruzchik_id: this.gruzchik?.id || 0,
        });
        if (index == this.transfers_to_send.length - 1) {
          api.transferProductLogistika(data).then(() => {
            api.success("close-transfer-modal").then(() => {
              this.transfers = {
                current_page: 0,
                pages: 1,
                limit: 25,
                data: [],
              };
              swal({
                icon: "info",
                title: "Transfer cheki chiqarilsinmi ?",
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
                  this.$refs.receipt.transfers = this.transfers_to_send;
                  this.$refs.receipt.worker = this.worker;
                  this.$refs.receipt.ustanovshik = this.ustanovshik;
                  this.$refs.receipt.gruzchik = this.gruzchik;
                  this.$refs.receipt.start();
                }
                this.worker = null;
                this.ustanovshik = null;
                this.gruzchik = null;
                this.transfers_to_send = [];
                this.getTransfers(0, 25);
              });
            });
          });
        }
      });
    },
    acceptTransfers() {
      let data = [];
      this.transfers_to_send.forEach((item, index) => {
        data.push({
          transfer_id: item.Transfers.id,
        });
        if (index == this.transfers_to_send.length - 1) {
          api.acceptTransferLogistika(data).then(() => {
            api.success().then(() => {
              this.transfers = {
                current_page: 0,
                pages: 1,
                limit: 25,
                data: [],
              };
              this.transfers_to_send = [];
              this.getTransfers(0, 25);
            });
          });
        }
      });
    },
    transferProductWarehouseman() {
      let data = [];
      this.transfers_to_send.forEach((item, index) => {
        data.push({
          transfer_id: item.Transfers.id,
        });
        if (index == this.transfers_to_send.length - 1) {
          api.transferProductWarehouseman(data).then(() => {
            api.success().then(() => {
              this.transfers = {
                current_page: 0,
                pages: 1,
                limit: 25,
                data: [],
              };
              this.transfers_to_send = [];
              this.getTransfers(0, 25);
            });
          });
        }
      });
    },
  },
};
</script>
