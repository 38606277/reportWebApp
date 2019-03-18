import React from 'react';
import { List, WhiteSpace, WingBlank, Checkbox, SwipeAction, NavBar, Icon, InputItem, Toast, Button } from 'antd-mobile';
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
       
          <List >
            <List.Item>
            <InputItem
                type="text"
                name="address"
                placeholder="服务器地址"
                clear
              ></InputItem>
              <InputItem
                type="text"
                name="username"
                placeholder="输入用户名"
                clear
                onKeyUp={e => this.onInputKeyUp(e)}
                onChange={(v) => this.onInputChange('UserCode', v)}
              ></InputItem>
            </List.Item>
            <List.Item>
              <InputItem
                type="password"
                name="password"
                placeholder="******"
                onKeyUp={e => this.onInputKeyUp(e)}
                onChange={v => this.onInputChange("Pwd", v)}
              ></InputItem>
            </List.Item>
            <List.Item>
              <Button type="primary" onClick={() => { this.onSubmit() }} >退出登录</Button><WhiteSpace />
            </List.Item>
          </List>
      </div>
    )
  }
}
