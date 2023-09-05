import React, { Component } from "react";
import { connect } from "react-redux";
import * as productAction from "../../actions/product";
import themeData from "../../ultis/theme_data";

class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      percent_collaborator: null,
    };
  }
  onSave = (e) => {
    e.preventDefault();
    var { percent_collaborator } = this.state;
    if (percent_collaborator > 100 || percent_collaborator < 1) return;

    this.props.handleChangePerCol(percent_collaborator);
    window.$(".modal").modal("hide");
    window.$("#comfirmColModal").modal("show");
  };

  onChange = (e) => {
    var { value } = e.target;
    if (value > 100 || value < 1) return;

    this.setState({ percent_collaborator: value });
  };

  render() {
    var { modal } = this.props;
    var { percent_collaborator } = this.state;
    return (
      <div
        class="modal fade"
        tabindex="-1"
        role="dialog"
        id="colConfig"
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
                  <div class="form-group">
                    <div class="form-group">
                      <label class="form-check-label" for="gridCheck">
                        Nhập giá trị hoa hồng
                      </label>
                      <input
                        value={percent_collaborator}
                        type="number"
                        placeholder="Thiết định % hoa hồng chung cho tất cả các sản phẩm"
                        class="form-control"
                        name="percent_commission_for_products"
                        onChange={this.onChange}
                      ></input>
                    </div>
                  </div>
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
                    Lưu
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
    destroyProduct: (store_code, id) => {
      dispatch(productAction.destroyProduct(store_code, id));
    },
  }
};
export default connect(null, mapDispatchToProps)(Modal);
