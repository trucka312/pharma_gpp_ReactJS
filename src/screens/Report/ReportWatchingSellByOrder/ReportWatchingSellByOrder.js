import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Alert from '../../../components/Partials/Alert';
import Footer from '../../../components/Partials/Footer';
import Sidebar from '../../../components/Partials/Sidebar';
import Topbar from '../../../components/Partials/Topbar';
import ShowLoading from '../../../components/Partials/ShowLoading';

import * as Types from '../../../constants/ActionType';
import * as reportAction from '../../../actions/report';
import * as Env from '../../../ultis/default';
import { format } from '../../../ultis/helpers';
import { MomentInput } from 'react-moment-input';
import moment from 'moment';
import Pagination from '../Pagination';
import { getBranchId, getBranchIds } from '../../../ultis/branchUtils';
import ShowData from '../ShowData';
import CustomPopover from '../components/Popovers.js';

class ReportRevenue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtStart: '',
      txtEnd: '',
      searchValue: '',
      perPage: 10,
    };
    this.debouncedSearch = _.debounce(this.handleSearchChange, 300);
  }
  componentDidMount() {
    const { store_code } = this.props.match.params;
    const branch_id = getBranchId();
    const branch_ids = getBranchIds();
    const branchIds = branch_ids ? branch_ids : branch_id;
    const params = `branch_id=${branch_id}`;
    this.props.fetchAllReportInventory(store_code, branchIds, 1, branch_ids ? '' : params);
    this.props.fetchImportExportStock(store_code, branchIds, 1, branch_ids ? '' : params);

    try {
      document.getElementsByClassName('r-input')[0].placeholder = 'Chọn ngày';
    } catch (error) {}
  }
  handeOnload = (store_code) => {
    const branch_id = getBranchId();
    const branch_ids = getBranchIds();
    const branchIds = branch_ids ? branch_ids : branch_id;
    const params = `branch_id=${branch_id}`;
    this.props.fetchAllReportInventory(store_code, branchIds, 1, branch_ids ? '' : params);
    try {
      document.getElementsByClassName('r-input')[0].placeholder = 'Chọn ngày';
    } catch (error) {}
  };
  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.txtStart !== nextState.txtStart) {
      const branch_id = getBranchId();
      const branch_ids = getBranchIds();
      const branchIds = branch_ids ? branch_ids : branch_id;

      const params = `date=${nextState.txtStart}${branch_ids ? '' : `&branch_id=${branch_id}`}`;
      const { store_code } = this.props.match.params;
      this.props.fetchAllReportInventory(store_code, branchIds, 1, params);
    }

    if (
      this.state.txtStart !== nextState.txtStart ||
      this.state.perPage !== nextState.perPage
    ) {
      // recall api 
    }
    return true;
  }

  onChangeStart = (e) => {
    var time = moment(e, 'DD-MM-YYYY').format('YYYY-MM-DD');
    console.log('time', time);
    this.setState({
      txtStart: time,
    });
  };

  onChangeEnd = (e) => {
    var time = moment(e, 'DD-MM-YYYY').format('YYYY-MM-DD');
    console.log('time end', time);
    this.setState({
      txtEnd: time,
    });
  };

  showDistribute = (listDistribute) => {
    var result = [];
    if (typeof listDistribute == 'undefined' || listDistribute.length === 0) {
      return result;
    }
    if (listDistribute[0].element_distributes) {
      listDistribute[0].element_distributes.map((element, _index) => {
        result.push(
          <tr class="explode" style={{ backgroundColor: '#f8f9fc' }}>
            <td colSpan={5}>
              <div className="show-distribute">
                <div className="row" style={{ padding: '10px' }}>
                  <div className="col-3" style={{ display: 'flex' }}>
                    <label style={{ fontWeight: 'bold' }}>Phân loại: </label>
                    <div className="name-distribute" style={{ marginLeft: '20px' }}>
                      {element.name}
                    </div>
                  </div>
                  <div className="col-3" style={{ display: 'flex' }}>
                    <label style={{ fontWeight: 'bold' }}>Giá vốn: </label>
                    <div className="price-distribute" style={{ marginLeft: '20px' }}>
                      {format(Number(element.cost_of_capital))}
                    </div>
                  </div>
                  <div className="col-3" style={{ display: 'flex' }}>
                    <label style={{ fontWeight: 'bold' }}>Tồn kho: </label>
                    <div className="quantity-distribute" style={{ marginLeft: '20px' }}>
                      {element.stock}
                    </div>
                  </div>
                  <div className="col-3" style={{ display: 'flex' }}>
                    <label style={{ fontWeight: 'bold' }}>Giá Nhập: </label>
                    <div className="quantity-distribute" style={{ marginLeft: '20px' }}>
                      {format(Number(element.import_price))}
                    </div>
                  </div>
                </div>
              </div>
            </td>
          </tr>,
        );
      });
    }
    return result;
  };

  showData = (products, per_page, current_page) => {
    var result = null;
    var { store_code } = this.props;
    if (typeof products === 'undefined') {
      return result;
    }
    if (products.length > 0) {
      result = products.map((data, index) => {
        var status_name = data.status == 0 ? 'Hiển thị' : 'Đã ẩn';
        var status_stock =
          data.quantity_in_stock_with_distribute == 0
            ? -2
            : data.quantity_in_stock_with_distribute == -1
            ? -1
            : data.quantity_in_stock_with_distribute;

        if (status_stock == null) {
          status_stock = -1;
        }

        var status =
          data.status == 0 ? 'success' : data.status == -1 ? 'secondary' : data.status == 2 ? 'danger' : null;
        var discount =
          typeof data.product_discount == 'undefined' || data.product_discount == null
            ? 0
            : data.product_discount.discount_price;

        var product_discount = data.product_discount;

        return (
          <ShowData
            per_page={per_page}
            current_page={current_page}
            product_discount={product_discount}
            status={status}
            status_name={status_name}
            status_stock={status_stock}
            data={data}
            index={index}
            store_code={store_code}
            discount={discount}
          />
        );
      });
    } else {
      return result;
    }
    return result;
  };

  handleFilterDate = () => {
    if (this.state.txtStart && this.state.txtEnd) {
      console.log('txtStart:', this.state.txtStart);
      console.log('txtEnd:', this.state.txtEnd);
    }
  };

  handleSearchChange = (e) => {
    console.log('valuea search', e.target.value);
  };

  handlePerPageChange = (e) => {
    const newPerPage = parseInt(e.target.value);
    this.setState({
      perPage: newPerPage,
    });
  };

  render() {
    var { store_code } = this.props.match.params;
    const { reportInventory, reportImportExport } = this.props;
    const { total_stock, total_value_stock } = reportInventory;
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
                  <h4 style={{color : '#333'}}>THEO DÕI BÁN THEO ĐƠN</h4>
                  {/* <!-- Button trigger modal --> */}
                  <button
                    type="button"
                    style={{ display: 'flex', alignItems: 'center', boxShadow: 'none' }}
                    class="btn btn-link"
                    data-toggle="modal"
                    data-target="#modalExportFile"
                  >
                    <i class="fas fa-file-download" style={{ color: '#333', paddingBottom: '16px' }}></i>
                    <p style={{ marginLeft: '4px' }}>Xuất phiếu theo dõi bán theo đơn</p>
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
                            Xuất danh sách bán theo đơn
                          </h5>
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div class="modal-body">...</div>
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
                      <p>Theo dõi bán theo đơn</p>
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
                  <div className="card-body">
                    <div class="table-responsive" style={{ overflowX: 'auto' }}>
                      <table
                        class="table  "
                        id="dataTable"
                        width="100%"
                        cellspacing="0"
                        style={{ overflow: 'scroll', alignItems: 'center',tableLayout: 'fixed' }}
                      >
                        <colgroup>
                          {/* Adjust the width of columns as needed */}
                          <col style={{ width: '80px' }} />
                          <col style={{ width: '120px' }} />
                          <col style={{ width: '220px' }} />
                          <col style={{ width: '220px' }} />
                          <col style={{ width: '220px' }} />
                          <col style={{ width: '120px' }} />
                          <col style={{ width: '220px' }} />
                          <col style={{ width: '120px' }} />
                          <col style={{ width: '220px' }} />
                          <col style={{ width: '120px' }} />
                          <col style={{ width: '140px' }} />
                        </colgroup>

                        <thead style={{ whiteSpace: 'nowrap' }}>
                          <tr>
                            <th>Ngày</th>
                            <th>Thu tiền mặt</th>
                            <th>Thu qua Chuyển khoản/Ví/Thẻ</th>
                            <th>Doanh thu bán trực tiếp</th>
                            <th>Doanh thu bán Online/COD</th>
                            <th>Tổng VAT</th>
                            <th>Doanh thu trước giảm giá</th>
                            <th>Giảm giá </th>
                            <th>Doanh thu chưa công nợ</th>
                            <th>Công nợ</th>
                            <th>Tổng doanh thu</th>
                          </tr>
                        </thead>

                        <tbody>
                          {typeof reportInventory.data != 'undefined' ? (
                            this.showData(reportInventory.data, reportInventory.per_page, reportInventory.current_page)
                          ) : (
                            <ShowLoading></ShowLoading>
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px', justifyContent: 'space-between' }}>
                      <span style={{ marginRight: '10px'}}>Số mục trên trang:</span>
                      <select value={this.state.perPage} onChange={this.handlePerPageChange} style={{width: '60px', height: '30px',fontSize: '14px', outline: 'none', }}>
                        <option style={{padding: '20px'}} value={10}>10</option>
                        <option style={{padding: '20px'}} value={20}>20</option>
                        <option style={{padding: '20px'}} value={50}>50</option>
                      </select>
                      <Pagination store_code={store_code} reportInventory={reportInventory} />
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
    reportInventory: state.reportReducers.reportInventory,
    reportImportExport: state.reportReducers.reportImportExport,
    currentBranch: state.branchReducers.branch.currentBranch,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    fetchAllReportInventory: (store_code, branch_id, page, params) => {
      dispatch(reportAction.fetchAllReportInventory(store_code, branch_id, page, params));
    },
    fetchImportExportStock: (store_code, branch_id, page, params) => {
      dispatch(reportAction.fetchImportExportStock(store_code, branch_id, page, params));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ReportRevenue);
