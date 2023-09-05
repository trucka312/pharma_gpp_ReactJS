import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Alert from '../../../components/Partials/Alert';
import Footer from '../../../components/Partials/Footer';
import Sidebar from '../../../components/Partials/Sidebar';
import Topbar from '../../../components/Partials/Topbar';

import * as Types from '../../../constants/ActionType';
import * as reportAction from '../../../actions/report';
import { MomentInput } from 'react-moment-input';
import moment from 'moment';
import Pagination from './Pagination';
import CustomPopover from '../components/Popovers.js';

class ReportRevenue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtStart: '',
      txtEnd: '',
      searchValue: '',
      perPage: 20,
      isDateFiltered: false,
    };
    this.debouncedSearch = _.debounce(this.handleSearchChange, 300);
  }
  componentDidMount() {
    const { store_code } = this.props.match.params;
    const params = '';
    this.props.fetchAllReportGrossProfit(store_code, params);
    try {
      document.getElementsByClassName('r-input')[0].placeholder = 'Chọn ngày';
    } catch (error) {}
  }
  handeOnload = (store_code) => {
    const params = `&search=${this.searchValue}&date_from=${this.txtStart ? this.txtStart : ''}&date_to=${
      this.txtEnd ? this.txtEnd : ''
    }&page=${this.page ? this.page : 1}&limit=${this.perPage ? this.perPage : 10}}`;
    this.props.fetchAllReportGrossProfit(store_code, params);
    try {
      document.getElementsByClassName('r-input')[0].placeholder = 'Chọn ngày';
    } catch (error) {}
  };
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.searchValue !== nextState.searchValue ||
      this.state.perPage !== nextState.perPage ||
      this.state.isDateFiltered !== nextState.isDateFiltered
    ) {
      const params = `${nextState.searchValue ? `&search=${nextState.searchValue}` : ''}&date_from=${
        nextState.txtStart ? nextState.txtStart : ''
      }&date_to=${nextState.txtEnd ? nextState.txtEnd : ''}${nextState.page ? `&page=${nextState.page}` : ''}${
        nextState.perPage ? `&limit=${nextState.perPage}` : ''
      }`;
      const { store_code } = this.props.match.params;
      this.props.fetchAllReportGrossProfit(store_code, params);
    }
    return true;
  }

  // set time date picker
  onChangeStart = (e) => {
    var time = moment(e, 'DD-MM-YYYY').format('YYYY-MM-DD');
    this.setState({
      txtStart: time,
    });
  };

  // set time date picker
  onChangeEnd = (e) => {
    var time = moment(e, 'DD-MM-YYYY').format('YYYY-MM-DD');
    this.setState({
      txtEnd: time,
    });
  };

  handleFilterDate = () => {
    // const params = `${this.state.searchValue ? `&search=${this.state.searchValue}` : ''}${
    //   this.state.txtStart ? `&date_from=${this.state.txtStart}` : ''
    // }${this.state.txtEnd ? `&date_to=${this.state.txtEnd}` : ''}${this.state.page ? `&page=${this.state.page}` : ''}${
    //   this.state.perPage ? `&limit=${this.state.perPage}` : ''
    // }`;

    this.setState({
      isDateFiltered: true,
    });

    // const { store_code } = this.props.match.params;
    // this.props.fetchAllReportGrossProfit(store_code, params);
  };

  handleSearchChange = (e) => {
    const searchKeyWord = e.target.value;
    this.setState({ searchValue: searchKeyWord });
  };

  handlePerPageChange = (e) => {
    const newPerPage = parseInt(e.target.value);
    this.setState({
      perPage: newPerPage,
    });
  };

  render() {
    var { store_code } = this.props.match.params;
    const { reportInventory } = this.props;
    return (
      <div id="wrapper">
        <Sidebar store_code={store_code} />
        <div className="col-10 col-10-wrapper">
          <div id="content-wrapper" className="d-flex flex-column">
            <div id="content">
              <Topbar store_code={store_code} handeOnload={this.handeOnload} />

              <div className="container-fluid">
                <Alert type={Types.ALERT_UID_STATUS} alert={this.props.alert} />
                <div className="">
                  <h4 style={{ color: '#333' }}>DOANH THU - LỢI NHUẬN GỘP</h4>
                  {/* <!-- Button trigger modal --> */}
                  <button
                    type="button"
                    style={{ display: 'flex', alignItems: 'center', boxShadow: 'none' }}
                    class="btn btn-link"
                    data-toggle="modal"
                    data-target="#modalExportFile"
                  >
                    <i class="fas fa-file-download" style={{ color: '#333', paddingBottom: '16px' }}></i>
                    <p style={{ marginLeft: '4px' }}>Xuất phiếu doanh thu - lợi nhuận gộp</p>
                  </button>

                  {/* <!-- Modal --> */}
                  <div
                    class="modal fade"
                    id="modalExportFile"
                    tabindex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalCenterTitle"
                    aria-hidden="true"
                  >
                    <div class="modal-dialog modal-dialog-centered" role="document">
                      <div class="modal-content">
                        <div class="modal-header" style={{ background: '#f5f5f5' }}>
                          <h5 class="modal-title" id="exampleModalLongTitle" style={{ color: '#000000' }}>
                            Xuất danh sách doanh thu - lợi nhuận gộp
                          </h5>
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div class="modal-body"></div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-outline-primary" data-dismiss="modal">
                            Hủy
                          </button>
                          <button type="button" class="btn btn-primary">
                            Xuất file
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header py-3">
                    <div className="stock-title">
                      <p>Doanh thu - lợi nhuận gộp</p>
                    </div>

                    <div
                      class="form-group"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {/* dropdown time*/}
                      <CustomPopover buttonText="Thời gian" popoverWidth="100px">
                        <div>
                          <p style={{ marginTop: '-5px', padding: '4px', marginBottom: '5px' }}>Từ ngày</p>
                          <MomentInput
                            placeholder="Từ ngày"
                            format="DD-MM-YYYY"
                            options={true}
                            enableInputClick={true}
                            monthSelect={true}
                            readOnly={true}
                            translations={{
                              DATE: 'Ngày',
                              TIME: 'Giờ',
                              SAVE: 'Đóng',
                              HOURS: 'Giờ',
                              MINUTES: 'Phút',
                            }}
                            onChange={this.onChangeStart}
                          />

                          <p style={{ marginTop: '10px', padding: '4px', marginBottom: '-5px' }}>Đến ngày</p>
                          <MomentInput
                            style={{ margin: '10px 0' }}
                            placeholder="Đến ngày"
                            format="DD-MM-YYYY"
                            options={true}
                            enableInputClick={true}
                            monthSelect={true}
                            readOnly={true}
                            translations={{
                              DATE: 'Ngày',
                              TIME: 'Giờ',
                              SAVE: 'Đóng',
                              HOURS: 'Giờ',
                              MINUTES: 'Phút',
                            }}
                            onChange={this.onChangeEnd}
                          />

                          <button
                            style={{
                              width: '45px',
                              background: '#f5f5f5',
                              border: '1px solid #c4c4c4',
                              outline: 'none',
                            }}
                            onClick={this.handleFilterDate}
                          >
                            Lọc
                          </button>
                        </div>
                      </CustomPopover>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          border: 'solid 1px #c4c4c4',
                          borderRadius: '2px',
                          width: '100%',
                          paddingLeft: '5px',
                          outline: 'none',
                        }}
                      >
                        <i class="fas fa-search"></i>
                        <input
                          class="form-control"
                          type="text"
                          placeholder="Tìm kiếm"
                          style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
                          value={this.searchValue}
                          onChange={(e) => {
                            this.debouncedSearch(e);
                          }}
                        ></input>
                      </div>
                    </div>
                  </div>

                  {this.state.isDateFiltered && (
                    <div style={{ padding: '10px', background: '#f8f9fc', marginBottom: '20px' }}>
                      {/* Nội dung bạn muốn hiển thị */}
                      Ngày bắt đầu: {this.state.txtStart}, Ngày kết thúc: {this.state.txtEnd}
                      <i
                        className="fas fa-trash-alt"
                        style={{ marginLeft: '10px', cursor: 'pointer', color: 'red' }}
                        onClick={() => {
                          this.setState({
                            txtStart: '',
                            txtEnd: '',
                            isDateFiltered: false,
                          });
                        }}
                      ></i>
                    </div>
                  )}

                  <div className="card-body">
                    <div class="table-responsive" style={{ overflowX: 'auto' }}>
                      <table
                        class="table  "
                        id="dataTable"
                        width="100%"
                        cellspacing="0"
                        style={{ overflow: 'scroll', alignItems: 'center', tableLayout: 'fixed' }}
                      >
                        <colgroup>
                          {/* Adjust the width of columns as needed */}
                          <col style={{ width: '100px' }} />
                          <col style={{ width: '100px' }} />
                          <col style={{ width: '100px' }} />
                          <col style={{ width: '100px' }} />
                          <col style={{ width: '100px' }} />
                          <col style={{ width: '180px' }} />
                          <col style={{ width: '180px' }} />
                          <col style={{ width: '180px' }} />
                          <col style={{ width: '180px' }} />
                          <col style={{ width: '180px' }} />
                          <col style={{ width: '140px' }} />
                          <col style={{ width: '140px' }} />
                          <col style={{ width: '180px' }} />
                          <col style={{ width: '180px' }} />
                          <col style={{ width: '180px' }} />
                        </colgroup>
                        <thead style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                          <tr>
                            <th scope="col">Mã thuốc</th>
                            <th scope="col">Tên thuốc</th>
                            <th scope="col">Số lô</th>
                            <th scope="col">Hạn dùng</th>
                            <th scope="col">Đơn vị tính</th>
                            <th scope="col">Số lượng bán ra</th>
                            <th scope="col">Số lượng khách trả</th>
                            <th scope="col">Giá nhập chưa VAT</th>
                            <th scope="col">Giá bán chưa VAT</th>
                            <th scope="col">Giảm giá</th>
                            <th scope="col">Tổng giá vốn</th>
                            <th scope="col">Tổng giá trị trả lại	</th> 
                            <th scope="col">Tổng doanh thu thuần</th> 
                            <th scope="col">Lợi nhuận gộp</th> 
                            <th scope="col">Tỉ suất lợi nhuận(%)</th>
                          </tr>
                        </thead>

                        <tbody>
                          {typeof reportInventory.data !== 'undefined' ? (
                            reportInventory.data.map((data, index) => (
                              <tr key={index} style={{ textAlign: 'center' }}>
                                <td>{data.created_at || 0}</td>
                                <td>{data.sales_revenue || 0 || 0}</td>
                                <td>{data.sales_revenue || 0}</td>
                                <td>{data.real_money_for_sale || 0}</td>
                                <td>{data.sales_revenue || 0}</td>
                                <td>{data.tax_vat || 0}</td>
                                <td>{data.sales_revenue || 0}</td>
                                <td>{data.sales_revenue || 0}</td>
                                <td>{data.total_discount || 0}</td>
                                <td>{data.sales_revenue || 0}</td>
                                <td>{data.total_before_discount || 0}</td>
                              </tr>
                            ))
                          ) : (
                            <div style={{ width: '600px', height: '300px', textAlign: 'center', marginTop: '50px' }}>
                              <h3>Không tìm thấy.</h3>
                              <h4>Không tìm thấy dữ liệu phù hợp với điều kiện tìm kiếm</h4>
                              <h5>Thử thay đổi điều kiện lọc hoặc từ khóa tìm kiếm</h5>
                            </div>
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginRight: '20px',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ marginRight: '10px' }}>
                        Hiển thị {reportInventory.per_page} trên tổng số {reportInventory.total}
                      </span>
                      <select
                        value={this.state.perPage}
                        onChange={this.handlePerPageChange}
                        style={{
                          width: '60px',
                          height: '30px',
                          fontSize: '14px',
                          outline: 'none',
                          cursor: 'pointer',
                          borderColor: '#c4c4c4',
                        }}
                      >
                        <option style={{ padding: '20px' }} value={10}>
                          10
                        </option>
                        <option style={{ padding: '20px' }} value={20}>
                          20
                        </option>
                        <option style={{ padding: '20px' }} value={50}>
                          50
                        </option>
                      </select>
                      <Pagination
                        store_code={store_code}
                        reportInventory={reportInventory}
                        txtStart={this.state.txtStart}
                        txtEnd={this.state.txtEnd}
                        searchValue={this.state.searchValue}
                        perPage={this.state.perPage}
                        isDateFiltered={this.state.isDateFiltered}
                      />
                    </div>
                  </div>
                </div>
              </div>
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
    reportInventory: state.reportReducers.reportRevenueProfit,
    currentBranch: state.branchReducers.branch.currentBranch,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    fetchAllReportGrossProfit: (store_code, params) => {
      dispatch(reportAction.fetchReportGrossProfit(store_code, params));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ReportRevenue);
