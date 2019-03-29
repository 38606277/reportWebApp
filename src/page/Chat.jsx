import React from 'react';
import ReactDOM from 'react-dom';
import { Widget, addResponseMessage, addLinkSnippet, addUserMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import logo from './../assets/icon/chart_on.png';
import { List, ListView,PullToRefresh,WhiteSpace, WingBlank, Checkbox, SwipeAction,  NavBar, Icon } from 'antd-mobile';
import { Link, Redirect } from 'react-router-dom';
import 'antd-mobile/dist/antd-mobile.css';
import './Chat.css';
// function ticking(){
//   const element = (new Date().toLocaleTimeString());
//   ReactDOM.render(
//     element,
//     document.getElementById('root')
//   );
// }

//查看历史信息使用下列加载 开始
function genData(dataArr) {
  // const dataArr = [];
  for (let i = 0; i < 10; i++) {
    dataArr.push(i);
  }
  return dataArr;
}
//查看历史信息使用下列加载 结束

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      meg: '',
      respon: [],
      megArray: [],
      isWrite:true,
      saying:false,
      refreshing: false,
      down: true,
      height: document.documentElement.clientHeight,
      data: [],
    }
    // setInterval(ticking, 1000);
  }
  handleNewUserMessage = (newMessage) => {
    console.log(`New message incoming! ${newMessage}`);
    // Now send the message throught the backend API
    addResponseMessage("response");
  }

  handleData(e) {
    this.setState({
      meg: e.target.value
    })
  }
  sendMessage = (newMessage) =>{
    
      var message = this.state.meg
      if (newMessage === '') {
        alert('不能发送空白消息哦')
      } else {
        // this.setState({
        //   megArray: [...this.state.megArray, message]
        // })
        var that = this
        var func = fetch('http://www.tuling123.com/openapi/api?key=f0d11b6cae4647b2bd810a6a3df2136f&info=' + newMessage, {
          method: 'POST',
          type: 'cors'
        }).then(function(response) {
          return response.json();
          //return "hello";//response.json()
      }).then(function(detail) {
          if(detail.code===100000){
            return addResponseMessage(detail.text);
            // (that.setState({respon: [...that.state.respon, detail.text]}, () => {
            //   // var el = ReactDOM.findDOMNode(that.refs.msgList);
            //   // el.scrollTop=el.scrollHeight;
            //   let anchorElement = document.getElementById("scrolld");
            //   anchorElement.scrollIntoView();
            // }))
          }else{
            
            // (that.setState({respon: [...that.state.respon, "不知道你说什么,好像服务器发生错误"]}, () => {
            //   // var el = ReactDOM.findDOMNode(that.refs.msgList);
            //   // el.scrollTop=el.scrollHeight;
            //   let anchorElement = document.getElementById("scrolld");
            //   anchorElement.scrollIntoView();
            // }))
          }
        })
      }
    }
   
    componentDidMount() {
     let btn= document.getElementById("btn");
     btn.click();
        // const hei = this.state.height - ReactDOM.findDOMNode(this.lv).offsetTop;
        // setTimeout(() => {
        //   this.setState({
        //     height: hei,
        //     data: genData(this.state.data),
        //     height: hei,
        //     refreshing: false
        //   });
        // }, 1500);
    }
  
    onRefreshs = () => {
        this.setState({ refreshing: true });
        setTimeout(() => {
          this.setState({ refreshing: false,
            data: genData(this.state.data), 
          });
        }, 600);
    }
  
    onInputKeyUp(e){
        if(e.keyCode === 13){
          this.sendMessage();
        }
    }
    changeSpeack(){
      let isw=this.state.isWrite;
      if(isw){
        this.setState({isWrite:false});
      }else{
        this.setState({isWrite:true});
      }
    }
    _touch_start(event){
            event.preventDefault();
          //  document.getElementsByClassName('.wenwen_text').css('background','#c1c1c1');
          //  document.getElementsByClassName('.wenwen_text span').css('color','#fff');
           //document.getElementsByClassName('.saying').show();
           this.setState({saying:true});
    }
    getCustomLauncher(handleToggle){
      console.log(handleToggle);
      //handleToggle.click();
     // document.getElementById("btn").onclick();
    }
  render() {
    var meg = this.state.meg
    var megArray = this.state.megArray
    var respon = this.state.respon
    
    return (
      <div className="content">
      <Widget
              handleNewUserMessage={this.sendMessage}
              profileAvatar={logo}
              ShowCloseButton={false}
              title="智能机器人"
              subtitle={null}
              badge="1"
              // launcher={handleToggle => this.getCustomLauncher(handleToggle)}
              launcher={handleToggle => (
                <input id="btn" onClick={handleToggle} type="button"></input>
              )}
            />
       {/* <div className="header">
            <span style={{float: "left"}}><Link to={`/Main`}><img src={require("../assets/返回.svg")} style={{width:"20px",height:"20px",marginTop:'10px'}}/></Link></span>
            <span style={{float: "right"}} id="root"></span>
        </div> */}
        {/* <ul className="contentes">
        <PullToRefresh
            damping={60}
            ref={el => this.lv = el}
            style={{
              height: this.state.height,
              overflow: 'auto',
            }}
            indicator={this.state.down ? {} : { deactivate: '上拉可以刷新' }}
            direction={this.state.down ? 'down' : 'up'}
            refreshing={this.state.refreshing}
            onRefresh={this.onRefreshs}
        >
        {this.state.data.map((elem,index) => (
          // <div key={index} style={{ textAlign: 'center', padding: 20 }}>
              <div style={{background:'#f5f5f9' }}>
                   <li ><img src={require("../assets/奥巴马-02.jpg")} className="imgright"/><span style={{float:"right"}}>{elem} </span></li>
                   <li><img src={require("../assets/川普-01.jpg")} className="imgleft"/><span style={{float:"left",background:'#f1ebeb00'}}>35 ¥ {elem} </span></li>
               </div>
          // </div>
        ))}
        
      </PullToRefresh>
          {megArray.map((elem,index) => (
              <div>
                  <li><img src={require("../assets/奥巴马-02.jpg")} className="imgright"/><span style={{float:"right"}} >{elem} </span></li>
                  <li><img src={require("../assets/川普-01.jpg")} className="imgleft"/><span style={{float:"left",background:'#f1ebeb00'}}>{respon[index]} </span></li>
              </div>
            // <div className="container" key={index}>
            //   <div className="message">
            //       <span>{elem} </span>
            //       <span><img src={require("../assets/a.png")} width="15" height="15"/></span>
                
            //   </div>
            //   <div className="response">{respon[index]}</div>
            // </div>
            )
           )}
        </ul>
        <div id="scrolld" > </div>
        {this.state.saying==true?<div className="saying">
          <img src={require("../assets/saying.gif")}/>
        </div>:''}
        <div className="footer">
            <div className="user_face_icon">
              <img src={this.state.isWrite==true?require("../assets/jp_btn.png"):require("../assets/yy_btn.png")} onClick={()=>this.changeSpeack()}/>
            </div>
            {this.state.isWrite==true? <div>
            <input id="text" type="text" placeholder="说点什么吧..." value={meg} onChange={this.handleData.bind(this)} onKeyUp={e => this.onInputKeyUp(e)}/>
            <span id="btn"  onClick={this.sendMessage.bind(this)} >发送</span>
            </div>
            : <div className="wenwen_text" id="wenwen" onClick={()=>this._touch_start(event)}>  按住 说话  </div>
            }
        </div> */}
        {/* <div id="scrolld"> </div> */}
      </div>
    )
  }
}