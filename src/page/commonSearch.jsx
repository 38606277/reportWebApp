import React        from 'react';
import {Button} from 'antd-mobile';
import { Widget, addResponseMessage, toggleWidget,isWidgetOpened,toggleChat,addLinkSnippet, addUserMessage, renderCustomComponent } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import ai from './../assets/icon/ai.png';
import HttpService from '../util/HttpService.jsx';
import my from './../assets/icon/chart.png';
import './commonSearch.scss';
import LocalStorge from '../util/LogcalStorge.jsx';
import "babel-polyfill";
const localStorge = new LocalStorge();
class CommonSearch extends React.Component{
    constructor(props){
        super(props);
        this.state={
            userId:'',
            to_userId:'0',
            pageNumd: 1, perPaged: 10,
            isClick:false
        }
    }
    componentDidMount(){
        //var context= document.querySelector("button.rcw-close-button");
        // console.log(context);
        // if(null!=context){
    
        
        //    var  oldId = context.getAttribute("id");
        //     console.log(oldId);
        //   }
       // var ddd= document.querySelector("div.rcw-conversation-container").remove();
    
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
    // 点击搜索按钮的时候
    onSearch(){
        this.props.onSearch();
    }
    toAI() {
        this.props.toAI();
       // window.location.href = "#/Chat";
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
      getCustomLauncher(handleToggle) {
        console.log(handleToggle);
        console.log(isWidgetOpened);
        console.log(toggleWidget);
        isWidgetOpened();
        //toggleWidget();
        //Widget.toggleConversation(toggleChat());
        //handleToggle.click();
        // document.getElementById("btn").onclick();
      }
    render(){
        return (
            <div>
                <div style={{float:'left',height: '44px',width: '90%'}}>
                    <div className="am-search" >
                        <div className="am-search-input">
                            <div className="am-search-synthetic-ph" style={{width: '100%'}}>
                                <span className="am-search-synthetic-ph-container">
                                    <i className="am-search-synthetic-ph-icon"></i>
                                    <span className="am-search-synthetic-ph-placeholder" style={{visibility: 'visible'}}>输入你要查询的内容</span>
                                </span>
                            </div>
                            <input  type="search"  className="am-search-value" onFocus={(v) => this.onSearch()} placeholder="输入你要查询的内容" />
                            <a className="am-search-clear"></a>
                        </div>
                    </div>
                </div>
                {/* <div style={{height: '44px',width: '10%',
                    background:'url(./../src/assets/icon/ai.png) center center /  21px 21px no-repeat',display:'inline-block'}}
                    onClick={() => this.toAI()}> */}
                <div style={{height: '44px',width: '10%',display:'inline-block'}}>
                     <Widget
                        handleNewUserMessage={newMessage=>this.sendMessage(newMessage)}
                        senderPlaceHolder="输入想要做什么"
                        profileAvatar={ai}
                        // titleAvatar={my}
                        // badge={1}
                        ShowCloseButton="false"
                        title="智能机器人"
                        subtitle=""
                        fullScreenMode={false}
                        //toggleWidget={true}
                        // launcher = { handleToggle  =>(
                        //     < button onClick = {handleToggle} > < img src = {my} /> </button> 
                        // )}
                    />
                </div>
            </div>
        )
    }
}
export default CommonSearch;