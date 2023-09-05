import React, { Component } from "react";
import { connect } from "react-redux";
import * as reportAction from "../../../actions/report";
class Pagination extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
    };
  }

  // re call apis get all data hể
  passPagination = (page) => {
    const { txtStart, txtEnd, searchValue, perPage } = this.props;
    const params = `page=${page}${searchValue ? `&search=${searchValue}` : ''}${txtStart ? `&date_from=${txtStart}` : ''}${txtEnd ? `&date_to=${txtEnd}` : ''}${perPage ? `&limit=${perPage}` : ''}`;
    this.props.fetchAllReportImportSell(
      this.props.store_code,
      params
    );
  };

  showData = (links) => {
    var result = null;
    if (typeof links == "undefined") {
      return result;
    }
    if (links.length > 0) {
      result = links.map((data, index) => {
        var active = data.active === true ? "active" : null;
        var label =
          data.label.includes("&laquo; ") || data.label.includes(" &raquo;")
            ? data.label
                .replace("&laquo; Previous", "Trước")
                .replace("Next &raquo;", "Sau")
            : data.label;
        if (data.url == null) {
          return (
            <li class={`page-item ${active} `}>
              <p class="page-link">{label}</p>
            </li>
          );
        } else {
          return (
            <li class={`page-item ${active} `} style={{color: 'black'}}>
              <p
                onClick={() => this.passPagination(data.url.split("?page=")[1])}
                class="page-link"
              >
                {label}
              </p>
            </li>
          );
        }
      });
    } else {
      return result;
    }
    return result;
  };

  render() {
    return (
      <nav aria-label="Page navigation" className="float-pagination">
        <ul class="pagination  tab-pagination pg-#0b0b0b">
          {this.showData(this.props.reportInventory.links)}
        </ul>
      </nav>
    );
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    fetchAllReportImportSell: (store_code, params) => {
      dispatch(
        reportAction.fetchReportImportSell(
          store_code,
          params
        )
      );
    },
  };
};
export default connect(null, mapDispatchToProps)(Pagination);
