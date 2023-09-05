import * as Types from "../../constants/ActionType";

var initialState = {
  allCustomer: [],
  allCustomerByInferralPhone: [],
  customerID: {},
  type: [],
  isFromPosAndSave: false,
  customerCreated: {},
  pointHistory: [],
  addedPointSuccessfully: false,
  addedPointBonusSuccessfully: false,
  updatedRoleSuccessfully: false,
  allHistoriesLevel: {},
};

export const customer = (state = initialState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case Types.FETCH_ALL_CUSTOMER:
      newState.allCustomer = action.data;
      return newState;
    case Types.FETCH_ALL_CUSTOMER_BY_INFERRAL_PHONE:
      newState.allCustomerByInferralPhone = action.data;
      return newState;
    case Types.FETCH_ID_CUSTOMER:
      newState.customerID = action.data;
      return newState;
    case Types.CREATED_CUSTOMER:
      newState.isFromPosAndSave = action.isFromPosAndSave;
      newState.customerCreated = action.data;
      return newState;
    case Types.FETCH_ALL_POINT_HISTORY:
      newState.pointHistory = action.data;
      return newState;
    case Types.UPDATE_ROLE_CUSTOMER_FOR_INTERFACE:
      newState.updatedRoleSuccessfully = action.data;
      return newState;
    case Types.ADD_SUB_POINT_CUSTOMER:
      newState.addedPointSuccessfully = action.data;
      return newState;
    case Types.ADD_SUB_POINT_BONUS_CUSTOMER:
      newState.addedPointBonusSuccessfully = action.data;
      return newState;
    case Types.FETCH_HISTORIES_LEVEL_CUSTOMER:
      newState.allHistoriesLevel = action.data;
      return newState;
    case Types.CHANGE_STATUS_CUSTOMER:
      const stateCurrent = JSON.parse(JSON.stringify(newState));

      const newAllCustomer = [];
      stateCurrent?.allCustomer?.data?.forEach((customer) => {
        if (customer.id === action.data?.id) newAllCustomer.push(action.data);
        else newAllCustomer.push(customer);
      });

      stateCurrent.allCustomer.data = newAllCustomer;
      return stateCurrent;
    case Types.CHANGE_PASSWORD_CUSTOMER:
      const stateChangePasswordCurrent = JSON.parse(JSON.stringify(newState));

      const newAllChangePasswordCustomer = [];
      stateChangePasswordCurrent?.allCustomer?.data?.forEach((customer) => {
        if (customer.id === action.data?.id)
          newAllChangePasswordCustomer.push(action.data);
        else newAllChangePasswordCustomer.push(customer);
      });

      stateChangePasswordCurrent.allCustomer.data =
        newAllChangePasswordCustomer;
      return stateChangePasswordCurrent;
    default:
      return newState;
  }
};
