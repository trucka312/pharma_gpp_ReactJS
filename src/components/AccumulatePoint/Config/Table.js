import React, { Component } from "react";
import * as Env from "../../../ultis/default";
import { connect } from "react-redux";
import ModalImg from "../ModalImg";
import styled from "styled-components";
import { formatNumberV2 } from "../../../ultis/helpers";

const AccumulatePointStyles = styled.div``;
class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadFrist: false,
      modalImg: "",
    };
  }
  showData = (allAccumulatePoint) => {
    var result = null;
    if (allAccumulatePoint.length > 0) {
      result = allAccumulatePoint.map((data, index) => {
        var avatar = data.image == null ? Env.IMG_NOT_FOUND : data.image;
        return (
          <React.Fragment>
            <tr class="sub-container hover-product">
              <td>
                {(this.props.allAccumulatePoint.current_page - 1) *
                  Number(this.props.allAccumulatePoint.per_page) +
                  index +
                  1}
              </td>
              <td style={{ textAlign: "center" }}>
                <img
                  src={avatar}
                  class="img-responsive"
                  width="90px"
                  height="90px"
                  alt="image-gift"
                />
              </td>
              <td>
                {data.video ? (
                  <video width="200px" height="90px" controls>
                    <source src={data.video} type="video/mp4" />
                  </video>
                ) : (
                  ""
                )}
              </td>
              <td>{data.name}</td>
              <td>{data.point ? formatNumberV2(data.point) : 0}</td>
              <td>{data.note}</td>
              <td>
                <div style={{ display: "flex", gap: "5px" }}>
                  <button
                    className="btn btn-outline-warning btn-sm show"
                    data-toggle="modal"
                    data-target="#updateAcculatePointModal"
                    onClick={() =>
                      this.props.handleShowModal({
                        id: data.id,
                        name: data.name,
                        point: data.point,
                        image: data.image,
                        video: data.video,
                        note: data.note,
                      })
                    }
                  >
                    <i className="fa fa-edit" /> Sửa
                  </button>

                  <button
                    className="btn btn-outline-danger btn-sm show"
                    data-toggle="modal"
                    data-target="#removeAcculatePointModal"
                    onClick={() =>
                      this.props.handleShowModal({
                        id: data.id,
                        name: data.name,
                        point: data.point,
                        image: data.image,
                        video: data.video,
                        note: data.note,
                      })
                    }
                  >
                    <i
                      className="fa fa-trash"
                      style={{
                        marginBottom: "0px",
                        marginRight: "0px",
                        marginTop: "0px",
                      }}
                    />
                  </button>
                </div>
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
    var allAccumulatePoint =
      typeof this.props.allAccumulatePoint.data == "undefined"
        ? []
        : this.props.allAccumulatePoint.data;

    return (
      <AccumulatePointStyles class="" style={{ overflow: "auto" }}>
        <ModalImg img={this.state.modalImg}></ModalImg>
        <table class="table table-border">
          <thead>
            <tr>
              <th>STT</th>
              <th>Ảnh</th>
              <th>Video</th>
              <th>Tên phần thưởng</th>
              <th>Điểm thưởng</th>
              <th>Ghi chú</th>
              <th>Hành động</th>
            </tr>
          </thead>

          <tbody>{this.showData(allAccumulatePoint)}</tbody>
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
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(Table);
