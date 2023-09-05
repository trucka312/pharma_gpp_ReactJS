
import * as Types from "../constants/ActionType";

var initialState = {
  theme: {},
  alert_uid: {
    disable: "hide",
  },
  post_id_help: "",
  post_id_contact: "",
  post_id_about: "",
  post_id_terms: "",
  post_id_return_policy: "",
  post_id_support_policy: "",
  post_id_privacy_policy: "",
};

export const themeReducers = (state = initialState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case Types.FETCH_THEME:
      newState.theme = action.data;
      return newState;
    case Types.ALERT_UID_STATUS:
      newState.alert_uid = action.alert;
      return newState;

    case Types.POST_ID_HELP:
      newState.post_id_help = action.data;
      return newState;

    case Types.POST_ID_CONTACT:
      newState.post_id_contact = action.data;
      return newState;

    case Types.POST_ID_ABOUT:
      newState.post_id_about = action.data;
      return newState;

    case Types.POST_ID_TERM:
      newState.post_id_terms = action.data;
      return newState;

    case Types.POST_ID_RETURN_POLICY:
      newState.post_id_return_policy = action.data;
      return newState;

    case Types.POST_ID_SUPPORT_POLICY:
      newState.post_id_support_policy = action.data;
      return newState;

    case Types.POST_ID_PRIVACY_POLICY:
      newState.post_id_privacy_policy = action.data;
      return newState;
    default:
      return newState;
  }
};

