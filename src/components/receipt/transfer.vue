<template>
  <div class="receipt responsive" v-show="show">
    <ul class="list">
      <li>Haydovchi: {test}</li>
      <li>Ustanovshik: {test}</li>
    </ul>
    <hr />
    <ul class="list">
      <li v-for="item in 2" :key="item">
        {{ item }}
        <br />
        {category}
        <br />
        {code}
        <br />
        {articul}
        <br />
        {name}
        <br />
        {quantity}
        <br />
        {warehouse}
        <br />
        {warehouseman}
        <br />
        {branch}
        <br />
        {date}
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
      show: true,
    };
  },
};
</script>

<style scoped>
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
</style>
