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
            <div>Buyurtma id: {{ order?.Orders?.id }}</div>
            <div class="date-time">
              <b>{{ order?.Orders?.time.split("T")[1].substring(0, 5) }}</b>
              <b>{{ order?.Orders?.time.split("T")[0] }}</b>
            </div>
            <hr />
            <div class="mini-view">
              <div>
                <span>Sotuvchi:</span>
                <span>{{ order?.seller || "" }}</span>
              </div>
              <div v-if="$route.name !== 'kassa'">
                <span>Haydovchi:</span>
                <span>{{ order?.worker || "" }}</span>
              </div>
              <div v-if="$route.name !== 'kassa'">
                <span>Ustanovshik:</span>
                <span>{{ order?.ustanovshik || "" }}</span>
              </div>
              <div v-if="$route.name !== 'kassa'">
                <span>Gruzchik:</span>
                <span>{{ order?.gruzchik || "" }}</span>
              </div>
              <div>
                <span>Mijoz:</span>
                <span>{{ order?.mijoz || "" }}</span>
              </div>
              <div>
                <span>Mahsulotlar soni:</span>
                <span>{{ trades_quantity + " dona" }}</span>
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
                  item.Products.name2 +
                  " - " +
                  item.Products.articul +
                  " - " +
                  item.Products.name
                }}
              </div>
              <div>{{ item.Trades.quantity }}</div>
              <div>
                <div class="discount" v-if="item.Trades.discount">
                  <div class="discount-price">
                    {{ _.format(item.Trades.price) + " so'm" }}
                  </div>
                  <div class="residual-price">
                    <i class="fa fa-tag"></i>
                    {{
                      _.format(item.Trades.price - item.Trades.discount) +
                      " so'm"
                    }}
                  </div>
                </div>
                <div v-else>
                  {{ _.format(item.Trades.price) + " so'm" }}
                </div>
              </div>
            </div>
            <hr />
            <div class="sum">
              <div>
                <span>Chegirmasiz summa:</span>
                <span>
                  {{
                    _.format(balance?.total_price + trades_discount) + " so'm"
                  }}
                </span>
              </div>
              <div>
                <span>Chegirma summa:</span>
                <span>
                  {{ _.format(trades_discount) + " so'm" }}
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
                <span>{{ _.format(item.Incomes.money) + " so'm" }}</span>
              </div>
              <hr />
              <!-- <div>
                <span> Yetkazilganda olinadigan summa: </span>
                <span> {{ _.format(order?.delivery_money) + " so'm" }} </span>
              </div>
              <hr /> -->
              <div>
                <span>Jami summa:</span>
                <span>
                  {{ _.format(balance?.total_price) + " so'm" }}
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
    start(order_id) {
      this.getOrder(order_id);
    },
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
    getOrder(order_id) {
      api.order(order_id || this.id).then((res) => {
        this.order = res.data;
        this.getTrades();
      });
    },
    getTrades() {
      api.trades(this.order.Orders.id || this.id, 0, 50).then((res) => {
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
      });
    },
    getBalance() {
      api.tradeBalance(this.order.Orders.id || this.id).then((res) => {
        this.balance = res.data;
        this.getIncomes();
      });
    },
    getIncomes() {
      api
        .incomes(this.order.Orders.id || this.id, "order", 0, 0, 50)
        .then((res) => {
          this.incomes = res.data.data.sort((a, b) => {
            let x = a.Incomes.comment,
              y = b.Incomes.comment;
            return x > y ? 1 : x < y ? -1 : 0;
          });
          this.getBranch();
        });
    },
    getBranch() {
      api.branch(this.order.Orders.branch_id).then((res) => {
        this.logo = res.data.logo?.logo;
        this.phone = res.data.branch.phone;
      });
      this.createQrcode();
    },
    createQrcode() {
      let div = document.querySelector("#qrcode");
      div.innerHTML = "";
      // String(this.order.id || this.id)
      new QRCode(div, {
        text: "https://taplink.cc/zarmebel",
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
            font-size: small;
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
            font-size: x-small;
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
