import React, { Component } from "react";
import { Link } from "react-router-dom";
import getChannel, { BENITH } from "../../ultis/channel";
import * as Env from "../../ultis/default"

class BadgeTable extends Component {
    constructor(props) {
        super(props);
    }



    render() {

        var { store_code , badges } = this.props
        var numOrderWaiting = badges.total_tally_sheet_checked
        var numOrderPacking = badges.total_import_not_completed
        var numOrderShipping = badges.orders_shipping
        var numUnread = badges.chats_unread
        var numVoucher = badges.voucher_total
        var numDiscount = badges.products_discount
        var numReview = badges.reviews_no_process 
        

        var statusOrderWaiting = numOrderWaiting == 0 || numOrderWaiting == null ? "hide-badge" : "active-badge"
        var statusOrderPacking = numOrderPacking == 0 || numOrderPacking == null ? "hide-badge" : "active-badge"
        var statusOrderShipping = numOrderShipping == 0 || numOrderShipping == null ? "hide-badge" : "active-badge"
        var statusUnread = numUnread == 0 || numUnread == null ? "hide-badge" : "active-badge"
        var statusVoucher = numVoucher == 0 || numVoucher == null ? "hide-badge" : "active-badge"
        var statusDiscount = numDiscount == 0 || numDiscount == null ? "hide-badge" : "active-badge"
        var statusReview = numReview == 0 || numReview == null ? "hide-badge" : "active-badge"


        return (
            <div class="form-group" style={{ fontSize: "15px" }}>
                <div class="info-badge" >
                    <p class="item-detail-badges" id="sale_user_name">
                        <Link to={`/inventory/index/${store_code}?status=0`}>Đơn kiểm cần xử lý </Link> <span id="user_name">
                            <span
                              
                                className={`step num-badge ${statusOrderWaiting}`}
                            >
                                {numOrderWaiting}
                            </span>
                           
                        </span>
                    </p>
                    <p class="item-detail-badges" id="delivery_address">
                        <Link to={`/import_stocks/index/${store_code}?status_list=0,1,2`}>Đơn nhập cần xử lý</Link> <span id="user_address">
                              <span
                              
                                className={`step num-badge ${statusOrderPacking}`}
                            >
                                {numOrderPacking}
                            </span>
                        </span>
                    </p>
                    {/* <p class="item-detail-badges">
                        <Link to={`/order/${store_code}/SHIPPING`}>Đơn chuyển kho cần xử lý</Link> <span id="user_tel">
                              <span
                              
                                className={`step num-badge ${statusOrderShipping}`}
                            >
                                {numOrderShipping}
                            </span>
                        </span>
                    </p> */}
                    <p class="item-detail-badges">
                        <Link to={`/chat/${store_code}`}>Tin nhắn chưa đọc </Link><span id="user_tel">
                              <span
                              
                                className={`step num-badge ${statusUnread}`}
                            >
                                {numUnread}
                            </span>
                        </span>
                    </p>
                    <p class="item-detail-badges" id="booking_time">
                        <Link to={`/voucher/${store_code}`}> Tổng voucher </Link><span id="booking_time_txt">
                              <span
                              
                                className={`step num-badge ${statusVoucher}`}
                            >
                                {numVoucher}
                            </span>
                        </span>
                    </p>
                    <p class="item-detail-badges">
                        <Link to={`/discount/${store_code}`}> Giảm giá sản phẩm </Link><span id="user_note">
                              <span
                              
                                className={`step num-badge ${statusDiscount}`}
                            >
                                {numDiscount}
                            </span>
                        </span>
                    </p>

                   {
                       getChannel() == BENITH &&  <p class="item-detail-badges">
                       <Link to={`/review/${store_code}`}>Đánh giá chờ xác nhận</Link>
                       <span class="cart_payment_method">
                             <span
                             
                               className={`step num-badge ${statusReview}`}
                           >
                               {numReview}
                           </span>
                       </span>
                   </p>
                   }
     
                </div>
            </div>

        );
    }
}

export default BadgeTable;
