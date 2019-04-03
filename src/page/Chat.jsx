import React from 'react';
import ReactDOM from 'react-dom';
import { Widget, addResponseMessage, toggleWidget,isWidgetOpened,addLinkSnippet, addUserMessage, renderCustomComponent } from 'react-chat-widget';
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
      meg: '',
      respon: [],
      megArray: [],
      isWrite: true,
      saying: false,
      refreshing: false,
      down: true,
      data: [],
      out:[],
      userId:'',
      to_userId:'0',
      pageNumd: 1, perPaged: 10,
      isClick:false
    }
  }

 // 组件加载完成
  componentDidMount() {
    console.log("组件加载完成");
    var context= document.querySelector("button.rcw-close-button");
    console.log(context);
    if(null!=context){
       var  oldId = context.getAttribute("id");
        console.log(oldId);
      }

    let userInfo = localStorge.getStorage('userInfo');
    let user_id=null;
    if (undefined != userInfo && null != userInfo && '' != userInfo) {
      user_id=userInfo.id;
      this.setState({ userId:userInfo.id});
    }else{
      window.location.href="/My";
    }
    let mInfo={'from_userId':user_id,'to_userId':this.state.to_userId,
              pageNumd:this.state.pageNumd,perPaged:this.state.perPaged}
    HttpService.post('/reportServer/chat/getChatByuserID', JSON.stringify(mInfo))
    .then(res => {
      if (res.resultCode != "1000") {
       
      }
    })
  }

//   // 组件即将销毁
  componentWillUnmount() {
    var context= document.querySelector("button.rcw-close-button");
    console.log(context);
    if(null!=context){

    
       var  oldId = context.getAttribute("id");
        console.log(oldId);
      }
   // var d= document.querySelector("button.rcw-close-button").setAttribute("id","ctbn");
   // var ddd= document.querySelector("div.rcw-conversation-container").remove();
   // console.log(d);
    //  document.getElementById("btn").click();
      console.log('组件即将销毁');
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
                  'message_type':'0',
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
 
  render() {
    return (
      <div className="content" id="cons">
      <div id="ccon">
        <Widget
          handleNewUserMessage={newMessage=>this.sendMessage(newMessage)}
          senderPlaceHolder="输入想要做什么"
          profileAvatar={ai}
          titleAvatar={my}
          badge={1}
          ShowCloseButton="false"
          title="智能机器人"
          subtitle=""
          badge="1"
          fullScreenMode={false}
          toggleWidget
          //launcher={this.toggleWidget}
          launcher={handleToggle => (
             <input id="btn" onClick={handleToggle} type="button"></input>
          )}
        />
        </div>
      </div>
    )
  }
}