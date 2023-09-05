import React, { Component } from "react";
import { connect, shallowEqual } from "react-redux";
import styled from "styled-components";
import * as productAction from "../../actions/product";
import { compressed } from "../../ultis/helpers";
import themeData from "../../ultis/theme_data";
import * as Types from "../../constants/ActionType";

const DropFileStyles = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  column-gap: 20px;
  row-gap: 20px;
  .drop-file-input {
    position: relative;
    width: 140px;
    height: 130px;
    border: 2px dotted;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: #f4f4f4;
  }

  .drop-file-input input {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }

  .drop-file-input:hover,
  .drop-file-input.dragover {
    opacity: 0.6;
  }

  .drop-file-input__label {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
      border-radius: 6px;
    }
    p {
      text-align: center;
      color: #8c8c8c;
      padding: 10px;
      font-size: 12px;
      margin-bottom: 0;
    }
    span {
      position: relative;
      svg {
        width: 28px;
        height: 28px;
      }
      & > span {
        position: absolute;
        margin-left: 2px;
        svg {
          width: 8px;
          height: 8px;
        }
      }
    }
  }
  .upload__item {
    position: relative;
    width: 140px;
    height: 130px;
    border: 1px solid #ddd;
    border-radius: 6px;
    .upload__item__content {
      height: 100%;
      width: initial;
      min-height: 100%;
      border-radius: 6px;
      border: 1px solid #ddd;
      background-size: contain;
      background-position: 50%;
      background-repeat: no-repeat;
    }
    .item__cover {
      position: absolute;
      bottom: -1px;
      padding-left: 8px;
      background-color: rgba(0, 0, 0, 0.8);
      border: 1px solid #ddd;
      border-top: 0;
      width: 100%;
      color: #fff;
      font-size: 12px;
      display: flex;
      align-items: center;
      height: 27px;
    }
    .item__delete {
      cursor: pointer;
      position: absolute;
      right: -10px;
      top: -10px;
    }
  }
`;

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      file: "",
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { fileList } = this.state;
    const {
      listImgProduct,
      setFiles,
      images,
      multiple,
      setFile,
      product_img,
      image,
    } = this.props;
    if (multiple) {
      if (!shallowEqual(listImgProduct, nextProps.listImgProduct)) {
        this.setFileList(nextProps.listImgProduct);
        setFiles([...fileList, ...nextProps.listImgProduct]);
      }
      if (!shallowEqual(images, nextProps.images)) {
        setFiles(nextProps.images);
        this.setState({ fileList: nextProps.images });
      }
    } else {
      if (!shallowEqual(product_img, nextProps.product_img)) {
        this.setFile(nextProps.product_img);
        setFile(nextProps.product_img);
      }
      if (!shallowEqual(image, nextProps.image)) {
        setFile(nextProps.image);
        this.setState({ file: nextProps.image });
      }
    }

    return true;
  }

  setFileList = (fileList) => {
    this.setState({ fileList: [...this.state.fileList, ...fileList] });
  };
  setFile = (file) => {
    this.setState({ file });
  };

  onDragEnter = () => {
    const dropFileInput = document.querySelector(".drop-file-input");
    dropFileInput.classList.add("dragover");
  };

  onDragLeave = () => {
    const dropFileInput = document.querySelector(".drop-file-input");
    dropFileInput.classList.remove("dragover");
  };

  onDrop = () => {
    const dropFileInput = document.querySelector(".drop-file-input");
    dropFileInput.classList.remove("dragover");
  };

  onFileDrop = async (e) => {
    const newFiles = e.target.files;
    const { file, fileList } = this.state;
    const {
      uploadListImgProduct,
      uploadAvataProduct,
      multiple,
      limit,
      showError,
    } = this.props;
    if (newFiles.length > 0) {
      const updatedList = [...newFiles];
      if (multiple) {
        if (limit) {
          const totalFilesAfter = fileList?.length + newFiles?.length;
          if (totalFilesAfter > limit) {
            showError({
              type: Types.ALERT_UID_STATUS,
              alert: {
                type: "danger",
                title: "Lỗi",
                disable: "show",
                content: `Bạn đã chọn vượt quá ${limit} ảnh`,
              },
            });
            return;
          }
        }
        uploadListImgProduct(updatedList);
      } else {
        const newFile = newFiles[0];
        const fd = new FormData();
        fd.append("image", await compressed(newFile));
        uploadAvataProduct(fd);
      }
    }
  };

  removeFile = (indexFile) => {
    const { fileList } = this.state;
    const { setFiles } = this.props;
    const newFileList = fileList.filter((file, index) => index !== indexFile);
    this.setState({ fileList: newFileList });
    setFiles(newFileList);
  };

  render() {
    const { style, multiple } = this.props;
    const { fileList, file } = this.state;
    const forbiddenLinks = this.props.forbiddenLinks || [];
    return (
      <DropFileStyles>
        {fileList.length < 10 && (
          <div
            className="drop-file-input"
            onDragEnter={this.onDragEnter}
            onDragLeave={this.onDragLeave}
            onDrop={this.onDrop}
            style={{
              borderColor:
                file && !forbiddenLinks.includes(file)
                  ? "transparent"
                  : themeData().backgroundColor,
              ...style,
            }}
          >
            {file && !forbiddenLinks.includes(file) ? (
              <div className="drop-file-input__label">
                <img src={file} alt="img" loading="lazy" />
              </div>
            ) : (
              <div className="drop-file-input__label">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="53"
                    height="39"
                    viewBox="0 0 53 39"
                  >
                    <g
                      fill="none"
                      fillRule="evenodd"
                      stroke="none"
                      strokeWidth="1"
                    >
                      <g
                        stroke={themeData().backgroundColor}
                        strokeWidth="2"
                        transform="translate(-255 -179)"
                      >
                        <g transform="translate(132 122)">
                          <path d="M150.631 87.337c-5.755 0-10.42-4.534-10.42-10.127 0-5.593 4.665-10.127 10.42-10.127s10.42 4.534 10.42 10.127c0 5.593-4.665 10.127-10.42 10.127m10.42-24.755l-2.315-4.501h-16.21l-2.316 4.5h-11.579s-4.631 0-4.631 4.502v22.505c0 4.5 4.631 4.5 4.631 4.5h41.684s4.631 0 4.631-4.5V67.083c0-4.501-4.631-4.501-4.631-4.501h-9.263z"></path>
                        </g>
                      </g>
                    </g>
                  </svg>
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="100%"
                      height="100%"
                      viewBox="0 0 20 21"
                    >
                      <g
                        fill="none"
                        fillRule="evenodd"
                        stroke="none"
                        strokeWidth="1"
                      >
                        <g
                          fill={themeData().backgroundColor}
                          transform="translate(-161 -428)"
                        >
                          <g transform="translate(132 398)">
                            <g transform="translate(16.648 17.048)">
                              <g transform="rotate(-180 16.142 16.838)">
                                <rect
                                  width="2.643"
                                  height="19.82"
                                  x="8.588"
                                  y="0"
                                  rx="1.321"
                                ></rect>
                                <path
                                  d="M9.91 0c.73 0 1.321.592 1.321 1.321v17.177a1.321 1.321 0 01-2.643 0V1.321C8.588.591 9.18 0 9.91 0z"
                                  transform="rotate(90 9.91 9.91)"
                                ></path>
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </span>
                </span>
                <p>Chọn ảnh hoặc kéo và thả</p>
              </div>
            )}

            <input
              type="file"
              multiple={multiple ? true : false}
              accept="image/*"
              value=""
              onChange={this.onFileDrop}
            />
          </div>
        )}
        {multiple &&
          fileList.length > 0 &&
          fileList.map((file, index) => (
            <div key={index} className="upload__item">
              <div
                style={{
                  backgroundImage: `url(${file})`,
                }}
                className="upload__item__content"
              />
              {/* {index === 0 && <div className="item__cover">Hình bìa</div>} */}
              <span class="item__delete" onClick={() => this.removeFile(index)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="23"
                  height="23"
                  viewBox="0 0 23 23"
                >
                  <g
                    fill="none"
                    fillRule="evenodd"
                    stroke="none"
                    strokeWidth="1"
                  >
                    <g transform="translate(-301 -387)">
                      <g transform="translate(236 388)">
                        <g transform="translate(65.537)">
                          <circle
                            cx="10.5"
                            cy="10.5"
                            r="10.5"
                            fill="#000"
                            stroke="#FFF"
                          ></circle>
                          <g fill="#FFF" transform="rotate(45 1.564 14.453)">
                            <rect
                              width="1.424"
                              height="10.678"
                              x="4.627"
                              y="0"
                              rx="0.712"
                            ></rect>
                            <path
                              d="M5.339 0c.393 0 .712.319.712.712v9.254a.712.712 0 11-1.424 0V.712c0-.393.319-.712.712-.712z"
                              transform="rotate(90 5.339 5.339)"
                            ></path>
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              </span>
            </div>
          ))}
      </DropFileStyles>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    listImgProduct: state.UploadReducers.productImg.listImgProduct,
    product_img: state.UploadReducers.productImg.product_img,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    uploadListImgProduct: (file) => {
      dispatch(productAction.uploadListImgProduct(file));
    },
    uploadAvataProduct: (file) => {
      dispatch(productAction.uploadAvataProduct(file));
    },
    checkNumImg: (alert) => {
      dispatch(alert);
    },
    showError: (error) => {
      dispatch(error);
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Upload);
