<template>
  <div class="table-responsive">
    <table class="table table-sm table-hover">
      <thead>
        <tr>
          <th>Shtrixkod</th>
          <th>Kodi</th>
          <th>Artikul</th>
          <th>Nomi</th>
          <th>Miqdor</th>
          <th>Narx</th>
          <th>Oxirgi narx</th>
          <th>Sotuv narx</th>
          <th>Vetrina narx</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in products.data" :key="item">
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
          <td>{{ item.Products.quantity }} dona</td>
          <td>
            {{ Intl.NumberFormat().format(item.Products.price) }}
            {{ item.Products.currency_savdo?.currency || "" }}
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
          </td>
          <td>
            <div class="btn-group btn-group-sm">
              <button
                class="btn btn-outline-warning"
                data-toggle="modal"
                data-target="#editProduct"
                @click="
                  editProduct = item;
                  editProduct.Products.oxirgi_narx = countCurrency(
                    item,
                    item.Products.oxirgi_narx
                  );
                  editProduct.Products.sotuv_narx = countCurrency(
                    item,
                    item.Products.sotuv_narx
                  );
                  editProduct.Products.vitrina_narx = countCurrency(
                    item,
                    item.Products.vitrina_narx
                  );
                "
              >
                <i class="far fa-edit" />
              </button>
              <button
                class="btn btn-outline-success"
                data-toggle="modal"
                data-target="#addImage"
                @click="
                  product = item;
                  getPhoto(product);
                "
              >
                <i class="fa fa-image" />
              </button>
              <button
                class="btn btn-outline-primary"
                data-toggle="modal"
                data-target="#price_tag"
                @click="createBarcode(item)"
              >
                <i class="fa fa-barcode" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="9">
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
  name: "BranchTransfer",
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
      api.categories(0, page, limit, this.search).then((res) => {
        this.products = res.data;
      });
    },
  },
};
</script>
