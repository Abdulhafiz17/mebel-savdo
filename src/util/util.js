export default {
  storage(key) {
    return localStorage[key];
  },
  currency(price = 0) {
    return Intl.NumberFormat().format(price.toFixed(2));
  },
};
