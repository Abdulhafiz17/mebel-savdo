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
          @input="getProducts(0, 25)"
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

  <div class="table-responsive" style="max-height: 80vh">
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
          <td>{{ item.category.name }}</td>
          <td>{{ item.name2 }}</td>
          <td>{{ item.articul }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.warning_quantity + " dona" }}</td>
          <td>{{ item.quantity + " dona" }}</td>
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
    };
  },
  created() {
    this.getProducts(0, 25);
  },
  methods: {
    getProducts(page, limit) {
      api.warningWarehouseProducts(this.search, page, limit).then((res) => {
        this.products = res.data;
      });
    },
  },
};
</script>
