import React, { Component } from "react";
import * as Types from "../../constants/ActionType";
import Sidebar from "../../components/Partials/Sidebar";
import Topbar from "../../components/Partials/Topbar";
import Footer from "../../components/Partials/Footer";
import ModalDelete from "../../components/Blog/Delete/Modal";
import Pagination from "../../components/Blog/Pagination";
import Table from "../../components/Blog/Table";
import Alert from "../../components/Partials/Alert";
import { Redirect, Link } from "react-router-dom";
import { connect } from "react-redux";
import Loading from "../Loading";
import * as blogAction from "../../actions/blog";
import NotAccess from "../../components/Partials/NotAccess";

class Bloglog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: {
        title: "",
        id: "",
        name: "",

      },
      numPage: 20

    };
  }

  onChangeNumPage = (e) => {
    var { store_code } = this.props.match.params;
    // var {searchValue} = this.state
    var numPage = e.target.value
    this.setState({
      numPage
    })
    var params = `&limit=${numPage}`

    this.props.fetchAllBlog(store_code, 1, params);
  }


  handleDelCallBack = (modal) => {
    this.setState({ modal: modal });
  };

  componentDidMount() {
    this.props.fetchAllBlog(this.props.match.params.store_code);
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.isLoading != true && typeof nextProps.permission.product_list != "undefined") {
      var permissions = nextProps.permission
      // var insert = permissions.post_add
      // var update = permissions.post_update
      // var _delete = permissions.post_remove_hide
      var isShow = permissions.post_list
      this.setState({ isLoading: true, insert:true, update:true, _delete:true, isShow })
    }
  }
  onChangeSearch = (e) => {
    this.setState({ searchValue: e.target.value });
  };

  searchData = (e) => {
    e.preventDefault();
    var { store_code } = this.props.match.params;
    var { searchValue } = this.state;
    var params = `&search=${searchValue}`;
    this.setState({ numPage: 20 });
    this.props.fetchAllBlog(store_code, 1, params);
  };

  render() {
    var { store_code } = this.props.match.params
    var { blogs } = this.props
    var { numPage,searchValue } = this.state
    var { insert, update, _delete, isShow } = this.state

    if (this.props.auth) {
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
                      <div
                        style={{ display: "flex", justifyContent: "space-between" }}
                      >
                        <h4 className="h4 title_content mb-0 text-gray-800">
                        Tin tức - Bài viết
                                                </h4>{" "}
                        <Link to={`/posts/create/${store_code}`}
                          class={`btn btn-info btn-icon-split btn-sm ${insert == true ? "show" : "hide"}`}
                        >
                          <span class="icon text-white-50">
                            <i class="fas fa-plus"></i>
                          </span>
                          <span class="text">Thêm bài viết</span>
                        </Link>
                      </div>

                      <br></br>
                      <div className="card shadow ">
                        <div className="card-header">
                          <div class="row" style={{ "justify-content": "space-between" }}>
                            <form onSubmit={this.searchData}>
                              <div
                                class="input-group mb-6"
                                style={{ padding: "0 20px" }}
                              >
                                <input
                                  style={{ maxWidth: "400px", minWidth: "300px" }}
                                  type="search"
                                  name="txtSearch"
                                  value={searchValue}
                                  onChange={this.onChangeSearch}
                                  class="form-control"
                                  placeholder="Tìm theo tên bài viết"
                                />
                                <div class="input-group-append">
                                  <button
                                    class="btn btn-primary"
                                    type="submit"

                                  >
                                    <i class="fa fa-search"></i>
                                  </button>
                                </div>

                              </div>
                              {/* <p class="total-item" id="sale_user_name">
                                <span className="num-total_item" >{products.total}&nbsp;</span><span className="text-total_item" id="user_name">sản phẩm</span>
                              </p> */}
                            </form>
                            <div style={{ display: "flex" }}>

                              <div style={{ display: "flex" }}>
                                <span
                                  style={{
                                    margin: "20px 10px auto auto"
                                  }}
                                >Hiển thị</span>
                                <select
                                  style={{
                                    margin: "auto",
                                    marginTop: "10px",
                                    marginRight: "20px",
                                    width: "70px",
                                  }}
                                  onChange={this.onChangeNumPage}

                                  value={numPage}
                                  name="numPage" class="form-control" >
                                  <option value="10">10</option>
                                  <option value="20" selected>20</option>
                                  <option value="50">50</option>
                                </select>
                              </div>


                              {/* <Pagination limit={numPage}
                        searchValue = {searchValue}
                          passNumPage={this.passNumPage} store_code={store_code} products={products} /> */}


                            </div>


                          </div>
                        </div>

                        <div className="card-body">
                          <Table update={update} _delete={_delete} store_code={store_code} handleDelCallBack={this.handleDelCallBack} blogs={blogs} />

                          <Pagination
                            limit={numPage}

                            store_code={store_code}
                            blogs={blogs}
                          />
                        </div>
                      </div>
                    </div>
                    : <NotAccess />}

              </div>

              <Footer />
            </div>
            <ModalDelete store_code={store_code} modal={this.state.modal} />
          </div>
        </div>

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
    blogs: state.blogReducers.blog.allBlog,
    auth: state.authReducers.login.authentication,
    alert: state.blogReducers.alert.alert_success,
    permission: state.authReducers.permission.data,

  };
};
const mapDispatchToProps = (dispatch, props) => {
  return {
    fetchAllBlog: (id, page, params) => {
      dispatch(blogAction.fetchAllBlog(id, page, params));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Bloglog);
