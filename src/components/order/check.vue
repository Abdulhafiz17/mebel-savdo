<template>
  <button
    v-show="false"
    data-toggle="modal"
    data-target="#modal-check"
    modal-check-button
  ></button>

  <div class="modal fade" id="modal-check">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body" id="check">
          <div id="order-check">
            <div class="check-img">
              <img :src="`${api.url_to_files}/${logo}`" :alt="logo" />
            </div>
            <div class="news">
              Yangiliklardan <br />
              habardor bo'ling !
            </div>
            <div class="social">
              <div><i class="fab fa-telegram-plane"></i> adidas_andijon</div>
              <div><i class="fab fa-instagram"></i> adidas.navruzmall</div>
              <div>
                <i class="fa fa-phone"></i> +998 {{ formatPhoneNumber(phone) }}
              </div>
            </div>
            <div class="news">
              Будьте в курсе <br />
              новостей !
            </div>
            <div class="date-time">
              <b>{{ order?.Orders?.time.split("T")[1].substring(0, 5) }}</b>
              <b>{{ order?.Orders?.time.split("T")[0] }}</b>
            </div>
            <hr />
            <div class="mini-view">
              <div>
                <span>Sotuvchi:</span>
                <span>{{ order?.customer ? order?.customer : "Kassir" }}</span>
              </div>
              <div>
                <span>Mahsulotlar soni:</span>
                <span>{{ trades_quantity + " dona" }}</span>
              </div>
              <div>
                <span>Mijoz:</span>
                <span>{{ order?.customer ? order?.customer : "" }}</span>
              </div>
            </div>
            <hr />
            <div class="products">
              <div><b>Mahsulot</b></div>
              <div><b>Dona</b></div>
              <div><b>Narx</b></div>
            </div>
            <div class="products" v-for="item in trades" :key="item">
              <div>
                {{
                  item.Categories.name +
                  " - " +
                  item.Products.articul +
                  " - " +
                  item.Products.size
                }}
              </div>
              <div>{{ item.Trades.quantity }}</div>
              <div>
                <div class="discount" v-if="item.Trades.discount">
                  <div class="discount-price">
                    {{
                      _.format(item.Trades.price) +
                      " " +
                      item.Currencies.currency
                    }}
                  </div>
                  <div class="residual-price">
                    <i class="fa fa-tag"></i>
                    {{
                      _.format(item.Trades.price - item.Trades.discount) +
                      " " +
                      item.Currencies.currency
                    }}
                  </div>
                </div>
                <div v-else>
                  {{
                    _.format(item.Trades.price) + " " + item.Currencies.currency
                  }}
                </div>
              </div>
            </div>
            <hr />
            <div class="sum">
              <div>
                <span>Chegirmasiz summa:</span>
                <span>
                  {{
                    _.format(balance?.total_price + trades_discount) +
                    " " +
                    balance?.currency
                  }}
                </span>
              </div>
              <div>
                <span>Chegirma summa:</span>
                <span>
                  {{ _.format(trades_discount) + " " + balance?.currency }}
                </span>
              </div>
              <hr />
              <div
                v-for="item in incomes"
                :key="item"
                v-show="item.Incomes.money"
              >
                <span>
                  {{ item.Incomes.comment + ":" }}
                </span>
                <span>{{
                  _.format(item.Incomes.money) + " " + item.currency
                }}</span>
              </div>
              <hr />
              <div>
                <span>Jami summa:</span>
                <span>
                  {{ _.format(balance?.total_price) + " " + balance?.currency }}
                </span>
              </div>
            </div>
            <hr />
            <div class="footer">
              <div>Haridingiz uchun rahmat !</div>
              <div>Thank you for your purchase !</div>
              <div>Спасибо за покупку !</div>
            </div>
            <div id="qrcode"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import * as api from "../Api/Api";
export default {
  name: "check",
  props: {
    orderId: { required: true },
  },
  data() {
    return {
      _: Intl.NumberFormat(),
      branch_id: localStorage["branch_id"],
      logo: localStorage["branch_logo"],
      phone: localStorage["branch_phone"],
      order: null,
      trades: [],
      trades_quantity: null,
      balance: null,
      trades_discount: null,
      incomes: [],
    };
  },
  computed: {
    api() {
      return api;
    },
    id() {
      return this.$props.orderId;
    },
  },
  created() {},
  methods: {
    formatPhoneNumber(number) {
      return String(
        "(" +
          String(number).substr(0, 2) +
          ") " +
          String(number).substr(2, 3) +
          " " +
          String(number).substr(5, 2) +
          " " +
          String(number).substr(7, 2)
      );
    },
    start() {
      this.getBranch();
    },
    getBranch() {
      api.branch(this.branch_id).then((res) => {
        this.logo = res.data.logo.logo;
        this.phone = res.data.branch.phone;
        this.getOrder();
      });
    },
    getOrder() {
      api
        .order(this.id)
        .then((res) => {
          this.order = res.data;
          this.getTrades();
        })
        .catch((err) => {
          api.catchError(err);
        });
    },
    getTrades() {
      api
        .trades(this.id, 0, 50)
        .then((res) => {
          this.trades = res.data.data;
          let quantity = null,
            discount = null;
          this.trades.forEach((item) => {
            quantity += item.Trades.quantity;
            discount += item.Trades.discount * item.Trades.quantity;
          });
          this.trades_quantity = quantity;
          this.trades_discount = discount;
          this.getBalance();
        })
        .catch((err) => {
          api.catchError(err);
        });
    },
    getBalance() {
      api
        .tradeBalance(this.id)
        .then((res) => {
          this.balance = res.data;
          this.getIncomes();
        })
        .catch((err) => {
          api.catchError(err);
        });
    },
    getIncomes() {
      api
        .incomes(this.id, "order", 0, 50)
        .then((res) => {
          this.incomes = res.data.data.sort((a, b) => {
            let x = a.Incomes.comment,
              y = b.Incomes.comment;
            return x > y ? 1 : x < y ? -1 : 0;
          });
          this.createQrcode();
        })
        .catch((err) => {
          api.catchError(err);
        });
    },
    createQrcode() {
      let div = document.querySelector("#qrcode");
      div.innerHTML = "";
      new QRCode(div, {
        text: String(this.id),
        width: 100,
        height: 100,
        colorDark: "black",
      });
      this.printCheck();
    },
    printCheck() {
      let check = document.getElementById("order-check");
      let winPrint = window.open();
      winPrint.document.head.innerHTML += `
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css" integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w==" crossorigin="anonymous" referrerpolicy="no-referrer" />
        <style>
          * {
            box-sizing: border-box;
          }
          #order-check {
            width: 300px;
            text-align: center;
          }

          @media print {
            #order-check {
              width: 100%;
            }
          }

          hr {
            margin: 5px;
          }

          .check-img {
            width: 50%;
            margin: auto;
          }

          .check-img > img {
            width: 100%;
          }

          .news {
            padding: 5px 20px;
            font-size: large;
          }

          .social {
            width: 80%;
            margin: auto;
            padding: 5px;
            display: grid;
            gap: 5px;
            border: 2px solid black;
            border-radius: 5px;
          }

          .date-time {
            display: flex;
            justify-content: space-between;
          }

          .mini-view {
            display: grid;
            gap: 5px;
          }

          .mini-view > div,
          .sum > div {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .products {
            display: flex;
            font-size: small;
          }

          .products > div {
            padding: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .products > div:nth-child(1) {
            width: 50%;
            justify-content: start;
            text-align: start;
          }

          .products > div:nth-child(2) {
            width: 10%;
          }

          .products > div:nth-child(3) {
            width: 40%;
            justify-content: end;
            text-align: end;
          }

          .products > div:nth-child(3) > .discount > .discount-price {
            text-decoration: line-through;
          }

          .products > div:nth-child(3) > .discount > .residual-price {
            font-size: small;
          }

          #qrcode {
            padding: 10px;
            display: flex;
            justify-content: center;
          }
        </style>`;
      winPrint.document.body.append(check);
      setTimeout(() => {
        winPrint.print();
        winPrint.close();
        document.getElementById("check").append(check);
      }, 500);
    },
  },
};
</script>

<style scoped></style>
