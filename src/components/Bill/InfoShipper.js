import { data } from "jquery";
import React, { Component } from "react";
import * as billAction from "../../actions/bill";
import { connect, shallowEqual } from "react-redux";
import ChooseShipper from "./ChooseShipper";
import moment from "moment";
import styled from "styled-components";
import { formatNumber } from "../../ultis/helpers";
import ModalCancelDelivery from "./ModalCancelDelivery";

const InfoShipperStyles = styled.div`
  .shipping__packet {
    display: flex;
    flex-direction: column;
    row-gap: 10px;
    .shipping__packet__main {
      position: relative;
      .shipping__packet__item {
        svg {
          width: 20px;
          height: 20px;
        }
        .input-group-text {
          width: 40px;
          height: 100%;
          justify-content: center;
        }
      }
      .shipping__packet_text {
        position: absolute;
        top: 50%;
        right: 10px;
        transform: translateY(-50%);
        color: #99979c;
        font-size: 14px;
      }
    }
  }
`;
class InfoShipper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shipperId: "",
      packet: {
        weight: "",
        height: "",
        length: "",
        width: "",
      },
      isUpdated: false,
      status: [
        "WAITING_FOR_PROGRESSING",
        "PACKING",
        "SHIPPING",
        "DELIVERY_ERROR",
        "CUSTOMER_RETURNING",
      ],
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { bill } = this.props;
    if (!shallowEqual(bill, nextProps.bill)) {
      const newPacket = {
        weight: nextProps?.bill?.package_weight,
        height: nextProps?.bill?.package_height,
        length: nextProps?.bill?.package_length,
        width: nextProps?.bill?.package_width,
      };
      this.setState({
        shipperId: nextProps?.bill?.partner_shipper_id,
        packet: newPacket,
      });
    }
    return true;
  }

  setIsUpdated = (isUpdated) => {
    this.setState({ isUpdated });
  };
  onChange = (e) => {
    const { isUpdated } = this.state;
    const { packet } = this.state;
    const value = e.target.value;
    const _value = formatNumber(value);
    const name = e.target.name;
    if (!isUpdated) return;
    this.setState({
      packet: {
        ...packet,
        [name]: _value,
      },
    });
  };
  handleShippingPacket = () => {
    var { order_code, store_code, updateShippingPackage } = this.props;
    var { packet } = this.state;
    const formData = {
      package_weight: packet.weight,
      package_length: packet.length,
      package_width: packet.width,
      package_height: packet.height,
    };
    updateShippingPackage(store_code, order_code, formData, () => {
      this.setIsUpdated(false);
    });
  };

  changeStatus = (statusCode, name) => {
    this.props.handleUpdateStatusOrder({
      order_status_code: statusCode,
      statusName: name,
    });
  };

  sendOrderToDelivery = () => {
    var { bill, order_code, store_code } = this.props;

    this.props.sendOrderToDelivery(
      null,
      store_code,
      bill.id,
      order_code,
      "SHIPPING",
      bill
    );
  };
  cancelConnectToDelivery = () => {
    var { bill, order_code, store_code } = this.props;

    this.props.cancelConnectToDelivery(
      store_code,
      bill.id,
      order_code,
      "WAITING_FOR_PROGRESSING"
    );
  };

  showShipment = () => {
    var result = null;
    var { shipment } = this.props;
    if (shipment?.length > 0) {
      result = shipment.map((data) => {
        return <option value={data.id}>{data.name}</option>;
      });
    }
    return result;
  };
  onChangeShipper = (e) => {
    var { value } = e.target;
    var { bill, order_code, store_code } = this.props;
    if (value == "") {
      this.setState({
        error: "Chưa chọn phương thức vận chuyển",
      });
    }
    this.props.updateOrder(
      {
        partner_shipper_id: value,
      },
      store_code,
      order_code
    );
  };
  handleShowCancelButton = () => {
    const { bill } = this.props;
    console.log("InfoShipper ~ bill:", bill?.order_status_code);
    const { status } = this.state;
    if (status.includes(bill?.order_status_code)) {
      return true;
    }
    return false;
  };

  render() {
    var { bill, historyDeliveryStatus } = this.props;
    const { packet, isUpdated } = this.state;
    var shipper_name = bill.shipper_name;
    var agree =
      bill.order_status_code == "WAITING_FOR_PROGRESSING" ? "show" : "hide";
    var disable =
      this.props.order_allow_change_status == true ? "show" : "hide";

    // if(bill.partner_shipper_id === null) {
    //     return <ChooseShipper bill={bill} store_code={this.props.store_code} order_code = {bill.order_code}/>
    // }
    return (
      <InfoShipperStyles>
        {bill.sent_delivery == false ? (
          <div className="box box-warning cart_wrapper mb0">
            <div class="card-header py-3">
              <h6 class="m-0 title_content font-weight-bold text-primary">
                Giao vận
              </h6>
            </div>

            <div className="box-body table-responsive pt0">
              <div>
                <p className="sale_user_label bold">
                  Đơn vị vận chuyển:
                  <select
                    name="shipperId"
                    id="input"
                    class="form-control"
                    required=""
                    onChange={this.onChangeShipper}
                    value={this.state.shipperId}
                  >
                    <option value="">---Chọn đơn vị vận chuyển---</option>

                    {this.showShipment()}
                  </select>
                </p>
                <p
                  className="sale_user_label bold"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "15px",
                    marginBottom: "10px",
                  }}
                >
                  Thông tin kiện hàng:
                  {isUpdated ? (
                    <button
                      className="btn btn-outline-warning btn-sm"
                      onClick={this.handleShippingPacket}
                    >
                      <i
                        className="fa fa-save"
                        style={{
                          marginTop: "0",
                        }}
                      ></i>
                      Lưu
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-warning btn-sm"
                      onClick={() => this.setIsUpdated(true)}
                    >
                      <i
                        className="fa fa-edit"
                        style={{
                          marginTop: "0",
                        }}
                      ></i>
                      Sửa
                    </button>
                  )}
                </p>
                <div className="shipping__packet">
                  <div className="shipping__packet__main">
                    <div className="input-group shipping__packet__item">
                      <div className="input-group-prepend">
                        <div className="input-group-text">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
                            />
                          </svg>
                        </div>
                      </div>
                      <input
                        type="text"
                        placeholder="Nhập cân nặng"
                        className="form-control"
                        name="weight"
                        value={packet.weight}
                        onChange={this.onChange}
                        disabled={!isUpdated}
                      />
                    </div>
                    <div className="shipping__packet_text">
                      khối lượng(gram)
                    </div>
                  </div>
                  <div className="shipping__packet__main">
                    <div className="input-group shipping__packet__item">
                      <div className="input-group-prepend">
                        <div className="input-group-text">
                          <i className="fas fa-arrows-alt-v"></i>
                        </div>
                      </div>
                      <input
                        type="text"
                        placeholder="Nhập chiều cao"
                        className="form-control"
                        name="height"
                        value={packet.height}
                        onChange={this.onChange}
                        disabled={!isUpdated}
                      />
                    </div>
                    <div className="shipping__packet_text">cao(cm)</div>
                  </div>

                  <div className="shipping__packet__main">
                    <div className="input-group shipping__packet__item">
                      <div className="input-group-prepend">
                        <div className="input-group-text">
                          <i className="fas fa-arrows-alt-h"></i>
                        </div>
                      </div>
                      <input
                        type="text"
                        placeholder="Nhập chiều dài"
                        className="form-control"
                        name="length"
                        value={packet.length}
                        onChange={this.onChange}
                        disabled={!isUpdated}
                      />
                    </div>
                    <div className="shipping__packet_text">dài(cm)</div>
                  </div>

                  <div className="shipping__packet__main">
                    <div className="input-group shipping__packet__item">
                      <div className="input-group-prepend">
                        <div className="input-group-text">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                            />
                          </svg>
                        </div>
                      </div>
                      <input
                        type="text"
                        placeholder="Nhập chiều rộng"
                        className="form-control"
                        name="width"
                        value={packet.width}
                        onChange={this.onChange}
                        disabled={!isUpdated}
                      />
                    </div>
                    <div className="shipping__packet_text">rộng(cm)</div>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div class="m-3">
                  <button
                    type="button"
                    onClick={() => this.sendOrderToDelivery()}
                    className="btn btn-primary  btn-sm"
                    style={{ marginRight: "10px" }}
                    disabled={
                      this.state.shipperId === null || this.state.shipperId < 0
                        ? true
                        : false
                    }
                  >
                    <i className="fas fa-shipping-fast"></i>
                    &nbsp;Đăng đơn hàng
                  </button>
                </div>
              </div>

              <p
                class="text-justify text-center"
                style={{
                  fontSize: 13,
                }}
              >
                {" "}
                Chuyển đơn hàng sang đơn vị vận chuyển
              </p>
            </div>
          </div>
        ) : (
          <div className="box box-warning cart_wrapper mb0">
            <div class="card-header py-3">
              <h6 class="m-0 title_content font-weight-bold text-primary">
                Trạng thái giao vận
              </h6>
            </div>

            <div className="box-body table-responsive pt0">
              <div className="mt-3">
                <p className="sale_user_label bold" style={{ color: "grey" }}>
                  Đơn vị vận chuyển:
                </p>
                <div id="total_before">{shipper_name}</div>
              </div>
              {historyDeliveryStatus.map((history) => (
                <div id="item_fee">
                  <div className="sale_user_label bold">
                    {history.status_text}:
                  </div>
                  <div>
                    <span>
                      {" "}
                      {moment(history.time).format("DD-MM-YYYY HH:mm")}
                    </span>
                  </div>
                </div>
              ))}

              {this.handleShowCancelButton() ? (
                <div style={{ textAlign: "center" }}>
                  <div class="m-3">
                    <button
                      type="button"
                      className="btn btn-danger  btn-sm"
                      style={{ marginRight: "10px" }}
                      data-toggle="modal"
                      data-target="#cancelDelivery"
                    >
                      <i className="fas fa-shipping-fast"></i>
                      &nbsp;Hủy kết nối vận chuyển
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
        <ModalCancelDelivery
          cancelConnectToDelivery={this.cancelConnectToDelivery}
        ></ModalCancelDelivery>
      </InfoShipperStyles>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    historyDeliveryStatus: state.billReducers.bill.historyDeliveryStatus,
    shipment: state.shipmentReducers.shipment.allShipment,
  };
};
const mapDispatchToProps = (dispatch, props) => {
  return {
    sendOrderToDelivery: (
      data,
      store_code,
      billId,
      order_code,
      order_status_code,
      bill
    ) => {
      dispatch(
        billAction.sendOrderToDelivery(
          data,
          store_code,
          billId,
          order_code,
          order_status_code,
          bill
        )
      );
    },
    cancelConnectToDelivery: (
      store_code,
      billId,
      order_code,
      order_status_code
    ) => {
      dispatch(
        billAction.cancelConnectToDelivery(
          store_code,
          billId,
          order_code,
          order_status_code
        )
      );
    },
    updateOrder: (data, store_code, order_code) => {
      dispatch(billAction.updateOrder(data, store_code, order_code));
    },
    updateShippingPackage: (store_code, order_code, data, funcModal) => {
      dispatch(
        billAction.updateShippingPackage(
          store_code,
          order_code,
          data,
          funcModal
        )
      );
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(InfoShipper);
