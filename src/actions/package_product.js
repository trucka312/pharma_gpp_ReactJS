import * as Types from "../constants/ActionType";
import * as packageProductApi from "../data/remote/package_product";

export const fetchPackageProduct = (store_code) => {
  return (dispatch) => {
    dispatch({ type: Types.SHOW_LOADING, loading: "show" });
    packageProductApi
      .fetchPackageProduct(store_code)
      .then((res) => {
        dispatch({ type: Types.SHOW_LOADING, loading: "hidden" });
        if (res.data.code !== 401) {
          dispatch({
            type: Types.FETCH_ALL_PACKAGE_PRODUCT,
            data: res.data.data,
          });
        }
      })
      .catch(function (error) {
        dispatch({
          type: Types.ALERT_UID_STATUS,
          alert: {
            type: "danger",
            title: "Lỗi",
            disable: "show",
            content: error?.response?.data?.message,
          },
        });
      });
  };
};
export const changePackageProduct = (
  store_code,
  idPackage,
  data,
  funcModal
) => {
  return (dispatch) => {
    dispatch({ type: Types.SHOW_LOADING, loading: "show" });
    packageProductApi
      .changePackageProduct(store_code, idPackage, data)
      .then((res) => {
        dispatch({ type: Types.SHOW_LOADING, loading: "hidden" });
        if (res.data.code !== 401) {
          dispatch({
            type: Types.FETCH_ALL_PACKAGE_PRODUCT,
            data: res.data.data,
          });
          if (funcModal) {
            funcModal();
          }
          packageProductApi.fetchPackageProduct(store_code).then((res) => {
            dispatch({ type: Types.SHOW_LOADING, loading: "hidden" });
            if (res.data.code !== 401) {
              dispatch({
                type: Types.FETCH_ALL_PACKAGE_PRODUCT,
                data: res.data.data,
              });
            }
          });
        }
      })
      .catch(function (error) {
        dispatch({
          type: Types.ALERT_UID_STATUS,
          alert: {
            type: "danger",
            title: "Lỗi",
            disable: "show",
            content: error?.response?.data?.message,
          },
        });
      });
  };
};
