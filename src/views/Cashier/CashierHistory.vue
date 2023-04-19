<template>
  <h3><span class="fa fa-cash-register" /> {{ "Kassa " + cashier?.name }}</h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4"></div>
  </div>
  <hr />

  <ul
    v-if="role !== 'branch_admin'"
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
          type = 'income';
          history = {
            current_page: 0,
            pages: 1,
            limit: 25,
            data: [],
          };
          getHistory(0, 25);
        "
      >
        Kirim
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
          type = 'expense';
          history = {
            current_page: 0,
            pages: 1,
            limit: 25,
            data: [],
          };
          getHistory(0, 25);
        "
      >
        Chiqim
      </button>
    </li>
  </ul>
  <div class="tab-content" id="pills-tabContent">
    <div class="table-responsive" style="max-height: 72vh">
      <table class="table table-sm table-hover">
        <thead>
          <tr>
            <th>Summa</th>
            <th>Izoh</th>
            <th>Hodim</th>
            <th>Kassa</th>
            <th>Sana</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in history.data" :key="item">
            <td>
              {{ $util.currency(item.Kassa_history.money) + " so'm" }}
            </td>
            <td>{{ item.Kassa_history.comment }}</td>
            <td>{{ item.user }}</td>
            <td>{{ type == "income" ? item.from_kassa : item.name_for_to }}</td>
            <td>
              {{ item.Kassa_history.time.replace("T", " ").substring(0, 16) }}
            </td>
            <td></td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="6">
              <Pagination
                :page="history.current_page"
                :pages="history.pages"
                :limit="history.limit"
                @get="getHistory"
              />
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
    <div
      class="tab-pane fade"
      id="pills-profile"
      role="tabpanel"
      aria-labelledby="pills-profile-tab"
    ></div>
  </div>
</template>

<script>
import * as api from "@/components/Api/Api.js";
import Pagination from "@/components/Pagination/Pagination.vue";
export default {
  name: "CashierHistory",
  components: { Pagination },
  data() {
    return {
      role: localStorage["role"],
      type: localStorage["role"] == "branch_admin" ? "expense" : "income",
      cashier: null,
      history: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
    };
  },
  created() {
    this.getCashier();
    this.getHistory(0, 25);
  },
  methods: {
    getCashier() {
      api.kassa("", this.$route.params.id, 0).then((res) => {
        this.cashier = res.data;
      });
    },
    getHistory(page = 0, limit = 25) {
      const from_id = this.type == "income" ? 0 : this.$route.params.id;
      const to_id = this.type == "expense" ? 0 : this.$route.params.id;
      const type =
        this.type == "income" ? "from_kassa_to_kassa" : "from_kassa_to_admin";
      api.kassaHistory(from_id, to_id, type, page, limit).then((res) => {
        this.history = res.data;
      });
    },
  },
};
</script>
