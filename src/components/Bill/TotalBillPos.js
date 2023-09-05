import { data } from "jquery";
import React, { Component } from "react";
import getChannel, { BENITH, IKIPOS } from "../../ultis/channel";
import {
  filter_var,
  filter_arr,
  format,
  formatNoD,
  formatNumber,
  randomString,
} from "../../ultis/helpers";
import Modal from "./ModalPaymentPos";
import * as Types from "../../constants/ActionType";
import { connect } from "react-redux";
import { debounce } from "lodash";
import { updateOrder, changeInvoiceVAT } from "../../actions/bill";
import { shallowEqual } from "../../ultis/shallowEqual";
import * as OrderFrom from "../../ultis/order_from";
import ModalChangeShipDiscount from "./ModalChangeShipDiscount";
import styled from "styled-components";

const TotalBillPosStyles = styled.div`
  .status-product {
    width: 42px;
    height: 24px;
    border-radius: 100rem;
    background-color: #ecf0f1;
    border: 1px solid #dfe6e9;
    display: flex;
    align-items: center;
    transition: all 0.3s;
    padding: 0 2px;
    margin-bottom: 0;
    cursor: pointer;
    & > div {
      width: 18px;
      height: 18px;
      border-radius: 100rem;
      background-color: #7f8c8d;
      transition: all 0.3s;
    }
    &:has(input:checked) {
      background-color: #2ecc71;
    }
    input:checked + div {
      transform: translateX(100%);
      background-color: white;
    }
  }
`;
class TotalBill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      check: false,
      total_shipping_fee: "",
    };

    this.onCallApi = debounce(this.props.updateShip, 800);
  }

  componentDidMount() {
    console.log("yeah", this.props);
    this.setState({ total_shipping_fee: this.props.bill.total_shipping_fee });
  }

  // componentDidUpdate(){
  //     var {store_code , order_code} = this.props
  //     var {total_shipping_fee} = this.state

  //         this.onCallApi ({
  //             total_shipping_fee : total_shipping_fee
  //         } , store_code , order_code)

  // }

  // componentWillReceiveProps(nextProps){
  //     if(parseInt(nextProps.bill.total_shipping_fee) !== parseInt(this.props.bill.total_shipping_fee))
  //     {
  //         this.setState({total_shipping_fee : nextProps.bill.total_shipping_fee})
  //     }
  // }

  // shouldComponentUpdate(nextProps, nextState) {
  //     var { store_code, order_code } = this.props
  //     var { total_shipping_fee } = this.state
  //     if (!shallowEqual(this.state, nextState)) {
  //         this.onCallApi({
  //             total_shipping_fee: nextState.total_shipping_fee
  //         }, store_code, order_code, true)
  //     }

  //     return true
  // }

  onChange = (e) => {
    var value = formatNumber(e.target.value);

    this.setState({ total_shipping_fee: value });

    // var {store_code , order_code} = this.props
    // var {total_shipping_fee} = this.state

    //     this.onCallApi ({
    //         total_shipping_fee : total_shipping_fee
    //     } , store_code , order_code)
  };

  changeStatus = (status) => {
    this.setState({ check: status });
    this.props.resetCalculate({
      type: Types.GET_CALCULATE,
      data: {},
    });
    this.props.check(status);
  };

  checkRefundAll = (list_items) => {
    var check = true;
    for (const element of list_items) {
      if (Number(element.quantity) - Number(element.total_refund) > 0) {
        return (check = false);
      }
    }
    return check;
  };
  changeStatusModal = (statusCode, name) => {
    this.props.handleUpdateStatusOrder({
      order_status_code: statusCode,
      statusName: name,
    });
  };

  updateShip = (value) => {
    var { store_code, order_code } = this.props;

    this.props.updateShip(
      {
        total_shipping_fee: value,
      },
      store_code,
      order_code
    );
  };
  onChangeVAT = () => {
    var { bill, store_code, order_code } = this.props;
    var is_export_invoice_vat = bill.is_export_invoice_vat;
    this.props.changeInvoiceVAT(store_code, order_code, {
      is_export_invoice_vat: !is_export_invoice_vat,
    });
  };
  render() {
    var { bill } = this.props;
    var shipper_name = bill.shipper_name;
    var total_shipping_fee = bill.total_shipping_fee || 0;
    var product_discount_amount = bill.product_discount_amount || 0;
    var voucher_discount_amount = bill.voucher_discount_amount || 0;
    var balance_collaborator_used = bill.balance_collaborator_used || 0;
    var discount = bill.discount || 0;
    var ship_discount_amount = bill.ship_discount_amount;
    console.log(ship_discount_amount);
    var combo_discount_amount = bill.combo_discount_amount || 0;
    console.log(combo_discount_amount, combo_discount_amount > 0);
    var total_final = bill.total_final;
    var agree =
      bill.order_status_code == "WAITING_FOR_PROGRESSING" ? "show" : "hide";
    var cancel =
      bill.order_status_code != "WAITING_FOR_PROGRESSING" ? "show" : "hide";
    var disable =
      this.props.order_allow_change_status == true ? "show" : "hide";
    var list_items = filter_arr(bill.line_items);
    var is_export_invoice_vat = bill.is_export_invoice_vat;

    console.log("get bill", bill);
    return (
      <TotalBillPosStyles className="box box-warning cart_wrapper mb0">
        <Modal
          remaining_amount={bill.remaining_amount}
          order_code={bill.order_code}
          store_code={this.props.store_code}
        ></Modal>
        <ModalChangeShipDiscount
          updateShip={this.updateShip}
          total_shipping_fee={total_shipping_fee}
        ></ModalChangeShipDiscount>
        <div class="card-header py-3">
          <h6 class="m-0 title_content font-weight-bold text-primary">
            Tổng tiền
          </h6>
        </div>

        <div className="box-body table-responsive pt0">
          <br />
          <div>
            <p className="sale_user_label bold bold group-total">
              <div>Tạm tính</div>
              <span id="total_selected">
                {format(bill.total_before_discount || 0)}
              </span>
            </p>
          </div>
          <div>
            {bill.vat > 0 && (
              <p className="sale_user_label bold bold group-total">
                <div>Thuế VAT(10%)</div>
                <span id="total_selected">{format(bill.vat || 0)}</span>
              </p>
            )}
            <div>
              <p className="sale_user_label bold bold group-total">
                <div>Xuất hóa đơn VAT</div>
                <label className="status-product on-off">
                  <input
                    type="checkbox"
                    hidden
                    class="checkbox"
                    name={`${randomString(10)}`}
                    checked={is_export_invoice_vat}
                    onChange={this.onChangeVAT}
                  />
                  <div></div>
                </label>
              </p>
            </div>
          </div>
          {total_shipping_fee >= 0 &&
            getChannel() == BENITH &&
            bill.order_from !== OrderFrom.ORDER_FROM_POS_IN_STORE &&
            bill.order_from !== null && (
              <div id="item_fee">
                <div className="sale_user_label bold bold group-total">
                  <div>Phí giao hàng:</div>
                  {/* <input
                    // style={{
                    //     width: "85px",
                    //     "text-align": "end",
                    //     "border-bottom": "1px solid",
                    // }}
                    // type="text"
                    // name="import_price"
                    // onChange={this.onChange}
                    // id="import_prices"
                    // defaultValue={total_shipping_fee}
                    // value={formatNoD(this.state.total_shipping_fee)}
                    {...handleKeyPress}
                    class="col-6 text-input-pos"
                    value={formatNoD(
                      removeSignNumber(this.state.priceCustomer)
                    )}
                    onChange={this.handChange}
                  ></input> */}
                  {bill.order_status_code == "COMPLETED" ||
                  bill.order_status_code == "CUSTOMER_HAS_RETURNS" ? (
                    <span
                      style={{
                        "border-bottom": "1px solid",
                      }}
                    >
                      {"    "}+&nbsp;{format(total_shipping_fee)}{" "}
                    </span>
                  ) : (
                    <span
                      data-target="#modalShipAmount"
                      data-toggle="modal"
                      style={{
                        "border-bottom": "1px solid",
                        cursor: "pointer",
                      }}
                    >
                      <i
                        style={{ fontSize: "14px" }}
                        className="fa fa-pencil"
                      ></i>{" "}
                      {"    "}+&nbsp;{format(total_shipping_fee)}{" "}
                    </span>
                  )}
                </div>
              </div>
            )}
          {balance_collaborator_used > 0 && (
            <div id="item_fee">
              <div className="sale_user_label bold bold group-total">
                <div>Giảm giá ví CTV:</div>

                <span>-&nbsp;{format(balance_collaborator_used)}</span>
              </div>
            </div>
          )}
          {product_discount_amount > 0 && (
            <div
              id={`item_fee ${product_discount_amount > 0 ? "show" : "hide"}`}
            >
              <div className="sale_user_label bold group-total">
                <div> Giảm giá sản phẩm: </div>{" "}
                <span>-&nbsp;{format(product_discount_amount)}</span>
              </div>
            </div>
          )}
          {combo_discount_amount > 0 && (
            <div id={`item_fee ${combo_discount_amount > 0 ? "show" : "hide"}`}>
              <div
                className="sale_user_label bold  group-total"
                bold
                group-total
              >
                <div>Giảm giá Combo:</div>

                <span>- {format(combo_discount_amount)}</span>
              </div>
            </div>
          )}
          {voucher_discount_amount > 0 && (
            <div
              id={`item_fee ${voucher_discount_amount > 0 ? "show" : "hide"}`}
            >
              <div className="sale_user_label bold bold group-total">
                <div>Giảm giá Voucher:</div>

                <span>-&nbsp;{format(voucher_discount_amount)}</span>
              </div>
            </div>
          )}
          {discount > 0 && (
            <div id={`item_fee ${discount > 0 ? "show" : "hide"}`}>
              <div className="sale_user_label bold bold group-total">
                <div> Chiết khấu:</div>

                <span>-&nbsp;{format(discount)}</span>
              </div>
            </div>
          )}
          {ship_discount_amount > 0 && (
            <div id={`item_fee"}`}>
              <div
                className="sale_user_label bold bold group-total

              "
              >
                <div> Giảm phí vận chuyển:</div>

                <span>-&nbsp;{format(ship_discount_amount)}</span>
              </div>
            </div>
          )}
          {bill.bonus_points_amount_used != null &&
            bill.bonus_points_amount_used != 0 && (
              <div>
                <p className="sale_user_label bold bold group-total">
                  <div> Giảm giá xu:</div>

                  <span className="cart_payment_method">
                    -&nbsp;{format(bill.bonus_points_amount_used)}
                  </span>
                </p>
              </div>
            )}
          {bill.remaining_amount > 0 && (
            <div>
              <p className="sale_user_label bold bold group-total">
                <div>Đã thanh toán:</div>

                <span className="cart_payment_method">
                  {format(bill.total_final - bill.remaining_amount)}
                </span>
              </p>
            </div>
          )}
          {/* <div>
                        <p className="sale_user_label bold">
                            Còn lại:{" "}
                            <span className="cart_payment_method">
                                {format(bill.remaining_amount)}
                            </span>
                        </p>
                    </div> */}

          {total_final > 0 && (
            <div>
              <p className="sale_user_label bold bold group-total">
                <div> Thành tiền:</div>

                <span className="cart_payment_method">
                  {format(total_final)}
                </span>
              </p>
            </div>
          )}

          {bill.remaining_amount > 0 && (
            <React.Fragment>
              {/* <div>
                                <p className="sale_user_label bold">
                                    Đã thanh toán:{" "}
                                    <span className="cart_payment_method">
                                        {format(bill.total_money_refund)}

                                    </span>
                                </p>
                            </div> */}

              <div>
                <p className="sale_user_label bold bold group-total">
                  <div style={{ color: "red" }}>Còn nợ:</div>

                  <span
                    style={{ color: "red" }}
                    className="cart_payment_method"
                  >
                    {format(bill.remaining_amount)}
                  </span>
                </p>
              </div>
            </React.Fragment>
          )}
          {bill.order_status_code !== "USER_CANCELLED" &&
            bill.order_status_code !== "CUSTOMER_CANCELLED" && (
              <div style={{ textAlign: "center" }}>
                {bill.payment_status_code == "UNPAID" ||
                bill.payment_status_code == "PARTIALLY_PAID" ? (
                  <a
                    data-target="#modalPayment"
                    data-toggle="modal"
                    style={{ color: "white", background: "rgb(229, 111, 37)" }}
                    id="sale_btn_accepted"
                    className={`sale_btn_action sale_btn_action_10 btn btn-secondary w100p `}
                  >
                    {" "}
                    Thanh toán còn lại
                  </a>
                ) : bill.order_code_refund != null ||
                  this.checkRefundAll(list_items) == true ? (
                  <a
                    style={{ color: "white" }}
                    id="sale_btn_accepted"
                    className={`sale_btn_action sale_btn_action_10 btn btn-secondary w100p ${cancel} `}
                  >
                    {" "}
                    Đã hoàn hết sản phẩm
                  </a>
                ) : this.state.check == true ? (
                  <a
                    style={{ color: "white" }}
                    id="sale_btn_accepted"
                    className={`sale_btn_action sale_btn_action_10 btn btn-secondary w100p ${cancel} `}
                    onClick={() => {
                      this.changeStatus(false);
                    }}
                  >
                    Hủy
                  </a>
                ) : (
                  <a
                    style={{ color: "white" }}
                    id="sale_btn_accepted"
                    className={`sale_btn_action sale_btn_action_10 btn btn-danger w100p ${cancel} `}
                    onClick={() => {
                      this.changeStatus(true);
                    }}
                  >
                    Hoàn tiền
                  </a>
                )}
              </div>
            )}

          {getChannel() == BENITH &&
            bill.order_status_code !== "USER_CANCELLED" &&
            bill.order_status_code !== "CUSTOMER_CANCELLED" && (
              <div style={{ textAlign: "center" }}>
                {bill.order_from !== 2 &&
                  bill.order_from !== null &&
                  bill.order_status_code !== "USER_CANCELLED" &&
                  bill.order_status_code !== "CUSTOMER_CANCELLED" &&
                  bill.payment_status_code !== "UNPAID" &&
                  bill.payment_status_code != "REFUNDS" &&
                  bill.payment_status_code !== "PARTIALLY_PAID" &&
                  bill.payment_status_code !== "PAID" && (
                    <React.Fragment>
                      <a
                        id="sale_btn_accepted"
                        className={`sale_btn_action sale_btn_action_10 btn btn-info w100p ${agree} `}
                        data-toggle="modal"
                        data-target="#postModal"
                        onClick={() => {
                          this.changeStatusModal(
                            "PACKING",
                            "Đang chuẩn bị hàng"
                          );
                        }}
                      >
                        <i className="fa fa-check" /> Phê duyệt
                      </a>

                      <a
                        id="sale_btn_accepted"
                        className={`sale_btn_action sale_btn_action_10 btn btn-danger w100p ${cancel}`}
                        data-toggle="modal"
                        data-target="#postModal"
                        onClick={() => {
                          this.changeStatusModal(
                            "USER_CANCELLED",
                            "Shop đã hủy"
                          );
                        }}
                      >
                        <i className="fa fa-times" /> Hủy đơn
                      </a>
                    </React.Fragment>
                  )}

                {/* {
                                     bill.order_from !== 2 && bill.order_from !== null && (bill.order_status_code == "USER_CANCELLED" || bill.order_status_code == "CUSTOMER_CANCELLED") &&  bill.payment_status_code !== "UNPAID" && bill.payment_status_code !== "PARTIALLY_PAID" &&
                                    (
                                        <React.Fragment>

                                            <a
                                                style={{ background: "#8f9392", color: "white" }}
                                                disabled
                                                id="sale_btn_accepted dis"
                                                className={`sale_btn_action sale_btn_action_10 btn btn-danger w100p ${cancel}`}


                                            >
                                                <i className="fa fa-times" /> Hủy đơn
                                            </a>
                                        </React.Fragment>
                                    )

                                } */}
              </div>
            )}
        </div>
      </TotalBillPosStyles>
    );
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    resetCalculate: (data) => {
      dispatch(data);
    },

    updateShip: (data, store_code, order_code, noneLoading) => {
      dispatch(updateOrder(data, store_code, order_code, noneLoading));
    },
    changeInvoiceVAT: (store_code, order_code, data) => {
      dispatch(changeInvoiceVAT(store_code, order_code, data));
    },
  };
};
export default connect(null, mapDispatchToProps)(TotalBill);
