<template>
  <h3><span class="fa fa-user-group" /> {{ user?.name }} to'lov tarixi</h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4"></div>
  </div>
  <hr />
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
  <div class="table-responsive my-1" style="max-height: 65vh">
    <table class="table table-sm table-hover">
      <thead>
        <tr>
          <th>Summa</th>
          <th>Izoh</th>
          <th>Hodim</th>
          <th>Kassa</th>
          <th>Sana</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in expenses.data" :key="item">
          <td>
            {{ Intl.NumberFormat().format(item.Expenses.price) + " so'm" }}
          </td>
          <td>{{ item.Expenses.comment }}</td>
          <td>{{ item.Expenses.user.name }}</td>
          <td>{{ item.kassa }}</td>
          <td>
            {{
              item.Expenses.time
                .replace("T", " ")
                .substring(0, item.Expenses.time.length - 3)
            }}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="5">
            <Pagination
              :page="expenses.current_page"
              :pages="expenses.pages"
              :limit="expenses.limit"
              @get="getExpenses"
            />
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import * as api from "@/components/Api/Api.js";
import Pagination from "@/components/Pagination/Pagination.vue";
export default {
  name: "tolov",
  components: { Pagination },
  data() {
    return {
      user: null,
      from_date: "",
      to_date: "",
      expenses: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
    };
  },
  created() {
    this.getUser();
    this.getExpenses(0, 25);
  },
  methods: {
    getUser() {
      api.user().then((res) => {
        this.user = res.data;
      });
    },
    getExpenses(page, limit) {
      api
        .userExpenses(
          this.$route.params.id,
          this.from_date,
          this.to_date,
          page,
          limit
        )
        .then((Response) => {
          this.expenses = Response.data;
        });
    },
  },
};
</script>
