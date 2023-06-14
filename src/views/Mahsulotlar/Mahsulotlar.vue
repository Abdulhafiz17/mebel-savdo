<template>
  <h3><span class="fa fa-box" /> Mahsulotlar</h3>
  <div class="row text-left" v-if="role == 'admin'">
    <div class="col-md-6">
      Umumiy ombor mahsulotlari:
      <span
        v-for="(item, index) in products.warehouse_products_total_price"
        :key="item"
      >
        <strong>{{ $util.currency(item.total_tan_narx) }}</strong>
        {{
          item.tan_narx_currency +
          (index < products.warehouse_products_total_price.length - 1
            ? ", "
            : "")
        }}
      </span>
    </div>
    <div class="col-md-6">
      Umumiy mahsulotlar:
      <span v-for="(item, index) in products.products_total_price" :key="item">
        <strong>{{ $util.currency(item.total_price) }}</strong>
        {{
          item.currency +
          (index < products.products_total_price.length - 1 ? ", " : "")
        }}
      </span>
    </div>
  </div>
  <div class="row">
    <div class="col-2" v-for="(item, i) in search" :key="item">
      <div class="input-group input-group-sm">
        <input
          type="search"
          class="form-control"
          placeholder="qidiruv"
          v-model="item.search"
          @keyup="get(0, 25, 0, 25)"
        />
        <div class="input-group-text">
          <i class="fa fa-search"></i>
        </div>
        <div class="input-group-append">
          <button
            class="btn btn-outline-secondary"
            @click="search.push({ search: '' })"
          >
            <i class="fa fa-plus"></i>
          </button>
        </div>
        <div class="input-group-append" v-if="search.length > 1">
          <button
            class="btn btn-outline-danger"
            @click="
              search.splice(i, 1);
              get(0, 25, 0, 25);
            "
          >
            <i class="fa fa-xmark"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
  <hr />

  <div class="row">
    <div :class="role == 'admin' ? 'col-md-6' : 'col-md-12'">
      <div class="table-responsive" style="max-height: 74vh">
        <table class="table table-sm table-hover">
          <thead>
            <tr>
              <th>Kategoriya</th>
              <th>Kodi</th>
              <th>Artikul</th>
              <th>Nomi</th>
              <th>Narx</th>
              <th>Miqdor</th>
              <th>Ombor</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in products.data_w" :key="item">
              <td>
                {{ item.Categories.name }}
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
              <td>
                {{
                  $util.currency(item.Warehouse_products.price) +
                  " " +
                  item.currency
                }}
              </td>
              <td>{{ item.Warehouse_products.quantity + " dona" }}</td>
              <td>{{ item.Warehouses.name }}</td>
              <td>
                <button
                  v-if="role == 'branch_admin'"
                  class="btn btn-sm btn-outline-success"
                  @click="$refs.mahsulotModal.start(item)"
                >
                  <i class="fa fa-receipt"></i>
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="8">
                <Pagination
                  :page="products.current_page_w"
                  :pages="products.pages_w"
                  :limit="products.limit_w"
                  @get="getWarehouseProducts"
                />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
    <div class="col-md-6" v-if="role == 'admin'">
      <div class="table-responsive" style="max-height: 74vh">
        <table class="table table-sm table-hover">
          <thead>
            <tr>
              <th>Kategoriya</th>
              <th>Kodi</th>
              <th>Artikul</th>
              <th>Nomi</th>
              <th>Narx</th>
              <th>Miqdor</th>
              <th>Filial</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in products.data_p" :key="item">
              <td>
                {{ item.Categories.name }}
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
              <td>
                {{ $util.currency(item.Products.price) + " " + item.currency }}
              </td>
              <td>{{ item.sum_quantity + " dona" }}</td>
              <td>{{ item.Branches.name }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="7">
                <Pagination
                  :page="products.current_page_p"
                  :pages="products.pages_p"
                  :limit="products.limit_p"
                  @get="getBranchProducts"
                />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>

  <mahsulotModal ref="mahsulotModal" />
</template>

<script>
import * as api from "@/components/Api/Api.js";
import Pagination from "@/components/Pagination/Pagination.vue";
import mahsulotModal from "./mahsulotModal.vue";
export default {
  name: "Mahsulotlar",
  components: { Pagination, mahsulotModal },
  data() {
    return {
      role: localStorage["role"],
      search: [{ search: "" }],
      products: {
        current_page_w: 0,
        current_page_p: 0,
        pages_w: 1,
        pages_p: 1,
        limit_w: 25,
        limit_p: 25,
        data_w: [],
        data_p: [],
        warehouse_products_total_price: [],
        products_total_price: [],
      },
    };
  },
  created() {
    this.get();
  },
  methods: {
    getWarehouseProducts(page = 0, limit = 25) {
      this.get(
        page,
        limit,
        this.products.current_page_p,
        this.products.limit_p
      );
    },
    getBranchProducts(page = 0, limit = 25) {
      this.get(
        this.products.current_page_w,
        this.products.limit_w,
        page,
        limit
      );
    },
    get(page_w = 0, limit_w = 25, page_p = 0, limit_p = 25) {
      api
        .allProducts(this.search, page_w, limit_w, page_p, limit_p)
        .then((res) => {
          this.products = res.data;
        });
    },
  },
};
</script>
