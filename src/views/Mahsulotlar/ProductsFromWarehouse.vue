<template>
  <h3><span class="fa fa-box" /> Mahsulotlar</h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4"></div>
  </div>
  <hr />

  <div class="table-responsve" style="max-height: 82vh">
    <table class="table table-sm table-hover">
      <thead>
        <tr>
          <th v-if="role !== 'branch_admin'">Filial</th>
          <th>Kategoriya</th>
          <th>Kodi</th>
          <th>Artikul</th>
          <th>Nomi</th>
          <th>Miqdor</th>
          <th>Sana</th>
          <th>Zarur sana</th>
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
        <tr v-for="item in products.data" :key="item">
          <td v-if="role !== 'branch_admin'">{{ item.branch }}</td>
          <td>
            {{ item.category }}
          </td>
          <td>
            {{ item.Orders_from_branch.name2 }}
          </td>
          <td>
            {{ item.Orders_from_branch.articul }}
          </td>
          <td>
            {{ item.Orders_from_branch.name }}
          </td>
          <td>{{ item.Orders_from_branch.quantity + " dona" }}</td>
          <td>
            {{
              item.Orders_from_branch.time.replace("T", " ").substring(0, 16)
            }}
          </td>
          <td>
            {{ item.Orders_from_branch.date }}
          </td>
          <td></td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="10">
            <Pagination
              :page="products.current_page"
              :pages="products.pages"
              :limit="products.limit"
              @get="getProducts"
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
                <option value="warehouseman">Kutilyapti</option>
                <option value="done">Yakunlandi</option>
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
            @click="getProducts()"
          >
            <i class="far fa-circle-check"></i>
          </button>
          <button
            class="btn btn-outline-danger"
            data-dismiss="modal"
            @click="
              filter = {
                branch_id: 0,
                status: 'warehouseman',
                warehouse_id: 0,
                from_time: '',
                to_time: '',
              };
              getProducts();
            "
          >
            <i class="fa fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from "@/components/Api/Api";
import Pagination from "@/components/Pagination/Pagination.vue";
export default {
  name: "ProductsFromWarehouse",
  components: { Pagination },
  data() {
    return {
      role: localStorage["role"],
      branch_id: localStorage["branch_id"],
      warehouse_id: this.$route.query.warehouse_id,
      branches: [],
      warehouses: [],
      filter: {
        branch_id: 0,
        status: "warehouseman",
        warehouse_id: 0,
        from_time: "",
        to_time: "",
      },
      products: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
    };
  },
  created() {
    if (this.role == "branch_admin") {
      this.getWarehouses();
    } else if (this.role == "warehouseman") {
      this.getBranches();
    } else if (this.role == "admin") {
      this.getWarehouses();
      this.getBranches();
    }
    this.getProducts();
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
    getProducts(page = 0, limit = 25) {
      const branch_id =
        this.role == "branch_admin" ? this.branch_id : this.filter.branch_id;
      const warehouse_id =
        this.role == "branch_admin" ? 0 : this.filter.warehouse_id;
      api
        .ordersFromBranch(
          "",
          branch_id,
          this.filter.status,
          warehouse_id,
          this.filter.from_time,
          this.filter.to_time,
          0,
          page,
          limit
        )
        .then((res) => {
          this.products = res.data;
        });
    },
  },
};
</script>
