import React, { Component } from "react";

import Form from "../../../../components/Promotion/BonusProduct/Edit/Form";
import * as Types from "../../../../constants/ActionType";

import Alert from "../../../../components/Partials/Alert";

import { connect } from "react-redux";
import * as bonusProductAction from "../../../../actions/bonus_product";

import * as comboAction from "../../../../actions/combo";
import * as productAction from "../../../../actions/product";
import { getQueryParams } from "../../../../ultis/helpers";

class Edit extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    var { store_code, bonusProductId } = this.props;
    this.props.fetchBonusProductId(store_code, bonusProductId);
    const branch_id = localStorage.getItem("branch_id");
    this.props.fetchAllProductV2(store_code, branch_id, 1, null);
    this.props.fetchAllCombo(store_code);
  }

  render() {
    var { bonusProduct, products, history, combos } = this.props;
    var { store_code, bonusProductId } = this.props;

    return (
      <div class="container-fluid">
        <Alert type={Types.ALERT_UID_STATUS} alert={this.props.alert} />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h4 className="h4 title_content mb-0 text-gray-800">
            {getQueryParams("type") == 1
              ? "Chương trình thưởng sản phẩm đã kết thúc"
              : "Chỉnh sửa chương trình thưởng sản phẩm"}
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
                      bonusProductId={bonusProductId}
                      products={products}
                      bonusProduct={bonusProduct}
                      combos={combos}
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
    bonusProduct: state.bonusProductReducers.bonusProduct.bonusProductId,
    products: state.productReducers.product.allProduct,
    combos: state.comboReducers.combo.allCombo,
    alert: state.comboReducers.alert.alert_uid,
  };
};
const mapDispatchToProps = (dispatch, props) => {
  return {
    fetchBonusProductId: (store_code, comboId) => {
      dispatch(bonusProductAction.fetchBonusProductId(store_code, comboId));
    },
    fetchAllProductV2: (store_code, branch_id, page, params) => {
      dispatch(
        productAction.fetchAllProductV2(store_code, branch_id, page, params)
      );
    },
    fetchAllCombo: (store_code) => {
      dispatch(comboAction.fetchAllCombo(store_code));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Edit);
