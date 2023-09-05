import React, { Component } from 'react'
import { format, formatNumber } from '../../ultis/helpers'
import { shallowEqual } from '../../ultis/shallowEqual'

class ItemImportStock extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentQuantity: 1,
            distribute: "",
            item: "",
            import_price: 0
        }
        this.nameElementDistribute = ""
        this.nameSubElementDistribute = ""
    }
    componentWillReceiveProps(nextProps) {


        if (!shallowEqual(this.props.item.quantity, nextProps.item.quantity) ||
            !shallowEqual(this.props.item.import_price, nextProps.item.import_price)
        ) {
            this.setState({
                currentQuantity: nextProps.item.quantity,
                import_price: nextProps.item.import_price,
                item: nextProps.item
            })
        }

    }
    shouldComponentUpdate(nextProps, nextState) {
        const elementId = nextProps.item.element_id
        if (!shallowEqual(this.state.currentQuantity, nextState.currentQuantity)) {
            this.props.handleCallbackQuantity({ currentQuantity: nextState.currentQuantity, idElement: elementId })
        }
        if (!shallowEqual(this.state.import_price, nextState.import_price)) {
            this.props.handleCallbackPrice({ import_price: nextState.import_price, idElement: elementId })
        }

        if (!shallowEqual(this.state.item, nextState.item)) {
            this.setState({ currentQuantity: nextState.item.reality_exist })
        }
        if (!shallowEqual(this.state.currentQuantity, nextProps.item.reality_exist)) {
            this.setState({ currentQuantity: nextProps.item.reality_exist })
        }
        if (!shallowEqual(this.state.import_price, nextProps.item.import_price)) {
            this.setState({ import_price: nextProps.item.import_price })
        }
        return true
    }
    componentDidMount = () => {

        this.setState({ item: this.props.item })
    }
    onChange = (e) => {
        this.setState({ import_price: e.target.value })
    }

    subQuantity() {
        const q = this.state.currentQuantity - 1 < 0 ? 0 : this.state.currentQuantity - 1
        this.setState({
            currentQuantity: q
        })
    }

    addQuantity() {
        const q = this.state.currentQuantity + 1
        this.setState({ currentQuantity: q })
    }
    handleDelete(id) {
        this.props.handleDelete({ idElement: id })
    }
    handleOnChange = (e) => {
        this.setState({ currentQuantity: e.target.value })
    }

    render() {
        const { currentQuantity } = this.state

        const { item } = this.props
        const deviant =  item.reality_exist - item.stock
        return (
            <div className='list-group-item' style={{ marginBottom: "10px", borderTopWidth: "1px", borderRadius: "7px" }}>
                <div className='wrap-name' style={{display:"flex",justifyContent:"space-between"}}>
                    <div style={{ display: "flex" }}>
                        <div className='price-order' style={{ color: "gray", marginRight: "5px" }}>Tên:</div>
                        <div className='name-order'>{item.nameProduct}</div>
                    </div>
                    {item.nameElement || item.nameSubDistribute ? <div style={{ display: "flex" }}>
                        <div className='price-order' style={{ color: "gray", marginRight: "5px" }}>Phân loại:</div>
                        <div className='name-order'>{item.nameElement ? `${item.nameElement} ` : ""}{item.nameSubDistribute ? item.nameSubDistribute : ""}</div>
                    </div> : ""}
                </div>
                <div className='row' style={{ position: "relative", width: "100%", margin: "0" }}>
                    <div className='col-6' style={{ padding: "0px" }}>
                        Tồn thực tế
                    </div>
                    <div className='col-6' style={{ paddingLeft: "0" }}>
                        <div className="" style={{ float: "right", border: "1px solid #9c9898ba", borderRadius: "2px" }}>
                            <button className='btn-sub' onClick={() => this.subQuantity()} style={{ width: "20px", border: "none" }}>-</button>
                            <input className='input-quantity' onChange={this.handleOnChange} style={{ width: "40px", textAlign: "center" }} value={currentQuantity}></input>
                            <button className='btn-add' onClick={() => this.addQuantity()} style={{ width: "20px", border: "none" }}>+</button>
                        </div>
                    </div>
                    <a
                        style={{ position: "absolute", right: "-16px", top: "-37px", color: "red" }}
                        onClick={() => this.handleDelete(item.element_id)}
                    >
                        <i class="fas fa-close close-status "></i>
                    </a>

                </div>
                <div className='wrap-iventory' style={{ display: "flex", justifyContent: "space-between" }}>
                    <div className='exist-branch' style={{ display: "flex", justifyContent: "space-between" }} >
                        <span style={{ color: "gray" }}>Tồn chi nhánh:</span>
                        <div style={{ marginLeft: "5px", fontWeight: "bold" }}>{item.stock}</div>
                    </div>
                    <div className='reality-branch' style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "gray" }} >Chênh lệch:</span>
                        <div style={{ marginLeft: "5px", color: "red" }}>{deviant}</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ItemImportStock;
