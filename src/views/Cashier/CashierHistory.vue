<template>
  <h3><span class="fa fa-cash-register" /> {{ "Kassa " + cashier?.name }}</h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4"></div>
  </div>
  <hr />

  <ul
    v-if="!cashier?.branch_id"
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
          type = 'from_kassa_to_second_kassa';
          history = {
            current_page: 0,
            pages: 1,
            limit: 25,
            data: [],
          };
          getHistory(0, 25);
        "
      >
        Kassadan kassaga
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
            <th>
              <button
                class="btn btn-sm btn-outline-primary"
                @click="
                  between_cashiers = between_cashiers == 'from' ? 'to' : 'from';
                  getHistory(0, 25);
                "
                v-if="type == 'from_kassa_to_second_kassa'"
              >
                Ushbu {{ between_cashiers == "from" ? "kassadan" : "kassaga" }}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in history.data" :key="item">
            <td>
              {{ $util.currency(item.Kassa_history.money) + " so'm" }}
            </td>
            <td>{{ item.Kassa_history.comment }}</td>
            <td>{{ item.user }}</td>
            <td>{{ cashierName(item) }}</td>
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
      type: "income",
      cashier: null,
      between_cashiers: "from",
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
  },
  methods: {
    getCashier() {
      api.kassa("", this.$route.params.id, 0).then((res) => {
        this.cashier = res.data;
        if (this.cashier.branch_id) this.type = "expense";
        else this.type = "income";
        this.getHistory(0, 25);
      });
    },
    getHistory(page = 0, limit = 25) {
      let from_id = this.type == "income" ? 0 : this.$route.params.id;
      let to_id = this.type == "expense" ? 0 : this.$route.params.id;
      let type = "";
      if (this.cashier.branch_id) {
        type = "from_kassa_to_kassa";
      } else {
        if (this.type == "income") type = "from_kassa_to_kassa";
        else if (this.type == "expense") type = "from_kassa_to_admin";
        else type = this.type;
      }
      if (this.type == "from_kassa_to_second_kassa") {
        if (this.between_cashiers == "from") {
          from_id = this.$route.params.id;
          to_id = 0;
        }
        if (this.between_cashiers == "to") {
          to_id = this.$route.params.id;
          from_id = 0;
        }
      }
      api.kassaHistory(from_id, to_id, type, page, limit).then((res) => {
        this.history = res.data;
      });
    },
    cashierName(item) {
      if (this.type == "income") {
        return item.from_kassa;
      } else if (this.type == "expense") {
        return item.name_for_to;
      } else {
        if (this.between_cashiers == "from") {
          return item.name_for_to;
        } else if (this.between_cashiers == "to") {
          return item.from_kassa;
        }
      }
    },
  },
};
</script>
