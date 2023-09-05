import * as Types from "../../constants/ActionType";

var initialState = {
  allVoucher: [],
  voucherId : {}
};

export const voucher = (state = initialState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case Types.FETCH_ALL_VOUCHER:
      newState.allVoucher = action.data;
      return newState;
    case Types.FETCH_ID_VOUCHER:
      newState.voucherId = action.data;
      return newState;
    default:
      return newState;
  }
};
