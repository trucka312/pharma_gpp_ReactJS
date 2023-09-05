import React, { Component } from "react";
import { filter_var } from "../../ultis/helpers";
import { connect } from "react-redux";
import * as billAction from "../../actions/bill";
import * as Types from "../../constants/ActionType";

class OrderStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: [
        {
          name: "Chờ xử lý",
          code: "WAITING_FOR_PROGRESSING",
        },
        {
          name: "Đang chuẩn bị hàng",
          code: "PACKING",
        },
        {
          name: "Đang giao hàng",
          code: "SHIPPING",
        },

        {
          name: "Đã hoàn thành",
          code: "COMPLETED",
        },
        {
          name: "Hết hàng",
          code: "OUT_OF_STOCK",
        },
        {
          name: "Shop đã hủy",
          code: "USER_CANCELLED",
        },
        {
          name: "Khách đã hủy",
          code: "CUSTOMER_CANCELLED",
        },

        {
          name: "Lỗi giao hàng",
          code: "DELIVERY_ERROR",
        },

        {
          name: "Chờ trả hàng",
          code: "CUSTOMER_RETURNING",
        },
        {
          name: "Đã trả hàng",
          code: "CUSTOMER_HAS_RETURNS",
        },
      ],
    };
  }

  changeStatus = (statusCode, name, statusCheck) => {
    if (statusCheck == true) {
      this.props.showError({
        type: Types.ALERT_UID_STATUS,
        alert: {
          type: "danger",
          title: "Lỗi",
          disable: "show",
          content: "Không thể chuyển về trạng thái cũ",
        },
      });
      return;
    }

    window.$("#postModal").modal("show");

    var disable = this.props.order_allow_change_status;
    if (disable == false) return;

    this.props.handleUpdateStatusOrder({
      order_status_code: statusCode,
      statusName: name,
    });
  };

  checkStatus = (status, curentStatus) => {
    if (curentStatus == "WAITING_FOR_PROGRESSING") {
      return false;
    }

    if (
      curentStatus == "OUT_OF_STOCK" ||
      curentStatus == "USER_CANCELLED" ||
      curentStatus == "CUSTOMER_CANCELLED" ||
      curentStatus == "DELIVERY_ERROR" ||
      curentStatus == "CUSTOMER_RETURNING" ||
      curentStatus == "CUSTOMER_HAS_RETURNS"
    ) {
      if (
        status == "PACKING" ||
        status == "COMPLETED" ||
        status == "SHIPPING"
      ) {
        return true;
      }
    } else if (curentStatus == "SHIPPING") {
      if (status == "PACKING") {
        return true;
      }
    } else if (curentStatus == "COMPLETED") {
      if (status !== "COMPLETED") {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
  showOrderStatus = (status) => {
    var orderStatus = this.state.status;
    var result = null;
    if (orderStatus.length > 0) {
      var disable = this.props.order_allow_change_status == true ? "modal" : "";

      result = orderStatus.map((item, index) => {
        var statusCheck = this.checkStatus(item.code, status);
        console.log(item.code, status, this.checkStatus(item.code, status));
        var disable_back_status = statusCheck == true ? "disable-color" : "";
        var active = item.code == status ? "active_status" : "";
        if (active != "") {
          return (
            <li class={`${active} hover-product`}>
              <a>{item.name}</a>
            </li>
          );
        } else {
          return (
            <li
              // data-toggle={disable}
              // data-target="#postModal"
              class={`${active} ${
                statusCheck !== true ? "hover-product" : ""
              } ${disable_back_status}`}
              onClick={() => {
                this.changeStatus(item.code, item.name, statusCheck);
              }}
            >
              <a>{item.name}</a>
            </li>
          );
        }
      });
    } else {
      return result;
    }
    return result;
  };

  render() {
    var { bill, showBoard } = this.props;
    var status = filter_var(bill.order_status_code);
    var disable = this.props.order_allow_change_status == true ? "" : "#cac4c4";

    return (
      <nav class="left-nav hidden-xs hidden-sm hidden-md">
        <ul class="nolist" style={{ minHeight: "250px" }}>
          <li
            style={{ background: "#EAEFF3", border: "2px solid #e3e5e6" }}
            class=""
          >
            <a
              style={{
                fontWeight: 600,
              }}
            >
              Trạng thái đơn hàng
            </a>
          </li>
          <li
            style={{
              maxHeight: "340px",
              overflow: "auto",
              background: disable,
            }}
          >
            {this.showOrderStatus(status)}
          </li>
        </ul>
      </nav>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    bill: state.billReducers.bill.billID,
    auth: state.authReducers.login.authentication,
    billHistoty: state.billReducers.bill.billHistory,
  };
};
const mapDispatchToProps = (dispatch, props) => {
  return {
    updateStatusOrder: (data, store_code, billId, order_code) => {
      dispatch(
        billAction.updateStatusOrder(data, store_code, billId, order_code)
      );
    },
    showError: (error) => {
      dispatch(error);
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(OrderStatus);
