<template>
  <h3><span class="fa fa-box" /> Yetishmayotgan mahsulotlar</h3>
  <div class="row">
    <div class="col-md-4">
      <div class="input-group input-group-sm">
        <input
          type="search"
          class="form-control"
          placeholder="qidiruv"
          v-model="search"
          @input="
            getProducts(0, 25);
            getProducts2(0, 25);
          "
        />
        <div class="input-group-text">
          <i class="fa fa-search"></i>
        </div>
      </div>
    </div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4"></div>
  </div>
  <hr />

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
      >
        Yetishmayotgan mahsulotlar
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
      >
        Buyurtmadan yetishmayotgan mahsulotlar
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
      <div class="table-responsive" style="max-height: 72vh">
        <table class="table table-sm table-hover">
          <thead>
            <tr>
              <th>Kategoriya</th>
              <th>Kodi</th>
              <th>Artikul</th>
              <th>Nomi</th>
              <th>Minimal miqdor</th>
              <th>Miqdor</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in products.data" :key="item">
              <td>{{ item.Warehouse_products.category.name }}</td>
              <td>{{ item.Warehouse_products.name2 }}</td>
              <td>{{ item.Warehouse_products.articul }}</td>
              <td>{{ item.Warehouse_products.name }}</td>
              <td>{{ item.Warehouse_products.warning_quantity + " dona" }}</td>
              <td>{{ item.sum_quantity + " dona" }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="6">
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
    </div>
    <div
      class="tab-pane fade"
      id="true"
      role="tabpanel"
      aria-labelledby="true-tab"
    >
      <div class="table-responsive" style="max-height: 72vh">
        <table class="table table-sm table-hover">
          <thead>
            <tr>
              <th>Kategoriya</th>
              <th>Kodi</th>
              <th>Artikul</th>
              <th>Nomi</th>
              <th>Buyurtma id</th>
              <th>Yetishmayotgan miqdor</th>
              <th>Miqdor</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in products2" :key="item">
              <td>
                {{
                  item.warehouse_product_data.Warehouse_products.category.name
                }}
              </td>
              <td>
                {{ item.warehouse_product_data.Warehouse_products.name2 }}
              </td>
              <td>
                {{ item.warehouse_product_data.Warehouse_products.articul }}
              </td>
              <td>{{ item.warehouse_product_data.Warehouse_products.name }}</td>
              <td>{{ item.pre_order_id }}</td>
              <td>
                {{ item.trade_quantity + " dona" }}
              </td>
              <td>{{ item.warehouse_product_data.sum_quantity + " dona" }}</td>
            </tr>
          </tbody>
          <!-- <tfoot>
            <tr>
              <td colspan="6">
                <Pagination
                  :page="products2.current_page"
                  :pages="products2.pages"
                  :limit="products2.limit"
                  @get="getProducts2"
                />
              </td>
            </tr>
          </tfoot> -->
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from "@/components/Api/Api";
import Pagination from "@/components/Pagination/Pagination.vue";
export default {
  name: "YetishmayotganMahsulotlar",
  components: { Pagination },
  data() {
    return {
      search: "",
      products: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
      products2: [],
      // {
      //   current_page: 0,
      //   pages: 1,
      //   limit: 25,
      //   data: [],
      // },
    };
  },
  created() {
    this.getProducts(0, 25);
    this.getProducts2(0, 25);
  },
  methods: {
    getProducts(page, limit) {
      api.warningWarehouseProducts(this.search, page, limit).then((res) => {
        this.products = res.data;
      });
    },
    getProducts2(page, limit) {
      api
        .warningOrderWarehouseProducts(this.search, page, limit)
        .then((res) => {
          this.products2 = res.data;
        });
    },
  },
};
</script>
