import React, { Component } from "react";
import * as categoryPAction from "../../actions/category_product";
import { connect } from "react-redux";
import { shallowEqual } from "../../ultis/shallowEqual";
import * as helper from "../../ultis/helpers";
import * as Env from "../../ultis/default";
import { compressed } from "../../ultis/helpers";
import { isEmpty } from "../../ultis/helpers";
import * as Types from "../../constants/ActionType";
import themeData from "../../ultis/theme_data";

class ModalUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtName: "",
      id: "",
      image: "",
      fileUpload: null,
      isShowHome: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log("componentWillReceiveProps in create");
    if (!shallowEqual(nextProps.modal, this.props.modal)) {
      var category = nextProps.modal;
      this.setState({
        txtName: category.name,
        id: category.id,
        image: category.image_url,
        isShowHome: category.is_show_home,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("shouldComponentUpdate");
    if (
      !shallowEqual(nextProps.category_product, this.props.category_product) ||
      nextState.fileUpload == ""
    ) {
      window.$(".modal").modal("hide");
      window.$("#file-category-product-update").fileinput("clear");
      this.setState({
        txtName: "",
        fileUpload: null,
        isShowHome: false,
      });
    }
    return true;
  }
  onChange = (e) => {
    var target = e.target;
    var name = target.name;
    var value = target.value;

    this.setState({
      [name]: value,
    });
  };

  onSave = async (e) => {
    e.preventDefault();
    if (this.state.txtName == null || !isEmpty(this.state.txtName)) {
      this.props.showError({
        type: Types.ALERT_UID_STATUS,
        alert: {
          type: "danger",
          title: "Lỗi",
          disable: "show",
          content: "Tên danh mục không được để trống",
        },
      });
      return;
    }
    var category = this.state;
    var file = this.state.fileUpload;
    const fd = new FormData();

    if (typeof file !== "undefined" && file != "" && file != null) {
      // window.$('#file-category-product-update').fileinput('clear');
      fd.append("image", await compressed(file));

      fd.append("name", this.state.txtName);

      fd.append("is_show_home", this.state.isShowHome);

      this.props.updateCategoryP(this.props.store_code, category.id, fd);
      this.setState({ fileUpload: "" });
    } else {
      fd.append("name", this.state.txtName);

      fd.append("is_show_home", this.state.isShowHome);

      this.props.updateCategoryP(this.props.store_code, category.id, fd);
    }
  };
  componentDidMount() {
    console.log("componentdidMout");
    var _this = this;

    window
      .$("#file-category-product-update")
      .on("fileloaded", function (event, file) {
        _this.setState({ fileUpload: file });
      });
    window
      .$("#file-category-product-update")
      .on("fileremoved", function (event, id, index) {
        _this.setState({ fileUpload: null });
      });

    helper.loadFileInput("file-category-product-update");
  }
  render() {
    var { txtName, image, isShowHome } = this.state;
    var image = image == null || image == "" ? Env.IMG_NOT_FOUND : image;
    console.log("render");
    console.log("isShowHome", isShowHome);
    console.log("this.props.modal", this.props.modal);
    return (
      <div
        class="modal fade"
        tabindex="-1"
        role="dialog"
        id="updateModal"
        data-keyboard="false"
        data-backdrop="static"
      >
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div
              class="modal-header"
              style={{ backgroundColor: themeData().backgroundColor }}
            >
              <h4 class="modal-title">Chỉnh sửa danh mục</h4>

              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-hidden="true"
              >
                &times;
              </button>
            </div>
            <form
              onSubmit={this.onSave}
              role="form"
              action="#"
              method="post"
              id="removeForm"
            >
              <div class="modal-body" style={{ maxHeight: "100%" }}>
                <div class="form-group">
                  <label for="product_name">Tên danh mục</label>
                  <input
                    type="text"
                    class="form-control"
                    id="txtName"
                    placeholder="Nhập tên danh mục"
                    autoComplete="off"
                    value={txtName}
                    onChange={this.onChange}
                    name="txtName"
                  />
                  <div
                    class="form-check"
                    style={{ marginTop: "10px", padding: "0" }}
                  >
                    <label class="form-check-label">
                      <input
                        type="checkbox"
                        name="even"
                        onChange={() =>
                          this.setState({ isShowHome: !isShowHome })
                        }
                        checked={isShowHome}
                      />{" "}
                      Hiển thị sản phẩm ở trang chủ
                    </label>
                  </div>
                </div>
                <div className="" style={{ display: "flex" }}>
                  <div class="form-group">
                    <label for="product_name">Hình ảnh</label>
                    <div className="file-loading">
                      <input
                        id="file-category-product-update"
                        type="file"
                        className="file"
                        data-overwrite-initial="false"
                      />
                    </div>
                  </div>
                  <div
                    class="form-group"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginLeft: "20px",
                    }}
                  >
                    <label>Ảnh: &nbsp; </label>
                    <img src={`${image}`} width="150" height="150" />
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
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    showError: (error) => {
      dispatch(error);
    },
    updateCategoryP: (store_code, id, data) => {
      dispatch(categoryPAction.updateCategoryP(store_code, id, data));
    },
  };
};
export default connect(null, mapDispatchToProps)(ModalUpdate);
