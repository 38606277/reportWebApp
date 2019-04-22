import React from "react";
import {  WhiteSpace, Icon, InputItem, Toast, Button } from 'antd-mobile';
import "./demo.css";
import Script from 'react-load-script';
import HttpService from '../../util/HttpService.jsx';
import LocalStorge from '../../util/LogcalStorge.jsx';
const localStorge = new LocalStorge();
import saying from './../../assets/saying.gif';
var recorder;        
var msg={};
var question;
var answer;
var audio = document.querySelector('audio');
var msgId=1;

var timer = "", //定时器
		startX = 0, //开始x轴坐标
		startY = 0, //开始y轴坐标
        isSend = false; //记录是上滑还是下滑，下滑录音
        
function initEvent() {
  
    var btnElem=document.getElementById("microphone");//获取ID
    btnElem.addEventListener("touchstart", function(event) {
        event.preventDefault();//阻止浏览器默认行为
        document.getElementById("microphone").text="松开  结束";
		// timer = setTimeout(function() {
		// 	//$(".issaying").show(); //开始录音时候出现动画
        //     HZRecorder.get(function (rec) {
        //         recorder = rec;
        //         recorder.start();
        //     });
		// }, 500);
        HZRecorder.get(function (rec) {
            recorder = rec;
            recorder.start();
        });
    });
    // btnElem.addEventListener("touchmove", function(event) {
	// 	event.preventDefault();
	// 	var touch = event.touches[0], //获取第一个触点
	// 		x = Number(touch.pageX), //页面触点X坐标
	// 		y = Number(touch.pageY); //页面触点Y坐标
	// 	//判断滑动方向
	// 	$(".saying").hide();
	// });
    btnElem.addEventListener("touchend", function(event) {
        event.preventDefault();
        document.getElementById("microphone").text="按住  说话";
		timer = "";
        HZRecorder.get(function (rec) {
            recorder = rec;
            recorder.stop();
        })
       // $(".issaying").hide();
        //发送音频片段
        var data=recorder.getBlob();
        // if(data.duration==0){
        //     alert("请先录音");
        //     return;
        // }
    
        if(data.duration!==0){
            //导出wav文件
            //  downloadRecord(data.blob);
            msg[msgId]=data;
            recorder.clear();
            var dur=data.duration/10;
            var str="<div class='warper'><div id="+msgId+" class='voiceItem' >"+dur+"s</div></div>"
            $(".messages").append(str);
            msgId++;
            let formData = new FormData();
            formData.append("file", data.blob);
            HttpService.post("reportServer/MyVoiceApplication/uploadai",formData).then(response=>{
                if(response.resultCode=="1000"){
                    question=response.data.content;
                    fetch('https://api.ownthink.com/bot?spoken=' + response.data.content, {
                        method: 'POST',
                        type: 'cors'
                    }).then(function (response) {
                        return response.json();
                    }).then(function (detail) {
                        console.log(detail);
                        if (detail.message =="success") {
                        answer =detail.data.info.text
                            yuyin();
                        }
                    });
                }
            });
            $(".voiceItem").click(function(){
                var id=$(this)[0].id;
                var data=msg[id];
                playRecord(data.blob);
            });
        }else{
            console.log("没有声音输入");
        } 
    });
}
function  yuyin(){
    if(null!=answer && ""!=answer){
        fetch(window.getServerUrl()+'reportServer/MyVoiceApplication/yuyin', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'credentials': JSON.stringify(localStorge.getStorage('userInfo') || '')
                },
                body:answer
        }).then(function (resyy) {
            if (resyy.ok) {
            //   let msgId=1;
              resyy.blob().then((blob) => {
                let size=blob.size;
                let time=size*8/16/2/8000;
                    time=time.toFixed(1);
                    var audio = document.querySelector('audio');
                    audio.src = window.URL.createObjectURL(blob);
                    msg[msgId]=blob;
                    var dur=time;
                    var str="<div class='warper'><div id="+msgId+" class='voiceItemlet' >"+dur+"s</div></div>"
                    $(".messages").append(str);
                    msgId++;
                    $(".voiceItemlet").click(function(){
                        playRecord(blob);
                    });
                })
            } 
        });
        }
}
function playRecord(blob){  
    var audio = document.querySelector('audio');
    playaudio(audio,blob); 
    // if(!recorder){
    //     showError("请先录音");
    //     return;
    // }
    //recorder.play(audio,blob);  
}
function playaudio(audio,blob) {
    audio.autoplay=true;
    audio.src = window.URL.createObjectURL(blob);  
}; 
function downloadRecord(record){
    var save_link = window.document.createElement('a');
      save_link.href = window.URL.createObjectURL(record);
      var now=new Date;
      save_link.download = now.Format("yyyyMMddhhmmss");
      fake_click(save_link);
  }
  function fake_click(obj) {
    var ev = document.createEvent('MouseEvents');
    ev.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    obj.dispatchEvent(ev);
  }
 
export default class Demo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            question: "",
            answer:""
        }
    }
 
    componentDidMount(){
       initEvent();
    //    var msg={};
    //    var thates = this;
    //    var msgId=1;
    //     var btnElem=document.getElementById("microphone");//获取ID
    //     btnElem.addEventListener("touchstart", function(event) {
    //         //event.preventDefault();//阻止浏览器默认行为
    //         HZRecorder.get(function (rec) {
    //             recorder = rec;
    //             recorder.start();
    //         });
    //     });

    //     btnElem.addEventListener("touchend", function(event) {
    //         //event.preventDefault();
    //         HZRecorder.get(function (rec) {
    //             recorder = rec;
    //             recorder.stop();
    //         })
    //         //发送音频片段
    //         var data=recorder.getBlob();
    //         if(data.duration==0){
    //             alert("请先录音");
    //             return;
    //         }
    //     if(data.duration!==0){
    //         //导出wav文件
    //         //  downloadRecord(data.blob);
    //         msg[msgId]=data;
    //         recorder.clear();
    //         var dur=data.duration/10;
    //         var str="<div class='warper'><div id="+msgId+" class='voiceItem' >"+dur+"s</div></div>"
    //         $(".messages").append(str);
    //         msgId++;
    //         let formData = new FormData();
    //         formData.append("file", data.blob);
    //         HttpService.post("reportServer/MyVoiceApplication/uploadai",formData).then(response=>{
    //             if(response.resultCode=="1000"){
    //                 thates.setState({question:response.data.content});
    //                 fetch('http://www.tuling123.com/openapi/api?key=f0d11b6cae4647b2bd810a6a3df2136f&info=' + response.data.content, {
    //                     method: 'POST',
    //                     type: 'cors'
    //                 }).then(function (response) {
    //                     return response.json();
    //                 }).then(function (detail) {
    //                     if (detail.code === 100000) {
    //                         thates.setState({ answer :detail.text},function(){
    //                             thates.yuyin();
    //                         }); 
    //                     }
    //                 });
    //             }
    //         });
        
    //         $(".voiceItem").click(function(){
    //                 var id=$(this)[0].id;
    //                 var data=msg[id];
    //                 playRecord(data.blob);
    //         });
    //         }
    //     });
    }
    onInputChange(name, value) {
        this.setState({
          [name]: value
        });
      }
      onInputKeyUp(e) {
        if (e.keyCode === 13) {
          this.yuyin();
        }
      }
   yuyin(){
       if(null!=this.state.answer && ""!=this.state.answer){
        fetch(window.getServerUrl()+'reportServer/MyVoiceApplication/yuyin', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'credentials': JSON.stringify(localStorge.getStorage('userInfo') || '')
                },
                body:this.state.answer
        }).then(function (resyy) {
            if (resyy.ok) {
              let msgId=1;
              resyy.blob().then((blob) => {
                let size=blob.size;
                let time=size*8/16/2/8000;
                    time=time.toFixed(1);
                    var audio = document.querySelector('audio');
                    audio.src = window.URL.createObjectURL(blob);
                    msg[1]=blob;
                    var dur=time;
                    var str="<div class='warper'><div id="+1+" class='voiceItemlet' >"+dur+"s</div></div>"
                    $(".messages").append(str);
                    msgId++;
                    $(".voiceItemlet").click(function(){
                        playRecord(blob);
                    });
                })
            } 
        });
        }
    }
    handleStart(e){
        this.setState({
            saying:true
        });
    }
    handleTouchMove(e) {
        // this.setState({
        //     saying:false,
        // });
    }

    handleTouchEnd (e) {
        this.setState({
            saying:false,
        });
    }
    render() {
        return (
            <div>
                <div class="messages"></div>
                <Script url="../src/page/ai/jquery-3.2.1.min.js"/>
                <Script url="../src/page/ai/record.js"/>
                <Script url="../src/page/ai/wcPop.js"/>

                <InputItem  type="text"  name="answer"  placeholder="输入用户名"  clear
                    onKeyUp={e => this.onInputKeyUp(e)} 
                    onChange={(v) => this.onInputChange('answer', v)}
                    // value={'问:'+this.question +' 回答:'+ answer}
                    // extra={<Button type="primary" onClick={()=>this.yuyin()}  size="small" >语音合成</Button>}
                ></InputItem>

                <audio controls autoplay></audio>
                {/* <div className="issaying"><img src={saying}  className="saying"/></div> */}
                {this.state.saying==true?<div className="saying">
                    <img src={require("../../assets/saying.gif")}/>
                </div>:''}
                <div style={{textAlign:'center',margin:'10px'}}>
                    <Button type="primary" onClick={()=>this.yuyin()} inline size="small" style={{marginRight: '4px' }}>语音合成</Button>
                    <Button type="primary" id="microphone"  
                        onTouchStart={this.handleStart.bind(this)}  //使用bind(this)改变函数作用域，不加上bind则this指向的是全局对象window而报错。
                        onTouchMove={this.handleTouchMove.bind(this)}
                        onTouchEnd={this.handleTouchEnd.bind(this)} 
                        inline size="small">按住  说话</Button> 
                </div>
            </div>
        );
    }
}