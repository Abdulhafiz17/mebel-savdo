<template>
  <h3>
    <span class="fa fa-warehouse" />
    {{ warehouse ? "Ombor " + warehouse.name : "Ombor" }}
  </h3>
  <div class="row">
    <div class="col-md-2 d-flex align-items-center justify-content-center">
      <div class="dropdown" v-if="balance">
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
    <div class="col-md-4 my-1 d-flex align-items-center justify-content-center">
      <span v-if="balance">
        Umumiy narx
        <br />
        <span v-for="(item, index) in balance.price_data" :key="item">
          {{
            Intl.NumberFormat().format(item.total_price) +
            " " +
            item.currency +
            (index !== balance.price_data.length - 1 ? " - " : "")
          }}
        </span>
      </span>
    </div>
    <div class="col-md-4 my-1 d-flex align-items-center justify-content-center">
      <span v-if="balance">
        Umumiy tan narx
        <br />
        <span v-for="(item, index) in balance.tan_narx_data" :key="item">
          {{
            Intl.NumberFormat().format(item.total_tan_narx) +
            " " +
            item.tan_narx_currency +
            (index !== balance.tan_narx_data.length - 1 ? " - " : "")
          }}
        </span>
      </span>
    </div>
    <div class="col-md-2 d-flex align-items-center justify-content-center">
      <!-- <button
        class="btn btn-sm btn-outline-secondary"
        data-toggle="modal"
        data-target="#addProduct"
        @click="
          getCategories2();
          getCurrencies();
        "
      >
        <i class="fa fa-box" /> Mahsulot qo'shish
      </button> -->
    </div>
  </div>
  <hr />

  <div class="body">
    <ul
      v-if="role == 'admin'"
      class="nav nav-pills nav-justified mb-3"
      id="pills-tab"
      role="tablist"
    >
      <li class="nav-item" role="presentation">
        <button
          class="nav-link active"
          id="pills-home-tab"
          data-bs-toggle="pill"
          data-bs-target="#pills-home"
          type="button"
          role="tab"
          aria-controls="pills-home"
          aria-selected="true"
          @click="
            page = 0;
            pages = 1;
            limit = 50;
            getCategories(0, 50);
          "
        >
          Ombor mahsulotlari
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          id="pills-profile-tab"
          data-bs-toggle="pill"
          data-bs-target="#pills-profile"
          type="button"
          role="tab"
          aria-controls="pills-profile"
          aria-selected="false"
          @click="
            page = 0;
            pages = 1;
            limit = 50;
            getProducts2(0, 50);
          "
        >
          Filialga mahsulot yuborish
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          id="pills-products-tab"
          data-bs-toggle="pill"
          data-bs-target="#pills-products"
          type="button"
          role="tab"
          aria-controls="pills-products"
          aria-selected="false"
          @click="
            page = 0;
            pages = 1;
            limit = 50;
            getTransfersWaiting(0, 50);
          "
        >
          Filialga yuborilgan mahsulotlar
        </button>
      </li>
    </ul>
    <div class="tab-content" id="pills-tabContent">
      <div
        class="tab-pane fade show active"
        id="pills-home"
        role="tabpanel"
        aria-labelledby="pills-home-tab"
      >
        <div class="row">
          <div class="col-md-11 mx-auto responsive" style="max-height: 68vh">
            <details v-for="item in categories" :key="item">
              <summary
                @click="
                  category_for_product = item;
                  getProducts(0, limit);
                "
              >
                <h5>{{ item.Warehouse_products.category.name }}</h5>
              </summary>
              <table class="table table-sm table-hover">
                <thead>
                  <tr>
                    <th>Nomi</th>
                    <th>Miqdor</th>
                    <th>Kpi</th>
                    <th>Narx</th>
                    <th>Tan narx</th>
                    <th>Summa</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in item.products" :key="item">
                    <td>{{ item.Warehouse_products.articul }}</td>
                    <td>{{ item.Warehouse_products.quantity }} dona</td>
                    <td>{{ item.Warehouse_products.kpi }} so'm</td>
                    <td>
                      {{
                        Intl.NumberFormat().format(
                          item.Warehouse_products.price
                        )
                      }}
                      {{ item.Warehouse_products.currency.currency }}
                    </td>
                    <td>
                      {{
                        Intl.NumberFormat().format(
                          item.Warehouse_products.tan_narx
                        )
                      }}
                      {{ item.currency }}
                    </td>
                    <td>
                      {{
                        Intl.NumberFormat().format(
                          item.Warehouse_products.tan_narx *
                            item.Warehouse_products.quantity
                        )
                      }}
                      {{ item.currency }}
                    </td>
                    <td>
                      <div class="btn-group btn-group-sm">
                        <button
                          v-if="role == 'admin'"
                          class="btn btn-outline-warning"
                          @click="$refs.mahsulotModal.start(item)"
                        >
                          <i class="fa fa-edit" />
                        </button>
                        <button
                          class="btn btn-outline-secondary"
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
                          class="btn btn-outline-info"
                          data-toggle="modal"
                          data-target="#info"
                          @click="
                            product = item;
                            getProductInfo(item);
                          "
                        >
                          <i class="fa fa-info" />
                        </button>
                        <button
                          class="btn btn-outline-danger"
                          v-if="item.Warehouse_products.status == 'not_supply'"
                          @click="deleteProduct(item)"
                        >
                          <i class="far fa-circle-xmark" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="7">
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
            </details>
          </div>
        </div>
      </div>
      <div
        class="tab-pane fade"
        id="pills-profile"
        role="tabpanel"
        aria-labelledby="pills-profile-tab"
      >
        <form @submit.prevent="postToBranch(productsToBranch)">
          <div class="row">
            <div class="col-md-11 my-1">
              <!-- <select
                class="form-select form-select-sm"
                required
                v-model="to"
                @click="branches.length ? '' : getBranches()"
              >
                <option disabled value="">Filial tanlang</option>
                <option v-for="item in branches" :key="item" :value="item.id">
                  {{ item.name }}
                </option>
              </select> -->
              <div class="dropdown">
                <button
                  class="btn btn-sm btn-block btn-outline-secondary dropdown-toggle"
                  type="button"
                  data-toggle="dropdown"
                  @click="getBranches()"
                >
                  {{ to ? to.name : "Filial tanlang" }}
                </button>
                <div class="dropdown-menu w-100">
                  <button
                    class="dropdown-item"
                    type="button"
                    v-for="item in branches"
                    :key="item"
                    @click="to = item"
                  >
                    {{ item.name }}
                  </button>
                </div>
              </div>
            </div>
            <div class="col-md-1 my-1">
              <button
                class="btn btn-sm btn-block btn-outline-secondary"
                :disabled="to ? false : true"
              >
                <i class="far fa-circle-check" />
              </button>
            </div>
            <div class="col-md-12 my-1">
              <div class="table-responsive" style="max-height: 60vh">
                <table class="table table-sm table-hover">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Kategoriya</th>
                      <th>Nomi</th>
                      <th>Soni</th>
                      <th>Tan narx</th>
                      <th>Ustama</th>
                      <th>Filial narx</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="item in products2"
                      :key="item"
                      :class="
                        productsToBranch.find((data) => {
                          return data == item;
                        })
                          ? 'checked'
                          : ''
                      "
                    >
                      <td>
                        <input
                          class="form-check"
                          type="checkbox"
                          v-model="productsToBranch"
                          :value="item"
                        />
                      </td>
                      <td>{{ item.Warehouse_products.category.name }}</td>
                      <td>{{ item.Warehouse_products.articul }}</td>
                      <td>
                        <label class="input-group input-group-sm">
                          <input
                            class="form-control"
                            type="number"
                            min="1"
                            :max="item.Warehouse_products.quantity2"
                            :placeholder="`${item.Warehouse_products.quantity2} dona`"
                            v-model="item.Warehouse_products.quantity"
                            :required="
                              productsToBranch.find((data) => {
                                return data == item;
                              })
                            "
                          />
                          <div class="input-group-append">
                            <div class="input-group-text">dona</div>
                          </div>
                        </label>
                      </td>
                      <td>
                        {{
                          Intl.NumberFormat().format(
                            item.Warehouse_products.tan_narx
                          )
                        }}
                        {{ item.currency }}
                      </td>
                      <td>
                        <label class="input-group input-group-sm">
                          <input
                            class="form-control"
                            type="number"
                            min="0"
                            step="any"
                            placeholder="foiz"
                            v-model="item.Warehouse_products.percent"
                            :required="
                              productsToBranch.find((data) => {
                                return data == item;
                              })
                            "
                            @keyup="countPrice(item)"
                          />
                          <div class="input-group-append">
                            <div class="input-group-text">%</div>
                          </div>
                        </label>
                      </td>
                      <td>
                        <label class="input-group input-group-sm">
                          <input
                            class="form-control"
                            type="number"
                            min="0"
                            step="any"
                            placeholder="narx"
                            v-model="item.Warehouse_products.price"
                            :required="
                              productsToBranch.find((data) => {
                                return data == item;
                              })
                            "
                            @keyup="countPercent(item)"
                          />
                          <div class="input-group-append">
                            <div class="input-group-text">
                              {{ item.currency ? item.currency : "valyuta" }}
                            </div>
                          </div>
                        </label>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="7">
                        <Pagination
                          :page="page"
                          :pages="pages"
                          :limit="limit"
                          @get="getProducts2"
                        />
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div
        class="tab-pane fade"
        id="pills-products"
        role="tabpanel"
        aria-labelledby="pills-products-tab"
      >
        <ul
          class="nav nav-pills nav-justified mb-3"
          id="pills-tab"
          role="tablist"
        >
          <li class="nav-item" role="presentation">
            <button
              class="nav-link active"
              id="pills-wait-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-wait"
              type="button"
              role="tab"
              aria-controls="pills-wait"
              aria-selected="true"
              @click="
                page = 0;
                pages = 1;
                limit = 50;
                getTransfersWaiting(0, 50);
              "
            >
              Kutilayotgan
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link"
              id="pills-done-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-done"
              type="button"
              role="tab"
              aria-controls="pills-done"
              aria-selected="false"
              @click="
                page = 0;
                pages = 1;
                limit = 50;
                getTransfersAccepted(0, 50);
              "
            >
              Qabul qilingan
            </button>
          </li>
        </ul>
        <div class="tab-content" id="pills-tabContent">
          <div
            class="tab-pane fade show active"
            id="pills-wait"
            role="tabpanel"
            aria-labelledby="pills-wait-tab"
          >
            <div class="row my-1">
              <div class="col mb-1">
                <select
                  class="form-select form-select-sm"
                  v-model="branch_id"
                  @click="branches.length ? '' : getBranches()"
                >
                  <option disabled value="0">Barcha filiallar</option>
                  <option v-for="item in branches" :key="item" :value="item.id">
                    {{ item.name }}
                  </option>
                </select>
              </div>
              <div class="col mb-1">
                <input
                  class="form-control form-control-sm"
                  type="date"
                  v-model="from_date"
                />
              </div>
              <div class="col mb-1">
                <input
                  class="form-control form-control-sm"
                  type="date"
                  v-model="to_date"
                />
              </div>
              <div class="col mb-1">
                <button
                  class="btn btn-sm btn-block btn-outline-secondary"
                  @click="getTransfersWaiting(0, 50)"
                >
                  <i class="far fa-circle-check" />
                </button>
              </div>
            </div>
            <div class="table-responsive" style="max-height: 55vh">
              <table class="table table-sm table-hover">
                <thead>
                  <tr>
                    <th>Kategoriya</th>
                    <th>Nomi</th>
                    <th>Soni</th>
                    <th>Narx</th>
                    <th>Summa</th>
                    <th>Qaysi filialga</th>
                    <th>Sana</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in transfersWaiting" :key="item">
                    <td>{{ item.Warehouse_products.category.name }}</td>
                    <td>{{ item.Warehouse_products.articul }}</td>
                    <td>{{ item.Transfers.quantity }} dona</td>
                    <td>
                      {{
                        Intl.NumberFormat().format(
                          item.Transfers.transfer_price
                        )
                      }}
                      {{ item.Currencies.currency }}
                    </td>
                    <td>
                      {{
                        Intl.NumberFormat().format(
                          item.Transfers.transfer_price *
                            item.Transfers.quantity
                        ) +
                        " " +
                        item.Currencies.currency
                      }}
                    </td>
                    <td>{{ item.name }}</td>
                    <td>
                      {{
                        item.Transfers.time
                          .replace("T", " ")
                          .substring(0, item.Transfers.time.length - 3)
                      }}
                    </td>
                    <td>
                      <button
                        class="btn btn-sm btn-outline-danger"
                        @click="deleteTransfer(item)"
                      >
                        <i class="far fa-circle-xmark" />
                      </button>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="8">
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
            id="pills-done"
            role="tabpanel"
            aria-labelledby="pills-done-tab"
          >
            <div class="row my-1">
              <div class="col mb-1">
                <select
                  class="form-select form-select-sm"
                  v-model="branch_id"
                  @click="branches.length ? '' : getBranches()"
                >
                  <option disabled value="0">Barcha filiallar</option>
                  <option v-for="item in branches" :key="item" :value="item.id">
                    {{ item.name }}
                  </option>
                </select>
              </div>
              <div class="col mb-1">
                <input
                  class="form-control form-control-sm"
                  type="date"
                  v-model="from_date"
                />
              </div>
              <div class="col mb-1">
                <input
                  class="form-control form-control-sm"
                  type="date"
                  v-model="to_date"
                />
              </div>
              <div class="col mb-1">
                <button
                  class="btn btn-sm btn-block btn-outline-secondary"
                  @click="getTransfersAccepted(0, 50)"
                >
                  <i class="far fa-circle-check" />
                </button>
              </div>
            </div>
            <div class="table-responsive" style="max-height: 55vh">
              <table class="table table-sm table-hover">
                <thead>
                  <tr>
                    <th>Kategoriya</th>
                    <th>Nomi</th>
                    <th>Soni</th>
                    <th>Narx</th>
                    <th>Qaysi filialga</th>
                    <th>Sana</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in transfersAccepted" :key="item">
                    <td>{{ item.Warehouse_products.category.name }}</td>
                    <td>{{ item.Warehouse_products.articul }}</td>
                    <td>{{ item.Transfers.quantity }} dona</td>
                    <td>
                      {{
                        Intl.NumberFormat().format(
                          item.Transfers.transfer_price
                        )
                      }}
                      {{ item.currency }}
                    </td>
                    <td>{{ item.name }}</td>
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
                    <td colspan="8">
                      <Pagination
                        :page="page"
                        :pages="pages"
                        :limit="limit"
                        @get="getTransfersAccepted"
                      />
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="addImage">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header" v-if="product">
          <h4>
            {{ product.Warehouse_products.category.name }}
            {{ product.Warehouse_products.articul }}
          </h4>
        </div>
        <form @submit.prevent="postPhoto(product)">
          <div class="modal-body" v-if="product">
            <input type="file" id="logo" class="form-control form-control-sm" />
            <div class="row">
              <div
                class="col-md-4 my-1"
                v-for="photo in product_photo"
                :key="photo"
              >
                <span
                  v-if="product_photo.length && !photo_for_product"
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
                    @click="
                      removeLogo(product.Warehouse_products.articul, photo.id)
                    "
                  />
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

  <div class="modal fade" id="addProduct">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Mahsulot qo'shish</h4>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addNewProduct(new_product)">
            <div class="row">
              <div class="col-md-2">
                <select
                  class="form-select form-select-sm"
                  required
                  v-model="new_product.category_id"
                >
                  <option disabled value="">kategoriya</option>
                  <option v-for="i in categories2" :key="i" :value="i.id">
                    {{ i.name }}
                  </option>
                </select>
              </div>
              <div class="col-md-2">
                <input
                  type="text"
                  class="form-control form-control-sm"
                  required
                  placeholder="nomi"
                  v-model="new_product.articul"
                />
              </div>
              <div class="col-md-2">
                <input
                  type="number"
                  min="0"
                  class="form-control form-control-sm"
                  placeholder="miqdor"
                  required
                  v-model="new_product.quantity"
                />
              </div>
              <div class="col-md-3">
                <div class="input-group input-group-sm">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    class="form-control"
                    placeholder="narx"
                    required
                    v-model="new_product.price"
                  />
                  <div class="input-group-append">
                    <select
                      class="form-select form-select-sm"
                      required
                      v-model="new_product.currency_id"
                    >
                      <option disabled value="">valuyuta</option>
                      <option v-for="i in currencies" :key="i" :value="i.id">
                        {{ i.currency }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="input-group input-group-sm">
                  <input
                    type="number"
                    :min="new_product.price ? new_product.price : 0"
                    step="any"
                    class="form-control"
                    placeholder="tan narx"
                    required
                    v-model="new_product.tan_narx"
                  />
                  <div class="input-group-append">
                    <select
                      class="form-select form-select-sm"
                      required
                      v-model="new_product.tan_narx_currency_id"
                    >
                      <option disabled value="">valuyuta</option>
                      <option v-for="i in currencies" :key="i" :value="i.id">
                        {{ i.currency }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="col-md-12 my-1">
                <button class="btn btn-sm btn-block btn-outline-secondary">
                  <i class="far fa-circle-check" />
                </button>
              </div>
            </div>
          </form>
          <div class="table-responsive">
            <table class="table table-sm table-hover">
              <thead>
                <tr>
                  <th>Mahsulot</th>
                  <th>Miqdor</th>
                  <th>Narx</th>
                  <th>Tan narx</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(i, index) in new_products" :key="i">
                  <td>
                    {{
                      categories2.find((item) => {
                        return item.id == i.category_id;
                      }).name +
                      " " +
                      i.articul
                    }}
                  </td>
                  <td>{{ i.quantity + " dona" }}</td>
                  <td>
                    {{
                      i.price +
                      " " +
                      currencies.find((item) => {
                        return item.id == i.currency_id;
                      }).currency
                    }}
                  </td>
                  <td>
                    {{
                      i.tan_narx +
                      " " +
                      currencies.find((item) => {
                        return item.id == i.tan_narx_currency_id;
                      }).currency
                    }}
                  </td>
                  <td>
                    <button
                      class="btn btn-sm btn-outline-danger"
                      @click="new_products.splice(index, 1)"
                    >
                      <i class="fa fa-trash" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <button
            class="btn btn-outline-primary"
            @click="postNewProducts(new_products)"
          >
            <i class="far fa-circle-check" />
          </button>
          <button class="btn btn-outline-danger" data-dismiss="modal">
            <i class="far fa-circle-xmark" />
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="info">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header" v-if="product">
          <h4>
            {{
              product.Warehouse_products.category.name +
              " " +
              product.Warehouse_products.articul +
              " tarixi"
            }}
          </h4>
        </div>
        <div class="modal-body" v-if="product">
          <div class="table-responsive my-1">
            <table class="table table-sm table-hover">
              <thead>
                <tr>
                  <th>Narx</th>
                  <th>Chiqim ustamasi</th>
                  <th>Tan narx</th>
                  <th>Miqdor</th>
                  <th>Taminotchi</th>
                  <th>Sana</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in product_history" :key="item">
                  <td>
                    {{
                      Intl.NumberFormat().format(item.price) +
                      " " +
                      item.currency.currency
                    }}
                  </td>
                  <td>
                    {{
                      Intl.NumberFormat().format(item.added_expense_price) +
                      " " +
                      product.currency
                    }}
                  </td>
                  <td>
                    {{
                      Intl.NumberFormat().format(
                        product.Warehouse_products.tan_narx
                      ) +
                      " " +
                      product.currency
                    }}
                  </td>
                  <td>
                    {{ item.quantity + " dona" }}
                  </td>
                  <td>
                    {{ item.market.name }}
                  </td>
                  <td>
                    {{
                      item.time
                        .replace("T", " ")
                        .substring(0, item.time.length - 3)
                    }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-danger" data-dismiss="modal">
            <i class="far fa-circle-xmark" />
          </button>
        </div>
      </div>
    </div>
  </div>

  <mahsulotModal ref="mahsulotModal" />
</template>

<script>
import * as api from "@/components/Api/Api";
import Pagination from "@/components/Pagination/Pagination.vue";
import mahsulotModal from "./mahsulotModal.vue";
import swal from "sweetalert";
export default {
  name: "Ombor",
  components: { Pagination, mahsulotModal },
  data() {
    return {
      image: api.url_to_files,
      role: localStorage["role"],
      search: "",
      page: 0,
      pages: 1,
      limit: 100,
      page1: 0,
      pages1: 1,
      limit1: 100,
      warehouse: null,
      product: null,
      product_history: [],
      photo_for_product: null,
      product_photo: [],
      main_photo: null,
      product_index: 0,
      new_product: {
        category_id: "",
        articul: "",
        quantity: null,
        price: null,
        currency_id: "",
        tan_narx: null,
        tan_narx_currency_id: "",
        warehouse_id: this.$route.params.id,
      },
      new_products: [],
      products: [],
      products2: [],
      productsToBranch: [],
      categories: [],
      category_for_product: null,
      categories2: [],
      currencies: [],
      branches: [],
      to: null,
      transfersWaiting: [],
      transfersAccepted: [],
      branch_id: 0,
      from_date: "",
      to_date: "",
      balance: null,
    };
  },
  created() {
    this.getWarehouse(0, 100);
  },
  mounted() {},
  methods: {
    getWarehouse(page, limit) {
      api.warehouse(this.$route.params.id).then((Response) => {
        this.warehouse = Response.data;
        this.get(page, limit);
      });
    },
    get(page, limit) {
      this.getCategories(page, limit);
      this.getCurrencies();
    },
    getCategories(page, limit) {
      api
        .warehouseProducts(this.$route.params.id, 0, page, limit, false)
        .then((Response) => {
          this.categories = Response.data.data;
          if (this.categories.length) {
            this.remove(this.categories);
          } else {
            this.getBalance();
          }
        });
    },
    remove(data) {
      for (let i = 0; i < data.length; i++) {
        data[i].products = [];
        if (i == data.length - 1) {
          this.getBalance();
          break;
        }
      }
    },
    getProducts(page, limit) {
      api
        .warehouseProducts(
          this.$route.params.id,
          this.category_for_product.Warehouse_products.category_id,
          page,
          limit,
          false
        )
        .then((Response) => {
          this.category_for_product.products = Response.data.data;
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
        });
    },
    getBalance() {
      api.warehouseBalances(this.$route.params.id).then((Response) => {
        this.balance = Response.data;
      });
    },
    getProducts2(page, limit) {
      api
        .warehouseProducts(this.$route.params.id, 0, page, limit, true)
        .then((Response) => {
          this.products2 = Response.data.data;
          this.products2.forEach((item) => {
            item.Warehouse_products.quantity2 =
              item.Warehouse_products.quantity;
            item.Warehouse_products.quantity = null;
            item.Warehouse_products.percent =
              item.Warehouse_products.category.percent;
            item.Warehouse_products.price =
              item.Warehouse_products.tan_narx +
              (item.Warehouse_products.tan_narx / 100) *
                item.Warehouse_products.percent;
          });
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.limit = Response.data.limit;
        });
    },
    getTransfersWaiting(page, limit) {
      api
        .transfers(
          this.$route.params.id,
          "kutish",
          page,
          limit,
          this.branch_id,
          this.from_date,
          this.to_date,
          0,
          0
        )
        .then((Response) => {
          this.transfersWaiting = Response.data.data;
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.limit = Response.data.limit;
        });
    },
    getTransfersAccepted(page, limit) {
      api
        .transfers(
          this.$route.params.id,
          "tasdiqlandi",
          page,
          limit,
          this.branch_id,
          this.from_date,
          this.to_date,
          0,
          0
        )
        .then((Response) => {
          this.transfersAccepted = Response.data.data;
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.limit = Response.data.limit;
        });
    },
    getBranches() {
      api.branches().then((Response) => {
        this.branches = Response.data.branch;
      });
    },
    postToBranch(data) {
      if (data.length) {
        let array = [];
        data.forEach((item, index) => {
          array.push({
            warehouse_pr_id: item.Warehouse_products.id,
            quantity: item.Warehouse_products.quantity,
            transfer_price: item.Warehouse_products.price,
            to_: this.to.id,
            order_from_branch_id: 0,
          });
          if (index == data.length - 1) {
            api
              .transferProduct(this.$route.params.id, array)
              .then((Response) => {
                api.success().then(() => {
                  this.to = null;
                  this.productsToBranch = [];
                  this.getProducts2(this.page, this.limit);
                });
              });
          }
        });
      } else {
        swal({
          icon: "error",
          title: "Mahsulotlar tanlanmagan !",
          timer: 2500,
        });
      }
    },
    deleteTransfer(data) {
      api.removeTransfer(data.Transfers.id).then((Response) => {
        api.success().then(() => {
          this.getTransfersWaiting(this.page, this.limit);
        });
      });
    },
    countPrice(data) {
      data.Warehouse_products.price =
        data.Warehouse_products.tan_narx +
        (data.Warehouse_products.tan_narx * data.Warehouse_products.percent) /
          100;
    },
    countPercent(data) {
      if (data.Warehouse_products.price > data.Warehouse_products.tan_narx) {
        data.Warehouse_products.percent =
          (100 *
            (data.Warehouse_products.price -
              data.Warehouse_products.tan_narx)) /
          data.Warehouse_products.tan_narx;
      } else {
        data.Warehouse_products.percent = 0;
      }
    },
    getPhoto(product) {
      this.product_photo = [];
      api.photo(product.Warehouse_products.articul).then((Response) => {
        this.product_photo = Response.data;
      });
    },
    postPhoto(product) {
      let logo = document.querySelector("#logo").files[0];
      let formdata = new FormData();
      formdata.append("file", logo);
      api
        .uploadPhoto(product.Warehouse_products.articul, formdata)
        .then((Response) => {
          // document.querySelector("#logo").files[0] = null;
          api.success(0).then(() => {});
        });
    },
    getCategories2() {
      api.categories(0, 0, 100).then((Response) => {
        this.categories2 = Response.data.data;
      });
    },
    getCurrencies() {
      api.currencies().then((Response) => {
        this.currencies = Response.data;
        this.new_product.currency_id = this.currencies[0].id;
        this.new_product.tan_narx_currency_id = this.currencies[0].id;
      });
    },
    addNewProduct(product) {
      this.new_products.push(product);
      this.new_product = {
        category_id: "",
        articul: "",
        quantity: null,
        price: null,
        currency_id: "",
        tan_narx: null,
        tan_narx_currency_id: "",
        warehouse_id: this.$route.params.id,
      };
    },
    postNewProducts(products) {
      api.addProducts(products).then((Response) => {
        this.new_products = [];
        api.success(2).then(() => {
          this.get(0, 100);
        });
      });
    },
    removeLogo(articul, id) {
      api.removePhoto(articul, id).then((Response) => {
        api.success(0).then(() => {});
      });
    },
    getProductInfo(product) {
      api
        .productHistory(
          product.Warehouse_products.warehouse_id,
          product.Warehouse_products.category_id,
          product.Warehouse_products.articul
        )
        .then((Response) => {
          this.product_history = Response.data;
        });
    },
    deleteProduct(data) {
      swal({
        title: "Miqdorni kiriting",
        dangerMode: true,
        content: {
          element: "input",
          attributes: {
            type: "number",
            className: "form-control form-control-sm",
            min: 0,
            placeholder: "miqdor",
          },
        },
      }).then((value) => {
        if (value) {
          if (value <= data.Warehouse_products.quantity) {
            api
              .removeWarehouseProduct(data.Warehouse_products.id, value)
              .then((Response) => {
                api.success().then(() => {
                  this.getCategories(0, 100);
                });
              });
          } else {
            swal({
              icon: "warning",
              title: "Noto'g'ri qiymat",
              closeOnClickOutside: false,
              closeOnEsc: false,
              timer: 2500,
            });
          }
        }
      });
    },
  },
};
</script>

<style scoped>
.body {
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 85vh;
}
details {
  border: 2px solid gray;
}
td .input-group {
  display: flex;
  justify-content: center;
}
.checked {
  background: rgba(50, 90, 130, 0.5);
  /* box-shadow: inset 0 0 50px rgb(50, 90, 150) */
}
.checked:hover {
  background: rgba(50, 90, 130, 0.5);
  /* box-shadow: inset 0 0 50px rgb(50, 90, 150) */
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

input[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
}

input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.dropdown {
  width: auto !important;
}

.dropdown-menu {
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 40vh;
}
</style>
