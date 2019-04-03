import React from 'react';
import ReactDOM from 'react-dom';
import { Widget, addResponseMessage,toggleWidget,addLinkSnippet, addUserMessage, renderCustomComponent } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import ai from './../assets/icon/ai.png';
import HttpService from '../util/HttpService.jsx';
import my from './../assets/icon/chart.png';
import "babel-polyfill";
import { List, ListView, PullToRefresh, WhiteSpace, WingBlank, Toast,Brief, Checkbox, Card, SwipeAction, InputItem, NavBar, Icon } from 'antd-mobile';
import { Link, Redirect } from 'react-router-dom';
import 'antd-mobile/dist/antd-mobile.css';
import './Chat.css';
import LocalStorge from '../util/LogcalStorge.jsx';
const localStorge = new LocalStorge();

const Item = List.Item;

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isWrite: true,
      saying: false,
      isClick: true,
      userId:'',
      to_userId:'0',
      pageNumd: 1, 
      perPaged: 1000
    }
  }

 // 组件加载完成
  componentDidMount() {
    //调用组件内部方法打开窗口，再次调用是关闭；在组件销毁时调用一次关闭，可以保证每次打开都是开启状态
    toggleWidget();
    let userInfo = localStorge.getStorage('userInfo');
    let user_id=null;
    if (undefined != userInfo && null != userInfo && '' != userInfo) {
      user_id=userInfo.id;
      this.setState({ userId:userInfo.id});
    }else{
      window.location.href="/My";
    }
    if(this.state.isWrite){
      let mInfo={'from_userId':user_id,'to_userId':this.state.to_userId,
                pageNumd:this.state.pageNumd,perPaged:this.state.perPaged}
      HttpService.post('/reportServer/chat/getChatByuserID', JSON.stringify(mInfo))
      .then(res => {
        if (res.resultCode = "1000") {
          this.setState({
            isWrite:false
          })
        console.log(res);
        let list=res.data;
        for(var i=0;i<list.length;i++){
            if(user_id==list[i].from_userId){
              addUserMessage(list[i].post_message);
            }else{
              if(list[i].message_type=='json'){
                let ress=JSON.parse(list[i].post_message);
                renderCustomComponent(this.FormD, {data: ress.data.list, out: ress.data.out }); 
              }else{
                addResponseMessage(list[i].post_message);
              }
            }
        }
        }
      })
    }
  }

  //组件即将销毁
  componentWillUnmount() {
    //调用组件内部方法打开窗口，再次调用是关闭；在组件销毁时调用一次关闭，可以保证每次打开都是开启状态
    toggleWidget();
  }

  FormD = ({ data, out }) => {
    return <Card style={{backgroundColor:'#f4f7f9'}}>
      <List>
        {data.map(val => (
          <Item
            multipleLine
            onClick={() => this.onClassClick(val.class_id)}
          >
             {/* {JSON.stringify(this.state.out)} */}
             {out.map((item) => {
               return <div  style={{fontSize:'14px',fontFamily:'微软雅黑',backgroundColor:'#F4F7F9'}}>
                {item.out_name}:{val[item.out_id.toUpperCase()]}
              </div> 
            }
            )} 
          </Item>
        ))}
      </List>
    </Card>
  }

  handleModalDataChange(event) {
    this.setState({ test: event.target.value })
  }
  //发送消息
  async sendMessage(newMessage){ 
    var ist=true; 
    //先保存发送信息
    let userInfo={'from_userId':this.state.userId,
                  'to_userId':this.state.to_userId,
                  'post_message':newMessage,
                  'message_type':'0',
                  'message_state':'0'
                }
    await HttpService.post('/reportServer/chat/createChat', JSON.stringify(userInfo))
    .then(res => {
      if (res.resultCode != "1000") {
        ist=false;
      }
    })
    if(ist){
      //首先进行函数查询
      await HttpService.post('/reportServer/nlp/getResult/' + newMessage, null)
        .then(res => {
          if (res.resultCode == "1000") {
            // this.setState({ data: res.data.list, out: res.data.out })
            //数据保存到数据库
            let responseInfo={'from_userId':this.state.to_userId,
                  'to_userId':this.state.userId,
                  'post_message':res,
                  'message_type':'json',
                  'message_state':'0'
                }
           HttpService.post('/reportServer/chat/createChat', JSON.stringify(responseInfo))
            .then(res => {
              if (res.resultCode != "1000") {
                console.log(res);
              }
            })
            return renderCustomComponent(this.FormD, {data: res.data.list, out: res.data.out }); 
          } else {

          }
        })
        .catch((error) => {
          // Toast.fail(error);
        });
    // return;
      // alert('await over');
    // return addResponseMessage("hello");
    // return renderCustomComponent(this.FormD, {data: newMessage, action: this.handleModalDataChange }); 
   
    
      var that = this
      fetch('http://www.tuling123.com/openapi/api?key=f0d11b6cae4647b2bd810a6a3df2136f&info=' + newMessage, {
        method: 'POST',
        type: 'cors'
      }).then(function (response) {
        return response.json();
      }).then(function (detail) {
        if (detail.code === 100000) {
          let responseInfo={'from_userId':that.state.to_userId,
                  'to_userId':that.state.userId,
                  'post_message':detail.text,
                  'message_type':'0',
                  'message_state':'0'
                }
          HttpService.post('/reportServer/chat/createChat', JSON.stringify(responseInfo))
            .then(res => {
              if (res.resultCode != "1000") {
                console.log(res);
              }
            })
          return addResponseMessage(detail.text);
        } else {
        }
      })

    }
  }


  changeSpeack() {
    let isw = this.state.isWrite;
    if (isw) {
      this.setState({ isWrite: false });
    } else {
      this.setState({ isWrite: true });
    }
  }
  _touch_start(event) {
    event.preventDefault();
    this.setState({ saying: true });
  }
  // getCustomLauncher=()=> {
  //   //不知道什么原因，这个方法会被调用2次， toggleWidget()只能调用一次
  //   if(!this.state.isClick){
  //    // console.log("已经调用一次，不能在调用了")
  //   }else{
  //     this.setState({isClick:false});
  //       toggleWidget();
  //   }
  // }
  render() {
    return (
      <div className="content" id="cons">
      <div id="ccon">
        <Widget
          handleNewUserMessage={newMessage=>this.sendMessage(newMessage)}
          senderPlaceHolder="输入想要做什么"
          profileAvatar={ai}
          titleAvatar={my}
          ShowCloseButton="false"
          title="智能机器人"
          subtitle=""
          badge="1"
          fullScreenMode={false}
          //launcher = {this.getCustomLauncher}
          // launcher={handleToggle => (
          //    <input id="btn" onClick={handleToggle} type="button"></input>
          // )}
        />
        </div>
      </div>
    )
  }
}