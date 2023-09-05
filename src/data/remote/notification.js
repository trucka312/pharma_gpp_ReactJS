import callApi from "../../ultis/apiCaller";

export const fetchAllNotification = (store_code , branch_id, page) => {
  return callApi(`/store_v2/${store_code}/${branch_id}/notifications_history?page=${page}`, "get", null);
};
export const fetchAllGeneralSetting = (store_code) => {
  return callApi(`/store/${store_code}/general_settings`, "get", null);
};
export const readAllNotification = (store_code,branch_id) => {
  return callApi(`/store_v2/${store_code}/${branch_id}/notifications_history/read_all`, "get", null);
};
export const updateGeneralSetting = (store_code,data) => {
  return callApi(`/store/${store_code}/general_settings`, "post", data);
};