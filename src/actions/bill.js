import * as Types from "../constants/ActionType";
import history from "../history";
import * as billApi from "../data/remote/bill";
import * as chatApi from "../data/remote/chat";
import * as uploadApi from "../data/remote/upload";
import {
  compressed,
  formatStringCharactor,
  getDetailAdress,
} from "../ultis/helpers";
import { getBranchId } from "../ultis/branchUtils";
import moment from "moment";
import XlsxPopulate from "xlsx-populate";
import { saveAs } from "file-saver";
import * as OrderFrom from "../ultis/order_from";

export const exportAllListOrder = (
  store_code,
  page = 1,
  branch_id,
  params = null,
  params_agency = null
) => {
  return (dispatch) => {
    dispatch({
      type: Types.SHOW_LOADING,
      loading: "show",
    });
    billApi
      .fetchAllBill(store_code, page, branch_id, params, params_agency, true)
      .then((res) => {
        dispatch({
          type: Types.SHOW_LOADING,
          loading: "hide",
        });
        if (res.data.code !== 401) {
          if (typeof res.data.data != "undefined") {
            if (typeof res.data.data.data != "undefined") {
              if (res.data.data.data.length > 0) {
                var newArray = [];

                for (const item of res.data.data.data) {
                  var newItem = {};
                  var arangeKeyItem = {
                    branch: item.branch?.name ?? "",
                    order_code: item.order_code ?? "",
                    ship_code: item.ship_code ?? "",

                    created_at: item.created_at,
                    updated_at: item.updated_at,

                    receiver_customer_phone: item.customer_phone,
                    receiver_customer_name: item.customer_name,
                    receiver_customer_email: item.customer_email,
                    receiver_customer_wards: item.customer_wards_name,
                    receiver_customer_district: item.customer_district_name,
                    receiver_customer_province: item.customer_province_name,
                    receiver_customer_address_detail:
                      item.customer_address_detail,

                    orderer_customer_phone: item.customer?.phone_number,
                    orderer_customer_name: item.customer?.name,
                    orderer_customer_email: item.customer?.email,
                    orderer_customer_wards: item.customer?.wards_name,
                    orderer_customer_district: item.customer?.district_name,
                    orderer_customer_province: item.customer?.province_name,
                    orderer_customer_address_detail:
                      item.customer?.address_detail,

                    order_from:
                      item.order_from == OrderFrom.ORDER_FROM_APP
                        ? "App"
                        : item.order_from == OrderFrom.ORDER_FROM_POS_DELIVERY
                        ? "POS giao vận"
                        : item.order_from == OrderFrom.ORDER_FROM_POS_IN_STORE
                        ? "POS tại quầy"
                        : item.order_from == OrderFrom.ORDER_FROM_POS_SHIPPER
                        ? "POS vận chuyển"
                        : item.order_from == OrderFrom.ORDER_FROM_WEB
                        ? "Web"
                        : "POS tại quầy",

                    partner_shipper_name: item.partner_shipper_name,
                    customer_note: item.customer_note,

                    total_final: item.total_final,
                    remaining_amount: item.remaining_amount,

                    combo_discount_amount: item.combo_discount_amount,
                    product_discount_amount: item.product_discount_amount,
                    voucher_discount_amount: item.voucher_discount_amount,

                    total_after_discount: item.total_after_discount,
                    total_before_discount: item.total_before_discount,

                    balance_collaborator_used: item.balance_collaborator_used,
                    bonus_points_amount_used: item.bonus_points_amount_used,

                    share_collaborator: item.share_collaborator,

                    reviewed: item.reviewed,

                    total_shipping_fee: item.total_shipping_fee,

                    payment_status: item.payment_status_name,

                    order_status: item.order_status_name,
                  };
                  Object.entries(arangeKeyItem).forEach(
                    ([key, value], index) => {
                      if (key == "branch") {
                        newItem["Chi nhánh"] = value;
                      }
                      if (key == "order_code") {
                        newItem["Mã đơn hàng"] = value;
                      }
                      if (key == "ship_code") {
                        newItem["Mã vận đơn"] = value;
                      }
                      if (key == "created_at") {
                        newItem["Ngày tạo"] = value;
                      }
                      if (key == "updated_at") {
                        newItem["Ngày cập nhật"] = value;
                      }
                      if (key == "receiver_customer_phone") {
                        newItem["Số điện thoại người nhận"] = value;
                      }
                      if (key == "receiver_customer_name") {
                        newItem["Tên người nhận"] = value;
                      }
                      if (key == "receiver_customer_email") {
                        newItem["Email người nhận"] = value;
                      }
                      if (key == "receiver_customer_wards") {
                        newItem["Phường/Xã người nhận"] = value;
                      }
                      if (key == "receiver_customer_district") {
                        newItem["Quận/Huyện người nhận"] = value;
                      }
                      if (key == "receiver_customer_province") {
                        newItem["Tỉnh/TP người nhận"] = value;
                      }
                      if (key == "receiver_customer_address_detail") {
                        newItem["Chi tiết địa chỉ người nhận"] = value;
                      }
                      if (key == "receiver_customer_address_detail") {
                        newItem["Chi tiết địa chỉ người nhận"] = value;
                      }

                      if (key == "orderer_customer_phone") {
                        newItem["Số điện thoại người gửi"] = value;
                      }
                      if (key == "orderer_customer_name") {
                        newItem["Tên người gửi"] = value;
                      }
                      if (key == "orderer_customer_email") {
                        newItem["Email người gửi"] = value;
                      }
                      if (key == "orderer_customer_wards") {
                        newItem["Phường/Xã người gửi"] = value;
                      }
                      if (key == "orderer_customer_district") {
                        newItem["Quận/Huyện người gửi"] = value;
                      }
                      if (key == "orderer_customer_province") {
                        newItem["Tỉnh/TP người gửi"] = value;
                      }
                      if (key == "orderer_customer_address_detail") {
                        newItem["Chi tiết địa chỉ người gửi"] = value;
                      }
                      if (key == "orderer_customer_address_detail") {
                        newItem["Chi tiết địa chỉ người gửi"] = value;
                      }

                      if (key == "order_from") {
                        newItem["Đặt hàng từ"] = value;
                      }

                      if (key == "partner_shipper_name") {
                        newItem["Đơn vị vận chuyển"] = value;
                      }

                      if (key == "customer_note") {
                        newItem["Ghi chú"] = value;
                      }

                      if (key == "total_final") {
                        newItem["Tổng tiền"] = value;
                      }
                      if (key == "total_shipping_fee") {
                        newItem["Phí vận chuyển"] = value;
                      }

                      if (key == "remaining_amount") {
                        newItem["Thanh toán còn lại"] = value;
                      }

                      if (key == "payment_status") {
                        newItem["Trạng thái thanh toán"] = value ?? "";
                      }

                      if (key == "order_status") {
                        newItem["Trạng thái đơn hàng"] = value ?? "";
                      }

                      if (key == "combo_discount_amount") {
                        newItem["Giảm giá combo"] = value;
                      }

                      if (key == "product_discount_amount") {
                        newItem["Giảm giá sản phẩm"] = value;
                      }
                      if (key == "voucher_discount_amount") {
                        newItem["Giảm giá voucher"] = value;
                      }

                      if (key == "total_after_discount") {
                        newItem["Trước khi giảm giá"] = value;
                      }
                      if (key == "total_before_discount") {
                        newItem["Sau khi giảm giá"] = value;
                      }

                      if (key == "balance_collaborator_used") {
                        newItem["Số dư CTV đã sử dụng"] = value;
                      }

                      if (key == "bonus_points_amount_used") {
                        newItem["Số xu đã sử dụng"] = value;
                      }

                      if (key == "share_collaborator") {
                        newItem["Số tiền chia sẻ cho CTV"] = value;
                      }
                    }
                  );

                  newArray.push(newItem);
                }
                var header = [];
                if (newArray.length > 0) {
                  Object.entries(newArray[0]).forEach(([key, value], index) => {
                    header.push(key);
                  });
                }
                console.log(header);
                saveAsExcel({ data: newArray, header: header });
              }
            }
          }
        }
      });
  };
};
async function saveAsExcelMisa(value) {
  var data = value.data;
  var data_header = value.header;
  XlsxPopulate.fromBlankAsync().then(async (workbook) => {
    const sheet1 = workbook.sheet(0);
    const sheetData = getSheetData(data, data_header);

    sheet1.cell("A1").value(sheetData);
    const range = sheet1.usedRange();
    // const endColumn = String.fromCharCode(64 + totalColumns);

    sheet1.row(1).style("bold", true);

    sheet1.range("A1:U1").style("fill", "ccccff");
    sheet1.range("V1:AN1").style("fill", "ffff00");
    range.style("border", true);

    // sheet1.range("AA1:AI1").style("fill", "F4D03F");
    // range.style("border", true);

    return workbook.outputAsync().then((res) => {
      saveAs(res, "Ban_hang_VNĐ MẪU NHẬP MISA.xlsx");
    });
  });
}
export const exportAllListOrderMisa = (
  store_code,
  page = 1,
  branch_id,
  params = null,
  params_agency = null
) => {
  return (dispatch) => {
    dispatch({
      type: Types.SHOW_LOADING,
      loading: "show",
    });
    billApi
      .fetchAllBill(store_code, page, branch_id, params, params_agency, true)
      .then((res) => {
        dispatch({
          type: Types.SHOW_LOADING,
          loading: "hide",
        });
        const handleAddress = (
          address_detail,
          wards_name,
          district_name,
          province_name
        ) => {
          let addressDefault = "";
          if (address_detail) {
            addressDefault += address_detail ? `${address_detail}, ` : "";
          }
          if (wards_name) {
            addressDefault += wards_name ? `${wards_name}, ` : "";
          }
          if (district_name) {
            addressDefault += district_name ? `${district_name}, ` : "";
          }
          if (province_name) {
            addressDefault += province_name ? `${province_name}` : "";
          }
          return addressDefault;
        };
        if (res.data.code !== 401) {
          if (typeof res.data.data != "undefined") {
            if (typeof res.data.data.data != "undefined") {
              if (res.data.data.data.length > 0) {
                var newArray = [];

                console.log("dataMisa::: ", res.data.data.data);
                for (const item of res.data.data.data) {
                  if (item?.line_items_at_time?.length > 0) {
                    for (const product of item.line_items_at_time) {
                      var newItem = {};
                      var arangeKeyItem = {
                        number: "",
                        sale_from: "",
                        payment_status:
                          item.payment_status == 2
                            ? item.payment_method_id == 0
                              ? 1
                              : 2
                            : 0,
                        checkExportInventory: 0,
                        exportTariffArea: 0,
                        invoiceAttached: 0,
                        billed: 0,
                        accountDate: "",
                        voucherDate: "",
                        voucherNumber: "",
                        voteIssued: "",
                        reasonExport: "",
                        invoiceNumber: "",
                        invoiceDate: "",
                        customerCode: "",
                        customerName: item.customer_name,
                        address: handleAddress(
                          item.customer_address_detail,
                          item.customer_wards_name,
                          item.customer_district_name,
                          item.customer_province_name
                        ),
                        taxCode: "",
                        paraphrasing: "",
                        submitAccount: "",
                        saleStaff: "",
                        sku: "",
                        productName: product.name,
                        promotionallGoods: "",
                        cashExpensesDebitsAccount: "",
                        accountRevenue: "",
                        unit: "",
                        quantity: product.quantity,
                        unitPriceAfterTax: "",
                        unitPrice: product.after_discount,
                        intoMoney: product.after_discount
                          ? Number(product.after_discount) * 3
                          : "",
                        discountRate: "",
                        discountMoney: "",
                        discountAccount: "",
                        warehouse: item.branch?.name ?? "",
                        costAccount: "",
                        warehouseAccount: "",
                        unitPriceCapital: "",
                        funds: "",
                        goodsKeepSell: "",
                      };
                      Object.entries(arangeKeyItem).forEach(
                        ([key, value], index) => {
                          if (key == "number") {
                            newItem["Hiển thị trên số"] = value;
                          }
                          if (key == "sale_from") {
                            newItem["Hình thức bán hàng"] = value;
                          }
                          if (key == "payment_status") {
                            newItem["Phương thức thanh toán"] = value;
                          }
                          if (key == "checkExportInventory") {
                            newItem["Kiêm phiếu xuất kho"] = value;
                          }
                          if (key == "exportTariffArea") {
                            newItem[
                              "XK vào khu phi thuế quan và các TH được coi như XK"
                            ] = value;
                          }
                          if (key == "invoiceAttached") {
                            newItem["Lập kèm hóa đơn"] = value;
                          }
                          if (key == "billed") {
                            newItem["Đã lập hóa đơn"] = value;
                          }
                          if (key == "accountDate") {
                            newItem["Ngày hạch toán (*)"] = value;
                          }
                          if (key == "voucherDate") {
                            newItem["Ngày chứng từ (*)"] = value;
                          }

                          if (key == "voucherNumber") {
                            newItem["Số chứng từ (*)"] = value;
                          }
                          if (key == "voteIssued") {
                            newItem["Số phiếu xuất"] = value;
                          }
                          if (key == "reasonExport") {
                            newItem["Lý do xuất"] = value;
                          }
                          if (key == "invoiceNumber") {
                            newItem["Số hóa đơn"] = value;
                          }
                          if (key == "invoiceDate") {
                            newItem["Ngày hóa đơn"] = value;
                          }
                          if (key == "customerCode") {
                            newItem["Mã khách hàng"] = value;
                          }
                          if (key == "customerName") {
                            newItem["Tên khách hàng"] = value;
                          }
                          if (key == "address") {
                            newItem["Địa chỉ"] = value;
                          }
                          if (key == "taxCode") {
                            newItem["Mã số thuế"] = value;
                          }
                          if (key == "paraphrasing") {
                            newItem["Diễn giải"] = value;
                          }
                          if (key == "submitAccount") {
                            newItem["Nộp vào TK"] = value;
                          }
                          if (key == "saleStaff") {
                            newItem["NV bán hàng"] = value;
                          }
                          if (key == "sku") {
                            newItem["Mã hàng (*)"] = value;
                          }
                          if (key == "productName") {
                            newItem["Tên hàng"] = value;
                          }

                          if (key == "promotionallGoods") {
                            newItem["Hàng khuyến mại"] = value;
                          }
                          if (key == "cashExpensesDebitsAccount") {
                            newItem["TK Tiền/Chi phí/Nợ (*)"] = value;
                          }
                          if (key == "accountRevenue") {
                            newItem["TK Doanh thu/Có (*)"] = value;
                          }
                          if (key == "unit") {
                            newItem["ĐVT"] = value;
                          }
                          if (key == "quantity") {
                            newItem["Số lượng"] = value;
                          }
                          if (key == "unitPriceAfterTax") {
                            newItem["Đơn giá sau thuế"] = value;
                          }
                          if (key == "unitPrice") {
                            newItem["Đơn giá"] = value;
                          }
                          if (key == "intoMoney") {
                            newItem["Thành tiền"] = value;
                          }

                          if (key == "discountRate") {
                            newItem["Tỷ lệ CK (%)"] = value;
                          }

                          if (key == "discountMoney") {
                            newItem["Tiền chiết khấu"] = value;
                          }

                          if (key == "discountAccount") {
                            newItem["TK chiết khấu"] = value;
                          }

                          if (key == "warehouse") {
                            newItem["Kho"] = value;
                          }
                          if (key == "costAccount") {
                            newItem["TK giá vốn"] = value;
                          }

                          if (key == "warehouseAccount") {
                            newItem["TK Kho"] = value;
                          }

                          if (key == "unitPriceCapital") {
                            newItem["Đơn giá vốn"] = value ?? "";
                          }

                          if (key == "funds") {
                            newItem["Tiền vốn"] = value;
                          }

                          if (key == "goodsKeepSell") {
                            newItem["Hàng hóa giữ hộ/bán hộ"] = value;
                          }
                        }
                      );

                      newArray.push(newItem);
                    }
                  }
                }
                var header = [];
                if (newArray.length > 0) {
                  Object.entries(newArray[0]).forEach(([key, value], index) => {
                    header.push(key);
                  });
                }
                saveAsExcelMisa({ data: newArray, header: header });
              }
            }
          }
        }
      });
  };
};

function getSheetData(data, header) {
  var fields = Object.keys(data[0]);
  var sheetData = data.map(function (row) {
    return fields.map(function (fieldName) {
      return row[fieldName] ? row[fieldName] : "";
    });
  });
  sheetData.unshift(header);
  return sheetData;
}

async function saveAsExcel(value) {
  var data = value.data;
  var data_header = value.header;
  XlsxPopulate.fromBlankAsync().then(async (workbook) => {
    const sheet1 = workbook.sheet(0);
    const sheetData = getSheetData(data, data_header);

    const totalColumns = sheetData[0].length;

    sheet1.cell("A1").value(sheetData);
    const range = sheet1.usedRange();
    // const endColumn = String.fromCharCode(64 + totalColumns);

    const endColumn = "Z";
    sheet1.row(1).style("bold", true);

    sheet1.range("A1:" + endColumn + "1").style("fill", "F4D03F");
    range.style("border", true);

    sheet1.range("AA1:AI1").style("fill", "F4D03F");
    range.style("border", true);

    return workbook.outputAsync().then((res) => {
      saveAs(res, "DANH SACH DON HANG.xlsx");
    });
  });
}

export const fetchAllBill = (
  store_code,
  page = 1,
  branch_id,
  params = null,
  params_agency = null
) => {
  if (branch_id != null) {
    return (dispatch) => {
      dispatch({
        type: Types.SHOW_LOADING_LAZY,
        loading: "show",
      });
      billApi
        .fetchAllBill(store_code, page, branch_id, params, params_agency)
        .then((res) => {
          dispatch({
            type: Types.SHOW_LOADING_LAZY,
            loading: "hide",
          });
          if (res.data.code !== 401)
            dispatch({
              type: Types.FETCH_ALL_BILL,
              data: res.data.data,
            });
        })
        .catch(function (error) {
          dispatch({
            type: Types.SHOW_LOADING_LAZY,
            loading: "hide",
          });
        });
    };
  }
};

export const fetchBillId = (store_code, order_code) => {
  return (dispatch) => {
    dispatch({
      type: Types.SHOW_LOADING,
      loading: "show",
    });
    billApi.fetchBillId(store_code, order_code).then((res) => {
      dispatch({
        type: Types.SHOW_LOADING,
        loading: "hide",
      });
      if (res.data.code !== 401) {
        dispatch({
          type: Types.FETCH_ID_BILL,
          data: res.data.data,
        });

        billApi.fetchBillHistory(store_code, res.data.data.id).then((res) => {
          if (res.data.code !== 401)
            dispatch({
              type: Types.FETCH_BILL_HISTORY,
              data: res.data.data,
            });
        });

        billApi
          .getHistoryDeliveryStatus(store_code, {
            order_code: res.data.data.order_code,
          })
          .then((res) => {
            if (res.data.code === 200)
              dispatch({
                type: Types.FETCH_DELIVERY_HISTORY,
                data: res.data.data,
              });
          });
      }
    });
  };
};

export const getCalculate = (store_code, data, branch_id = getBranchId()) => {
  return (dispatch) => {
    billApi
      .getCalculate(store_code, data, (branch_id = getBranchId()))
      .then((res) => {
        dispatch({
          type: Types.SHOW_LOADING_LAZY,
          loading: "hide",
        });
        console.log(res);
        if (res.data.code !== 401)
          dispatch({
            type: Types.GET_CALCULATE,
            data: res.data.data,
          });
        else
          dispatch({
            type: Types.GET_CALCULATE,
            data: {},
          });
      })
      .catch(function (error) {
        dispatch({
          type: Types.GET_CALCULATE,
          data: {},
        });
        dispatch({
          type: Types.ALERT_UID_STATUS,
          alert: {
            type: "danger",
            title: "Lỗi",
            disable: "show",
            content: error?.response?.data?.msg,
          },
        });
      });
  };
};

export const fetchBillHistory = (store_code, billId) => {
  if (
    billId == undefined ||
    billId == null ||
    billId == "undefined" ||
    billId == 0
  ) {
    return;
  }

  return (dispatch) => {
    billApi.fetchBillHistory(store_code, billId).then((res) => {
      if (res.data.code !== 401)
        dispatch({
          type: Types.FETCH_BILL_HISTORY,
          data: res.data.data,
        });
    });
  };
};

export const fetchHistoryPay = (store_code, order_code) => {
  if (
    order_code == undefined ||
    order_code == null ||
    order_code == "undefined" ||
    order_code == 0
  ) {
    return;
  }

  return (dispatch) => {
    billApi.fetchHistoryPay(store_code, order_code).then((res) => {
      if (res.data.code === 200)
        dispatch({
          type: Types.FETCH_ALL_HISTORY_PAY,
          data: res.data.data,
        });
    });
  };
};

export const updateStatusOrder = (data, store_code, billId, order_code) => {
  return (dispatch) => {
    dispatch({
      type: Types.SHOW_LOADING,
      loading: "show",
    });
    billApi
      .updateStatusOrder(store_code, data)
      .then((res) => {
        dispatch({
          type: Types.SHOW_LOADING,
          loading: "hide",
        });
        dispatch({
          type: Types.ALERT_UID_STATUS,
          alert: {
            type: "success",
            title: "Thành công ",
            disable: "show",
            content: res.data.msg,
          },
        });
        billApi.fetchBillId(store_code, order_code).then((res) => {
          if (res.data.code !== 401)
            dispatch({
              type: Types.FETCH_ID_BILL,
              data: res.data.data,
            });
        });
        if (
          billId == undefined ||
          billId == null ||
          billId == "undefined" ||
          billId == 0
        ) {
          return;
        } else {
          billApi.fetchBillHistory(store_code, billId).then((res) => {
            if (res.data.code !== 401)
              dispatch({
                type: Types.FETCH_BILL_HISTORY,
                data: res.data.data,
              });
          });
        }
      })
      .catch(function (error) {
        dispatch({
          type: Types.ALERT_UID_STATUS,
          alert: {
            type: "danger",
            title: "Lỗi",
            disable: "show",
            content: error?.response?.data?.msg,
          },
        });
      });
  };
};
export const updateStatusPayment = (data, store_code, billId, order_code) => {
  return (dispatch) => {
    dispatch({
      type: Types.SHOW_LOADING,
      loading: "show",
    });
    billApi
      .updateStatusPayment(store_code, data)
      .then((res) => {
        dispatch({
          type: Types.SHOW_LOADING,
          loading: "hide",
        });
        dispatch({
          type: Types.ALERT_UID_STATUS,
          alert: {
            type: "success",
            title: "Thành công ",
            disable: "show",
            content: res.data.msg,
          },
        });
        billApi.fetchBillId(store_code, order_code).then((res) => {
          if (res.data.code !== 401)
            dispatch({
              type: Types.FETCH_ID_BILL,
              data: res.data.data,
            });
        });
        billApi.fetchBillHistory(store_code, billId).then((res) => {
          if (res.data.code !== 401)
            dispatch({
              type: Types.FETCH_BILL_HISTORY,
              data: res.data.data,
            });
        });
      })
      .catch(function (error) {
        dispatch({
          type: Types.ALERT_UID_STATUS,
          alert: {
            type: "danger",
            title: "Lỗi",
            disable: "show",
            content: error?.response?.data?.msg,
          },
        });
      });
  };
};

export const sendOrderToDelivery = (
  data,
  store_code,
  billId,
  order_code,
  order_status_code,
  bill
) => {
  return (dispatch) => {
    dispatch({
      type: Types.SHOW_LOADING,
      loading: "show",
    });
    billApi
      .sendOrderToDelivery(store_code, {
        order_code: order_code,
      })
      .then((res) => {
        dispatch({
          type: Types.SHOW_LOADING,
          loading: "hide",
        });
        dispatch({
          type: Types.ALERT_UID_STATUS,
          alert: {
            type: "success",
            title: "Thành công ",
            disable: "show",
            content: res.data.msg,
          },
        });
        if (bill.order_status_code === "SHIPPING") {
          billApi.fetchBillId(store_code, order_code).then((res) => {
            if (res.data.code !== 401)
              dispatch({
                type: Types.FETCH_ID_BILL,
                data: res.data.data,
              });
          });
        } else {
          billApi
            .updateStatusOrder(store_code, {
              order_code: order_code,
              order_status_code: order_status_code,
            })
            .then((res) => {
              billApi.fetchBillId(store_code, order_code).then((res) => {
                if (res.data.code !== 401)
                  dispatch({
                    type: Types.FETCH_ID_BILL,
                    data: res.data.data,
                  });
              });
              if (
                billId == undefined ||
                billId == null ||
                billId == "undefined" ||
                billId == 0
              ) {
                return;
              } else {
                billApi.fetchBillHistory(store_code, billId).then((res) => {
                  if (res.data.code !== 401)
                    dispatch({
                      type: Types.FETCH_BILL_HISTORY,
                      data: res.data.data,
                    });
                });
              }
            })
            .catch(function (error) {
              dispatch({
                type: Types.ALERT_UID_STATUS,
                alert: {
                  type: "danger",
                  title: "Lỗi",
                  disable: "show",
                  content: error?.response?.data?.msg,
                },
              });
            });

          billApi.getHistoryDeliveryStatus(store_code, data).then((res) => {
            if (res.data.code === 200)
              dispatch({
                type: Types.FETCH_DELIVERY_HISTORY,
                data: res.data.data,
              });
          });
        }
      })
      .catch(function (error) {
        dispatch({
          type: Types.ALERT_UID_STATUS,
          alert: {
            type: "danger",
            title: "Lỗi",
            disable: "show",
            content: error?.response?.data?.msg,
          },
        });
      });
  };
};
export const cancelConnectToDelivery = (
  store_code,
  billId,
  order_code,
  order_status_code
) => {
  return (dispatch) => {
    dispatch({
      type: Types.SHOW_LOADING,
      loading: "show",
    });
    billApi
      .cancelConnectToDelivery(store_code, order_code)
      .then((res) => {
        dispatch({
          type: Types.SHOW_LOADING,
          loading: "hide",
        });
        dispatch({
          type: Types.ALERT_UID_STATUS,
          alert: {
            type: "success",
            title: "Thành công ",
            disable: "show",
            content: res.data.msg,
          },
        });
        billApi.fetchBillId(store_code, order_code).then((res) => {
          if (res.data.code !== 401)
            dispatch({
              type: Types.FETCH_ID_BILL,
              data: res.data.data,
            });
        });
      })
      .catch(function (error) {
        dispatch({
          type: Types.ALERT_UID_STATUS,
          alert: {
            type: "danger",
            title: "Lỗi",
            disable: "show",
            content: error?.response?.data?.msg,
          },
        });
      });
  };
};

export const updateOrder = (data, store_code, order_code) => {
  return (dispatch) => {
    dispatch({
      type: Types.SHOW_LOADING,
      loading: "show",
    });

    billApi
      .updateOrder(data, store_code, order_code)
      .then((res) => {
        if (res.data.code === 200) {
          dispatch({
            type: Types.SHOW_LOADING,
            loading: "hide",
          });
          billApi.fetchBillId(store_code, order_code).then((res) => {
            if (res.data.code === 200)
              dispatch({
                type: Types.FETCH_ID_BILL,
                data: res.data.data,
              });
          });
        }
      })
      .catch(function (error) {
        dispatch({
          type: Types.ALERT_UID_STATUS,
          alert: {
            type: "danger",
            title: "Lỗi",
            disable: "show",
            content: error?.response?.data?.msg,
          },
        });
      });
  };
};

export const syncShipment = (store_code, order_code, data, syncArr) => {
  return (dispatch) => {
    billApi
      .syncShipment(store_code, order_code, data)
      .then((res) => {
        if (res.data.code === 200) {
          dispatch({
            type: Types.UPDATE_STATUS_SYNC_SHIPMENT,
            data: syncArr?.map((v) => {
              if (v.order_code === order_code) {
                return {
                  order_code: order_code,
                  payment_status: res.data.payment_status,
                  order_status: res.data.order_status,
                  status: Types.SUCCESS,
                };
              } else {
                return v;
              }
            }),
          });
        }
      })
      .catch(function (error) {
        console.log(order_code, syncArr);

        dispatch({
          type: Types.UPDATE_STATUS_SYNC_SHIPMENT,
          data: syncArr?.map((v) => {
            if (v.order_code === order_code) {
              return {
                order_code: order_code,
                payment_status: null,
                order_status: null,
                status: Types.FAILURE,
              };
            } else {
              return v;
            }
          }),
        });
      });
  };
};

export const getHistoryDeliveryStatus = (data, store_code) => {
  return (dispatch) => {
    billApi
      .getHistoryDeliveryStatus(store_code, data)
      .then((res) => {
        if (res.data.code === 200)
          dispatch({
            type: Types.FETCH_DELIVERY_HISTORY,
            data: res.data.data,
          });
      })
      .catch(function (errors) {
        console.log(errors);
      });
  };
};

export const fetchChatId = (store_code, customerId, pag = 1) => {
  return (dispatch) => {
    chatApi
      .fetchChatId(store_code, customerId, pag)
      .then((res) => {
        if (res.data.code !== 401)
          dispatch({
            type: Types.FETCH_ID_CHAT,
            data: res.data.data,
          });
      })
      .catch(function (errors) {
        console.log(errors);
      });
  };
};
export const sendMessage = (store_code, customerId, message) => {
  console.log(store_code, customerId, message);
  return (dispatch) => {
    chatApi
      .postMessage(store_code, customerId, { content: message })
      .then((res) => {
        console.log(res);
        if (res.data.code !== 401) {
          if (res.data.code == 400) {
            dispatch({
              type: Types.ALERT_UID_STATUS,
              alert: {
                type: "danger",
                title: "Lỗi",
                disable: "show",
                content: res.data.msg,
              },
            });
          } else {
            dispatch({
              type: Types.FETCH_ID_CHAT_USER,
              data: {
                customer_id: customerId,
                content: message,
                link_images: null,
                is_user: true,
                created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
              },
            });
          }
        }
      })
      .catch(function (error) {
        dispatch({
          type: Types.FETCH_ID_CHAT_USER,
          data: {},
        });
        dispatch({
          type: Types.ALERT_UID_STATUS,
          alert: {
            type: "danger",
            title: "Lỗi",
            disable: "show",
            content: error?.response?.data?.msg,
          },
        });
      });
  };
};

function getSizeImg(file, url) {
  return new Promise((resolve, reject) => {
    window.URL = window.URL || window.webkitURL;
    var width = 0,
      height = 0,
      size = 0;
    if (file) {
      var img = new Image();
      img.src = window.URL.createObjectURL(file);
      img.onload = function () {
        var _width = img.naturalWidth,
          _height = img.naturalHeight;
        window.URL.revokeObjectURL(img.src);
        console.log(_width, _height);
        height = _height;
        width = _width;
        size = file.size;
        resolve({
          link_images: url,

          height: height,
          width: width,
          size: size,
        });
      };
    }
  });
}

export const uploadImgChat = function (store_code, customerId, files) {
  return async (dispatch) => {
    var images = [];
    for (let i = 0; i < files.length; i++) {
      const fd = new FormData();
      var _file = await compressed(files[i]);
      fd.append(`image`, _file);
      try {
        var res = await uploadApi.upload(fd);

        if (res.data.code == 400) {
          {
            dispatch({
              type: Types.ALERT_UID_STATUS,
              alert: {
                type: "danger",
                title: "Lỗi",
                disable: "show",
                content: res.data.msg,
              },
            });
          }
        } else {
          images.push(await getSizeImg(_file, res.data.data));
        }
        if (i == files.length - 1) {
          var link_images = JSON.stringify(images);
          chatApi
            .postMessage(store_code, customerId, { link_images: link_images })
            .then((res) => {
              console.log(link_images);
              if (res.data.code !== 401)
                if (res.data.code == 400) {
                  dispatch({
                    type: Types.ALERT_UID_STATUS,
                    alert: {
                      type: "danger",
                      title: "Lỗi",
                      disable: "show",
                      content: res.data.msg,
                    },
                  });
                } else {
                  dispatch({
                    type: Types.FETCH_ID_CHAT_USER,
                    data: {
                      customer_id: customerId,
                      content: null,
                      link_images: link_images,
                      is_user: true,
                      created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
                    },
                  });
                }
            })
            .catch(() => {
              dispatch({
                type: Types.ALERT_UID_STATUS,
                alert: {
                  type: "danger",
                  title: "Lỗi",
                  disable: "show",
                  content: res.data.msg,
                },
              });
            });
        }
      } catch (error) {
        dispatch({
          type: Types.ALERT_UID_STATUS,
          alert: {
            type: "danger",
            title: "Lỗi",
            disable: "show",
            content: error?.response?.data?.msg,
          },
        });
      }
    }
  };
};

export const postRefund = (data, store_code, branch = getBranchId()) => {
  return (dispatch) => {
    dispatch({
      type: Types.SHOW_LOADING,
      loading: "show",
    });
    billApi
      .postRefund(data, store_code, branch)
      .then((res) => {
        dispatch({
          type: Types.SHOW_LOADING,
          loading: "hide",
        });
        dispatch({
          type: Types.ALERT_UID_STATUS,
          alert: {
            type: "success",
            title: "Thành công ",
            disable: "show",
            content: res.data.msg,
          },
        });
        history.goBack();
      })
      .catch(function (error) {
        dispatch({
          type: Types.SHOW_LOADING,
          loading: "hide",
        });
        dispatch({
          type: Types.ALERT_UID_STATUS,
          alert: {
            type: "danger",
            title: "Lỗi",
            disable: "show",
            content: error?.response?.data?.msg,
          },
        });
      });
  };
};

export const postCashRefund = (
  order_code,
  data,
  store_code,
  branch = getBranchId()
) => {
  return (dispatch) => {
    dispatch({
      type: Types.SHOW_LOADING,
      loading: "show",
    });
    billApi
      .postCashRefund(order_code, data, store_code, branch)
      .then((res) => {
        billApi.fetchBillId(store_code, order_code).then((res) => {
          dispatch({
            type: Types.SHOW_LOADING,
            loading: "hide",
          });
          if (res.data.code !== 401) {
            dispatch({
              type: Types.FETCH_ID_BILL,
              data: res.data.data,
            });

            billApi
              .fetchBillHistory(store_code, res.data.data.id)
              .then((res) => {
                if (res.data.code !== 401)
                  dispatch({
                    type: Types.FETCH_BILL_HISTORY,
                    data: res.data.data,
                  });
              });
            billApi.fetchHistoryPay(store_code, order_code).then((res) => {
              if (res.data.code === 200)
                dispatch({
                  type: Types.FETCH_ALL_HISTORY_PAY,
                  data: res.data.data,
                });
            });

            billApi
              .getHistoryDeliveryStatus(store_code, {
                order_code: res.data.data.order_code,
              })
              .then((res) => {
                if (res.data.code === 200)
                  dispatch({
                    type: Types.FETCH_DELIVERY_HISTORY,
                    data: res.data.data,
                  });
              });
          }
        });

        dispatch({
          type: Types.ALERT_UID_STATUS,
          alert: {
            type: "success",
            title: "Thành công ",
            disable: "show",
            content: res.data.msg,
          },
        });
        // history.goBack();
      })
      .catch(function (error) {
        dispatch({
          type: Types.SHOW_LOADING,
          loading: "hide",
        });
        dispatch({
          type: Types.ALERT_UID_STATUS,
          alert: {
            type: "danger",
            title: "Lỗi",
            disable: "show",
            content: error?.response?.data?.msg,
          },
        });
      });
  };
};

export const deleteOrder = (store_code, order_code) => {
  return (dispatch) => {
    dispatch({
      type: Types.SHOW_LOADING,
      loading: "show",
    });
    billApi
      .deleteOrder(store_code, order_code)
      .then((res) => {
        if (res.data.code === 200) {
          dispatch({
            type: Types.SHOW_LOADING,
            loading: "hide",
          });
          dispatch({
            type: Types.DELETE_ORDER,
            data: res.data,
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: Types.SHOW_LOADING,
          loading: "hide",
        });
        dispatch({
          type: Types.ALERT_UID_STATUS,
          alert: {
            type: "danger",
            title: "Lỗi",
            disable: "show",
            content: error?.response?.data?.msg,
          },
        });
      });
  };
};
export const updateShippingPackage = (
  store_code,
  order_code,
  data,
  funcModal
) => {
  return (dispatch) => {
    dispatch({
      type: Types.SHOW_LOADING,
      loading: "show",
    });
    billApi
      .updateShippingPackage(store_code, order_code, data)
      .then((res) => {
        funcModal();
        dispatch({
          type: Types.SHOW_LOADING,
          loading: "hide",
        });
        dispatch({
          type: Types.ALERT_UID_STATUS,
          alert: {
            type: "success",
            title: "Thành công ",
            disable: "show",
            content: res.data.msg,
          },
        });
        billApi.fetchBillId(store_code, order_code).then((res) => {
          if (res.data.code !== 401)
            dispatch({
              type: Types.FETCH_ID_BILL,
              data: res.data.data,
            });
        });
      })
      .catch(function (error) {
        dispatch({
          type: Types.ALERT_UID_STATUS,
          alert: {
            type: "danger",
            title: "Lỗi",
            disable: "show",
            content: error?.response?.data?.msg,
          },
        });
      });
  };
};
export const changeInvoiceVAT = (
  store_code,
  order_code,
  data,
  onSuccess = () => {}
) => {
  return (dispatch) => {
    dispatch({
      type: Types.SHOW_LOADING,
      loading: "show",
    });
    billApi
      .changeInvoiceVAT(store_code, order_code, data)
      .then((res) => {
        onSuccess();
        dispatch({
          type: Types.SHOW_LOADING,
          loading: "hide",
        });
        dispatch({
          type: Types.ALERT_UID_STATUS,
          alert: {
            type: "success",
            title: "Thành công ",
            disable: "show",
            content: res.data.msg,
          },
        });
        billApi.fetchBillId(store_code, order_code).then((res) => {
          if (res.data.code !== 401)
            dispatch({
              type: Types.FETCH_ID_BILL,
              data: res.data.data,
            });
        });
      })
      .catch(function (error) {
        dispatch({
          type: Types.ALERT_UID_STATUS,
          alert: {
            type: "danger",
            title: "Lỗi",
            disable: "show",
            content: error?.response?.data?.msg,
          },
        });
      });
  };
};
