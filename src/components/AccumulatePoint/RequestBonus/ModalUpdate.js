import React, { Component } from "react";
import * as accumulateAction from "../../../actions/accumulate_point";
import { connect, shallowEqual } from "react-redux";
import * as helper from "../../../ultis/helpers";
import themeData from "../../../ultis/theme_data";
import Upload from "../../Upload";
import * as Types from "../../../constants/ActionType";

class ModalUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      point: "",
      image: "",
    };
  }

  onChange = (e) => {
    var target = e.target;
    var name = target.name;
    var value = target.value;
    var valuePoint = value ? helper.formatNumberV2(value) : "";
    this.setState({
      [name]: name === "point" ? valuePoint : value,
    });
  };

  setImage = (image) => {
    this.setState({ image });
  };
  handleClose = () => {
    this.props.clearImage();
    this.props.closeModal();
    this.setState({ name: "", point: "", image: "" });
  };
  onSave = (e) => {
    e.preventDefault();
    var { name, point, image } = this.state;
    this.props.updateAccumulatePoint(
      this.props.store_code,
      this.props.modal?.id,
      {
        name: name,
        point: point ? point?.toString()?.replace(/\./g, "") : point,
        image: image ? image : "",
      },
      () => {
        window.$(".modal").modal("hide");
        this.props.clearImage();
        this.setState({
          name: "",
          point: "",
          image: "",
        });
      }
    );
  };
  shouldComponentUpdate(nextProps, nextState) {
    const { modal } = this.props;
    if (!shallowEqual(modal, nextProps.modal)) {
      this.setState({
        name: nextProps.modal?.name,
        point: nextProps.modal?.point,
        image: nextProps.modal?.image,
      });
    }

    return true;
  }
  render() {
    var { name, point, image } = this.state;

    return (
      <div
        class="modal fade"
        tabindex="-1"
        role="dialog"
        id="updateAcculatePointModal"
        data-keyboard="false"
        data-backdrop="static"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div
              class="modal-header"
              style={{ backgroundColor: themeData().backgroundColor }}
            >
              <h4 style={{ color: "white" }}>Thêm mức thưởng</h4>

              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-hidden="true"
                onClick={this.handleClose}
              >
                &times;
              </button>
            </div>
            <div
              className="form-group"
              style={{
                marginLeft: "15px",
                marginTop: "20px",
              }}
            >
              <label
                for="txtName"
                style={{
                  fontWeight: "750",
                }}
              >
                Hình ảnh
              </label>
              <div className="gameGuessNumber__imageContent">
                <Upload setFile={this.setImage} file={image} image={image} />
              </div>
            </div>
            <form onSubmit={this.onSave} role="form" action="#" method="post">
              <div class="modal-body">
                <div class="form-group">
                  <label for="name">Tên mức thường</label>
                  <input
                    required
                    type="text"
                    class="form-control"
                    id="name"
                    name="name"
                    placeholder="Nhập tên mức thường..."
                    autoComplete="off"
                    value={name}
                    onChange={this.onChange}
                  />
                </div>
                <div class="form-group">
                  <label for="point">Điểm thưởng</label>
                  <input
                    required
                    type="text"
                    class="form-control"
                    id="point"
                    name="point"
                    placeholder="Nhập tên mức thường..."
                    autoComplete="off"
                    value={point}
                    onChange={this.onChange}
                  />
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-default"
                  data-dismiss="modal"
                  onClick={this.handleClose}
                >
                  Đóng
                </button>
                <button type="submit" class="btn btn-warning">
                  Cập nhập
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
    updateAccumulatePoint: (store_code, id, form, funcModal) => {
      dispatch(
        accumulateAction.updateAccumulatePoint(store_code, id, form, funcModal)
      );
    },
    clearImage: () => {
      dispatch({
        type: Types.UPLOAD_PRODUCT_IMG,
        data: "",
      });
    },
  };
};
export default connect(null, mapDispatchToProps)(ModalUpdate);
