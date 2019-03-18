import React from 'react';
import { Link } from 'react-router-dom';
import { List, WhiteSpace, WingBlank, Checkbox,SwipeAction, NavBar, Icon, InputItem, Toast, Button } from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import UserService from '../service/user-service.jsx';
import LocalStorge  from '../util/LogcalStorge.jsx';
const localStorge = new LocalStorge();
const userService = new UserService();
const Item = List.Item;
const Brief = Item.Brief;
import './my.scss';

export default class My extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      UserCode: '',
      Pwd: '',
      address:'',
      class_id: this.props.class_id,
      data: [],
      imgHeight: 176,
      driver: "aaaa",
      paramClass: null,
      isLogin:false
    }
  }
  componentDidMount() {
    let userInfo=localStorge.getStorage('userInfo');
    if(undefined!=userInfo && null!=userInfo && ''!=userInfo){
      this.setState({
        isLogin: true,
        UserCode:userInfo.userCode,
        Pwd:userInfo.pwd,
        address:userInfo.address
      });
    }
  }
  // 当用户名发生改变
  onInputChange(name, value) {
    this.setState({
      [name]: value
    });
  }
  onInputKeyUp(e) {
    if (e.keyCode === 13) {
      this.onSubmit();
    }
  }
  // 当用户提交表单
  onSubmit() {
    
    if(this.state.address==null || this.state.address=='')
    {
      Toast.info("服务器地址不能为空");
      return false;
    }
    let loginInfo = {
      UserCode: this.state.UserCode,
      Pwd: this.state.Pwd,// "KfTaJa3vfLE=",
      import: "",
      isAdmin: ""
    },
    checkResult = userService.checkLoginInfo(loginInfo);
    checkResult.states = true;
    // 验证通过
    if (checkResult.status) {
      userService.encodePwd(loginInfo.Pwd).then((response) => {
        loginInfo.Pwd = response.encodePwd;
        userService.login(loginInfo).then((response) => {
          let datas=response.data;
          datas.address=this.state.address;
          localStorge.setStorage('userInfo',datas);
          this.setState({isLogin:true});
          //window.location.href = "#/Main";
        }, (errMsg) => {
          Toast.fail(errMsg);
        });
      }, (errMsg) => {
        Toast.fail(errMsg);
      });
    }
    // 验证不通过
    else {
      Toast.fail(errMsg);
    }
  }
  //设置当前页面加载的对象，如果是null，则加载首次数据与div
  onChildChanged = () => {
    this.setState({
      paramClass: null
    });
  }
  onClassClick(qry_id) {
    this.setState({ paramClass: qry_id });
    //this.renderResultParam = <QueryInParam class_id={this.state.class_id} qry_id={qry_id} callbackParent={this.onChildChanged} />;
  }
  logout=()=>{
    localStorge.removeStorage('userInfo');
    this.setState({isLogin:false,address:null});
    //window.location.href="#/Login";
  }
 
  //设置上一窗口的数据进行显示，返回上一级
  goback() {
    this.props.callbackParent("blueTab");
  }
  render() {
    return (
      <div>
        <NavBar
          mode="light"
          icon={<div style={{
            width: '22px',
            height: '22px', background: 'url(../../src/assets/Home.png) center center /  21px 21px no-repeat'}}></div>}
          onLeftClick={() => this.goback()}
          style={{ backgroundColor: 'rgb(79,188,242)', color: 'rgb(255,255,255)' }}
          // rightContent={[
          //   <Icon key="1" type="cross-circle" onClick={this.logout} />
          // ]}
        >
          <span style={{ color: 'white' }}>我的设置</span>
        </NavBar>
        <div style={{background:'url(../../src/assets/sandnab.jpg)'}}>
          <div  className='head' ></div>
        </div>
        {this.state.isLogin==false?<div >
          <List >
            <List.Item>
            <InputItem
                type="text"
                name="address"
                placeholder="服务器地址"
                clear
                onKeyUp={e => this.onInputKeyUp(e)}
                onChange={(v) => this.onInputChange('address', v)}
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
              <Button type="primary" onClick={() => { this.onSubmit() }} >登录</Button><WhiteSpace />
            </List.Item>
          </List>
        </div>    
        :      
        <div>
        <List >
            <List.Item>
            服务器地址:&nbsp;{this.state.address}
            </List.Item>
            <List.Item>
            用&nbsp;&nbsp;&nbsp;户&nbsp;&nbsp;&nbsp;&nbsp;名:&nbsp;{this.state.UserCode}
            </List.Item> 
            <List.Item>
            密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码:&nbsp;{this.state.Pwd}
            </List.Item>
            <List.Item>
              <div align="center">
              <Button type="primary" onClick={this.logout} style={{width:'30%'}}>退出登录</Button><WhiteSpace />
              </div>
            </List.Item>
          </List>
        </div>  }
      </div>
    )
  }
}
