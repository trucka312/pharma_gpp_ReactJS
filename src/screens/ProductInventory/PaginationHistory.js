import React, { Component } from "react";
import { connect } from "react-redux";
import getChanel from "../../ultis/channel"
import { getBranchId } from '../../ultis/branchUtils';


import * as inventoryAction from '../../actions/inventory'
class Pagination extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1
        }
    }

    fetchAllDiscountEnd = (page) => {
        console.log(page)
        var { store_code, formData } = this.props
        console.log(formData)
        const branch_id = getBranchId()

        this.props.historyInventorys(store_code, branch_id, formData , page)
    }



    showData = (links) => {
        var result = null;
        var url = null
        if (typeof links == "undefined") {
            return result
        }
        if (links.length > 0) {
            result = links.map((data, index) => {
                var active = data.active == true ? "active" : null;
                var label = (data.label.includes("&laquo; ") || data.label.includes(" &raquo;"))
                    ? data.label.replace("&laquo; Previous", "Trước").replace("Next &raquo;", "Sau")
                    : data.label
                if (data.url == null) {
                    return (
                        <li class={`page-item ${active} `}><a class="page-link">{label}</a></li>
                    );
                }
                else {

                    return (
                        <li class={`page-item ${active} `}><a onClick={() => this.fetchAllDiscountEnd(data.url.split('?page=')[1])} class="page-link">{label}</a></li>
                    );
                }

            });
        } else {
            return result;
        }
        return result;
    };

    render() {
        var { display, historyInventory } = this.props
        var links = typeof historyInventory.links !== "undefined" ? historyInventory.links : []
        return (


            <nav aria-label="Page navigation" className={`float-pagination ${display} ${getChanel()}`}>
                <ul class="pagination  tab-pagination pg-blue">
                    {this.showData(links)}
                </ul>
            </nav>


        );
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        historyInventorys: (store_code, branch_id, data , page) => {
            dispatch(inventoryAction.historyInventorys(store_code, branch_id, data,page))
        },
    };
};
export default connect(null, mapDispatchToProps)(Pagination);