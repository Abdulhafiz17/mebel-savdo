<template>
  <form class="row" @submit.prevent="getHistory(0, 25)">
    <div class="col-md-5">
      <input
        type="date"
        class="form-control form-control-sm"
        required
        v-model="from_time"
      />
    </div>
    <div class="col-md-5">
      <input
        type="date"
        class="form-control form-control-sm"
        required
        v-model="to_time"
      />
    </div>
    <div class="col-md-2">
      <button class="btn btn-sm btn-block btn-outline-primary">
        <i class="fa fa-check"></i>
      </button>
    </div>
  </form>
  <div class="table-responsive mt-2" style="max-height: 70vh">
    <div class="row my-1">
      <div class="col-12 text-left">
        <h5>Buyurtma savdolar</h5>
        <table class="table table-sm table-hover" v-if="data?.trades?.length">
          <thead>
            <tr>
              <th>Kategoriya</th>
              <th>Kodi</th>
              <th>Artikul</th>
              <th>Nomi</th>
              <th>Narx</th>
              <th>Chegirma</th>
              <th>Miqdor</th>
              <th>Summa</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in data?.trades" :key="i">
              <td>
                {{ i.Categories.name }}
              </td>
              <td>
                {{ i.Products.name2 }}
              </td>
              <td>
                {{ i.Products.articul }}
              </td>
              <td>
                {{ i.Products.name }}
              </td>
              <td>
                {{ Intl.NumberFormat().format(i.total_price) + " so'm" }}
              </td>
              <td>
                {{ Intl.NumberFormat().format(i.Trades.discount) + " so'm" }}
              </td>
              <td>
                {{ i.Trades.quantity + " dona" }}
              </td>
              <td>
                {{
                  Intl.NumberFormat().format(
                    (i.Trades.price - i.Trades.discount) * i.Trades.quantity
                  ) + " so'm"
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <hr />
      <div class="col-12 text-left">
        <h5>Oldindan buyurtma savdolar</h5>
        <table
          class="table table-sm table-hover"
          v-if="data?.pre_order_trades?.length"
        >
          <thead>
            <tr>
              <th>Kategoriya</th>
              <th>Kodi</th>
              <th>Artikul</th>
              <th>Nomi</th>
              <th>Narx</th>
              <th>Chegirma</th>
              <th>Miqdor</th>
              <!-- <th >Qaytarilgan</th> -->
              <th>Summa</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in data?.pre_order_trades" :key="i">
              <td>
                {{ i.Warehouse_products.category.name }}
              </td>
              <td>
                {{ i.Warehouse_products.name2 }}
              </td>
              <td>
                {{ i.Warehouse_products.articul }}
              </td>
              <td>
                {{ i.Warehouse_products.name }}
              </td>
              <td>
                {{ Intl.NumberFormat().format(i.total_price) + " so'm" }}
              </td>
              <td>
                {{
                  Intl.NumberFormat().format(i.Trades_pre_order.discount) +
                  " so'm"
                }}
              </td>
              <td>
                {{ i.Trades_pre_order.quantity + " dona" }}
              </td>
              <!-- <td >
                  {{ findProduct(i) + " dona" }}
                </td> -->
              <td>
                {{
                  Intl.NumberFormat().format(
                    (i.Trades_pre_order.price - i.Trades_pre_order.discount) *
                      i.Trades_pre_order.quantity
                  ) + " so'm"
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <hr />
      <div class="col-12 text-left">
        <h5>Qaytarib olindan mahsulotlar</h5>
        <table
          class="table table-sm table-hover"
          v-if="data?.returned_pr_verification?.length"
        >
          <thead>
            <tr>
              <th>Kategoriya</th>
              <th>Kodi</th>
              <th>Artikul</th>
              <th>Nomi</th>
              <th>Miqdor</th>
              <th>Hodim</th>
              <th>Sana</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in data?.returned_pr_verification" :key="i">
              <td>
                {{ i.Categories.name }}
              </td>
              <td>
                {{ i.Products.name2 }}
              </td>
              <td>
                {{ i.Products.articul }}
              </td>
              <td>
                {{ i.Categories.name }}
              </td>
              <td>
                {{ i.sum_quantity + " dona" }}
              </td>
              <td>{{ i.user }}</td>
              <td>
                {{
                  i.Returned_products.time
                    .replace("T", " ")
                    .substring(i.Returned_products.time.length - 3, 0)
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from "@/components/Api/Api";
export default {
  name: "XYZ",
  data() {
    return {
      branch_id: this.$route.params.id,
      from_time: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString()
        .substring(0, 10),
      to_time: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() + 1
      )
        .toISOString()
        .substring(0, 10),
      data: null,
    };
  },
  created() {
    this.getHistory(0, 25);
  },
  methods: {
    getHistory(page, limit) {
      api.xyz(this.from_time, this.to_time, this.branch_id).then((res) => {
        this.data = res.data;
      });
    },
  },
};
</script>
