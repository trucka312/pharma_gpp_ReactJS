import React, { Component } from "react";
import * as helper from "../../ultis/helpers"
import { connect } from "react-redux";
import * as blogAction from "../../actions/blog"
import {compressed} from "../../ultis/helpers"
class ModalUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileUpload: null

    };
  }


  onSave = async (e) =>{
    
    e.preventDefault();
    window.$('.modal').modal('hide');

    var file = this.state.fileUpload;
    if(typeof file !== "undefined" && file != "" && file != null )
    {
      window.$('#file-category').fileinput('clear');
      const fd = new FormData();
      fd.append('image' , await compressed(file))
      this.props.uploadImgBlog(fd)
      this.setState({fileUpload: null})

    }



  }

  componentDidMount() {
    var _this = this

    window.$('#file-category').on('fileloaded', function (event, file) {
      _this.setState({ fileUpload: file })
    });
    window.$('#file-category').on('fileremoved', function (event, id, index) {
      _this.setState({ fileUpload: null })
    });
    helper.loadFileInput("file-category");
  }
  render() {
    return (
      <div
        class="modal fade"
        tabindex="-1"
        role="dialog"
        id="uploadModalBlog"
        data-keyboard="false"
        data-backdrop="static"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">Upload ảnh</h4>

              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-hidden="true"
              >
                &times;
              </button>
            </div>
            <form
              onSubmit={this.onSave}
              role="form"
              action="#"
              method="post"
              id="removeForm"
            >
              <div className="modal-body">
                <form enctype="multipart/form-data">
                  <div className="form-group">
                    <div className="file-loading">
                      <input
                        id="file-category"
                        type="file"
                        className="file"
                        data-overwrite-initial="false"
                      />
                    </div>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-default"
                  data-dismiss="modal"
                >
                  Đóng
                </button>
                <button type="submit" class="btn btn-warning">
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}


const mapDispatchToProps = (dispatch, props) => {
  return {
    uploadImgBlog: ( file) => {
      dispatch(blogAction.uploadImgBlog(file));
    },
  };
};
export default connect(null, mapDispatchToProps)(ModalUpload);
