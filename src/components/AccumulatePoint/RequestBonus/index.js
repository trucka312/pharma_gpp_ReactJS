import React, { Component } from "react";
import { connect } from "react-redux";
import Table from "./Table";
import Pagination from "./Pagination";
import { getQueryParams, insertParam } from "../../../ultis/helpers";
import * as accumulateAction from "../../../actions/accumulate_point";
import * as Types from "../../../constants/ActionType";
import ModalCreate from "./ModalCreate";
import ModalUpdate from "./ModalUpdate";
import ModalRemove from "./ModalRemove";

class RequestBonus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showChatBox: "hide",
      page: getQueryParams("page") || 1,
      searchValue: getQueryParams("search") || "",
      numPage: getQueryParams("limit") || 20,
      status: getQueryParams("status") || "",
      modalupdate: {
        id: "",
        name: "",
        point: "",
        image: "",
      },
      modalremove: {},
    };
  }

  componentDidMount() {
    const { page, searchValue, numPage, status } = this.state;
    const params = this.getParams(searchValue, numPage, status);

    this.props.fetchRequestBonusPoint(this.props.store_code, page, params);
  }

  getParams = (searchValue, limit = 20, status = "") => {
    var params = ``;

    if (searchValue != "" && searchValue != null) {
      params = params + `&search=${searchValue}`;
    }
    if (status != "" && status != null) {
      params = params + `&status=${status}`;
    }
    params += `&limit=${limit}`;

    return params;
  };
  setPage = (page) => {
    this.setState({ page });
  };
  searchData = (e) => {
    e.preventDefault();
    var { searchValue, numPage, status } = this.state;
    var params = this.getParams(searchValue, numPage, status);
    this.setPage(1);
    insertParam({ search: searchValue });
    const page = getQueryParams("page");
    if (page) {
      insertParam({ page: 1 });
    }
    this.props.fetchRequestBonusPoint(this.props.store_code, 1, params);
  };
  onChangeNumPage = (e) => {
    const { store_code, fetchRequestBonusPoint } = this.props;
    var { searchValue, status } = this.state;
    const numPage = e.target.value;
    this.setState({
      numPage,
      page: 1,
    });
    var params = this.getParams(searchValue, numPage, status);
    insertParam({ page: 1, limit: numPage });
    fetchRequestBonusPoint(store_code, 1, params);
  };

  onChangeSearch = (e) => {
    this.setState({ searchValue: e.target.value });
  };
  onChangeStatus = (e) => {
    const { searchValue, numPage } = this.state;
    const status = e.target.value;
    var params = this.getParams(searchValue, numPage, status);
    this.setState({
      status,
      page: 1,
    });
    insertParam({ status });
    const page = getQueryParams("page");
    if (page) {
      insertParam({ page: 1 });
    }
    this.props.fetchRequestBonusPoint(this.props.store_code, 1, params);
  };

  handleShowModal = (modal) => {
    this.setState({
      modalupdate: modal,
    });
  };
  handleCloseModal = () => {
    this.setState({
      modalupdate: {
        id: "",
        name: "",
        point: "",
        image: "",
      },
    });
  };
  handleFetchData = () => {
    var { fetchRequestBonusPoint, store_code } = this.props;
    const { searchValue, numPage, page } = this.state;
    var params = this.getParams(searchValue, numPage);
    fetchRequestBonusPoint(store_code, page, params);
  };

  render() {
    var { allRequestBonusPoint, store_code, tabId } = this.props;

    var { searchValue, page, numPage, status } = this.state;

    return (
      <div id="">
        <div class="row" style={{ "justify-content": "flex-end" }}>
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
                marginRight: "20px",
              }}
            >
              <option value="">Tất cả</option>
              <option value={Types.STATUS_BONUS_POINT_PROCESSING}>
                Chờ duyệt
              </option>
              <option value={Types.STATUS_BONUS_POINT_CANCEL}>Hủy</option>
              <option value={Types.STATUS_BONUS_POINT_APPROVED}>
                Đã duyệt
              </option>
            </select>
          </div>
        </div>
        <div className="card-body">
          <Table
            tabId={tabId}
            store_code={store_code}
            allRequestBonusPoint={allRequestBonusPoint}
            getParams={this.getParams}
            page={page}
            searchValue={searchValue}
            numPage={numPage}
            handleShowModal={this.handleShowModal}
          />
          <div style={{ display: "flex", justifyContent: "end" }}>
            <div style={{ display: "flex" }}>
              <span
                style={{
                  margin: "20px 10px auto auto",
                }}
              >
                Hiển thị
              </span>
              <select
                style={{
                  margin: "auto",
                  marginTop: "10px",
                  marginRight: "20px",
                  width: "80px",
                }}
                onChange={this.onChangeNumPage}
                value={numPage}
                name="numPage"
                class="form-control"
              >
                <option value="20" selected>
                  20
                </option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="200">200</option>
              </select>
            </div>
            <Pagination
              searchValue={searchValue}
              numPage={numPage}
              status={status}
              getParams={this.getParams}
              store_code={store_code}
              allRequestBonusPoint={allRequestBonusPoint}
              setPage={this.setPage}
            />
          </div>
        </div>
        <ModalCreate store_code={store_code} />
        <ModalRemove
          modal={this.state.modalupdate}
          store_code={store_code}
          closeModal={this.handleCloseModal}
          handleFetchData={this.handleFetchData}
        />
        <ModalUpdate
          modal={this.state.modalupdate}
          closeModal={this.handleCloseModal}
          store_code={store_code}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.authReducers.login.authentication,
    allRequestBonusPoint:
      state.accumulatePointReducers.accumulate_point.allRequestBonusPoint,
  };
};
const mapDispatchToProps = (dispatch, props) => {
  return {
    fetchRequestBonusPoint: (store_code, page, params) => {
      dispatch(
        accumulateAction.fetchRequestBonusPoint(store_code, page, params)
      );
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(RequestBonus);
