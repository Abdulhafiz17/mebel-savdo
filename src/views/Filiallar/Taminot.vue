<template>
  <ul class="nav nav-pills nav-justified mb-3" id="pills-tab" role="tablist">
    <li class="nav-item" role="presentation">
      <button
        class="nav-link active"
        id="false-tab"
        data-bs-toggle="pill"
        data-bs-target="#false"
        type="button"
        role="tab"
        aria-controls="false"
        aria-selected="true"
        @click="
          warehouse_id = 0;
          getTransfersWaiting(0, 25);
        "
      >
        Kutilayotgan
      </button>
    </li>
    <li class="nav-item" role="presentation">
      <button
        class="nav-link"
        id="true-tab"
        data-bs-toggle="pill"
        data-bs-target="#true"
        type="button"
        role="tab"
        aria-controls="true"
        aria-selected="false"
        @click="
          warehouse_id = 0;
          getTransfersClosed(0, 25);
        "
      >
        Yakunlangan
      </button>
    </li>
  </ul>
  <div class="tab-content" id="pills-tabContent">
    <div
      class="tab-pane fade show active"
      id="false"
      role="tabpanel"
      aria-labelledby="false-tab"
    >
      <div class="row my-1">
        <div class="col-md-3 mb-1">
          <select class="form-select form-select-sm" v-model="warehouse_id">
            <option value="0">Barcha omborlar</option>
            <option v-for="item in warehouses" :key="item" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </div>
        <div class="col-md-4 mb-1">
          <input
            type="date"
            class="form-control form-control-sm"
            v-model="from_date"
          />
        </div>
        <div class="col-md-4 mb-1">
          <input
            type="date"
            class="form-control form-control-sm"
            v-model="to_date"
          />
        </div>
        <div class="col-md-1 mb-1">
          <button
            class="btn btn-sm btn-block btn-outline-secondary"
            @click="getTransfersWaiting(0, 25)"
          >
            <i class="far fa-circle-check" />
          </button>
        </div>
      </div>
      <div class="table-responsive">
        <table class="table table-sm table-hover">
          <thead>
            <tr>
              <th>Kategoriya</th>
              <th>Nomi</th>
              <th>Soni</th>
              <th>Narx</th>
              <th>Ombor</th>
              <th>Sana</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in transfers_waiting" :key="item">
              <td>{{ item.Warehouse_products.category.name }}</td>
              <td>{{ item.Warehouse_products.articul }}</td>
              <td>{{ item.Transfers.quantity + " dona" }}</td>
              <td>
                {{
                  Intl.NumberFormat().format(item.Transfers.transfer_price) +
                  " " +
                  item.Warehouse_products.currency.currency
                }}
              </td>
              <td>
                {{ item.name ? item.name : "" }}
              </td>
              <td>
                {{
                  item.Transfers.time
                    .replace("T", " ")
                    .substring(0, item.Transfers.time.length - 3)
                }}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="6">
                <Pagination
                  :page="page"
                  :pages="pages"
                  :limit="limit"
                  @get="getTransfersWaiting"
                />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
    <div
      class="tab-pane fade"
      id="true"
      role="tabpanel"
      aria-labelledby="true-tab"
    >
      <div class="row my-1">
        <div class="col-md-3 mb-1">
          <select class="form-select form-select-sm" v-model="warehouse_id">
            <option value="0">Barcha omborlar</option>
            <option v-for="item in warehouses" :key="item" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </div>
        <div class="col-md-4 mb-1">
          <input
            type="date"
            class="form-control form-control-sm"
            v-model="from_date_2"
          />
        </div>
        <div class="col-md-4 mb-1">
          <input
            type="date"
            class="form-control form-control-sm"
            v-model="to_date_2"
          />
        </div>
        <div class="col-md-1 mb-1">
          <button
            class="btn btn-sm btn-block btn-outline-secondary"
            @click="getTransfersClosed(0, 25)"
          >
            <i class="far fa-circle-check" />
          </button>
        </div>
      </div>
      <div class="table-responsive">
        <table class="table table-sm table-hover">
          <thead>
            <tr>
              <th>Kategoriya</th>
              <th>Nomi</th>
              <th>Soni</th>
              <th>Narx</th>
              <th>Ombor</th>
              <th>Sana</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in transfers_closed" :key="item">
              <td>{{ item.Warehouse_products.category.name }}</td>
              <td>{{ item.Warehouse_products.articul }}</td>
              <td>{{ item.Transfers.quantity + " dona" }}</td>
              <td>
                {{
                  Intl.NumberFormat().format(item.Transfers.transfer_price) +
                  " " +
                  item.Warehouse_products.currency.currency
                }}
              </td>
              <td>
                {{ item.name ? item.name : "" }}
              </td>
              <td>
                {{
                  item.Transfers.time
                    .replace("T", " ")
                    .substring(0, item.Transfers.time.length - 3)
                }}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="6">
                <Pagination
                  :page="page1"
                  :pages="pages1"
                  :limit="limit1"
                  @get="getTransfersClosed"
                />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from "@/components/Api/Api";
import Pagination from "@/components/Pagination/Pagination.vue";
export default {
  name: "Taminot",
  components: { Pagination },
  data() {
    return {
      page: 0,
      pages: 1,
      limit: 25,
      page1: 0,
      pages1: 1,
      limit1: 25,
      from_date: "",
      to_date: "",
      from_date_2: "",
      to_date_2: "",
      warehouse_id: 0,
      warehouses: [],
      transfers_waiting: [],
      transfers_closed: [],
    };
  },
  created() {
    this.getWarehouses();
  },
  methods: {
    getWarehouses() {
      api.warehouses().then((Response) => {
        this.warehouses = Response.data;
        this.getTransfersWaiting(0, 25);
      });
    },
    getTransfersWaiting(page, limit) {
      api
        .transfers(
          this.warehouse_id,
          "kutish",
          page,
          limit,
          this.$route.params.id,
          this.from_date,
          this.to_date
        )
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.limit = Response.data.limit;
          this.transfers_waiting = Response.data.data;
        });
    },
    getTransfersClosed(page, limit) {
      api
        .transfers(
          this.warehouse_id,
          "tasdiqlandi",
          page,
          limit,
          this.$route.params.id,
          this.from_date_2,
          this.to_date_2
        )
        .then((Response) => {
          this.page1 = Response.data.current_page;
          this.pages1 = Response.data.pages;
          this.limit1 = Response.data.limit;
          this.transfers_closed = Response.data.data;
        });
    },
  },
};
</script>

<style scoped>
.input-group {
  justify-content: center;
}
.table-responsive {
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 60vh;
}
</style>
