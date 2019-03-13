import React from 'react';
import { List, WhiteSpace, Checkbox, Button, NavBar, Icon, InputItem } from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import User         from '../service/user-service.jsx'
import LocalStorge  from '../util/LogcalStorge.jsx';
import CommonSearch   from './commonSearch.jsx';
const _user = new User();
const localStorge = new LocalStorge();

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    const renderResult=null;
    this.state = {
        paramClass:null
    }
  }

  // 当用户点击查询文本框时显示真正的查询文本框
  onSearch() {
    this.setState({paramClass:"search"});
    window.location.href = "#/IndexSearch/Main";
    // this.renderResult=<IndexSearch callbackParent={this.onChildChanged}/>;
  }
  onChildChanged=()=>{
    this.setState({
        paramClass: null
      });
  }
  //界面渲染
  render() {
    if(this.state.paramClass==null){
        this.renderResult=(<CommonSearch onSearch={() => {this.onSearch()}}/>)
    }
    return (
      <div >
        {this.renderResult}
      </div>
    )
  }
}
