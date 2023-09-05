import React, { Component } from "react";
import { filter_var } from "../../ultis/helpers"
class PaymentStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
                status: [
                    // {
                    //     name: "Chờ xử lý",
                    //     code: "WAITING_FOR_PROGRESSING",
                    // },
                    {
                        code: "UNPAID",
                        name: "Chưa thanh toán"
                    },
               
                    {
                        name: "Đã thanh toán",
                        code: "PAID",
                    },
                    {
                        name: "Đã thanh toán một phần",
                        code: "PARTIALLY_PAID",
                    },
                    // {
                    //     name: "Khách hủy",
                    //     code: "CUSTOMER_CANCELLED",
                    // },
                    {
                        name: "Đã hoàn tiền",
                        code: "REFUNDS",
                    }


                ]
            
        }
    }
    changeStatus = (statusCode , name) => {
        var disable = this.props.order_allow_change_status
        if(disable == false)
        return
        this.props.handleUpdateStatusPayment({payment_status_code : statusCode , statusName : name} )
    }
    showShipmetStatus = (status) => {
        var shipmentStatus  = this.state.status
        var result = null;
        if (shipmentStatus.length > 0) {
            var disable = this.props.order_allow_change_status == true ? "" : "#cac4c4"
            var disable_modal = this.props.order_allow_change_status == true ? "modal" : ""

            result = shipmentStatus.map((item, index) => {
                var active = item.code == status ? "active_status" : ""
                if(active != "")
                {
                    return (
                        <li class={`${active} hover-product`} >
                            <a >{item.name}</a>
                        </li>
                    )
                }
                else{
                    return (
                        <li 
                        style = {{background : disable}}
                        data-toggle={disable_modal}
                        data-target="#postModalPayment"
                        class={`${active} hover-product` } onClick={() => { this.changeStatus(item.code , item.name) }}>
                            <a >{item.name}</a>
                        </li>
                    )
                }
            });
        } else {
            return result;
        }
        return result;
    };



    render() {
        var { bill , showBoard } = this.props
        var status  = filter_var(bill.payment_status_code);

        return (
            <nav class="left-nav hidden-xs hidden-sm hidden-md">
                <ul class="nolist" style = {{minHeight : "250px"}} >
                <li style={{ background: "#EAEFF3",
                    border: "2px solid #e3e5e6"
                }} class="">
                        <a href="#" style={{
                            fontWeight: 600
                        }}>Trạng thái thanh toán</a>
                    </li>
              { this.showShipmetStatus(status)}

                </ul>
            </nav>

        );
    }
}

export default PaymentStatus;
