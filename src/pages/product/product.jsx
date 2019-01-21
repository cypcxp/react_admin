import React, {Component} from 'react'
import {Switch,Redirect,Route} from 'react-router-dom'
import ProductIndex from './index'
import SaveUpdate from './save-update'
import Detail from './detail'
import './product.less'
export default class Product extends Component {
  render() {
    return (
      <Switch>
        <Route path='/product/index' component={ProductIndex}/>
        <Route path='/product/saveupdate' component={SaveUpdate}/>
        <Route path='/product/detail' component={Detail}/>
        <Redirect to="/product/index"/>
      </Switch>
    )
  }
}