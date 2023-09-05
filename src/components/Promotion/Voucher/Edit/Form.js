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
      txtDiscountType: 0,
      txtValueDiscount: "",
      txtCode: "",
      txtMaxValueDiscount: "",
      txtValueLimitTotal: "",
      listProducts: [],
      saveListProducts: [],

      txtContent: "",
      txtIsShow: "",
      image: "",
      is_type_discount: "hide",
      is_limit: "hide",
      limit: "hide",
      type: "",
      displayError: "hide",
      group_customer: 0,
      agency_type_id: null,
      group_type_id: null,
      isLoading: false,
      loadCript: false,
      form: {},
      discount_for: 0,
      is_free_ship: true,
      ship_discount_value: null,
      has_discount_ship: false,
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
    if (!shallowEqual(nextProps.voucher, this.props.voucher)) {
      var { voucher } = nextProps;

      var startTime =
        voucher.start_time == null || voucher.start_time == ""
          ? ""
          : moment(voucher.start_time).format("DD-MM-YYYY HH:mm");
      var endTime =
        voucher.end_time == null || voucher.end_time == ""
          ? ""
          : moment(voucher.end_time).format("DD-MM-YYYY HH:mm");

      var type = voucher.voucher_type == 0 ? "store" : "product";
      var is_limit =
        voucher.discount_type == null
          ? "hide"
          : voucher.discount_type == 0
          ? "hide"
          : "show";
      var is_type_discount =
        voucher.discount_type == null
          ? "hide"
          : voucher.discount_type == 0
          ? "show"
          : "hide";
      var limit = voucher.set_limit_value_discount == true ? "show" : "hide";
      var txtIsShow = voucher.is_show_voucher == true ? 1 : 0;
      console.log(limit);
      this.setState({
        txtName: voucher.name,
        txtStart: startTime,
        txtEnd: endTime,
        txtValue: voucher.value,
        txtAmount:
          voucher.amount == null
            ? 0
            : new Intl.NumberFormat().format(voucher.amount.toString()),
        txtLastAmount:
          voucher.amount == null
            ? 0
            : new Intl.NumberFormat().format(voucher.amount.toString()),
        listProducts: voucher.products,
        txtContent: voucher.description,
        image: voucher.image_url,
        txtCode: voucher.code,
        saveListProducts: voucher.products,
        group_customer: voucher.group_customer,
        agency_type_id: voucher.agency_type_id,
        group_type_id: voucher.group_type_id,
        txtDiscountType: voucher.discount_type,
        txtValueDiscount:
          voucher.discount_type == null
            ? ""
            : voucher.value_discount == null
            ? null
            : new Intl.NumberFormat().format(voucher.value_discount.toString()),
        txtMaxValueDiscount:
          is_limit == "hide" || limit == "hide"
            ? ""
            : voucher.max_value_discount == null
            ? null
            : new Intl.NumberFormat().format(
                voucher.max_value_discount.toString()
              ),
        txtValueLimitTotal:
          voucher.value_limit_total == null
            ? null
            : new Intl.NumberFormat().format(
                voucher.value_limit_total.toString()
              ),
        txtIsShow: txtIsShow,
        limit: limit,
        is_type_discount: is_type_discount,
        is_limit: is_limit,
        type: type,
        isLoading: true,
        loadCript: true,
        discount_for: voucher.discount_for != 1 ? 0 : 1,
        is_free_ship:
          voucher.is_free_ship == null || voucher.is_free_ship == false
            ? false
            : true,
        ship_discount_value: voucher.ship_discount_value,
        has_discount_ship: voucher.discount_for !== null ? true : false,
      });
    }
    if (this.props.image !== nextProps.image) {
      this.setState({ image: nextProps.image });
    }
  }
  setListProducts = (listProducts) => {
    this.setState({ listProducts });
  };
  setDefaultListProducts = () => {
    this.setState({ defaultListProducts: this.state.listProducts });
  };

  onChangeDecription = (evt) => {
    const data = evt.editor.getData();
    this.setState({ txtContent: data });
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
      name == "txtMaxValueDiscount"
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
    var { store_code, voucherId } = this.props;

    var listProducts = state.saveListProducts;
    var product_ids = "";
    listProducts.forEach((element, index) => {
      if (listProducts.length == index + 1)
        product_ids = product_ids + element.id;
      else product_ids = product_ids + element.id + ",";
    });
    var { type, limit } = state;
    var startTime = moment(state.txtStart, "DD-MM-YYYY HH:mm").format(
      "YYYY-MM-DD HH:mm:ss"
    );
    var endTime = moment(state.txtEnd, "DD-MM-YYYY HH:mm").format(
      "YYYY-MM-DD HH:mm:ss"
    );
    var voucherType = type == "store" ? 0 : 1;
    var txtIsShow = state.txtIsShow == "1" ? true : false;
    var { group_customer, agency_type_id, group_type_id } = this.state;
    var agency_type_name =
      this.props.types.filter((v) => v.id === parseInt(agency_type_id))?.[0]
        ?.name || null;
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
      is_show_voucher: txtIsShow,

      set_limit_value_discount: true,
      set_limit_total: true,
      set_limit_amount: true,
    };

    if (limit == "hide") form.set_limit_value_discount = false;
    if (
      form.value_limit_total == null ||
      typeof form.value_limit_total == "undefined" ||
      form.value_limit_total == ""
    )
      form.set_limit_total = false;
    if (
      form.amount == null ||
      typeof form.amount == "undefined" ||
      form.amount == ""
    )
      form.set_limit_amount = false;

    if (form.product_ids == "") {
      delete form.product_ids;
    }

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
      var {
        discount_for,
        is_free_ship,
        ship_discount_value,
        has_discount_ship,
      } = this.state;

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

      this.props.updateVoucher(store_code, { ...form, ...dataShip }, voucherId);
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
          `/voucher/${store_code}?type=${type}${page ? `&page=${page}` : ""}`
        );
      } else {
        history.replace(
          `/voucher/${store_code}?type=${type}${
            search ? `&search=${search}` : ""
          }`
        );
      }
    } else {
      history.goBack();
    }
  };

  onOkUpdate = () => {
    var { store_code, voucherId } = this.props;
    this.props.updateVoucher(store_code, this.state.form, voucherId);
  };

  handleAddProduct = (product, id, type, onSave) => {
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
  onSaveProduct = () => {
    this.setState({ saveListProducts: [...this.state.listProducts] });
  };
  onChangeLimit = (e) => {
    var value = e.target.value;
    console.log(value);
    if (value == "0") this.setState({ limit: "show" });
    else if (value == "1") {
      this.setState({ limit: "hide", txtLimitTotal: "" });
    } else this.setState({ limit: "hide" });
  };
  render() {
    var {
      txtDiscountType,
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
      txtIsShow,
      image,
      is_type_discount,
      is_limit,
      limit,
      type,
      saveListProducts,
      discount_for,
      is_free_ship,
      ship_discount_value,
      has_discount_ship,
      displayError,
      isLoading,
      group_customer,
      agency_type_id,
      group_type_id,
    } = this.state;

    var image = image == "" || image == null ? Env.IMG_NOT_FOUND : image;
    var { products, store_code, vouchers, voucher, types, groupCustomer } =
      this.props;
    var disableOfType = type == "store" ? "hide" : "show";
    var checkLimit = limit == "show" ? true : false;
    var now = moment().valueOf();
    var end_time = moment(voucher.end_time, "YYYY-MM-DD HH:mm:ss").valueOf();
    var canOnsave = now < end_time;
    console.log(checkLimit);
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
                  <label for="product_name">Mã giảm giá</label>
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
                <div class="form-group">
                  <label for="product_name">Đơn tối thiểu</label>
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
                {/* <div class="form-group">
                  <label for="product_name">Trạng thái</label>


                  <select value={txtIsShow} name="txtIsShow" id="input" class="form-control" onChange={this.onChange} >
                    <option value="">--Chế độ hiễn thị--</option>
                    <option value="1">Hiễn thị</option>
                    <option value="0">Ẩn</option>

                  </select>

                </div> */}
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
                  <label for="product_name">Số mã có thể sử dụng</label>
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
                    {type === "store" && (
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
                      <label for="product_name">Loại giảm giá</label>

                      <select
                        value={txtDiscountType}
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
                        <label for="product_name">Giảm tối đa</label>

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
                  products={saveListProducts}
                  handleAddProduct={this.handleAddProduct}
                  setDefaultListProducts={this.setDefaultListProducts}
                ></Table>
              </div>
              {getChannel == BENITH && (
                <div class="form-group">
                  <label for="product_name">Mô tả</label>
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
          discounts={vouchers}
          discount={voucher}
          handleAddProduct={this.handleAddProduct}
          listProducts={listProducts}
          store_code={store_code}
          products={products}
          discountId={this.props.voucherId}
          setListProducts={this.setListProducts}
          defaultListProducts={this.state.defaultListProducts}
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
    updateVoucher: (store_code, form, voucherId) => {
      dispatch(voucherAction.updateVoucher(store_code, form, voucherId));
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
