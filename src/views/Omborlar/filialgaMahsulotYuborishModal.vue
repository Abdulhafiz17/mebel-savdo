<template>
  <button
    v-show="false"
    data-toggle="modal"
    data-target="#products-to-branch"
  ></button>
  <div class="modal fade" id="products-to-branch">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Filialga mahsulot yuborish</h4>
        </div>
        <div class="modal-body">
          <div class="table-responsive" style="max-height: 70vh; zoom: 85%">
            <table class="table table-sm table-hover">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      :checked="
                        products_to_branch.length &&
                        products_to_branch.length == products.data_w.length
                      "
                      @change="
                        $event.target.checked
                          ? (products_to_branch = products.data_w)
                          : (products_to_branch = [])
                      "
                    />
                  </th>
                  <th>Kategoriya</th>
                  <th>Kodi</th>
                  <th>Artikul</th>
                  <th>Nomi</th>
                  <th>Narx</th>
                  <th>Miqdor</th>
                  <th>Joylashuv</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in products.data_w" :key="item">
                  <form id="post-form" @submit.prevent="postToBranch()" />
                  <td>
                    <input
                      type="checkbox"
                      :value="item"
                      v-model="products_to_branch"
                    />
                  </td>
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
                      $util.currency(item.Warehouse_products.price) + " so'm"
                    }}
                  </td>
                  <td>
                    <div class="input-group input-group-sm">
                      <input
                        class="form-control"
                        type="number"
                        step="any"
                        min="0.1"
                        :max="item.Warehouse_products.quantity"
                        required
                        :placeholder="`max: ${item.Warehouse_products.quantity}`"
                        :form="findProduct(item) ? 'post-form' : ''"
                        v-model="item.quantity"
                      />
                      <div class="input-group-text">dona</div>
                    </div>
                  </td>
                  <td>{{ item.Warehouses.name }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="10">
                    <Pagination
                      :page="products.current_page_w"
                      :pages="products.pages_w"
                      :limit="products.limit_w"
                      @get="getProducts"
                    />
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <button
            class="btn btn-outline-primary"
            :disabled="!products_to_branch.length"
            form="post-form"
          >
            <i class="far fa-circle-check"></i>
          </button>
          <button
            class="btn btn-outline-danger"
            data-dismiss="modal"
            close-products-to-branch
          >
            <i class="far fa-circle-xmark" />
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
  name: "filialgaMahsulotYuborishModal",
  components: { Pagination },
  data() {
    return {
      product: null,
      search: [],
      products: {
        current_page_w: 0,
        pages_w: 1,
        limit_w: 25,
        data_w: [],
      },
      products_to_branch: [],
    };
  },
  computed: {
    toggle_button() {
      return document.querySelector(`[data-target="#products-to-branch"]`);
    },
  },
  methods: {
    start(product) {
      this.product = product;
      this.search = [
        // { search: this.product.category },
        // { search: this.product.Orders_from_branch.articul },
        // { search: this.product.Orders_from_branch.name },
        { search: this.product.Orders_from_branch.name2 },
      ];
      this.products_to_branch = [];
      this.getProducts();
      this.toggle_button.click();
    },
    getProducts(page, limit) {
      api.allProducts(this.search, page, limit, 0, 1).then((res) => {
        this.products = res.data;
        this.products.data_w.forEach((item) => {
          item.quantity = null;
        });
      });
    },
    findProduct(product) {
      const object = this.products_to_branch.find((item) => {
        return item == product;
      });
      if (object) return true;
      else return false;
    },
    postToBranch() {
      if (this.products_to_branch.length) {
        let array = [];
        this.products_to_branch.forEach((item, index) => {
          array.push({
            warehouse_pr_id: item.Warehouse_products.id,
            quantity: item.Warehouse_products.quantity,
            transfer_price: item.Warehouse_products.price,
            to_: this.product.Orders_from_branch.branch_id,
            order_from_branch_id: this.product.Orders_from_branch.id,
            warehouse_id: item.Warehouses.id,
          });
          if (index == this.products_to_branch.length - 1) {
            api.transferProduct(array).then(() => {
              api.success("close-products-to-branch").then(() => {
                this.$parent.getProducts(0, 25);
              });
            });
          }
        });
      }
    },
  },
};
</script>
