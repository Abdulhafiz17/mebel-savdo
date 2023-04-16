<template>
  <button
    data-toggle="modal"
    data-target="#admin-check"
    v-show="false"
  ></button>
  <div class="modal fade" id="admin-check">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Admin hisoboti</h4>
        </div>
        <div class="modal-body">
          <div id="adminCheck">
            <div class="check-img">
              <img
                :src="api.url_to_files + '/' + logo"
                :alt="logo"
                @error="getBranch()"
              />
            </div>
            <div class="date">{{ date }}</div>
            <span>
              Umumiy tan narx:
              <strong>
                {{ _.format(data?.trade_total_tan_narx) + " so'm" }}
              </strong>
            </span>
            <span>
              Umumiy savdo:
              <strong>
                {{ _.format(data?.trade_total_price) + " so'm" }}
              </strong>
            </span>
            <span>
              Umumiy vozvrat:
              <strong>
                {{ _.format(data?.returned_price) + " so'm" }}
              </strong>
            </span>
            <hr />
            <div class="date">Kirim</div>
            <span v-show="data?.incomes_trade.length">
              Savdo
              <strong>
                <span
                  v-for="item in data?.incomes_trade"
                  :key="item"
                  v-show="item.sum_price"
                >
                  {{ _.format(item.sum_price) + " so'm " + item.type }}
                  <br />
                </span>
              </strong>
            </span>
            <span v-show="data?.incomes_loan.length">
              Nasiya
              <strong>
                <span
                  v-for="item in data?.incomes_loan"
                  :key="item"
                  v-show="item.sum_price"
                >
                  {{ _.format(item.sum_price) + " so'm " + item.type }}
                </span>
                <br />
              </strong>
            </span>
            <hr />
            <span>
              Umumiy chiqim:
              <strong>
                <span v-for="item in data?.expenses" :key="item">
                  {{ _.format(item.sum_price) + " so'm" }}
                </span>
              </strong>
            </span>
            <!-- <hr />
            <div class="date">Chegirmadan qolgan summa</div>
            <span>
              Adminga:
              <strong>
                {{ _.format(data?.total_admin_discount) + " so'm" }}
              </strong>
            </span>
            <span>
              Filialga:
              <strong>
                {{ _.format(data?.trade_total_discount) + " so'm" }}
              </strong>
            </span>
            <hr />
            <span>
              Oylik:
              <strong>
                {{ _.format(data?.total_profit) + " so'm" }}
              </strong>
            </span>
            <span>
              Maosh:
              <strong>
                {{ _.format(data?.maosh) + " so'm" }}
              </strong>
            </span>
            <span>
              Nasiya maosh:
              <strong>
                {{ _.format(data?.nasiya_maosh) + " so'm" }}
              </strong>
            </span>
            <hr />
            <span>
              Admin summa:
              <strong>
                {{ _.format(data?.admin_price) + " so'm" }}
              </strong>
            </span>
            <span>
              Admin oldi:
              <strong>
                {{ _.format(data?.admin_oldi) + " so'm" }}
              </strong>
            </span>
            <span>
              Admin terminal:
              <strong>
                {{ _.format(data?.income_p_sum) + " so'm" }}
              </strong>
            </span>
            <span>
              Admin nasiya:
              <strong>
                {{ _.format(data?.order_loan_sum_admin) + " so'm" }}
              </strong>
            </span> -->
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-primary" @click="printCheck()">
            <i class="fa fa-print"></i>
          </button>
          <button class="btn btn-outline-danger" data-dismiss="modal">
            <i class="far fa-circle-xmark"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from "../Api/Api";
export default {
  name: "AdminChek",
  props: ["branchCurrency"],
  emits: ["setloading"],
  data() {
    return {
      _: Intl.NumberFormat(),
      date: new Date().toLocaleDateString("ru-RU"),
      branch_id: localStorage["branch_id"],
      logo: null,
      data: null,
    };
  },
  computed: {
    currency() {
      return this.$props.branchCurrency;
    },
  },
  setup() {
    return { api };
  },
  created() {
    this.getBranch();
  },
  methods: {
    getBranch() {
      api.branch(this.branch_id).then((res) => {
        this.logo = res.data.logo.logo;
      });
    },
    start() {
      this.get();
    },
    get() {
      this.$emit("setloading", true);
      api
        .distribute()
        .then((res) => {
          delete res.data.orders;
          this.data = res.data;
          this.$emit("setloading", false);
          document.querySelector(`[data-target="#admin-check"]`).click();
        })
        .catch((err) => {
          this.$emit("setloading", false);
          api.catchError(err);
        });
    },
    printCheck() {
      let div = document.querySelector("#adminCheck").outerHTML;
      let winPrint = open("", "_balnk");
      winPrint.document.head.innerHTML += `
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          #adminCheck {
            width: 300px;
            padding: 10px;
          }
          @media print {
            #adminCheck {
              width: 100%;
            }
          }
          #adminCheck > span {
            padding: 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .date {
            text-align: center;
          }
          .check-img {
            padding: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          }
          img {
            width: 50%;
            object-fit: contain;
          }
        </style>
      `;
      winPrint.document.body.innerHTML = div;
      setTimeout(() => {
        winPrint.print();
        winPrint.close();
      }, 100);
    },
  },
};
</script>

<style scoped>
#adminCheck > span {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.check-img {
  width: 100%;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
img {
  width: 50%;
  object-fit: contain;
}
</style>
