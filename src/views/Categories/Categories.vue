<template>
  <h3><span class="fa fa-folder" /> Kategoriyalar</h3>
  <div class="row" v-if="balance">
    <div class="col-md-6 d-flex align-items-center justify-content-center">
      <div class="dropdown">
        <button
          class="btn btn-sm btn-outline-secondary dropdown-toggle"
          type="button"
          data-toggle="dropdown"
        >
          {{ balance.quantity_data[0].total_quantity + " dona mahsulot" }}
        </button>
        <ul class="dropdown-menu">
          <li
            class="dropdown-item"
            v-for="item in balance.articul_data"
            :key="item"
          >
            {{ item.articul + " - " + item.total_quantity_articul + " dona" }}
          </li>
        </ul>
      </div>
    </div>
    <div class="col-md-6 d-flex align-items-center justify-content-center">
      <span>
        Umumiy narx
        <br />
        <span v-for="(item, index) in balance.price_data" :key="item">
          {{
            Intl.NumberFormat().format(item.total_price) +
            " " +
            item.currency +
            (index !== balance.price_data.length - 1 ? ", " : "")
          }}
          <br />
        </span>
      </span>
    </div>
  </div>
  <hr />

  <div class="responsive" style="max-height: 72vh; overflow-x: hidden">
    <div class="row">
      <div class="col-sm-12 my-1">
        <details v-for="item in categories" :key="item">
          <summary
            @click="
              category_for_products = item.Categories;
              !$event.target.parentElement.open ? getProducts(0, 50) : false;
            "
          >
            <h5>{{ item.Categories.name }}</h5>
          </summary>
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
                <tr v-for="item2 in item.Categories.products" :key="item2">
                  <td>
                    {{ item2.Products.code }}
                  </td>
                  <td>
                    {{ item2.Products.name2 }}
                  </td>
                  <td>
                    {{ item2.Products.articul }}
                  </td>
                  <td>
                    {{ item2.Products.name }}
                  </td>
                  <td>{{ item2.sum_quantity }} dona</td>
                  <td>
                    {{ Intl.NumberFormat().format(item2.Products.price) }}
                    {{ item2.Currencies ? item2.Currencies.currency : "none" }}
                  </td>
                  <td>
                    {{
                      Intl.NumberFormat().format(item2.Products.oxirgi_narx) +
                      " " +
                      item2.Products.currency_savdo.currency
                    }}
                  </td>
                  <td>
                    {{
                      Intl.NumberFormat().format(item2.Products.sotuv_narx) +
                      " " +
                      item2.Products.currency_savdo.currency
                    }}
                  </td>
                  <td>
                    {{
                      Intl.NumberFormat().format(item2.Products.vitrina_narx) +
                      " " +
                      item2.Products.currency_savdo.currency
                    }}
                  </td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <button
                        class="btn btn-outline-warning"
                        data-toggle="modal"
                        data-target="#editProduct"
                        @click="
                          editProduct = item2;
                          editProduct.Products.oxirgi_narx = countCurrency(
                            item2,
                            item2.Products.oxirgi_narx
                          );
                          editProduct.Products.sotuv_narx = countCurrency(
                            item2,
                            item2.Products.sotuv_narx
                          );
                          editProduct.Products.vitrina_narx = countCurrency(
                            item2,
                            item2.Products.vitrina_narx
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
                          product = item2;
                          getPhoto(product);
                        "
                      >
                        <i class="fa fa-image" />
                      </button>
                      <button
                        class="btn btn-outline-primary"
                        data-toggle="modal"
                        data-target="#price_tag"
                        @click="createBarcode(item2)"
                      >
                        <i class="fa fa-barcode" />
                      </button>
                      <button
                        class="btn btn-outline-primary"
                        @click="
                          $refs.TransferProductsModal.start(item2.Products.code)
                        "
                      >
                        <i class="fa fa-truck" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="9">
                    <Pagination
                      :page="page1"
                      :pages="pages1"
                      :limit="limit1"
                      @get="getProducts"
                    />
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </details>
      </div>
      <div class="col-sm-12" v-if="categories.length">
        <Pagination :page="page" :pages="pages" :limit="limit" @get="get" />
      </div>
    </div>
  </div>

  <div class="modal fade" id="editProduct">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Mahsulot narxini tahrirlash</h4>
        </div>
        <form @submit.prevent="put(editProduct)">
          <div class="modal-body" v-if="editProduct">
            <!-- <div class="row my-1">
              <label class="col-md-6">
                <input type="radio" v-model="edit_type" value="0" />
                Faqat ushbu o'lcham uchun
              </label>
              <label class="col-md-6">
                <input
                  type="radio"
                  v-model="edit_type"
                  :value="editProduct.Products.size"
                />
                Barcha o'lchamlar uchun
              </label>
            </div> -->
            <div class="row">
              <div class="col-md-12 mb-1">
                <div class="input-group input-group-sm">
                  <input
                    type="number"
                    step="any"
                    min="0"
                    :max="
                      editProduct.Products.sotuv_narx
                        ? editProduct.Products.sotuv_narx
                        : false
                    "
                    class="form-control"
                    required
                    v-model="editProduct.Products.oxirgi_narx"
                  />
                  <div class="input-group-append">
                    <div class="input-group-text">
                      {{ editProduct.Products.currency_savdo.currency }}
                    </div>
                  </div>
                  <div class="input-group-append">
                    <div class="input-group-text">oxirgi narx</div>
                  </div>
                </div>
              </div>
              <div class="col-md-12 mb-1">
                <div class="input-group input-group-sm">
                  <input
                    type="number"
                    step="any"
                    :min="
                      editProduct.Products.oxirgi_narx
                        ? editProduct.Products.oxirgi_narx
                        : 0
                    "
                    :max="
                      editProduct.Products.vitrina_narx
                        ? editProduct.Products.vitrina_narx
                        : false
                    "
                    class="form-control"
                    required
                    v-model="editProduct.Products.sotuv_narx"
                  />
                  <div class="input-group-append">
                    <div class="input-group-text">
                      {{ editProduct.Products.currency_savdo.currency }}
                    </div>
                  </div>
                  <div class="input-group-append">
                    <div class="input-group-text">sotuv narx</div>
                  </div>
                </div>
              </div>
              <div class="col-md-12 mb-1">
                <div class="input-group input-group-sm">
                  <input
                    type="number"
                    step="any"
                    :min="
                      editProduct.Products.sotuv_narx
                        ? editProduct.Products.sotuv_narx
                        : 0
                    "
                    class="form-control"
                    required
                    v-model="editProduct.Products.vitrina_narx"
                  />
                  <div class="input-group-append">
                    <div class="input-group-text">
                      {{ editProduct.Products.currency_savdo.currency }}
                    </div>
                  </div>
                  <div class="input-group-append">
                    <div class="input-group-text">oxirgi narx</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-primary">
              <span class="far fa-circle-check" />
            </button>
            <button class="btn btn-outline-danger" data-dismiss="modal">
              <span class="far fa-circle-xmark" />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div class="modal fade" id="price_tag">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">
          <div id="tag" v-if="product">
            <div id="tag_header">
              <div id="tag_logo">
                <img :src="image + logo" :alt="logo" />
              </div>
              <div id="tag_address">
                <div>
                  {{
                    name.toLocaleLowerCase() == "adidas"
                      ? name + " Andijon Navruz MALL"
                      : name.toLocaleLowerCase() == "nike"
                      ? name + " Andijon ТРЦ O'zbegim "
                      : ""
                  }}
                </div>
                <div>
                  <b> {{ formatPhoneNumber(phone) }} </b>
                  <span>
                    {{
                      name.toLocaleLowerCase() == "adidas"
                        ? " C Blok ГФ 14"
                        : name.toLocaleLowerCase() == "nike"
                        ? " 2-етаж ГФ 205"
                        : ""
                    }}
                  </span>
                </div>
                <b>
                  {{
                    categories.find(
                      ({ Categories }) =>
                        Categories.id == product.Products.category_id
                    ).Categories.name
                  }}
                </b>
              </div>
            </div>
            <div id="tag_body">
              <div>
                <div>ART: {{ product.Products.articul }}</div>
                <div>
                  SIZE:
                  <span>{{ product.Products.size }}</span>
                </div>
              </div>
              <div>
                <span>PRICE:</span>
                <span>
                  {{
                    Intl.NumberFormat().format(product.Products.vitrina_narx)
                  }}
                </span>
                <span>
                  {{ product.Products.currency_savdo.currency.toUpperCase() }}
                </span>
              </div>
            </div>
            <div id="tag_footer">
              <img id="barcode" />
              <div>
                {{ String(product.Products.code).substring(0, 1) }}
                <u>{{ String(product.Products.code).substring(1, 5) }}</u>
                {{ String(product.Products.code).substring(5) }}
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-primary" @click="printTag()">
            <i class="fa fa-print" />
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="addImage">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header" v-if="product">
          <h4>
            {{
              product.Products.name +
              " " +
              product.Products.articul +
              " " +
              product.Products.name2
            }}
          </h4>
        </div>
        <form @submit.prevent="postPhoto(product)">
          <div class="modal-body">
            <input type="file" id="logo" class="form-control form-control-sm" />
            <div class="row">
              <div
                class="col-md-4 my-1"
                v-for="photo in product_photo"
                :key="photo"
              >
                <span
                  v-if="product && product_photo.length"
                  class="photo-viewer"
                >
                  <img
                    :src="image + photo.logo"
                    :alt="photo.logo"
                    data-toggle="modal"
                    data-target="#mainPhoto"
                    @click="main_photo = photo.logo"
                  />
                  <i
                    class="fa fa-xmark fa-2x text-danger"
                    @click="removeLogo(product.Products.articul, photo.id)"
                  />
                  <!-- <i
                    class="fa fa-2x fa-angle-left"
                    v-if="product_index !== 0"
                    @click="product_index--"
                  />
                  <i
                    class="fa fa-2x fa-angle-right"
                    v-if="product_index !== product_photo.length - 1"
                    @click="product_index++"
                  /> -->
                </span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-primary">
              <i class="far fa-circle-check" />
            </button>
            <button class="btn btn-outline-danger" data-dismiss="modal">
              <i class="far fa-circle-xmark" />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div class="modal fade" id="mainPhoto">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-body">
          <span v-if="main_photo" class="photo-viewer">
            <img :src="image + main_photo" :alt="main_photo" />
          </span>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-danger" data-dismiss="modal">
            <i class="far fa-circle-xmark" />
          </button>
        </div>
      </div>
    </div>
  </div>

  <TransferProductsModal ref="TransferProductsModal" @end="get(0, 25)" />
</template>

<script>
import * as api from "@/components/Api/Api";
import Pagination from "@/components/Pagination/Pagination.vue";
import JsBarcode from "jsbarcode";
import TransferProductsModal from "@/components/modal/TransferProductsModal.vue";
export default {
  name: "Categories",
  components: { Pagination, TransferProductsModal },
  data() {
    return {
      image: api.url_to_files,
      logo: null,
      phone: null,
      name: "",
      search: "",
      page: 0,
      pages: 1,
      limit: 50,
      categories: [],
      page1: 0,
      pages1: 1,
      limit1: 50,
      category_for_products: null,
      category: {
        name: null,
      },
      editProduct: null,
      edit_type: 0,
      product: null,
      product_photo: [],
      product_index: 0,
      main_photo: null,
      balance: null,
    };
  },
  created() {
    this.getBranch();
  },
  methods: {
    formatPhoneNumber(number) {
      return String(
        String(number).substr(0, 2) +
          " " +
          String(number).substr(2, 3) +
          " " +
          String(number).substr(5, 2) +
          " " +
          String(number).substr(7, 2)
      );
    },
    getBranch() {
      api.branch(localStorage["branch_id"]).then((res) => {
        this.logo = res.data.logo?.logo;
        this.phone = res.data.branch?.phone;
        this.name = res.data.branch?.name;
        this.getBalance(this.page, this.limit);
      });
    },
    getBalance(page, limit) {
      api.productsSumPrice().then((Response) => {
        this.balance = Response.data;
        this.get(page, limit);
      });
    },
    get(page, limit) {
      api.categories(0, page, limit).then((Response) => {
        this.page = Response.data.current_page;
        this.pages = Response.data.pages;
        this.categories = Response.data.data;
        this.categories.forEach((item) => {
          item.Categories.products = [];
        });
      });
    },
    getProducts(page, limit) {
      api
        .categories(this.category_for_products.id, page, limit)
        .then((Response) => {
          this.page1 = Response.data.current_page;
          this.pages1 = Response.data.pages;
          this.category_for_products.products = Response.data.data;
        });
    },
    createBarcode(product) {
      this.product = product;
      setTimeout(() => {
        JsBarcode("#barcode", product.Products.code, {
          // format: "CODE128",
          width: 2,
          height: 25,
          margin: 1,
          displayValue: false,
        });
      }, 100);
    },
    printTag() {
      let price_tag = document.getElementById("tag").outerHTML;
      let winPrint = window.open("", "_blank");
      winPrint.document.querySelector("head").innerHTML = `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        #tag {
          width: 6cm;
          height: 3.8cm;
          padding: 5px 1px 1px 1px;
          color: black;
          background: white;
          white-space: pre-line;
          text-align: center;
          font-size: 12px;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }
        #tag_header {
          height: 1.3cm;
          display: flex;
          font-size: x-small;
        }
        #tag_header > * {
          height: 100%;
        }
        #tag_logo {
          width: 30%;
          display: flex;
          justify-content: center;
        }
        #tag_logo img {
          width: 80%;
          height: 80%;
          object-fit: contain;
        }
        #tag_address {
          width: 70%;
        }
        #tag_address > * {
          width: 100%;
          text-align: center;
        }
        #tag_body {
          height: 1.1cm;
          font-weight: bold;
        }
        #tag_body > * {
          width: 100%;
          height: 50%;
        }
        #tag_body > *:first-of-type {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          font-size: x-small;
        }
        #tag_body > *:first-of-type > * {
          width: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        #tag_body > *:first-of-type > div:last-of-type {
          padding-right: 0.8cm;
          justify-content: end;
        }
        #tag_body > *:first-of-type span {
          margin: -3px 3px 0 3px;
          padding: 0 2px;
          color: white;
          background-color: black;
          border-radius: 3px;
          font-size: 18px;
          line-height: 18px;
        }
        #tag_body > *:first-of-type > div:nth-child(1) {
          padding-right: 25px;
          justify-content: flex-end;
        }
        #tag_body > *:last-of-type {
          padding: 0 15px;
          padding-bottom: 15px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 14px;
        }
        #tag_body > *:last-of-type > span:nth-child(2) {
          padding: 0 10px;
          font-size: 18px;
        }
        #tag_footer {
          height: 1.4cm;
        }
        #tag_footer div {
          font-size: 16px;
          font-weight: 600;
        }
      </style>`;
      winPrint.document.body.innerHTML = price_tag;
      setTimeout(() => {
        winPrint.print();
        winPrint.close();
      }, 100);
    },
    getPhoto(product) {
      this.product_photo = [];
      api.photo(product.Products.articul).then((Response) => {
        this.product_photo = Response.data;
      });
    },
    postPhoto(product) {
      let logo = document.querySelector("#logo").files[0];
      let formdata = new FormData();
      formdata.append("file", logo);
      api.uploadPhoto(product.Products.articul, formdata).then((Response) => {
        // document.querySelector("#logo").files[0] = null;
        api.success(1).then(() => {});
      });
    },
    put(product) {
      let data = {
        vitrina_narx: product.Products.vitrina_narx,
        sotuv_narx: product.Products.sotuv_narx,
        oxirgi_narx: product.Products.oxirgi_narx,
      };
      api
        .updateProduct(product.Products.code, this.edit_type, data)
        .then((Response) => {
          api.success(0).then(() => {
            this.getBalance(0, 100);
          });
        });
    },
    removeLogo(articul, id) {
      api.removePhoto(articul, id).then((Response) => {
        api.success(1).then(() => {});
      });
    },
  },
};
</script>

<style scoped>
.input-group {
  display: flex;
  justify-content: center;
}
#price_tag .modal-body {
  display: flex;
  justify-content: center;
}
#tag {
  width: 6cm;
  height: 3.8cm;
  padding: 5px 1px 1px 1px;
  color: black;
  background: white;
  white-space: pre-line;
  text-align: center;
  font-size: 12px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}
#tag_header {
  height: 1.3cm;
  display: flex;
  font-size: x-small;
}
#tag_header > * {
  height: 100%;
}
#tag_logo {
  width: 30%;
  display: flex;
  justify-content: center;
}
#tag_logo img {
  width: 80%;
  height: 80%;
  object-fit: contain;
}
#tag_address {
  width: 70%;
}
#tag_address > * {
  width: 100%;
  text-align: center;
}
#tag_body {
  height: 1.1cm;
  font-weight: bold;
}
#tag_body > * {
  width: 100%;
  height: 50%;
}
#tag_body > *:first-of-type {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  font-size: x-small;
}
#tag_body > *:first-of-type > * {
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
#tag_body > *:first-of-type > div:last-of-type {
  padding-right: 0.8cm;
  justify-content: end;
}
#tag_body > *:first-of-type span {
  margin: -3px 3px 0 3px;
  padding: 0 2px;
  color: white;
  background-color: black;
  border-radius: 3px;
  font-size: 18px;
  line-height: 18px;
}
#tag_body > *:first-of-type > div:nth-child(1) {
  padding-right: 25px;
  justify-content: flex-end;
}
#tag_body > *:last-of-type {
  padding: 0 15px;
  padding-bottom: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
}
#tag_body > *:last-of-type > span:nth-child(2) {
  padding: 0 10px;
  font-size: 18px;
}
#tag_footer {
  height: 1.4cm;
}
#tag_footer div {
  font-size: 16px;
  font-weight: 600;
}

.modal-body .row {
  overflow-x: hidden;
  overflow-y: auto;
}
.modal-body .photo-viewer {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  border: 1px solid rgb(0, 0, 0, 0.2);
  cursor: pointer;
  transition: 0.3s all;
}
.modal-body .photo-viewer:hover {
  box-shadow: 0 1px 15px 5px rgb(0, 0, 0, 0.3);
}
.modal-body .photo-viewer img {
  width: 100%;
}

.photo-viewer .fa.fa-xmark {
  position: absolute;
  top: 0;
  right: 2%;
  transition: 0.2s;
}
.photo-viewer .fa.fa-xmark:hover {
  color: red !important;
}
.photo-viewer .fa-angle-left,
.photo-viewer .fa-angle-right {
  cursor: pointer;
  position: absolute;
  top: 40%;
}
.photo-viewer .fa-angle-left {
  left: 1%;
}
.photo-viewer .fa-angle-right {
  right: 1%;
}
</style>
