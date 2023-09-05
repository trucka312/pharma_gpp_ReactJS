import * as Type from "../constants/ActionType";
import * as importStock from "../data/remote/import_stock";
import history from "../history";
import { getBranchId } from "../ultis/branchUtils";

export const fetchAllImportStock = (store_code, branch_id, page, params) => {
  return (dispatch) => {
    dispatch({
      type: Type.SHOW_LOADING,
      loading: "show",
    });
    console.log("page", page);
    importStock
      .fetchAllImportStock(store_code, branch_id, page, params)
      .then((res) => {
        dispatch({
          type: Type.SHOW_LOADING,
          loading: "hide",
        });
        if (res.data.code !== 401) {
          dispatch({
            type: Type.FETCH_ALL_IMPORT_STOCK,
            data: res.data.data,
          });
        }
      });
  };
};
export const fetchDetailImportStock = (store_code, branch_id, id) => {
  return (dispatch) => {
    dispatch({
      type: Type.SHOW_LOADING,
      loading: "show",
    });
    importStock
      .fetchDetailImportStock(store_code, branch_id, id)
      .then((res) => {
        dispatch({
          type: Type.SHOW_LOADING,
          loading: "hide",
        });
        if (res.data.code !== 401) {
          dispatch({
            type: Type.FETCH_DETAIL_IMPORT_STOCK,
            data: res.data.data,
          });
        }
      });
  };
};
export const createImportStocks = (store_code, branch_id, id) => {
  return (dispatch) => {
    dispatch({
      type: Type.SHOW_LOADING,
      loading: "show",
    });
    importStock
      .createImportStocks(store_code, branch_id, id)
      .then((res) => {
        dispatch({
          type: Type.SHOW_LOADING,
          loading: "hide",
        });
        dispatch({
          type: Type.ALERT_UID_STATUS,
          alert: {
            type: "success",
            title: "Thành công ",
            disable: "show",
            content: res.data.msg,
          },
        });

        history.replace(`/import_stocks/index/${store_code}`);
      })
      .catch(function (error) {
        dispatch({
          type: Type.SHOW_LOADING,
          loading: "hide",
        });
        dispatch({
          type: Type.ALERT_UID_STATUS,
          alert: {
            type: "danger",
            title: "Lỗi",
            disable: "show",
            content: error?.response?.data?.msg,
          },
        });
      });
  };
};

export const updateImportStock = (store_code, branch_id, id, data) => {
  return (dispatch) => {
    dispatch({
      type: Type.SHOW_LOADING,
      loading: "show",
    });
    importStock
      .updateImportStock(store_code, branch_id, id, data)
      .then((res) => {
        dispatch({
          type: Type.SHOW_LOADING,
          loading: "hide",
        });
        dispatch({
          type: Type.ALERT_UID_STATUS,
          alert: {
            type: "success",
            title: "Thành công ",
            disable: "show",
            content: res.data.msg,
          },
        });

        history.goBack();
      })
      .catch(function (error) {
        dispatch({
          type: Type.SHOW_LOADING,
          loading: "hide",
        });
        dispatch({
          type: Type.ALERT_UID_STATUS,
          alert: {
            type: "danger",
            title: "Lỗi",
            disable: "show",
            content: error?.response?.data?.msg,
          },
        });
      });
  };
};

export const chooseMethorPayment = (store_code, branch_id, id, data) => {
  return (dispatch) => {
    dispatch({
      type: Type.SHOW_LOADING,
      loading: "show",
    });
    importStock
      .chooseMethorPayment(store_code, branch_id, id, data)
      .then((res) => {
        dispatch({
          type: Type.SHOW_LOADING,
          loading: "hide",
        });
        importStock
          .fetchDetailImportStock(store_code, branch_id, id)
          .then((res) => {
            dispatch({
              type: Type.SHOW_LOADING,
              loading: "hide",
            });
            if (res.data.code !== 401) {
              dispatch({
                type: Type.FETCH_DETAIL_IMPORT_STOCK,
                data: res.data.data,
              });
            }
          });
        dispatch({
          type: Type.ALERT_UID_STATUS,
          alert: {
            type: "success",
            title: "Thành công ",
            disable: "show",
            content: res.data.msg,
          },
        });
      })
      .catch(function (error) {
        dispatch({
          type: Type.SHOW_LOADING,
          loading: "hide",
        });
        dispatch({
          type: Type.ALERT_UID_STATUS,
          alert: {
            type: "danger",
            title: "Lỗi",
            disable: "show",
            content: error?.response?.data?.msg,
          },
        });
      });
  };
};
export const changeStatus = (store_code, branch_id, id, data) => {
  return (dispatch) => {
    dispatch({
      type: Type.SHOW_LOADING,
      loading: "show",
    });
    importStock.changeStatus(store_code, branch_id, id, data).then((res) => {
      dispatch({
        type: Type.SHOW_LOADING,
        loading: "hide",
      });
      importStock
        .fetchDetailImportStock(store_code, branch_id, id)
        .then((res) => {
          if (res.data.code !== 401)
            dispatch({
              type: Type.FETCH_DETAIL_IMPORT_STOCK,
              data: res.data.data,
            });
          dispatch({
            type: Type.ALERT_UID_STATUS,
            alert: {
              type: "success",
              title: "Thành công ",
              disable: "show",
              content: res.data.msg,
            },
          });
        })
        .catch(function (error) {
          dispatch({
            type: Type.ALERT_UID_STATUS,
            alert: {
              type: "danger",
              title: "Lỗi",
              disable: "show",
              content: error?.response?.data?.msg,
            },
          });
        });
    });
  };
};

export const postRefund = (id, data, store_code, branch = getBranchId()) => {
  return (dispatch) => {
    dispatch({
      type: Type.SHOW_LOADING,
      loading: "show",
    });
    importStock
      .postRefund(id, data, store_code, branch)
      .then((res) => {
        dispatch({
          type: Type.SHOW_LOADING,
          loading: "hide",
        });
        dispatch({
          type: Type.ALERT_UID_STATUS,
          alert: {
            type: "success",
            title: "Thành công ",
            disable: "show",
            content: res.data.msg,
          },
        });
        history.goBack();
      })
      .catch(function (error) {
        dispatch({
          type: Type.SHOW_LOADING,
          loading: "hide",
        });
        dispatch({
          type: Type.ALERT_UID_STATUS,
          alert: {
            type: "danger",
            title: "Lỗi",
            disable: "show",
            content: error?.response?.data?.msg,
          },
        });
      });
  };
};
