import * as Types from "../../constants/ActionType";

var initialState = {
  config: {},
  allStep: [],
  allStepImport: [],
  allAgency: [],
  allRequestPayment: [],
  allHistoryPayment: [],
  allAgencyType: [],
  topReport: [],
  topCommission: [],
  bonusAgencyConfig: {},
  allHistoriesBalance: [],
  updatedPercentDiscountSuccessfully: false,
  updatedCommissionSuccessfully: false,
  historyChangeLevelAgency: {},
};

export const agency = (state = initialState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case Types.GET_BONUS_AGENCY_CONFIG:
      newState.bonusAgencyConfig = action.data;
      return newState;
    case Types.FETCH_ALL_AGENCY_CONFIG:
      newState.config = action.data;
      return newState;
    case Types.FETCH_ALL_AGENCY_TYPE:
      newState.allAgencyType = action.data;
      return newState;
    case Types.FETCH_ALL_AGENCY_STEP:
      newState.allStep = action.data;
      return newState;
    case Types.FETCH_ALL_AGENCY_STEP_IMPORT:
      newState.allStepImport = action.data;
      return newState;
    case Types.FETCH_ALL_AGENCY:
      newState.allAgency = action.data;
      return newState;
    case Types.FETCH_ALL_AGENCY_REQUEST_PAYMENT:
      newState.allRequestPayment = action.data;
      return newState;
    case Types.FETCH_ALL_AGENCY_HISTORY_PAYMENT:
      newState.allHistoryPayment = action.data;
      return newState;
    case Types.FETCH_ALL_AGENCY_TOP_REPORT:
      newState.topReport = action.data;
      return newState;
    case Types.FETCH_ALL_AGENCY_TOP_COMMISSION:
      newState.topCommission = action.data;
      return newState;
    case Types.FETCH_HISTORIES_BALANCE_AGENCY:
      newState.allHistoriesBalance = action.data;
      return newState;
    case Types.UPDATE_PERCENT_DISCOUNT_AGENCY:
      newState.updatedPercentDiscountSuccessfully = action.data;
      return newState;
    case Types.UPDATE_COMMISSION_AGENCY:
      newState.updatedCommissionSuccessfully = action.data;
      return newState;
    case Types.HISTORY_CHANGE_LEVEL_AGENCY:
      newState.historyChangeLevelAgency = action.data;
      return newState;
    case Types.CHANGE_PRICE_BALANCE_AGENCY:
      const cloneState = JSON.parse(JSON.stringify(newState));
      const newAllAgency = [];
      cloneState.allAgency.data.forEach((agency) => {
        if (agency.id === action.data.id) {
          newAllAgency.push(action.data);
          return;
        }
        newAllAgency.push(agency);
      });
      cloneState.allAgency.data = newAllAgency;
      newState.allAgency = cloneState.allAgency;
      return newState;
    default:
      return newState;
  }
};
