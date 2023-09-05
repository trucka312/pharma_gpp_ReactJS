import { PureComponent } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import * as packageProductAction from "../../actions/package_product";
import Footer from "../../components/Partials/Footer";
import Sidebar from "../../components/Partials/Sidebar";
import Topbar from "../../components/Partials/Topbar";
import Loading from "../Loading";
import NotAccess from "../../components/Partials/NotAccess";
import Table from "../../components/PackageProduct/Table";

class PackageProduct extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillReceiveProps(nextProps) {
    if (
      this.state.isLoading !== true &&
      typeof nextProps.permission.customer_list !== "undefined"
    ) {
      const isShow = nextProps.permission.customer_list;
      this.setState({ isShow, isLoading: true });
    }
  }
  componentDidMount() {
    this.props.fetchPackageProduct(this.props.match.params.store_code);
  }

  render() {
    const { packageProduct } = this.props;
    const { store_code } = this.props.match.params;
    const { isShow } = this.state;
    console.log(packageProduct);
    console.log(store_code);
    if (this.props.auth) {
      return (
        <div id="wrapper">
          <Sidebar store_code={store_code} />

          <div className="col-10 col-10-wrapper">
            <div id="content-wrapper" className="d-flex flex-column">
              <div id="content">
                <Topbar store_code={store_code} />
                {typeof isShow === "undefined" ? (
                  <div style={{ height: "500px" }}></div>
                ) : isShow === true ? (
                  <div className="container-fluid">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <h4 className="h4 title_content mb-0 text-gray-800">
                        Danh sách gói sản phẩm
                      </h4>{" "}
                    </div>

                    <br></br>
                    <div className="card shadow mb-4">
                      <div className="card-body">
                        {packageProduct.length > 0 ? (
                          <Table
                            store_code={store_code}
                            packageProduct={packageProduct}
                          />
                        ) : (
                          <div
                            className="card-groupEmpty"
                            style={{
                              textAlign: "center",
                              color: "#858796",
                            }}
                          >
                            Chưa có gói sản phẩm nào!
                          </div>
                        )}
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
    } else if (this.props.auth === false) {
      return <Redirect to="/login"></Redirect>;
    } else {
      return <Loading></Loading>;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    packageProduct: state.packageProductReducers.package_product.packageProduct,
    auth: state.authReducers.login.authentication,
    permission: state.authReducers.permission.data,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    fetchPackageProduct: (store_code) => {
      dispatch(packageProductAction.fetchPackageProduct(store_code));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(PackageProduct);
