import React, { Component } from "react";
import { connect } from "react-redux";
import Alert from "../../components/Partials/Alert";
import Footer from "../../components/Partials/Footer";
import Sidebar from "../../components/Partials/Sidebar";
import Topbar from "../../components/Partials/Topbar";
import * as Types from "../../constants/ActionType";
import * as inventoryAction from "../../actions/inventory";
import { Link } from "react-router-dom";
import Pagination from "../../components/Inventory/Pagination";
import moment from "moment";
import history from "../../history";
import General from "../../components/Product/General";
import NotAccess from "../../components/Partials/NotAccess";
import { getQueryParams } from "../../ultis/helpers";

import * as productAction from "../../actions/product";

class Inventory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      searchValue: "",
      filterStatus: getQueryParams("status") || null,
    };
  }
  componentDidMount() {
    const { store_code } = this.props.match.params;
    const branch_id = localStorage.getItem("branch_id");
    // var { filterStatus } = this.state;
    // var params = "";
    // if (filterStatus) params = params + `&status=${filterStatus}`;

    const page = getQueryParams("page") || 1;
    const search = getQueryParams("search") || "";

    const params = `&search=${search}`;
    this.setState({
      page: page,
      searchValue: search,
    });
    this.props.fetchAllInventory(store_code, branch_id, page, params);
  }
  onChangeSearch = (e) => {
    this.setState({ searchValue: e.target.value });
  };

  setPage = (page) => {
    this.setState({ page });
  };
  searchData = (e) => {
    e.preventDefault();
    const { store_code } = this.props.match.params;
    const branch_id = localStorage.getItem("branch_id");
    this.setState({
      page: 1,
    });
    const value = this.state.searchValue;
    history.push(`/inventory/index/${store_code}?page=1&search=${value}`);
    const params = `&search=${value}`;
    this.props.fetchAllInventory(store_code, branch_id, 1, params);
  };
  changePage = (store_code, order_code) => {
    const { page, searchValue } = this.state;
    history.push(
      `/inventory/detail/${store_code}/${order_code}?page=${page}&search=${searchValue}`
    );
  };

  componentWillReceiveProps(nextProps, nextState) {
    // if (this.state.paramDate != this.getParamDate() && this.state.paramDate.from != null) {
    //   this.setState({
    //     paramDate: this.getParamDate()
    //   })

    //   var { store_code } = this.props.match.params;
    //   const branch_id = getBranchId()
    //   var params_agency =
    //   this.state.agency_by_customer_id != null
    //     ? `&agency_by_customer_id=${this.state.agency_by_customer_id}`
    //     : null;
    //   this.props.fetchAllBill(store_code, 1, branch_id, this.getParamDate(), params_agency);
    // }

    if (
      this.state.isLoading != true &&
      typeof nextProps.permission.inventory_tally_sheet != "undefined"
    ) {
      var permissions = nextProps.permission;
      var isShow = permissions.inventory_tally_sheet;

      this.setState({ isLoading: true, isShow });
    }
  }
  showData = (listInventory, store_code) => {
    const { sheetsInventory } = this.props;
    var result = null;
    if (listInventory) {
      result = listInventory.map((item, index) => {
        var time = moment(item.created_at, "YYYY-MM-DD HH:mm:ss").format(
          "DD-MM-YYYY"
        );
        return (
          <tr
            className="hover-product"
            onClick={() => this.changePage(store_code, item.id)}
          >
            <td>{(sheetsInventory.current_page - 1) * 20 + index + 1}</td>
            <td>{item.code}</td>
            <td>{time}</td>
            <td>{item.reality_exist}</td>
            <td>{item.existing_branch}</td>
            <td>{item.deviant}</td>
            <td>
              {item.status === 0 ? (
                <div style={{ color: "green" }}>đã kiểm kho</div>
              ) : (
                <div style={{ color: "#ff6a00" }}>đã cân bằng</div>
              )}
            </td>
          </tr>
        );
      });
    } else {
      return result;
    }
    return result;
  };
  render() {
    const { store_code } = this.props.match.params;
    const { sheetsInventory, badges } = this.props;
    const { searchValue, isShow } = this.state;
    return (
      <div id="wrapper">
        <Sidebar store_code={store_code} />
        <div className="col-10 col-10-wrapper">
          <div id="content-wrapper" className="d-flex flex-column">
            <div id="content">
              <Topbar store_code={store_code} />
              {typeof isShow == "undefined" ? (
                <div style={{ height: "500px" }}></div>
              ) : isShow == true ? (
                <div className="container-fluid">
                  <Alert
                    type={Types.ALERT_UID_STATUS}
                    alert={this.props.alert}
                  />
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <h4 className="title_content text-primary">
                      Phiếu kiểm kho
                    </h4>

                    <Link to={`/inventory/create/${store_code}`}>
                      <div class="btn btn-info btn-icon-split btn-sm show">
                        <span class="icon text-white-50">
                          <i class="fas fa-plus"></i>
                        </span>
                        <span class="text ">Tạo phiếu kiểm kho</span>
                      </div>
                    </Link>
                  </div>

                  <br></br>
                  <div className="card">
                    <div
                      className="card-header py-3"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <form onSubmit={this.searchData}>
                        <div
                          class="input-group mb-6"
                          style={{ marginTop: "10px" }}
                        >
                          <input
                            style={{ maxWidth: "400px" }}
                            type="search"
                            name="txtSearch"
                            value={searchValue}
                            onChange={this.onChangeSearch}
                            class="form-control"
                            placeholder="Nhập mã phiếu"
                          />
                          <div class="input-group-append">
                            <button class="btn btn-primary" type="submit">
                              <i class="fa fa-search"></i>
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                    <div className="card-body">
                      <div class="table-responsive">
                        <table
                          class="table  "
                          id="dataTable"
                          width="100%"
                          cellspacing="0"
                        >
                          <thead>
                            <tr>
                              <th>STT</th>
                              <th>Mã phiếu</th>
                              <th>Thời gian</th>
                              <th>Tồn thực tế</th>
                              <th>Tồn chi nhánh</th>
                              <th>Chênh lệch</th>
                              <th>Trạng thái</th>
                            </tr>
                          </thead>

                          <tbody>
                            {this.showData(sheetsInventory?.data, store_code)}
                          </tbody>
                        </table>
                      </div>
                      <Pagination
                        setPage={this.setPage}
                        searchValue={searchValue}
                        store_code={store_code}
                        sheetsInventory={sheetsInventory}
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
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    sheetsInventory: state.inventoryReducers.inventory_reducer.sheetsInventory,
    badges: state.badgeReducers.allBadge,
    products: state.productReducers.product.allProduct,
    permission: state.authReducers.permission.data,
  };
};
const mapDispatchToProps = (dispatch, props) => {
  return {
    fetchAllInventory: (store_code, branch_id, page, pagram) => {
      dispatch(
        inventoryAction.fetchAllInventory(store_code, branch_id, page, pagram)
      );
    },
    fetchAllProductV2: (store_code, branch_id, page, params) => {
      dispatch(
        productAction.fetchAllProductV2(store_code, branch_id, page, params)
      );
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Inventory);
