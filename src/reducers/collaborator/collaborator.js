import * as Types from "../../constants/ActionType";

var initialState = {
  config: {},
  allStep: [],
  allCollaborator: [],
  allRequestPayment: [],
  allHistoryPayment: [],
  topReport: [],
  allHistoriesBalance: [],
};

export const collaborator = (state = initialState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case Types.FETCH_ALL_COLLABORATOR_CONFIG:
      newState.config = action.data;
      return newState;
    case Types.FETCH_ALL_COLLABORATOR_STEP:
      newState.allStep = action.data;
      return newState;
    case Types.FETCH_ALL_COLLABORATOR:
      newState.allCollaborator = action.data;
      return newState;
    case Types.FETCH_HISTORIES_BALANCE_COLLABORATOR:
      newState.allHistoriesBalance = action.data;
      return newState;
    case Types.CHANGE_PRICE_BALANCE:
      const cloneState = JSON.parse(JSON.stringify(newState));
      const newAllCollaborator = [];
      cloneState.allCollaborator.data.forEach((collaborator) => {
        if (collaborator.id === action.data.id) {
          newAllCollaborator.push(action.data);
          return;
        }
        newAllCollaborator.push(collaborator);
      });
      cloneState.allCollaborator.data = newAllCollaborator;
      newState.allCollaborator = cloneState.allCollaborator;
      return newState;
    case Types.FETCH_ALL_COLLABORATOR_REQUEST_PAYMENT:
      newState.allRequestPayment = action.data;
      return newState;
    case Types.FETCH_ALL_COLLABORATOR_HISTORY_PAYMENT:
      newState.allHistoryPayment = action.data;
      return newState;

    case Types.FETCH_ALL_COLLABORATOR_TOP_REPORT:
      newState.topReport = action.data;
      return newState;
    default:
      return newState;
  }
};
