import { data } from "jquery";
import React, { Component } from "react";
import getChannel, { IKIPOS, BENITH } from "../../ultis/channel";
import getNamePaymentMethod from "../../ultis/payment_method";
import { filter_var, filter_arr, format } from "../../ultis/helpers";
import payment_method from "../../ultis/payment_method";
import { Link } from "react-router-dom";
import * as OrderFrom from "../../ultis/order_from";

class InfoCustomer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var { bill , store_code } = this.props
        var { payment_method_id , payment_method_name } = bill

        var customer = bill.customer;
        var phone_customer = typeof customer == "undefined" || customer == null ? null : customer.phone_number

        var name = typeof customer == "undefined" || customer == null ? null : customer.name
        var orderTime = bill.created_at;
        var note = bill.customer_note == null ? "" : bill.customer_note
        var payment = bill.payment_method_name;
        var { customer_address } = bill;
        var phone_number = typeof customer_address == "undefined" ? null : customer_address.phone
        var email = typeof customer_address == "undefined" ? null : customer_address.email

        var address_detail = typeof customer_address == "undefined" ? null : customer_address.address_detail
        var wards_name = typeof customer_address == "undefined" ? null : customer_address.wards_name
        var district_name = typeof customer_address == "undefined" ? null : customer_address.district_name
        var province_name = typeof customer_address == "undefined" ? null : customer_address.province_name
        var name_receipt = typeof customer_address == "undefined" ? null : customer_address.name
        var id = typeof customer == "undefined" || customer == null ? null : customer.id
        var order_from = bill.order_from == OrderFrom.ORDER_FROM_APP ? "App" 
        : bill.order_from == OrderFrom.ORDER_FROM_POS_DELIVERY ? "POS giao vận"
        : bill.order_from == OrderFrom.ORDER_FROM_POS_IN_STORE ? "POS tại quầy"
        : bill.order_from == OrderFrom.ORDER_FROM_POS_SHIPPER ? "POS vận chuyển"
        : bill.order_from == OrderFrom.ORDER_FROM_WEB ? "Web"
        : "POS tại quầy"
    
        return (
            <div
                class="tab-pane active"
                id="duck"
                role="tabpanel"
                aria-labelledby="duck-tab"
            >
                <div class="row col-md-12 col-xs-12 form-group">
                    <div class="info_user" style={{ marginTop: "20px" }}>
                         <p class="sale_user_label" id="sale_user_name">
                            <b>Đơn này từ {order_from}</b>
                        </p>
                        <p class="sale_user_label" id="sale_user_name">
                            Khách hàng: <Link id="user_name" to ={`/customer/detail/${store_code}/${id}`}>{name}</Link>
                        </p>
                        <p class="sale_user_label" id="sale_user_name">
                            SĐT khách hàng: {phone_customer}
                        </p>

                        {
                            getChannel() == BENITH &&
                            <div> <p class="sale_user_label" id="sale_user_name">
                                Người nhận: <span id="user_name">{name_receipt}</span>
                            </p>
                            <p class="sale_user_label">
                            SĐT người nhận: <span id="user_tel">{phone_number}</span>
                        </p>

                                <p class="sale_user_label" id="delivery_address">
                                    Địa chỉ nhận: <span id="user_address">{address_detail}, {wards_name}, {district_name}, {province_name}</span>
                                </p>
                            </div>

                        }



                      
                        <p class="sale_user_label">
                            Email: <span id="user_tel">{email}</span>
                        </p>
                        <p class="sale_user_label" id="booking_time">
                            Thời gian: <span id="booking_time_txt">{orderTime}</span>
                        </p>
                        <p class="sale_user_label" id="booking_time">
                            Phương thức thanh toán: <span id="booking_time_txt">{payment_method_name || ""}</span>
                        </p>
                        <p class="sale_user_label">
                            Ghi chú: <span id="user_note">{note}</span>
                        </p>

                        {
                            getChannel() == IKIPOS &&
                            <p class="sale_user_label">
                                Phương thức thanh toán: &nbsp;
                                <span class="cart_payment_method">{getNamePaymentMethod(payment_method_id)}</span>

                            </p>
                        }

                        {/* {
                            getChannel() == BENITH &&
                            <p class="sale_user_label">
                                Thanh toán:
                                <span class="cart_payment_method">{payment}</span>

                            </p>
                        } */}
                    </div>

                </div>

            </div>
        );
    }
}

export default InfoCustomer;
