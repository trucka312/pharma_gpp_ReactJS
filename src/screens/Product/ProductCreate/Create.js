import React, { Component } from "react";

import { connect } from "react-redux";

import InfoProduct from "../../../components/Product/Create/InfoProduct";
import ContentDetail from "../../../components/Product/Create/ContentDetail";
import Attribute from "../../../components/Product/Create/Attribute";
import Distribute from "../../../components/Product/Create/Distribute";
import StoreImage from "../../../components/Product/Create/StoreImage";
import Video from "../../../components/Product/Create/Video";

import * as productAction from "../../../actions/product";
import * as CategoryPAction from "../../../actions/category_product";
import * as AttributeAction from "../../../actions/attribute_search";
import * as Types from "../../../constants/ActionType";
import * as blogAction from "../../../actions/blog";

import Alert from "../../../components/Partials/Alert";
import SeoOption from "../../../components/Product/Create/SeoOption";
import getChannel, { BENITH, IKIPOS } from "../../../ultis/channel";
import {
  formatNumberV2,
  isEmpty,
  removeVietnameseTones,
} from "../../../ultis/helpers";

const initTabPannel = [
  {
    id: 1,
  },
  {
    id: 2,
  },
  {
    id: 3,
  },
  {
    id: 4,
  },
];
class ProductCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {},
      total: "",
      isError: false,
      disableDistribute: false,
      disableInventory: false,
      attributeSearch: [],
      custom_view: "",
      custom_sold: "",
      custom_stock: "",
      custom_point: "",
      registry_number: "",
      manufacturing_country: "",
      manufacturer: "",
      package_form: "",
      concentration: "",
      substances: "",
      activeTab: 1,
      tabPannel: initTabPannel,
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

  componentDidMount() {
    this.props.fetchAllAttributeP(this.props.store_code);
    this.props.fetchAllCategoryP(this.props.store_code);
    this.props.fetchAllAttributeSearch(this.props.store_code);
    this.props.fetchAllBlog(this.props.store_code, 1);
  }

  handleDataFromInfo = (data) => {
    this.setState((prevState, props) => {
      var formdata = { ...prevState.form };
      formdata.name = data.txtName;
      formdata.short_name = data.short_name;
      formdata.shelf_position = data.txtPosition;
      formdata.price = data.txtPrice
        .toString()
        .replace(/,/g, "")
        .replace(/\./g, "");
      formdata.list_distribute = [...data.listDistribute];
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
      formdata.barcode = removeVietnameseTones(data.txtBarcode);
      formdata.status = data.txtStatus;
      formdata.quantity_in_stock = data.txtQuantityInStock
        .toString()
        .replace(/,/g, "")
        .replace(/\./g, "");
      formdata.percent_collaborator = data.txtPercentC;
      formdata.sku = data.sku;
      formdata.point_for_agency = data.point_for_agency
        ?.toString()
        .replace(/,/g, "")
        .replace(/\./g, "");

      formdata.check_inventory = data.check_inventory;
      formdata.main_cost_of_capital = data.txtCostOfCapital
        .toString()
        .replace(/,/g, "")
        .replace(/\./g, "");
      formdata.main_stock = data.txtQuantityInStock
        .toString()
        .replace(/,/g, "")
        .replace(/\./g, "");
      formdata.import_price = data.txtImportPrice
        .toString()
        .replace(/,/g, "")
        .replace(/\./g, "");
      var attribute_search_children_ids = [];
      if (data?.attribute_search_children_ids?.length > 0) {
        attribute_search_children_ids = data.attribute_search_children_ids.map(
          (attributeSearchParent, index) => {
            return attributeSearchParent.id;
          }
        );
      }

      formdata.categories = data.txtCategory;
      // formdata.category_children_ids = category_children_ids;
      return {
        form: formdata,
        attributeSearch: attribute_search_children_ids,
        list_distribute: [...data.listDistribute],
      };
    });
  };

  checkDistribute = (status, _status) => {
    this.setState({ disableDistribute: status, disableInventory: _status });
  };

  postProduct = () => {
    var { store_code } = this.props;
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
    const branch_id = localStorage.getItem("branch_id");
    var form = { ...this.state.form };
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
    // this.props.postProduct(store_code, form)
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
      this.setState({ selectTabPan: 1 });
      return;
    }

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
    var is_error = false;
    if (this.state.isError || is_error) {
      return;
    }
    if (this.state.checkDistribute == false) {
      delete form.list_distribute;
    }

    if (form.weight == "") {
      form.weight = 100;
    }
    console.log("form: ", form);
    this.props.postProductV2(store_code, branch_id, form, (id) => {
      this.props.setUpAttributeSearch(store_code, id, {
        list_attribute_search_childs: this.state.attributeSearch,
      });
    });
  };

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
  handleDataFromProductImg = (imgs) => {
    this.setState((prevState, props) => {
      var formdata = { ...prevState.form };
      formdata.images = imgs;
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

  onChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;

    this.setState({
      // [name]: value !== "" ? formatNumberV2(value) : "",
      [name]: value,
    });
  };

  goBack = (e) => {
    e.preventDefault();
    var { history } = this.props;
    history.goBack();
  };

  updateDistribute = (event, index) => {
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
  render() {
    var { store_code } = this.props;
    var {
      category_product,
      attribute_search,
      product_units,
    } = this.props;
    var {
      total,
      registry_number,
      manufacturing_country,
      manufacturer,
      package_form,
      concentration,
      substances,
      list_distribute,
    } = this.state;

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
          <h4 className="h4 title_content mb-0 text-gray-800">Thêm sản phẩm</h4>
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
                        // type="text"
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
                {/* <div class="form-group">
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
                  <label for="custom_sold">Số lượng đã mua</label>
                  <input
                    type="text"
                    class="form-control input-sm"
                    id="custom_sold"
                    placeholder="Nhập số lượng đã mua"
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
                </div> */}
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
                      onChange={(event) => this.updateDistribute(event, 0)}
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
                      onChange={this.onChange}
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
                                      onChange={(event) =>
                                        this.updateDistribute(event, index)
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
                                      Hệ số quy đổi
                                      <span style={{ color: "red" }}> *</span>
                                    </label>

                                    <input
                                      type="text"
                                      class="form-control input-sm"
                                      id="exchange"
                                      placeholder="Nhập số lượng tồn kho"
                                      autoComplete="off"
                                      onChange={(event) =>
                                        this.updateDistribute(event, index)
                                      }
                                      name="exchange"
                                    />
                                  </div>
                                </div>
                                <div className="row">
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
                                      value={item.price}
                                      onChange={(event) =>
                                        this.updateDistribute(event, index)
                                      }
                                      name="price"
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
                                      value={item.id}
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
    auth: state.authReducers.login.authentication,
    attributeP: state.attributePReducers.attribute_product.allAttrbute,
    category_product: state.categoryPReducers.category_product.allCategoryP,
    attribute_search:
      state.attributeSearchReducers.attribute_search.allAttribute,
    alert: state.productReducers.alert.alert_uid,
    badges: state.badgeReducers.allBadge,
    product_units: state.categoryPReducers.category_product.allProductUnits,
    blogs: state.blogReducers.blog.allBlog,

    // state : state
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
    setUpAttributeSearch: (store_code, id, form) => {
      dispatch(AttributeAction.setUpAttributeSearch(store_code, id, form));
    },
    postProduct: (store_code, product) => {
      dispatch(productAction.postProduct(store_code, product));
    },
    postProductV2: (store_code, branch_id, form, funcModal) => {
      dispatch(
        productAction.postProductV2(store_code, branch_id, form, funcModal)
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
export default connect(mapStateToProps, mapDispatchToProps)(ProductCreate);
