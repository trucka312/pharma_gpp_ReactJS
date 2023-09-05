import React, { Component } from "react";

import Form from "../../../../components/Promotion/Voucher/Edit/Form";
import * as Types from "../../../../constants/ActionType";

import Alert from "../../../../components/Partials/Alert";

import { connect } from "react-redux";
import * as voucherAction from "../../../../actions/voucher";
import * as productAction from "../../../../actions/product";
import * as CategoryPAction from "../../../../actions/category_product";

class Edit extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    var { store_code, voucherId, type } = this.props;
    this.props.fetchVoucherId(store_code, voucherId);
    this.props.fetchAllProduct(store_code);
    this.props.fetchAllVoucher(store_code);
    this.props.fetchAllCategoryP(store_code);
  }

  render() {
    var { voucher, products, history, vouchers } = this.props;
    var { store_code, voucherId } = this.props;
    return (
      <div class="container-fluid">
        <Alert type={Types.ALERT_UID_STATUS} alert={this.props.alert} />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h4 className="h4 title_content mb-0 text-gray-800">
            Chỉnh sửa chương trình
          </h4>
        </div>
        <br></br>
        <div class="card shadow mb-4">
          <div class="card-body">
            <section class="content">
              <div class="row">
                <div class="col-md-12 col-xs-12">
                  <div id="messages"></div>

                  <div class="box">
                    <Form
                      store_code={store_code}
                      history={history}
                      voucherId={voucherId}
                      products={products}
                      voucher={voucher}
                      vouchers={vouchers}
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.authReducers.login.authentication,
    voucher: state.voucherReducers.voucher.voucherId,
    products: state.productReducers.product.allProduct,
    vouchers: state.voucherReducers.voucher.allVoucher,
    alert: state.voucherReducers.alert.alert_uid,
  };
};
const mapDispatchToProps = (dispatch, props) => {
  return {
    fetchVoucherId: (store_code, voucherId) => {
      dispatch(voucherAction.fetchVoucherId(store_code, voucherId));
    },
    fetchAllProduct: (store_code) => {
      dispatch(productAction.fetchAllProduct(store_code));
    },
    fetchAllVoucher: (store_code) => {
      dispatch(voucherAction.fetchAllVoucher(store_code));
    },
    fetchAllCategoryP: (store_code) => {
      dispatch(CategoryPAction.fetchAllCategoryP(store_code));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Edit);
