import React, { Component } from "react";
import Sidebar from "../../components/Partials/Sidebar";
import Topbar from "../../components/Partials/Topbar";
import Footer from "../../components/Partials/Footer";
import ModalCreate from "../../components/Sale/Config/ModalCreate";
import ModalUpdate from "../../components/Sale/Config/ModalUpdate";
import ModalRemove from "../../components/Sale/Config/ModalRemove";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import NotAccess from "../../components/Partials/NotAccess";
import Config from "../../components/Sale/Config";
import ListSale from "../../components/Sale/ListSale";
import TopCommission from "../../components/Sale/TopComiss";

class Sale extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalremove: {
        title: "",
        id: "",
      },
      modalupdate: {},
      tabId: 0,
      type_bonus_period_import: 0,
    };
    this.defaultIndex =
      this.props.match.params.action == "request_payment" ? 2 : 0;
  }

  handleDelCallBack = (modal) => {
    this.setState({ modalremove: modal });
  };

  handleEditCallBack = (modal) => {
    this.setState({ modalupdate: modal });
  };
  fetchDataOnTap = (index) => {
    this.setState({ tabId: index });
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.isLoading != true &&
      typeof this.props.permission.product_list != "undefined"
    ) {
      var permissions = this.props.permission;
      var isShow = permissions.collaborator_list;
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      var tabIndex = urlParams.get("tab-index");
      if (!tabIndex) {
        tabIndex = 0;
      }
      this.defaultIndex = tabIndex;
      this.setState({
        isLoading: true,
        sale_list: true,
        config: true,
        isShow,
      });
    }
  }
  render() {
    var { store_code, id } = this.props.match.params;
    var { tabId, sale_list, config, isShow } = this.state;
    return (
      <div id="wrapper">
        <Sidebar store_code={store_code} />
        <div className="col-10 col-10-wrapper">
          <div id="content-wrapper" className="d-flex flex-column">
            <div id="content">
              <Topbar store_code={store_code} />
              {typeof isShow == "undefined" ? (
                <div style={{ height: "500px" }}></div>
              ) : isShow == true ? (
                <div className="container-fluid">
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <h4 className="h4 title_content mb-0 text-gray-800">
                      Sale
                    </h4>{" "}
                  </div>
                  <br></br>

                  <div className="card shadow mb-4">
                    <div className="card-body">
                      <Tabs
                        defaultIndex={this.defaultIndex}
                        onSelect={(index) => this.fetchDataOnTap(index)}
                      >
                        <TabList>
                          {config == true ? (
                            <Tab>
                              <Link
                                to={"?tab-index=0"}
                                style={{
                                  display: "flex",
                                  columnGap: "5px",
                                  alignItems: "center",
                                }}
                              >
                                {" "}
                                <i class="fa fa-cog"></i>
                                <span>Cấu hình sale</span>
                              </Link>
                            </Tab>
                          ) : null}
                          {sale_list == true ? (
                            <Tab>
                              <Link
                                to={"?tab-index=1"}
                                style={{
                                  display: "flex",
                                  columnGap: "5px",
                                  alignItems: "center",
                                }}
                              >
                                {" "}
                                <i class="fa fa-users"></i>
                                <span>Danh sách sale</span>
                              </Link>
                            </Tab>
                          ) : null}
                          {sale_list == true ? (
                            <Tab>
                              <Link
                                to={"?tab-index=2"}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  columnGap: "5px",
                                }}
                              >
                                {" "}
                                <i class="fa fa-chart-bar"></i>
                                <span> Top sale</span>
                              </Link>
                            </Tab>
                          ) : null}
                        </TabList>

                        {config == true ? (
                          <TabPanel>
                            <Config
                              tabId={tabId}
                              store_code={store_code}
                              handleEditCallBack={this.handleEditCallBack}
                              handleDelCallBack={this.handleDelCallBack}
                            />
                          </TabPanel>
                        ) : null}

                        {sale_list == true ? (
                          <TabPanel>
                            <ListSale tabId={tabId} store_code={store_code} />
                          </TabPanel>
                        ) : null}
                        {sale_list == true ? (
                          <TabPanel>
                            <TopCommission
                              paramId={id}
                              tabId={tabId}
                              store_code={store_code}
                            />
                          </TabPanel>
                        ) : null}
                      </Tabs>
                    </div>
                  </div>
                </div>
              ) : (
                <NotAccess />
              )}
            </div>
            <ModalCreate store_code={store_code} />
            <ModalRemove
              modal={this.state.modalremove}
              store_code={store_code}
            />
            <ModalUpdate
              modal={this.state.modalupdate}
              store_code={store_code}
            />

            <Footer />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.authReducers.login.authentication,
    permission: state.authReducers.permission.data,
  };
};
const mapDispatchToProps = (dispatch, props) => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(Sale);
