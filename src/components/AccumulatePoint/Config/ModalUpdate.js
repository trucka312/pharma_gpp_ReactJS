import React, { Component } from "react";
import * as accumulateAction from "../../../actions/accumulate_point";
import { connect, shallowEqual } from "react-redux";
import * as helper from "../../../ultis/helpers";
import themeData from "../../../ultis/theme_data";
import Upload from "../../Upload";
import * as Types from "../../../constants/ActionType";
import UploadVideo from "../../UploadVideo";

class ModalUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      point: "",
      image: "",
      video: "",
      note: "",
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
  setVideo = (video) => {
    this.setState({ video });
  };
  handleClose = () => {
    this.props.clearImage();
    this.props.closeModal();
    this.setState({ name: "", point: "", image: "", video: "", note: "" });
  };
  onSave = (e) => {
    e.preventDefault();
    var { name, point, image, video, note } = this.state;
    this.props.updateAccumulatePoint(
      this.props.store_code,
      this.props.modal?.id,
      {
        name: name,
        point: point ? point?.toString()?.replace(/\./g, "") : point,
        image: image ? image : "",
        video: video ? video : "",
        note: note,
      },
      () => {
        window.$(".modal").modal("hide");
        this.props.clearImage();
        this.props.clearVideo();
        this.props.closeModal();
        this.setState({
          name: "",
          point: "",
          image: "",
          video: "",
          note: "",
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
        video: nextProps.modal?.video,
        note: nextProps.modal?.note,
      });
    }

    return true;
  }
  render() {
    var { name, point, image, video, note } = this.state;

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
              <h4 style={{ color: "white" }}>Cập nhập phần thưởng</h4>

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
              style={{
                display: "flex",
              }}
            >
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
                  Video
                </label>
                <div className="gameGuessNumber__imageContent">
                  <UploadVideo
                    setFile={this.setVideo}
                    file={video}
                    video={video}
                    style={{
                      width: "250px",
                    }}
                  />
                </div>
              </div>
            </div>
            <form onSubmit={this.onSave} role="form" action="#" method="post">
              <div class="modal-body">
                <div class="form-group">
                  <label for="name">Tên phần thường</label>
                  <input
                    required
                    type="text"
                    class="form-control"
                    id="name"
                    name="name"
                    placeholder="Nhập tên phần thường..."
                    autoComplete="off"
                    value={name}
                    onChange={this.onChange}
                  />
                </div>
                <div class="form-group">
                  <label for="point">Điểm thưởng</label>
                  <input
                    type="text"
                    class="form-control"
                    id="point"
                    name="point"
                    placeholder="Nhập điểm phần thường..."
                    autoComplete="off"
                    value={point}
                    onChange={this.onChange}
                  />
                </div>
                <div class="form-group">
                  <label for="note">Ghi chú</label>
                  <input
                    type="text"
                    class="form-control"
                    id="note"
                    name="note"
                    placeholder="Nhập ghi chú phần thường..."
                    autoComplete="off"
                    value={note}
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
    clearVideo: () => {
      dispatch({
        type: Types.UPLOAD_PRODUCT_VIDEO,
        data: "",
      });
    },
  };
};
export default connect(null, mapDispatchToProps)(ModalUpdate);
