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
            <div class="check-img" v-if="logo">
              <img :src="`${api.url_to_files}/${logo}`" :alt="logo" />
            </div>
            <div>Buyurtma id: {{ order?.Pre_orders?.id }}</div>
            <div class="date-time">
              <b>{{ order?.Pre_orders?.time.split("T")[1].substring(0, 5) }}</b>
              <b>{{ order?.Pre_orders?.time.split("T")[0] }}</b>
            </div>
            <hr />
            <div class="mini-view">
              <div>
                <span>Sotuvchi:</span>
                <span>{{ order?.seller || "" }}</span>
              </div>
              <div v-if="$route.name !== 'pre-order'">
                <span>Omborchi:</span>
                <span>{{ order?.warehouseman || "" }}</span>
              </div>
              <div v-if="$route.name !== 'pre-order'">
                <span>Haydovchi:</span>
                <span>{{ order?.worker || "" }}</span>
              </div>
              <div v-if="$route.name !== 'pre-order'">
                <span>Ustanovshik:</span>
                <span>{{ order?.ustanovshik || "" }}</span>
              </div>
              <div v-if="$route.name !== 'pre-order'">
                <span>Gruzchik:</span>
                <span>{{ order?.gruzchik || "" }}</span>
              </div>
              <div>
                <span>Mijoz:</span>
                <span>{{ order?.Customers?.name || "" }}</span>
              </div>
              <div>
                <span>Mahsulotlar soni:</span>
                <span>{{ $util.currency(trades_quantity) + " dona" }}</span>
              </div>
            </div>
            <hr />
            <div class="products">
              <div><b>Mahsulot</b></div>
              <div><b>Dona</b></div>
              <div v-if="show_price"><b>Narx</b></div>
            </div>
            <div class="products" v-for="item in trades" :key="item">
              <div>
                {{
                  item.Warehouse_products.category.name +
                  " - " +
                  item.Warehouse_products.name2 +
                  " - " +
                  item.Warehouse_products.articul +
                  " - " +
                  item.Warehouse_products.name
                }}
              </div>
              <div>{{ item.sum_quantity }}</div>
              <div v-if="show_price">
                <div class="discount" v-if="item.Trades_pre_order.discount">
                  <div class="discount-price">
                    {{ _.format(item.Trades_pre_order.price) + " so'm" }}
                  </div>
                  <div class="residual-price">
                    <i class="fa fa-tag"></i>
                    {{
                      _.format(
                        item.Trades_pre_order.price -
                          item.Trades_pre_order.discount
                      ) + " so'm"
                    }}
                  </div>
                </div>
                <div v-else>
                  {{ _.format(item.Trades_pre_order.price) + " so'm" }}
                </div>
              </div>
            </div>
            <hr v-if="show_price" />
            <div class="sum">
              <div v-if="show_price">
                <span>Chegirmasiz summa:</span>
                <span>
                  {{
                    _.format(balance?.total_price + trades_discount) + " so'm"
                  }}
                </span>
              </div>
              <div v-if="show_price">
                <span>Chegirma summa:</span>
                <span>
                  {{ _.format(trades_discount) + " so'm" }}
                </span>
              </div>
              <hr v-if="show_price" />
              <div
                v-for="item in incomes"
                :key="item"
                v-show="item.Incomes.money"
              >
                <span v-if="show_price">
                  {{ item.Incomes.comment + ":" }}
                </span>
                <span v-if="show_price">{{
                  _.format(item.Incomes.money) + " so'm"
                }}</span>
              </div>
              <hr v-if="show_price" />
              <div>
                <span>Yetkazilganda olinadigan summa:</span>
                <span>{{
                  $util.currency(order?.Pre_orders.delivery_money) + " so'm"
                }}</span>
              </div>
              <hr v-if="show_price" />
              <div v-if="show_price">
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
    // order: { default: null },
  },
  data() {
    return {
      _: Intl.NumberFormat(),
      role: localStorage["role"],
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
    show_price() {
      if (
        [
          "admin",
          "branch_admin",
          "cashier",
          // "logistika",
          // "warehouseman",
        ].includes(this.role)
      )
        return true;
      else return false;
    },
  },
  created() {},
  methods: {
    start(order_id) {
      if (
        [
          "admin",
          "branch_admin",
          "cashier",
          "logistika",
          "warehouseman",
        ].includes(this.role)
      )
        this.getOrder(order_id);
      else {
        this.order = { Pre_orders: { id: order_id } };
        this.getTrades();
      }
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
      api.preOrder(order_id || this.id).then((res) => {
        this.order = res.data;
        this.getTrades("createQrcode");
      });
    },
    getTrades() {
      api
        .preOrderTrades(this.order.Pre_orders.id || this.id, 0, 0, 100)
        .then((res) => {
          this.trades = res.data.data;
          let quantity = null,
            discount = null;
          this.trades.forEach((item) => {
            quantity += item.sum_quantity;
            discount += item.Trades_pre_order.discount * item.sum_quantity;
          });
          this.trades_quantity = quantity;
          this.trades_discount = discount;
          if (
            [
              "admin",
              "branch_admin",
              "cashier",
              "logistika",
              "warehouseman",
            ].includes(this.role)
          )
            this.getBalance();
          else this.printCheck();
        });
    },
    getBalance() {
      api
        .preOrderTradeBalance(this.order.Pre_orders.id || this.id)
        .then((res) => {
          this.balance = res.data;
          this.getIncomes();
        });
    },
    getIncomes() {
      api
        .incomes(this.order.Pre_orders.id || this.id, "pre_order", 0, 0, 50)
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
      api.branch(this.order.Pre_orders.branch_id).then((res) => {
        this.logo = res.data.logo?.logo;
        this.phone = res.data.branch.phone;
        this.createQrcode();
      });
    },
    createQrcode() {
      let div = document.querySelector("#qrcode");
      div.innerHTML = "";
      // String(this.id)
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
            font-size: small;
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
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
