import React, { Component } from "react";
import * as accumulateAction from "../../../actions/accumulate_point";
import { connect } from "react-redux";
import themeData from "../../../ultis/theme_data";

class ModalRemove extends Component {
  onSave = (e) => {
    e.preventDefault();
    var {
      store_code,
      modal,
      handleFetchData,
      deleteAccumulatePoint,
      closeModal,
    } = this.props;
    deleteAccumulatePoint(store_code, modal.id, () => {
      handleFetchData();
      closeModal();
      window.$(".modal").modal("hide");
    });
  };

  render() {
    var { modal } = this.props;
    console.log(
      "🚀 ~ file: ModalRemove.js:25 ~ ModalRemove ~ render ~ modal:",
      modal
    );
    return (
      <div
        class="modal fade"
        tabindex="-1"
        role="dialog"
        id="removeAcculatePointModal"
        data-keyboard="false"
        data-backdrop="static"
      >
        <div class="modal-dialog" role="document">
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
                Bạn có chắc chắn muốn xóa mức thưởng này không?
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
                  Xóa
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    deleteAccumulatePoint: (store_code, id, funcModal) => {
      dispatch(
        accumulateAction.deleteAccumulatePoint(store_code, id, funcModal)
      );
    },
  };
};
export default connect(null, mapDispatchToProps)(ModalRemove);
