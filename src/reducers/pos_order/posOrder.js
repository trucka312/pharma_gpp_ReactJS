import * as Types from "../../constants/ActionType";

var initialState = {
  listPosOrder: [],
  oneCart: [],
  loadingCart: true,
  inforCustomer: "",
  loadingHandleChangeQuantity: false,
  loadingHandleChangePriceItem: false,
  orderAfterPayment: {},
  loadingOrder: false,
  allowAutoPrint: true,
  fromEditOrder: false,
  updatedPrice: {},
  loadingHandleUseVoucher: null,
};

export const pos_reducer = (state = initialState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case Types.POS_ORDER_PAYMENT_LOADING:
      newState.orderAfterPayment = {};
      newState.loadingOrder = action.loadingOrder;
      return newState;
    case Types.CHANGE_STATUS_ALLOW_PRINT:
      newState.allowAutoPrint = action.data;
      return newState;

    case Types.POS_ORDER_PAYMENT_SUCCESS:
      newState.orderAfterPayment = action.data.orderAfterPayment;
      newState.loadingOrder = false;
      newState.fromEditOrder = true;
      newState.oneCart = [];
      // newState.allowAutoPrint = action.data.allowAutoPrint;
      return newState;
    case Types.FROM_EDIT_ORDER:
      newState.fromEditOrder = action.data;
      return newState;
    case Types.POS_ORDER_PAYMENT_FAILD:
      newState.orderAfterPayment = {};
      newState.loadingOrder = false;
      // newState.allowAutoPrint = false;
      return newState;

    case Types.POS_ORDER_PAYMENT_LOADING:
      newState.orderAfterPayment = action.data;
      newState.loadingOrder = action.data;
      // newState.allowAutoPrint = false;
      return newState;
    case Types.FETCH_LIST_POS_ORDER:
      newState.listPosOrder = action.data;
      newState.loadingCart = false;
      return newState;
    case Types.FETCH_LIST_POS_ORDER_LOADING:
      newState.loadingCart = true;
      return newState;

    case Types.LOADING_CHANGE_QUANTITY_LINE_ITEM:
      newState.loadingHandleChangeQuantity = true;
      newState.loadingHandleChangePriceItem = true;
      return newState;
    case Types.NONE_CHANGE_QUANTITY_LINE_ITEM:
      newState.loadingHandleChangeQuantity = false;
      return newState;

    case Types.USE_VOUCHER_CART_LOAD:
      newState.loadingHandleUseVoucher = true;
      newState.oneCart = action.data;
      return newState;
    case Types.FETCH_LIST_CART_ITEM:
      newState.oneCart = action.data;
      return newState;
    case Types.USE_VOUCHER_CART_DONE:
      newState.loadingHandleUseVoucher = false;
      newState.oneCart = action.data;
      return newState;
    case Types.FETCH_INFO_CUSTOMER:
      newState.inforCustomer = action.data;
      return newState;
    case Types.UPDATE_PRICE_ITEM:
      newState.loadingHandleChangePriceItem = false;
      newState.oneCart = action.data;
      newState.updatedPrice = action.data;
      return newState;
    default:
      return newState;
  }
};
