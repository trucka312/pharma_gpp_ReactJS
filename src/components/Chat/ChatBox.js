import React, { Component } from "react";
import moment from "moment";
import * as Env from "../../ultis/default";
import FormChat from "./FormChat";
import { shallowEqual } from "../../ultis/shallowEqual";
class ChatBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      pag: 1,
      listChat: { data: [] },
      loadMesageId: false,
      isCheck: false,
    };
  }

  componentDidMount() {
    if (this.props.listChat?.data?.length > 0) {
      var arrChatProps = [...this.props.listChat.data];

      var listChatState = { ...this.state.listChat };
      var arrData = [...listChatState.data];
      var newArr = arrData.concat(arrChatProps);
      listChatState.data = newArr;
      this.setState({
        listChat: listChatState,
        loading: false,
        listChat: this.props.listChat,
        loadMesageId: true,
        isCheck: true,
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (
      (!shallowEqual(nextProps.listChat, this.props.listChat) &&
        this.state.pag == 1) ||
      (nextProps.isShow == true && this.state.isCheck == false)
    ) {
      this.setState({
        listChat: nextProps.listChat,
        loadMesageId: true,
        isCheck: true,
      });
    }
    if (
      !shallowEqual(nextProps.listChat, this.props.listChat) &&
      this.state.pag != 1
    ) {
      var arrChatProps = [...nextProps.listChat.data];
      var listChatState = { ...this.state.listChat };
      var arrData = [...listChatState.data];
      var newArr = arrData.concat(arrChatProps);
      listChatState.data = newArr;
      this.setState({ listChat: listChatState, loading: false });
    }
  }

  isActive = (id) => {
    this.props.handleFetchChatId(id);
    // this.props.handleFetchAllChat(1)
  };

  componentDidUpdate(prevProps, prevState) {
    var { customerParam } = this.props;
    console.log(customerParam);
    if (this.state.loadMesageId == true && customerParam != null) {
      window.$(`.message-${customerParam}`).trigger("click");
      this.setState({ loadMesageId: false });
    }
  }

  loadData = () => {
    var pag = this.state.pag + 1;

    this.setState({ loading: true, pag: pag });
    this.props.handleFetchAllChat(pag);
  };
  showListUserChat = (listChat, isActive, numPages) => {
    var { store_code } = this.props;
    var result = <div>Không có dữ liệu</div>;
    console.log(listChat);
    if (listChat.length > 0) {
      result = listChat.map((chat, index) => {
        var time =
          moment(chat.last_message.created_at, "YYYY-MM-DD HH:mm:ss").format(
            "YYYY-MM-DD"
          ) == moment().format("YYYY-MM-DD")
            ? moment(
                chat.last_message.created_at,
                "YYYY-MM-DD HH:mm:ss"
              ).format("HH:mm")
            : moment(
                chat.last_message.created_at,
                "YYYY-MM-DD HH:mm:ss"
              ).format("DD-MM-YYYY HH:mm");
        var _isActive = chat.customer_id == isActive ? "active-mess" : null;

        var showIconLoading = this.state.loading == true ? "show" : "hide";

        var showLoading =
          index == listChat.length - 1 && numPages > 1 ? "show" : "hide";

        var image_url =
          chat.customer.avatar_image == null || chat.customer.avatar_image == ""
            ? Env.IMG_NOT_FOUND
            : chat.customer.avatar_image;

        var content = "";
        if (chat.last_message.content != null)
          content =
            chat.last_message.content.length > 50
              ? chat.last_message.content.slice(0, 50) + "....."
              : chat.last_message.content;
        else content = "[Hình ảnh]";

        var unRead = chat.user_unread == 0 ? null : "bold-unread";
        var showUnRead = chat.user_unread == 0 ? "hide" : "show";
        console.log(chat.last_message.content);
        return (
          <React.Fragment>
            <div
              className={`friend-drawer friend-drawer--onhover message-${chat.customer_id} ${_isActive}`}
            >
              <img
                onClick={() => this.isActive(chat.customer_id)}
                className="profile-image"
                src={image_url}
                alt=""
              />
              <div
                onClick={() => this.isActive(chat.customer_id)}
                className={`text ${unRead}`}
              >
                <h6>{chat.customer.name}</h6>
                <p className="">{content}</p>
              </div>
              <span
                className={`step ${showUnRead}`}
                style={{
                  margin: "auto",
                }}
              >
                {chat.user_unread}
              </span>

              <span className="time  small">{time}</span>
            </div>
            <hr />

            <div
              style={{ textAlign: "center", marginBottom: "10px" }}
              className={showLoading}
            >
              <img
                class={`img-profile rounded-circle ${showIconLoading}`}
                width="28px"
                src="https://icon-library.com/images/facebook-loading-icon/facebook-loading-icon-8.jpg"
              ></img>
              <a
                onClick={this.loadData}
                style={{
                  fontSize: "16px",
                  textDecoration: "underline",
                  cursor: "pointer",
                  color: "blue",
                }}
              >
                Xem thêm
              </a>
            </div>
          </React.Fragment>
        );
      });
    } else {
      return result;
    }
    return result;
  };
  checkRead = () => {
    var read = true;
    var { listChat } = this.state;
    var { customerId, isActive } = this.props;

    var listChat = typeof listChat.data == "undefined" ? [] : listChat.data;
    console.log(listChat, customerId, isActive);
    for (const item of listChat) {
      if (item.customer_id == isActive) {
        if (item.customer_unread > 0) {
          return false;
        }
        return true;
      }
    }
    return read;
  };
  render() {
    var { customerImg, customerId, chat, store_code, isActive } = this.props;
    var { listChat } = this.state;
    var numPages = listChat.last_page;

    var listChat = typeof listChat.data == "undefined" ? [] : listChat.data;
    console.log(this.checkRead());
    return (
      <div style={{ background: "white" }} className="row no-gutters">
        <div
          className="col-md-4 border-right"
          style={{ overflow: "auto", height: "530px" }}
        >
          {this.showListUserChat(listChat, isActive, numPages)}
        </div>
        <div className="col-md-8" style={{ height: "500px" }}>
          <FormChat
            isActive={isActive}
            unRead={this.checkRead()}
            listChat={listChat}
            customerImg={customerImg}
            customerId={customerId}
            chat={chat}
            store_code={store_code}
          />
        </div>
      </div>
    );
  }
}

export default ChatBox;
