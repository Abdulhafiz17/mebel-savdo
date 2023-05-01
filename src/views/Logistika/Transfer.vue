<template>
  <h3>
    <span class="fa px-1 fa-arrow-up" /><span class="fa px-1 fa-arrow-down" />
    Transfer
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
  <hr />
  <div class="table-responsive" style="height: 80vh">
    <table class="table table-sm table-hover">
      <thead>
        <tr>
          <th>
            <input
              v-if="role == 'worker' || role == 'logistika'"
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
          <th>Sana</th>
          <th v-if="role !== 'worker' && role !== 'ustanovshik'">Narx</th>
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
              v-if="role == 'worker' || role == 'logistika'"
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
          <td>
            {{ item.Transfers.time.replace("T", " ").substring(0, 10) }}
          </td>
          <td v-if="role !== 'worker' && role !== 'ustanovshik'">
            {{
              _.format(item.Transfers.transfer_price) +
              " " +
              item.Currencies.currency
            }}
          </td>
          <td>
            <button
              v-if="role == 'worker' && !transfers_to_send.length"
              class="btn btn-sm btn-outline-success"
              @click="
                transfers_to_send.push(item);
                acceptTransfers();
              "
            >
              <i class="far fa-circle-check"></i>
            </button>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="10">
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
            <div class="col-12" v-if="role !== 'branch_admin'">
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
                <option value="filialga_berish_kutish">Kutish</option>
                <option value="filialga_berish_logistika">Logistika</option>
                <option value="filialga_berish_logistika_user">
                  Logistika hodim biriktirilgan
                </option>
                <option value="filialga_berish_tasdiqlandi">Tasdiqlandi</option>
              </select>
            </div>
            <div class="col-12" v-if="['admin', 'logistika'].includes(role)">
              Haydovchi
              <select class="form-select" required v-model="filter.worker_id">
                <option
                  v-for="item in users.filter((item) => item.role == 'worker')"
                  :key="item"
                  :value="item.id"
                >
                  {{ item.name }}
                </option>
              </select>
            </div>
            <div class="col-12" v-if="['admin', 'logistika'].includes(role)">
              Ustanovshik
              <select
                class="form-select"
                required
                v-model="filter.ustanovshik_id"
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
              Haydovchi
              <select class="form-select" required v-model="worker_id">
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
              <select class="form-select" required v-model="ustanovshik_id">
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
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-primary">
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
</template>

<script>
import * as api from "@/components/Api/Api";
import Pagination from "@/components/Pagination/Pagination.vue";
export default {
  name: "Transfer",
  components: { Pagination },
  data() {
    return {
      role: localStorage["role"],
      user_id: localStorage["user_id"],
      _: Intl.NumberFormat(),
      warehouses: [],
      branches: [],
      filter: {
        warehouse_id: 0,
        status: "filialga_berish_logistika",
        branch_id: 0,
        from_time: "",
        to_time: "",
        worker_id: 0,
        ustanovshik_id: 0,
      },
      transfers: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
      users: [],
      worker_id: 0,
      ustanovshik_id: 0,
      transfers_to_send: [],
    };
  },
  created() {
    this.getTransfers(0, 25);
    if (["admin", "logistika"].includes(this.role)) {
      this.getUsers();
    }
    if (this.role == "branch_admin") {
      this.getWarehouses();
    } else if (this.role == "warehouseman") {
      this.getBranches();
    } else {
      this.getWarehouses();
      this.getBranches();
    }
  },
  methods: {
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
    getUsers() {
      api.users(0, 0, ["worker", "ustanovshik"], 0, 100).then((res) => {
        this.users = res.data.data;
      });
    },
    getTransfers(page, limit) {
      let status = "";
      let worker_id =
        this.role == "worker"
          ? this.user_id
          : this.role == "ustanovshik"
          ? 1
          : this.filter.worker_id;
      let ustanovshik_id =
        this.role == "ustanovshik"
          ? this.user_id
          : this.role == "worker"
          ? 1
          : this.filter.ustanovshik_id;
      if (this.filter.status == "filialga_berish_logistika_user") {
        status = "filialga_berish_logistika";
        worker_id = 1;
        ustanovshik_id = 1;
      } else status = this.filter.status;
      api
        .transfers(
          this.filter.warehouse_id,
          status,
          page,
          limit,
          this.filter.branch_id,
          this.from_time,
          this.to_time,
          worker_id,
          ustanovshik_id
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
          worker_id: this.worker_id,
          ustanovshik_id: this.ustanovshik_id,
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
              this.transfers_to_send = [];
              this.getTransfers(0, 25);
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
  },
};
</script>
