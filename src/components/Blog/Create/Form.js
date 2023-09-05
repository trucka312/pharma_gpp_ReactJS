import React, { Component } from "react";
import * as Types from "../../../constants/ActionType";
import { connect } from "react-redux";
import * as blogAction from "../../../actions/blog";
import { shallowEqual } from "../../../ultis/shallowEqual";
import ModalUpload from "../ModalUpload";
import Select from "react-select";
import * as Env from "../../../ultis/default";
import { isEmpty } from "../../../ultis/helpers";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { handleImageUploadBefore } from "../../../ultis/sun_editor";
import getChannel, { BENITH } from "../../../ultis/channel";
import SeoOption from "./SeoOption";
import * as userLocalApi from "../../../data/local/user";
import {
  image as imagePlugin,
  font,
  fontSize,
  formatBlock,
  paragraphStyle,
  blockquote,
  fontColor,
  textStyle,
  list,
  lineHeight,
  table as tablePlugin,
  link as linkPlugin,
  video,
  audio,
} from "suneditor/src/plugins";
import imageGallery from "./../../imageGallery";
import { getApiImageStore } from "../../../constants/Config";

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtTitle: "",
      image: "",
      listCategory: [],
      txtSumary: "",
      txtPublished: 1,
      txtCategories: "",
      txtContent: "",
    };
  }
  componentDidMount() {
    var options = [];
    var categories = [...this.props.categories];
    if (categories.length > 0) {
      options = categories.map((category, index) => {
        console.log(category);
        return { value: category.id, label: category.title };
      });
      this.setState({ listCategory: options });
    }

    this.props.initialUpload();
  }

  componentWillReceiveProps(nextProps) {
    if (!shallowEqual(nextProps.categories, this.props.categories)) {
      var options = [];
      var categories = [...nextProps.categories];
      if (categories.length > 0) {
        options = categories.map((category, index) => {
          console.log(category);
          return { value: category.id, label: category.title };
        });
        this.setState({ listCategory: options });
      }
    }

    if (this.props.image !== nextProps.image) {
      this.setState({ image: nextProps.image });
    }
  }

  onChange = (e) => {
    var target = e.target;
    var name = target.name;
    var value = target.value;

    this.setState({
      [name]: value,
    });
  };
  onChangeSelect = (selectValue) => {
    this.setState({ txtCategories: selectValue });
  };

  handleEditorChange = (editorState) => {
    this.setState({
      txtContent: editorState,
    });
  };

  handleDataFromContent = (data) => {
    this.setState({
      txtSeoTitle: data.txtSeoTitle,
      txtSeoDescription: data.txtSeoDescription,
    });
  };

  onSave = (e) => {
    var { store_code } = this.props;
    e.preventDefault();
    var {
      txtContent,
      txtTitle,
      image,
      txtSumary,
      txtPublished,
      txtCategories,
      txtSeoDescription,
      txtSeoTitle,
    } = this.state;

    if (txtTitle == null || !isEmpty(txtTitle)) {
      this.props.showError({
        type: Types.ALERT_UID_STATUS,
        alert: {
          type: "danger",
          title: "Lỗi",
          disable: "show",
          content: "Tiêu đề không được để trống",
        },
      });
      return;
    }
    if (
      txtCategories.value == null ||
      typeof txtCategories.value == "undefined"
    ) {
      this.props.showError({
        type: Types.ALERT_UID_STATUS,
        alert: {
          type: "danger",
          title: "Lỗi",
          disable: "show",
          content: "Danh mục không được để trống",
        },
      });
      return;
    }
    var published = Number(txtPublished) == 1 ? true : false;
    var category_id = null;
    if (
      txtCategories.value != null &&
      txtCategories.value != "" &&
      typeof txtCategories.value != "undefined"
    ) {
      category_id = txtCategories.value;
    }
    this.props.createBlog(store_code, {
      content: txtContent,
      title: txtTitle,
      image_url: image,
      category_id: category_id,
      summary: txtSumary,
      published: published,
      seo_title: txtSeoTitle,
      seo_description: txtSeoDescription,
    });
  };

  goBack = () => {
    var { history } = this.props;
    history.goBack();
  };

  render() {
    var {
      txtTitle,
      txtContent,
      image,
      listCategory,
      txtSumary,
      txtPublished,
      txtCategories,
      txtSeoDescription,
      txtSeoTitle,
    } = this.state;
    var image = image == "" || image == null ? Env.IMG_NOT_FOUND : image;

    var { store_code } = this.props;

    return (
      <React.Fragment>
        <form role="form" onSubmit={this.onSave} method="post">
          <div class="box-body">
            <div class="row">
              <div
                class="col-xs-7 col-sm-7 col-md-7 col-lg-7"
                style={{ borderRight: "0.5px solid #cac9c9" }}
              >
                <div class="form-group">
                  <label for="product_name">Tên bài viết</label>
                  <input
                    type="text"
                    class="form-control"
                    id="txtTitle"
                    value={txtTitle}
                    placeholder="Nhập tên bài viết"
                    autoComplete="off"
                    onChange={this.onChange}
                    name="txtTitle"
                  />
                </div>
                <div class="form-group">
                  <label for="product_name">Danh mục</label>
                  <Select
                    placeholder="-- Chọn danh mục --"
                    value={txtCategories}
                    isClearable
                    isSearchable
                    options={listCategory}
                    name="txtCategory"
                    onChange={this.onChangeSelect}
                  />
                </div>

                <div class="form-group">
                  <label for="product_name">Trạng thái</label>

                  <select
                    name="txtPublished"
                    value={txtPublished}
                    onChange={this.onChange}
                    id="input"
                    class="form-control"
                  >
                    <option value="1">Hiển thị</option>
                    <option value="0">Lưu tạm</option>
                  </select>
                </div>
              </div>

              <div class="col-xs-5 col-sm-5 col-md-5 col-lg-5">
                <div class="form-group">
                  <label>Ảnh: &nbsp; </label>
                  <img src={`${image}`} width="150" height="150" />
                </div>
                <div class="form-group">
                  <div class="kv-avatar">
                    <div>
                      <button
                        type="button"
                        class="btn btn-primary btn-sm"
                        data-toggle="modal"
                        data-target="#uploadModalBlog"
                      >
                        <i class="fa fa-plus"></i> Upload ảnh
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="product_name">Mô tả bài viết</label>

              <textarea
                name="txtSumary"
                onChange={this.onChange}
                value={txtSumary}
                id="input"
                class="form-control"
                rows="3"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="product_name">Nội dung bài viết</label>
              <div className="editor">
                <SunEditor
                  onImageUploadBefore={handleImageUploadBefore}
                  showToolbar={true}
                  onChange={this.handleEditorChange}
                  setDefaultStyle="height: auto"
                  setOptions={{
                    requestHeaders: {
                      "X-Sample": "sample",
                      token: userLocalApi.getToken(),
                    },
                    imageGalleryLoadURL: getApiImageStore(store_code),

                    plugins: [
                      imagePlugin,
                      imageGallery,
                      font,
                      fontSize,
                      formatBlock,
                      paragraphStyle,
                      blockquote,
                      fontColor,
                      textStyle,
                      list,
                      lineHeight,
                      tablePlugin,
                      linkPlugin,
                      video,
                      audio,
                    ],

                    buttonList: [
                      [
                        "undo",
                        "redo",
                        "font",
                        "fontSize",
                        "formatBlock",
                        "paragraphStyle",
                        "blockquote",
                        "bold",
                        "underline",
                        "italic",
                        "fontColor",
                        "textStyle",
                        "outdent",
                        "align",
                        "horizontalRule",
                        "list",
                        "lineHeight",
                        "table",
                        "link",
                        "image",
                        "video",
                        "audio",
                        "imageGallery",
                        "fullScreen",
                        "preview",
                        "codeView",
                        "removeFormat",
                      ],
                    ],
                  }}
                />
              </div>
            </div>

            {getChannel() == BENITH && (
              <div class="card mb-4">
                <div class="card-header title_content">Tối ưu SEO</div>
                <div class="card-body" style={{ padding: "0.8rem" }}>
                  <div class="row">
                    <SeoOption
                      txtSeoDescription={txtSeoDescription}
                      txtSeoTitle={txtSeoTitle}
                      handleDataFromContent={this.handleDataFromContent}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div class="box-footer">
            <button type="submit" class="btn btn-info   btn-sm">
              <i class="fas fa-save"></i> Tạo
            </button>
            <button
              type="button"
              style={{ marginLeft: "10px" }}
              onClick={this.goBack}
              class="btn btn-warning   btn-sm"
            >
              <i class="fas fa-arrow-left"></i> Trở về
            </button>
          </div>
        </form>

        <ModalUpload store_code={store_code} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    image: state.UploadReducers.blogImg.blog_img,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    showError: (error) => {
      dispatch(error);
    },
    initialUpload: () => {
      dispatch(blogAction.initialUpload());
    },
    createBlog: (store_code, data) => {
      dispatch(blogAction.createBlog(store_code, data));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Form);
