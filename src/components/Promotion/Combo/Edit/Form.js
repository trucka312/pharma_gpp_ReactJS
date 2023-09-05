import React, { Component } from "react";
import * as Types from "../../../../constants/ActionType";
import { connect } from "react-redux";
import * as comboAction from "../../../../actions/combo";
import Table from "./Table";
import { shallowEqual } from "../../../../ultis/shallowEqual";
import moment from "moment";
import Datetime from "react-datetime";
import ModalListProduct from "../Create/ListProduct";
import CKEditor from "ckeditor4-react";
import ModalUpload from "../ModalUpload";
import * as Env from "../../../../ultis/default";
import MomentInput from "react-moment-input";
import { formatNumber } from "../../../../ultis/helpers";
import { isEmpty } from "../../../../ultis/helpers";
import ConfimUpdateUsed from "../../Discount/Edit/ConfimUpdateUsed";
import getChannel, { IKIPOS, BENITH } from "../../../../ultis/channel";
import history from "../../../../history";
import { getQueryParams } from "../../../../ultis/helpers";
import * as AgencyAction from "../../../../actions/agency";
import * as groupCustomerAction from "../../../../actions/group_customer";
class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtName: "",
      txtStart: "",
      txtEnd: "",
      txtAmount: "",
      txtContent: "",
      txtDiscoutType: 0,
      txtValueDiscount: "",
      listProducts: [],
      image: "",
      saveListProducts: [],
      group_customer: 0,
      agency_type_id: null,
      group_type_id: null,
      displayError: "hide",
      isLoading: false,
      loadCript: false,
      defaultListProducts: [],
    };
  }
  componentDidMount() {
    this.props.initialUpload();
    this.props.fetchAllAgencyType(this.props.store_code);
    this.props.fetchGroupCustomer(this.props.store_code);
  }

  componentDidUpdate(prevProps, prevState) {
    try {
      document.getElementsByClassName("r-input")[0].placeholder =
        "Chọn ngày và thời gian";
      document.getElementsByClassName("r-input")[1].placeholder =
        "Chọn ngày và thời gian";
    } catch (error) {}
  }
  componentWillReceiveProps(nextProps) {
    if (!shallowEqual(nextProps.combo, this.props.combo)) {
      var { combo } = nextProps;

      var startTime =
        combo.start_time == null || combo.start_time == ""
          ? ""
          : moment(combo.start_time).format("DD-MM-YYYY HH:mm");
      var endTime =
        combo.end_time == null || combo.end_time == ""
          ? ""
          : moment(combo.end_time).format("DD-MM-YYYY HH:mm");
      this.setState({
        txtContent: combo.description,
        txtName: combo.name,
        txtStart: startTime,
        txtEnd: endTime,
        txtAmount:
          combo.amount == null
            ? null
            : new Intl.NumberFormat().format(combo.amount.toString()),
        txtLastAmount:
          combo.amount == null
            ? null
            : new Intl.NumberFormat().format(combo.amount.toString()),

        txtValueDiscount:
          combo.value_discount == null
            ? null
            : new Intl.NumberFormat().format(combo.value_discount.toString()),
        saveListProducts: combo.products,
        group_customer: combo.group_customer,
        agency_type_id: combo.agency_type_id,
        group_type_id: combo.group_type_id,
        txtDiscoutType: combo.discount_type,
        listProducts: combo.products_combo,
        saveListProducts: combo.products_combo,

        image: combo.image_url,
        isLoading: true,
        loadCript: true,
        form: {},
      });
    }
    if (this.props.image !== nextProps.image) {
      this.setState({ image: nextProps.image });
    }
  }

  onChangeDecription = (evt) => {
    const data = evt.editor.getData();
    this.setState({ txtContent: data });
  };
  setListProducts = (listProducts) => {
    this.setState({ listProducts });
  };
  setDefaultListProducts = () => {
    this.setState({ defaultListProducts: this.state.listProducts });
  };
  onChange = (e) => {
    var target = e.target;
    var name = target.name;
    var value = target.value;

    const _value = formatNumber(value);
    if (name == "txtAmount" || name == "txtValueDiscount") {
      if (!isNaN(Number(_value))) {
        value = new Intl.NumberFormat().format(_value);
        if (name == "txtValueDiscount" && this.state.txtDiscoutType == "1") {
          if (value.length < 3) {
            if (value == 0) {
              this.setState({ [name]: "" });
            } else {
              this.setState({ [name]: value });
            }
          }
        } else {
          if (value == 0) {
            this.setState({ [name]: "" });
          } else {
            this.setState({ [name]: value });
          }
        }
      }
    } else {
      this.setState({ [name]: value });
    }
  };
  onChangeType = (e) => {
    var target = e.target;
    var name = target.name;
    var value = target.value;
    this.setState({ [name]: value, txtValueDiscount: "" });
  };
  onChangeStart = (e) => {
    var time = moment(e, "DD-MM-YYYY HH:mm").format("DD-MM-YYYY HH:mm");
    var { txtEnd } = this.state;
    if (e != "" && txtEnd != "") {
      if (
        !moment(e, "DD-MM-YYYY HH:mm").isBefore(
          moment(txtEnd, "DD-MM-YYYY HH:mm")
        )
      ) {
        this.setState({ displayError: "show" });
      } else {
        console.log("hidddeee");
        this.setState({ displayError: "hide" });
      }
    }
    this.setState({
      txtStart: time,
    });
  };

  onChangeEnd = (e) => {
    var time = moment(e, "DD-MM-YYYY HH:mm").format("DD-MM-YYYY HH:mm");
    var { txtStart } = this.state;

    if (txtStart != "" && e != "") {
      if (
        !moment(txtStart, "DD-MM-YYYY HH:mm").isBefore(
          moment(e, "DD-MM-YYYY HH:mm")
        )
      ) {
        this.setState({ displayError: "show" });
      } else {
        this.setState({ displayError: "hide" });
      }
    }
    this.setState({
      txtEnd: time,
    });
  };

  onSave = (e) => {
    e.preventDefault();
    if (this.state.displayError == "show") {
      return;
    }
    var state = this.state;
    if (state.txtValueDiscount == null || !isEmpty(state.txtValueDiscount)) {
      this.props.showError({
        type: Types.ALERT_UID_STATUS,
        alert: {
          type: "danger",
          title: "Lỗi",
          disable: "show",
          content: "Vui lòng chọn giá trị giảm giá",
        },
      });
      return;
    }
    var { store_code, comboId } = this.props;

    var listProducts = state.saveListProducts;
    var combo_products = [];
    listProducts.forEach((element, index) => {
      combo_products.push({
        quantity: element.quantity,
        product_id: element.product.id,
      });
    });
    var startTime = moment(state.txtStart, "DD-MM-YYYY HH:mm").format(
      "YYYY-MM-DD HH:mm:ss"
    );
    var endTime = moment(state.txtEnd, "DD-MM-YYYY HH:mm").format(
      "YYYY-MM-DD HH:mm:ss"
    );

    var { group_customer, agency_type_id, group_type_id } = this.state;
    var agency_type_name =
      this.props.types.filter((v) => v.id === parseInt(agency_type_id))?.[0]
        ?.name || null;
    var form = {
      group_customer,
      agency_type_id,
      agency_type_name,
      group_type_id,
      amount:
        state.txtAmount == null
          ? state.txtAmount
          : formatNumber(state.txtAmount),
      value_discount:
        state.txtValueDiscount == null
          ? state.txtValueDiscount
          : formatNumber(state.txtValueDiscount),
      name: state.txtName,
      start_time: startTime == "Invalid date" ? null : startTime,
      end_time: endTime == "Invalid date" ? null : endTime,
      combo_products: combo_products,
      description: state.txtContent,
      image_url: state.image,
      discount_type: state.txtDiscoutType,
      set_limit_amount: true,
    };
    var amount = form.amount;
    if (typeof amount == "undefined" || amount == null || !isEmpty(amount))
      form.set_limit_amount = false;

    if (
      this.state.txtLastAmount != this.state.txtAmount &&
      this.state.txtLastAmount != 0 &&
      this.state.txtAmount != 0
    ) {
      this.setState({
        form: form,
      });
      window.$("#confimUpdateUsedModal").modal("show");
    } else {
      this.props.updateCombo(store_code, form, comboId);
    }
  };

  goBack = (e) => {
    var { store_code } = this.props;

    e.preventDefault();
    var type = getQueryParams("type");
    var page = getQueryParams("page");
    var search = getQueryParams("search");
    if (type) {
      if (Number(type) === 1) {
        history.replace(
          `/combo/${store_code}?type=${type}${page ? `&page=${page}` : ""}`
        );
      } else {
        history.replace(
          `/combo/${store_code}?type=${type}${
            search ? `&search=${search}` : ""
          }`
        );
      }
    } else {
      history.goBack();
    }
  };
  handleAddProduct = (product, id, type, onSave) => {
    var products = [...this.state.listProducts];
    console.log(products);

    if (type == "remove") {
      if (products.length > 0) {
        products.forEach((item, index) => {
          if (item.product.id === id) {
            products.splice(index, 1);
          }
        });
      }
    } else {
      var checkExsit = true;
      products.forEach((item, index) => {
        if (item.product.id === product.id) {
          checkExsit = false;
          return;
        }
      });
      if (checkExsit == true) {
        var product = { quantity: 1, product: product };
        products.push(product);
      }
    }
    if (onSave == true)
      this.setState({ listProducts: products, saveListProducts: products });
    else this.setState({ listProducts: products });
  };
  onSaveProduct = () => {
    this.setState({ saveListProducts: [...this.state.listProducts] });
  };
  handleChangeQuantity = (id, quantity, setIncrement = null) => {
    var products = [...this.state.listProducts];
    products.forEach((product, index) => {
      if (product.product.id == id) {
        if (setIncrement == 1) products[index].quantity = product.quantity + 1;
        else if (setIncrement == -1) {
          if (product.quantity == 1) {
          } else products[index].quantity = product.quantity - 1;
        } else products[index].quantity = quantity;
      }
    });
    this.setState({ listProducts: products, saveListProducts: products });
  };

  onOkUpdate = () => {
    var { store_code, comboId } = this.props;
    this.props.updateCombo(store_code, this.state.form, comboId);
  };

  render() {
    var {
      txtName,
      txtStart,
      txtEnd,
      txtAmount,
      listProducts,
      txtContent,
      txtDiscoutType,
      txtValueDiscount,
      image,
      saveListProducts,
      group_customer,
      agency_type_id,
      group_type_id,
      displayError,
      isLoading,
    } = this.state;

    var image = image == "" || image == null ? Env.IMG_NOT_FOUND : image;
    var { products, store_code, combos, combo, types, groupCustomer } =
      this.props;
    var type_discount_default = txtDiscoutType == 0 ? "show" : "hide";
    var type_discount_percent = txtDiscoutType == 1 ? "show" : "hide";
    var now = moment().valueOf();
    var end_time = moment(combo.end_time, "YYYY-MM-DD HH:mm:ss").valueOf();
    var canOnsave = now < end_time;

    return (
      <React.Fragment>
        <form
          role="form"
          onSubmit={(e) => canOnsave == true && this.onSave(e)}
          method="post"
        >
          <div class="row">
            <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
              <div class="box-body">
                {/* {
                  getChannel() == BENITH && (
                    <React.Fragment>
                      <div class="form-group">
                        <label>Ảnh: &nbsp; </label>
                        <img src={`${image}`} width="150" height="150" />
                      </div>
                      <div class="form-group">

                        <div class="kv-avatar">
                          <div >
                            <button
                              type="button"
                              class="btn btn-primary btn-sm"
                              data-toggle="modal"
                              data-target="#uploadModalCombo"
                            >
                              <i class="fa fa-plus"></i> Upload ảnh
                            </button>
                          </div>
                        </div>

                      </div>

                    </React.Fragment>
                  )} */}

                <div class="form-group">
                  <label for="product_name">Tên chương trình</label>
                  <input
                    type="text"
                    class="form-control"
                    id="txtName"
                    value={txtName}
                    name="txtName"
                    placeholder="Nhập tên chương trình"
                    autoComplete="off"
                    onChange={this.onChange}
                  />
                </div>

                <div class="form-group">
                  <label for="product_name">Thời gian bắt đầu</label>
                  {isLoading == true ? (
                    <MomentInput
                      defaultValue={
                        txtStart == "" || txtStart == null
                          ? ""
                          : moment(txtStart, "DD-MM-YYYY HH:mm")
                      }
                      min={moment()}
                      format="DD-MM-YYYY HH:mm"
                      options={true}
                      enableInputClick={true}
                      monthSelect={true}
                      readOnly={true}
                      translations={{
                        DATE: "Ngày",
                        TIME: "Giờ",
                        SAVE: "Đóng",
                        HOURS: "Giờ",
                        MINUTES: "Phút",
                      }}
                      onSave={() => {}}
                      onChange={this.onChangeStart}
                    />
                  ) : null}
                </div>

                <div class="form-group">
                  <label for="product_name">Thời gian kết thúc</label>
                  {isLoading == true ? (
                    <MomentInput
                      defaultValue={
                        txtEnd == "" || txtEnd == null
                          ? ""
                          : moment(txtEnd, "DD-MM-YYYY HH:mm")
                      }
                      min={moment()}
                      format="DD-MM-YYYY HH:mm"
                      options={true}
                      enableInputClick={true}
                      monthSelect={true}
                      readOnly={true}
                      translations={{
                        DATE: "Ngày",
                        TIME: "Giờ",
                        SAVE: "Đóng",
                        HOURS: "Giờ",
                        MINUTES: "Phút",
                      }}
                      onSave={() => {}}
                      onChange={this.onChangeEnd}
                    />
                  ) : null}
                </div>
                <div class={`alert alert-danger ${displayError}`} role="alert">
                  Thời gian kết thúc phải sau thời gian bắt đầu
                </div>
              </div>
            </div>
            <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
              <div class="box-body">
                <div className="form-group discount-for">
                  <label htmlFor="group_customer">Áp dụng cho</label>
                  <div
                    style={{
                      display: "flex",
                    }}
                    className="radio discount-for"
                    onChange={this.onChange}
                  >
                    <label>
                      <input
                        type="radio"
                        name="group_customer"
                        checked={group_customer == 0 ? true : false}
                        className="group_customer"
                        id="ship"
                        value="0"
                      />
                      {"  "} Tất cả
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="group_customer"
                        checked={group_customer == 2 ? true : false}
                        className="group_customer"
                        id="bill"
                        value="2"
                      />
                      {"  "}Đại lý
                    </label>

                    <label>
                      <input
                        type="radio"
                        name="group_customer"
                        checked={group_customer == 1 ? true : false}
                        className="group_customer"
                        id="ship"
                        value="1"
                      />
                      {"  "} Cộng tác viên
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="group_customer"
                        checked={group_customer == 4 ? true : false}
                        className="group_customer"
                        id="ship"
                        value="4"
                      />
                      {"  "} Nhóm khách hàng
                    </label>
                  </div>
                  {group_customer == 2 && (
                    <select
                      onChange={this.onChange}
                      value={agency_type_id}
                      name="agency_type_id"
                      class="form-control"
                    >
                      <option value={-1}>--- Chọn cấp đại lý ---</option>
                      <option value={0}>Tất cả</option>
                      {types.map((v) => {
                        return (
                          <option value={v.id} key={v.id}>
                            {v.name}
                          </option>
                        );
                      })}
                    </select>
                  )}
                  {group_customer == 4 && (
                    <select
                      onChange={this.onChange}
                      value={group_type_id}
                      name="group_type_id"
                      class="form-control"
                    >
                      <option value={-1}>--- Chọn nhóm khách hàng ---</option>
                      {groupCustomer.length > 0 &&
                        groupCustomer.map((group) => {
                          return (
                            <option value={group.id} key={group.id}>
                              {group.name}
                            </option>
                          );
                        })}
                    </select>
                  )}
                </div>
                <div class="form-group">
                  <label for="product_name">Giới hạn Combo</label>
                  <input
                    type="text"
                    class="form-control"
                    id="txtAmount"
                    name="txtAmount"
                    value={txtAmount}
                    placeholder="Số lượng mã phiểu có thể sử dụng"
                    autoComplete="off"
                    onChange={this.onChange}
                  />
                </div>

                <div class="form-group">
                  <label for="product_name">Loại giảm giá</label>

                  <select
                    value={txtDiscoutType}
                    name="txtDiscoutType"
                    id="input"
                    class="form-control"
                    onChange={this.onChangeType}
                  >
                    <option value="0">Giảm giá cố định</option>
                    <option value="1">Giảm giá theo %</option>
                  </select>
                </div>
                <div class={`form-group ${type_discount_default}`}>
                  <input
                    type="text"
                    class="form-control"
                    id="txtValueDiscount"
                    name="txtValueDiscount"
                    value={txtValueDiscount}
                    placeholder="Nhập giá trị bạn muốn giảm (đ)"
                    autoComplete="off"
                    onChange={this.onChange}
                  />
                </div>

                <div className={`${type_discount_percent}`}>
                  <div class="form-group">
                    <input
                      type="text"
                      class="form-control"
                      id="txtValueDiscount"
                      name="txtValueDiscount"
                      value={txtValueDiscount}
                      placeholder="Nhập giá trị bạn muốn giảm (%)"
                      autoComplete="off"
                      onChange={this.onChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <div>
                <Table
                  handleChangeQuantity={this.handleChangeQuantity}
                  handleAddProduct={this.handleAddProduct}
                  products={saveListProducts}
                  setDefaultListProducts={this.setDefaultListProducts}
                ></Table>
              </div>
              {/* {getChannel() == BENITH &&

                <div class="form-group">
                  <label for="product_name">Ghi chú</label>
                  <CKEditor
                    data={txtContent}
                    onChange={this.onChangeDecription}
                  />
                </div>
              } */}
            </div>
          </div>
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <div class="box-footer">
                {canOnsave == true && (
                  <button type="submit" class="btn btn-info   btn-sm">
                    <i class="fas fa-save"></i> Lưu
                  </button>
                )}
                <button
                  type="button"
                  style={{ marginLeft: "10px" }}
                  onClick={this.goBack}
                  class="btn btn-warning   btn-sm"
                >
                  <i class="fas fa-arrow-left"></i> Trở về
                </button>
              </div>
            </div>
          </div>
        </form>

        <ConfimUpdateUsed onOk={this.onOkUpdate} />
        <ModalUpload />
        <ModalListProduct
          onSaveProduct={this.onSaveProduct}
          discount={combo}
          discounts={combos}
          handleAddProduct={this.handleAddProduct}
          listProducts={listProducts}
          store_code={store_code}
          products={products}
          setListProducts={this.setListProducts}
          discountId={this.props.comboId}
          defaultListProducts={this.state.defaultListProducts}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    image: state.UploadReducers.comboImg.combo_img,
    types: state.agencyReducers.agency.allAgencyType,
    groupCustomer: state.groupCustomerReducers.group_customer.groupCustomer,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    showError: (error) => {
      dispatch(error);
    },
    updateCombo: (store_code, form, comboId) => {
      dispatch(comboAction.updateCombo(store_code, form, comboId));
    },
    initialUpload: () => {
      dispatch(comboAction.initialUpload());
    },
    fetchAllAgencyType: (store_code) => {
      dispatch(AgencyAction.fetchAllAgencyType(store_code));
    },
    fetchGroupCustomer: (store_code) => {
      dispatch(groupCustomerAction.fetchGroupCustomer(store_code));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Form);
