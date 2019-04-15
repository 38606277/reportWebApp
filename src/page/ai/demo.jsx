import React from "react";
import {  WhiteSpace, Icon, InputItem, Toast, Button } from 'antd-mobile';
import "./demo.css";
import Script from 'react-load-script';
import HttpService from '../../util/HttpService.jsx';
import LocalStorge from '../../util/LogcalStorge.jsx';
const localStorge = new LocalStorge();
var recorder;        
var msg={};

//var audio = document.querySelector('audio');
    // function initEvent() {
    //     var msgId=1;
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
    //             console.log(response); 
    //         });
    //         // recorder.upload(window.getServerUrl()+"reportServer/MyVoiceApplication/uploadai", function (state, e) {
    //         //     switch (state) {                        
    //         //         case 'uploading':                            
    //         //     //var percentComplete = Math.round(e.loaded * 100 / e.total) + '%';
    //         //             break;                        
    //         //         case 'ok':                            
    //         //             //alert(e.target.responseText);
    //         //             console.log("成功");                            
    //         //             break;                        
    //         //         case 'error':
    //         //             alert("上传失败");                            
    //         //             break;                        
    //         //         case 'cancel':
    //         //             alert("上传被取消");                            
    //         //             break;
    //         //     }
    //         // });
    //         $(".voiceItem").click(function(){
    //                 var id=$(this)[0].id;
    //                 var data=msg[id];
    //                 playRecord(data.blob);
    //         });
    //         }
    //     });
    // };

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
       // initEvent();
       var msg={};
       var thates = this;
       var msgId=1;
        var btnElem=document.getElementById("microphone");//获取ID
        btnElem.addEventListener("touchstart", function(event) {
            //event.preventDefault();//阻止浏览器默认行为
            HZRecorder.get(function (rec) {
                recorder = rec;
                recorder.start();
            });
        });

        btnElem.addEventListener("touchend", function(event) {
            //event.preventDefault();
            HZRecorder.get(function (rec) {
                recorder = rec;
                recorder.stop();
            })
            //发送音频片段
            var data=recorder.getBlob();
            if(data.duration==0){
                alert("请先录音");
                return;
            }
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
                    thates.setState({question:response.data.content});
                    fetch('http://www.tuling123.com/openapi/api?key=f0d11b6cae4647b2bd810a6a3df2136f&info=' + response.data.content, {
                        method: 'POST',
                        type: 'cors'
                    }).then(function (response) {
                        return response.json();
                    }).then(function (detail) {
                        if (detail.code === 100000) {
                            thates.setState({ answer :detail.text},function(){
                                thates.yuyin();
                            }); 
                        }
                    });
                }
            });
        
            $(".voiceItem").click(function(){
                    var id=$(this)[0].id;
                    var data=msg[id];
                    playRecord(data.blob);
            });
            }
        });
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
    render() {
        return (
            <div>
                <div class="messages"></div>
                <Script url="../src/page/ai/jquery-3.2.1.min.js"/>
                <Script url="../src/page/ai/record.js"/>
                <InputItem  type="text"  name="answer"  placeholder="输入用户名"  clear
                    onKeyUp={e => this.onInputKeyUp(e)} 
                    onChange={(v) => this.onInputChange('answer', v)}
                    value={'问:'+this.state.question +' 回答:'+ this.state.answer}
                    // extra={<Button type="primary" onClick={()=>this.yuyin()}  size="small" >语音合成</Button>}
                ></InputItem>

                <audio controls autoplay></audio>
                <div style={{textAlign:'center',margin:'10px'}}>
                    <Button type="primary" onClick={()=>this.yuyin()} inline size="small" style={{marginRight: '4px' }}>语音合成</Button>
                    <Button type="primary" id="microphone" inline size="small">录音</Button>
                </div>
            </div>
        );
    }
}