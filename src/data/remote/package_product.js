import callApi from "../../ultis/apiCaller";

export const fetchPackageProduct = (store_code) => {
  return callApi(`/store/${store_code}/product_packages`, "get", null);
};
export const changePackageProduct = (store_code, idPackage, data) => {
  return callApi(
    `/store/${store_code}/product_packages/${idPackage}`,
    "put",
    data
  );
};
