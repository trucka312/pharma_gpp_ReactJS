import React, { Component } from "react";
import { connect, shallowEqual } from "react-redux";
import { Redirect } from "react-router-dom";
import InfoProduct from "../../../components/Product/Update/InfoProduct";
import ContentDetail from "../../../components/Product/Update/ContentDetail";
import InfoDiscount from "../../../components/Product/Update/InfoDiscount";
import Video from "../../../components/Product/Update/Video";
import {
  formatNumberV2,
  getQueryParams,
  isEmpty,
  removeVietnameseTones,
} from "../../../ultis/helpers";

import * as blogAction from "../../../actions/blog";

import Attribute from "../../../components/Product/Update/Attribute";
import Distribute from "../../../components/Product/Update/Distribute";
import StoreImage from "../../../components/Product/Update/StoreImage";
import * as productAction from "../../../actions/product";
import * as CategoryPAction from "../../../actions/category_product";
import * as AttributeAction from "../../../actions/attribute_search";
import * as Types from "../../../constants/ActionType";
import Alert from "../../../components/Partials/Alert";
import SeoOption from "../../../components/Product/Update/SeoOption";
import getChannel, { BENITH, IKIPOS } from "../../../ultis/channel";

class ProductEdit extends Component {
  constructor(props) {
    console.log("props:1234 ", props);
    super(props);
    this.state = {
      form: {},
      total: "",
      disableDistribute: false,
      disableInventory: false,
      attributeSearch: [],
      custom_view: "",
      custom_stock: "",
      custom_point: "",
      custom_sold: "",
      registry_number: "",
      manufacturing_country: "",
      manufacturer: "",
      package_form: "",
      concentration: "",
      substances: "",
      activeTab: 1,
      product_units: [],
      list_distribute: [
        {
          element_distributes: [
            {
              name: "",
              price: "",
              image_url: null,
              quantity_in_stock: 0,
              sub_element_distributes: [],
              is_edit: false,
              import_price: 0,
              cost_of_capital: 0,
              barcode: 0,
              stock: 0,
            },
          ],
          name: "test",
        },
      ],
      selectTabPan: 1,
      messageErrorDistribute: "",
    };
  }

  checkDistribute = (status, _status) => {
    this.setState({ disableDistribute: status, disableInventory: _status });
  };

  componentDidMount() {
    var { store_code, productId } = this.props;
    this.props.fetchProductId(store_code, productId);
    this.props.fetchAllAttributeP(store_code);
    this.props.fetchAllCategoryP(store_code);
    // this.props.fetchAllAttributeSearch(store_code);
    this.props.fetchAllBlog(store_code, 1);
  }

  handleAddTabPannel = () => {
    const newElement = {
      name: "",
      price: "",
      image_url: null,
      quantity_in_stock: 0,
      sub_element_distributes: [],
      is_edit: false,
      import_price: 0,
      cost_of_capital: 0,
      barcode: 0,
      stock: 0,
    };

    this.setState((prevState) => {
      const updatedList = [...prevState.list_distribute];

      updatedList[0].element_distributes.push(newElement);

      return {
        list_distribute: updatedList,
      };
    });
  };

  handleRemoveTab = (index) => {
    this.setState((prevState) => {
      const updatedList = [...prevState.list_distribute];

      updatedList[0].element_distributes =
        updatedList[0].element_distributes.filter((element, i) => i !== index);

      return {
        list_distribute: updatedList,
      };
    });
  };

  updateDistributeList = (event, index) => {
    const value = event.target.value;
    const name = event.target.name;

    let updatedDistributes = [];
    updatedDistributes = [...this.state.list_distribute];
    updatedDistributes[0].element_distributes[index][name] = value;
    this.setState(() => {
      return {
        list_distribute: updatedDistributes,
      };
    });
    if (name === "price") this.setState({ txtPrice: value });
    this.checkDuplicateUnits(updatedDistributes[0].element_distributes, index);
  };

  checkDuplicateUnits(elementDistributes, index) {
    let firstName = elementDistributes[0].name;
    if (elementDistributes.length <= 1) return true;

    if (elementDistributes[index].name === firstName) {
      this.props.showError({
        type: Types.ALERT_UID_STATUS,
        alert: {
          type: "danger",
          title: "Lỗi",
          disable: "show",
          content: `Không được trùng với đơn vị quy đổi cơ bản!`,
        },
      });
      this.setState({
        messageErrorDistribute: `Đơn vị quy đổi thứ ${index} không được trùng với đơn vị quy đổi cơ bản!`,
      });
      this.setState({ selectTabPan: 2 });
      return false;
    }

    for (let i = 1; i < elementDistributes.length; i++) {
      for (let j = i + 1; j < elementDistributes.length; j++) {
        if (elementDistributes[i].name === elementDistributes[j].name) {
          this.props.showError({
            type: Types.ALERT_UID_STATUS,
            alert: {
              type: "danger",
              title: "Lỗi",
              disable: "show",
              content: `Đơn vị quy đổi thứ ${i} và thứ ${j} không được trùng nhau!`,
            },
          });
          this.setState({
            messageErrorDistribute: `Đơn vị quy đổi thứ ${i} và thứ ${j} không được trùng nhau!`,
          });
          this.setState({ selectTabPan: 2 });
          return false;
        }
      }
    }
    this.setState({ messageErrorDistribute: "" });
    return true;
  }

  handleDataFromInfo = (data) => {
    this.setState((prevState, props) => {
      var formdata = { ...prevState.form };
      formdata.name = data.txtName;
      formdata.short_name = data.short_name;
      formdata.shelf_position = data.txtPosition;
      formdata.list_distribute = [...data.listDistribute];
      formdata.price = data.txtPrice
        .toString()
        .replace(/,/g, "")
        .replace(/\./g, "");
      formdata.money_amount_collaborator = data.money_amount_collaborator
        ?.toString()
        .replace(/,/g, "")
        .replace(/\./g, "");
      formdata.type_share_collaborator_number =
        data.type_share_collaborator_number;
      formdata.weight = data.txtWeight
        .toString()
        .replace(/,/g, "")
        .replace(/\./g, "");
      formdata.import_price = data.txtImportPrice
        .toString()
        .replace(/,/g, "")
        .replace(/\./g, "");
      formdata.barcode = data.txtBarcode;
      formdata.status = data.txtStatus;
      formdata.quantity_in_stock = data.txtQuantityInStock
        .toString()
        .replace(/,/g, "")
        .replace(/\./g, "");
      formdata.percent_collaborator = data.txtPercentC;
      formdata.sku = data.sku;
      formdata.check_inventory = data.check_inventory;
      formdata.point_for_agency = data.point_for_agency
        ?.toString()
        .replace(/,/g, "")
        .replace(/\./g, "");

        formdata.categories = data.txtCategory;
      // formdata.category_children_ids = category_children_ids;
      return {
        form: formdata,
        attributeSearch: data.attribute_search_children_ids,
        list_distribute: [...data.listDistribute],
      };
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
      return { form: formdata, list_distribute: [...data.listDistribute] };
    });
  };
  postProduct = () => {
    var { store_code, productId } = this.props;
    const {
      custom_view,
      custom_stock,
      custom_sold,
      custom_point,
      registry_number,
      manufacturing_country,
      manufacturer,
      package_form,
      concentration,
      substances,
      list_distribute,
    } = this.state;
    var form = {
      ...this.state.form,
      import_price: Number(this.state.form?.import_price),
      price: Number(this.state.form?.price),
      quantity_in_stock: Number(this.state.form?.quantity_in_stock),
    };
    form.index_image_avatar = 0;
    form.registry_number = registry_number
      ? registry_number?.toString().replace(/\./g, "")
      : "";
    form.manufacturing_country = manufacturing_country
      ? manufacturing_country?.toString().replace(/\./g, "")
      : "";
    form.manufacturer = manufacturer
      ? manufacturer?.toString().replace(/\./g, "")
      : "";
    form.package_form = package_form
      ? package_form?.toString().replace(/\./g, "")
      : "";
    form.concentration = concentration
      ? concentration?.toString().replace(/\./g, "")
      : "";
    form.substances = substances
      ? substances?.toString().replace(/\./g, "")
      : "";
    var total = this.state.total
      .toString()
      .replace(/,/g, "")
      .replace(/\./g, "");
    if (typeof form.list_distribute != "undefined") {
      form.quantity_in_stock =
        form.list_distribute.length > 0 ? total : form.quantity_in_stock;
    }
    if (form.name == null || !isEmpty(form.name)) {
      this.props.showError({
        type: Types.ALERT_UID_STATUS,
        alert: {
          type: "danger",
          title: "Lỗi",
          disable: "show",
          content: "Vui lòng nhập tên thuốc",
        },
      });
      return;
    }

    // if (form.barcode === form.sku && isEmpty(form.sku)) {
    //   this.props.showError({
    //     type: Types.ALERT_UID_STATUS,
    //     alert: {
    //       type: "danger",
    //       title: "Lỗi",
    //       disable: "show",
    //       content: "Barcode không thể trùng với mã SKU",
    //     },
    //   });
    //   return;
    // }
    if (!list_distribute[0]?.element_distributes[0]?.name) {
      this.props.showError({
        type: Types.ALERT_UID_STATUS,
        alert: {
          type: "danger",
          title: "Lỗi",
          disable: "show",
          content: "Vui lòng chọn đơn vị nhỏ nhất!",
        },
      });
      this.setState({ selectTabPan: 1 });
      return;
    }
    if (!list_distribute[0]?.element_distributes[0]?.price) {
      this.props.showError({
        type: Types.ALERT_UID_STATUS,
        alert: {
          type: "danger",
          title: "Lỗi",
          disable: "show",
          content: "Vui lòng giá bán đơn vị nhỏ nhất!",
        },
      });
      this.setState({ selectTabPan: 1 });
      return;
    }
    if (
      list_distribute[0]?.element_distributes &&
      list_distribute[0]?.element_distributes.length > 1
    ) {
      let index = 0;

      for (let element of list_distribute[0]?.element_distributes) {
        if (index !== 0) {
          if (!element.name) {
            this.props.showError({
              type: Types.ALERT_UID_STATUS,
              alert: {
                type: "danger",
                title: "Lỗi",
                disable: "show",
                content: `Vui lòng chọn đơn vị quy đổi cấp ${index}!`,
              },
            });
            this.setState({ selectTabPan: 2 });
            return;
          }
          if (!element.price) {
            this.props.showError({
              type: Types.ALERT_UID_STATUS,
              alert: {
                type: "danger",
                title: "Lỗi",
                disable: "show",
                content: `Vui lòng nhập giá bán đơn vị quy đổi cấp ${index}!`,
              },
            });
            this.setState({ selectTabPan: 2 });
            return;
          }
        }

        index++;
      }
    }

    if(this.state.messageErrorDistribute) {
      this.props.showError({
        type: Types.ALERT_UID_STATUS,
        alert: {
          type: "danger",
          title: "Lỗi",
          disable: "show",
          content: this.state.messageErrorDistribute,
        },
      });
      this.setState({ selectTabPan: 2 });
      return;
    }

    const pageNum = getQueryParams("page") || 1;
    const limit = getQueryParams("limit") || 20;
    const search = getQueryParams("search") || "";
    const params = `&limit=${limit}${search ? `&search=${search}` : ""}`;
    const branch_id = localStorage.getItem("branch_id");
    console.log('form: ', form);
    this.props.updateDistribute(
      store_code,
      null,
      productId,
      branch_id,
      form,
      pageNum,
      params,
      () => {
        this.props.setUpAttributeSearch(store_code, productId, {
          list_attribute_search_childs: this.state.attributeSearch,
        });
      }
    );
  };
  goBack = (e) => {
    e.preventDefault();
    var { history } = this.props;
    history.goBack();
  };

  checkHasAttribute = (element, arr) => {
    var check = false;
    for (const item of arr) {
      if (item == element) {
        check = true;
      }
    }
    return check;
  };

  afterAttribute = () => {
    var { attributeP, product } = this.props;
    if (product?.attributes?.length > 0) {
      var ListDistributeWithName = product?.attributes.map((data) => {
        return data.name;
      });
      console.log(ListDistributeWithName);
      var newListDistributeWithName = [...ListDistributeWithName];
      for (const item1 of attributeP) {
        if (this.checkHasAttribute(item1, ListDistributeWithName) == false) {
          newListDistributeWithName.push(item1);
        }
      }
      return newListDistributeWithName;
    } else {
      return attributeP;
    }
  };
  onChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;

    this.setState({
      // [name]: value !== "" ? formatNumberV2(value) : "",
      [name]: value,
    });
  };
  updateAttributeProduct = () => {
    const { custom_view, custom_sold, custom_stock, custom_point } = this.state;
    var { store_code, productId, updateAttributeProduct } = this.props;

    const dataAttribute = {
      custom_view: custom_view ? custom_view?.toString().replace(/\./g, "") : 0,
      custom_stock: custom_stock
        ? custom_stock?.toString().replace(/\./g, "")
        : 0,
      custom_point: custom_point
        ? custom_point?.toString().replace(/\./g, "")
        : 0,
      custom_sold: custom_sold ? custom_sold?.toString().replace(/\./g, "") : 0,
    };

    updateAttributeProduct(store_code, dataAttribute, productId);
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (!shallowEqual(nextProps.product, this.props.product)) {
      var { product } = { ...nextProps };

      this.setState({
        substances: product.substances
          ? formatNumberV2(product.substances)
          : "",
        concentration: product.concentration
          ? formatNumberV2(product.concentration)
          : "",
        package_form: product.package_form
          ? formatNumberV2(product.package_form)
          : "",
        manufacturer: product.manufacturer
          ? formatNumberV2(product.manufacturer)
          : "",
        manufacturing_country: product.manufacturing_country
          ? formatNumberV2(product.manufacturing_country)
          : "",
        registry_number: product.registry_number
          ? formatNumberV2(product.registry_number)
          : "",
      });
    }

    return true;
  }

  render() {
    var { store_code, productId } = this.props;
    var {
      category_product,
      attribute_search,
      attributeP,
      auth,
      product,
      isShowAttr,
      isCreate,
      isRemove,
      product_units,
    } = this.props;
    var {
      total,
      disableInventory,
      disableDistribute,
      substances,
      concentration,
      registry_number,
      manufacturing_country,
      manufacturer,
      package_form,
      list_distribute,
    } = this.state;
    var afterAttribute = this.afterAttribute();
    
    let productUnits = [];
    if (product_units.length > 0) {
      productUnits = product_units.map((item, index) => {
        return {
          id: item.id,
          label: item.name,
        };
      });
    }
    return (
      <div class="container-fluid">
        <Alert type={Types.ALERT_UID_STATUS} alert={this.props.alert} />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h4 className="h4 title_content mb-0 text-gray-800">
            Chỉnh sửa sản phẩm:&nbsp;{product.name}
          </h4>
        </div>
        <br></br>
        <div class="card mb-4">
          <nav className="card-header title_content">
            <div class="nav nav-tabs" id="nav-tab" role="tablist">
              <a
                class={`nav-item nav-link ${
                  this.state.selectTabPan === 1 && "active"
                }`}
                onClick={() => this.setState({ selectTabPan: 1 })}
                id="nav-info-product-tab"
                data-toggle="tab"
                href="#nav-info-product"
                role="tab"
                aria-controls="nav-info-product"
                aria-selected="false"
              >
                Thông tin cơ bản
              </a>
              <a
                class={`nav-item nav-link ${
                  this.state.selectTabPan === 2 && "active"
                }`}
                onClick={() => this.setState({ selectTabPan: 2 })}
                id="nav-attribute-product-tab"
                data-toggle="tab"
                href="#nav-attribute-product"
                role="tab"
                aria-controls="nav-attribute-product"
                aria-selected="true"
              >
                Đơn vị quy đổi và giá bán
              </a>
              <a
                class={`nav-item nav-link ${
                  this.state.selectTabPan === 3 && "active"
                }`}
                onClick={() => this.setState({ selectTabPan: 3 })}
                id="nav-warning-product-tab"
                data-toggle="tab"
                href="#nav-warning-product"
                role="tab"
                aria-controls="nav-warning-product"
                aria-selected="false"
              >
                Cảnh báo
              </a>
            </div>
          </nav>
          <div class="tab-content" id="nav-tabContent">
            <div
              class={`tab-pane fade ${
                this.state.selectTabPan === 1 && "show active"
              }`}
              id="nav-info-product"
              role="tabpanel"
              aria-labelledby="nav-info-product-tab"
            >
              <div class="card-body" style={{ padding: "0.8rem" }}>
                <div class="row">
                  <div class="col-lg-8">
                    <div>
                      <InfoProduct
                        badges={this.props.badges}
                        store_code={store_code}
                        checkDistribute={this.checkDistribute}
                        total={total}
                        handleDataFromInfo={this.handleDataFromInfo}
                        category_product={category_product}
                        attribute_search={attribute_search}
                        product_units={product_units}
                        product={product}
                      />
                    </div>
                  </div>

                  <div
                    class="col-lg-4"
                    style={{ borderLeft: "0.5px solid #e6dfdf" }}
                  >
                    <div>
                      <StoreImage
                        store_code={store_code}
                        handleDataFromAvatarImg={this.handleDataFromAvatarImg}
                        handleDataFromProductImg={this.handleDataFromProductImg}
                      />
                    </div>
                  </div>
                </div>
                <div className="row fw-bold" style={{ paddingLeft: "15px" }}>
                  <p style={{ marginLeft: "15px", fontWeight: "600" }}>
                    Thông tin chi tiết
                  </p>
                  <div className="row col-12">
                    <div className="col-4">
                      <label for="registry_number">Số đăng ký</label>
                      <input
                        type="text"
                        class="form-control input-sm"
                        id="registry_number"
                        placeholder="Nhập số đăng ký"
                        autoComplete="off"
                        value={registry_number}
                        onChange={this.onChange}
                        name="registry_number"
                      />
                    </div>
                    <div className="col-4">
                      <label for="manufacturing_country">Nước đăng ký</label>
                      <input
                        type="text"
                        class="form-control input-sm"
                        id="manufacturing_country"
                        placeholder="Nhập nước đăng ký"
                        autoComplete="off"
                        value={manufacturing_country}
                        onChange={this.onChange}
                        name="manufacturing_country"
                      />
                    </div>
                    <div className="col-4">
                      <label for="manufacturer">Hãng sản xuất</label>
                      <input
                        type="text"
                        class="form-control input-sm"
                        id="manufacturer"
                        placeholder="Nhập hãng sản xuất"
                        autoComplete="off"
                        value={manufacturer}
                        onChange={this.onChange}
                        name="manufacturer"
                      />
                    </div>
                  </div>
                  <div className="row col-12" style={{ marginTop: "16px" }}>
                    <div className="col-4">
                      <label for="package_form">Quy cách đóng gói</label>
                      <input
                        type="text"
                        class="form-control input-sm"
                        id="package_form"
                        placeholder="Nhập quy cách đóng gói"
                        autoComplete="off"
                        value={package_form}
                        onChange={this.onChange}
                        name="package_form"
                      />
                    </div>
                    <div className="col-4">
                      <label for="concentration">Hàm lượng</label>
                      <input
                        type="text"
                        class="form-control input-sm"
                        id="concentration"
                        placeholder="Nhập hàm lượng"
                        autoComplete="off"
                        value={concentration}
                        onChange={this.onChange}
                        name="concentration"
                      />
                    </div>
                    <div className="col-4">
                      <label for="substances">Hoạt chất</label>
                      <input
                        type="text"
                        class="form-control input-sm"
                        id="substances"
                        placeholder="Nhập hoạt chất"
                        autoComplete="off"
                        value={substances}
                        onChange={this.onChange}
                        name="substances"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class={`tab-pane fade ${
                this.state.selectTabPan === 2 && "show active"
              }`}
              id="nav-attribute-product"
              role="tabpanel"
              aria-labelledby="nav-attribute-product-tab"
            >
              <div class="card-body" style={{ padding: "0.8rem" }}>
                <p
                  style={{
                    fontWeight: "600",
                    color: "#015AA4",
                    fontSize: "20px",
                  }}
                >
                  ĐƠN VỊ CƠ BẢN (NHỎ NHẤT)
                </p>
                <div className="row">
                  <div class="form-group col-6">
                    <label for="product_name">
                      Đơn vị nhỏ nhất<span style={{ color: "red" }}> *</span>
                    </label>
                    <select
                      id="input"
                      class="form-control"
                      value={list_distribute[0].element_distributes[0].name}
                      onChange={(event) => this.updateDistributeList(event, 0)}
                      name="name"
                    >
                      <option value="">Chọn đơn vị nhỏ nhất</option>
                      {productUnits && productUnits.length
                        ? productUnits.map((item, index) => {
                            return (
                              <option value={item.label}>{item.label}</option>
                            );
                          })
                        : null}
                    </select>
                  </div>
                  <div class="form-group col-6">
                    <label for="product_name">
                      Giá bán đơn vị nhỏ nhất
                      <span style={{ color: "red" }}> *</span>
                    </label>
                    <input
                      type="text"
                      class="form-control input-sm"
                      id="txtPrice"
                      placeholder="Nhập giá bán đơn vị nhỏ nhất"
                      autoComplete="off"
                      value={
                        list_distribute[0]?.element_distributes[0]?.price || ""
                      }
                      onChange={(event) => this.updateDistributeList(event, 0)}
                      name="price"
                    />
                  </div>
                </div>
                <div className="row">
                  <div class="form-group col-6">
                    <label for="product_name">Tồn kho</label>

                    <input
                      type="text"
                      class="form-control input-sm"
                      id="txtName"
                      placeholder="Nhập số lượng tồn kho"
                      autoComplete="off"
                      // value={this.state.form.name}
                      onChange={this.onChange}
                      name="txtName"
                      disabled
                    />
                  </div>
                  <div class="form-group col-6">
                    <label for="product_name">Giá nhập</label>
                    <input
                      type="text"
                      class="form-control input-sm"
                      id="txtName"
                      placeholder="Nhập giá nhập"
                      autoComplete="off"
                      // value={this.state.form.name}
                      onChange={this.onChange}
                      name="txtName"
                      disabled
                    />
                  </div>
                </div>

                <p
                  style={{
                    fontWeight: "600",
                    color: "#015AA4",
                    fontSize: "20px",
                    marginTop: "20px",
                  }}
                >
                  ĐƠN VỊ QUY ĐỔI
                </p>
                <div class="row" style={{ cursor: "pointer" }}>
                  <div class="col-3">
                    <div
                      class="nav flex-column nav-pills"
                      id="v-pills-tab"
                      role="tablist"
                      aria-orientation="vertical"
                    >
                      {list_distribute[0].element_distributes &&
                        list_distribute[0].element_distributes.length > 0 &&
                        list_distribute[0].element_distributes.map(
                          (item, index) => {
                            if (index === 0) return null;
                            return (
                              <div
                                key={index}
                                className={`nav-link position-relative ${
                                  this.state.activeTab === index ? "active" : ""
                                }`}
                                onClick={() =>
                                  this.setState({
                                    activeTab: index,
                                  })
                                }
                                id={`v-pills-home-tab-${index}`}
                                data-toggle="pill"
                                href={`#v-pills-home-${index}}`}
                                role="tab"
                                aria-controls={`v-pills-${index}`}
                                aria-selected="true"
                              >
                                Đơn vị quy đổi cấp {index}
                                <p
                                  className="position-absolute"
                                  style={{
                                    color:
                                      this.state.activeTab === index
                                        ? "white"
                                        : "red",
                                    right: "10px",
                                    top: "35%",
                                  }}
                                  onClick={() => this.handleRemoveTab(index)}
                                >
                                  <i class="fa fa-trash"></i>
                                </p>
                              </div>
                            );
                          }
                        )}
                    </div>
                  </div>
                  <div class="col-9">
                    <div class="tab-content" id="v-pills-tabContent">
                      {list_distribute[0].element_distributes &&
                        list_distribute[0].element_distributes.length > 0 &&
                        list_distribute[0].element_distributes.map(
                          (item, index) => {
                            if (index === 0) return null;
                            return (
                              <div
                                className={`tab-pane fade ${
                                  this.state.activeTab === index
                                    ? "show active"
                                    : ""
                                }`}
                                id={`v-pills-${index}`}
                                role="tabpanel"
                                aria-labelledby={`v-pills-home-tab-${index}`}
                              >
                                <div className="row">
                                  <div class="form-group col-6">
                                    <label for="product_name">
                                      Đơn vị quy đổi
                                      <span style={{ color: "red" }}> *</span>
                                    </label>

                                    <select
                                      id="input"
                                      class="form-control"
                                      value={list_distribute[0].element_distributes[index].name}
                                      onChange={(event) =>
                                        this.updateDistributeList(event, index)
                                      }
                                      name="name"
                                    >
                                      <option value="">
                                        Chọn đơn vị nhỏ nhất
                                      </option>
                                      {productUnits && productUnits.length
                                        ? productUnits.map((item, index) => {
                                            return (
                                              <option value={item.label}>
                                                {item.label}
                                              </option>
                                            );
                                          })
                                        : null}
                                    </select>
                                  </div>
                                  <div class="form-group col-6">
                                    <label for="product_name">
                                      Giá bán quy đổi
                                      <span style={{ color: "red" }}> *</span>
                                    </label>
                                    <input
                                      type="text"
                                      class="form-control input-sm"
                                      id="txtName"
                                      placeholder="Nhập giá bán đơn vị nhỏ nhất"
                                      autoComplete="off"
                                      value={list_distribute[0].element_distributes[index].price}
                                      onChange={(event) =>
                                        this.updateDistributeList(event, index)
                                      }
                                      name="price"
                                    />
                                  </div>
                                </div>
                                <div className="row">
                                  <div class="form-group col-6">
                                    <label for="product_name">
                                      Hệ số quy đổi
                                      <span style={{ color: "red" }}> *</span>
                                    </label>

                                    <input
                                      type="text"
                                      class="form-control input-sm"
                                      id="exchange"
                                      placeholder="Nhập số lượng tồn kho"
                                      autoComplete="off"
                                      value={list_distribute[0].element_distributes[index].exchange}
                                      onChange={(event) =>
                                        this.updateDistributeList(event, index)
                                      }
                                      name="exchange"
                                    />
                                  </div>
                                  <div class="form-group col-6">
                                    <label for="product_name">Giá nhập</label>
                                    <input
                                      type="text"
                                      class="form-control input-sm"
                                      id="txtName"
                                      placeholder="Nhập giá nhập"
                                      autoComplete="off"
                                      onChange={this.onChange}
                                      name="txtName"
                                      disabled
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        )}
                    </div>
                  </div>
                </div>
                <i
                  class="fas fa-plus-circle"
                  style={{
                    color: "#015AA4",
                    cursor: "pointer",
                    marginTop: "10px",
                  }}
                  onClick={() => this.handleAddTabPannel()}
                >
                  {" "}
                  Thêm
                </i>
              </div>
            </div>
            <div
              class={`tab-pane fade ${
                this.state.selectTabPan === 3 && "show active"
              }`}
              id="nav-warning-product"
              role="tabpanel"
              aria-labelledby="nav-warning-product-tab"
            >
              Cảnh báo
            </div>
          </div>
        </div>
        {getChannel() == BENITH && (
          <div class="card mb-4">
            <div
              class="card-body"
              style={{ padding: "0.8rem", paddingBottom: "0" }}
            >
              <div class="row">
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <button
                    class="btn btn-primary btn-sm"
                    onClick={this.postProduct}
                  >
                    <i class="fa fa-plus"></i> Lưu thay đổi
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
              <p
                style={{
                  fontStyle: "italic",
                  marginTop: "16px",
                  marginBottom: "0",
                }}
              >
                Lưu ý: Bắt buộc điền vào những mục có dấu (
                <span style={{ color: "red" }}>*</span>)
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    attributeP: state.attributePReducers.attribute_product.allAttrbute,
    category_product: state.categoryPReducers.category_product.allCategoryP,
    attribute_search:
      state.attributeSearchReducers.attribute_search.allAttribute,
    product: state.productReducers.product.productId,
    alert: state.productReducers.alert.alert_uid,
    blogs: state.blogReducers.blog.allBlog,
    product_units: state.categoryPReducers.category_product.allProductUnits,
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
    fetchAllAttributeSearch: (store_code, params) => {
      dispatch(AttributeAction.fetchAllAttributeSearch(store_code, params));
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
    updateDistribute: (
      store_code,
      product,
      productId,
      branchId,
      data,
      page,
      params,
      funcModal
    ) => {
      dispatch(
        productAction.updateDistribute(
          store_code,
          product,
          productId,
          branchId,
          data,
          page,
          params,
          funcModal
        )
      );
    },
    fetchAllBlog: (id, page) => {
      dispatch(blogAction.fetchAllBlog(id, page));
    },
    setUpAttributeSearch: (store_code, id, form) => {
      dispatch(AttributeAction.setUpAttributeSearch(store_code, id, form));
    },
    updateAttributeProduct: (store_code, form, id) => {
      dispatch(productAction.updateAttributeProduct(store_code, form, id));
    },
    showError: (error) => {
      dispatch(error);
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ProductEdit);
