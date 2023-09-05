import callApi from "../../ultis/apiCaller";

export const fetchAllCustomer = (
  store_code,
  page,
  params,
  referral_phone_number = "",
  is_export = false
) => {
  return params
    ? callApi(
        `/store/${store_code}/customers?page=${page}${params}&referral_phone_number=${referral_phone_number}&is_export=${is_export}`,
        "get",
        null
      )
    : callApi(
        `/store/${store_code}/customers?page=${page}&referral_phone_number=${referral_phone_number}&is_export=${is_export}`,
        "get",
        null
      );
};

export const fetchCustomerId = (store_code, blogId) => {
  return callApi(`/store/${store_code}/customers/${blogId}`, "get", null);
};
export const createCustomer = (store_code, data) => {
  return callApi(`/store/${store_code}/customers`, "post", data);
};
export const editCustomer = (store_code, id, data) => {
  return callApi(`/store/${store_code}/customers/${id}`, "put", data);
};
export const changeTypeRoleCustomer = (store_code, id, data) => {
  return callApi(
    `/store/${store_code}/customers/${id}/sale_type`,
    "post",
    data
  );
};
export const fetchAllPointHistory = (id, store_code, page, params) => {
  return callApi(
    `/store/${store_code}/customers/${id}/history_points?page=${page}${
      params ? `&${params}` : ""
    }`,
    "get",
    null
  );
};
export const importAllCustomerFromXLSX = (store_code, data) => {
  return callApi(`/store/${store_code}/all_customers`, "post", data);
};
export const changePointForCustomer = (store_code, id, data) => {
  return callApi(
    `/store/${store_code}/customers/${id}/add_sub_point`,
    "post",
    data
  );
};
export const changePointBonusForCustomer = (store_code, id, data) => {
  return callApi(
    `/store/${store_code}/customers/${id}/add_sub_diem_sp`,
    "post",
    data
  );
};
export const historiesLevel = (store_code, id, queryString) => {
  return callApi(
    `/store/${store_code}/customers/${id}/history_change_level${
      queryString ? queryString : ""
    }`,
    "get",
    null
  );
};
export const changeStatusCustomer = (store_code, id, data) => {
  return callApi(
    `/store/${store_code}/customers/${id}/change_status`,
    "put",
    data
  );
};
export const changePasswordCustomer = (store_code, id, data) => {
  return callApi(
    `/store/${store_code}/customers/${id}/change_password`,
    "put",
    data
  );
};
