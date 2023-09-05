import React, { Component } from "react";
import Sidebar from "../../components/Partials/Sidebar";
import Topbar from "../../components/Partials/Topbar";
import Footer from "../../components/Partials/Footer";
import Pagination from "../../components/Customer/Pagination";
import Table from "../../components/Customer/Table";
import { Redirect, Link } from "react-router-dom";
import { connect, shallowEqual } from "react-redux";
import Loading from "../Loading";
import * as customerAction from "../../actions/customer";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import NotAccess from "../../components/Partials/NotAccess";
import {
  formatNumberV2,
  getQueryParams,
  setQueryParamInUrl,
} from "../../ultis/helpers";
import $ from "jquery";
import * as XLSX from "xlsx";
import ModalCreate from "../../components/Customer/ModalCreate";
import getChannel, { IKIPOS, BENITH } from "../../ultis/channel";
import * as placeAction from "../../actions/place";
import ModalEdit from "../../components/Customer/ModalEdit";
import SidebarFilterCustomer from "../../components/Customer/SidebarFilterCustomer";
import * as AgencyAction from "../../actions/agency";
import styled from "styled-components";
import { options } from "../../ultis/groupCustomer/options";
import * as Types from "../../constants/ActionType";
import { genders } from "../../ultis/groupCustomer/genders";
import SidebarShowCustomersByReferralPhone from "../../components/Customer/SidebarShowCustomersByReferralPhone";
import moment from "moment";
import ModalUpdatePasswordImport from "./ModalUpdatePasswordImport";
import history from "../../history";
import * as saleAction from "../../actions/sale";
import * as packageProductAction from "../../actions/package_product";

const CustomerStyles = styled.div`
  .filter-search-customer {
    position: relative;
    padding: 0.375rem 0.75rem;
    border-radius: 0.35rem;
    border: 1px solid #d1d3e2;
    border-right-color: transparent;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    display: flex;
    align-items: center;
    column-gap: 5px;
    font-size: 15px;
    &:hover .filter-search-customer-dropdown {
      opacity: 1;
      visibility: visible;
    }
    span:last-of-type {
      margin-left: 5px;
      i {
        margin-top: -5px;
      }
    }
    .filter-search-customer-count {
      font-size: 14px;
    }
    .filter-search-customer-dropdown {
      position: absolute;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s;
      top: calc(100% + 10px);
      left: 0;
      width: max-content;
      border-radius: 6px;
      box-shadow: 0 0 6px 2px rgba(0, 0, 0, 0.1);
      color: #2d3436;
      background-color: white;
      padding: 0.375rem 0.75rem;
      font-size: 14px;
      width: 450px;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      &::before {
        content: "";
        position: absolute;
        z-index: 20;
        top: -7px;
        left: 10%;
        width: 16px;
        background-color: white;
        transform: rotate(45deg);
        height: 16px;
        border-radius: 2px;
        border: 1px solid transparent;
        border-left-color: rgb(218, 218, 225);
        border-top-color: rgb(218, 218, 225);
      }
      p {
        display: block;
        width: 100%;
        margin-bottom: 10px;
      }
      .filter-search-customer-dropdown-btnFilter {
        margin: 10px 0;
        display: block;
        width: 100%;
        button {
          padding: 0.375rem 0.75rem;
          border-radius: 0.35rem;
        }
      }
      .filter-search-customer-dropdown-item {
        display: inline-block;
        padding: 6px 12px;
        border: 1px solid #d1d3e2;
        overflow: hidden;
        border-radius: 6px;
        .filter-search-customer-dropdown-item-btnDelete {
          cursor: pointer;
        }
      }
    }
  }
  .btn-filter-search {
    color: white;
    margin-left: 20px;
    padding: 0.375rem 0.75rem;
    border-radius: 0.35rem;
    cursor: pointer;
  }
  tr {
    .total_referral {
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .totalContent {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;
class Customer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showChatBox: "hide",
      searchValue: getQueryParams("search") || "",
      paginate: getQueryParams("page") || 1,
      openModal: false,
      openModalEdit: false,
      customerInfo: {},
      modal: "",
      showFilterSearch: false,
      showCustomersByReferralPhone: false,
      pageReferralPhone: 1,
      currentParams: "",
      fields: ["Tên khách hàng", "Số điện thoại"],
      openModalImport: false,
      isUpdatedPasswordImport: false,
      level: getQueryParams("level") || "",
      status: getQueryParams("status") || "",
      role_customer: getQueryParams("role_customer") || "",
    };
  }

  setSearchValue = (value) => {
    this.setState({
      searchValue: value,
    });
  };
  setOpenModalImport = (isOpenedModal) => {
    this.setState({ openModalImport: isOpenedModal });
  };
  setIsUpdatedPasswordImport = (isUpdatedPasswordImport) => {
    this.setState({ isUpdatedPasswordImport });
  };

  openModal = () => {
    this.setState({ openModal: true });
  };
  resetModal = () => {
    this.setState({ openModal: false });
  };
  resetModalEdit = () => {
    this.setState({ openModalEdit: false });
  };

  handleShowChatBox = (customerId, status) => {
    this.setState({
      showChatBox: status,
      customerId: customerId,
    });
    var { store_code } = this.props.match.params;
    this.props.fetchCustomerId(store_code, customerId);
    this.props.fetchChatId(store_code, customerId);
  };

  onChangeSearch = (e) => {
    this.setState({ searchValue: e.target.value });
  };
  searchData = (e) => {
    e.preventDefault();
    const { store_code } = this.props.match.params;
    const { searchValue, status, level, role_customer } = this.state;
    const jsonListFilter = localStorage.getItem("optionsFilter");

    this.setState({
      paginate: 1,
    });
    if (this.isSale()) {
      history.push(
        `/customer/${store_code}/customerSale?page=1&search=${searchValue}&status=${status}&level=${level}&role_customer=${role_customer}`
      );
      const params = `&search=${searchValue}&json_list_filter=${jsonListFilter}&status=${status}&level=${level}&role_customer=${role_customer}`;
      this.fetchListCustomerOfSale(store_code, 1, params);
    } else {
      history.push(
        `/customer/${store_code}?page=1&search=${searchValue}&status=${status}&level=${level}&role_customer=${role_customer}`
      );
      const params = `&search=${searchValue}&json_list_filter=${jsonListFilter}&status=${status}&level=${level}&role_customer=${role_customer}`;
      this.fetchAllCustomer(store_code, 1, params);
    }
  };

  onChangeLevel = (e) => {
    const { store_code } = this.props.match.params;
    const { searchValue, status, role_customer } = this.state;

    const jsonListFilter = localStorage.getItem("optionsFilter");
    this.setState({
      paginate: 1,
      level: e.target.value,
    });
    if (this.isSale()) {
      history.push(
        `/customer/${store_code}/customerSale?page=1&search=${searchValue}&level=${e.target.value}&status=${status}&role_customer=${role_customer}`
      );
      const params = `&search=${searchValue}&json_list_filter=${jsonListFilter}&level=${e.target.value}&status=${status}&role_customer=${role_customer}`;
      this.fetchListCustomerOfSale(store_code, 1, params);
    } else {
      history.push(
        `/customer/${store_code}?page=1&search=${searchValue}&level=${e.target.value}&status=${status}&role_customer=${role_customer}`
      );
      const params = `&search=${searchValue}&json_list_filter=${jsonListFilter}&level=${e.target.value}&status=${status}&role_customer=${role_customer}`;
      this.fetchAllCustomer(store_code, 1, params);
    }
  };
  onChangeStatus = (e) => {
    const { store_code } = this.props.match.params;
    const { searchValue, level, role_customer } = this.state;
    const jsonListFilter = localStorage.getItem("optionsFilter");
    this.setState({
      paginate: 1,
      status: e.target.value,
    });
    if (this.isSale()) {
      history.push(
        `/customer/${store_code}/customerSale?page=1&search=${searchValue}&level=${level}&status=${e.target.value}&role_customer=${role_customer}`
      );
      const params = `&search=${searchValue}&json_list_filter=${jsonListFilter}&level=${level}&status=${e.target.value}&role_customer=${role_customer}`;
      this.fetchListCustomerOfSale(store_code, 1, params);
    } else {
      history.push(
        `/customer/${store_code}?page=1&search=${searchValue}&level=${level}&status=${e.target.value}&role_customer=${role_customer}`
      );
      const params = `&search=${searchValue}&json_list_filter=${jsonListFilter}&level=${level}&status=${e.target.value}&role_customer=${role_customer}`;
      this.fetchAllCustomer(store_code, 1, params);
    }
  };
  onChangeRole = (e) => {
    const { store_code } = this.props.match.params;
    const { searchValue, level, status } = this.state;
    const jsonListFilter = localStorage.getItem("optionsFilter");
    this.setState({
      paginate: 1,
      role_customer: e.target.value,
    });
    if (this.isSale()) {
      history.push(
        `/customer/${store_code}/customerSale?page=1&search=${searchValue}&level=${level}&status=${status}&role_customer=${e.target.value}`
      );
      const params = `&search=${searchValue}&json_list_filter=${jsonListFilter}&level=${level}&status=${status}&role_customer=${e.target.value}`;
      this.fetchListCustomerOfSale(store_code, 1, params);
    } else {
      history.push(
        `/customer/${store_code}?page=1&search=${searchValue}&level=${level}&status=${status}&role_customer=${e.target.value}`
      );
      const params = `&search=${searchValue}&json_list_filter=${jsonListFilter}&level=${level}&status=${status}&role_customer=${e.target.value}`;
      this.fetchAllCustomer(store_code, 1, params);
    }
  };

  fetchListCustomerOfSale = (store_code, page, params) => {
    this.setState({
      currentParams: params,
    });
    this.props.fetchListCustomerOfSale(store_code, page, params);
  };
  fetchAllCustomer = (store_code, page, params) => {
    this.setState({
      currentParams: params,
    });
    this.props.fetchAllCustomer(store_code, page, params);
  };
  componentWillReceiveProps(nextProps) {
    if (
      this.state.isLoading != true &&
      typeof nextProps.permission.customer_list != "undefined"
    ) {
      var permissions = nextProps.permission;
      var chat_allow = permissions.chat_allow;
      var isShow = permissions.customer_list || this.isSale();
      var show_password = permissions.show_password;
      var change_password = permissions.change_password;
      var change_status_customer = permissions.change_status_customer;

      this.setState({
        isLoading: true,
        isShow,
        chat_allow,
        show_password,
        change_password,
        change_status_customer,
      });
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    const {
      addedCustomerOfSaleSuccessfully,
      resetAddedCustomerOfSaleSuccessfully,
    } = this.props;
    const { store_code } = this.props.match.params;
    if (
      !shallowEqual(
        addedCustomerOfSaleSuccessfully,
        nextProps.addedCustomerOfSaleSuccessfully
      ) &&
      nextProps.addedCustomerOfSaleSuccessfully
    ) {
      this.fetchListCustomerOfSale(store_code, 1, "");
      resetAddedCustomerOfSaleSuccessfully();
    }
    return true;
  }
  isSale = () => {
    const pathName = window.location.pathname.split("/");
    const isCheckedSale =
      pathName[1] === "customer" && pathName[3] === "customerSale";
    return isCheckedSale;
  };

  exportAllListOrder = () => {
    var { store_code } = this.props.match.params;
    this.props.exportAllListCustomer(
      store_code,
      this.state.currentParams,
      this.isSale()
    );
  };

  componentDidMount() {
    const page = getQueryParams("page") || 1;
    const search = getQueryParams("search") || "";
    const level = getQueryParams("level") || "";
    const status = getQueryParams("status") || "";
    const role_customer = getQueryParams("role_customer") || "";

    const params = `&search=${search}&level=${level}&status=${status}&role_customer=${role_customer}`;
    this.setState({
      paginate: page,
      searchValue: search,
    });
    if (this.isSale()) {
      this.fetchListCustomerOfSale(
        this.props.match.params.store_code,
        page,
        params
      );
    } else {
      this.fetchAllCustomer(this.props.match.params.store_code, page, params);
    }
    this.props.fetchPackageProduct(this.props.match.params.store_code);
    this.props.fetchPlaceProvince();
    this.props.fetchAllAgencyType(this.props.match.params.store_code);
  }

  setShowFilterSearch = (isShowed) => {
    this.setState({
      showFilterSearch: isShowed,
    });
  };

  handleShowFilterSearch = (e) => {
    const sidebarFilter = document.querySelector(".sidebar-filter");
    const btnFilterSearch = document.querySelector(".btn-filter-search");
    if (
      sidebarFilter.contains(e.target) ||
      btnFilterSearch.contains(e.target)
    ) {
      return;
    }
    this.setShowFilterSearch(false);
  };
  handleSetIdCustomer = (id) => {
    this.setState({
      id_supplier: id,
    });
  };

  handleSetInfor = (item) => {
    this.setState({ modal: item });
  };

  closeChatBox = (status) => {
    this.setState({
      showChatBox: status,
    });
  };
  getPaginate = (num) => {
    this.setState({ paginate: num });
  };
  handleShowTypeCondition = () => {
    const newOptions = [];
    const optionFilteredCustomer =
      JSON.parse(localStorage.getItem("optionsFilter")) || [];
    options.forEach((option) => {
      optionFilteredCustomer.forEach((optionFiter) => {
        if (option.id === Number(optionFiter.type_compare)) {
          newOptions.push({
            id: option.id,
            type_compare: option.title,
            comparison_expression: optionFiter.comparison_expression,
            value_compare: this.handleFilterValueCompare(
              Number(optionFiter.type_compare),
              optionFiter.value_compare
            ),
          });
          return;
        }
        return;
      });
    });
    return newOptions.map((option) => (
      <div key={option.id} className="filter-search-customer-dropdown-item">
        {option.type_compare} {option.comparison_expression}{" "}
        {option.value_compare}{" "}
        <span
          className="filter-search-customer-dropdown-item-btnDelete"
          onClick={() => this.handleDeleteOptionFilterById(option.id)}
        >
          <i className="fa fa-times"></i>
        </span>
      </div>
    ));
  };
  handleFilterValueCompare = (type, value) => {
    var genderFilter = [];
    var province = [];
    var typeAgencySelected = [];

    if (type === Types.TYPE_COMPARE_SEX) {
      genderFilter = genders.filter(
        (gender) => Number(gender.value) === Number(value)
      );
    }
    if (type === Types.TYPE_COMPARE_PROVINCE) {
      province = this.props.province.filter(
        (province) => province.id === Number(value)
      );
    }
    if (type === Types.TYPE_COMPARE_AGENCY) {
      if (Number(value) === 0) {
        typeAgencySelected = [{ name: "Tất cả" }];
      } else {
        typeAgencySelected = this.props.types.filter((typeAgency) => {
          return typeAgency.id === Number(value);
        });
      }
    }
    const valueConvert =
      type === Types.TYPE_COMPARE_TOTAL_FINAL_COMPLETED ||
      type === Types.TYPE_COMPARE_TOTAL_FINAL_WITH_REFUND ||
      type === Types.TYPE_COMPARE_POINT
        ? `${value}đ`
        : type === Types.TYPE_COMPARE_COUNT_ORDER
        ? `${value}`
        : type === Types.TYPE_COMPARE_SEX
        ? `${genderFilter[0].type}`
        : type === Types.TYPE_COMPARE_PROVINCE
        ? province[0]?.name
        : type === Types.TYPE_COMPARE_CTV
        ? "Tất cả"
        : type === Types.TYPE_COMPARE_AGENCY
        ? typeAgencySelected[0].name
        : value;
    return valueConvert;
  };
  handleDeleteOptionFilterById = (idOptionType) => {
    var { store_code } = this.props.match.params;
    var { searchValue } = this.state;
    const newOptionConditionFormat = [];

    const optionFilteredCustomer =
      JSON.parse(localStorage.getItem("optionsFilter")) || [];
    const newOptionCondition = optionFilteredCustomer.filter(
      (option) => Number(option.type_compare) !== Number(idOptionType)
    );

    newOptionCondition.forEach((option) => {
      newOptionConditionFormat.push({
        type_compare: option.type_compare,
        comparison_expression: option.comparison_expression,
        value_compare: option.value_compare.toString().replace(/\./g, ""),
      });
    });
    this.setState({
      optionsFilter: newOptionCondition,
    });
    var params = `&search=${searchValue}&json_list_filter=${JSON.stringify(
      newOptionConditionFormat
    )}`;
    if (this.isSale()) {
      this.fetchListCustomerOfSale(store_code, 1, params);
    } else {
      this.fetchAllCustomer(store_code, 1, params);
    }
    localStorage.setItem("optionsFilter", JSON.stringify(newOptionCondition));
  };
  setShowCustomersByReferralPhone = (isShowed) => {
    this.setState({
      showCustomersByReferralPhone: isShowed,
    });
  };
  setCustomerInfo = (cusInfo) => {
    this.setState({
      customerInfo: cusInfo,
    });
  };
  setPageReferralPhone = (page) => {
    this.setState({
      pageReferralPhone: page,
    });
  };
  showDialogImportExcel = () => {
    this.setOpenModalImport(true);
  };
  onChangeExcel = (evt) => {
    const { showError } = this.props;
    const { fields, isUpdatedPasswordImport } = this.state;

    var f = evt.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 2 });
      const xlsxFields = data[0];
      //Check Valid XLSX Field
      let isCheckedValidField = true;
      const lengthXlsxFields = Object.keys(xlsxFields).length;
      if (fields.length > lengthXlsxFields.length) isCheckedValidField = false;
      else {
        const arraysXlsxFields = Object.keys(xlsxFields);
        fields.forEach((element) => {
          if (!arraysXlsxFields.includes(element)) {
            isCheckedValidField = false;
            return;
          }
        });
      }
      if (!isCheckedValidField) {
        showError({
          type: Types.ALERT_UID_STATUS,
          alert: {
            type: "danger",
            title: "Lỗi",
            disable: "show",
            content: "Trường 'Tên khách hàng' và 'Số điện thoại' không hợp lệ!",
          },
        });
        return;
      }

      //Filter Data
      const newListCustomers = [];
      for (var item of data) {
        const newCustomer = {};
        newCustomer["name"] = item["Tên khách hàng"];
        newCustomer["phone_number"] = item["Số điện thoại"];
        newCustomer["address_detail"] = item["Địa chỉ chi tiết"];
        newCustomer["wards_name"] = item["Phường/Xã"];
        newCustomer["district_name"] = item["Quận/Huyện"];
        newCustomer["province_name"] = item["Tỉnh/TP"];
        newCustomer["date_of_birth"] = item["Ngày sinh"]
          ? moment(item["Ngày sinh"]).format("YYYY-MM-DD")
          : "";
        newCustomer["points"] = item["Xu hiện tại"] ? item["Xu hiện tại"] : "";
        newCustomer["official"] = item["Chính thức"] ? true : false;
        newCustomer["created_at"] = item["Ngày tạo"];
        newCustomer["updated_at"] = item["Ngày cập nhật"];
        newCustomer["debt"] = item["Nợ hiện tại"] ? item["Nợ hiện tại"] : "";
        newCustomer["total_final_all_status"] = item["Tổng bán"]
          ? item["Tổng bán"]
          : "";
        newCustomer["total_final_without_refund"] = item[
          "Tổng bán trừ trả hàng và hủy"
        ]
          ? item["Tổng bán trừ trả hàng và hủy"]
          : "";
        newCustomer["is_agency"] = item["Vai trò"] === "Đại lý";
        newCustomer["is_collaborator"] = item["Vai trò"] === "Cộng tác viên";
        if (item["Cấp đại lý"]) {
          newCustomer["agency_type_name"] = item["Cấp đại lý"];
        }
        newCustomer["sale_type"] =
          item["Vai trò"] === "Đại lý"
            ? 2
            : item["Vai trò"] === "Cộng tác viên"
            ? 1
            : 0;
        newListCustomers.push(newCustomer);
      }

      const { store_code } = this.props.match.params;
      const { importAllListCustomer } = this.props;

      if (newListCustomers.length > 800) {
        this.setOpenModalImport(false);
        confirmAlert({
          customUI: ({ onClose }) => {
            return (
              <div
                className="custom-ui"
                style={{
                  width: "400px",
                  padding: "30px",
                  textAlign: "left",
                  background: "#fff",
                  borderRadius: "10px",
                  boxShadow: "0 20px 75px rgba(0, 0, 0, 0.13)",
                  color: "#666",
                }}
              >
                <h3>Lưu ý</h3>
                <p>
                  Chỉ cho phép tối đa 250 khách hàng mỗi lần import, vui lòng
                  tách nhiều file Excel để thực hiện !
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    columnGap: "20px",
                  }}
                >
                  <button
                    onClick={() => {
                      onClose();
                    }}
                    className="btn btn-primary"
                  >
                    Đồng ý
                  </button>
                </div>
              </div>
            );
          },
          buttons: [
            {
              label: "Đồng ý",
              onClick: () => alert("Click Yes"),
            },
          ],
        });

        return;
      }

      const dataImport = {
        is_update_password: isUpdatedPasswordImport,
        password: "123456",
        list: newListCustomers,
      };
      importAllListCustomer(store_code, dataImport);
    };
    document.getElementById("file-excel-import-customer").value = null;
    reader.readAsBinaryString(f);
  };

  render() {
    var { customer, customers, customersSale } = this.props;

    var { store_code } = this.props.match.params;
    var {
      showChatBox,
      isShow,
      chat_allow,
      searchValue,
      paginate,
      openModal,
      modal,
      openModalEdit,
      showFilterSearch,
      showCustomersByReferralPhone,
      customerInfo,
      pageReferralPhone,
      openModalImport,
      level,
      status,
      role_customer,
      show_password,
      change_password,
      change_status_customer,
    } = this.state;
    const { wards, district, province, types } = this.props;
    if (this.props.auth) {
      return (
        <CustomerStyles id="wrapper">
          <Sidebar store_code={store_code} />
          <ModalCreate
            resetModal={this.resetModal}
            openModal={openModal}
            store_code={store_code}
            wards={wards}
            district={district}
            province={province}
            customers={this.isSale() ? customersSale : customers}
            setSearchValue={this.setSearchValue}
            isSale={this.isSale}
          />
          <ModalEdit
            openModalEdit={openModalEdit}
            resetModal={this.resetModalEdit}
            store_code={store_code}
            wards={wards}
            district={district}
            province={province}
            modal={modal}
          />
          <ModalUpdatePasswordImport
            openModal={openModalImport}
            setOpenModal={this.setOpenModalImport}
            setIsUpdatedPasswordImport={this.setIsUpdatedPasswordImport}
          ></ModalUpdatePasswordImport>
          <div className="col-10 col-10-wrapper">
            <div id="content-wrapper" className="d-flex flex-column">
              <div id="content">
                <Topbar store_code={store_code} />
                {typeof isShow == "undefined" ? (
                  <div style={{ height: "500px" }}></div>
                ) : isShow == true ? (
                  <div className="container-fluid">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <h4 className="h4 title_content mb-0 text-gray-800">
                        Danh sách khách hàng
                      </h4>{" "}
                      <div>
                        <button
                          style={{ margin: "auto 0px", marginRight: 15 }}
                          onClick={this.exportAllListOrder}
                          class={`btn btn-success btn-icon-split btn-sm `}
                        >
                          <span class="icon text-white-50">
                            <i class="fas fa-file-export"></i>
                          </span>
                          <span style={{ color: "white" }} class="text">
                            Export Excel
                          </span>
                        </button>
                        {!this.isSale() && (
                          <>
                            <button
                              style={{ marginRight: "10px" }}
                              onClick={this.showDialogImportExcel}
                              class={`btn btn-primary btn-icon-split btn-sm `}
                            >
                              <span class="icon text-white-50">
                                <i class="fas fa-file-import"></i>
                              </span>
                              <span style={{ color: "white" }} class="text">
                                Import Excel
                              </span>
                            </button>
                            <input
                              id="file-excel-import-customer"
                              type="file"
                              name="name"
                              hidden
                              onChange={this.onChangeExcel}
                            />
                          </>
                        )}

                        <a
                          data-toggle="modal"
                          data-target="#modalCreateCustomer"
                          class="btn btn-info btn-icon-split btn-sm"
                          style={{
                            height: "fit-content",
                            width: "fit-content",
                          }}
                        >
                          <span class="icon text-white-50">
                            <i class="fas fa-plus"></i>
                          </span>
                          <span
                            style={{
                              color: "white",
                            }}
                            class={`text `}
                          >
                            Thêm khách hàng
                          </span>
                        </a>
                      </div>
                    </div>

                    <br></br>
                    <div className="card shadow mb-4">
                      <div
                        className="card-header py-3"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <form onSubmit={this.searchData}>
                          <div
                            class="input-group mb-6"
                            style={{ marginTop: "10px" }}
                          >
                            <div class="input-group-append filter-search-customer">
                              {JSON.parse(localStorage.getItem("optionsFilter"))
                                ?.length > 0 && (
                                <span className="filter-search-customer-count">
                                  {`(${
                                    JSON.parse(
                                      localStorage.getItem("optionsFilter")
                                    ).length
                                  })`}
                                </span>
                              )}
                              <span>Lọc khách hàng</span>
                              <span>
                                <i class="fa fa-sort-down"></i>
                              </span>
                              <div className="filter-search-customer-dropdown">
                                <p>Hiển thị khách hàng theo:</p>
                                {this.handleShowTypeCondition()}
                                <div className="filter-search-customer-dropdown-btnFilter">
                                  <div
                                    className="btn-primary btn"
                                    onClick={() =>
                                      this.setShowFilterSearch(
                                        !this.state.showFilterSearch
                                      )
                                    }
                                  >
                                    Bộ lọc
                                  </div>
                                </div>
                              </div>
                            </div>
                            <input
                              style={{ maxWidth: "250px" }}
                              type="search"
                              name="txtSearch"
                              value={searchValue}
                              onChange={this.onChangeSearch}
                              class="form-control"
                              placeholder="Tìm khách hàng"
                            />
                            <div class="input-group-append">
                              <button
                                class="btn btn-primary"
                                type="submit"
                                style={{
                                  borderTopRightRadius: "0.375rem",
                                  borderBottomRightRadius: "0.375rem",
                                }}
                              >
                                <i class="fa fa-search"></i>
                              </button>
                            </div>
                            <div
                              className="btn-filter-search btn-primary"
                              onClick={() =>
                                this.setShowFilterSearch(
                                  !this.state.showFilterSearch
                                )
                              }
                            >
                              Bộ lọc
                            </div>
                          </div>
                        </form>
                        <div
                          style={{
                            display: "flex",
                            columnGap: "20px",
                            alignItems: "center",
                            justifyContent: "flex-end",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              columnGap: "20px",
                              alignItems: "center",
                              marginTop: "10px",
                            }}
                          >
                            <div>Vai trò:</div>
                            <select
                              name=""
                              id="input"
                              class="form-control"
                              value={role_customer}
                              onChange={this.onChangeRole}
                              style={{
                                width: "auto",
                              }}
                            >
                              <option value={Types.CUSTOMER_ROLE_ALL}>
                                Tất cả
                              </option>
                              <option value={Types.CUSTOMER_ROLE_NORMAL}>
                                Khách hàng
                              </option>
                              <option value={Types.CUSTOMER_ROLE_CTV}>
                                Cộng tác viên
                              </option>
                              <option value={Types.CUSTOMER_ROLE_AGENCY}>
                                Đại lý
                              </option>
                            </select>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              columnGap: "20px",
                              alignItems: "center",
                              marginTop: "10px",
                            }}
                          >
                            <div>Trạng thái:</div>
                            <select
                              name=""
                              id="input"
                              class="form-control"
                              value={status}
                              onChange={this.onChangeStatus}
                              style={{
                                width: "auto",
                              }}
                            >
                              <option value="">Tất cả</option>
                              <option
                                value={Types.CUSTOMER_STATUS_WATING_REVIEW}
                              >
                                Chờ duyệt
                              </option>
                              <option value={Types.CUSTOMER_STATUS_CANCEL}>
                                Hủy
                              </option>
                              <option value={Types.CUSTOMER_STATUS_APPROVE}>
                                Kích hoạt
                              </option>
                              <option value={Types.CUSTOMER_STATUS_BLOCK}>
                                Block
                              </option>
                            </select>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              columnGap: "20px",
                              alignItems: "center",
                              marginTop: "10px",
                            }}
                          >
                            <div>Gói:</div>
                            <select
                              name=""
                              id="input"
                              class="form-control"
                              value={level}
                              onChange={this.onChangeLevel}
                              style={{
                                width: "auto",
                                marginRight: "20px",
                              }}
                            >
                              {<option value="">Tất cả</option>}{" "}
                              {this.props.packageProduct?.map((data, index) => {
                                return (
                                  <option value={data.level} key={index}>
                                    {data.level}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="card-body">
                        <Table
                          handleSetInfor={this.handleSetInfor}
                          paginate={paginate}
                          searchValue={searchValue}
                          level={level}
                          status={status}
                          role_customer={role_customer}
                          show_password={show_password}
                          change_password={change_password}
                          change_status_customer={change_status_customer}
                          currentParams={this.state.currentParams}
                          chat_allow={chat_allow}
                          showChatBox={showChatBox}
                          handleShowChatBox={this.handleShowChatBox}
                          store_code={store_code}
                          handleDelCallBack={this.handleDelCallBack}
                          customers={this.isSale() ? customersSale : customers}
                          setCustomerInfo={this.setCustomerInfo}
                          setShowCustomersByReferralPhone={
                            this.setShowCustomersByReferralPhone
                          }
                          isSale={this.isSale}
                          fetchAllCustomer={this.fetchAllCustomer}
                          fetchListCustomerOfSale={this.fetchListCustomerOfSale}
                        />

                        <Pagination
                          getPaginate={this.getPaginate}
                          store_code={store_code}
                          searchValue={searchValue}
                          level={level}
                          status={status}
                          role_customer={role_customer}
                          isSale={this.isSale}
                          customers={this.isSale() ? customersSale : customers}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <NotAccess />
                )}
              </div>

              <Footer />
            </div>
            {/* <Chat customerImg = {customerImg} customerId = {customerId} chat = {chat} store_code = {store_code}/> */}
          </div>
          <SidebarShowCustomersByReferralPhone
            showCustomersByReferralPhone={showCustomersByReferralPhone}
            setShowCustomersByReferralPhone={
              this.setShowCustomersByReferralPhone
            }
            customerInfo={customerInfo}
            store_code={store_code}
            fetchAllCustomerByInferralPhone={
              this.props.fetchAllCustomerByInferralPhone
            }
            pageReferralPhone={pageReferralPhone}
          >
            {this.props.customersByInferralPhone?.data?.length > 0 && (
              <div className="card-body">
                <Table
                  handleSetInfor={this.handleSetInfor}
                  paginate={paginate}
                  searchValue={searchValue}
                  currentParams={this.state.currentParams}
                  chat_allow={chat_allow}
                  showChatBox={showChatBox}
                  handleShowChatBox={this.handleShowChatBox}
                  store_code={store_code}
                  handleDelCallBack={this.handleDelCallBack}
                  customers={this.props.customersByInferralPhone}
                  setCustomerInfo={this.setCustomerInfo}
                  setShowCustomersByReferralPhone={
                    this.setShowCustomersByReferralPhone
                  }
                  isSale={this.isSale}
                />
                <div className="totalContent">
                  <div className="totalCustomers">
                    Hiển thị 1{" "}
                    {this.props.customersByInferralPhone.data.length > 1
                      ? `đến ${this.props.customersByInferralPhone.data.length}`
                      : null}{" "}
                    trong số {this.props.customersByInferralPhone.total} khách
                    hàng
                  </div>
                  <Pagination
                    setPageReferralPhone={this.setPageReferralPhone}
                    store_code={store_code}
                    customers={this.props.customersByInferralPhone}
                  />
                </div>
              </div>
            )}
          </SidebarShowCustomersByReferralPhone>
          <SidebarFilterCustomer
            showFilterSearch={showFilterSearch}
            setShowFilterSearch={this.setShowFilterSearch}
            types={types}
            province={province}
            searchValue={searchValue}
            store_code={store_code}
            fetchAllCustomer={this.fetchAllCustomer}
            fetchListCustomerOfSale={this.fetchListCustomerOfSale}
            isSale={this.isSale}
          ></SidebarFilterCustomer>
        </CustomerStyles>
      );
    } else if (this.props.auth === false) {
      return <Redirect to="/login" />;
    } else {
      return <Loading />;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    customers: state.customerReducers.customer.allCustomer,
    customersByInferralPhone:
      state.customerReducers.customer.allCustomerByInferralPhone,
    customersSale: state.saleReducers.sale.allCustomerOfSale,
    auth: state.authReducers.login.authentication,
    customer: state.customerReducers.customer.customerID,
    chat: state.chatReducers.chat.chatID,
    permission: state.authReducers.permission.data,
    wards: state.placeReducers.wards,
    province: state.placeReducers.province,
    district: state.placeReducers.district,
    types: state.agencyReducers.agency.allAgencyType,
    addedCustomerOfSaleSuccessfully:
      state.saleReducers.sale.addedCustomerOfSaleSuccessfully,
    packageProduct: state.packageProductReducers.package_product.packageProduct,
  };
};
const mapDispatchToProps = (dispatch, props) => {
  return {
    fetchAllCustomer: (id, page, params) => {
      dispatch(customerAction.fetchAllCustomer(id, page, params));
    },
    exportAllListCustomer: (store_code, params, isSale) => {
      dispatch(
        customerAction.exportAllListCustomer(store_code, params, isSale)
      );
    },
    importAllListCustomer: (store_code, data) => {
      dispatch(customerAction.importAllListCustomer(store_code, data));
    },
    fetchAllCustomerByInferralPhone: (
      store_code,
      page,
      params,
      referral_phone_number
    ) => {
      dispatch(
        customerAction.fetchAllCustomerByInferralPhone(
          store_code,
          page,
          params,
          referral_phone_number
        )
      );
    },
    fetchCustomerId: (store_code, customerId) => {
      dispatch(customerAction.fetchCustomerId(store_code, customerId));
    },
    fetchChatId: (store_code, customerId) => {
      dispatch(customerAction.fetchChatId(store_code, customerId));
    },
    fetchPlaceProvince: () => {
      dispatch(placeAction.fetchPlaceProvince());
    },
    fetchAllAgencyType: (store_code) => {
      dispatch(AgencyAction.fetchAllAgencyType(store_code));
    },
    showError: (error) => {
      dispatch(error);
    },
    fetchListCustomerOfSale: (store_code, page, queryString) => {
      dispatch(
        saleAction.fetchListCustomerOfSale(store_code, page, queryString)
      );
    },
    resetAddedCustomerOfSaleSuccessfully: () => {
      dispatch({
        type: Types.ADD_CUSTOMER_OF_SALE,
        data: false,
      });
    },
    fetchPackageProduct: (store_code) => {
      dispatch(packageProductAction.fetchPackageProduct(store_code));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Customer);
