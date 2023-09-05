import callApi from "../../ultis/apiCaller";

export const fetchAccumulatePoint = (store_code, page, params) => {
  return callApi(
    `/store/${store_code}/accumulate_points?page=${page}${
      params ? `&${params}` : ""
    }`,
    "get",
    null
  );
};

export const addAccumulatePoint = (store_code, data) => {
  return callApi(`/store/${store_code}/accumulate_points`, "post", data);
};

export const updateAccumulatePoint = (store_code, id, data) => {
  return callApi(`/store/${store_code}/accumulate_points/${id}`, "put", data);
};

export const deleteAccumulatePoint = (store_code, id) => {
  return callApi(
    `/store/${store_code}/accumulate_points/${id}`,
    "delete",
    null
  );
};

export const fetchRequestBonusPoint = (store_code, page, params) => {
  return callApi(
    `/store/${store_code}/history_accumulate_points?page=${page}${
      params ? `&${params}` : ""
    }`,
    "get",
    null
  );
};
export const confirmRequestBonusPoint = (store_code, id, data) => {
  return callApi(
    `/store/${store_code}/history_accumulate_points/${id}`,
    "put",
    data
  );
};
