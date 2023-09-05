import React, { Component } from "react";
import { connect } from "react-redux";
import ModalUpload from "../Create/ModalUploadVIdeo";

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      video: null,
    };
  }

  // componentDidMount(){
  //     if(this.props.product && this.props.product.video_url)
  //     {
  //         this.setState({ video: this.props.video });
  //         this.props.handleDataFromProductVideo(nextProps.video)
  //     }
  // }

  componentWillReceiveProps(nextProps) {
    if (this.props.video !== nextProps.video) {
      this.setState({ video: nextProps.video });
      this.props.handleDataFromProductVideo(nextProps.video);
    }
    if (
      nextProps.product &&
      nextProps.product.video_url !== this.props.product.video_url &&
      nextProps.product.video_url !== null
    ) {
      this.setState({ video: nextProps.product.video_url });
      this.props.handleDataFromProductVideo(nextProps.product.video_url);
    }
  }

  render() {
    var { video } = this.state;

    console.log(video);
    return (
      <React.Fragment>
        <div style={{ marginLeft: "10px" }}>
          <div class="form-group">
            <div
              style={{
                display: "flex",
                marginBottom: "10px",
              }}
            >
              <label style={{ fontSize: "20px" }} for="product_name">
                Video sản phẩm
              </label>
              {!video && (
                <button
                  style={{ margin: "auto 0px auto 20px" }}
                  type="button"
                  class="btn btn-primary btn-sm"
                  data-toggle="modal"
                  data-target="#uploadVideo"
                >
                  <i class="fa fa-plus"></i> Upload Video
                </button>
              )}
            </div>
            {video && (
              <div
                style={{
                  position: "relative",
                  width: "320px",
                  height: "160px",
                }}
              >
                <video width="320" height="160" controls>
                  <source src={video} type="video/mp4" />
                </video>
                <div
                  className="box-icon"
                  style={{
                    position: "absolute",
                    top: "0",
                    right: "0",
                    transform: "translate(50%,-50%)",
                  }}
                  onClick={() => this.setState({ video: null })}
                >
                  <i className="fas cursor fa-times-circle"></i>
                </div>
              </div>
            )}
          </div>
          {/* <div class="form-group">
                        <div class="kv-avatar">
                            <div>
                                <button
                                    type="button"
                                    class="btn btn-primary btn-sm"
                                    data-toggle="modal"
                                    data-target="#uploadVideo"
                                >
                                    <i class="fa fa-plus"></i> Upload Video
                                </button>
                            </div>
                        </div>
                    </div> */}
        </div>

        <ModalUpload />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    video: state.UploadReducers.productImg.product_video,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(Form);
