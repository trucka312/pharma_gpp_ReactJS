import React, { Component } from "react";
import * as Env from "../../../ultis/default";
import { connect } from "react-redux";
import ModalImg from "../ModalImg";
import styled from "styled-components";
import { formatNumberV2 } from "../../../ultis/helpers";
import * as Types from "../../../constants/ActionType";
import * as accumulateAction from "../../../actions/accumulate_point";

const AccumulatePointStyles = styled.div``;
class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadFrist: false,
      modalImg: "",
    };
  }

  handleRequestPoint = (data, e) => {
    const { store_code, confirmRequestBonusPoint } = this.props;
    const value = e.target.value;

    confirmRequestBonusPoint(store_code, data.id, {
      status: value,
    });
  };

  showData = (allRequestBonusPoint) => {
    var result = null;
    if (allRequestBonusPoint.length > 0) {
      result = allRequestBonusPoint.map((data, index) => {
        var avatar = data.image == null ? Env.IMG_NOT_FOUND : data.image;
        return (
          <React.Fragment>
            <tr class="sub-container hover-product">
              <td>
                {(this.props.allRequestBonusPoint.current_page - 1) *
                  Number(this.props.allRequestBonusPoint.per_page) +
                  index +
                  1}
              </td>
              <td>{data.customer?.name}</td>
              <td>{data.customer?.phone_number}</td>
              <td>
                {data.accumulate_point?.point
                  ? formatNumberV2(data.accumulate_point?.point)
                  : 0}
              </td>
              <td>{data.accumulate_point?.name}</td>
              <td>
                {" "}
                <select
                  style={{ width: "100%" }}
                  name="status"
                  id="input"
                  value={data.status === null ? "0" : data.status}
                  onChange={(e) => this.handleRequestPoint(data, e)}
                  className="form-control"
                >
                  {data.status == Types.STATUS_BONUS_POINT_PROCESSING && (
                    <option value={Types.STATUS_BONUS_POINT_PROCESSING}>
                      Chờ duyệt
                    </option>
                  )}

                  <option value={Types.STATUS_BONUS_POINT_APPROVED}>
                    Đã duyệt
                  </option>
                  <option value={Types.STATUS_BONUS_POINT_CANCEL}>Hủy</option>
                </select>
              </td>
            </tr>
          </React.Fragment>
        );
      });
    } else {
      return result;
    }
    return result;
  };

  render() {
    var allRequestBonusPoint =
      typeof this.props.allRequestBonusPoint.data == "undefined"
        ? []
        : this.props.allRequestBonusPoint.data;

    return (
      <AccumulatePointStyles class="" style={{ overflow: "auto" }}>
        <ModalImg img={this.state.modalImg}></ModalImg>
        <table class="table table-border">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên khách hàng</th>
              <th>Số điện thoại</th>
              <th>Điểm thưởng</th>
              <th>Tên phần thưởng</th>
              <th
                style={{
                  width: "160px",
                }}
              >
                Trạng thái
              </th>
            </tr>
          </thead>

          <tbody>{this.showData(allRequestBonusPoint)}</tbody>
        </table>
      </AccumulatePointStyles>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    permission: state.authReducers.permission.data,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    confirmRequestBonusPoint: (store_code, id, data) => {
      dispatch(accumulateAction.confirmRequestBonusPoint(store_code, id, data));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Table);
