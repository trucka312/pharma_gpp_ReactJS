import * as Types from "../../constants/ActionType";

var initialState = {
  allStaff: [],
  staffID: {},
  type: [],
};

export const staff = (state = initialState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case Types.FETCH_ALL_STAFF:
      newState.allStaff = action.data;
      return newState;
    case Types.FETCH_ID_STAFF:
      newState.staffID = action.data;
      return newState;
    case Types.UPDATE_STAFF_TO_SALE:
      return newState;

    default:
      return newState;
  }
};
