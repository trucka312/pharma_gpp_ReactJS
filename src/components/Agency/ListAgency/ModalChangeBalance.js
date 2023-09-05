import { Component } from "react";
import themeData from "../../../ultis/theme_data";
import styled from "styled-components";
import { connect } from "react-redux";
import * as agencyAction from "../../../actions/agency";
import { formatNumberV2 } from "../../../ultis/helpers";
import moment from "moment";

const ModalChangeBalanceStyles = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  .formBalance {
    h5 {
      margin-bottom: 20px;
    }
    .item-balance {
      display: flex;
      flex-direction: column;
      row-gap: 5px;
      &:first-of-type {
        margin-bottom: 15px;
      }
      label {
        margin-bottom: 0;
      }
      input {
        border: 1px solid #e3e6f0;
        padding: 8px 15px;
        border-radius: 4px;
      }
    }
  }
  .modal-dialog {
    animation: popup 1s ease-in-out 1;
  }
  @keyframes popup {
    0% {
      opacity: 0;
      transform: translateY(-50px);
    }
    50% {
      opacity: 1;
      transform: translateY(10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }
`;

class ModalChangeBalance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorPrice: "",
      balance: {
        money: "",
        reason: "",
      },
    };
  }

  handleCloseModalDeleteOrder = () => {
    this.props.setAgencySelectedForChangeBalance({});
  };
  convertDate = (date) => {
    const newDate = moment(date).format("YYYY-MM-DD HH:mm:ss");
    return newDate;
  };
  handleChangeBalance = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const { balance } = this.state;
    this.setState({
      balance: {
        ...balance,
        [name]: name === "money" ? formatNumberV2(value) : value,
      },
    });
  };
  handleSubmitChangeBalance = (e) => {
    const { balance } = this.state;
    const {
      changePriceBalance,
      store_code,
      agencySelectedForChangeBalance,
      isSub,
    } = this.props;
    e.preventDefault();
    if (balance.money === "") {
      this.setState({ errorPrice: "Vui lòng nhập số tiền!" });
      return;
    }
    const newBalance = {
      ...balance,
      is_sub: isSub,
      money: Number(balance.money.toString().replace(/\./g, "")),
    };
    changePriceBalance(
      store_code,
      agencySelectedForChangeBalance.id,
      newBalance
    );
  };

  render() {
    const { agencySelectedForChangeBalance, isSub } = this.props;
    return (
      <ModalChangeBalanceStyles
        className="modal "
        style={{
          display: "block",
        }}
      >
        <div
          className="modal-dialog"
          role="document"
          style={{
            maxWidth: "600px",
          }}
        >
          <div className="modal-content">
            <div className="modal-header" style={{ backgroundColor: "white" }}>
              <h4
                style={{
                  marginBottom: "0px",
                }}
              >
                {isSub ? "Trừ số dư" : "Cộng số dư"}
              </h4>
              <button
                type="button"
                className="close"
                onClick={this.handleCloseModalDeleteOrder}
              >
                <span>&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form
                onSubmit={this.handleSubmitChangeBalance}
                className="formBalance"
              >
                <h5>
                  Số dư hiện tại:{" "}
                  <span
                    style={{
                      fontWeight: "600",
                      fontSize: "18px",
                    }}
                  >
                    {formatNumberV2(agencySelectedForChangeBalance.balance)} VND
                  </span>
                </h5>
                <div className="item-balance">
                  <label htmlFor="money">Tiền</label>
                  <input
                    type="text"
                    id="money"
                    placeholder={`Nhập số tiền ${
                      isSub ? "cần trừ..." : "cần cộng..."
                    }`}
                    name="money"
                    value={this.state.balance.money}
                    onChange={this.handleChangeBalance}
                  />
                  {this.state.errorPrice !== "" ? (
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#e74c3c",
                      }}
                    >
                      {this.state.errorPrice}
                    </div>
                  ) : null}
                </div>
                <div className="item-balance">
                  <label htmlFor="reason">Lý do</label>
                  <input
                    type="text"
                    id="reason"
                    placeholder="Lý do..."
                    name="reason"
                    value={this.state.balance.reason}
                    onChange={this.handleChangeBalance}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    columnGap: "15px",
                    marginTop: "20px",
                  }}
                >
                  <button type="submit" className="btn btn-outline-primary">
                    Cập nhật
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={this.handleCloseModalDeleteOrder}
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </ModalChangeBalanceStyles>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changePriceBalance: (store_code, idAgency, data) => {
      dispatch(agencyAction.changePriceBalance(store_code, idAgency, data));
    },
  };
};

export default connect(null, mapDispatchToProps)(ModalChangeBalance);
