export default {
  storage(key) {
    return localStorage[key];
  },
  currency(price = 0) {
    return Intl.NumberFormat().format(Number(price).toFixed(2));
  },
  payment_types: ["naxt", "plastik"],
};
