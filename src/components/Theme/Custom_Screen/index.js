import React, { Component } from "react";
import * as themeAction from "../../../actions/theme";
import { connect } from "react-redux";
import { shallowEqual } from "../../../ultis/shallowEqual";
import * as Env from "../../../ultis/default";
import ItemHeaderTheme from "./ItemHeaderTheme";
import ItemBannerTheme from "./ItemBannerTheme";
import ItemProductTheme from "./ItemProductTheme";
import ItemNewsTheme from "./ItemNewsTheme.js";
import ItemFooterTheme from "./ItemFooterTheme.js";
import FormFooterHtml from "./FormFooterHtml";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import SortableList, { SortableItem } from "react-easy-sort";

import arrayMove from "array-move";
import {
  headerImg,
  bannerImg,
  productImg,
  blogImg,
  footerImg,
} from "./data.js";
import Slider from "react-slick";

import "./style.css";
import "slick-carousel/slick/slick.css";

import "slick-carousel/slick/slick-theme.css";
import ModalDefaultReset from "../Home_Screen/ModalDefaultReset";
import styled from "styled-components";

const OverviewStyles = styled.div`
  .price__display {
    .price__display__title {
      font-size: 18px;
      font-weight: 500;
      margin-bottom: 5px;
    }
    .price__display__content {
      display: flex;
      column-gap: 15px;
      .price__display__item {
        display: flex;
        align-items: center;
        column-gap: 3px;
        label {
          margin-bottom: 0;
          cursor: pointer;
        }
        input {
          cursor: pointer;
        }
      }
    }
  }
`;
class Custom_Screen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      header_type: null,
      banner_type: null,
      product_home_type: null,
      post_home_type: null,
      footer_type: null,
      html_footer: null,
      use_footer_html: false,
      tabId: 0,
      menuList: [],
      lastMenuList: [],
      hasChange: false,
    };
  }

  onChange = (e) => {
    var target = e.target;
    var name = target.name;
    var value = target.value;

    this.setState({
      [name]: value,
    });
  };

  onChangeThemeDefault = (theme) => {
    this.setState({
      themeDefaultReset: theme,
    });
  };

  componentDidMount() {
    var theme = this.props.theme;

    if (theme == null || theme == "" || typeof theme.store_id == "undefined") {
    } else {
      var menuList = JSON.parse(theme.json_custom_menu);
      var newList = [];
      if (Array.isArray(menuList)) {
        menuList.forEach(function (value, index) {
          if (value.name != null) {
            newList.push({
              index: index,
              name: value.name,
              link_to: value.link_to,
            });
          }
        });
      }

      this.setState({
        store_id: theme.store_id,
        header_type: theme.header_type,
        banner_type: theme.banner_type,
        product_home_type: theme.product_home_type,
        post_home_type: theme.post_home_type,
        footer_type: theme.footer_type,
        use_footer_html: theme.is_use_footer_html,
        html_footer: theme.html_footer,
        is_use_custom_menu:theme.is_use_custom_menu,
        menuList: newList ?? [],
        lastMenuList: newList ?? [],
        hasChange: false,
      });
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (
      !shallowEqual(nextProps.theme, this.props.theme) ||
      nextProps.tabId != this.props.tabId
    ) {
      var theme = nextProps.theme;
      console.log(theme);
      this.setState({
        store_id: theme.store_id,
        header_type: theme.header_type,
        banner_type: theme.banner_type,
        product_home_type: theme.product_home_type,
        post_home_type: theme.post_home_type,
        footer_type: theme.footer_type,
        use_footer_html: theme.is_use_footer_html,
        html_footer: theme.html_footer,
        is_use_custom_menu:theme.is_use_custom_menu,
      });

      setTimeout(
        function () {
          //Start the timer
          this.scrollToIndex(this.props);
        }.bind(this),
        200
      );
    }
  }

  scrollToIndex = (propsx) => {
    var theme = propsx != null ? propsx.theme : this.props.theme;
    const indexHeader = headerImg.findIndex(
      (header) => header.index === theme.header_type
    );
    const indexBanner = bannerImg.findIndex(
      (banner) => banner.index === theme.banner_type
    );
    const indexProduct = productImg.findIndex(
      (product) => product.index === theme.product_home_type
    );
    const indexBlog = blogImg.findIndex(
      (blog) => blog.index === theme.post_home_type
    );
    const indexFooter = footerImg.findIndex(
      (footer) => footer.index === theme.footer_type
    );

    if (this.sliderHeader != null) {
      this.sliderHeader.slickGoTo(indexHeader);
    }
    if (this.sliderBanner != null) {
      this.sliderBanner.slickGoTo(indexBanner);
    }
    if (this.sliderProduct != null) {
      this.sliderProduct.slickGoTo(indexProduct);
    }
    if (this.sliderNews != null) {
      this.sliderNews.slickGoTo(indexBlog);
    }
    if (this.sliderFooter != null) {
      this.sliderFooter.slickGoTo(indexFooter);
    }
  };

  getTabActive = (index) => {
    this.setState({ tabId: index });

    setTimeout(
      function () {
        //Start the timer
        this.scrollToIndex(this.props);
      }.bind(this),
      200
    );
  };

  chooseHeader = (theme) => {
    var { store_code } = this.props;
    var form = { ...this.props.theme };
    form.header_type = theme;

    this.props.updateTheme(store_code, form);
  };
  chooseBanner = (theme) => {
    var { store_code } = this.props;
    var form = { ...this.props.theme };
    form.banner_type = theme;

    this.props.updateTheme(store_code, form);
  };
  saveMenu = (theme) => {
    var { store_code } = this.props;
    var form = { ...this.props.theme };
    form.json_custom_menu = JSON.stringify(this.state.menuList);

    this.setState({
      lastMenuList: this.state.menuList ?? [],
      hasChange: false,
    });
    this.props.updateTheme(store_code, form);
  };
  chooseProduct = (theme) => {
    var { store_code } = this.props;
    var form = { ...this.props.theme };
    form.product_home_type = theme;

    this.props.updateTheme(store_code, form);
  };
  chooseNews = (theme) => {
    var { store_code } = this.props;
    var form = { ...this.props.theme };
    form.post_home_type = theme;

    this.props.updateTheme(store_code, form);
  };
  chooseFooter = (theme) => {
    var { store_code } = this.props;
    var form = { ...this.props.theme };
    form.footer_type = theme;
    form.html_footer = "";
    form.is_use_footer_html = false;

    this.props.updateTheme(store_code, form);
  };

  setDefaultTheme = () => {
    this.props.chooseTheme(this.props.theme_default);
    this.props.onChangeThemeDefault(this.props.theme_default);
  };

  isSameDefault = () => {
    var {
      header_type,
      banner_type,
      product_home_type,
      post_home_type,
      footer_type,
      use_footer_html,
      tabId,
    } = this.state;

    var arr = [
      header_type,
      banner_type,
      product_home_type,
      post_home_type,
      footer_type,
    ];

    if (shallowEqual(this.props.theme_default?.arr_index_component, arr)) {
      return true;
    }

    return false;
  };
  onChangePriceShow = (e) => {
    const { store_code, updateTheme, theme } = this.props;
    const form = {
      ...theme,
      option_total_show_type: e.target.value,
    };
    updateTheme(store_code, form);
  };

  onSortEnd = (oldIndex, newIndex) => {
    var menuList = arrayMove(this.state.menuList, oldIndex, newIndex);
    var listId = [];
    var listPosition = [];
    menuList.forEach((element, index) => {
      listId.push(element.id);
      listPosition.push(index + 1);
    });

    this.setState({
      menuList: menuList,
      hasChange: true,
    });
  };

  onRemoveItemMenu = (index) => {
    var newList = this.state.menuList;
    newList.splice(index, 1);
    this.setState({
      menuList: newList,
      hasChange: true,
    });
  };

  onChangeNameMenu = (index, va) => {
    var newList = this.state.menuList;
    newList[index].name = va;
    this.setState({
      menuList: newList,
      hasChange: true,
    });
  };

  showDataMenus = (types) => {
    console.log(this.state.menuList, this.state.lastMenuList);

    var { store_code } = this.props;
    var result = null;
    if (types.length > 0) {
      result = types.map((data, index) => {
        return (
          <SortableItem key={data.id}>
            <tr className="hover-product">
              <td>
                <span>
                  <svg
                    width="16px"
                    height="16px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18 10.75H5.99998C5.85218 10.751 5.70747 10.7077 5.58449 10.6257C5.46151 10.5437 5.3659 10.4268 5.30998 10.29C5.25231 10.1528 5.23673 10.0016 5.26523 9.85561C5.29372 9.70959 5.36499 9.57535 5.46998 9.46995L11.47 3.46995C11.6106 3.3295 11.8012 3.25061 12 3.25061C12.1987 3.25061 12.3894 3.3295 12.53 3.46995L18.53 9.46995C18.635 9.57535 18.7062 9.70959 18.7347 9.85561C18.7632 10.0016 18.7476 10.1528 18.69 10.29C18.6341 10.4268 18.5384 10.5437 18.4155 10.6257C18.2925 10.7077 18.1478 10.751 18 10.75ZM7.80998 9.24995H16.19L12 5.05995L7.80998 9.24995Z"
                      fill="#a6a4a4"
                    />
                    <path
                      d="M12 20.7499C11.9014 20.7504 11.8038 20.7311 11.7128 20.6934C11.6218 20.6556 11.5392 20.6 11.47 20.5299L5.46998 14.5299C5.36499 14.4245 5.29372 14.2903 5.26523 14.1442C5.23673 13.9982 5.25231 13.847 5.30998 13.7099C5.3659 13.5731 5.46151 13.4561 5.58449 13.3742C5.70747 13.2922 5.85218 13.2489 5.99998 13.2499H18C18.1478 13.2489 18.2925 13.2922 18.4155 13.3742C18.5384 13.4561 18.6341 13.5731 18.69 13.7099C18.7476 13.847 18.7632 13.9982 18.7347 14.1442C18.7062 14.2903 18.635 14.4245 18.53 14.5299L12.53 20.5299C12.4607 20.6 12.3782 20.6556 12.2872 20.6934C12.1962 20.7311 12.0985 20.7504 12 20.7499ZM7.80998 14.7499L12 18.9399L16.19 14.7499H7.80998Z"
                      fill="#a6a4a4"
                    />
                  </svg>
                </span>
                <span>{index + 1}</span>
              </td>
              <td>
                <input
                  required
                  type="text"
                  class="form-control"
                  id="threshold"
                  placeholder="Nhập tên menu..."
                  autoComplete="off"
                  value={data.name}
                  onChange={(v) => {
                    this.onChangeNameMenu(index, v.target.value);
                  }}
                  name="threshold"
                />
              </td>
              <td>
                <input
                  required
                  type="text"
                  class="form-control"
                  placeholder="Nhập đường dẫn VD: /san-pham"
                  value={data.link_to}
                  onChange={(v) => {
                    var newList = this.state.menuList;
                    newList[index].link_to = v.target.value;
                    this.setState({
                      menuList: newList,
                      hasChange: true,
                    });
                  }}
                />
              </td>
              <td>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    onClick={() => {}}
                    data-toggle="modal"
                    data-target="#updateType"
                    class={`btn btn-outline-warning btn-sm `}
                  >
                    <i class="fa fa-edit"></i> Sửa
                  </button>

                  <button
                    onClick={() => {
                      this.onRemoveItemMenu(index);
                    }}
                    data-toggle="modal"
                    data-target="#removeType"
                    class={`btn btn-outline-danger btn-sm`}
                  >
                    <i class="fa fa-trash"></i> Xóa
                  </button>
                </div>
              </td>
            </tr>
          </SortableItem>
        );
      });
    } else {
      return result;
    }
    return result;
  };

  render() {
    const setting = {
      dots: true,
      autoplay: false,
      autoplaySpeed: 4000,
      pauseOnHover: true,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,

      arrow: true,
      dotsClass: "slick-dots slick-thumb",
    };
    const settingBanner = {
      dots: false,
      autoplay: false,
      autoplaySpeed: 4000,
      pauseOnHover: true,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,

      arrow: true,
      dotsClass: "slick-dots slick-thumb",
    };
    var {
      header_type,
      banner_type,
      product_home_type,
      post_home_type,
      footer_type,
      use_footer_html,
      html_footer,
      tabId,
      is_use_custom_menu,
      menuList,
      lastMenuList,
    } = this.state;
    var { badges, store_code, theme } = this.props;

    console.log(lastMenuList, menuList);
    return (
      <OverviewStyles className="overview " style={{ marginLeft: "25px" }}>
        <div className="row justify-content-between  align-items-center">
          <button
            style={{ marginRight: "10px", marginBottom: 25, marginTop: 10 }}
            type="button"
            onClick={this.props.goBack}
            class="btn btn-warning  btn-sm"
          >
            <i class="fas fa-arrow-left"></i>&nbsp;Quay lại
          </button>

          {
            this.isSameDefault() == false && (
              <button
                type="button"
                class="btn btn-primary-no-background btn-sm"
                style={{
                  color: "#0d6efd",
                  "border-color": "#0d6efd",
                }}
                onClick={() => {
                  this.onChangeThemeDefault(this.props.theme_default);
                }}
                data-toggle="modal"
                data-target="#modalDefaultReset"
              >
                <i class="fas fa-undo"></i>
                <span class="text">&nbsp;Khôi phục mặc định</span>
              </button>
            )
            //  <a
            //   onClick={() => {

            //     this.onChangeThemeDefault(this.props.theme_default)
            //   }}
            //   data-toggle="modal"
            //   data-target="#modalDefaultReset"
            //   style={{
            //     color: "#0d6efd"
            //   }}>Khôi phục mặc định</a>
          }
        </div>

        <Tabs defaultIndex={0} onSelect={(index) => this.getTabActive(index)}>
          <div className="row">
            <div
              className="col-2 col-2-nav "
              style={{
                width: "100%",
                height: "fit-content",
              }}
            >
              <TabList>
                <Tab
                  style={{
                    width: "100%",
                    height: "60px",
                    border: "1px solid #bcbcbc",
                    display: "flex",
                    alignItems: "center",
                    borderBottom: "none",
                  }}
                >
                  <h6 style={{ fontWeight: "bold" }}>1.</h6>
                  <p
                    style={{
                      color: "black",

                      paddingTop: "9px",
                      paddingLeft: "6px",
                      fontSize: "0.8rem",
                    }}
                  >
                    Header
                  </p>
                  {tabId === 0 ? (
                    <i
                      class="fa fa-caret-right fa-lg"
                      aria-hidden="true"
                      style={{
                        marginRight: 0,
                        marginLeft: "auto",
                        marginBottom: "3px",
                      }}
                    ></i>
                  ) : (
                    ""
                  )}
                </Tab>
                <Tab
                  style={{
                    width: "100%",
                    height: "60px",
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #bcbcbc",
                    borderBottom: "none",
                  }}
                >
                  <h6 style={{ fontWeight: "bold" }}>2.</h6>
                  <p
                    style={{
                      color: "black",

                      paddingTop: "9px",
                      paddingLeft: "6px",
                      fontSize: "0.8rem",
                    }}
                  >
                    Banner
                  </p>
                  {tabId === 1 ? (
                    <i
                      class="fa fa-caret-right fa-lg"
                      aria-hidden="true"
                      style={{
                        marginRight: 0,
                        marginLeft: "auto",
                        marginBottom: "3px",
                      }}
                    ></i>
                  ) : (
                    ""
                  )}
                </Tab>
                <Tab
                  style={{
                    width: "100%",
                    height: "60px",
                    border: "1px solid #bcbcbc",
                    display: "flex",
                    alignItems: "center",
                    borderBottom: "none",
                  }}
                >
                  <h6 style={{ fontWeight: "bold" }}>3.</h6>
                  <p
                    style={{
                      color: "black",

                      paddingTop: "9px",
                      paddingLeft: "6px",
                      fontSize: "0.8rem",
                    }}
                  >
                    Product
                  </p>
                  {tabId === 2 ? (
                    <i
                      class="fa fa-caret-right fa-lg"
                      aria-hidden="true"
                      style={{
                        marginRight: 0,
                        marginLeft: "auto",
                        marginBottom: "3px",
                      }}
                    ></i>
                  ) : (
                    ""
                  )}
                </Tab>

                <Tab
                  style={{
                    width: "100%",
                    height: "60px",
                    border: "1px solid #bcbcbc",
                    display: "flex",
                    alignItems: "center",
                    borderBottom: "none",
                  }}
                >
                  <h6 style={{ fontWeight: "bold" }}>4.</h6>
                  <p
                    style={{
                      color: "black",

                      paddingTop: "9px",
                      paddingLeft: "6px",
                      fontSize: "0.8rem",
                    }}
                  >
                    Tin tức
                  </p>
                  {tabId === 3 ? (
                    <i
                      class="fa fa-caret-right fa-lg"
                      aria-hidden="true"
                      style={{
                        marginRight: 0,
                        marginLeft: "auto",
                        marginBottom: "3px",
                      }}
                    ></i>
                  ) : (
                    ""
                  )}
                </Tab>
                <Tab
                  style={{
                    width: "100%",
                    height: "60px",
                    border: "1px solid #bcbcbc",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <h6 style={{ fontWeight: "bold" }}>5.</h6>
                  <p
                    style={{
                      color: "black",

                      paddingTop: "9px",
                      paddingLeft: "6px",
                      fontSize: "0.8rem",
                    }}
                  >
                    Footer
                  </p>
                  {tabId === 4 ? (
                    <i
                      class="fa fa-caret-right fa-lg"
                      aria-hidden="true"
                      style={{
                        marginRight: 0,
                        marginLeft: "auto",
                        marginBottom: "3px",
                      }}
                    ></i>
                  ) : (
                    ""
                  )}
                </Tab>
              </TabList>
            </div>
            <div
              className="col-10 col-10-wrapper"
              style={{
                border: "none",
              }}
            >
              <form role="form">
                <div class="box-body">
                  <TabPanel>
                    <div class=" ml-3" style={{ height: "30px" }}>
                      <input
                        type="checkbox"
                        style={{ transform: "scale(1.5)" }}
                        checked={is_use_custom_menu}
                        onChange={(e) => {
                          let checkbox = e.target;
                          var form = { ...this.props.theme };

                          if (checkbox.checked) {
                            this.setState({
                              is_use_custom_menu: true,
                            });

                            form.is_use_custom_menu = true;
                            this.props.updateTheme(store_code, form);
                          } else {
                            this.setState({
                              is_use_custom_menu: false,
                            });
                            form.is_use_custom_menu = false;
                            this.props.updateTheme(store_code, form);
                          }
                        }}
                      />
                      <label style={{ marginLeft: "7px" }} for="defaultCheck1">
                        Sử dụng Menu tùy chỉnh
                      </label>
                    </div>
                    {is_use_custom_menu && (
                      <div class="card mb-4">
                        <table class="table table-border">
                          <thead>
                            <tr>
                              <th>STT</th>
                              <th style={{ width: 150 }}>Tên</th>
                              <th>Link tới</th>
                              <th style={{ width: 200 }}>Hành động</th>
                            </tr>
                          </thead>

                          <SortableList
                            onSortEnd={this.onSortEnd}
                            className="resp-table-body"
                            draggedItemClassName="dragged"
                          >
                            {this.showDataMenus(menuList)}
                          </SortableList>
                        </table>

                        <div>
                          <button
                            style={{
                              marginRight: "10px",
                              marginBottom: 25,
                              marginTop: 10,
                            }}
                            type="button"
                            onClick={() => {
                              var newList = menuList;
                              newList.push({
                                name: "Tên menu",
                                link_to: "",
                              });
                              this.setState({
                                menuList: newList,
                                hasChange: true,
                              });
                            }}
                            class="btn btn-primary  btn-sm"
                          >
                            <i class="fas fa-plus"></i>
                          </button>

                          <button
                            style={{
                              marginRight: "10px",
                              marginBottom: 25,
                              marginTop: 10,
                            }}
                            disabled={this.state.hasChange ? false : true}
                            type="button"
                            onClick={this.saveMenu}
                            class={
                              this.state.hasChange
                                ? "btn btn-success btn-sm"
                                : "btn btn-secondary btn-sm"
                            }
                          >
                            <i class="fas fa-save"></i> Lưu
                          </button>
                        </div>
                      </div>
                    )}

                    <Slider
                      {...setting}
                      ref={(sliderHeader) => (this.sliderHeader = sliderHeader)}
                    >
                      {headerImg.map((v, i) => (
                        <ItemHeaderTheme
                          badges={badges}
                          chooseHeader={this.chooseHeader}
                          header_type={header_type}
                          indexHeader={i}
                          v={v}
                        />
                      ))}
                    </Slider>
                  </TabPanel>
                  <TabPanel>
                    <Slider
                      {...settingBanner}
                      ref={(sliderBanner) => (this.sliderBanner = sliderBanner)}
                    >
                      {bannerImg.map((v, i) => (
                        <ItemBannerTheme
                          badges={badges}
                          indexBanner={i}
                          chooseBanner={this.chooseBanner}
                          banner_type={banner_type}
                          S
                          v={v}
                        />
                      ))}
                    </Slider>
                  </TabPanel>
                  <TabPanel>
                    <div className="price__display">
                      <div className="price__display__title">
                        Hiển thị bộ đếm
                      </div>
                      <div className="price__display__content">
                        <div className="price__display__item">
                          <input
                            type="radio"
                            name="price__show"
                            id="price__viewed"
                            value={0}
                            checked={theme.option_total_show_type === 0}
                            onChange={this.onChangePriceShow}
                          />
                          <label htmlFor="price__viewed">
                            Chỉ hiển thị đã xem
                          </label>
                        </div>
                        <div className="price__display__item">
                          <input
                            type="radio"
                            name="price__show"
                            id="price__buyed"
                            value={1}
                            checked={theme.option_total_show_type === 1}
                            onChange={this.onChangePriceShow}
                          />
                          <label htmlFor="price__buyed">
                            Chỉ hiển thị đã bán
                          </label>
                        </div>
                        <div className="price__display__item">
                          <input
                            type="radio"
                            name="price__show"
                            id="price__all"
                            value={2}
                            checked={theme.option_total_show_type === 2}
                            onChange={this.onChangePriceShow}
                          />
                          <label htmlFor="price__all">
                            Hiển thị đã xem và đã bán
                          </label>
                        </div>
                      </div>
                    </div>
                    <Slider
                      {...setting}
                      ref={(sliderProduct) =>
                        (this.sliderProduct = sliderProduct)
                      }
                    >
                      {productImg.map((v, i) => (
                        <ItemProductTheme
                          badges={badges}
                          indexProduct={i}
                          chooseProduct={this.chooseProduct}
                          product_home_type={product_home_type}
                          v={v}
                        />
                      ))}
                    </Slider>
                  </TabPanel>
                  <TabPanel>
                    <Slider
                      {...setting}
                      ref={(sliderNews) => (this.sliderNews = sliderNews)}
                    >
                      {blogImg.map((v, i) => (
                        <ItemNewsTheme
                          badges={badges}
                          indexNews={i}
                          chooseNews={this.chooseNews}
                          post_home_type={post_home_type}
                          v={v}
                        />
                      ))}
                    </Slider>
                  </TabPanel>
                  <TabPanel>
                    <div class=" ml-3" style={{ height: "30px" }}>
                      <input
                        type="checkbox"
                        style={{ transform: "scale(1.5)" }}
                        checked={use_footer_html}
                        onChange={(e) => {
                          let checkbox = e.target;
                          var form = { ...this.props.theme };

                          if (checkbox.checked) {
                            this.setState({
                              use_footer_html: true,
                            });

                            form.is_use_footer_html = true;
                            this.props.updateTheme(store_code, form);
                          } else {
                            this.setState({
                              use_footer_html: false,
                            });
                            form.is_use_footer_html = false;
                            this.props.updateTheme(store_code, form);
                          }
                        }}
                      />
                      <label style={{ marginLeft: "7px" }} for="defaultCheck1">
                        Sử dụng footer tùy chỉnh
                      </label>
                    </div>

                    {!use_footer_html ? (
                      <Slider
                        {...setting}
                        ref={(sliderFooter) =>
                          (this.sliderFooter = sliderFooter)
                        }
                      >
                        {footerImg.map((v, i) => (
                          <ItemFooterTheme
                            badges={badges}
                            indexFooter={i}
                            chooseFooter={this.chooseFooter}
                            footer_type={footer_type}
                            v={v}
                          />
                        ))}
                      </Slider>
                    ) : (
                      <div class="card shadow mb-4">
                        <div class="card-body">
                          <section class="content">
                            <div class="row">
                              <div class="col-md-12 col-xs-12">
                                <div class="box">
                                  <FormFooterHtml
                                    html_footer={html_footer}
                                    theme={this.props.theme}
                                    store_code={this.props.store_code}
                                  />
                                </div>
                              </div>
                            </div>
                          </section>
                        </div>
                      </div>
                    )}
                  </TabPanel>
                </div>
              </form>

              <ModalDefaultReset
                theme={this.state.themeDefaultReset}
                resetTheme={this.props.resetTheme}
              />
            </div>
          </div>
        </Tabs>
      </OverviewStyles>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    badges: state.badgeReducers.allBadge,
  };
};
const mapDispatchToProps = (dispatch, props) => {
  return {
    updateTheme: (store_code, theme) => {
      dispatch(themeAction.updateTheme(store_code, theme));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Custom_Screen);
