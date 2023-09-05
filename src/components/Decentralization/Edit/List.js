import React, { Component } from "react";
import * as helper from "../../../ultis/helpers"
import { connect } from "react-redux";


class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileUpload: null
        };
    }


    onChange = (e , item) => {
        this.props.handleChangeValue(e.target.checked,item)
      };

    showItem = (item) => {

        var result = null

        if (item.header.length > 0) {
            var { state } = this.props
            result = item.header.map((_item, index) => {
                return (
                    <div class="form-group">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id={`gridCheck-${item.body[index]}`} checked = {this.props.state[item.body[index]]} onChange = {(e) => this.onChange(e,item.body[index])} />
                            <label class="form-check-label" name={item.body[index]} for={`gridCheck-${item.body[index]}`}>
                                {_item}
                            </label>
                        </div>

                    </div>
                );
            });
        }
        else {

        }
        return result
    }

    showListPermission = (data) => {
        var result = null
        if (typeof data == "undefined") {
            return result
        }
        if (data.length > 0) {
            var { state } = this.props
            result = data.map((item, index) => {
                return (
                    <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3" style = {{marginBottom : "20px"}}>
                        <h4 style = {{fontSize : "1.2rem" , color : "#10a0b5" , fontWeight : "500"}}>{item.name}</h4>
                        {this.showItem(item)}
                    </div>
                );
            });
        }
        else {

        }
        return result
    }
    render() {
        var { data } = this.props
        console.log(data)
        return (
            <div class="form-group">
                
                <label className="text-label-permission" for="group_name">
                    Danh sách phân quyền
                    </label>                
                <div class="row">
                    {this.showListPermission(data)}

                </div>


            </div>

        )
    }
}



export default List
