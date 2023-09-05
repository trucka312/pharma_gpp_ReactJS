import { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import * as customerAction from "../../actions/customer";
import moment from "moment";
import PaginationHistory from "../Customer/PaginationHistory";

const ModalHistoryLevelStyles = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
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

class ModalHistoryLevel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
    };
  }

  componentDidMount() {
    const { page } = this.state;
    this.handleHistoriesLevelCustomer(page);
  }
  shouldComponentUpdate(nextProps, nextState) {
    const { page } = this.state;
    if (page !== nextState.page) {
      this.handleHistoriesLevelCustomer(nextState.page);
    }

    return true;
  }

  handleHistoriesLevelCustomer = (page) => {
    const { historiesLevel, store_code, historyLevelSelected } = this.props;
    const queryString = `page=${page}`;
    historiesLevel(store_code, historyLevelSelected.id, queryString);
  };
  handleCloseModalDelete = () => {
    this.props.setHistoryLevelSelected(null);
  };

  setPage = (page) => {
    this.setState({ page });
  };
  render() {
    const { allHistoriesLevel } = this.props;
    console.log("🚀 ~ file:  render ~ historiesLevel:", allHistoriesLevel);

    const dataHistoriesLevel = allHistoriesLevel.data || [];
    return (
      <ModalHistoryLevelStyles
        className="modal"
        style={{
          display: "block",
        }}
      >
        <div
          className="modal-dialog"
          role="document"
          style={{
            maxWidth: "870px",
          }}
        >
          <div className="modal-content">
            <div className="modal-header" style={{ backgroundColor: "white" }}>
              <h4
                style={{
                  marginBottom: "0px",
                }}
              >
                Lịch sử thay đổi cấp
              </h4>
              <button
                type="button"
                className="close"
                onClick={this.handleCloseModalDelete}
              >
                <span>&times;</span>
              </button>
            </div>
            <div
              class="modal-body-content"
              style={{
                height: "75vh",
                overflow: "auto",
                padding: "1rem",
              }}
            >
              <table class="table table-border">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Cấp trước đó</th>
                    <th>Cấp hiện tại</th>
                    <th>Ghi chú</th>
                    <th>Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {dataHistoriesLevel.length > 0 &&
                    dataHistoriesLevel.map((history, index) => (
                      <tr key={history.id}>
                        <td>
                          {(allHistoriesLevel.current_page - 1) *
                            allHistoriesLevel.per_page +
                            (index + 1)}
                        </td>
                        <td>{history.before_level}</td>
                        <td>{history.last_level}</td>
                        <td>{history.note}</td>
                        <td>
                          {moment(history.created_at).format(
                            "HH:mm:ss DD/MM/YYYY"
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 16px",
              }}
            >
              <PaginationHistory
                allHistoriesLevel={this.props.allHistoriesLevel}
                setPage={this.setPage}
              ></PaginationHistory>
              <div
                className="btn btn-outline-danger"
                onClick={this.handleCloseModalDelete}
              >
                Hủy
              </div>
            </div>
          </div>
        </div>
      </ModalHistoryLevelStyles>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    allHistoriesLevel: state.customerReducers.customer.allHistoriesLevel,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    historiesLevel: (store_code, idCustomer) => {
      dispatch(customerAction.historiesLevel(store_code, idCustomer));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalHistoryLevel);
