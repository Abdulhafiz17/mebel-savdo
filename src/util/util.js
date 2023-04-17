export default {
  currency(price = 0) {
    return Intl.NumberFormat().format(price.toFixed(2));
  },
};
