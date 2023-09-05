import { PureComponent } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import * as packageProductAction from "../../actions/package_product";
import { connect } from "react-redux";
import alertYesOrNo from "../../ultis/alert";
import ModalCustom from "../ModalCustom/ModalCustom";

const TableStyles = styled.div`
  .hover-totalProduct {
    &:hover {
      text-decoration: underline;
    }
  }
`;

class Table extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      timeAccess: "",
      packageSelected: null,
    };
  }

  handleChangeAvalibleDay = (packageData) => {
    this.setState({
      packageSelected: packageData,
      timeAccess: packageData.avalible_after_days,
    });
  };

  onChangeTime = () => {
    const { changePackageProduct, store_code } = this.props;
    const { packageSelected, timeAccess } = this.state;
    changePackageProduct(
      store_code,
      packageSelected.level,
      {
        avalible_after_days: timeAccess,
      },
      () => {
        this.setState({ packageSelected: null });
      }
    );
  };

  showData = (packageProduct) => {
    const { store_code } = this.props;
    if (packageProduct.length > 0) {
      return packageProduct.map((packageItem, index) => (
        <tr className="hover-product" key={packageItem.id}>
          <td>{packageItem.level}</td>
          <td className="primary hover-totalProduct">
            <Link
              to={`/product/index/${store_code}?level=${packageItem.level}`}
            >
              {packageItem.total_product}
            </Link>
          </td>
          {index === 0 ? (
            <td></td>
          ) : (
            <td>
              <span
                className="primary"
                onClick={() => this.handleChangeAvalibleDay(packageItem)}
              >
                {packageItem.avalible_after_days
                  ? packageItem.avalible_after_days
                  : 0}{" "}
                ngày <i className="fa fa-history"></i>
              </span>
            </td>
          )}
        </tr>
      ));
    }
    return [];
  };

  render() {
    const packageProduct =
      typeof this.props.packageProduct === "undefined"
        ? []
        : this.props.packageProduct;
    const { packageSelected, timeAccess } = this.state;
    return (
      <TableStyles class="table-responsive">
        <table
          className="table table-border "
          id="dataTable"
          width="100%"
          cellSpacing="0"
        >
          <thead>
            <tr>
              <th>Cấp</th>
              <th>Tổng sản phẩm</th>
              <th>Thời gian kích hoạt sau</th>
            </tr>
          </thead>
          <tbody>{this.showData(packageProduct)}</tbody>
        </table>
        {packageSelected && (
          <ModalCustom
            title="Thời gian kích hoạt"
            style={{
              height: "200px",
            }}
            styleHeader={{}}
            openModal={packageSelected}
            setOpenModal={() => {
              this.setState({ packageSelected: null });
            }}
          >
            <div
              style={{
                padding: "5px 10px",
              }}
            >
              <label htmlFor="time_access">Thời gian</label>
              <input
                type="text"
                id="time_access"
                name="time_access"
                value={timeAccess}
                className="form-control"
                placeholder="Thời gian kích hoạt"
                onChange={(e) => this.setState({ timeAccess: e.target.value })}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "10px",
                  columnGap: "10px",
                }}
              >
                <button
                  className="btn btn-secondary"
                  onClick={() => this.setState({ packageSelected: null })}
                >
                  Hủy
                </button>
                <button className="btn btn-primary" onClick={this.onChangeTime}>
                  Lưu
                </button>
              </div>
            </div>
          </ModalCustom>
        )}
      </TableStyles>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    packageProduct: state.packageProductReducers.package_product.packageProduct,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    changePackageProduct: (store_code, id, data, funcModal) => {
      dispatch(
        packageProductAction.changePackageProduct(
          store_code,
          id,
          data,
          funcModal
        )
      );
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Table);
