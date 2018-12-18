import React from 'react';
import ReactDOM from 'react-dom';
import { List, WhiteSpace, WingBlank, Checkbox, SwipeAction,  NavBar, Icon } from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import './Chat.css';

export default class Chat extends React.Component {
  constructor() {
    super()
    this.state = {
      meg: '',
      respon: [],
      megArray: []
    }
  }
  handleData(e) {
    this.setState({
      meg: e.target.value
    })
  }
  sendMessage() {
    
    var message = this.state.meg
    if (message === '') {
      alert('不能发送空白消息哦')
    } else {
      this.setState({
        megArray: [...this.state.megArray, message]
      })
      var that = this
      var func = fetch('http://www.tuling123.com/openapi/api?key=f0d11b6cae4647b2bd810a6a3df2136f&info=' + message, {
        method: 'POST',
        type: 'cors'
      }).then(function(response) {
        return "hello";//response.json()
      }).then(function(detail) {
        return (that.setState({
          respon: [...that.state.respon, "nihao"]
        }, () => {
          var el = ReactDOM.findDOMNode(that.refs.msgList);
          console.log(el.scrollHeight);
          el.scrollTop=el.scrollTop+el.scrollHeight;
        }))
      })
      this.state.meg = ''
     
      
    }
  }
  render() {
    var meg = this.state.meg
    var megArray = this.state.megArray
    var respon = this.state.respon

    return (
      <div className="content">
       {/* <div className="header">
            <span style={{float: "left"}}>业余草:模拟微信聊天界面</span>
            <span style={{float: "right"}}>{new Date().toLocaleTimeString()}</span>
        </div> */}
        <ul className="contentes" ref="msgList"  id="scrolldIV">
          {megArray.map((elem,index) => (
            <div>
              <li><img src={require("../assets/奥巴马-02.jpg")} className="imgright"/><span style={{float:"right"}}>{elem} </span></li>
              <li><img src={require("../assets/川普-01.jpg")} className="imgleft"/><span style={{float:"left"}}>{respon[index]} </span></li>
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
        <div className="footer">
            <input id="text" type="text" placeholder="说点什么吧..." value={meg} onChange={this.handleData.bind(this)} />
            <span id="btn"  onClick={this.sendMessage.bind(this)}>发送</span>
        </div>
         {/* <div className="fixedBottom">
           <input className="input" value={meg} onChange={this.handleData.bind(this)} />
           <button className="button" onClick={this.sendMessage.bind(this)}>发送</button>
         </div> */}
      </div>
    )
  }
}