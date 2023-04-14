<template>
  <div class="body">
    <div class="row my-1">
      <div class="col-md-5">
        <input
          type="date"
          class="form-control form-control-sm"
          v-model="from_date"
        />
      </div>
      <div class="col-md-5">
        <input
          type="date"
          class="form-control form-control-sm"
          v-model="to_date"
        />
      </div>
      <div class="col-md-2">
        <button
          class="btn btn-sm btn-block btn-outline-secondary"
          @click="getExpenses(0, 25)"
        >
          <i class="far fa-circle-check" />
        </button>
      </div>
    </div>
    <div class="table-responsive my-1">
      <table class="table table-sm table-hover">
        <thead>
          <tr>
            <th>Summa</th>
            <th>Izoh</th>
            <th>Hodim</th>
            <th>Sana</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in history" :key="item">
            <td>
              {{
                Intl.NumberFormat().format(item.price) +
                " " +
                item.currency.currency
              }}
            </td>
            <td>{{ item.comment }}</td>
            <td>{{ item.user.name }}</td>
            <td>
              {{
                item.time.replace("T", " ").substring(0, item.time.length - 3)
              }}
            </td>
            <td>
              <button
                class="btn btn-sm btn-outline-success"
                @click="confirmExpense(item.id)"
                v-if="!item.status"
              >
                <i class="far fa-circle-check"></i>
              </button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="4">
              <Pagination
                :page="page"
                :pages="pages"
                :limit="limit"
                @get="getExpenses"
              />
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script>
import * as api from "@/components/Api/Api";
import Pagination from "@/components/Pagination/Pagination.vue";
export default {
  name: "Tolov",
  components: { Pagination },
  data() {
    return {
      page: 0,
      pages: 1,
      limit: 25,
      from_date: "",
      to_date: "",
      branch: null,
      balances: [],
      history: [],
      currencies: [],
    };
  },
  created() {
    this.getBranch(0, 25);
  },
  methods: {
    getBranch() {
      api.branch(this.$route.params.id).then((Response) => {
        this.branch = Response.data.branch;
        this.balances = this.branch.balances;
        if (this.balances.length) {
          this.balances.forEach((item, index) => {
            if (
              this.currencies.find((item2) => {
                return item2.id == item.currency_id;
              }) == undefined
            ) {
              this.currencies.push(item.currency);
            }
            if (index == this.balances.length - 1) {
              this.getExpenses(0, 25);
            }
          });
        }
      });
    },
    getExpenses(page, limit) {
      api
        .adminExpenses(
          this.$route.params.id,
          this.from_date,
          this.to_date,
          page,
          limit
        )
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.history = Response.data.data;
        });
    },
    confirmExpense(id) {
      api.confirmAdminExpense(id).then((res) => {
        api.success().then(() => {
          this.getExpenses(0, 25);
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
.table-responsive {
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 60vh;
}
</style>
