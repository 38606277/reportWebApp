import React from 'react';
import ReactDOM from 'react-dom';
import { List, WhiteSpace, WingBlank, Checkbox, SwipeAction,  NavBar, Icon } from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import './Chat.css';
function ticking(){
  const element = (new Date().toLocaleTimeString());
  ReactDOM.render(
    element,
    document.getElementById('root')
  );
}
  // var wen  = document.getElementById('wenwen');
	// function _touch_start(event){
  //       event.preventDefault();
  //       $('.wenwen_text').css('background','#c1c1c1');
  //       $('.wenwen_text span').css('color','#fff');
  //       $('.saying').show();
  //   }

  //   function _touch_end(event){
  //       event.preventDefault();
  //       $('.wenwen_text').css('background','#fff');
  //       $('.wenwen_text').css('color','#666');    
  //       $('.saying').hide();
  //       var str  = '<div class="question">';
	//         str += '<div class="heard_img right"><img src="images/dglvyou.jpg"/></div>';
	//         str += '<div class="question_text clear"><p>不好意思，我听不清！</p><i></i>';
	//         str += '</div></div>';
	// 	// $('.contentes').append(str);
	// 	// for_bottom();
  //   //     setTimeout(function(){
  //   //     	var ans  = '<div class="answer"><div class="heard_img left"><img src="images/dglvyou.jpg"/></div>';
	//   //       	ans += '<div class="answer_text"><p>我不知道你在说什么?</p><i></i>';
	//   //   		ans += '</div></div>';
	//   //   	$('.speak_box').append(ans);
	// 	// 	for_bottom();
  //   //     },1000);       
  //   }

  //   wen.addEventListener("touchstart", _touch_start, false);
  //   wen.addEventListener("touchend", _touch_end, false);
export default class Chat extends React.Component {
  constructor() {
    super()
    this.state = {
      meg: '',
      respon: [],
      megArray: [],
      isWrite:true,
      saying:false
    }
    
setInterval(ticking, 1000);
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
          return response.json();
          //return "hello";//response.json()
      }).then(function(detail) {
          if(detail.code===100000){
            return (that.setState({respon: [...that.state.respon, detail.text]}, () => {
              // var el = ReactDOM.findDOMNode(that.refs.msgList);
              // el.scrollTop=el.scrollHeight;
              let anchorElement = document.getElementById("scrolld");
              anchorElement.scrollIntoView();
            }))
          }else{
            return (that.setState({respon: [...that.state.respon, "不知道你说什么,好像服务器发生错误"]}, () => {
              // var el = ReactDOM.findDOMNode(that.refs.msgList);
              // el.scrollTop=el.scrollHeight;
              let anchorElement = document.getElementById("scrolld");
              anchorElement.scrollIntoView();
            }))
          }
        })
        this.state.meg = ''
      }
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

  render() {
    var meg = this.state.meg
    var megArray = this.state.megArray
    var respon = this.state.respon

    return (
      <div className="content">
       <div className="header">
            <span style={{float: "left"}}><a href="#Main"><img src={require("../assets/返回.svg")} style={{width:"20px",height:"20px",marginTop:'10px'}}/></a></span>
            <span style={{float: "right"}} id="root"></span>
        </div>
        <ul className="contentes" ref="msgList">
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
        </div>
        <div id="scrolld"> </div>
         {/* <div className="fixedBottom">
           <input className="input" value={meg} onChange={this.handleData.bind(this)} />
           <button className="button" onClick={this.sendMessage.bind(this)}>发送</button>
         </div> */}
      </div>
    )
  }
}