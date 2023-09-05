import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import getChannel, { BENITH } from "../../ultis/channel";
import { filter_arr, format } from "../../ultis/helpers";
import { shallowEqual } from "../../ultis/shallowEqual";
import EditStock from "./EditStock";
import ShowData from "./ShowData";
import * as productAction from "../../actions/product";
import { getBranchId, getBranchIds } from "../../ultis/branchUtils";
class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      modalElement: {
        element: "",
        idProduct: "",
      },
      modalSub: {
        SubElement: "",
        idProduct: "",
        NameElement: "",
        NameDistribute: "",
      },
      modalProduct: "",
      formData: "",
      passFormdata: {},
    };
  }

  passDataModal = (event, store_code, id, name) => {
    this.props.handleDelCallBack({
      table: "Sản phẩm",
      id: id,
      store_code: store_code,
      name: name,
    });
    event.preventDefault();
  };

  editStockCallBack = (form) => {
    this.setState({ formData: form });
  };

  handleCallBackElement = (modalElement) => {
    this.setState({ modalElement: modalElement });
  };
  handleCallBackSubElement = (modalSub) => {
    console.log("modalSub", modalSub);
    this.setState({ modalSub: modalSub });
  };
  handleCallBackProduct = (data) => {
    this.setState({ modalProduct: data });
  };

  checkSelected = (id) => {
    var selected = [...this.state.selected];
    if (selected.length > 0) {
      for (const item of selected) {
        if (item == id) {
          return true;
        }
      }
      return false;
    } else {
      return false;
    }
  };
  componentWillReceiveProps(nextProps) {
    if (
      !shallowEqual(nextProps.listProductSelect, this.props.listProductSelect)
    ) {
      this.setState({ selected: [] });
    }
  }

  passFormData = (data) => {
    this.setState({ passFormdata: data });
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (!shallowEqual(nextState.formData, this.state.formData)) {
      const data = nextState.formData;
      const branch_id = getBranchId();
      const branch_ids = getBranchIds();
      const branchIds = branch_ids ? branch_ids : branch_id;
      const { store_code, listType } = this.props;
      // var params = this.props.getParams(listType)

      this.props.editStock(store_code, branchIds, data, 1, this.props.params);
    }
    return true;
  }
  onChangeSelected = (e, id) => {
    var { checked } = e.target;
    var selected = [...this.state.selected];
    if (checked == true) {
      selected.push(id);
    } else {
      for (const [index, item] of selected.entries()) {
        if (item == id) {
          selected.splice(index, 1);
        }
      }
    }
    this.setState({ selected });
  };
  handleMultiDelCallBack = (e, data) => {
    var { store_code } = this.props;
    this.props.handleMultiDelCallBack({
      table: "Sản phẩm",
      data: data,
      store_code: store_code,
    });
    e.preventDefault();
  };
  showData = (products, per_page, current_page) => {
    var result = null;
    var { store_code, page } = this.props;
    if (typeof products === "undefined") {
      return result;
    }
    if (products.length > 0) {
      var { _delete, update, insert } = this.props;
      result = products.map((data, index) => {
        var status_name = data.status == 0 ? "Hiển thị" : "Đã ẩn";
        var status_stock =
          data.quantity_in_stock_with_distribute == 0
            ? -2
            : data.quantity_in_stock_with_distribute == -1
            ? -1
            : data.quantity_in_stock_with_distribute;

        if (status_stock == null) {
          status_stock = -1;
        }

        var status =
          data.status == 0
            ? "success"
            : data.status == -1
            ? "secondary"
            : data.status == 2
            ? "danger"
            : null;
        var discount =
          typeof data.product_discount == "undefined" ||
          data.product_discount == null
            ? 0
            : data.product_discount.discount_price;
        var checked = this.checkSelected(data.id);

        var min_price = data.min_price;
        var max_price = data.max_price;
        var product_discount = data.product_discount;

        return (
          <ShowData
            formData={this.state.passFormdata}
            passFormData={this.passFormData}
            _delete={_delete}
            passDataModal={this.passDataModal}
            min_price={min_price}
            max_price={max_price}
            product_discount={product_discount}
            update={update}
            insert={insert}
            checked={checked}
            page={page}
            status={status}
            status_name={status_name}
            status_stock={status_stock}
            data={data}
            per_page={per_page}
            current_page={current_page}
            index={index}
            store_code={store_code}
            discount={discount}
            handleCallBackElement={this.handleCallBackElement}
            handleCallBackSubElement={this.handleCallBackSubElement}
            handleCallBackProduct={this.handleCallBackProduct}
          />
        );
      });
    } else {
      return result;
    }
    return result;
  };
  onChangeSelectAll = (e) => {
    var checked = e.target.checked;
    var { products, listProductSelect } = this.props;
    var _selected = [...this.state.selected];

    var listProduct = filter_arr(listProductSelect);

    if (listProduct.length > 0) {
      if (checked == false) {
        this.setState({ selected: [] });
      } else {
        _selected = [];
        listProduct.forEach((product) => {
          _selected.push(product.id);
        });
        this.setState({ selected: _selected });
      }
    }
  };
  render() {
    var { products, store_code, listProductSelect, listType } = this.props;
    var { selected, modalSub, modalElement, formData, modalProduct } =
      this.state;
    var per_page = products.per_page;
    var current_page = products.current_page;

    var listProduct = filter_arr(listProductSelect);
    var _selected =
      selected.length > 0 && selected.length == listProduct.length
        ? true
        : false;
    var multiDelete = selected.length > 0 ? "show" : "hide";
    var { _delete, update, insert } = this.props;
    console.log(products);
    return (
      <div>
        <button
          onClick={(e) => this.handleMultiDelCallBack(e, selected)}
          data-toggle="modal"
          data-target="#removeMultiModal"
          style={{ marginLeft: "10px" }}
          class={`btn btn-danger btn-sm ${multiDelete}`}
        >
          <i class="fa fa-trash"></i> Xóa {selected.length} sản phẩm
        </button>
        <table
          class="table table-border "
          id="dataTable"
          width="100%"
          cellspacing="0"
        >
          <thead>
            <tr>
              <th>STT</th>
              <th>Hình ảnh</th>
              <th>Mã SKU</th>
              <th>Mã Barcode</th>
              <th style={{ width: "36%" }}>Tên sản phẩm</th>
              <th>Giá vốn</th>
              <th>Tồn kho</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>{this.showData(listProduct, per_page, current_page)}</tbody>
        </table>
        <EditStock
          listType={listType}
          getParams={this.props.getParams}
          store_code={store_code}
          modalSub={modalSub}
          modalElement={modalElement}
          modalProduct={modalProduct}
          editStockCallBack={this.editStockCallBack}
        />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    editStock: (store_code, branch_id, data, page, params) => {
      dispatch(
        productAction.editStock(store_code, branch_id, data, page, params)
      );
    },
  };
};
export default connect(null, mapDispatchToProps)(Table);
