import React, { Component } from "react";
import { connect } from "react-redux";
import * as accumulatePointAction from "../../../actions/accumulate_point";
import { insertParam } from "../../../ultis/helpers";
class Pagination extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
    };
  }

  passPagination = (page) => {
    var { searchValue, numPage, getParams, setPage, status } = this.props;
    insertParam({ page: page });
    setPage(page);
    this.props.fetchRequestBonusPoint(
      this.props.store_code,
      page,
      getParams(searchValue, numPage, status)
    );
  };

  showData = (links) => {
    var result = null;
    if (typeof links == "undefined") {
      return result;
    }
    if (links.length > 0) {
      result = links.map((data, index) => {
        var active = data.active == true ? "active" : null;
        var label =
          data.label.includes("&laquo; ") || data.label.includes(" &raquo;")
            ? data.label
                .replace("&laquo; Previous", "Trước")
                .replace("Next &raquo;", "Sau")
            : data.label;
        if (data.url == null) {
          return (
            <li class={`page-item ${active} `}>
              <a class="page-link">{label}</a>
            </li>
          );
        } else {
          return (
            <li class={`page-item ${active} `}>
              <a
                onClick={() => this.passPagination(data.url.split("?page=")[1])}
                class="page-link"
              >
                {label}
              </a>
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
        <ul class="pagination  tab-pagination pg-blue">
          {this.showData(this.props.allRequestBonusPoint.links)}
        </ul>
      </nav>
    );
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    fetchRequestBonusPoint: (store_code, page, params) => {
      dispatch(
        accumulatePointAction.fetchRequestBonusPoint(store_code, page, params)
      );
    },
  };
};
export default connect(null, mapDispatchToProps)(Pagination);
