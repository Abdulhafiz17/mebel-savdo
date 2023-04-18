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
          <th>
            <button
              class="btn btn-sm btn-outline-info"
              data-toggle="modal"
              data-target="#filter"
            >
              <i class="fa fa-filter"></i>
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in expenses.data" :key="item">
          <td>
            {{ $util.currency(item.Expenses.price) + " so'm" }}
          </td>
          <td>{{ item.Expenses.comment }}</td>
          <td>
            {{
              item.Expenses.type == "fixed_expense"
                ? item.source
                : expenseType(item.Expenses.type)
            }}
          </td>
          <td>{{ item.Expenses.user.name }}</td>
          <td>{{ item.Expenses.time.replace("T", " ").substring(0, 16) }}</td>
          <td></td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="6">
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

  <div class="modal fade" id="filter">
    <div class="modal-dialog modal-sm">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Filter</h4>
        </div>
        <div class="modal-body">
          <div class="row gap-1 text-left">
            <div class="col-12">
              Dan
              <input type="date" class="form-control" v-model="from_time" />
            </div>
            <div class="col-12">
              Gacha
              <input type="date" class="form-control" v-model="to_time" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            class="btn btn-outline-primary"
            data-dismiss="modal"
            @click="getExpenses(0, 25)"
          >
            <i class="far fa-circle-check"></i>
          </button>
          <button
            class="btn btn-outline-danger"
            data-dismiss="modal"
            @click="
              from_time = '';
              to_time = '';
              getExpenses(0, 25);
            "
          >
            <i class="fa fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
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
      types: [],
      from_time: "",
      to_time: "",
      expenses: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
    };
  },
  created() {
    this.getExpenses();
  },
  methods: {
    get() {},
    expenseType(type) {
      if (type == "fixed_expense") return "Doimiy chiqim";
      else if (type == "variable_expense") return "Bir marttalik chiqim";
    },
    getExpenses(page = 0, limit = 25) {
      api
        .kassaExpenses(
          this.from_time,
          this.to_time,
          this.$route.params.id,
          page,
          limit
        )
        .then((res) => {
          this.expenses = res.data;
        });
    },
  },
};
</script>
