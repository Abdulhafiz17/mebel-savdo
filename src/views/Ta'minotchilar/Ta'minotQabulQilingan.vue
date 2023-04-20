<template>
  <div class="row">
    <div class="col-md-3 mb-1">
      <select class="form-select form-select-sm" v-model="warehouse_id">
        <option value="0">Barcha omborlar</option>
        <option v-for="item in omborlar" :key="item" :value="item.id">
          {{ item.name }}
        </option>
      </select>
    </div>
    <div class="col-md-4 mb-1">
      <input
        class="form-control form-control-sm"
        type="date"
        v-model="from_time"
      />
    </div>
    <div class="col-md-4 mb-1">
      <input
        class="form-control form-control-sm"
        type="date"
        v-model="to_time"
      />
    </div>
    <div class="col-md-1 mb-1">
      <button
        class="btn btn-sm btn-block btn-outline-secondary"
        @click="get(0, 25)"
      >
        <i class="far fa-circle-check" />
      </button>
    </div>
  </div>

  <div class="responsive">
    <div class="table-responsive">
      <table class="table table-sm table-hover">
        <thead>
          <tr>
            <th>Kategoriya</th>
            <th>Mahsulot</th>
            <th>Soni</th>
            <th>Narx</th>
            <th>Ombor</th>
            <th>Sana</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in transfers.data" :key="item">
            <td>{{ item.Warehouse_products.category.name }}</td>
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
              {{ Intl.NumberFormat().format(item.Transfers.transfer_price) }}
              {{ item.Currencies.currency }}
            </td>
            <td>
              {{ item.name }}
            </td>
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
            <td colspan="7">
              <Pagination
                :page="transfers.current_page"
                :pages="transfers.pages"
                :limit="transfers.limit"
                @get="get"
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
  name: "Taminotlar",
  props: ["omborlar"],
  components: { Pagination },
  data() {
    return {
      warehouse_id: 0,
      from_time: "",
      to_time: "",
      transfers: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
    };
  },
  created() {
    this.get(0, 25);
  },
  mounted() {
    document.querySelector("#pills-profile-tab").onclick = () => {
      this.get(0, 50);
    };
  },
  methods: {
    get(page, limit) {
      api
        .transfers(
          this.warehouse_id,
          "filialga_berish_tasdiqlandi",
          page,
          limit,
          this.$route.params.id,
          this.from_time,
          this.to_time,
          0,
          0
        )
        .then((Response) => {
          this.transfers = Response.data;
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
