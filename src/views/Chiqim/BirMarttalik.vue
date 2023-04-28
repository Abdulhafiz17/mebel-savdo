<template>
  <div class="row my-1">
    <div class="col-md-5 mb-1">
      <input
        class="form-control form-control-sm"
        type="date"
        v-model="from_time"
      />
    </div>
    <div class="col-md-5 mb-1">
      <input
        class="form-control form-control-sm"
        type="date"
        v-model="to_time"
      />
    </div>
    <div class="col-md-2 mb-1">
      <button
        class="btn btn-sm btn-block btn-outline-secondary"
        @click="get(page, limit)"
      >
        <i class="far fa-circle-check" />
      </button>
    </div>
  </div>
  <div
    class="table-responsive"
    :style="'max-height:' + role == 'branch_admin' ? '65vh' : '70vh'"
  >
    <table class="table table-sm table-hover">
      <thead>
        <tr>
          <th>Summa</th>
          <th>Admin summa</th>
          <th>Izoh</th>
          <th>Kim tomonidan</th>
          <th>Sana</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in history" :key="item">
          <td>
            {{ Intl.NumberFormat().format(item.Expenses.price) }}
            {{ item.Expenses.currency.currency }}
          </td>
          <td>
            {{ Intl.NumberFormat().format(item.Expenses.for_admin_price) }}
            {{ item.Currencies.currency }}
          </td>
          <td>{{ item.Expenses.comment }}</td>
          <td>{{ item.Expenses.user.name }}</td>
          <td>{{ item.Expenses.time.replace("T", " ") }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="4">
            <Pagination :page="page" :pages="pages" :limit="limit" @get="get" />
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
  name: "Variable",
  components: { Pagination },
  data() {
    return {
      role: localStorage["role"],
      branch_id: this.$route.query.branch_id || 0,
      page: 0,
      pages: 1,
      limit: 50,
      from_time: "",
      to_time: "",
      history: [],
    };
  },
  created() {
    this.get(this.page, this.limit);
  },
  methods: {
    get(page, limit) {
      api
        .variableExpenses(
          page,
          limit,
          this.branch_id,
          this.from_time,
          this.to_time
        )
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.history = Response.data.data;
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
}
</style>
