import { combineReducers } from "redux";
import { accumulate_point } from "./accumulate_point";
import { alert } from "./alert";

export const accumulatePointReducers = combineReducers({
  accumulate_point,
  alert,
});
