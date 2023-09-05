import React, { Component } from "react";
import * as Types from "../../constants/ActionType";
import Sidebar from "../../components/Partials/Sidebar";
import Topbar from "../../components/Partials/Topbar";
import Footer from "../../components/Partials/Footer";
import ModalCreate from "../../components/Collaborator/Config/ModalCreate";
import ModalUpdate from "../../components/Collaborator/Config/ModalUpdate";
import ModalRemove from "../../components/Collaborator/Config/ModalRemove";
import TopReport from "../../components/Collaborator/TopReport";

import Alert from "../../components/Partials/Alert";
import { Redirect, Link } from "react-router-dom";
import { connect } from "react-redux";
import Loading from "../Loading";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Config from "../../components/Collaborator/Config";
import ListCollaborator from "../../components/Collaborator/ListCollaborator";
import HistoryPayment from "../../components/Collaborator/HistoryPayment";
import RequestPayment from "../../components/Collaborator/RequestPayment";
import NotAccess from "../../components/Partials/NotAccess";

class collaborator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalremove: {
        title: "",
        id: "",
      },
      modalupdate: {},
      tabId: 0,
    };
    this.defaultIndex = this.props.match.params.action == "request_payment" ? 2 : 0
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
    if (this.state.isLoading != true && typeof this.props.permission.product_list != "undefined") {
      var permissions = this.props.permission
      // var payment_request_list = permissions.collaborator_payment_request_list
      // var config = permissions.collaborator_config
      // var payment_request_history = permissions.collaborator_payment_request_history
      // var collaborator_list = permissions.collaborator_list
      // var payment_request_solve = permissions.collaborator_payment_request_solve
      var isShow = permissions.collaborator_list

      
      // var isShow = payment_request_list == false && config == false && payment_request_history == false && collaborator_list == false ? false : true
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      var tabIndex = urlParams.get('tab-index');
      if (!tabIndex) {
        tabIndex = 0;
      }
      this.defaultIndex = tabIndex;
      this.setState({ isLoading: true, collaborator_list : true, payment_request_list : true, config : true, payment_request_history : true, payment_request_solve : true, isShow })

    }

  }
  render() {
    var { store_code, id } = this.props.match.params;
    var { tabId, tabDefault, collaborator_list, payment_request_list, config, payment_request_history, payment_request_solve, isShow } = this.state;
    return (
      <div id="wrapper">
        <Sidebar store_code={store_code} />
        <div className="col-10 col-10-wrapper">

          <div id="content-wrapper" className="d-flex flex-column">
            <div id="content">
              <Topbar store_code={store_code} />
              {typeof isShow == "undefined" ? <div style={{ height: "500px" }}></div> :
                isShow == true ?

                  <div className="container-fluid">
                    <Alert
                      type={Types.ALERT_UID_STATUS}
                      alert={this.props.alert}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <h4 className="h4 title_content mb-0 text-gray-800">
                        Cộng tác viên
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
                            {
                              config == true ? <Tab>
                                 <Link to ={"?tab-index=0"}>  <i class="fa fa-cog"></i>
                                <span>Cấu hình hoa hồng</span></Link>
                               
                               
                              </Tab> : null
                            }
                            {
                              collaborator_list == true ? <Tab>
                                <Link to ={"?tab-index=1"}> <i class="fa fa-users"></i>
                                <span>Danh sách cộng tác viên</span></Link>
                               
                              </Tab> : null
                            }
                            {
                              collaborator_list == true ? <Tab>
                                 <Link to ={"?tab-index=2"}>    <i class="fa fa-chart-bar"></i>
                                <span> Top doanh số</span></Link>
                             
                              </Tab> : null
                            }
                            {
                              payment_request_list == true ? <Tab>
                                  <Link to ={"?tab-index=3"}>     <i class="fas fa-list"></i>
                                <span> Danh sách yêu cầu thanh toán</span></Link>
                               
                              </Tab> : null
                            }
                            {
                              payment_request_history == true ? <Tab>
                                  <Link to ={"?tab-index=4"}>       <i class="fa fa-history"></i>
                                <span> Lịch sử thanh toán</span></Link>
                             
                              </Tab> : null
                            }



                          </TabList>

                          {config == true ? <TabPanel>
                            <Config
                              tabId={tabId}
                              store_code={store_code}
                              handleEditCallBack={this.handleEditCallBack}
                              handleDelCallBack={this.handleDelCallBack}
                            />
                          </TabPanel> : null}

                          {collaborator_list == true ? <TabPanel>
                            <ListCollaborator tabId={tabId} store_code={store_code} />
                          </TabPanel> : null}
                          {collaborator_list == true ? <TabPanel>
                            <TopReport paramId={id} tabId={tabId} store_code={store_code} payment_request_solve={payment_request_solve} />
                          </TabPanel> : null}
                          {payment_request_list == true ? <TabPanel>
                            <RequestPayment paramId={id} tabId={tabId} store_code={store_code} payment_request_solve={payment_request_solve} />
                          </TabPanel> : null}
                          {payment_request_history == true ? <TabPanel>
                            <HistoryPayment tabId={tabId} store_code={store_code} />
                          </TabPanel> : null}




                        </Tabs>
                      </div>
                    </div>
                  </div>
                  : <NotAccess />}

            </div>
            <ModalCreate store_code={store_code} />
            <ModalRemove modal={this.state.modalremove} store_code={store_code} />
            <ModalUpdate modal={this.state.modalupdate} store_code={store_code} />

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
export default connect(mapStateToProps, mapDispatchToProps)(collaborator);
