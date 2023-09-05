import React, { Component } from "react";
import Select from "react-select";
import * as helper from "../../../ultis/helpers";
import { connect } from "react-redux";
import * as CategoryPAction from "../../../actions/category_product";
import * as AttributeAction from "../../../actions/attribute_search";
import { shallowEqual } from "../../../ultis/shallowEqual";
import { formatNumber, formatNoD } from "../../../ultis/helpers";
import getChannel, { BENITH } from "../../../ultis/channel";
import * as Types from "../../../constants/ActionType";
import Barcode from "react-barcode";
class InfoProduct extends Component {
  constructor(props) {
    console.log("props: ", props);
    super(props);
    this.state = {
      txtName: "",
      // txtBarcode: Math.random().toString().slice(2, 11),
      txtBarcode: "",
      txtWeight: "",
      txtPrice: "",
      txtImportPrice: "",
      sku: Math.random().toString().slice(2, 11),
      check_inventory: false,
      txtQuantityInStock: "",
      txtCostOfCapital: "",
      icon: true,
      txtPercentC: "",
      type_share_collaborator_number: Types.TYPE_SHARE_COLLABORATOR_PERCENT,
      money_amount_collaborator: "",
      txtPosition: "",
      txtStatus: 0,
      listCategory: [],
      category_parent: [],
      category_children_ids: [],
      listAttributeSearch: [],
      attribute_search_parent: [],
      attribute_search_children_ids: [],
      txtCategory: [],
      checkHasDistribute: false,
      disabledPrice: false,
      categorySearch: "",
      point_for_agency: null,
      icon_for_point: false,
      short_name: "",
      txtUnits: "",
      product_units: [],
      listDistribute: [
        {
          element_distributes: [
            {
              name: "",
              price: "",
              image_url: null,
              quantity_in_stock: 0,
              sub_element_distributes: [],
              is_edit: false,
              import_price: 0,
              cost_of_capital: 0,
              barcode: 0,
              stock: 0,
            },
          ],
          name: "test",
        },
      ],
    };
  }
  handleChangeCheckParent(id) {
    return this.state.category_parent.map((e) => e.id).indexOf(id) > -1;
  }
  handleChangeCheckChild(id) {
    return this.state.category_children_ids.map((e) => e.id).indexOf(id) > -1;
  }
  getNameSelected() {
    var nam = "";
    var categories = this.state.listCategory;
    if (this.state.category_parent !== null) {
      categories.forEach((category) => {
        if (
          this.state.category_parent.map((e) => e.id).indexOf(category.id) > -1
        ) {
          nam = nam + category.label + ", ";
        }
      });

      if (this.state.category_children_ids !== null) {
        categories.forEach((category) => {
          category.categories_child.forEach((categoryChild) => {
            if (
              this.state.category_children_ids
                .map((e) => e.id)
                .indexOf(categoryChild.id) > -1
            ) {
              nam = nam + categoryChild.name + ", ";
            }
          });
        });
      }
    }
    if (nam.length > 0) {
      nam = nam.substring(0, nam.length - 2);
    }
    return nam;
  }

  onChangeCheckHasDitribute = (e) => {
    this.setState({ checkHasDistribute: !this.state.checkHasDistribute });
    this.props.checkDistribute(
      !this.state.checkHasDistribute,
      this.state.check_inventory
    );
    // this.props.checkDistribute(!this.state.checkHasDistribute)
  };
  onChange = (e) => {
    var target = e.target;
    var name = target.name;
    var value_text = target.value;
    var value = value_text;
    const _value = formatNumber(value);

    if (
      name == "txtPrice" ||
      name == "txtImportPrice" ||
      name == "txtPercentC" ||
      name == "txtQuantityInStock" ||
      name == "point_for_agency" ||
      name == "txtWeight" ||
      name == "money_amount_collaborator"
    ) {
      if (!isNaN(Number(_value))) {
        value = formatNoD(_value);
        if (name == "txtPercentC") {
          if (value.length < 3) {
            if (value == "") {
              this.setState({ [name]: "" });
            } else {
              this.setState({ [name]: value });
            }
          }
        } else {
          if (value.length > 18) {
            return;
          }
          if (value == "") {
            this.setState({ [name]: "" });
          } else {
            this.setState({ [name]: value });
          }
        }
      }
    } else {
      if (name == "txtBarcode" || name == "sku") {
        if (helper.containsSpecialChars(value)) {
          return;
        }
      }
      this.setState({ [name]: value });
    }
  };
  onChangeSelect = (selectValue) => {
    this.setState({ txtCategory: selectValue });
  };
  handleChangeParent = (category) => {
    var indexHas = this.state.category_parent
      .map((e) => e.id)
      .indexOf(category.id);
    if (indexHas !== -1) {
      var newList = this.state.category_parent;
      newList.splice(indexHas, 1);
      this.setState({ category_parent: newList });
      this.state.listCategory.forEach((category1) => {
        if (category1.id === category.id) {
          category1.categories_child.forEach((categoryChild1) => {
            const indexChild = this.state.category_children_ids
              .map((e) => e.id)
              .indexOf(categoryChild1.id);
            if (indexChild !== -1) {
              const newChild = this.state.category_children_ids.splice(
                indexChild,
                1
              );
              console.log("newChild", newChild);
            }
          });
        }
      });
    } else {
      this.setState({
        category_parent: [...this.state.category_parent, category],
      });
    }
    this.props.handleDataFromInfo(this.state);
  };

  handleChangeChild = (categoryChild) => {
    var categoryParentOb;
    this.state.listCategory.forEach((category) => {
      if (category.categories_child != null) {
        category.categories_child.forEach((categorychild2) => {
          if (categorychild2.id === categoryChild.id) {
            categoryParentOb = category;
          }
        });
      }
    });
    if (categoryParentOb != null) {
      var indexHas = this.state.category_parent
        .map((e) => e.id)
        .indexOf(categoryParentOb.id);
      if (indexHas !== -1) {
      } else {
        this.setState({
          category_parent: [...this.state.category_parent, categoryParentOb],
        });
      }
    }

    /////
    var indexHasChild = this.state.category_children_ids
      .map((e) => e.id)
      .indexOf(categoryChild.id);
    if (indexHasChild !== -1) {
      var newListChild = this.state.category_children_ids;
      newListChild.splice(indexHasChild, 1);
      this.setState({ category_children_ids: newListChild });
    } else {
      this.setState({
        category_children_ids: [
          ...this.state.category_children_ids,
          categoryChild,
        ],
      });
    }
    this.props.handleDataFromInfo(this.state);
  };
  componentDidMount() {
    const { getAttributeSearch, productId, store_code } = this.props;
    getAttributeSearch(store_code, productId);
  }
  onChangeSelectCategory = (e) => {
    this.setState({ txtCategory: [e.target.value] });
  };
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.total != this.props.total &&
      typeof nextProps.total != "undefined"
    ) {
      var value = nextProps.total;
      const _value = formatNumber(value);

      if (!isNaN(Number(_value))) {
        value = formatNoD(_value);
        this.setState({ txtQuantityInStock: value });
      }
    }

    if (
      !shallowEqual(nextProps.category_product, this.props.category_product)
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
        this.setState({ listCategory: option });
      }
    }
    if (
      !shallowEqual(nextProps.attribute_search, this.props.attribute_search)
    ) {
      let option = [];
      var attribute_search = [...nextProps.attribute_search];
      if (attribute_search.length > 0) {
        option = attribute_search.map((attribute, index) => {
          return {
            id: attribute.id,
            label: attribute.name,
            attribute_search_child: attribute.product_attribute_search_children,
          };
        });
        this.setState({ listAttributeSearch: option });
      }
    }
    if (
      !shallowEqual(
        nextProps.allAttributeProduct,
        this.props.allAttributeProduct
      )
    ) {
      this.setState({
        attribute_search_children_ids: nextProps.allAttributeProduct,
      });
    }
    let optionUnits = [];
    var product_units = [...(nextProps.product_units || [])];
    if (product_units.length > 0) {
      optionUnits = product_units.map((item, index) => {
        return {
          id: item.id,
          label: item.name,
        };
      });
      this.setState({ product_units: optionUnits });
    }
    if (!shallowEqual(nextProps.product, this.props.product)) {
      var { product } = { ...nextProps };
      var { isCopy } = nextProps;
      var categories = [];
      var listcategorynew = [];
      categories = product.categories.map((category, index) => {
        if (listcategorynew.map((e) => e.id).indexOf(category.id) === -1) {
          listcategorynew.push(category);
        }

        return { id: category.id, label: category.name };
      });
      console.log("eeeee");
      const price = formatNumber(product.price ?? 0);
      var _price = formatNoD(price);

      const import_price = formatNumber(product.import_price ?? 0);
      var _import_price = formatNoD(import_price);
      const weight = formatNumber(product.weight ?? 0);
      var _weight = formatNoD(weight);
      const money_amount_collaborator = formatNumber(
        product.money_amount_collaborator ?? 0
      );
      var _money_amount_collaborator = formatNoD(money_amount_collaborator);

      const quantity_stock =
        product.quantity_in_stock < 0
          ? ""
          : formatNumber(product.quantity_in_stock);

      var _quantity_stock =
        quantity_stock == "" ? "" : formatNoD(quantity_stock);
      var checkHasDistribute = false;
      if (product.distributes != null && product.distributes.length > 0) {
        checkHasDistribute = true;
      }

      this.setState({
        txtName: product.name,
        short_name: product.short_name,
        txtPrice: _price,
        point_for_agency: product.point_for_agency,
        listDistribute: product.distributes,
        txtCategory:
          product.categories && product.categories.length
            ? [product.categories[0].id]
            : [],
        txtImportPrice: _import_price,
        disabledPrice: _price == 0 ? true : false,
        txtPercentC: product.percent_collaborator,
        money_amount_collaborator: _money_amount_collaborator,
        type_share_collaborator_number: product.type_share_collaborator_number,
        // txtBarcode: isCopy ? Math.random().toString().slice(2, 11) :  product.barcode || Math.random().toString().slice(2, 11),
        txtBarcode: product.barcode,

        txtStatus: product.status,
        category_parent: listcategorynew,
        category_children_ids: product.category_children,
        txtQuantityInStock: _quantity_stock,
        sku: product.sku,
        checkHasDistribute,
        check_inventory: product.check_inventory,
        txtCostOfCapital: product.main_cost_of_capital,
        txtWeight: _weight,
        txtPosition: product.shelf_position,
      });

      this.props.checkDistribute(checkHasDistribute, product.check_inventory);
    }
  }
  onChangeCheckInventory = (e) => {
    var { checked } = e.target;
    this.setState({
      check_inventory: checked,
    });
    this.props.checkDistribute(
      this.state.checkHasDistribute,
      !this.state.check_inventory
    );
  };
  shouldComponentUpdate(nextProps, nextState) {
    if (!shallowEqual(nextState, this.state)) {
      this.props.handleDataFromInfo(nextState);
    }
    return true;
  }
  componentWillUnmount() {
    this.props.resetAttributeSearch();
  }
  //Xử lý ds thuộc tính tìm kiếm

  handleChangeCheckParentAttribute(id) {
    return this.state.attribute_search_parent.indexOf(id) > -1;
  }
  handleChangeCheckChildAttribute(id) {
    return this.state.attribute_search_children_ids.indexOf(id) > -1;
  }
  getNameSelectedAttribute() {
    var nam = "";
    var attributes = this.state.listAttributeSearch;

    if (this.state.attribute_search_parent !== null) {
      attributes.forEach((attribute) => {
        if (
          this.state.attribute_search_parent
            .map((e) => e.id)
            .indexOf(attribute.id) > -1
        ) {
          nam = nam + attribute.label + ", ";
        }
      });

      if (this.state.attribute_search_children_ids !== null) {
        attributes.forEach((attribute) => {
          attribute.attribute_search_child.forEach((attributeChild) => {
            if (
              this.state.attribute_search_children_ids.indexOf(
                attributeChild.id
              ) > -1
            ) {
              nam = nam + attributeChild.name + ", ";
            }
          });
        });
      }
    }
    if (nam.length > 0) {
      nam = nam.substring(0, nam.length - 2);
    }
    return nam;
  }

  handleChangeParentAttribute = (attribute) => {
    var indexHas = this.state.attribute_search_parent
      .map((e) => e.id)
      .indexOf(attribute.id);
    if (indexHas !== -1) {
      var newList = this.state.attribute_search_parent;
      newList.splice(indexHas, 1);
      this.setState({ attribute_search_parent: newList });
      this.state.listAttributeSearch.forEach((attribute2) => {
        if (attribute2.id === attribute.id) {
          attribute2.attribute_search_child.forEach((attributeChild1) => {
            const indexChild = this.state.attribute_search_children_ids
              .map((e) => e.id)
              .indexOf(attributeChild1.id);
            if (indexChild !== -1) {
              const newChild = this.state.attribute_search_children_ids.splice(
                indexChild,
                1
              );
              console.log("newChild", newChild);
            }
          });
        }
      });
    } else {
      this.setState({
        attribute_search_parent: [
          ...this.state.attribute_search_parent,
          attribute,
        ],
      });
    }
    this.props.handleDataFromInfo(this.state);
  };

  handleChangeChildAttribute = (attributeChild) => {
    var attributeParentOb;
    this.state.listAttributeSearch.forEach((attribute) => {
      if (attribute.attribute_search_parent != null) {
        attribute.attribute_search_parent.forEach((attributechild2) => {
          if (attributechild2.id === attributeChild.id) {
            attributeParentOb = attribute;
          }
        });
      }
    });
    if (attributeParentOb != null) {
      var indexHas = this.state.attribute_search_parent
        .map((e) => e.id)
        .indexOf(attributeParentOb.id);
      if (indexHas !== -1) {
      } else {
        this.setState({
          attribute_search_parent: [
            ...this.state.attribute_search_parent,
            attributeParentOb,
          ],
        });
      }
    }

    /////
    var indexHasChild = this.state.attribute_search_children_ids.indexOf(
      attributeChild.id
    );
    if (indexHasChild !== -1) {
      var newListChild = this.state.attribute_search_children_ids;
      newListChild.splice(indexHasChild, 1);
      this.setState({ attribute_search_children_ids: newListChild });
    } else {
      this.setState({
        attribute_search_children_ids: [
          ...this.state.attribute_search_children_ids,
          attributeChild.id,
        ],
      });
    }
    this.props.handleDataFromInfo(this.state);
  };

  onChangePrice = (e) => {
    var { checked } = e.target;
    if (checked == true) {
      this.setState({ txtPrice: 0, disabledPrice: checked });
    } else {
      this.setState({ txtPrice: "", disabledPrice: checked });
    }
  };

  onChangeIcon = () => {
    this.setState({ icon: !this.state.icon });
  };

  searchData = (e) => {
    e.preventDefault();
    var { store_code } = this.props;
    var { categorySearch, item1 } = this.state;
    var resultSearch = [];
    if (this.props.category_product?.length > 0) {
      for (const category of this.props.category_product) {
        if (category.name?.includes(categorySearch)) {
          resultSearch.push({
            id: category.id,
            label: category.name,
            categories_child: category.category_children,
          });
        }
      }
    }

    this.setState({ listCategory: resultSearch });
    //   return {
    //     id: category.id,
    //     label: category.name,
    //     categories_child: category.category_children,
    //   };
    // });
    // this.setState({ listCategory: option });
  };
  handleChangeTypeShareCollab = (type) => {
    this.setState({
      type_share_collaborator_number:
        type === "%"
          ? Types.TYPE_SHARE_COLLABORATOR_PERCENT
          : Types.TYPE_SHARE_COLLABORATOR_NUMBER,
    });
  };
  updateDistribute = (event, index) => {
    const value = event.target.value;
    const name = event.target.name;

    this.setState((prevState) => {
      const updatedDistributes = [...prevState.listDistribute];
      updatedDistributes[0].element_distributes[index][name] = value;

      return {
        listDistribute: updatedDistributes,
      };
    });
    if(name === "price") this.setState({txtPrice: value});
  };
  render() {
    var {
      listCategory,
      listAttributeSearch,
      txtName,
      txtStatus,
      txtPrice,
      category_parent,
      category_children_ids,
      txtCategory,
      txtQuantityInStock,
      txtPercentC,
      type_share_collaborator_number,
      money_amount_collaborator,
      disabledPrice,
      sku,
      txtBarcode,
      txtImportPrice,
      check_inventory,
      txtCostOfCapital,
      checkHasDistribute,
      categorySearch,
      txtWeight,
      point_for_agency,
      txtPosition,
      short_name,
      product_units,
    } = this.state;
    console.log(checkHasDistribute);
    var txtQuantityInStock = txtQuantityInStock == -1 ? "" : txtQuantityInStock;
    var { isCopy } = this.props;
    return (
      <div class="card-body" style={{ padding: "0.8rem" }}>
        <div className="row">
          <div class="form-group col-6">
            <label for="product_name">Mã vạch thuốc</label>
            <input
              type="text"
              class="form-control input-sm"
              id="txtBarcode"
              placeholder="Nhập mã vạch code"
              autoComplete="off"
              value={txtBarcode}
              onChange={this.onChange}
              name="txtBarcode"
            />
          </div>
          <div className="col-6 form-group" style={{ textAlign: "center" }}>
            <Barcode
              value={this.state.txtBarcode || "enter barcode"}
              width={1.5}
              height={55}
              fontSize={16}
            />
          </div>
        </div>
        <div className="row">
          <div class="form-group col-6">
            <label for="product_name">
              Tên thuốc<span style={{ color: "red" }}> *</span>
            </label>
            <input
              type="text"
              class="form-control input-sm"
              id="txtName"
              placeholder="Nhập tên thuốc"
              autoComplete="off"
              value={txtName}
              onChange={this.onChange}
              name="txtName"
            />
          </div>
          <div class="form-group col-6">
            <label for="product_name">Tên viết tắt</label>
            <input
              type="text"
              class="form-control input-sm"
              id="short_name"
              placeholder="Nhập tên viết tắt"
              autoComplete="off"
              value={short_name}
              onChange={this.onChange}
              name="short_name"
            />
          </div>
        </div>
        <div className="row">
          <div class="form-group col-6">
            <label for="product_name">Nhóm thuốc</label>
            <select
              id="input"
              class="form-control"
              value={txtStatus}
              onChange={this.onChange}
              name="txtStatus"
            >
              <option value="0">Chọn nhóm thuốc</option>
              <option value="-1">Tạm ẩn</option>
            </select>
          </div>
          <div class="form-group col-6">
            <label for="product_name">Danh mục thuốc</label>
            <select
              id="input"
              class="form-control"
              value={this.state.txtCategory[0] || ""}
              onChange={this.onChangeSelectCategory}
              name="txtCategory"
            >
              <option value="">Chọn danh mục thuốc</option>
              {listCategory && listCategory.length
                ? listCategory.map((item, index) => {
                    return <option value={item.id}>{item.label}</option>;
                  })
                : null}
            </select>
          </div>
        </div>
        <div className="row">
          <div class="form-group col-6">
            <label for="product_name">
              Đơn vị nhỏ nhất<span style={{ color: "red" }}> *</span>
            </label>
            <select
              id="input"
              class="form-control"
              value={this.state.listDistribute[0].element_distributes[0].name}
              onChange={(event) => this.updateDistribute(event, 0)}
              name="name"
            >
              <option value="">Chọn đơn vị nhỏ nhất</option>
              {product_units && product_units.length
                ? product_units.map((item, index) => {
                    return <option value={item.label}>{item.label}</option>;
                  })
                : null}
            </select>
          </div>
          <div class="form-group col-6">
            <label for="product_name">
              Giá bán đơn vị nhỏ nhất<span style={{ color: "red" }}> *</span>
            </label>
            <input
              type="text"
              class="form-control input-sm"
              id="txtPrice"
              placeholder="Nhập giá bán đơn vị nhỏ nhất"
              autoComplete="off"
              value={this.state.listDistribute[0].element_distributes[0].price}
              onChange={(event) => this.updateDistribute(event, 0)}
              name="price"
            />
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    allAttributeProduct:
      state.attributeSearchReducers.attribute_search.allAttributeProduct,
  };
};
const mapDispatchToProps = (dispatch, props) => {
  return {
    fetchAllCategoryP: (store_code, params) => {
      dispatch(CategoryPAction.fetchAllCategoryP(store_code, params));
    },
    getAttributeSearch: (store_code, id) => {
      dispatch(AttributeAction.getAttributeSearch(store_code, id));
    },
    resetAttributeSearch: () => {
      dispatch({
        type: Types.FETCH_ALL_ATTRIBUTE_SEARCH_PRODUCT,
        data: {},
      });
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(InfoProduct);
