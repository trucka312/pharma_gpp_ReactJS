import * as helpers from "../ultis/helpers";

export const API_URL_DEV = "https://santhuocviet-api-dev.ikitech.vn/api";
export const API_URL_MAIN = "https://santhuocviet-api-dev.ikitech.vn/api";

export const API_URL_SOCKET_DEV = "https://main.doapp.vn:6441/";
export const API_URL_SOCKET_MAIN = "https://main.doapp.vn:6441/";
export const STORE_CODE = "santhuocviet";
export const getApiImageStore = () => {
  return `${helpers.callUrl()}/store/${STORE_CODE}/images`;
};
