import * as Types from "../../constants/ActionType";

var initialState = {
  allAccumulatePoint: {},
  allRequestBonusPoint: {},
};

export const accumulate_point = (state = initialState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case Types.FETCH_ALL_ACCUMULATE_POINT:
      newState.allAccumulatePoint = action.data;
      return newState;
    case Types.FETCH_ALL_REQUEST_BONUS_ACCUMULATE_POINT:
      newState.allRequestBonusPoint = action.data;
      return newState;
    case Types.CONFIRM_REQUEST_BONUS_ACCUMULATE_POINT:
      const stateCurrent = JSON.parse(JSON.stringify(newState));

      const newAllRequestBonus = [];
      stateCurrent?.allRequestBonusPoint?.data?.forEach((requestBonus) => {
        if (requestBonus.id === action.data?.id)
          newAllRequestBonus.push(action.data);
        else newAllRequestBonus.push(requestBonus);
      });

      stateCurrent.allRequestBonusPoint.data = newAllRequestBonus;
      return stateCurrent;
    default:
      return newState;
  }
};
