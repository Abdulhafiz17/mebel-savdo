<template>
  <h3><span class="fa fa-truck" /> Transfer</h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4"></div>
  </div>
  <hr />
  <div class="table-responsive" style="max-height: 82vh">
    <table class="table table-sm table-hover">
      <thead>
        <tr>
          <th>Shtrixkod</th>
          <th>Kodi</th>
          <th>Artikul</th>
          <th>Nomi</th>
          <th>Miqdor</th>
          <!-- <th>Narx</th>
          <th>Oxirgi narx</th>
          <th>Sotuv narx</th>
          <th>Vetrina narx</th> -->
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
            {{ item.Products.code }}
          </td>
          <td>
            {{ item.Products.name2 }}
          </td>
          <td>
            {{ item.Products.articul }}
          </td>
          <td>
            {{ item.Products.name }}
          </td>
          <td>{{ item.Transfers.quantity }} dona</td>
          <!-- <td>
            {{ Intl.NumberFormat().format(item.Products.price) }}
            {{ item.Currencies ? item.Currencies.currency : "none" }}
          </td>
          <td>
            {{
              Intl.NumberFormat().format(item.Products.oxirgi_narx) +
              " " +
              item.Products.currency_savdo.currency
            }}
          </td>
          <td>
            {{
              Intl.NumberFormat().format(item.Products.sotuv_narx) +
              " " +
              item.Products.currency_savdo.currency
            }}
          </td>
          <td>
            {{
              Intl.NumberFormat().format(item.Products.vitrina_narx) +
              " " +
              item.Products.currency_savdo.currency
            }}
          </td>-->
          <td>
            <div class="btn-group btn-group-sm">
              <button
                v-if="
                  (role == 'logistika' &&
                    item.Transfers.status == 'omborga_berish_logistika_2' &&
                    !item.Transfers.worker_id &&
                    !item.Transfers.ustanovshik_id &&
                    !item.Transfers.gruzchik_id) ||
                  (role == 'ustanovshik' &&
                    item.Transfers.status == 'omborga_berish_logistika_2') ||
                  (role == 'warehouseman' &&
                    item.Transfers.status == 'omborga_berish_warehouseman_2')
                "
                class="btn btn-sm btn-outline-success"
                @click="check(item.Transfers.id)"
              >
                <i class="fa fa-check"></i>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="9">
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
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header"><h5>Filter</h5></div>
        <div class="modal-body">
          <div class="row gap-1 text-left">
            <div class="col-12">
              <div class="row">
                <div class="col-6">
                  Dan
                  <input
                    type="date"
                    class="form-control form-control-sm"
                    v-model="filter.from_time"
                  />
                </div>
                <div class="col-6">
                  Gacha
                  <input
                    type="date"
                    class="form-control form-control-sm"
                    v-model="filter.to_time"
                  />
                </div>
              </div>
            </div>
            <div class="col-12">
              Status
              <select class="form-select" v-model="filter.status">
                <option
                  value="omborga_berish_logistika_2"
                  v-if="['admin', 'branch_admin', 'logistika'].includes(role)"
                >
                  Logistika kutish
                </option>
                <option
                  value="omborga_berish_logistika_user_2"
                  v-if="
                    [
                      'admin',
                      'branch_admin',
                      'logistika',
                      'worker',
                      'ustanovshik',
                      'gruzchik',
                    ].includes(role)
                  "
                >
                  Logistika hodim biriktirilgan
                </option>
                <option
                  value="omborga_berish_warehouseman_2"
                  v-if="
                    [
                      'admin',
                      'branch_admin',
                      'logistika',
                      'worker',
                      'ustanovshik',
                      'gruzchik',
                      'warehouseman',
                    ].includes(role)
                  "
                >
                  Omborchi kutish
                </option>
                <option value="omborga_berish_tasdiqlandi_2">
                  Yakunlangan
                </option>
              </select>
            </div>
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
            <!-- <div class="col-12">
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
            <div class="col-12">
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
            </div> -->
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
                status: default_status,
                branch_id: 0,
                from_time: '',
                to_time: '',
                worker: null,
                ustanovshik: null,
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

  <button
    v-show="false"
    data-toggle="modal"
    data-target="#transfer-product"
  ></button>
  <div class="modal fade" id="transfer-product">
    <div class="modal-dialog">
      <form class="modal-content" @submit.prevent="updateTransferLogistika()">
        <div class="modal-header"><h5>Transferga hodim biriktirish</h5></div>
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
          <button class="btn btn-outline-primary" :disabled="!ustanovshik">
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
</template>

<script>
import * as api from "@/components/Api/Api";
import Pagination from "@/components/Pagination/Pagination.vue";
export default {
  name: "BranchTransfer",
  components: { Pagination },
  data() {
    return {
      role: localStorage["role"],
      branch_id: localStorage["branch_id"],
      user_id: localStorage["user_id"],
      branches: [],
      warehouses: [],
      users: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
      filter: {
        warehouse_id: 0,
        status: "omborga_berish_logistika_2",
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
      worker: null,
      ustanovshik: null,
      gruzchik: null,
      transfer_product_logistika: {
        transfer_id: 0,
        worker_id: 0,
        ustanovshik_id: 0,
        gruzchik_id: 0,
      },
    };
  },
  computed: {
    default_status() {
      if (["worker", "ustanovshik", "gruzchik"].includes(this.role))
        return "omborga_berish_logistika_user_2";
      else if (this.role == "warehouseman")
        return "omborga_berish_warehouseman_2";
      else return "omborga_berish_logistika_2";
    },
  },
  created() {
    this.filter.status = this.default_status;
    if (this.role !== "branch_admin") this.getBranches();
    if (this.role !== "warehouseman") this.getWarehouses();
    this.getTransfers(0, 25);
  },
  methods: {
    getBranches() {
      api.branches().then((res) => {
        this.branches = res.data.branch;
      });
    },
    getWarehouses() {
      api.warehouses().then((res) => {
        this.warehouses = res.data;
      });
    },
    getUsers(role) {
      api.users(this.branch_id, 0, [role], "", 0, 25).then((res) => {
        this.users = res.data;
      });
    },
    scrollUsers(event, role) {
      const element = event.target;
      if (element.scrollTop + element.clientHeight >= element.scrollHeight) {
        if (this.users.current_page < this.users.pages) {
          api
            .users(
              this.branch_id,
              0,
              [role],
              "",
              this.users.current_page + 1,
              25
            )
            .then((res) => {
              this.users.current_page = res.data.current_page;
              this.users.pages = res.data.pages;
              this.users.data = this.users.data.concat(res.data.data);
            });
        }
      }
    },
    getTransfers(page, limit) {
      let warehouse_id = this.role == "warehouseman" ? this.branch_id : 0;
      let branch_id = this.role == "branch_admin" ? this.branch_id : 0;
      let worker_id = this.filter.worker?.id || 0;
      let ustanovshik_id = this.filter.ustanovshik?.id || 0;
      let gruzchik_id = this.filter.gruzchik?.id || 0;
      let status = this.filter.status;
      if (this.filter.status == "omborga_berish_logistika_user_2") {
        status = "omborga_berish_logistika_2";
        if (this.role == "logistika") {
          worker_id = 1;
          ustanovshik_id = 1;
          gruzchik_id = 1;
        } else if (this.role == "worker") {
          worker_id = this.user_id;
          ustanovshik_id = 1;
          gruzchik_id = 1;
        } else if (this.role == "ustanovshik") {
          worker_id = 1;
          ustanovshik_id = this.user_id;
          gruzchik_id = 1;
        } else if (this.role == "gruzchik") {
          worker_id = 1;
          ustanovshik_id = 1;
          gruzchik_id = this.user_id;
        }
      }
      if (this.role == "warehouseman") {
        worker_id = 1;
        ustanovshik_id = 1;
        gruzchik_id = 1;
      }
      api
        .transfersWarehouse2(
          warehouse_id,
          status,
          branch_id,
          this.filter.from_time,
          this.filter.to_time,
          worker_id,
          ustanovshik_id,
          gruzchik_id,
          page,
          limit
        )
        .then((res) => {
          this.transfers = res.data;
        });
    },
    check(id) {
      if (this.role == "logistika") {
        this.transfer_product_logistika.transfer_id = id;
        document.querySelector(`[data-target="#transfer-product"]`).click();
      } else if (this.role == "ustanovshik") {
        this.transferProductUser(id);
      } else if (this.role == "warehouseman") {
        this.transferProductWarehouseman(id);
      }
    },
    updateTransferLogistika() {
      this.transfer_product_logistika.worker_id = this.worker.id;
      this.transfer_product_logistika.ustanovshik_id =
        this.ustanovshik?.id || 0;
      this.transfer_product_logistika.gruzchik_id = this.gruzchik?.id || 0;
      api
        .transferProductLogistika2(Array(this.transfer_product_logistika))
        .then(() => {
          api.success("close-update-pre-order-modal").then(() => {
            this.worker = null;
            this.ustanovshik = null;
            this.gruzchik = null;
            this.transfer_product_logistika = {
              transfer_id: 0,
              worker_id: 0,
              ustanovshik_id: 0,
              gruzchik_id: 0,
            };
            this.getTransfers(0, 25);
          });
        });
    },
    transferProductUser(id) {
      api.acceptanceProductLogistika2(Array({ transfer_id: id })).then(() => {
        api.success().then(() => {
          this.getTransfers(0, 25);
        });
      });
    },
    transferProductWarehouseman(id) {
      api.transferProductWarehouseman2(Array({ transfer_id: id })).then(() => {
        api.success().then(() => {
          this.getTransfers(0, 25);
        });
      });
    },
  },
};
</script>
