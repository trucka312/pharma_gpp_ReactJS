import React, { Component } from "react";
import { connect } from "react-redux";
import Table from "./Table";
import Pagination from "./Pagination";
import { getQueryParams, insertParam } from "../../../ultis/helpers";
import * as accumulateAction from "../../../actions/accumulate_point";
import ModalCreate from "./ModalCreate";
import ModalUpdate from "./ModalUpdate";
import ModalRemove from "./ModalRemove";

class Config extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showChatBox: "hide",
      page: getQueryParams("page") || 1,
      searchValue: getQueryParams("search") || "",
      numPage: getQueryParams("limit") || 20,
      modalupdate: {
        id: "",
        name: "",
        point: "",
        image: "",
        video: "",
        note: "",
      },
      modalremove: {},
    };
  }

  componentDidMount() {
    const { page, searchValue, numPage } = this.state;
    const params = this.getParams(searchValue, numPage);

    this.props.fetchAccumulatePoint(this.props.store_code, page, params);
  }

  getParams = (searchValue, limit = 20) => {
    var params = ``;

    if (searchValue != "" && searchValue != null) {
      params = params + `&search=${searchValue}`;
    }
    params += `&limit=${limit}`;

    return params;
  };
  setPage = (page) => {
    this.setState({ page });
  };
  searchData = (e) => {
    e.preventDefault();
    var { searchValue, numPage } = this.state;
    var params = this.getParams(searchValue, numPage);
    this.setPage(1);
    insertParam({ search: searchValue });
    const page = getQueryParams("page");
    if (page) {
      insertParam({ page: 1 });
    }
    this.props.fetchAccumulatePoint(this.props.store_code, 1, params);
  };
  onChangeNumPage = (e) => {
    const { store_code, fetchAccumulatePoint } = this.props;
    var { searchValue } = this.state;
    const numPage = e.target.value;
    this.setState({
      numPage,
      page: 1,
    });
    var params = this.getParams(searchValue, numPage);
    insertParam({ page: 1, limit: numPage });
    fetchAccumulatePoint(store_code, 1, params);
  };

  onChangeSearch = (e) => {
    this.setState({ searchValue: e.target.value });
  };

  handleShowModal = (modal) => {
    console.log("🚀 ~ file: index.js:81 ~ Config ~ modal:", modal);
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
        video: "",
        note: "",
      },
    });
  };
  handleFetchData = () => {
    var { fetchAccumulatePoint, store_code } = this.props;
    const { searchValue, numPage, page } = this.state;
    var params = this.getParams(searchValue, numPage);
    fetchAccumulatePoint(store_code, page, params);
  };

  render() {
    var { allAccumulatePoint, store_code, tabId } = this.props;

    var { searchValue, page, numPage } = this.state;

    return (
      <div id="">
        <div class="row" style={{ "justify-content": "space-between" }}>
          <form onSubmit={this.searchData}>
            <div class="input-group mb-6" style={{ padding: "7px 20px" }}>
              <input
                style={{ maxWidth: "400px", minWidth: "300px" }}
                type="search"
                name="txtSearch"
                value={searchValue}
                onChange={this.onChangeSearch}
                class="form-control"
                placeholder="Tìm kiếm phần thưởng"
              />
              <div class="input-group-append">
                <button class="btn btn-primary" type="submit">
                  <i class="fa fa-search"></i>
                </button>
              </div>
            </div>
          </form>
          <div>
            <button
              className="btn btn-info btn-icon-split show"
              data-toggle="modal"
              data-target="#createAcculatePointModal"
            >
              <span
                className="text-white-50"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0.375rem 0 0.375rem 0.75rem",
                }}
              >
                <i className="fas fa-plus"></i>
              </span>
              <span className="text">Thêm phần thưởng</span>
            </button>
          </div>
        </div>
        <div className="card-body">
          <Table
            tabId={tabId}
            store_code={store_code}
            allAccumulatePoint={allAccumulatePoint}
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
              getParams={this.getParams}
              store_code={store_code}
              allAccumulatePoint={allAccumulatePoint}
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
    allAccumulatePoint:
      state.accumulatePointReducers.accumulate_point.allAccumulatePoint,
  };
};
const mapDispatchToProps = (dispatch, props) => {
  return {
    fetchAccumulatePoint: (store_code, page, params) => {
      dispatch(accumulateAction.fetchAccumulatePoint(store_code, page, params));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Config);
