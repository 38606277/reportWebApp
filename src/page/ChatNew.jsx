import React, { PureComponent, lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Card, List, Toast, ListView, Modal, PullToRefresh, WhiteSpace, WingBlank, TextareaItem, SwipeAction, NavBar, Icon } from 'antd-mobile';
import ai from './../assets/icon/ai.png';
import HttpService from '../util/HttpService.jsx';
import my from './../assets/icon/chart.png';
import Script from 'react-load-script';
import moment from 'moment';
import LocalStorge from '../util/LogcalStorge.jsx';
const localStorge = new LocalStorge();
//import 'antd-mobile/dist/antd-mobile.css';
import './Chat.css';
import "babel-polyfill";
const Item = List.Item;
const Brief = Item.Brief;
var recorder;
const url = window.getServerUrl();
export default class ChatNew extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        meg: '',
        modal1: false,
        isWrite: true,
        saying: false,
        data: [],
        modelData: [],
        modelOut: [],
        userId: null,
        to_userId: 0,
        pageNumd: 1,
        perPaged: 5,
        userIcon: '',
        fileIcon: './../src/assets/icon/down.png',
        questionList: [],
        btnText: "按住录音",
        refreshing: false,
        down: true,
        height: document.documentElement.clientHeight,
      }
      this.page = 1;
    }
    componentDidMount() {
        const hei = this.state.height - ReactDOM.findDOMNode(this.lv).offsetTop;
        let userInfo = localStorge.getStorage('userInfo');
        if (undefined != userInfo && null != userInfo && '' != userInfo) {
          this.setState({ userId:userInfo.id,
                  userIcon:userInfo.icon==undefined?'':url+"/report/"+userInfo.icon,
            },function(){
              let mInfo={'from_userId':this.state.userId,'to_userId':this.state.to_userId,
              pageNumd:this.page,perPaged:5}
              HttpService.post('/reportServer/chat/getChatByuserID', JSON.stringify(mInfo))
              .then(res => {
                let list=res.data;
                let newdata=[];
                if(list.length>0){
                  for(var i=0;i<list.length;i++){
                    newdata.unshift(list[i]);
                  }
                  newdata=newdata.concat(this.state.data);
                  ++this.page;
                }else{
                  newdata=newdata.concat(this.state.data);
                }
                this.setState({ refreshing: false, height: hei,data:newdata},function(){
                  this.loadQuestion();
                  var anchorElement = document.getElementById("scrolld");
                      anchorElement.scrollIntoView();
                });
              });
                // setTimeout(() => {
                //   this.setState({
                //     height: hei,
                //     data: this.fetchItems(), 
                //     refreshing: false,
                //   });
                // }, 1500);
              });
          this.initEvent();
        }else{
          window.location.href="/My";
        }
    }
  
    //初始化音频
    initEvent() {
      var btnElem=document.getElementById("microphone");//获取ID
      btnElem.addEventListener("touchstart", function(event) {
          event.preventDefault();//阻止浏览器默认行为
          HZRecorder.get(function (rec) {
              recorder = rec;
              recorder.start();
          });
      });
      let that =this;
      btnElem.addEventListener("touchend", function(event) {
          event.preventDefault();
          HZRecorder.get(function (rec) {
              recorder = rec;
              recorder.stop();
          })
          //发送音频片段
          var data=recorder.getBlob();
          if(data.duration!==0){
              recorder.clear();
              var dur=data.duration/10;
              let formData = new FormData();
              formData.append("file", data.blob);
              HttpService.post("reportServer/MyVoiceApplication/uploadai",formData).then(response=>{
                  if(response.resultCode=="1000"){
                    that.setState({meg:response.data.content});
                  }
              });
          }else{
              console.log("没有声音输入");
          } 
      });
    }
    //获取服务器信息
    // async fetchItems(isTrue) {
    //     let newdata=[];
    //     let cc=[];
    //     var anchorElement = document.getElementById("scrolld");
    //       let mInfo={'from_userId':this.state.userId,'to_userId':this.state.to_userId,
    //             pageNumd:this.page,perPaged:5}
    //     await HttpService.post('/reportServer/chat/getChatByuserID', JSON.stringify(mInfo))
    //       .then(res => {
    //         let list=res.data;
    //         for(var i=0;i<list.length;i++){
    //           newdata.unshift(list[i]);
    //           // this.setState({data: [list[i],...this.state.data] });
    //         }
    //         cc=newdata.concat(this.state.data);
    //         ++this.page;
    //         // if(isTrue){
    //         //   anchorElement.scrollIntoView();
    //         //   // this.initRefresh();//初始化下拉刷新
    //         //   // this.initScroll();//初始化滚动加载更多
    //         // }
    //       });
    //       return cc;
    // }
    //下拉加载数据  
    onRefreshs = () => {
      this.setState({ refreshing: true },function(){
        let mInfo={'from_userId':this.state.userId,'to_userId':this.state.to_userId,
        pageNumd:this.page,perPaged:5}
        HttpService.post('/reportServer/chat/getChatByuserID', JSON.stringify(mInfo))
        .then(res => {
          let list=res.data;
          let newdata=[];
          if(list.length>0){
            for(var i=0;i<list.length;i++){
              newdata.unshift(list[i]);
            }
            newdata=newdata.concat(this.state.data);
            ++this.page;
          }else{
            newdata=newdata.concat(this.state.data);
          }
          this.setState({ refreshing: false, data:newdata });
        });
      });
      // setTimeout(() => {
      //   let nd=this.fetchItems(false);
      //   this.setState({ refreshing: false,
      //     data:nd
      //   });
      //   //this.fetchItems(false)
      // }, 600);
    }
    //显示问答列表
    loadQuestion(){
      var anchorElement = document.getElementById("scrolld");
      let listParam = {};
      listParam.pageNum  = 1;
      listParam.perPage  = 5;
      HttpService.post('/reportServer/questions/getQuestionsList', JSON.stringify(listParam))
      .then(resQes => {
          this.setState({questionList:resQes.list,data: [...this.state.data,{data:resQes.list,message_type:"question"}] 
        },function(){
            anchorElement.scrollIntoView();
          });
      })
    }
    //选中问答列表的问题获取答案
    async onQuestionClick(question_id,question){
      var anchorElement = document.getElementById("scrolld");
      var ist=true; 
      //先保存发送信息
      let userInfo={'from_userId':this.state.userId,
                    'to_userId':this.state.to_userId,
                    'post_message':question,
                    'message_type':'0',
                    'message_state':'0'
                  }
      await HttpService.post('/reportServer/chat/createChat', JSON.stringify(userInfo))
      .then(res => {
        if (res.resultCode != "1000") {
          ist = false;
        } else {
          this.setState({
            data: [...this.state.data, { from_userId: this.state.userId, 'post_message': question, to_userId: this.state.to_userId }]
          }, function () {
            anchorElement.scrollIntoView();
          });
        }
      })
      if (ist) {
        let listParam = {};
        listParam.question_id = question_id;
        listParam.pageNum = 1;
        listParam.perPage = 1;
        HttpService.post('/reportServer/questions/getDefaultAnswerByQID/' + question_id, null)
          .then(res => {
            if (null != res && res.data.length > 0) {
              this.setState({
                data: [...this.state.data, { from_userId: this.state.to_userId, 'post_message': res.data[0].answer, to_userId: this.state.userId }]
              }, function () {
                anchorElement.scrollIntoView();
              });
            } else {
              this.setState({
                data: [...this.state.data, {from_userId: this.state.to_userId,'post_message':"没有符合您问题的答案，请重新选择",to_userId:this.state.userId}]
              },function(){
                this.setState({
                  questionList:res.list,data: [...this.state.data,{data:this.state.questionList,message_type:"question"}] 
                },function(){
                  anchorElement.scrollIntoView();
                });
              });
            }
          });
      }
    }
    //实时把数据写入state的meg中
    handleData(e) {
      this.setState({
        meg: e
      })
    }
    //发送消息
    async sendMessage(){ 
      if(null!=this.state.meg && ""!=this.state.meg){
        var anchorElement = document.getElementById("scrolld");
          var ist=true; 
          //先保存发送信息
          var message = this.state.meg;
          this.state.meg = '';
          let userInfo={'from_userId':this.state.userId,
                        'to_userId':this.state.to_userId,
                        'post_message':message,
                        'message_type':'0',
                        'message_state':'0'
                      }
          await HttpService.post('/reportServer/chat/createChat', JSON.stringify(userInfo))
          .then(res => {
            if (res.resultCode != "1000") {
              ist=false;
            }else{
              this.setState({
                data: [...this.state.data, {from_userId: this.state.userId,'post_message':message,to_userId:this.state.to_userId}]
              },function(){
                anchorElement.scrollIntoView();
              });
            }
          })
          if(ist){
            // let qryParam=[{in: {begindate: "", enddate: "", org_id: "", po_number: "", vendor_name: "电讯盈科"}}];
            // await HttpService.post('/reportServer/query/execQuery/2/87', JSON.stringify(qryParam))
            // .then(res=>{
            //函数查询 execQuery  execqueryToExcel
            // })
            //首先进行
            await HttpService.post('/reportServer/nlp/getResult/' + message, null)
              .then(res => {
                if (res.resultCode == "1000") {
                  this.setState({
                    data: [...this.state.data, {
                      from_userId:this.state.to_userId,
                      'post_message':res.data.post_message,
                      'message_type':res.data.message_type,
                      to_userId: this.state.userId}]
                  });
                  anchorElement.scrollIntoView();
              }
            })
          }
      }
    }
  
   //回车发送消息
    onInputKeyUp(e){
        if(e.keyCode === 13){
          this.sendMessage();
        }
    }
    //组装显示数据
    RenderContent = (props) => {
      if (props.message_type=="json"){
        let ress=null;
        if (typeof props.post_message === 'string') {
          ress=JSON.parse(props.post_message);
        }else{
          ress=props.post_message;
        }
        let data=ress.data.list;
        let out=ress.data.out;
        if(null!=data){
            return (
              <Card style={{backgroundColor:'#f4f7f9'}}>
                  <List>
                        <Item
                          multipleLine
                          >
                          {out.map((item) => {
                              return <div  style={{fontSize:'14px',fontFamily:'微软雅黑',backgroundColor:'#F4F7F9'}}>
                              {item.out_name}:{data[0][item.out_id.toUpperCase()]}
                              </div> 
                          }
                          )} 
                          </Item>
                    {data.length>1? <Item>
                      <a onClick={()=>this.showModal(data,out)} href="javascript:void(0)">查看更多详情</a>

                     </Item>:''}
                  </List>
              </Card> 
            );
        }
      }else if (props.message_type=="file"){
          let fileIcon='./../src/assets/icon/down.png';
          let ress=null;
          if (typeof props.post_message === 'string') {
            ress=JSON.parse(props.post_message);
          }else{
            ress=props.post_message;
          }
          let data= ress.data.fileName;
          let file= ress.data.filePath;
          var fileExtension = file.substring(file.lastIndexOf('.') + 1);
          fileExtension=fileExtension.toUpperCase();
          if(fileExtension=='DOC' || fileExtension=='DOCX'){
            fileIcon="./../src/assets/icon/word.png";
          }else  if(fileExtension=='XLS' || fileExtension=='XLSX'){
            fileIcon="./../src/assets/icon/excel.png";
          }else  if(fileExtension=='PPT' || fileExtension=='PPTX'){
            fileIcon="./../src/assets/icon/ppt.png";
          }
          return (<List style={{backgroundColor:'#f4f7f9',maxWidth:'370px'}}>
                    <Item align="top" thumb={fileIcon} multipleLine>
                      <a onClick={()=>this.domnFile(file)} href="javascript:void(0);" target="_black" style={{marginRight:'5px'}}>{data}</a>
                      <Brief><a onClick={()=>this.domnFile(file)} href="javascript:void(0);" target="_black" style={{marginRight:'5px'}}>点击下载</a></Brief>
                    </Item>
                  </List>
          );
      }else if(props.message_type=="text"){
        return props.post_message;
      }else if(props.message_type=="voice") {
        return <audio src={props.post_message ? props.post_message : ''} controls />;
      }else if(props.message_type=="question"){
        return <List renderHeader={() => '常见问题'} className="my-list">
                {props.data.map(item => (
                  <Item arrow="horizontal"
                    multipleLine
                    onClick={() => this.onQuestionClick(item.ai_question_id,item.ai_question)}
                  >
                    <div  style={{fontSize:'14px',fontFamily:'微软雅黑',backgroundColor:'#F4F7F9'}}>
                        {item.ai_question}
                    </div>
                  </Item>
                ))}
              </List>
      }else{
        return props.post_message;
      }
    }
    async domnFile(filepath){
      await fetch(url+'reportServer/uploadFile/downloadFile', {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
             'credentials': JSON.stringify(localStorge.getStorage('userInfo') || '')
           },
           body:filepath
         }).then(function (response) {
           if (response.ok) {
             response.blob().then((blob) => {
               if(blob.size>0){
               const a = window.document.createElement('a');
               const downUrl = window.URL.createObjectURL(blob);// 获取 blob 本地文件连接 (blob 为纯二进制对象，不能够直接保存到磁盘上)
                a.href = downUrl;
                a.download = filepath.substr(filepath.lastIndexOf("/")+1);
                a.click();
               window.URL.revokeObjectURL(downUrl);
             }else{
               Toast.fail("文件已丢失，请重新导出下载！");
             }
             });
           }
         });
     }
  handleStart(e){
      this.setState({
          saying:true,
          btnText:"松开结束"
      });
  }
  handleTouchMove(e) {
      this.setState({
          saying:false,
          btnText:"正在录音"
      });
  }
  handleTouchEnd (e) {
      this.setState({
          saying:false,
          btnText:"按住录音"
      });
  }
  //打开模式窗口
  showModal(data,out) {
    //e.preventDefault(); // 修复 Android 上点击穿透
    this.setState({
      modal1: true,
      modelData:data,
      modelOut:out
    });
  }
  onClose= key => () => {
    this.setState({
      modal1: false,
      modelData:[],
      modelOut:[]
    });
  }
  onWrapTouchStart = (e) => {
    // fix touch to scroll background page on iOS
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
      return;
    }
    const pNode = closest(e.target, '.am-modal-content');
    if (!pNode) {
      e.preventDefault();
    }
  }
  
  render() {
    var meg = this.state.meg
    return (
      <div className="content" >
        <Script url="../src/page/ai/jquery-3.2.1.min.js" />
        <Script url="../src/page/ai/record.js" />
        <div className="header" style={{ textAlign: 'center' }}>
          <span style={{ textAlign: 'center' }}>PCCW智能机器人</span>
          {/* <span style={{float: "left"}}><Link to={`/Main`}><img src={require("../assets/返回.svg")} style={{width:"20px",height:"20px",marginTop:'10px'}}/></Link></span>
              <span style={{float: "right"}} id="root"></span> */}
        </div>
        <div ref="scroller" style={{ width: "100%", height: '100%', overflow: 'auto', flex: 1 }}>
          {/* <div style={{textAlign:'center'}}>
              <span ref="dropDownRefreshText">查看更多信息</span>
            </div> */}
          <ul id="messages">
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
              {this.state.data.length>0 ? this.state.data.map((elem, index) => {
                if (elem.from_userId == this.state.userId) {
                  return <li style={{ background: '#f5f5f9' }} >
                    <div style={{ textAlign: 'center', padding: '3px' }}>{moment(elem.message_time).format('YYYY-MM-DD HH:mm:ss')}</div>
                    <img src={this.state.userIcon == '' ? my : this.state.userIcon} className="imgright" /><span style={{ float: "right" }}>
                      {this.RenderContent(elem)}
                    </span>
                  </li>
                } else {
                  return <li style={{ background: '#f5f5f9' }} >
                    <div style={{ textAlign: 'center', padding: '3px' }}>{moment(elem.message_time).format('YYYY-MM-DD HH:mm:ss')}</div>

                        <img src={ai} className="imgleft"/><span style={{float:"left",background:'#f1ebeb00'}}>
                        {this.RenderContent(elem)}
                        </span></li>
                  }
              }):''}
              <div id="scrolld"></div>
              </PullToRefresh>
            </ul>
            
          </div>
         
          {/* {this.state.saying==true?<div className="saying"> <img src={require("../assets/saying.gif")}/></div>:''} */}
          <div className="smartnlp-chat-msg-input">
            <div className="smartnlp-write-block">
              <div className="smartnlp-user-write-block">
                <div className="smartnlp-user-textarea">
                    <TextareaItem ref={el => this.autoFocusInst = el} 
                    placeholder="请输入您要咨询的问题"
                    value={meg} 
                    onChange={this.handleData.bind(this)}  
                    onKeyUp={e => this.onInputKeyUp(e)} 
                    className="smartnlp-text-content smartnlp-writeBox smartnlp-text-content-pc" 
                    name="writeBox" 
                    style={{height:'40px'}}
                    ></TextareaItem>
                 
                </div>
              </div>
              <div className="smartnlp-power-by">
              <p className="smartnlp-copy-right">Powered By PCCW机器人</p>
              </div>
              <div onClick={this.sendMessage.bind(this)} style={{backgroundColor: 'rgb(45, 142, 242)'}} className="smartnlp-send-out smartnlp-theme-color smartnlp-send-out-pc">
                <p >发送消息</p>
              </div>
              <div id="microphone"  
                            onTouchStart={this.handleStart.bind(this)}  //使用bind(this)改变函数作用域，不加上bind则this指向的是全局对象window而报错。
                            onTouchMove={this.handleTouchMove.bind(this)}
                            onTouchEnd={this.handleTouchEnd.bind(this)}  className="smartnlp-artificial smartnlp-theme-color">
                <p >{this.state.btnText}</p>
              </div>
            </div>
          </div>
         
        {/* <div className="footer">
              <div className="user_face_icon">
                <img src={this.state.isWrite==true?require("../assets/jp_btn.png"):require("../assets/yy_btn.png")} onClick={()=>this.changeSpeack()}/>
              </div>
              {this.state.isWrite==true? <div>
              <input id="text" type="text" placeholder="说点什么吧..." value={meg} onChange={this.handleData.bind(this)} onKeyUp={e => this.onInputKeyUp(e)}/>
              <span id="btn" className="sendmessagebtn" onClick={this.sendMessage.bind(this)} >发送</span>
              </div>
              : <div className="wenwen_text" id="wenwen" onClick={()=>this._touch_start(event)}>  按住 说话  </div>
              }
          </div> */}
        <Modal
          visible={this.state.modal1}
          title="数据详情"
          transparent
          maskClosable={false}
          closable={true}
          onClose={this.onClose()}
          wrapProps={{ onTouchStart: this.onWrapTouchStart }}
          style={{ height: '85%', width: '90%' }}
        >
          <div style={{ height: '100%', overflow: 'scroll', backgroundColor: '#f4f7f9',marginBottom:'30px' }}>
            <List>
              {this.state.modelData.map(val => (
                <Item
                // multipleLine
                // onClick={() => this.onClassClick(val.class_id)}
                >
                  {this.state.modelOut.map((item) => {
                    return <div style={{ fontSize: '14px', fontFamily: '微软雅黑', backgroundColor: '#F4F7F9' }}>
                      {item.out_name}:{val[item.out_id.toUpperCase()]}
                    </div>
                  }
                  )}
                </Item>
              ))}
            </List>
          </div>
        </Modal>
      </div>
    )
  }
}