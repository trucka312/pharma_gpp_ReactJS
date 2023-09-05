import React, { Component } from "react";
import { Link } from "react-router-dom";
import { format, formatNumber } from "../../ultis/helpers";
import * as inventoryAction from "../../actions/inventory";
import { connect } from "react-redux";
import HistoryStock from "./HistoryStock";
import * as Env from "../../ultis/default";
import themeData from "../../ultis/theme_data";
import { getBranchId, getBranchIds } from "../../ultis/branchUtils";
import { confirmAlert } from "react-confirm-alert";
class ShowData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_item: true,
      formData: {},
    };
  }

  submit = () => {
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
            <p>Chức năng này chỉ sử dụng khi chọn duy nhất 1 chi nhánh !</p>
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
          label: "Yes",
          onClick: () => alert("Click Yes"),
        },
        {
          label: "No",
          onClick: () => alert("Click No"),
        },
      ],
    });
  };

  isBranches = () => {
    const isBranches = getBranchIds() ? true : false;
    return isBranches;
  };

  handleEditStockElement = (element, distribute) => {
    this.props.handleCallBackElement({
      element: element,
      idProduct: this.props.data.id,
      NameDistribute: distribute,
      time: Date(),
    });
  };
  handleEditSubElement = (subElement, element, distribute) => {
    this.props.handleCallBackSubElement({
      sub: subElement,
      SubElement: subElement.name,
      NameElement: element,
      idProduct: this.props.data.id,
      NameDistribute: distribute,
      time: Date(),
    });
  };
  handleEditStockProduct = (data) => {
    // console.log(data)
    // data.inventory.main_stock = typeof data.inventory.main_stock !== "undefined"  ? Math.floor(data.inventory.main_stock) : 0
    this.props.handleCallBackProduct({ data, time: Date() });
  };

  historyInventorys = (subElement, element, nameDistribute) => {
    const { store_code } = this.props;
    const formData = {
      product_id: this.props.data.id,
      distribute_name: nameDistribute,
      element_distribute_name: element,
      sub_element_distribute_name: subElement.name,
    };
    this.props.historyInventorys(store_code, formData);
    this.props.passFormData(formData);
  };
  historyInventory = (element, nameDistribute) => {
    const { store_code } = this.props;
    const formData = {
      product_id: this.props.data.id,
      distribute_name: nameDistribute,
      element_distribute_name: element.name,
      sub_element_distribute_name: "",
    };
    this.props.historyInventorys(store_code, formData);
    this.props.passFormData(formData);
  };
  historyInventoryss = () => {
    const { store_code } = this.props;
    const formData = {
      product_id: this.props.data.id,
      distribute_name: "",
      element_distribute_name: "",
      sub_element_distribute_name: "",
    };
    this.props.historyInventorys(store_code, formData);
    this.props.passFormData(formData);
  };

  showDistribute = (listDistribute, data) => {
    var result = [];
    if (typeof listDistribute == "undefined" || listDistribute.length === 0) {
      return result;
    }
    if (listDistribute.element_distributes) {
      listDistribute.element_distributes.map((element, _index) => {
        if (typeof element.sub_element_distributes != "undefined") {
          if (
            listDistribute.element_distributes[0].sub_element_distributes
              .length > 0
          ) {
            listDistribute.element_distributes[0].sub_element_distributes.map(
              (sub_element, index) => {
                const cost_of_capital =
                  listDistribute.element_distributes[_index]
                    .sub_element_distributes[index]?.cost_of_capital;
                const stock =
                  listDistribute.element_distributes[_index]
                    .sub_element_distributes[index]?.stock;
                result.push(
                  <tr className="wrap-item hover-product">
                    <td></td>
                    <td className="item">
                      <img
                        src={
                          element.image_url
                            ? element.image_url
                            : Env.IMG_NOT_FOUND
                        }
                        alt=""
                        width="60px"
                        height="60px"
                      ></img>
                    </td>
                    <td className="item" style={{ display: "flex" }}>
                      <label style={{ color: "#ff8100" }}>
                        &nbsp;Phân loại:{" "}
                      </label>
                      <div className="name-distribute">
                        {element.name},{sub_element.name}
                      </div>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="item">{format(Number(cost_of_capital))}</td>
                    <td className="item">{stock}</td>
                    {data.check_inventory === true ? (
                      <td className="item">
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            flexWrap: "wrap",
                          }}
                        >
                          {this.isBranches() === true ? (
                            <a
                              className="btn btn-warning btn-sm show"
                              style={{ paddingLeft: "10px", color: "white" }}
                              onClick={() => this.submit()}
                            >
                              <i className="fa fa-edit"></i> Sửa kho
                            </a>
                          ) : (
                            <a
                              className="btn btn-warning btn-sm show"
                              data-toggle="modal"
                              style={{ paddingLeft: "10px", color: "white" }}
                              data-target="#myModal"
                              onClick={() =>
                                this.handleEditSubElement(
                                  listDistribute.element_distributes[_index]
                                    .sub_element_distributes[index],
                                  element.name,
                                  listDistribute.name
                                )
                              }
                            >
                              <i className="fa fa-edit"></i> Sửa kho
                            </a>
                          )}

                          <a
                            className="btn btn-primary btn-sm show"
                            data-toggle="modal"
                            style={{ color: "white" }}
                            data-target="#historyStock"
                            onClick={() =>
                              this.historyInventorys(
                                listDistribute.element_distributes[_index]
                                  .sub_element_distributes[index],
                                element.name,
                                listDistribute.name
                              )
                            }
                          >
                            <i className="fa fa-history"></i> Lịch sử kho
                          </a>
                        </div>
                      </td>
                    ) : (
                      <td className="item"></td>
                    )}
                  </tr>
                );
              }
            );
          } else {
            result.push(
              <tr className="wrap-item hover-product">
                <td></td>

                <td className="item">
                  <img
                    src={
                      element.image_url ? element.image_url : Env.IMG_NOT_FOUND
                    }
                    alt=""
                    width="60px"
                    height="60px"
                  ></img>
                </td>
                <td className="item">
                  <div
                    style={{
                      display: "flex",
                      columnGap: "3px",
                      flexWrap: "wrap",
                    }}
                  >
                    <label style={{ color: "#ff8100", marginBottom: "0" }}>
                      &nbsp;Phân loại:
                    </label>
                    <div className="name-distribute">{element.name}</div>
                  </div>
                </td>
                <td></td>
                <td></td>
                <td className="item">
                  <div className="price-distribute">
                    {format(Number(element.cost_of_capital))}
                  </div>
                </td>
                <td className="item">
                  <div className="quantity-distribute">{element.stock}</div>
                </td>
                {data.check_inventory === true ? (
                  <td className="item">
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        flexWrap: "wrap",
                      }}
                    >
                      {this.isBranches() === true ? (
                        <a
                          className="btn btn-warning btn-sm show"
                          style={{ color: "white" }}
                          onClick={() => this.submit()}
                        >
                          <i className="fa fa-edit"></i> Sửa kho
                        </a>
                      ) : (
                        <a
                          className="btn btn-warning btn-sm show"
                          data-toggle="modal"
                          data-target="#myModal"
                          style={{ color: "white" }}
                          onClick={() =>
                            this.handleEditStockElement(
                              element,
                              listDistribute.name
                            )
                          }
                        >
                          <i className="fa fa-edit"></i> Sửa kho
                        </a>
                      )}

                      <a
                        className="btn btn-primary btn-sm show"
                        data-toggle="modal"
                        style={{ color: "white" }}
                        data-target="#historyStock"
                        onClick={() =>
                          this.historyInventory(element, listDistribute.name)
                        }
                      >
                        <i className="fa fa-history"></i> Lịch sử kho
                      </a>
                    </div>
                  </td>
                ) : (
                  <td className="item"></td>
                )}
              </tr>
            );
          }
        }
      });
    }
    return result;
  };

  render() {
    const {
      product_discount,
      data,
      per_page,
      current_page,
      index,
      store_code,
      page,
      historyInventory,
    } = this.props;
    const listDistribute =
      data.inventory?.distributes !== null &&
      data.inventory?.distributes.length > 0
        ? data.inventory?.distributes[0]
        : [];

    let discount_percent = null;

    if (product_discount) {
      discount_percent = product_discount.value;
    }

    var { formData } = this.props;
    console.log("datadata", data);

    return (
      <>
        <tr
          className="hover-product"
          style={{ background: "rgba(227, 230, 240, 0.1)" }}
        >
          <td>{per_page * (current_page - 1) + (index + 1)}</td>
          <td>
            <img
              src={
                data.images.length > 0
                  ? data.images[0].image_url
                  : Env.IMG_NOT_FOUND
              }
              alt=""
              width="60px"
              height="60px"
            ></img>
          </td>
          <td>{data.sku}</td>
          <td>{data.barcode}</td>
          <td>
            <div>
              <Link to={`/product/edit/${store_code}/${data.id}?page=${page}`}>
                {data.name}
              </Link>
            </div>
            {/* </Link> */}
          </td>
          {data.inventory.distributes.length === 1 ? (
            <>
              <td></td>
              <td></td>
              <td></td>
            </>
          ) : (
            <>
              <td>{format(Number(data.inventory.main_cost_of_capital))}</td>
              <td>{data.inventory.main_stock}</td>
              {data.check_inventory === true ? (
                <td>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                    }}
                  >
                    {this.isBranches() ? (
                      <a
                        className="btn btn-warning btn-sm show"
                        style={{ color: "white" }}
                        onClick={() => this.submit()}
                      >
                        <i className="fa fa-edit"></i> Sửa kho
                      </a>
                    ) : (
                      <a
                        className="btn btn-warning btn-sm show"
                        style={{ color: "white" }}
                        data-toggle="modal"
                        data-target="#myModal"
                        onClick={() => this.handleEditStockProduct(data)}
                      >
                        <i className="fa fa-edit"></i> Sửa kho
                      </a>
                    )}

                    <a
                      className="btn btn-primary btn-sm show"
                      data-toggle="modal"
                      style={{ color: "white" }}
                      data-target="#historyStock"
                      onClick={() => this.historyInventoryss()}
                    >
                      <i className="fa fa-history"></i> Lịch sử kho
                    </a>
                  </div>
                </td>
              ) : (
                <td
                  style={{
                    color: "#bdc3c7",
                  }}
                >
                  Không bật theo dõi kho
                </td>
              )}
            </>
          )}
        </tr>

        {/* <tr class={`explode ${data.inventory?.distributes.length > 0 ? "show" : "hide"}`} >
                    <td colSpan={12}>
                        <div className='show-distribute'> */}
        {this.showDistribute(listDistribute, data)}
        {/* </div>
                    </td>
                </tr> */}
        <HistoryStock
          historyInventory={historyInventory}
          formData={formData}
          store_code={this.props.store_code}
        />
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    historyInventory:
      state.inventoryReducers.inventory_reducer.historyInventory,
  };
};
const mapDispatchToProps = (dispatch, props) => {
  return {
    historyInventorys: (store_code, data) => {
      dispatch(inventoryAction.historyInventorys(store_code, data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShowData);
