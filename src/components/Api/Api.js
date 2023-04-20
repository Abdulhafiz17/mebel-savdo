import axios from "axios";
import store from "@/store";
import swal from "sweetalert";

export const url_to_files = "https://zarmebel-api.crud.uz/uploaded_files/";

async function api(endpoint = "", method = "", data) {
  await store.dispatch("setloading", true);

  let result = null,
    error = null;

  await axios
    .request({
      baseURL: `https://zarmebel-api.crud.uz/${endpoint}`,
      headers: { Authorization: `Bearer ${localStorage["access_token"]}` },
      method: method.toUpperCase(),
      data: data,
    })
    .then((res) => {
      result = res;
    })
    .catch((err) => {
      error = err;
      catchError(error);
    })
    .finally(() => {
      store.dispatch("setloading", false);
    });

  return new Promise((resolve, reject) => {
    if (result) resolve(result);
    else reject(error);
  });
}

export function success(target) {
  if (target !== undefined) {
    if (typeof target == "number")
      document.querySelectorAll("[data-dismiss]")[target].click();
    else if (typeof target == "string")
      document.querySelector(`[${target}]`).click();
  }
  return swal({
    icon: "success",
    timer: 800,
    closeOnEsc: false,
    closeOnClickOutside: false,
  });
}

export function catchError(error) {
  console.error(error);
  if (error.response.status == 401) {
    swal({
      icon: "warning",
      title: "Ism yoki parolda xatolik !",
      timer: 2000,
    }).then(() => {
      localStorage.clear();
      if (location.pathname !== "/") {
        location.href = "/";
      }
    });
  } else if (error.response.status == 400) {
    return swal({
      icon: "warning",
      title: error.response.data.detail,
      timer: 2500,
    });
  } else if (error.response.status == 404) {
    swal({
      icon: "warning",
      title: "URL manzili noto'g'ri !",
      timer: 2000,
    });
  } else if (error.response.status == 422) {
    swal({
      icon: "warning",
      title: "Ma'lumotlar to'liq emas !",
      timer: 2000,
    });
  } else if (error.message == "Network Error") {
    swal({
      icon: "warning",
      title: "Server bilan aloqa mavjud emas !",
      timer: 2000,
    });
  }
}

// token

export function login(data) {
  let params = new URLSearchParams();

  params.append("username", data.username);
  params.append("password", data.password);

  return api(`token`, "post", params);
}

// branch

export function branches() {
  return api("get_branches", "get");
}
export function branch(id) {
  return api("get_branch/" + id, "get");
}
export function createBranch(data) {
  return api(`create_branch`, "post", data);
}
export function updateBranch(data) {
  return api(`update_branch/${data.id}`, "put", data);
}
export function createLogo(data, image) {
  return api(`create_logo/${data.id}`, "post", image);
}
export function removeLogo(id) {
  return api(`remove_logo/${id}`, "delete");
}

// users

export function thisUser(id) {
  return api(`this_user/${id}`, "get");
}
export function user() {
  return api("get_user", "get");
}
export function users(branch_id, warehouse_id, role = [""], page, limit) {
  let role_query = ``;
  if (role.length) {
    role.forEach((item) => {
      role_query += `role=${item}&`;
    });
  } else {
    [
      "admin",
      "cashier",
      "warehouseman",
      "logistika",
      "branch_admin",
      "seller",
      "worker",
      "ustanovshik",
    ].forEach((item) => {
      role_query += `role=${item}&`;
    });
  }
  return api(
    `get_users?branch_id=${branch_id}&warehouse_id=${warehouse_id}&${role_query}page=${page}&limit=${limit}`,
    "get"
  );
}
export function createUser(data) {
  return api("create_user", "post", data);
}
export function updateUser(data) {
  return api(`update_user/${data.id}`, "put", data);
}

// customer

export function customer(id) {
  return api(`this_customer/${id}`, "get");
}
export function customers(page, limit, search) {
  if (search) {
    return api(
      `get_customers?search=${search}&page=${page}&limit=${limit}`,
      "get"
    );
  } else {
    return api(`get_customers?page=${page}&limit=${limit}`, "get");
  }
}
export function createCustomer(data) {
  return api("customer_create", "post", data);
}
export function updateCustomer(data) {
  return api("update_customer/" + data.id, "put", data);
}

// loan

export function loan(id) {
  return api(`get_customer_loan/${id}`, "get");
}
export function orderLoan(order_id, loan_id) {
  return api(`get_loan?order_id=${order_id}&loan_id=${loan_id}`, "get");
}
export function loans(status, id, page, limit) {
  return api(
    `get_loans/${status}?customer_id=${id}&page=${page}&limit=${limit}`,
    "get"
  );
}
export function takeLoan(id, price, type, kassa_id) {
  return api(
    `take_loan/${id}?money=${price}&type=${type}&kassa_id=${kassa_id}`,
    "post"
  );
}

// income

export function incomes(id, status, kassa_id, page, limit) {
  return api(
    `get_incomes/${id}/${status}?kassa_id=${kassa_id}&page=${page}&limit=${limit}`,
    "get"
  );
}
export function takeIncomeFromUser(data) {
  return api(`take_income_from_user`, "post", data);
}

// market

export function market(id) {
  return api(`this_market/${id}`, "get");
}
export function markets(page, limit) {
  return api("get_markets?page=" + page + "&limit=" + limit, "get");
}
export function createMarket(data) {
  return api("create_market", "post", data);
}
export function updateMarket(data) {
  return api("update_market/" + data.id, "put", data);
}
export function takeIncomeFromMarket(data) {
  return api(`take_income_from_market`, "post", data);
}
export function marketBalance(id) {
  return api(`market_sum_price/${id}`, "get");
}

// warehouse

export function warehouse(id) {
  return api(`this_warehouse/${id}`, "get");
}
export function warehouses() {
  return api("get_warehouses", "get");
}

export function createWarehouse(data) {
  return api("create_warehouse", "post", data);
}

export function updateWarehouse(data) {
  return api("update_warehouse/" + data.id, "put", data);
}
export function warehouseBalances(id) {
  return api(`warehouse_products_sum_price/${id}`, "get");
}
export function warehouseProducts(id, category_id, page, limit, status) {
  if (category_id) {
    return api(
      `get_warehouse_products/${id}?category_id=${category_id}&group=${status}&page=${page}&limit=${limit}`,
      "get"
    );
  } else {
    return api(
      `get_warehouse_products/${id}?group=${status}&page=${page}&limit=${limit}`,
      "get"
    );
  }
}
export function removeWarehouseProduct(product_id, quantity) {
  return api(`remove_w_product/${product_id}/${quantity}`, "delete");
}
export function updateKpiWarehouseProduct(data) {
  return api(`update_kpi_w_pr`, "put", data);
}
export function allProducts(
  search = "",
  page_w = 0,
  limit_w = 25,
  page_p = 0,
  limit_p = 25
) {
  const search_query = search ? `search=${search}&` : ``;
  return api(
    `get_all_products?${search_query}page_w=${page_w}&limit_w=${limit_w}&page_p=${page_p}&limit_p=${limit_p}`,
    "get"
  );
}
export function ordersFromBranch(
  search,
  branch_id,
  status,
  warehouse_id,
  from_time,
  to_time,
  user_id,
  page,
  limit
) {
  const search_query = search ? `search=${search}&` : ``;
  const time_query =
    from_time && to_time ? `from_time=${from_time}&to_time=${to_time}&` : ``;
  return api(
    `get_orders_from_branch?${search_query}branch_id=${branch_id}&status=${status}&warehouse_id=${warehouse_id}&${time_query}user_id=${user_id}&page=${page}&limit=${limit}`,
    "get"
  );
}
export function createOrderFromBranch(data) {
  return api(`create_order_from_branch`, "post", data);
}
export function confirmationOrderFromBranch(id) {
  return api(`order_confirmation/${id}`, "put");
}

// transfer

export function transfers(
  warehouse_id,
  status,
  page,
  limit,
  branch_id,
  from_time,
  to_time,
  worker_id,
  ustanovshik_id
) {
  const time_query =
    from_time && to_time ? `from_time=${from_time}&to_time=${to_time}&` : ``;
  return api(
    `get_transfers?warehouse_id=${warehouse_id}&status=${status}&branch_id=${branch_id}&${time_query}worker_id=${worker_id}&ustanovshik_id=${ustanovshik_id}&page=${page}&limit=${limit}`,
    "get"
  );
}
export function transferProduct(id, data) {
  return api(`transfer_product/${id}`, "post", data);
}
export function transferProductLogistika(data) {
  return api(`transfer_product_logistika`, "put", data);
}
export function removeTransfer(transfer_id) {
  return api(`remove_transfer/${transfer_id}`, "delete");
}
export function acceptTransfer(data) {
  return api(`acceptance_product`, "post", data);
}
export function acceptTransferLogistika(data) {
  return api(`acceptance_product_logistika`, "put", data);
}

// currency

export function currencies() {
  return api("get_currencies", "get");
}
export function createCurrency(data) {
  return api(`create_currency`, "post", data);
}
export function updateCurrency(data) {
  return api("update_currency/" + data.id, "put", data);
}

// category

export function categories(id, page, limit) {
  return api(
    `get_categories?category_id=${id}&page=${page}&limit=${limit}`,
    "get"
  );
}
export function createCategory(data) {
  return api("create_category", "post", data);
}
export function updateCategory(data) {
  return api("update_category/" + data.id, "put", data);
}

// product

export function productsForTrade(code, page, limit) {
  return api(
    `get_products_for_trade/${code}?page=${page}&limit=${limit}`,
    "get"
  );
}
export function addProducts(data) {
  return api(`add_product`, "post", data);
}
export function updateProduct(code, size, data) {
  return api(`update_product/${code}/${size}`, "put", data);
}
export function productHistory(warehouse_id, category_id, articul) {
  return api(
    `get_supplies_party/${warehouse_id}/${category_id}/${articul}`,
    "get"
  );
}
export function productsSumPrice() {
  return api(`products_sum_price`, "get");
}

// control

export function createControl() {
  return api(`create_control`, "post");
}
export function removeControl() {
  return api(`remove_control`, "delete");
}
export function controls(branch_id, page, limit) {
  return api(
    `get_controls?branch_id=${branch_id}&page=${page}&limit=${limit}`,
    "get"
  );
}
export function controlProducts(control_id, status, code, page, limit) {
  return api(
    `get_products_control?control_id=${control_id}&status=${status}&code=${code}&page=${page}&limit=${limit}`,
    "get"
  );
}
export function updateControlProduct(data) {
  return api(`update_product_control`, "put", {
    code: data.code,
    real_quantity: data.real_quantity,
  });
}
export function changeControlProductQuantity() {
  return api(`change_product_quantity`, "put");
}

// photo

export function photo(articul) {
  return api(`get_photos/${articul}`, "get");
}
export function uploadPhoto(articul, file) {
  return api(`upload_photo/${articul}`, "post", file);
}
export function removePhoto(articul, id) {
  return api(`remove_photo/${articul}/${id}`, "delete");
}
export function orderPhotos(id) {
  return api(`get_photos_order/${id}`, "get");
}
export function uploadOrderPhoto(id, data) {
  return api(`upload_photo_order/${id}`, "post", data);
}
export function removeOrderPhoto(id) {
  return api(`remove_photo_order/${id}`, "delete");
}

// order

export function order(id) {
  return api(`get_this_order/${id}`, "get");
}
export function orders(
  from_time,
  to_time,
  status,
  seller_id,
  worker_id,
  ustanovshik_id,
  delivered,
  page,
  limit
) {
  const time_query =
    from_time && to_time ? `from_time=${from_time}&to_time=${to_time}&` : ``;
  const delivered_query = delivered ? `&delivered=${delivered}` : ``;
  return api(
    `get_orders?${time_query}status=${status}&seller_id=${seller_id}&worker_id=${worker_id}&ustanovshik_id=${ustanovshik_id}${delivered_query}&page=${page}&limit=${limit}`,
    "get"
  );
}
export function customerOrders(customer_id, from_time, to_time, page, limit) {
  if (from_time && to_time) {
    return api(
      `get_orders_customer/${customer_id}?from_time=${from_time}&to_time=${to_time}&page=${page}&limit=${limit}`,
      "get"
    );
  } else {
    return api(
      `get_orders_customer/${customer_id}?page=${page}&limit=${limit}`,
      "get"
    );
  }
}
export function createOrder() {
  return api(`create_order`, "post");
}
export function removeOrder(id) {
  return api(`remove_order/${id}`, "delete");
}
export function confirmationOrder(data) {
  return api(`order_confirmation`, "put", data);
}
export function attachLogistika(data) {
  return api(`attach_logistika`, "put", data);
}
export function deliverOrder(id) {
  return api(`deliver_order/${id}`, "put");
}

// trade

export function trades(id, page, limit) {
  return api(`get_trades/${id}?page=${page}&limit=${limit}`, "get");
}
export function toTrade(data) {
  return api(`to_trade`, "post", data);
}
export function updateTrade(status, data) {
  return api(`update_trade/${status}`, "put", data);
}
export function tradeBalance(id) {
  return api(`get_trade_balance/${id}`, "get");
}

// return

export function returnedProducts(id, page, limit) {
  return api(
    `get_returned_products?order_id=${id}&page=${page}&limit=${limit}`,
    "get"
  );
}
export function returnProduct(id, data) {
  return api(`return_product/${id}`, "put", data);
}

// party

export function party(id) {
  return api(`get_party/${id}`, "get");
}
export function parties(
  status,
  warehouseman,
  warehouseman_id,
  warehouse_id,
  page,
  limit
) {
  return api(
    `get_parties?status=${status}&warehouseman=${warehouseman}&warehouseman_id=${warehouseman_id}&warehouse_id=${warehouse_id}&page=${page}&limit=${limit}`,
    "get"
  );
}
export function createParty() {
  return api("create_party", "post");
}
export function updateParty(
  party_id,
  warehouse_id,
  currency_id,
  to_branch,
  to_price
) {
  return api(
    `update_party/${party_id}/${warehouse_id}/${currency_id}?to_branch=${to_branch}&to_price=${to_price}`,
    "post"
  );
}
export function confirmationParty(party_id, to_branch) {
  return api(`confirmation_party/${party_id}?to_branch=${to_branch}`, "post");
}
export function partyBalances(id) {
  return api(`get_party_balances/${id}`, "get");
}

// supply

export function supplies(market_id, party_id, page, limit, from_time, to_time) {
  if (market_id && !party_id) {
    if (from_time && to_time) {
      return api(
        `get_supplies?from_time=${from_time}&to_time=${to_time}&market_id=${market_id}&page=${page}&limit=${limit}`,
        "get"
      );
    } else {
      return api(
        `get_supplies?market_id=${market_id}&page=${page}&limit=${limit}`,
        "get"
      );
    }
  } else if (!market_id && party_id) {
    return api(
      `get_supplies?party_id=${party_id}&page=${page}&limit=${limit}`,
      "get"
    );
  } else if (market_id && party_id) {
    return api(
      `get_supplies?market_id=${market_id}&party_id=${party_id}&page=${page}&limit=${limit}`,
      "get"
    );
  }
}
export function takeSupply(data) {
  return api("take_supply", "post", data);
}
export function removeSupply(id) {
  return api(`remove_supply/${id}`, "delete");
}

// expense

export function kassaExpenses(from_time, to_time, kassa_id, page, limit) {
  const time_query =
    from_time && to_time ? `from_time=${from_time}&to_time=${to_time}&` : ``;
  return api(
    `get_kassa_expenses?${time_query}kassa_id=${kassa_id}&page=${page}&limit=${limit}`
  );
}
export function fixedExpenses() {
  return api("get_fixed_expenses", "get");
}
export function variableExpenses(page, limit, branch_id, from_time, to_time) {
  if (from_time && to_time) {
    return api(
      `get_variable_expenses?branch_id=${branch_id}&from_time=${from_time}&to_time=${to_time}&page=${page}&limit=${limit}`,
      "get"
    );
  } else {
    return api(
      `get_variable_expenses?branch_id=${branch_id}&page=${page}&limit=${limit}`,
      "get"
    );
  }
}
export function fixedExpense(page, limit, branch_id, id, from_time, to_time) {
  if (from_time && to_time) {
    return api(
      `fixed_expenses_get?branch_id=${branch_id}&from_time=${from_time}&to_time=${to_time}&fixed_expense_id=${id}&page=${page}&limit=${limit}`,
      "get"
    );
  } else {
    return api(
      `fixed_expenses_get?branch_id=${branch_id}&fixed_expense_id=${id}&page=${page}&limit=${limit}`,
      "get"
    );
  }
}
export function partyExpenses(id, page, limit) {
  return api(`get_party_expenses/${id}?page=${page}&limit=${limit}`, "get");
}
export function marketExpenses(id, page, limit, from_time, to_time) {
  if (from_time && to_time) {
    return api(
      `get_market_expenses/${id}?from_time=${from_time}&to_time=${to_time}&page=${page}&limit=${limit}`,
      "get"
    );
  } else {
    return api(`get_market_expenses/${id}?page=${page}&limit=${limit}`, "get");
  }
}
export function createFixedExpense(data) {
  return api("create_fixed_expense", "post", data);
}
export function updateFixedexpense(data) {
  return api("update_fixed_expense/" + data.id, "put", data);
}
export function payForFixedExpense(data) {
  return api("pay_for_fixed_expense", "post", data);
}
export function payForVariableExpense(data) {
  return api("pay_for_variable_expense", "post", data);
}
export function payForPartyExpense(data) {
  return api(`pay_for_party_expense/`, "post", data);
}
export function payForMarketExpense(data) {
  return api(`pay_for_market_expense`, "post", data);
}
export function payForUser(data) {
  return api(`pay_to_user`, "post", data);
}
export function userExpenses(user_id, from_time, to_time, page, limit) {
  if (from_time && to_time) {
    return api(
      `get_user_expenses?user_id=${user_id}&from_time=${from_time}&to_time=${to_time}&page=${page}&limit=${limit}`,
      "get"
    );
  } else {
    return api(
      `get_user_expenses?user_id=${user_id}&page=${page}&limit=${limit}`,
      "get"
    );
  }
}
export function payForAdmin(data) {
  return api(`pay_to_admin`, "post", data);
}
export function adminExpenses(branch_id, from_time, to_time, page, limit) {
  if (from_time && to_time) {
    return api(
      `get_admin_expenses/${branch_id}?from_time=${from_time}&to_time=${to_time}&page=${page}&limit=${limit}`,
      "get"
    );
  } else {
    return api(
      `get_admin_expenses/${branch_id}?page=${page}&limit=${limit}`,
      "get"
    );
  }
}
export function confirmAdminExpense(expense_id) {
  return api(`confirm_pay_to_admin/${expense_id}`, "put");
}
export function removeAdminExpense(expense_id) {
  return api(`remove_pay_to_admin/${expense_id}`, "delete");
}

// distribute

export function distribute() {
  return api(`get_orders_for_distributed_profit`, "get");
}
export function postDistribute() {
  return api(`profit_sharing`, "post");
}
export function distributeHistory(date, page, limit) {
  if (date) {
    return api(
      `get_distributed_profit?day=${date}&page=${page}&limit=${limit}`,
      "get"
    );
  } else {
    return api(`get_distributed_profit?page=${page}&limit=${limit}`, "get");
  }
}

// statistic

export function statisticOrders(from_time, to_time, branch_id) {
  return api(
    `get_trade_statistics?from_time=${from_time}&to_time=${to_time}&branch_id_admin=${branch_id}`,
    "get"
  );
}
export function statisticProducts(from_time, to_time, branch_id) {
  return api(
    `get_product_statistics?from_time=${from_time}&to_time=${to_time}&branch_id_admin=${branch_id}`,
    "get"
  );
}
export function statisticUsers(from_time, to_time, branch_id) {
  return api(
    `get_user_statistics?from_time=${from_time}&to_time=${to_time}&branch_id_admin=${branch_id}`,
    "get"
  );
}
export function statisticDaily(date, branch_id) {
  return api(
    `get_daily_statistics?day=${date}&branch_id_admin=${branch_id}`,
    "get"
  );
}
export function tradeSumStatistics(from_time, to_time, branch_id) {
  let time_query = ``;
  if (from_time && to_time)
    time_query = `from_time=${from_time}&to_time=${to_time}&`;
  return api(
    `get_trade_sum_statistics?${time_query}branch_id_admin=${branch_id}`,
    "get"
  );
}

// kassa

export function kassa(search = "", id = 0, branch_id = 0) {
  const search_query = search ? `search=${search}&` : ``;
  return api(`get_kassa?${search_query}id=${id}&branch_id=${branch_id}`, "get");
}
export function kassaHistory(from_id, to_id, type, page, limit) {
  return api(
    `get_kassa_history?from_kassa_id=${from_id}&to_id=${to_id}&type=${type}&page=${page}&limit=${limit}`
  );
}
export function createKassa(data) {
  return api(`create_kassa_r`, "post", data);
}
export function updateKassa(data) {
  return api(`update_kassa_r`, "put", data);
}
export function takeMoneyFromBranchKassa(data) {
  return api(`take_money_from_branch_kassa`, "post", data);
}
export function takeMoneyFromAdminKassa(data) {
  return api(`take_money_from_admin_kassa`, "post", data);
}

// davomat

export function davomat(user_id, from_time, to_time, page, limit) {
  const time_query =
    from_time && to_time ? `from_time=${from_time}&to_time=${to_time}&` : ``;
  return api(
    `get_davomat?user_id=${user_id}&${time_query}page=${page}&limit=${limit}`,
    "get"
  );
}
export function enter_user(data) {
  return api(`enter_user`, "post", data);
}
export function close_user(data) {
  return api(`close_user`, "put", data);
}

// shipping

export function shippingCost(price_for_branch) {
  return api(`get_shipping_cost?price_for_branch=${price_for_branch}`, "get");
}
export function createShippingCost(data) {
  return api(`create_shipping_cost`, "post", data);
}
export function updateShippingCost(id, data) {
  return api(`update_shipping_cost/${id}`, "put", data);
}
