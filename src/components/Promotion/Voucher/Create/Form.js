import React, { Component } from "react";
import * as Types from "../../../../constants/ActionType";
import { connect } from "react-redux";
import * as voucherAction from "../../../../actions/voucher";
import Table from "./Table";
import { shallowEqual } from "../../../../ultis/shallowEqual";
import moment from "moment";
import Datetime from "react-datetime";
import ModalListProduct from "../../Discount/Create/ListProduct";
import CKEditor from "ckeditor4-react";
import ModalUpload from "../ModalUpload";
import * as Env from "../../../../ultis/default";
import MomentInput from "react-moment-input";
import { formatNumber } from "../../../../ultis/helpers";
import { isEmpty } from "../../../../ultis/helpers";
import getChannel, { IKIPOS, BENITH } from "../../../../ultis/channel";
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
      txtDiscountType: 0,
      txtValueDiscount: "",
      txtCode: "",
      txtMaxValueDiscount: "",
      txtValueLimitTotal: "",
      listProducts: [],
      txtContent: "",
      image: "",
      is_type_discount: "show",
      is_limit: "hide",
      limit: "hide",
      displayError: "hide",
      saveListProducts: [],
      is_free_ship: false,
      ship_discount_value: null,
      discount_for: 0,
      group_customer: 0,
      agency_type_id: null,
      group_type_id: null,
    };
  }
  componentDidMount() {
    try {
      document.getElementsByClassName("r-input")[0].placeholder =
        "Chọn ngày và thời gian";
      document.getElementsByClassName("r-input")[1].placeholder =
        "Chọn ngày và thời gian";
    } catch (error) {}
    this.props.initialUpload();
    this.props.fetchAllAgencyType(this.props.store_code);
    this.props.fetchGroupCustomer(this.props.store_code);
  }
  onSaveProduct = () => {
    this.setState({ saveListProducts: [...this.state.listProducts] });
  };
  componentWillReceiveProps(nextProps) {
    const { group_type_id } = this.state;
    if (this.props.image !== nextProps.image) {
      this.setState({ image: nextProps.image });
    }
    if (group_type_id === null && nextProps.groupCustomer.length > 0) {
      this.setState({
        group_type_id: -1,
        agency_type_id: -1,
      });
    }
  }

  onChangeDecription = (evt) => {
    const data = evt.editor.getData();
    this.setState({ txtContent: data });
  };
  setListProducts = (listProducts) => {
    this.setState({ listProducts });
  };
  onChange = (e) => {
    var target = e.target;
    var name = target.name;
    var value = target.value;

    const _value = formatNumber(value);
    if (
      name == "txtValueLimitTotal" ||
      name == "txtAmount" ||
      name == "txtValueDiscount" ||
      name == "txtMaxValueDiscount" ||
      name == "ship_discount_value"
    ) {
      if (!isNaN(Number(_value))) {
        value = new Intl.NumberFormat().format(_value);
        if (name == "txtValueDiscount" && this.state.is_limit == "show") {
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

  checkStatus = (start_time) => {
    var now = moment().valueOf();
    var start_time = moment(start_time, "YYYY-MM-DD HH:mm:ss").valueOf();
    if (now < start_time) {
      return "0";
    } else {
      return "2";
    }
  };

  onSave = (e) => {
    e.preventDefault();
    if (this.state.displayError == "show") {
      return;
    }
    var state = this.state;
    if (
      (state.txtValueDiscount == null || !isEmpty(state.txtValueDiscount)) &&
      discount_for == 0
    ) {
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
    if (
      state.txtDiscountType == 0 &&
      formatNumber(state.txtValueLimitTotal) <
        formatNumber(state.txtValueDiscount) &&
      discount_for == 0
    ) {
      this.props.showError({
        type: Types.ALERT_UID_STATUS,
        alert: {
          type: "danger",
          title: "Lỗi",
          disable: "show",
          content:
            "Giá trị voucher không thể vượt quá giá trị tối thiểu của đơn hàng",
        },
      });
      return;
    }
    var { store_code, type } = this.props;

    var listProducts = state.saveListProducts;
    var product_ids = "";
    listProducts.forEach((element, index) => {
      if (listProducts.length == index + 1)
        product_ids = product_ids + element.id;
      else product_ids = product_ids + element.id + ",";
    });
    var startTime = moment(state.txtStart, "DD-MM-YYYY HH:mm").format(
      "YYYY-MM-DD HH:mm:ss"
    );
    var endTime = moment(state.txtEnd, "DD-MM-YYYY HH:mm").format(
      "YYYY-MM-DD HH:mm:ss"
    );
    var voucherType = type == "store" ? 0 : 1;
    var { group_customer, agency_type_id, group_type_id } = this.state;
    var agency_type_name =
      this.props.types.filter((v) => v.id === parseInt(agency_type_id))?.[0]
        ?.name || null;
    console.log(this.props.types, agency_type_name);
    var form = {
      group_customer,
      agency_type_id,
      agency_type_name,
      group_type_id,
      name: state.txtName,
      start_time: startTime == "Invalid date" ? null : startTime,
      end_time: endTime == "Invalid date" ? null : endTime,
      amount:
        state.txtAmount == null
          ? state.txtAmount
          : formatNumber(state.txtAmount),
      product_ids: product_ids,
      description: state.txtContent,
      image_url: state.image,
      voucher_type: voucherType,
      discount_type: state.txtDiscountType,
      value_discount:
        state.txtValueDiscount == null
          ? state.txtValueDiscount
          : formatNumber(state.txtValueDiscount),
      max_value_discount:
        state.txtMaxValueDiscount == null
          ? state.txtMaxValueDiscount
          : formatNumber(state.txtMaxValueDiscount),
      value_limit_total:
        state.txtValueLimitTotal == null
          ? state.txtValueLimitTotal
          : formatNumber(state.txtValueLimitTotal),
      code: state.txtCode,
      set_limit_value_discount: true,
      set_limit_total: true,
      set_limit_amount: true,
      is_show_voucher: 1,
    };
    if (type == "store") delete form.product_ids;
    if (this.state.limit == "hide") form.set_limit_value_discount = false;
    if (form.value_limit_total == "") form.set_limit_total = false;
    if (form.amount == "") form.set_limit_amount = false;

    if (form.product_ids == "") {
      delete form.product_ids;
    }
    console.log(form);
    var { discount_for, is_free_ship, ship_discount_value } = this.state;

    var dataShip = {};
    var formatShipDiscount = ship_discount_value
      ? formatNumber(ship_discount_value)
      : null;
    if (discount_for == 1) {
      if (is_free_ship == true) {
        dataShip = {
          discount_for: discount_for,
          is_free_ship: true,
          ship_discount_value: null,
          discount_type: null,
          value_discount: null,
        };
      } else {
        dataShip = {
          discount_for: discount_for,
          is_free_ship: false,
          ship_discount_value: formatShipDiscount,
          discount_type: null,
          value_discount: null,
        };
      }
    } else {
      dataShip = {
        discount_for: discount_for,
      };
    }
    this.props.createVoucher(
      store_code,
      { ...form, ...dataShip },
      this.checkStatus(startTime)
    );
  };

  goBack = (e) => {
    e.preventDefault();
    var { history } = this.props;
    history.goBack();
  };

  handleAddProduct = (product, id, type, onSave = null) => {
    console.log(product);
    var products = [...this.state.listProducts];

    if (type == "remove") {
      if (products.length > 0) {
        products.forEach((item, index) => {
          if (item.id === id) {
            products.splice(index, 1);
          }
        });
      }
    } else {
      var checkExsit = true;
      products.forEach((item, index) => {
        if (item.id === product.id) {
          checkExsit = false;
          return;
        }
      });
      if (checkExsit == true) {
        products.push(product);
      }
    }
    if (onSave == true)
      this.setState({ listProducts: products, saveListProducts: products });
    else this.setState({ listProducts: products });
  };

  setTypeDiscount = (e) => {
    var value = e.target.value;
    this.setState({ txtDiscountType: value }, () => {
      if (value == "0")
        this.setState({
          is_type_discount: "show",
          is_limit: "hide",
          txtValueDiscount: "",
        });
      else if (value == "1")
        this.setState({
          is_type_discount: "hide",
          is_limit: "show",
          txtValueDiscount: "",
        });
      else
        this.setState({
          is_type_discount: "hide",
          is_limit: "hide",
          txtValueDiscount: "",
        });
    });
  };

  onChangeLimit = (e) => {
    var value = e.target.value;
    if (value == "0") this.setState({ limit: "show" });
    else if (value == "1") {
      this.setState({ limit: "hide", txtLimitTotal: "" });
    } else this.setState({ limit: "hide" });
  };
  render() {
    var {
      txtName,
      txtStart,
      txtEnd,
      txtAmount,
      txtValueDiscount,
      txtCode,
      txtMaxValueDiscount,
      txtValueLimitTotal,
      listProducts,
      txtContent,
      image,
      is_type_discount,
      is_limit,
      limit,
      displayError,
      saveListProducts,
      discount_for,
      is_free_ship,
      group_customer,
      agency_type_id,
      group_type_id,
      ship_discount_value,
    } = this.state;

    var image = image == "" || image == null ? Env.IMG_NOT_FOUND : image;
    var { products, store_code, vouchers, types, groupCustomer } = this.props;
    var disableOfType = this.props.type == "store" ? "hide" : "show";
    return (
      <React.Fragment>
        <form role="form" onSubmit={this.onSave} method="post">
          <div class="row">
            <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
              <div class="box-body">
                {/* {getChannel() == BENITH && 
              
              (
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
                        data-target="#uploadModalDiscount"
                      >
                        <i class="fa fa-plus"></i> Upload ảnh
                      </button>
                    </div>
                  </div>

                </div>
                </React.Fragment>
              )} */}

                <div class="form-group">
                  <label htmlFor="product_name">Tên chương trình</label>
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
                  <label htmlFor="product_name">Mã giảm giá</label>
                  <input
                    type="text"
                    class="form-control"
                    id="txtCode"
                    value={txtCode}
                    name="txtCode"
                    placeholder="Nhập mã giảm giá"
                    autoComplete="off"
                    onChange={this.onChange}
                  />
                </div>

                <div class="form-group">
                  <label htmlFor="product_name">Thời gian bắt đầu</label>
                  <MomentInput
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
                </div>
                <div class="form-group">
                  <label htmlFor="product_name">Thời gian kết thúc</label>
                  <MomentInput
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
                </div>
                <div class="form-group">
                  <label htmlFor="product_name">Đơn tối thiểu</label>
                  <input
                    type="text"
                    class="form-control"
                    id="txtValueLimitTotal"
                    name="txtValueLimitTotal"
                    value={txtValueLimitTotal}
                    placeholder="Nhập giá trị tối thiểu của đơn hàng"
                    autoComplete="off"
                    onChange={this.onChange}
                  />
                </div>
              </div>
            </div>
            <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
              <div class="box-body">
                <div class={`alert alert-danger ${displayError}`} role="alert">
                  Thời gian kết thúc phải sau thời gian bắt đầu
                </div>
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
                  <label htmlFor="product_name">Số mã có thể sử dụng</label>
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

                <div className="form-group discount-for">
                  <label htmlFor="discount_for"></label>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                    className="radio discount-for"
                    onChange={this.onChange}
                  >
                    <label>
                      <input
                        type="radio"
                        name="discount_for"
                        checked={discount_for == 0 ? true : false}
                        className="discount_for"
                        id="bill"
                        value="0"
                      />
                      {"  "}Giảm giá cho đơn hàng
                    </label>
                    {this.props.type === "store" && (
                      <label>
                        <input
                          type="radio"
                          name="discount_for"
                          checked={discount_for == 1 ? true : false}
                          className="discount_for"
                          id="ship"
                          value="1"
                        />
                        {"  "} Giảm giá cho vận chuyển
                      </label>
                    )}
                  </div>
                </div>

                {discount_for == 1 && (
                  <>
                    {discount_for == 1 && (
                      <>
                        <div class="form-group" style={{ marginTop: "10px" }}>
                          <div class="form-check">
                            <input
                              class="form-check-input"
                              name="is_free_ship"
                              onChange={(e) =>
                                this.setState({ is_free_ship: !is_free_ship })
                              }
                              checked={is_free_ship}
                              type="checkbox"
                            />
                            <label class="form-check-label">
                              Miễn phí vận chuyển
                            </label>
                          </div>
                        </div>
                        {is_free_ship == false && (
                          <input
                            style={{ marginTop: "10px" }}
                            type="text"
                            class="form-control"
                            id="txtAmount"
                            name="ship_discount_value"
                            value={ship_discount_value}
                            placeholder="Nhập giá trị giảm"
                            autoComplete="off"
                            onChange={this.onChange}
                          />
                        )}
                      </>
                    )}
                  </>
                )}

                {discount_for == 0 && (
                  <>
                    <div class="form-group">
                      <label htmlFor="product_name">Loại giảm giá</label>

                      <select
                        name=""
                        id="input"
                        class="form-control"
                        onChange={this.setTypeDiscount}
                      >
                        <option value="0">Giảm giá cố định</option>
                        <option value="1">Giảm giá theo %</option>
                      </select>
                    </div>
                    <div class={`form-group ${is_type_discount}`}>
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

                    <div className={`${is_limit}`}>
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
                      <div class="form-group">
                        <label htmlFor="product_name">Giảm tối đa</label>

                        <div class="checkbox" onChange={this.onChangeLimit}>
                          <label>
                            <input type="radio" value="0" name="limit" />
                            Chọn mức giảm
                          </label>
                          <label style={{ marginLeft: "20px" }}>
                            <input type="radio" value="1" name="limit" />
                            Không giới hạn
                          </label>
                        </div>
                      </div>
                      <div className={`${limit}`}>
                        <input
                          type="text"
                          class="form-control"
                          id="txtMaxValueDiscount"
                          name="txtMaxValueDiscount"
                          value={txtMaxValueDiscount}
                          placeholder="Nhập giá trị bạn muốn giảm"
                          autoComplete="off"
                          onChange={this.onChange}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <div className={`${disableOfType}`}>
                <Table
                  handleAddProduct={this.handleAddProduct}
                  products={saveListProducts}
                ></Table>
              </div>
              {getChannel == BENITH && (
                <div class="form-group">
                  <label htmlFor="product_name">Mô tả</label>
                  <CKEditor
                    data={txtContent}
                    onChange={this.onChangeDecription}
                  />
                </div>
              )}
            </div>
          </div>
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <div class="box-footer">
                <button type="submit" class="btn btn-info   btn-sm">
                  <i class="fas fa-save"></i> Tạo
                </button>
                <button
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

        <ModalUpload />
        <ModalListProduct
          onSaveProduct={this.onSaveProduct}
          discounts={vouchers}
          handleAddProduct={this.handleAddProduct}
          listProducts={listProducts}
          store_code={store_code}
          products={products}
          setListProducts={this.setListProducts}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    image: state.UploadReducers.voucherImg.voucher_img,
    types: state.agencyReducers.agency.allAgencyType,
    groupCustomer: state.groupCustomerReducers.group_customer.groupCustomer,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    showError: (error) => {
      dispatch(error);
    },
    createVoucher: (store_code, voucher, status) => {
      dispatch(voucherAction.createVoucher(store_code, voucher, status));
    },
    initialUpload: () => {
      dispatch(voucherAction.initialUpload());
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
