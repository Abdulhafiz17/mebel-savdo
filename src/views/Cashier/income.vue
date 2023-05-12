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
        <tr v-for="item in incomes.data" :key="item">
          <td>
            {{ $util.currency(item.Incomes.money) + " so'm" }}
          </td>
          <td>{{ item.Incomes.comment }}</td>
          <td>{{ incomeType(item.Incomes.status) }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.Incomes.time.replace("T", " ").substring(0, 16) }}</td>
          <td></td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="6">
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

  <div class="modal fade" id="filter">
    <div class="modal-dialog modal-sm">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Filter</h4>
        </div>
        <div class="modal-body">
          <select class="form-select" v-model="type">
            <option value="kassa">Hammasi</option>
            <option value="order">Buyurtma</option>
            <option value="loan" v-if="role == 'branch_admin'">Nasiya</option>
            <option value="from_user">Transport xodimi</option>
          </select>
        </div>
        <div class="modal-footer">
          <button
            class="btn btn-outline-primary"
            data-dismiss="modal"
            @click="getIncomes(0, 25)"
          >
            <i class="far fa-circle-check"></i>
          </button>
          <button
            class="btn btn-outline-danger"
            data-dismiss="modal"
            @click="
              type = 'kassa';
              getIncomes(0, 25);
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
  name: "income",
  components: { Pagination },
  data() {
    return {
      type: "kassa",
      incomes: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
    };
  },
  created() {
    this.getIncomes(0, 25);
  },
  methods: {
    getIncomes(page = 0, limit = 25) {
      api
        .incomes(0, this.type, this.$route.params.id, page, limit)
        .then((res) => {
          this.incomes = res.data;
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
