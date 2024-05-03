import { combineReducers } from 'redux';
import {product} from './product'
import {alert} from './alert'




export const productReducers = combineReducers({
    product,
    alert
});

