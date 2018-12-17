import React from 'react';
import { List, WhiteSpace, Checkbox, Button, NavBar, Icon, InputItem } from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';

import User         from '../service/user-service.jsx'
import LocalStorge  from '../util/LogcalStorge.jsx';

const _user = new User();


const localStorge = new LocalStorge();


export default class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      UserCode: '',
      Pwd: '',
      // redirect: _mm.getUrlParam('redirect') || '/'
    }
  }
  // componentWillMount() {
  //   document.title = '登录 - w';
  // }


  // 当用户名发生改变
  onInputChange(name, value) {
    //alert(e);
   
    this.setState({
      [name]: value
    });
    //console.log(inputName + ":" + inputValue);
  }
  onInputKeyUp(e) {
    if (e.keyCode === 13) {
      this.onSubmit();
    }
  }
  // 当用户提交表单
  onSubmit() {
    let loginInfo = {
      UserCode: this.state.UserCode,
      Pwd: this.state.Pwd,// "KfTaJa3vfLE=",
      //password : "admin",
      import: "",
      isAdmin: ""
    },
      checkResult = _user.checkLoginInfo(loginInfo);
    checkResult.states = true;
    // 验证通过
    if (checkResult.status) {
      _user.encodePwd(loginInfo.Pwd).then((response) => {
        loginInfo.Pwd = response.encodePwd;
        _user.login(loginInfo).then((response) => {
          localStorge.setStorage('userInfo', response.data);
          window.location.href = "#/Main";
          // this.props.history.push(this.state.redirect);
        }, (errMsg) => {
          localStorge.errorTips(errMsg);
        });
      }, (errMsg) => {
        localStorge.errorTips(errMsg);
      });

    }
    // 验证不通过
    else {
      localStorge.errorTips(checkResult.msg);
    }

  }
  //界面渲染
  render() {
    return (
      <div >
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => window.location.href = "#/"}
          rightContent={[
            <Icon key="1" type="ellipsis" onClick={this.loadData} />
          ]}
        >
          登录系统
        </NavBar>
        <List style={{marginTop:'150px'}}>
          <List.Item>
            <InputItem
              type="text"
              name="username"
              placeholder="输入用户名"
              clear
              onKeyUp={e => this.onInputKeyUp(e)}
              onChange={(v)=>this.onInputChange('UserCode',v)}
            >用户:</InputItem>
          </List.Item>
          <List.Item>
            <InputItem
              type="password"
              name="password"
              placeholder="******"
              onKeyUp={e => this.onInputKeyUp(e)}
              onChange={v => this.onInputChange("Pwd",v)}
            >密码:</InputItem>
          </List.Item>
          <List.Item>
            <Button type="primary" onClick={() => { this.onSubmit() }} > 登录</Button><WhiteSpace />
          </List.Item>
        </List>
      </div>
    )
  }
}
