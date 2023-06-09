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
    console.error(error.config.baseURL, error.response.data.detail[0].loc);
    swal({
      icon: "warning",
      closeOnEsc: false,
      closeOnClickOutside: false,
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
export function branchKpi(branch_id, user_id, date) {
  const date_query = date ? `date=${date}` : ``;
  return api(
    `get_branch_kpi?branch_id=${branch_id}&user_id=${user_id}&${date_query}`,
    "get"
  );
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
export function users(
  branch_id,
  warehouse_id,
  role = [""],
  delivery_balance,
  page,
  limit
) {
  const balance_query = delivery_balance
    ? `delivery_balance=${delivery_balance}`
    : ``;
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
      "operator",
    ].forEach((item) => {
      role_query += `role=${item}&`;
    });
  }
  return api(
    `get_users?branch_id=${branch_id}&warehouse_id=${warehouse_id}&${role_query}${balance_query}&page=${page}&limit=${limit}`,
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
export function customersAdmin(page, limit, search) {
  if (search) {
    return api(
      `get_customers_for_admin?search=${search}&page=${page}&limit=${limit}`,
      "get"
    );
  } else {
    return api(`get_customers_for_admin?page=${page}&limit=${limit}`, "get");
  }
}
export function createCustomer(data) {
  return api("create_customer", "post", data);
}
export function updateCustomer(data) {
  return api("update_customer/" + data.id, "put", data);
}

// loan

export function getLoan(order_id, loan_id) {
  return api(`get_loan?order_id=${order_id}&loan_id=${loan_id}`, "get");
}
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
export function takeIncomeFromPreOrder(data) {
  return api(`take_income_from_pre_order`, "post", data);
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
export function warehouseProducts(
  id,
  search,
  category_id,
  page,
  limit,
  status
) {
  const search_query = search ? `search=${search}&` : ``;
  if (category_id) {
    return api(
      `get_warehouse_products/${id}?${search_query}category_id=${category_id}&group=${status}&page=${page}&limit=${limit}`,
      "get"
    );
  } else {
    return api(
      `get_warehouse_products/${id}?${search_query}group=${status}&page=${page}&limit=${limit}`,
      "get"
    );
  }
}
export function productExamples(search, category_id, page, limit) {
  const search_query = search ? `search=${search}&` : ``;
  return api(
    `get_product_examples?${search_query}category_id=${category_id}&page=${page}&limit=${limit}`,
    "get"
  );
}
export function addProductExample(data) {
  return api(`add_product_example`, "post", data);
}
export function removeWarehouseProduct(product_id, quantity) {
  return api(`remove_w_product/${product_id}/${quantity}`, "delete");
}
export function updateKpiWarehouseProduct(data) {
  return api(`update_kpi_w_pr`, "put", data);
}
export function allProducts(
  search = [],
  page_w = 0,
  limit_w = 25,
  page_p = 0,
  limit_p = 25
) {
  let search_query = ``;
  if (search.length) {
    search.forEach((item) => {
      if (item.search) search_query += `search=${item.search}&`;
    });
  }
  return api(
    `get_all_products?${search_query}page_w=${page_w}&limit_w=${limit_w}&page_p=${page_p}&limit_p=${limit_p}`,
    "get"
  );
}
export function warningWarehouseProducts(search, page, limit) {
  const search_query = search ? `search=${search}` : ``;
  return api(
    `get_warning_warehouse_products?${search_query}&page=${page}&limit=${limit}`,
    "get"
  );
}
export function warningOrderWarehouseProducts(search, page, limit) {
  const search_query = search ? `search=${search}` : ``;
  return api(
    `get_warning_order_warehouse_products?${search_query}&page=${page}&limit=${limit}`,
    "get"
  );
}
export async function ordersFromBranch(
  search = [""],
  branch_id,
  status,
  warehouse_id,
  from_time,
  to_time,
  user_id,
  page,
  limit
) {
  let search_query = ``;
  if (search.length) {
    for await (const item of search) {
      search_query += `search=${item}&`;
    }
  }
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
  ustanovshik_id,
  gruzchik_id
) {
  const time_query =
    from_time && to_time ? `from_time=${from_time}&to_time=${to_time}&` : ``;
  return api(
    `get_transfers?warehouse_id=${warehouse_id}&status=${status}&branch_id=${branch_id}&${time_query}worker_id=${worker_id}&ustanovshik_id=${ustanovshik_id}&gruzchik_id=${gruzchik_id}&page=${page}&limit=${limit}`,
    "get"
  );
}
export function transferProduct(data) {
  return api(`transfer_product`, "post", data);
}
export function transferProductLogistika(data) {
  return api(`transfer_product_logistika`, "put", data);
}
export function transferProductWarehouseman(data) {
  return api(`transfer_product_warehouseman`, "put", data);
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
export function transfersWarehouse2(
  warehouse_id,
  status,
  branch_id,
  from_time,
  to_time,
  worker_id,
  ustanovshik_id,
  gruzchik_id,
  page,
  limit
) {
  const status_query = status ? `status=${status}` : ``;
  const time_query =
    from_time && to_time ? `from_time=${from_time}&to_time=${to_time}` : ``;
  return api(
    `get_transfers_warehouse_2?warehouse_id=${warehouse_id}&${status_query}&branch_id=${branch_id}&${time_query}&worker_id=${worker_id}&ustanovshik_id=${ustanovshik_id}&gruzchik_id=${gruzchik_id}&page=${page}&limit=${limit}`,
    "get"
  );
}
export function transferProduct2(data) {
  return api(`transfer_product_2`, "post", data);
}
export function removeTransfer2(id) {
  return api(`remove_transfer_2/${id}`, "delete");
}
export function transferProductLogistika2(data) {
  return api(`transfer_product_logistika_2`, "put", data);
}
export function acceptanceProductLogistika2(data) {
  return api(`acceptance_product_logistika_2`, "put", data);
}
export function transferProductWarehouseman2(data) {
  return api(`transfer_product_warehouseman_2`, "put", data);
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

export function categories(id, page, limit, search) {
  const search_query = search ? `search=${search}` : ``;
  return api(
    `get_categories?category_id=${id}&${search_query}&page=${page}&limit=${limit}`,
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
export function productHistory(
  warehouse_id,
  category_id,
  articul,
  name,
  name2
) {
  return api(
    `get_supplies_party/${warehouse_id}/${category_id}/${articul}/${name}/${name2}`,
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
export function orderPhotos(id, status) {
  return api(`get_photos_order/${id}?status=${status}`, "get");
}
export function uploadOrderPhoto(id, status, data) {
  return api(`upload_photo_order/${id}?status=${status}`, "post", data);
}
export function removeOrderPhoto(id, status) {
  return api(`remove_photo_order/${id}?status=${status}`, "delete");
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
  gruzchik_id,
  delivered,
  operator,
  page,
  limit
) {
  const time_query =
    from_time && to_time ? `from_time=${from_time}&to_time=${to_time}&` : ``;
  const delivered_query = delivered ? `&delivered=${delivered}` : ``;
  const operator_query = operator ? `&operator_status=${operator}` : ``;
  return api(
    `get_orders?${time_query}status=${status}&seller_id=${seller_id}&worker_id=${worker_id}&ustanovshik_id=${ustanovshik_id}&gruzchik_id=${gruzchik_id}${delivered_query}${operator_query}&page=${page}&limit=${limit}`,
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
export function operatorOrder(id, status) {
  return api(`operator_order/${id}/${status}`, "put");
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
export function preOrder(id) {
  return api(`get_pre_order/${id}`, "get");
}
export function preOrders(
  from_time,
  to_time,
  customer_id,
  seller_id,
  branch_id,
  status,
  worker_id,
  ustanovshik_id,
  gruzchik_id,
  worker,
  warehouseman_id,
  operator,
  logistika_phone,
  page,
  limit
) {
  const time_query =
    from_time && to_time ? `from_time=${from_time}&to_time=${to_time}` : ``;
  const status_query = status ? `&status=${status}` : ``;
  const worker_query = worker ? `&worker=${worker}` : ``;
  const operator_query = operator ? `&operator_status=${operator}` : ``;
  const logistika_query = logistika_phone
    ? `logistika_phone=${logistika_phone}`
    : ``;
  return api(
    `get_pre_orders?customer_id=${customer_id}&seller_id=${seller_id}&branch_id=${branch_id}${status_query}&worker_id=${worker_id}&ustanovshik_id=${ustanovshik_id}&gruzchik_id=${gruzchik_id}${worker_query}&warehouseman_id=${warehouseman_id}${operator_query}&${logistika_query}&${time_query}&page=${page}&limit=${limit}`,
    "get"
  );
}
export function createPreOrder() {
  return api(`create_pre_order`, "post");
}
export function updatePreOrder(data) {
  return api(`update_pre_order`, "put", data);
}
export function warehousemanPreOrder(id) {
  return api(`warehouseman_pre_order/${id}`, "put");
}
export function logistikaPreOrder(data) {
  return api(`logistika_pre_order`, "put", data);
}
export function logistikPreOrderPhone(id) {
  return api(`logistika_pre_order_phone/${id}`, "put");
}
export function deliveredPreOrder(id) {
  return api(`delivered_pre_order/${id}`, "put");
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
export function preOrderTradeBalance(id) {
  return api(`get_pre_trade_balance/${id}`, "get");
}
export function preOrderTrades(order_id, warehouse_id, page, limit) {
  return api(
    `get_pre_order_trades/${order_id}?warehouse_id=${warehouse_id}&page=${page}&limit=${limit}`,
    "get"
  );
}
export function tradeToPreOrder(data) {
  return api(`trade_to_pre_order`, "post", data);
}
export function tradeToPreOrder2(data) {
  return api(`trade_to_pre_order2`, "post", data);
}
export function updateTradeToPreOrder(data) {
  return api(`update_trade_to_pre_order`, "put", data);
}
export function deleteTradeToPreOrder(id) {
  return api(`delete_trade_to_pre_order/${id}`, "delete");
}

// return

export function returnedProducts(id, page, limit) {
  return api(
    `get_returned_products?order_id=${id}&page=${page}&limit=${limit}`,
    "get"
  );
}
export function returnedProductsPreOrder(id, page, limit) {
  return api(
    `get_returned_products_pre?pre_order_id=${id}&page=${page}&limit=${limit}`,
    "get"
  );
}
export function returnProduct(id, data) {
  return api(`return_product/${id}`, "put", data);
}
export function returnPreOrderProduct(id, data) {
  return api(`return_product_pre/${id}`, "put", data);
}

// service

export function services(
  source_id,
  source,
  worker_id,
  ustanovshik_id,
  logistika_id,
  status,
  page,
  limit
) {
  const status_query = status ? `status=${status}` : ``;
  const source_query = source ? `source=${source}` : ``;
  return api(
    `get_services?source_id=${source_id}&${source_query}&ustanovshik_id=${ustanovshik_id}&worker_id=${worker_id}&logistika_id=${logistika_id}&${status_query}&page=${page}&limit=${limit}`,
    "get"
  );
}
export function createService(data) {
  return api(`create_service`, "post", data);
}
export function confirmService(id) {
  return api(`confirm_service/${id}`, "put");
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
export function tradesForExcel(from_time, to_time, branch_id_admin) {
  const time_query =
    from_time && to_time ? `from_time=${from_time}&to_time=${to_time}` : ``;
  return api(
    `get_trades_for_excel?${time_query}&branch_id_admin=${branch_id_admin}`,
    "get"
  );
}
export function abs(from_time, to_time, branch_id_admin) {
  const time_query =
    from_time && to_time ? `from_time=${from_time}&to_time=${to_time}` : ``;
  return api(`get_abs?${time_query}&branch_id_admin=${branch_id_admin}`, "get");
}
export function xyz(from_time, to_time, branch_id_admin) {
  const time_query =
    from_time && to_time ? `from_time=${from_time}&to_time=${to_time}` : ``;
  return api(`get_xyz?${time_query}&branch_id_admin=${branch_id_admin}`, "get");
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
