import React, { Component } from "react";
import Sidebar from "../../components/Partials/Sidebar";
import Topbar from "../../components/Partials/Topbar";
import Footer from "../../components/Partials/Footer";
import $ from "jquery";
import { Link, Redirect } from "react-router-dom";
import Table from "../../components/Product/Table";
import General from "../../components/Product/General";
import * as Types from "../../constants/ActionType";
import Alert from "../../components/Partials/Alert";
import Pagination from "../../components/Product/Pagination";
import ModalDelete from "../../components/Product/Delete/Modal";
import ModalMultiDelete from "../../components/Product/Delete/MultiDelete";
import ImportModal from "../../components/Product/Import/index";
import NotAccess from "../../components/Partials/NotAccess";
import Tiki from "../../components/Product/Ecomerce/Tiki";
import { connect, shallowEqual } from "react-redux";
import Loading from "../Loading";
import * as productAction from "../../actions/product";
import * as CategoryPAction from "../../actions/category_product";
import * as packageProductAction from "../../actions/package_product";
import * as XLSX from "xlsx";
import { randomString } from "../../ultis/helpers";
import Shopee from "../../components/Product/Ecomerce/Shopee";
import Sendo from "../../components/Product/Ecomerce/Sendo";
import getChannel, { BENITH, IKIPOS } from "../../ultis/channel";
import { getQueryParams } from "../../ultis/helpers";
import ModalCol from "../../components/Product/ModalCollaration";
import ModalConfirm from "../../components/Product/ComfirmCol";
import history from "../../history";
import ModalChooseTypeImport from "../../components/Product/ImportProductInWeb/ModalChooseTypeImport";
import { getBranchId, getBranchIds } from "../../ultis/branchUtils";
import styled from "styled-components";

const ProductStyles = styled.div`
  .card-header {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
  }
`;

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: {
        title: "",
        id: "",
        store_code: "",
        name: "",
      },
      multi: {
        title: "",
        data: [],
        store_code: "",
      },
      searchValue: getQueryParams("search") || "",
      page: getQueryParams("page") || 1,
      numPage: getQueryParams("limit") || 20,
      categorySelected: getQueryParams("category_ids")?.split(",") || [],
      level: getQueryParams("level") || "",
      importData: [],
      allow_skip_same_name: true,
      percent_col: 0,
      openModalTypeImport: false,
      listCategory: [],
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (
      !shallowEqual(this.props.category_product, nextProps.category_product)
    ) {
      var option = [];
      var categories = [...nextProps.category_product];
      if (categories.length > 0) {
        option = categories.map((category, index) => {
          return {
            id: category.id,
            label: category.name,
            categories_child: category.category_children,
          };
        });
        const categoryIds = getQueryParams("category_ids")?.split(",") || [];
        if (categoryIds?.length > 0) {
          const categorySelected = option.filter((item) =>
            categoryIds.includes(item?.id?.toString())
          );
          this.setState({
            categorySelected: categorySelected,
          });
        }
        this.setState({
          listCategory: option,
        });
      }
    }

    return true;
  }

  getNameSelected() {
    const { categorySelected } = this.state;
    var name = "";
    if (categorySelected.length > 0) {
      name += categorySelected.reduce(
        (prevCategory, currentCategory, index) => {
          return (
            prevCategory +
            `${
              index === categorySelected.length - 1
                ? currentCategory?.label
                : `${currentCategory?.label}, `
            }`
          );
        },
        ""
      );
    }

    return name;
  }
  handleCheckedCategory = (idCategory) => {
    const { categorySelected } = this.state;
    if (categorySelected?.length > 0) {
      const checked = categorySelected
        .map((category) => category?.id)
        .includes(idCategory);
      return checked;
    }
    return false;
  };

  handleChangeCategory = (category) => {
    const { categorySelected, numPage, level } = this.state;
    const { store_code } = this.props.match.params;
    var newCategorySelected = [];
    const branch_id = getBranchId();
    const branch_ids = getBranchIds();
    const branchIds = branch_ids ? branch_ids : branch_id;
    const isExisted = categorySelected.map((c) => c?.id).includes(category?.id);
    if (isExisted) {
      newCategorySelected = categorySelected.filter(
        (c) => c?.id !== category.id
      );
    } else {
      newCategorySelected = [...categorySelected, category];
    }

    this.setState({
      categorySelected: newCategorySelected,
      page: 1,
      searchValue: "",
      level: "",
    });
    const params = this.getParams("", numPage, newCategorySelected, "");
    history.push(`/product/index/${store_code}?page=1${params}`);
    this.props.fetchAllProductV2(store_code, branchIds, 1, params);
  };

  setAllowSkipSameName = (isAllowed) => {
    this.setState({ allow_skip_same_name: isAllowed });
  };

  setOpenModalTypeImport = (isOpenedModal) => {
    this.setState({ openModalTypeImport: isOpenedModal });
  };
  getParams = (search, limit, categories, level) => {
    var params = ``;
    if (search != "" && search != null) {
      params = params + `&search=${search}`;
    }
    if (limit != "" && limit != null) {
      params = params + `&limit=${limit}`;
    }
    if (categories !== "" && categories !== null && categories?.length > 0) {
      const newCategorySelected = categories.reduce(
        (prevCategory, currentCategory, index) => {
          const newCurrentCategory = currentCategory?.id || currentCategory;
          return (
            prevCategory +
            `${
              index === categories.length - 1
                ? newCurrentCategory
                : `${newCurrentCategory},`
            }`
          );
        },
        "&category_ids="
      );

      params += newCategorySelected;
    }
    if (level != "" && level != null) {
      params = params + `&level=${level}`;
    }

    return params;
  };
  onChangeNumPage = (e) => {
    var { store_code } = this.props.match.params;
    var { searchValue, categorySelected, level } = this.state;
    var numPage = e.target.value;
    this.setState({
      numPage,
      page: 1,
    });
    const branch_id = getBranchId();
    const branch_ids = getBranchIds();
    const branchIds = branch_ids ? branch_ids : branch_id;
    const params = this.getParams(
      searchValue,
      numPage,
      categorySelected,
      level
    );
    history.push(`/product/index/${store_code}?page=1${params}`);
    this.props.fetchAllProductV2(store_code, branchIds, 1, params);
  };
  onChangeSearch = (e) => {
    this.setState({ searchValue: e.target.value });
  };
  componentDidMount() {
    const { store_code } = this.props.match.params;
    this.handleFetchAllProduct();
    this.props.fetchAllCategoryP(store_code);
    this.props.fetchPackageProduct(store_code);
    this.props.fetchAllProductUnits(store_code);
  }
  handleFetchAllProduct = (pageParams) => {
    const { store_code } = this.props.match.params;
    const { searchValue, page, numPage, level, categorySelected } = this.state;

    const branch_id = getBranchId();
    const branch_ids = getBranchIds();
    const branchIds = branch_ids ? branch_ids : branch_id;
    var is_near_out_of_stock = getQueryParams("is_near_out_of_stock");
    var params = this.getParams(searchValue, numPage, categorySelected, level);
    if (is_near_out_of_stock) {
      params = params + `&is_near_out_of_stock=true`;
    }

    this.props.fetchAllProductV2(
      store_code,
      branchIds,
      pageParams || page,
      params
    );
  };
  componentDidUpdate() {
    if (
      this.state.isLoading != true &&
      typeof this.props.permission.product_list != "undefined"
    ) {
      var permissions = this.props.permission;
      var insert = permissions.product_list;
      var update = permissions.product_list;
      var _delete = permissions.product_list;
      var _import = permissions.product_list;
      var _export = permissions.product_list;
      var ecommerce = permissions.product_list;

      var isShow = permissions.product_list;
      var barcode_print = permissions.barcode_print;

      this.setState({
        isLoading: true,
        insert,
        update,
        _delete,
        _import,
        _export,
        isShow,
        ecommerce,
        barcode_print,
      });
    }
  }

  handleChangePerCol = (data) => {
    this.setState({ percent_col: data });
  };

  handleDelCallBack = (modal) => {
    this.setState({ modal: modal });
  };
  handleMultiDelCallBack = (multi) => {
    this.setState({ multi: multi });
  };
  searchData = (e) => {
    e.preventDefault();
    var { store_code } = this.props.match.params;
    var { searchValue, numPage, categorySelected, level } = this.state;
    const branch_id = getBranchId();
    const branch_ids = getBranchIds();
    const branchIds = branch_ids ? branch_ids : branch_id;
    this.setState({ page: 1 });
    const params = this.getParams(
      searchValue,
      numPage,
      categorySelected,
      level
    );
    history.push(`/product/index/${store_code}?page=1${params}`);
    this.props.fetchAllProductV2(store_code, branchIds, 1, params);
  };
  fetchAllData = () => {
    this.props.fetchAllProduct(this.props.match.params.store_code);
  };
  showDialogImportExcel = () => {
    // $("#file-excel-import").trigger("click");
    this.setOpenModalTypeImport(true);
  };

  onSaveChangePercent = () => {
    var { store_code } = this.props.match.params;

    this.props.changePercentCol(store_code, {
      percent_collaborator: this.state.percent_col,
    });
  };

  onChangeExcel = (evt) => {
    var f = evt.target.files[0];
    const reader = new FileReader();
    window.$("#importModal").modal("show");
    // this.setState({ allow_skip_same_name: randomString(10) });
    var _this = this;
    reader.onload = function (evt) {
      const bstr = evt.target.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      workbook.SheetNames.forEach((sheet) => {
        let rowObject = XLSX.utils.sheet_to_row_object_array(
          workbook.Sheets[sheet]
        );
        _this.setState({ importData: rowObject });
      });
    };
    document.getElementById("file-excel-import").value = null;
    reader.readAsBinaryString(f);
  };
  onChangeLevel = (e) => {
    const value = e.target.value;
    var { store_code } = this.props.match.params;
    var { searchValue, numPage, categorySelected } = this.state;
    const branch_id = getBranchId();
    const branch_ids = getBranchIds();
    const branchIds = branch_ids ? branch_ids : branch_id;

    this.setState({ level: value, page: 1 });

    const params = this.getParams(
      searchValue,
      numPage,
      categorySelected,
      value
    );

    history.push(`/product/index/${store_code}?page=1${params}`);
    this.props.fetchAllProductV2(store_code, branchIds, 1, params);
  };
  fetchAllListProduct = () => {
    var { store_code } = this.props.match.params;
    this.props.fetchAllListProduct(store_code, this.state.searchValue);
  };

  passNumPage = (page) => {
    this.setState({ page: page });
  };

  render() {
    console.log('this.props.match: ', this.props.match);
    if (this.props.auth) {
      var { products, allProductList, setAllowSkipSameName } = this.props;
      var { store_code } = this.props.match.params;
      var {
        searchValue,
        importData,
        allow_skip_same_name,
        page,
        numPage,
        level,
        categorySelected,
      } = this.state;
      console.log("Product ~ render ~ categorySelected:", categorySelected);
      var {
        insert,
        update,
        _delete,
        _import,
        _export,
        isShow,
        ecommerce,
        barcode_print,
        openModalTypeImport,
        listCategory,
      } = this.state;

      return (
        <ProductStyles id="wrapper">
          <ImportModal
            store_code={store_code}
            importData={importData}
            allow_skip_same_name={allow_skip_same_name}
          />
          <ModalConfirm
            percent_col={this.state.percent_col}
            onSaveChangePercent={this.onSaveChangePercent}
          />
          <ModalChooseTypeImport
            store_code={store_code}
            openModal={openModalTypeImport}
            allow_skip_same_name={allow_skip_same_name}
            setOpenModal={this.setOpenModalTypeImport}
            setAllowSkipSameName={this.setAllowSkipSameName}
          />
          <ModalCol handleChangePerCol={this.handleChangePerCol}></ModalCol>{" "}
          <Tiki store_code={store_code} />
          <Shopee store_code={store_code} />
          <Sendo store_code={store_code} />
          <Sidebar store_code={store_code} />
          <div className="col-10 col-10-wrapper">
            <div id="content-wrapper" className="d-flex flex-column">
              <div id="content">
                <Topbar store_code={store_code} />
                {typeof isShow == "undefined" ? (
                  <div style={{ height: "500px" }}></div>
                ) : isShow == true ? (
                  <div class="container-fluid">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <h4 className="h4 title_content mb-0 text-gray-800">
                        Sản phẩm
                      </h4>

                      <div style={{ display: "flex" }}>
                        <a
                          style={{ marginRight: "10px" }}
                          onClick={this.fetchAllListProduct}
                          class={`btn btn-success btn-icon-split btn-sm  ${
                            _export == true ? "show" : "hide"
                          }`}
                        >
                          <span class="icon text-white-50">
                            <i class="fas fa-file-export"></i>
                          </span>
                          <span style={{ color: "white" }} class="text">
                            Export Excel
                          </span>
                        </a>
                        <a
                          style={{ marginRight: "10px" }}
                          onClick={this.showDialogImportExcel}
                          class={`btn btn-primary btn-icon-split btn-sm  ${
                            _import == true ? "show" : "hide"
                          }`}
                        >
                          <span class="icon text-white-50">
                            <i class="fas fa-file-import"></i>
                          </span>
                          <span style={{ color: "white" }} class="text">
                            Import Excel
                          </span>
                        </a>
                        <input
                          id="file-excel-import"
                          type="file"
                          name="name"
                          style={{ display: "none" }}
                          onChange={this.onChangeExcel}
                        />
                      </div>
                    </div>
                    <br></br>
                    {/* {getChannel() == BENITH && <General products={products} />
                    } */}
                    <Alert
                      type={Types.ALERT_UID_STATUS}
                      alert={this.props.alert}
                    />

                    <div class="card shadow ">
                      <div className="card-header">
                        <div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "end",
                              marginRight: "15px",
                            }}
                          >
                            <Link
                              to={`/product/create/${store_code}`}
                              class={`btn btn-info btn-icon-split ${
                                insert == true ? "show" : "hide"
                              }`}
                            >
                              <span class="icon text-white-50">
                                <i class="fas fa-plus"></i>
                              </span>
                              <span class="text">Thêm thuốc mới</span>
                            </Link>
                          </div>
                          {/* <div>
                            <div
                              style={{
                                display: "flex",
                                columnGap: "20px",
                                alignItems: "center",
                                marginTop: "10px",
                                justifyContent: "flex-end",
                                marginRight: "10px",
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
                                }}
                              >
                                {<option value="">Tất cả</option>}{" "}
                                {this.props.packageProduct?.map(
                                  (data, index) => {
                                    return (
                                      <option value={data.level} key={index}>
                                        {data.level}
                                      </option>
                                    );
                                  }
                                )}
                              </select>
                            </div>
                          </div> */}
                        </div>
                        <div
                          class="row"
                          style={{
                            "justify-content": "space-between",
                            marginRight: "15px",
                            marginLeft: "15px",
                          }}
                        >
                          <form onSubmit={this.searchData}>
                            <div
                              class="input-group mb-6"
                              style={{ padding: "0 20px" }}
                            >
                              <input
                                style={{ maxWidth: "400px", minWidth: "200px" }}
                                type="search"
                                name="txtSearch"
                                value={searchValue}
                                onChange={this.onChangeSearch}
                                class="form-control"
                                placeholder="Tìm kiếm sản phẩm"
                              />
                              <div class="input-group-append">
                                <button class="btn btn-primary" type="submit">
                                  <i class="fa fa-search"></i>
                                </button>
                              </div>
                            </div>
                            <p class="total-item" id="sale_user_name">
                              <span className="num-total_item">
                                {products.total}&nbsp;
                              </span>
                              <span className="text-total_item" id="user_name">
                                sản phẩm
                              </span>
                            </p>
                          </form>
                          <div className="categories__content">
                            <div
                              id="accordion"
                              style={{
                                width: "300px",
                                position: "relative",
                              }}
                            >
                              <div
                                className="wrap_category input-group"
                                style={{ display: "flex" }}
                                data-toggle="collapse"
                                data-target="#collapseCategory"
                                aria-expanded="false"
                                aria-controls="collapseCategory"
                              >
                                <input
                                  readOnly
                                  type="text"
                                  class="form-control"
                                  placeholder="--Chọn danh mục--"
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    paddingRight: "55px",
                                    position: "relative",
                                    backgroundColor: "transparent",
                                  }}
                                  value={this.getNameSelected()}
                                ></input>
                                <button
                                  class="btn  btn-accordion-collapse collapsed input-group-text"
                                  id="headingOne"
                                  style={{
                                    borderTopLeftRadius: "0",
                                    borderBottomLeftRadius: "0",
                                  }}
                                >
                                  <i
                                    className={
                                      this.state.icon
                                        ? "fa fa-caret-down"
                                        : "fa fa-caret-down"
                                    }
                                  ></i>
                                </button>
                              </div>
                              <div
                                id="collapseCategory"
                                className="collapse"
                                ariaLabelledby="headingOne"
                                dataParent="#accordion"
                                style={{
                                  position: "absolute",
                                  width: "100%",
                                  left: "0",
                                  top: "100%",
                                  zIndex: "10",
                                  background: "#fff",
                                  boxShadow: "1px 2px 6px rgba(0,0,0,0.1)",
                                }}
                              >
                                <ul
                                  style={{
                                    listStyle: "none",
                                    margin: "5px 0",
                                    height: "235px",
                                    overflowY: "auto",
                                  }}
                                  class="list-group"
                                >
                                  {listCategory?.length > 0 ? (
                                    listCategory.map((category, index) => (
                                      <li
                                        class=""
                                        style={{
                                          cursor: "pointer",
                                          paddingTop: "5px",
                                          paddingLeft: "5px",
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <input
                                          type="checkbox"
                                          id={category.label}
                                          style={{
                                            marginRight: "10px",
                                            width: "30px",
                                            height: "15px",
                                            flexShrink: "0",
                                          }}
                                          checked={this.handleCheckedCategory(
                                            category.id
                                          )}
                                          onChange={() =>
                                            this.handleChangeCategory(category)
                                          }
                                        />
                                        <label
                                          htmlFor={category.label}
                                          style={{
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            marginBottom: "0",
                                          }}
                                          title={category.label}
                                        >
                                          {category.label}
                                        </label>
                                      </li>
                                    ))
                                  ) : (
                                    <div
                                      style={{
                                        marginTop: "20px",
                                        textAlign: "center",
                                      }}
                                    >
                                      Không có kết quả !
                                    </div>
                                  )}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="card-body">
                        <Table
                          insert={insert}
                          _delete={_delete}
                          update={update}
                          page={page}
                          limit={numPage}
                          searchValue={searchValue}
                          level={level}
                          categorySelected={categorySelected}
                          getParams={this.getParams}
                          handleDelCallBack={this.handleDelCallBack}
                          handleMultiDelCallBack={this.handleMultiDelCallBack}
                          handleFetchAllProduct={this.handleFetchAllProduct}
                          store_code={store_code}
                          products={products}
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
                                width: "70px",
                              }}
                              onChange={this.onChangeNumPage}
                              value={numPage}
                              name="numPage"
                              class="form-control"
                            >
                              <option value="10">10</option>
                              <option value="20" selected>
                                20
                              </option>
                              <option value="50">50</option>
                            </select>
                          </div>

                          <Pagination
                            limit={numPage}
                            searchValue={searchValue}
                            level={level}
                            passNumPage={this.passNumPage}
                            store_code={store_code}
                            products={products}
                            pageProduct={true}
                            getParams={this.getParams}
                            categorySelected={this.state.categorySelected}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <NotAccess />
                )}
              </div>

              <Footer />
            </div>
            <ModalDelete
              modal={this.state.modal}
              page={page}
              limit={numPage}
              searchValue={searchValue}
            />
            <ModalMultiDelete multi={this.state.multi} />
          </div>
        </ProductStyles>
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
    auth: state.authReducers.login.authentication,
    products: state.productReducers.product.allProduct,
    alert: state.productReducers.alert.alert_success,
    allProductList: state.productReducers.product.allProductList,
    permission: state.authReducers.permission.data,
    category_product: state.categoryPReducers.category_product.allCategoryP,
    product_units: state.categoryPReducers.category_product.allProductUnits,
    packageProduct: state.packageProductReducers.package_product.packageProduct,
  };
};
const mapDispatchToProps = (dispatch, props) => {
  return {
    fetchAllProduct: (store_code, page, params) => {
      dispatch(productAction.fetchAllProduct(store_code, page, params));
    },
    fetchAllProductV2: (store_code, branch_id, page, params) => {
      dispatch(
        productAction.fetchAllProductV2(store_code, branch_id, page, params)
      );
    },
    fetchAllListProduct: (store_code, searchValue) => {
      dispatch(productAction.fetchAllListProduct(store_code, searchValue));
    },
    changePercentCol: (store_code, data) => {
      dispatch(productAction.changePercentCol(store_code, data));
    },
    fetchAllCategoryP: (store_code) => {
      dispatch(CategoryPAction.fetchAllCategoryP(store_code));
    },
    fetchPackageProduct: (store_code) => {
      dispatch(packageProductAction.fetchPackageProduct(store_code));
    },
    fetchAllProductUnits: (store_code) => {
      dispatch(CategoryPAction.fetchAllProductUnits(store_code));
    }
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Product);
