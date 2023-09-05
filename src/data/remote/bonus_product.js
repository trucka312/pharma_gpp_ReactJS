import callApi from "../../ultis/apiCaller";

export const fetchAllBonusProduct = (store_code) => {
  return callApi(`/store/${store_code}/bonus_product`, "get", null);
};

export const fetchAllBonusProductEnd = (store_code , page) => {
  return callApi(`/store/${store_code}/bonus_product_end?page=${page}`, "get", null);
};

export const fetchBonusProductId = (store_code , id) => {
  return callApi(`/store/${store_code}/bonus_product/${id}`, "get", null);
};

export const createBonusProduct = (store_code,data) =>{
  return callApi(`/store/${store_code}/bonus_product`, "post", data);
}

export const updateBonusProduct = (store_code,data,id) =>{
  return callApi(`/store/${store_code}/bonus_product/${id}`, "put", data);
}

export const destroyBonusProduct = (store_code, id) =>{
  return callApi(`/store/${store_code}/bonus_product/${id}`, "delete", null);
}

export const upload = (file) =>{
  return callApi(`/images`, "post", file);
}
