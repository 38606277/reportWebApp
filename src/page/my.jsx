import React from 'react';
import { List, WhiteSpace, WingBlank, Checkbox, SwipeAction, NavBar, Icon, Toast, Button } from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import { Link } from 'react-router-dom';
import UserService from '../service/UserService.jsx';
import HttpService from '../util/HttpService.jsx';
import QueryInParam from './QueryInParam.jsx';
const userService = new UserService();
const Item = List.Item;
const CheckboxItem = Checkbox.CheckboxItem;
const AgreeItem = Checkbox.AgreeItem;
const Brief = Item.Brief;

export default class My extends React.Component {
  constructor(props) {
    super(props);
    const renderResultParam = null;
    this.state = {
      class_id: this.props.class_id,
      data: [],
      imgHeight: 176,
      driver: "aaaa",
      paramClass: null
    }
  }




  onReset() {
    this.props.form.resetFields();
  }
  onOpenChange() {

  }
  //设置当前页面加载的对象，如果是null，则加载首次数据与div
  onChildChanged = () => {
    this.setState({
      paramClass: null
    });
  }
  onClassClick(qry_id) {
    //window.location.href = "#/QueryInParam/"+qry_id;
    this.setState({ paramClass: qry_id });
    this.renderResultParam = <QueryInParam class_id={this.state.class_id} qry_id={qry_id} callbackParent={this.onChildChanged} />;
  }

  componentDidMount() {
  }
  //设置上一窗口的数据进行显示，返回上一级
  goback() {
    this.props.callbackParent();
  }
  render() {
    if (this.state.data.length > 0 && this.state.paramClass == null) {
      this.renderResultParam = (
        <div>
          <NavBar
            mode="light"
            icon={<Icon type="left" />}
            onLeftClick={() => this.goback()}
            rightContent={[
              <Icon key="1" type="ellipsis" onClick={this.loadData} />
            ]}
          >
            我的设置
            </NavBar>

          <list>
            <Item
              arrow="horizontal"
              multipleLine
              onClick={() => { }}
              platform="android"
            >
              ListItem （Android）<Brief>There may have water ripple effect of <br /> material if you set the click event.</Brief>
            </Item>
            <Item
              arrow="horizontal"
              thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
              multipleLine
              onClick={() => { }}
            >
              Title <Brief>subtitle</Brief>
            </Item>
          </list>



        </div>);
    }
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => this.goback()}
          style={{ backgroundColor: 'rgb(79,188,242)', color: 'rgb(255,255,255)' }}
          rightContent={[
            <Icon key="1" type="ellipsis" onClick={this.loadData} />
          ]}
        >
          <span style={{ color: 'white' }}>我的设置</span>
        </NavBar>
        <div style={{ height: '130px', backgroundColor: 'rgb(79,188,242)' }}></div>
        <list >

          <Item
            arrow="horizontal"
            multipleLine
            onClick={() => { }}
          >
          <img src='./../src/assets/index_on.png' height="30" width="30" />服务器地址
            </Item>
          <Item
            arrow="horizontal"
            thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
            multipleLine
            onClick={() => { }}
          >
            用户名
            </Item>
          <Item
            arrow="horizontal"
            thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
            multipleLine
            onClick={() => { }}
          >
            密码
            </Item>

          <Item>
            <Button type="primary"  onClick={() => this.execQuery()} >登录</Button><WhiteSpace />
            {/* <Button type="primary" size="large" inline onClick={this.onSubmit}>Submit</Button> */}
          </Item>
        </list>
      </div>
    )
  }
}
