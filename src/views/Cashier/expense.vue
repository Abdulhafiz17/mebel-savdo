<template>
  <div class="table-responsive" style="max-height: 72vh">
    <table class="table table-sm table-hover">
      <thead>
        <tr>
          <th>Summa</th>
          <th>Izoh</th>
          <th>Turi</th>
          <th>Hodim</th>
          <th>Sana</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in expenses.data" :key="item">
          <td>
            {{ $util.currency(item.Incomes.money) + " so'm" }}
          </td>
          <td>{{ item.Incomes.comment }}</td>
          <td>{{ incomeType(item.Incomes.status) }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.Incomes.time.replace("T", " ").substring(0, 16) }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="5">
            <Pagination
              :page="incomes.current_page"
              :pages="incomes.pages"
              :limit="incomes.limit"
              @get="getIncomes"
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
  name: "expense",
  components: { Pagination },
  data() {
    return {
      expenses: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
    };
  },
  created() {
    this.getExpenses(0, 25);
  },
  methods: {
    getExpenses(page = 0, limit = 25) {
      api.incomes(this.$route.params.id, "kassa", page, limit).then((res) => {
        this.expense = res.data;
      });
    },
    incomeType(type) {
      if (type == "order") return "Buyurtma";
      else if (type == "loan") return "Nasiya";
      else if (type == "from_user") return "Transport xodimi";
    },
  },
};
</script>
