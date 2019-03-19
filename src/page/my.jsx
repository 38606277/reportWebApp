import React from 'react';
import { Link } from 'react-router-dom';
import { List, WhiteSpace, WingBlank, Checkbox,SwipeAction, NavBar, Icon, InputItem, Toast, Button } from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import  HttpService  from '../util/HttpService.jsx';
import UserService from '../service/user-service.jsx';
import LocalStorge  from '../util/LogcalStorge.jsx';
import WxTabBar from '../components/TabBar';

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
        Pwd:userInfo.pwd
      
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
    
    // if(this.state.address==null || this.state.address=='')
    // {
    //   Toast.info("服务器地址不能为空");
    //   return false;
    // }
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
      HttpService.post('/reportServer/user/encodePwd',loginInfo.Pwd)
      .then(response => {
          loginInfo.Pwd = response.encodePwd;
          HttpService.post('/reportServer/user/Reactlogin',JSON.stringify(loginInfo)).then(response => {
            if(undefined!= response.data && null!= response.data){
              let datas=response.data;
              localStorge.setStorage('userInfo',datas);
              this.setState({isLogin:true});
            }else{
              Toast.fail("登录失败，请检查用户名与密码");
            }
          }).catch((error) => {
            Toast.fail("登录失败，请检查用户名与密码");
          });
      }).catch((error) => {
        Toast.fail("登录失败，请检查用户名与密码");
      });
    }
    // 验证不通过
    else {
      Toast.fail("登录失败，请检查用户名与密码");
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
    //window.location.href="#/Home";
  }
 
  //设置上一窗口的数据进行显示，返回上一级
  goback() {
    window.location.href="#/Home";
    //this.props.callbackParent("blueTab");
  }
  render() {
    return (
      <div>
        <NavBar
          mode="light"
          icon={<div style={{
            width: '22px',
            height: '22px', background: 'url(../../src/assets/Home.png) no-repeat center center /  21px 21px '}}></div>}
          onLeftClick={() => this.goback()}
          style={{ backgroundColor: 'rgb(79,188,242)', color: 'rgb(255,255,255)' }}
          // rightContent={[
          //   <Icon key="1" type="cross-circle" onClick={this.logout} />
          // ]}
        >
          <span style={{ color: 'white' }}>我的设置</span>
        </NavBar>
        {/* <div style={{background:'url(../../src/assets/sandnab.jpg) no-repeat center center'}}>
          <div  className='head' ></div>
        </div> */}
        <div className="gerenzhonhx">
          <div className="grzx_toub_beij"><img src="../../src/assets/sandnab.jpg"/></div>
          <div className="grzx_toux_fus">
            <div className="of">
              <img src="../../src/assets/nh.jpg"/>
            </div>
         </div>
        </div>
        {this.state.isLogin==false?
          <List >
            <Item>
              <InputItem
                type="text"
                name="username"
                placeholder="输入用户名"
                clear
                onKeyUp={e => this.onInputKeyUp(e)}
                onChange={(v) => this.onInputChange('UserCode', v)}
              ></InputItem>
            </Item>
            <Item>
              <InputItem
                type="password"
                name="password"
                placeholder="******"
                onKeyUp={e => this.onInputKeyUp(e)}
                onChange={v => this.onInputChange("Pwd", v)}
              ></InputItem>
            </Item>
            <Item>
              <Button type="primary" onClick={() => { this.onSubmit() }} >登录</Button><WhiteSpace />
            </Item>
          </List>  
        :
        <List>
             <Item  thumb="../../src/assets/icon/user.png"  extra={this.state.UserCode}> 用户名 </Item>
             <Item  thumb="../../src/assets/icon/pwd.png"   extra={this.state.Pwd}>密码</Item>
            <Item>
              <div align="center">
              <Button size="small" type="primary" onClick={this.logout} style={{width:'90px'}}>退出登录</Button><WhiteSpace />
              </div>
            </Item>
          </List>
       }
       <WxTabBar {...this.props} />
      </div>
    )
  }
}
