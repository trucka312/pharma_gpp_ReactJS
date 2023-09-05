import * as Types from "../../constants/ActionType";

var initialState = {
  packageProduct: [],
};

export const package_product = (state = initialState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case Types.FETCH_ALL_PACKAGE_PRODUCT:
      newState.packageProduct = action.data;
      return newState;

    default:
      return newState;
  }
};
