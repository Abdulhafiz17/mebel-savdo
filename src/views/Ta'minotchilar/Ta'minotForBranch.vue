<template>
  <h3><span class="fa fa-box" /> Ta'minot</h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4"></div>
  </div>

  <div class="body">
    <ul class="nav nav-pills nav-justified mb-3" id="pills-tab" role="tablist">
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
            getTransfers(0, 50);
            tab = 0;
          "
        >
          Faol
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
          @click="tab = 1"
        >
          Qabul qilingan
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
        <form
          class="responsive"
          id="confirm"
          @submit.prevent="transfers.length ? acceptTransfer() : false"
        />
        <div class="table-responsive">
          <table class="table table-sm table-hover">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    :checked="
                      transfers.length &&
                      transfers.length == transfersWaiting.length
                    "
                    @change="
                      $event.target.checked
                        ? (transfers = transfersWaiting)
                        : (transfers = [])
                    "
                  />
                </th>
                <th>Kategoriy</th>
                <th>Mahsulot</th>
                <th>Soni</th>
                <th>Ombor</th>
                <th>Sana</th>
                <th>Narx</th>
                <th width="15%">Oxirgi narx</th>
                <th width="15%">Sotuv narx</th>
                <th width="15%">Vitrina narx</th>
                <th>Valyuta</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in transfersWaiting" :key="item">
                <td>
                  <input type="checkbox" :value="item" v-model="transfers" />
                </td>
                <td>
                  {{ item.Warehouse_products.category.name }}
                </td>
                <td>
                  {{
                    item.Warehouse_products.name +
                    " " +
                    item.Warehouse_products.articul +
                    " " +
                    item.Warehouse_products.name2
                  }}
                </td>
                <td>{{ item.Transfers.quantity }} dona</td>
                <td>
                  {{ item.name ? item.name : "" }}
                </td>
                <td>
                  {{ item.Transfers.time.replace("T", " ").substring(0, 10) }}
                </td>
                <td>
                  {{
                    _.format(item.Transfers.transfer_price) +
                    " " +
                    item.Currencies.currency
                  }}
                </td>
                <td>
                  <input
                    class="form-control form-control-sm"
                    type="number"
                    :form="transfers.includes(item) ? 'confirm' : false"
                    :min="countCurrency(item, 'oxirgi').min"
                    :max="countCurrency(item, 'oxirgi').max"
                    step="any"
                    required
                    placeholder="oxirgi narx"
                    v-model="item.confirm.oxirgi_narx"
                  />
                </td>
                <td>
                  <input
                    class="form-control form-control-sm"
                    type="number"
                    :form="transfers.includes(item) ? 'confirm' : false"
                    :min="countCurrency(item, 'sotuv').min"
                    :max="countCurrency(item, 'sotuv').max"
                    step="any"
                    required
                    placeholder="sotuv narx"
                    v-model="item.confirm.sotuv_narx"
                  />
                </td>
                <td>
                  <input
                    class="form-control form-control-sm"
                    type="number"
                    :form="transfers.includes(item) ? 'confirm' : false"
                    :min="countCurrency(item, 'vitrina').min"
                    step="any"
                    required
                    placeholder="vitrina narx"
                    v-model="item.confirm.vitrina_narx"
                  />
                </td>
                <td>
                  <select
                    class="form-select form-select-sm"
                    required
                    v-model="item.confirm.currency_id"
                  >
                    <option
                      v-for="item1 in currencies"
                      :key="item1"
                      :value="item1.id"
                    >
                      {{ item1.currency }}
                    </option>
                  </select>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="15">
                  <Pagination
                    :page="page"
                    :pages="pages"
                    :limit="limit"
                    @get="getTransfers"
                  />
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div class="row">
          <div class="col">
            <button
              class="btn btn-sm btn-outline-secondary float-right"
              form="confirm"
              :disabled="!transfers.length"
            >
              Qabul qilish
            </button>
          </div>
        </div>
      </div>
      <div
        class="tab-pane fade"
        id="pills-profile"
        role="tabpanel"
        aria-labelledby="pills-profile-tab"
      >
        <Taminotlar :omborlar="omborlar" v-if="tab == 1" />
      </div>
    </div>
  </div>
</template>

<script>
import * as api from "@/components/Api/Api";
import Pagination from "@/components/Pagination/Pagination.vue";
import Taminotlar from "./Ta'minotQabulQilingan.vue";
export default {
  name: "Ta'minot",
  components: { Taminotlar, Pagination },
  data() {
    return {
      _: Intl.NumberFormat(),
      tab: 0,
      page: 0,
      pages: 1,
      limit: 50,
      from_time: "",
      to_time: "",
      branch: null,
      transfersWaiting: [],
      omborlar: [],
      currencies: [],
      transfers: [],
    };
  },
  created() {
    this.get(this.page, this.limit);
  },
  methods: {
    get(page, limit) {
      this.getBranch(page, limit);
      this.getWarehouses(page, limit);
      this.getCurrencies(page, limit);
    },
    getBranch() {
      api.branch(localStorage.getItem("branch_id")).then((Response) => {
        this.branch = Response.data.branch;
      });
    },
    getWarehouses() {
      api.warehouses().then((Response) => {
        this.omborlar = Response.data;
      });
    },
    getCurrencies() {
      api.currencies().then((Response) => {
        this.currencies = Response.data;
        this.getTransfers(0, 25);
      });
    },
    getTransfers(page, limit) {
      api
        .transfers(
          0,
          "filialga_berish_kutish",
          page,
          limit,
          this.$route.params.id,
          this.from_time,
          this.to_time,
          1,
          1
        )
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.transfersWaiting = Response.data.data;
          this.transfersWaiting.forEach((item) => {
            item.confirm = {
              transfer_id: item.Transfers.id,
              vitrina_narx: 0,
              sotuv_narx: 0,
              oxirgi_narx: 0,
              currency_id: this.currencies[0].id,
            };
          });
        });
    },
    countCurrency(transfer, price_type) {
      const currency = this.currencies.find(
        (item) => item.id == transfer.confirm.currency_id
      );
      if (price_type == "oxirgi")
        return {
          min:
            (transfer.Transfers.transfer_price * transfer.Currencies.price) /
            currency.price,
          max: transfer.confirm.sotuv_narx,
        };
      else if (price_type == "sotuv")
        return {
          min: transfer.confirm.oxirgi_narx,
          max: transfer.confirm.vitrina_narx,
        };
      else if (price_type == "vitrina")
        return {
          min: transfer.confirm.sotuv_narx,
          max: 0,
        };
    },
    acceptTransfer() {
      const transfers = [];
      this.transfers.forEach((item) => {
        transfers.push(item.confirm);
        if (this.transfers.indexOf(item) == this.transfers.length - 1)
          api.acceptTransfer(transfers).then((Response) => {
            api.success().then(() => {
              this.transfers = [];
              this.getTransfers(0, 25);
            });
          });
      });
    },
  },
};
</script>

<style scoped>
.input-group {
  justify-content: center;
}

.responsive {
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 70vh;
}
</style>
