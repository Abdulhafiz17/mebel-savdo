<template>
  <div class="receipt responsive" v-show="show" id="transfer-check">
    <ul class="list">
      <li>Haydovchi: {{ worker?.name || "" }}</li>
      <li v-if="ustanovshik">Ustanovshik: {{ ustanovshik?.name }}</li>
    </ul>
    <hr />
    <ul class="list">
      <li v-for="(item, i) in transfers" :key="item">
        {{ i + 1 }}
        <br />
        {{ item.Warehouse_products.category.name || "" }}
        <br />
        {{ item.Warehouse_products.name2 }}
        <br />
        {{ item.Warehouse_products.articul }}
        <br />
        {{ item.Warehouse_products.name }}
        <br />
        {{ item.Transfers.quantity }} dona
        <br />
        {{ item.name }}
        <br />
        {{ item.warehouseman || "" }}
        <br v-if="item.warehouseman" />
        {{ item.branch }}
        <br />
        {{ item.Transfers.time.replace("T", " ") }}
      </li>
    </ul>
    <div class="signature">____________________</div>
  </div>
</template>

<script>
export default {
  name: "transfer-receipt",
  data() {
    return {
      show: false,
      transfers: [],
      worker: null,
      ustanovshik: null,
    };
  },
  methods: {
    start() {
      let check = document.getElementById("transfer-check").innerHTML;
      let winPrint = window.open();
      winPrint.document.head.innerHTML += `
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css" integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w==" crossorigin="anonymous" referrerpolicy="no-referrer" />
        <style>
          * {
            box-sizing: border-box;
            font-size: small;
          }
          .receipt {
            position: absolute;
            top: 0;
            bottom: 0;
            padding: 10px;
            width: 8cm;
            background-color: rgb(0, 0, 0, 0.5);
            backdrop-filter: blur(3px);
            z-index: 10;
          }
  
          .list {
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            gap: 2px;
            text-align: left;
            font-size: small;
            list-style: none;
          }
  
          .signature {
            margin-top: 40px;
            text-align: right;
          }
        </style>`;
      winPrint.document.body.innerHTML = check;
      setTimeout(() => {
        winPrint.print();
        winPrint.close();
      }, 500);
    },
  },
};
</script>
