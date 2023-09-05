import React, { Component } from "react";
import { connect } from "react-redux";
import * as productAction from "../../../actions/product";
import { getBranchId } from "../../../ultis/branchUtils";
import themeData from "../../../ultis/theme_data";

class Modal extends Component {
  onSave = (e) => {
    e.preventDefault();
    window.$(".modal").modal("hide");
    var { id, store_code, status } = this.props.modal;
    console.log("status: ", status);
    const { page, limit, searchValue } = this.props;
    var params = `${
      searchValue ? `&search=${searchValue}` : ""
    }&limit=${limit}`;
    if (status === -1 || status === 0) {
      this.props.updateOneFieldProduct(
        store_code,
        "status",
        status === 0 ? -1 : 0,
        id,
        page,
        params
      );
    } else
      this.props.destroyProduct(store_code, id, getBranchId(), page, params);
  };

  actionName = () => {
    if (this.props.modal.status === 0) return "ngừng kinh doanh";
    else if (this.props.modal.status === -1) return "kinh doanh";
    else return "xóa";
  };

  render() {
    var { modal } = this.props;
    console.log("this.props: ", this.props);
    return (
      <div
        class="modal fade"
        tabindex="-1"
        role="dialog"
        id="removeModal"
        data-keyboard="false"
        data-backdrop="static"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-content">
              <div
                class="modal-header"
                style={{ backgroundColor: themeData().backgroundColor }}
              >
                <h4 style={{ color: "white" }}>Thông báo</h4>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <form
                onSubmit={this.onSave}
                role="form"
                action="#"
                method="post"
                id="removeForm"
              >
                <div class="modal-body">
                  <input type="hidden" name="remove_id_store" />
                  <div class="alert-remove"></div>
                  Bạn có chắc chắn muốn {this.actionName()} sản phẩm này không?
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-default"
                    data-dismiss="modal"
                  >
                    Đóng
                  </button>
                  <button type="submit" class="btn btn-warning">
                    Đồng ý
                  </button>
                </div>
              </form>
            </div>

            {/* <div class="modal-header" style={{ background: "#47d3b0" }}>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <form
              onSubmit={this.onSave}
              role="form"
              action="#"
              method="post"
              id="removeForm"
            >
              <div class="modal-body">
                <input type="hidden" name="remove_id_store" />
                <div class="alert-remove"></div>
                Bạn có muốn xóa {modal.table}: {modal.name}
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-default"
                  data-dismiss="modal"
                >
                  Đóng
                </button>
                <button type="submit" class="btn btn-info">
                  Xóa
                </button>
              </div>
            </form> */}
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    destroyProduct: (store_code, id, branch_id, page, params) => {
      dispatch(
        productAction.destroyProduct(store_code, id, branch_id, page, params)
      );
    },
    updateOneFieldProduct: (store_code, name, status, id, page, params) => {
      dispatch(
        productAction.updateOneFieldProduct(store_code, name, status, id, page, params)
      );
    },
  };
};
export default connect(null, mapDispatchToProps)(Modal);
