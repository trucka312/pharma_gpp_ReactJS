import * as Types from "../../constants/ActionType";

var initialState = {
  allProduct: {},
  productId: {},
  allProductList: {},
  allProductTiki: {},
  allProductSendo: {},
  allProductShopee: {},
  product_agency_price_id: {},
  messageImport: {},
};

export const product = (state = initialState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case Types.FETCH_ALL_PRODUCT:
      newState.allProduct = action.data;
      return newState;
    case Types.FETCH_ID_PRODUCT:
      newState.productId = action.data;
      return newState;
    case Types.FETCH_ALL_PRODUCT_LIST:
      newState.allProductList = action.data;
      return newState;
    case Types.FETCH_ALL_PRODUCT_TIKI:
      newState.allProductTiki = action.data;
      return newState;
    case Types.FETCH_ALL_PRODUCT_SHOPEE:
      newState.allProductShopee = action.data;
      return newState;
    case Types.FETCH_ALL_PRODUCT_SENDO:
      newState.allProductSendo = action.data;
      return newState;
    case Types.FETCH_ID_PRODUCT_AGENCY_PRICE:
      newState.product_agency_price_id = action.data;
      return newState;
    case Types.IMPORT_FILE_PRODUCTS:
      newState.messageImport = action.data;
      return newState;
    case Types.SET_LEVEL_PRODUCT:
      const stateCurrent = JSON.parse(JSON.stringify(newState));

      const allProduct = [];
      stateCurrent?.allProduct?.data?.forEach((customer) => {
        if (customer.id === action.data?.id) allProduct.push(action.data);
        else allProduct.push(customer);
      });

      stateCurrent.allProduct.data = allProduct;
      return stateCurrent;
    default:
      return newState;
  }
};
