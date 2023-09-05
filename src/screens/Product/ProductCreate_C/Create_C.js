import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import InfoProduct from "../../../components/Product/Update/InfoProduct";
import ContentDetail from "../../../components/Product/Update/ContentDetail";
import InfoDiscount from "../../../components/Product/Update/InfoDiscount";
import * as blogAction from "../../../actions/blog";
import Video from "../../../components/Product/Update/Video";

import Attribute from "../../../components/Product/Update/Attribute";
import Distribute from "../../../components/Product/Update/Distribute";
import StoreImage from "../../../components/Product/Update/StoreImage";
import * as productAction from "../../../actions/product";
import * as CategoryPAction from "../../../actions/category_product";
import * as Types from "../../../constants/ActionType";
import Alert from "../../../components/Partials/Alert";
import SeoOption from "../../../components/Product/Update/SeoOption";
import getChannel, { BENITH, IKIPOS } from "../../../ultis/channel";
import {
  formatNumberV2,
  isEmpty,
  removeVietnameseTones,
} from "../../../ultis/helpers";

class ProductEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {},
      total: "",
      disableDistribute: false,
      disableInventory: false,
      custom_view: "",
      custom_stock: "",
      custom_sold: "",
      custom_point: "",
    };
  }

  checkDistribute = (status, _status) => {
    console.log(status, _status);
    this.setState({ disableDistribute: status, disableInventory: _status });
  };

  componentDidMount() {
    var { store_code, productId } = this.props;
    this.props.fetchProductId(store_code, productId);
    this.props.fetchAllAttributeP(store_code);
    this.props.fetchAllCategoryP(store_code);
    this.props.fetchAllBlog(store_code, 1);
  }

  handleDataFromInfo = (data) => {
    this.setState((prevState, props) => {
      var formdata = { ...prevState.form };
      formdata.name = data.txtName;
      formdata.price = data.txtPrice
        .toString()
        .replace(/,/g, "")
        .replace(/\./g, "");
      formdata.import_price = data.txtImportPrice
        .toString()
        .replace(/,/g, "")
        .replace(/\./g, "");
      formdata.barcode = data.txtBarcode;
      formdata.status = data.txtStatus;
      formdata.point_for_agency = data.point_for_agency
        ?.toString()
        .replace(/,/g, "")
        .replace(/\./g, "");

      formdata.quantity_in_stock = data.txtQuantityInStock
        .toString()
        .replace(/,/g, "")
        .replace(/\./g, "");
      formdata.percent_collaborator = data.txtPercentC;
      formdata.sku = data.sku;
      formdata.check_inventory = data.check_inventory;

      var categories = [];
      var category_children_ids = [];
      if (data.category_parent.length > 0) {
        categories = data.category_parent.map((categoryParent, index) => {
          return categoryParent.id;
        });
      }
      if (data.category_children_ids.length > 0) {
        category_children_ids = data.category_children_ids.map(
          (categoryChild, index) => {
            return categoryChild.id;
          }
        );
      }
      formdata.categories = categories;
      formdata.category_children_ids = category_children_ids;
      return { form: formdata };
    });
  };

  handleDataFromProductImg = (data) => {
    this.setState((prevState, props) => {
      var formdata = { ...prevState.form };
      formdata.images = data.listImgProduct;
      return { form: formdata };
    });
  };

  handleDataFromAvatarImg = (data) => {
    this.setState((prevState, props) => {
      var formdata = { ...prevState.form };
      formdata.index_image_avatar = data.avatar_product;
      return { form: formdata };
    });
  };

  handleDataFromDiscount = (data) => {
    this.setState((prevState, props) => {
      var formdata = { ...prevState.form };
      formdata.list_promotion = data;
      return { form: formdata };
    });
  };

  handleDataFromContent = (data) => {
    this.setState((prevState, props) => {
      var formdata = { ...prevState.form };
      formdata.content_for_collaborator = data.txtContentC;
      formdata.description = data.txtContent;
      formdata.seo_title = data.txtSeoTitle;
      formdata.seo_description = data.txtSeoDescription;

      return { form: formdata };
    });
  };

  handleDataFromAttribute = (data) => {
    this.setState((prevState, props) => {
      var formdata = { ...prevState.form };
      var listAttribute = [];
      var item = {};
      var name = "";
      Object.entries(data).forEach(([key, attribute], index) => {
        Object.entries(attribute).forEach(([_key, attributeItem], _index) => {
          Object.entries(attributeItem).forEach(
            ([__key, _attributeItem], __index) => {
              if (__key === "name") {
                name = _attributeItem;
              } else {
                item = { name, value: _attributeItem };
              }
            }
          );
          listAttribute.push(item);
        });
      });
      formdata.list_attribute = listAttribute;

      return { form: formdata };
    });
  };

  handleDataFromDistribute = (data) => {
    this.setState((prevState, props) => {
      var formdata = { ...prevState.form };
      formdata.list_distribute = data;
      return { form: formdata };
    });
  };

  postProduct = () => {
    var { store_code } = this.props;
    const { custom_view, custom_stock, custom_sold, custom_point } = this.state;
    const branch_id = localStorage.getItem("branch_id");
    var form = { ...this.state.form };
    form.index_image_avatar = 0;
    form.custom_view = custom_view
      ? custom_view?.toString().replace(/\./g, "")
      : 0;
    form.custom_sold = custom_sold
      ? custom_sold?.toString().replace(/\./g, "")
      : 0;
    form.custom_stock = custom_stock
      ? custom_stock?.toString().replace(/\./g, "")
      : 0;
    form.custom_point = custom_point
      ? custom_point?.toString().replace(/\./g, "")
      : 0;

    if (typeof form.list_distribute != "undefined") {
      if (typeof form.list_distribute[0] != "undefined") {
        if (typeof form.list_distribute[0].element_distributes != "undefined") {
          if (form.list_distribute[0].element_distributes.length > 0) {
            form.list_distribute[0].element_distributes.forEach(
              (element, index) => {
                try {
                  console.log(element);
                  const price =
                    element.price != null
                      ? element.price
                          .toString()
                          .replace(/,/g, "")
                          .replace(/\./g, "")
                      : 0;
                  const import_price =
                    element.import_price != null
                      ? element.import_price
                          .toString()
                          .replace(/,/g, "")
                          .replace(/\./g, "")
                      : 0;
                  const barcode =
                    element.barcode != null
                      ? removeVietnameseTones(element.barcode)
                      : 0;
                  const quantity_in_stock =
                    element.quantity_in_stock != null
                      ? element.quantity_in_stock
                          .toString()
                          .replace(/,/g, "")
                          .replace(/\./g, "")
                      : 0;
                  const cost_of_capital =
                    element.cost_of_capital != null
                      ? element.cost_of_capital
                          .toString()
                          .replace(/,/g, "")
                          .replace(/\./g, "")
                      : 0;
                  form.list_distribute[0].element_distributes[index].price =
                    price;
                  form.list_distribute[0].element_distributes[
                    index
                  ].import_price = import_price;
                  form.list_distribute[0].element_distributes[
                    index
                  ].cost_of_capital = cost_of_capital;
                  form.list_distribute[0].element_distributes[
                    index
                  ].quantity_in_stock = quantity_in_stock;
                  form.list_distribute[0].element_distributes[index].barcode =
                    removeVietnameseTones(barcode);
                  form.list_distribute[0].element_distributes[index].stock =
                    quantity_in_stock;
                  console.log(
                    price,
                    form.list_distribute[0].element_distributes[index].price
                  );

                  if (typeof element.sub_element_distributes != "undefined") {
                    if (element.sub_element_distributes.length > 0) {
                      element.sub_element_distributes.forEach(
                        (_element, _index) => {
                          try {
                            const price =
                              _element.price != null
                                ? _element.price
                                    .toString()
                                    .replace(/,/g, "")
                                    .replace(/\./g, "")
                                : 0;
                            const import_price =
                              _element.import_price != null
                                ? _element.import_price
                                    .toString()
                                    .replace(/,/g, "")
                                    .replace(/\./g, "")
                                : 0;
                            const cost_of_capital =
                              _element.cost_of_capital != null
                                ? _element.cost_of_capital
                                    .toString()
                                    .replace(/,/g, "")
                                    .replace(/\./g, "")
                                : 0;
                            const barcode =
                              _element.barcode != null
                                ? removeVietnameseTones(_element.barcode)
                                : 0;
                            const quantity_in_stock =
                              _element.quantity_in_stock != null
                                ? _element.quantity_in_stock
                                    .toString()
                                    .replace(/,/g, "")
                                    .replace(/\./g, "")
                                : 0;

                            form.list_distribute[0].element_distributes[
                              index
                            ].sub_element_distributes[_index].price = price;
                            form.list_distribute[0].element_distributes[
                              index
                            ].sub_element_distributes[_index].import_price =
                              import_price;
                            form.list_distribute[0].element_distributes[
                              index
                            ].sub_element_distributes[_index].cost_of_capital =
                              cost_of_capital;
                            form.list_distribute[0].element_distributes[
                              index
                            ].sub_element_distributes[
                              _index
                            ].quantity_in_stock = quantity_in_stock;
                            form.list_distribute[0].element_distributes[
                              index
                            ].sub_element_distributes[_index].stock =
                              quantity_in_stock;
                            form.list_distribute[0].element_distributes[
                              index
                            ].sub_element_distributes[_index].barcode =
                              removeVietnameseTones(barcode);

                            console.log("sub element form", form);
                          } catch (error) {
                            form.list_distribute[0].element_distributes[
                              index
                            ].sub_element_distributes[_index].price = 0;
                            form.list_distribute[0].element_distributes[
                              index
                            ].sub_element_distributes[_index].import_price = 0;
                            form.list_distribute[0].element_distributes[
                              index
                            ].sub_element_distributes[
                              _index
                            ].cost_of_capital = 0;
                            form.list_distribute[0].element_distributes[
                              index
                            ].sub_element_distributes[_index].stock = 0;
                            form.list_distribute[0].element_distributes[
                              index
                            ].sub_element_distributes[
                              _index
                            ].quantity_in_stock = 0;
                            form.list_distribute[0].element_distributes[
                              index
                            ].sub_element_distributes[_index].barcode = "";
                          }
                        }
                      );
                    }
                  }
                } catch (error) {
                  console.log(error);
                  form.list_distribute[0].element_distributes[index].price = 0;
                  form.list_distribute[0].element_distributes[
                    index
                  ].import_price = 0;
                  form.list_distribute[0].element_distributes[
                    index
                  ].cost_of_capital = 0;
                  form.list_distribute[0].element_distributes[index].stock = 0;
                  form.list_distribute[0].element_distributes[
                    index
                  ].quantity_in_stock = 0;
                  form.list_distribute[0].element_distributes[index].barcode =
                    "";
                }
              }
            );
          }
        }
      }
    }
    var total = this.state.total
      .toString()
      .replace(/,/g, "")
      .replace(/\./g, "");
    if (typeof form.list_distribute != "undefined") {
      form.quantity_in_stock =
        form.list_distribute.length > 0 ? total : form.quantity_in_stock;
    }
    // this.props.postProduct(store_code, form)
    console.log("ấdfsdfsdkfjsd", form);
    if (form.name == null || !isEmpty(form.name)) {
      this.props.showError({
        type: Types.ALERT_UID_STATUS,
        alert: {
          type: "danger",
          title: "Lỗi",
          disable: "show",
          content: "Vui lòng nhập tên sản phẩm",
        },
      });
      return;
    }

    if (form.barcode === form.sku && isEmpty(form.sku)) {
      this.props.showError({
        type: Types.ALERT_UID_STATUS,
        alert: {
          type: "danger",
          title: "Lỗi",
          disable: "show",
          content: "Barcode không thể trùng với mã SKU",
        },
      });
      return;
    }
    if (this.state.checkDistribute == false) {
      if (form.price == null || !isEmpty(form.price)) {
        this.props.showError({
          type: Types.ALERT_UID_STATUS,
          alert: {
            type: "danger",
            title: "Lỗi",
            disable: "show",
            content: "Vui lòng nhập giá bán lẻ",
          },
        });
        return;
      }
      if (form.import_price == null || !isEmpty(form.import_price)) {
        this.props.showError({
          type: Types.ALERT_UID_STATUS,
          alert: {
            type: "danger",
            title: "Lỗi",
            disable: "show",
            content: "Vui lòng nhập giá nhập",
          },
        });
        return;
      }
    }
    // if (form.import_price == null || !isEmpty(form.import_price)) {
    //   this.props.showError({
    //     type: Types.ALERT_UID_STATUS,
    //     alert: {
    //       type: "danger",
    //       title: "Lỗi",
    //       disable: "show",
    //       content: "Vui lòng nhập giá nhập",
    //     },
    //   });
    //   return;
    // }
    var is_error = false;
    if (typeof form.list_distribute != "undefined") {
      if (typeof form.list_distribute[0] != "undefined") {
        if (typeof form.list_distribute[0].element_distributes != "undefined") {
          if (form.list_distribute[0].element_distributes.length > 0) {
            form.list_distribute[0].element_distributes.forEach(
              (element, index) => {
                if (typeof element?.sub_element_distributes != "undefined") {
                  if (element?.sub_element_distributes.length > 0) {
                    element?.sub_element_distributes.forEach(
                      (_element, _index) => {
                        const price = _element.price
                          .toString()
                          .replace(/,/g, "")
                          .replace(/\./g, "");
                        const import_price = _element.import_price
                          .toString()
                          .replace(/,/g, "")
                          .replace(/\./g, "");
                        console.log(
                          price,
                          import_price,
                          Number(import_price),
                          typeof Number(import_price),
                          Number(import_price) == 0
                        );
                        if (
                          // price == null ||
                          Number(price) == 0
                          // !isEmpty(price)
                        ) {
                          is_error = true;
                          this.props.showError({
                            type: Types.ALERT_UID_STATUS,
                            alert: {
                              type: "danger",
                              title: "Lỗi",
                              disable: "show",
                              content: "Vui lòng nhập giá bán lẻ cho phân loại",
                            },
                          });
                          this.setState({
                            isError: true,
                          });
                        }

                        if (
                          // import_price == null ||
                          Number(import_price) == 0
                          // !isEmpty(import_price)
                        ) {
                          is_error = true;
                          this.props.showError({
                            type: Types.ALERT_UID_STATUS,
                            alert: {
                              type: "danger",
                              title: "Lỗi",
                              disable: "show",
                              content: "Vui lòng nhập giá nhập cho phân loại",
                            },
                          });
                          this.setState({
                            isError: true,
                          });
                        } else {
                          is_error = false;
                          this.setState({
                            isError: false,
                          });
                        }
                      }
                    );
                  }
                }
              }
            );
          }
        }
      }
    }
    if (this.state.isError || is_error) {
      return;
    }
    if (this.state.checkDistribute == false) {
      delete form.list_distribute;
    }

    console.log(form);
    this.props.postProductV2(store_code, branch_id, form);
  };
  goBack = (e) => {
    e.preventDefault();
    var { history } = this.props;
    history.goBack();
  };
  onChangeQuantityStock = (total) => {
    this.setState({ total: total });
  };

  handleDataFromProductVideo = (video) => {
    console.log(video);
    this.setState((prevState, props) => {
      var formdata = { ...prevState.form };
      formdata.video_url = video;
      return { form: formdata };
    });
  };

  onChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;

    this.setState({
      [name]: value !== "" ? formatNumberV2(value) : "",
    });
  };

  render() {
    var { store_code } = this.props;
    var {
      category_product,
      attributeP,
      auth,
      product,
      isShowAttr,
      isCreate,
      isRemove,
    } = this.props;
    var {
      total,
      disableInventory,
      disableDistribute,
      custom_view,
      custom_sold,
      custom_stock,
      custom_point,
    } = this.state;
    return (
      <div class="container-fluid">
        <Alert type={Types.ALERT_UID_STATUS} alert={this.props.alert} />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h4 className="h4 title_content mb-0 text-gray-800">
            <h4 className="h4 title_content mb-0 text-gray-800">
              Thêm sản phẩm
            </h4>
          </h4>
        </div>
        <br></br>
        <div class="card mb-4">
          <nav className="card-header title_content">
            <div class="nav nav-tabs" id="nav-tab" role="tablist">
              <a
                class="nav-item nav-link active"
                id="nav-info-product-tab"
                data-toggle="tab"
                href="#nav-info-product"
                role="tab"
                aria-controls="nav-info-product"
                aria-selected="true"
              >
                Nhập thông tin sản phẩm
              </a>
              <a
                class="nav-item nav-link"
                id="nav-attribute-product-tab"
                data-toggle="tab"
                href="#nav-attribute-product"
                role="tab"
                aria-controls="nav-attribute-product"
                aria-selected="false"
              >
                Nhập thuộc tính sản phẩm
              </a>
            </div>
          </nav>
          <div class="tab-content" id="nav-tabContent">
            <div
              class="tab-pane fade show active"
              id="nav-info-product"
              role="tabpanel"
              aria-labelledby="nav-info-product-tab"
            >
              <div class="card-body" style={{ padding: "0.8rem" }}>
                <div class="row">
                  <div class="col-lg-6">
                    <div>
                      <InfoProduct
                        isCopy={true}
                        checkDistribute={this.checkDistribute}
                        total={total}
                        product={product}
                        handleDataFromInfo={this.handleDataFromInfo}
                        category_product={category_product}
                      />
                    </div>
                  </div>

                  <div
                    class="col-lg-6"
                    style={{ borderLeft: "0.5px solid #e6dfdf" }}
                  >
                    <div>
                      <Video
                        store_code={store_code}
                        product={product}
                        handleDataFromProductVideo={
                          this.handleDataFromProductVideo
                        }
                      />
                    </div>
                    <div>
                      <StoreImage
                        handleDataFromAvatarImg={this.handleDataFromAvatarImg}
                        product={product}
                        handleDataFromProductImg={this.handleDataFromProductImg}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="tab-pane fade"
              id="nav-attribute-product"
              role="tabpanel"
              aria-labelledby="nav-attribute-product-tab"
            >
              <div class="card-body" style={{ padding: "0.8rem" }}>
                <div class="form-group">
                  <label for="custom_view">Số lượng mắt xem</label>
                  <input
                    type="text"
                    class="form-control input-sm"
                    id="custom_view"
                    placeholder="Nhập số lượng mắt xem"
                    autoComplete="off"
                    value={custom_view}
                    onChange={this.onChange}
                    name="custom_view"
                  />
                </div>
                <div class="form-group">
                  <label for="custom_sold">Số lượng đã bán</label>
                  <input
                    type="text"
                    class="form-control input-sm"
                    id="custom_sold"
                    placeholder="Nhập số  lượng còn lại"
                    autoComplete="off"
                    value={custom_sold}
                    onChange={this.onChange}
                    name="custom_sold"
                  />
                </div>
                <div class="form-group">
                  <label for="custom_stock">Số lượng còn lại</label>
                  <input
                    type="text"
                    class="form-control input-sm"
                    id="custom_stock"
                    placeholder="Nhập số  lượng còn lại"
                    autoComplete="off"
                    value={custom_stock}
                    onChange={this.onChange}
                    name="custom_stock"
                  />
                </div>
                <div class="form-group">
                  <label for="custom_point">Điểm</label>
                  <input
                    type="text"
                    class="form-control input-sm"
                    id="custom_point"
                    placeholder="Nhập điểm"
                    autoComplete="off"
                    value={custom_point}
                    onChange={this.onChange}
                    name="custom_point"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {getChannel() == BENITH && (
          <div class="card mb-4">
            <div class="card-body" style={{ padding: "0.8rem" }}>
              <div class="row">
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <button
                    class="btn btn-primary btn-sm"
                    onClick={this.postProduct}
                  >
                    <i class="fa fa-plus"></i> Tạo
                  </button>
                  <a
                    style={{ marginLeft: "10px" }}
                    onClick={this.goBack}
                    class={`btn btn-warning btn-sm color-white `}
                  >
                    <i class="fa fa-arrow-left"></i> Trở về
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
        <div
          class={`card mb-4 ${
            typeof isShowAttr == "undefined" ||
            isShowAttr == false ||
            getChannel() == IKIPOS
              ? "hide"
              : ""
          }`}
        >
          <div class="card-header title_content">Thuộc tính sản phẩm</div>
          <div class="card-body" style={{ padding: "0.8rem" }}>
            <div class="row">
              <div class="col-lg-12">
                <div>
                  <div class="card-body" style={{ padding: "0.8rem" }}>
                    <Attribute
                      isCreate={isCreate}
                      isRemove={isRemove}
                      product={product}
                      handleDataFromAttribute={this.handleDataFromAttribute}
                      store_code={store_code}
                      attributeP={attributeP}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class={`card mb-4 ${
            this.state.disableDistribute == true ? "" : "hide"
          }`}
        >
          <div class="card-header title_content">Phân loại sản phẩm</div>
          <div class="card-body" style={{ padding: "0.8rem" }}>
            <div class="row">
              <div class="col-lg-12">
                <div>
                  <div class="card-body" style={{ padding: "0.8rem" }}>
                    <Distribute
                      disableDistribute={disableDistribute}
                      disableInventory={disableInventory}
                      onChangeQuantityStock={this.onChangeQuantityStock}
                      product={product}
                      handleDataFromDistribute={this.handleDataFromDistribute}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {getChannel() == BENITH && (
          <div class="card mb-4">
            <div class="card-header title_content">Nội dung chi tiết</div>
            <div class="card-body" style={{ padding: "0.8rem" }}>
              <div class="row">
                <ContentDetail
                  store_code={store_code}
                  product={product}
                  handleDataFromContent={this.handleDataFromContent}
                />
              </div>
            </div>
          </div>
        )}

        {getChannel() == BENITH && (
          <div class="card mb-4">
            <div class="card-header title_content">Tối ưu SEO</div>
            <div class="card-body" style={{ padding: "0.8rem" }}>
              <div class="row">
                <SeoOption
                  product={product}
                  handleDataFromContent={this.handleDataFromContent}
                />
              </div>
            </div>
          </div>
        )}
        {/* <div class="card mb-4">
          <div class="card-header title_content">Thông tin khuyến mại</div>
          <div class="card-body" style={{ padding: "0.8rem" }}>
            <div class="row">
              <InfoDiscount
                product={product}
                blogs = {this.props.blogs.data || []}
                handleDataFromDiscount={this.handleDataFromDiscount}
              />
            </div>
          </div>
        </div> */}
        <div class="card mb-4">
          <div class="card-body" style={{ padding: "0.8rem" }}>
            <div class="row">
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <button
                  class="btn btn-primary btn-sm"
                  onClick={this.postProduct}
                >
                  <i class="fa fa-plus"></i> Tạo
                </button>
                <a
                  className="color-white"
                  style={{ marginLeft: "10px" }}
                  onClick={this.goBack}
                  class={`btn btn-warning btn-sm color-white `}
                >
                  <i class="fa fa-arrow-left"></i> Trở về
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    attributeP: state.attributePReducers.attribute_product.allAttrbute,
    category_product: state.categoryPReducers.category_product.allCategoryP,
    product: state.productReducers.product.productId,
    alert: state.productReducers.alert.alert_uid,
    blogs: state.blogReducers.blog.allBlog,
    currentBranch: state.branchReducers.branch.currentBranch,
  };
};
const mapDispatchToProps = (dispatch, props) => {
  return {
    fetchAllAttributeP: (store_code) => {
      dispatch(productAction.fetchAllAttributeP(store_code));
    },
    fetchAllCategoryP: (store_code) => {
      dispatch(CategoryPAction.fetchAllCategoryP(store_code));
    },
    postProductV2: (store_code, branch_id, form) => {
      dispatch(productAction.postProductV2(store_code, branch_id, form));
    },
    postProduct: (store_code, product) => {
      dispatch(productAction.postProduct(store_code, product));
    },
    fetchProductId: (store_code, productId) => {
      dispatch(productAction.fetchProductId(store_code, productId));
    },
    updateProduct: (store_code, product, productId, page) => {
      dispatch(
        productAction.updateProduct(store_code, product, productId, page)
      );
    },
    updateDistribute: (store_code, product, productId, branchId) => {
      dispatch(
        productAction.updateDistribute(store_code, product, productId, branchId)
      );
    },
    fetchAllBlog: (id, page) => {
      dispatch(blogAction.fetchAllBlog(id, page));
    },
    showError: (error) => {
      dispatch(error);
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ProductEdit);
