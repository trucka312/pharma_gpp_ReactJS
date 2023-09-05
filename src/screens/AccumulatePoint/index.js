import React, { Component } from "react";
import * as Types from "../../constants/ActionType";
import Sidebar from "../../components/Partials/Sidebar";
import Topbar from "../../components/Partials/Topbar";
import Footer from "../../components/Partials/Footer";
import Alert from "../../components/Partials/Alert";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Config from "../../components/AccumulatePoint/Config";
import NotAccess from "../../components/Partials/NotAccess";
import RequestBonus from "../../components/AccumulatePoint/RequestBonus";

class AccumulatePoint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabId: 0,
    };
    this.defaultIndex = this.displayTabIndex();
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
  displayTabIndex = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    var tabIndex = urlParams.get("tab-index") || 0;
    return tabIndex;
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.isLoading != true &&
      typeof this.props.permission.product_list != "undefined"
    ) {
      var permissions = this.props.permission;
      var isShow = permissions.accumulate_point;

      var tabIndex = this.displayTabIndex();
      this.defaultIndex = tabIndex;
      this.setState({
        isLoading: true,
        isShow,
      });
    }
  }
  render() {
    var { store_code } = this.props.match.params;
    var { tabId, isShow } = this.state;
    isShow = true;
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
                  <Alert
                    type={Types.ALERT_UID_STATUS}
                    alert={this.props.alert}
                  />
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <h4 className="h4 title_content mb-0 text-gray-800">
                      Thưởng đạt điểm
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
                          {isShow == true ? (
                            <Tab>
                              <Link
                                to={"?tab-index=0"}
                                style={{
                                  display: "flex",
                                  columnGap: "5px",
                                  alignItems: "center",
                                }}
                              >
                                <i className="fa fa-gift"></i>
                                <span>Cấu hình đạt điểm</span>
                              </Link>
                            </Tab>
                          ) : null}
                          {isShow == true ? (
                            <Tab>
                              <Link
                                to={"?tab-index=1"}
                                style={{
                                  display: "flex",
                                  columnGap: "5px",
                                  alignItems: "center",
                                }}
                              >
                                <i className="fas fa-list"></i>
                                <span>Danh sách yêu cầu thưởng</span>
                              </Link>
                            </Tab>
                          ) : null}
                        </TabList>

                        {isShow == true ? (
                          <TabPanel>
                            <Config tabId={tabId} store_code={store_code} />
                          </TabPanel>
                        ) : null}

                        {isShow == true ? (
                          <TabPanel>
                            <RequestBonus
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
    alert: state.collaboratorReducers.alert.alert_uid_config,
    permission: state.authReducers.permission.data,
  };
};
const mapDispatchToProps = (dispatch, props) => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(AccumulatePoint);
