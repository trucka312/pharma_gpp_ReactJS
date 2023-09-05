import callApi from "../../ultis/apiCaller";


// code newer , creater : phuctd <>
export const fetchReportRevenue = (store_code, params) => {
  return callApi(
    `/store/${store_code}/report/finance/revenues?${params}`,
    "get",
    null
  );
};

export const fetchReportGrossProfit = (store_code, params) => {
  return callApi(
    `/store/${store_code}/report/finance/revenue_profits?${params}`,
    "get",
    null
  );
};

export const fetchReportSales = (store_code, params) => {
  return callApi(
    `/store/${store_code}/report/finance/sale_revenues?${params}`,
    "get",
    null
  );
};

export const fetchReportImportSell = (store_code, params) => {
  return callApi(
    `/store/${store_code}/report/finance/sale_entry_details?${params}`,
    "get",
    null
  );
};

export const fetchReportWatchingSellByOrder = (store_code, params) => {
  return callApi(
    `/store/${store_code}/report/finance/sale_by_orders?${params}`,
    "get",
    null
  );
};
// code newer , creater : phuctd </>

export const fetchOverview = (store_code, branch_ids, params) => {
  if (branch_ids?.toString()?.includes(",")) {
    return params
      ? callApi(
          `/store/${store_code}/report/overview${params}&branch_ids=${branch_ids}`,
          "get",
          null
        )
      : callApi(
          `/store/${store_code}/report/overview?branch_ids=${branch_ids}`,
          "get",
          null
        );
  } else {
    return params
      ? callApi(
          `/store_v2/${store_code}/${branch_ids}/report/overview${params}`,
          "get",
          null
        )
      : callApi(
          `/store_v2/${store_code}/${branch_ids}/report/overview`,
          "get",
          null
        );
  }
};
export const fetchTopTenProduct = (store_code, branch_ids, params) => {
  if (branch_ids?.toString()?.includes(",")) {
    return callApi(
      `/store/${store_code}/report/top_ten_products${
        params
          ? `${params}&branch_ids=${branch_ids}`
          : `?branch_ids=${branch_ids}`
      }`,
      "get",
      null
    );
  } else {
    return callApi(
      `/store_v2/${store_code}/${branch_ids}/report/top_ten_products${params}`,
      "get",
      null
    );
  }
};

