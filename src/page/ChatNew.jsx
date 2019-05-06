import React, { PureComponent, lazy, Suspense }  from 'react';
import ReactDOM from 'react-dom';
import {  Card,List,Toast, ListView,PullToRefresh,WhiteSpace,WingBlank, TextareaItem , SwipeAction,  NavBar, Icon } from 'antd-mobile';
import ai from './../assets/icon/ai.png';
import HttpService from '../util/HttpService.jsx';
import my from './../assets/icon/chart.png';
import Script from 'react-load-script';

import LocalStorge from '../util/LogcalStorge.jsx';
const localStorge = new LocalStorge();
//import 'antd-mobile/dist/antd-mobile.css';
import './Chat.css';
import "babel-polyfill";
const Item = List.Item;
const Brief = Item.Brief;
var recorder;        
var XLJZ = '查看更多信息';
var SKJZ = '松开加载';
var JZ = '加载中...'
var dropDownRefreshText = XLJZ;
var dragValve = 40; // 下拉加载阀值
var scrollValve = 40; // 滚动加载阀值
const url=window.getServerUrl();
export default class ChatNew extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      meg: '',
      isWrite:true,
      saying:false,
      data: [],
      userId:null,
      to_userId:0,
      pageNumd: 1, 
      perPaged: 5,
      userIcon:'',
      fileIcon:'./../src/assets/icon/down.png',
      questionList: [],
      translate: 0,//位移
      dragLoading: false,//是否在下拉刷新中
      scrollerLoading: false,//是否在加载更多中
      openDragLoading: false,//是否开启下拉刷新
      openScrollLoading: false,//是否开启下拉刷新
      btnText:"按住录音",
      refreshing: false,
      down: true,
      height: document.documentElement.clientHeight,
    }
    this.page=1;
  }
  componentDidMount() {
    const hei = this.state.height - ReactDOM.findDOMNode(this.lv).offsetTop;
    setTimeout(() => {
      this.setState({
        height: hei,
        //data: genData(this.state.data),
        refreshing: false
      });
    }, 1500);
    let userInfo = localStorge.getStorage('userInfo');
    if (undefined != userInfo && null != userInfo && '' != userInfo) {
      this.setState({ userId:userInfo.id,
            userIcon:userInfo.icon==undefined?'':url+"/report/"+userInfo.icon},
        function(){
            this.fetchItems(true);
            // this.loadQuestion();
        });
        this.initEvent();
    }else{
      window.location.href="/My";
    }
  }
  onRefreshs = () => {
    this.setState({ refreshing: true });
    setTimeout(() => {
      this.setState({ refreshing: false,
      //  data: genData(this.state.data), 
      });
      this.fetchItems(false);
    }, 600);
}
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
  fetchItems(isTrue) {
      let mInfo={'from_userId':this.state.userId,'to_userId':this.state.to_userId,
            pageNumd:this.page,perPaged:5}
      HttpService.post('/reportServer/chat/getChatByuserID', JSON.stringify(mInfo))
      .then(res => {
        let list=res.data;
        for(var i=0;i<list.length;i++){
          this.setState({data: [list[i],...this.state.data] });
        }
        // this.refs.dropDownRefreshText.innerHTML = (dropDownRefreshText = XLJZ);
        // if(isTrue){
        // this.initRefresh();//初始化下拉刷新
        // this.initScroll();//初始化滚动加载更多
        // }
          ++this.page;
      });
  }
  loadQuestion(){
    let listParam = {};
    listParam.pageNum  = 1;
    listParam.perPage  = 5;
    HttpService.post('/reportServer/questions/getQuestionsList', JSON.stringify(listParam))
    .then(res => {
      if (res.resultCode != "1000") {
        this.setState({questionList:res.list,data: [...this.state.data,{data:res.list,message_type:"question"}] });
      }
    })
  }

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
        ist=false;
      }else{
        this.setState({
          data: [...this.state.data, {from_userId: this.state.userId,'post_message':question,to_userId:this.state.to_userId}]
        });
      }
    })
    if(ist){
      let listParam = {};
          listParam.question_id  =question_id;
          listParam.pageNum  = 1;
          listParam.perPage  = 1;
      HttpService.post('/reportServer/questions/getDefaultAnswerByQID/'+question_id,null)
      .then(res=>{
        if(null!=res && res.data.length>0){
          this.setState({
            data: [...this.state.data, {from_userId: this.state.to_userId,'post_message':res.data[0].answer,to_userId:this.state.userId}]
          },function(){
            anchorElement.scrollIntoView();
          });
        }else{
          this.setState({
            data: [...this.state.data, {from_userId: this.state.to_userId,'post_message':"没有符合您问题的答案，请重新选择",to_userId:this.state.userId}]
          },function(){
            this.setState({questionList:res.list,data: [...this.state.data,{data:this.state.questionList,message_type:"question"}] },function(){
              anchorElement.scrollIntoView();
            });
          });
        }
      });
    }
  }
  // initRefresh=()=> {
  //   var self = this;//对象转存，防止闭包函数内无法访问
  //   var isTouchStart = false; // 是否已经触发下拉条件
  //   var isDragStart = false; // 是否已经开始下拉
  //   var startX, startY;        // 下拉方向，touchstart 时的点坐标
  //   var hasTouch = 'ontouchstart' in window;//判断是否是在移动端手机上
  //   // 监听下拉加载，兼容电脑端
  //   //let pullDown = document.getElementById("messages");
  //   if (self.state.openDragLoading) {
  //     self.refs.scroller.addEventListener('touchstart', touchStart, false);
  //     self.refs.scroller.addEventListener('touchmove', touchMove, false);
  //     self.refs.scroller.addEventListener('touchend', touchEnd, false);
  //     self.refs.scroller.addEventListener('mousedown', touchStart, false);
  //     self.refs.scroller.addEventListener('mousemove', touchMove, false);
  //     self.refs.scroller.addEventListener('mouseup', touchEnd, false);
  //   }
  //   function touchStart(event) {
  //   // event.preventDefault();
  //   if(undefined!=event.changedTouches){
  //       if (self.refs.scroller.scrollTop <= 0) {
  //           isTouchStart = true;
  //           startY = hasTouch ? event.changedTouches[0].pageY : event.pageY;
  //           startX = hasTouch ? event.changedTouches[0].pageX : event.pageX;
  //       }
  //     }
  //   }

  //   function touchMove(event) {
  //   // event.preventDefault();
  //   if(undefined!=event.changedTouches){
  //       if (!isTouchStart) return;
  //       var distanceY = (hasTouch ? event.changedTouches[0].pageY : event.pageY) - startY;
  //       var distanceX = (hasTouch ? event.changedTouches[0].pageX : event.pageX) - startX;
  //       //如果X方向上的位移大于Y方向，则认为是左右滑动
  //       if (Math.abs(distanceX) > Math.abs(distanceY))return;
  //       if (distanceY > 0) {
  //           self.setState({
  //               translate: Math.pow((hasTouch ? event.changedTouches[0].pageY : event.pageY) - startY, 0.85)
  //           });
  //       } else {
  //           if (self.state.translate !== 0) {
  //               self.setState({translate: 0});
  //               self.transformScroller(0, self.state.translate);
  //           }
  //       }
  //       if (distanceY > 0) {
  //           if (!isDragStart) {
  //               isDragStart = true;
  //           }
  //           if (self.state.translate <= dragValve) {// 下拉中，但还没到刷新阀值
  //               if (dropDownRefreshText !== XLJZ){
  //                   self.refs.dropDownRefreshText.innerHTML = (dropDownRefreshText = XLJZ);
  //                   console.log("下拉加载")
  //               }
  //           } else { // 下拉中，已经达到刷新阀值
  //               if (dropDownRefreshText !== SKJZ){
  //                   self.refs.dropDownRefreshText.innerHTML = (dropDownRefreshText = SKJZ);
  //                   console.log("松开加载");
  //                 }
  //           }
  //           self.transformScroller(0, self.state.translate);
  //       }
  //     }
  //   }
  //   function touchEnd(event) {
  //     //  event.preventDefault();
  //     if(undefined!=event.changedTouches){
  //         isDragStart = false;
  //         if (!isTouchStart) return;
  //         isTouchStart = false;
  //         if (self.state.translate <= dragValve) {
  //             self.transformScroller(0.3, 0);
  //         } else {
  //             self.setState({dragLoading: true});//设置在下拉刷新状态中
  //             self.transformScroller(0.1, 0);
  //             console.log("加载中....");
  //             self.refs.dropDownRefreshText.innerHTML = (dropDownRefreshText = JZ);
  //             self.fetchItems(false);//触发冲外面传进来的刷新回调函数
  //         }
  //     }
  //   } 
  // }

  // initScroll=()=> {
  //     var self = this;
  //     //let scroller = document.getElementById("messages");
  //     // 监听滚动加载
  //     if (this.state.openScrollLoading) {
  //       this.refs.scroller.addEventListener('scroll', scrolling, false);
  //     }
  //     function scrolling() {
  //         if (self.state.scrollerLoading) return;
  //         var scrollerscrollHeight = self.refs.scroller.scrollHeight; // 容器滚动总高度
  //         var scrollerHeight =self.refs.scroller.getBoundingClientRect().height;// 容器滚动可见高度
  //         var scrollerTop = self.refs.scroller.scrollTop;//滚过的高度
  //         // 达到滚动加载阀值
  //         if (scrollerscrollHeight - scrollerHeight - scrollerTop <= scrollValve) {
  //             self.setState({scrollerLoading: true});
  //             self.fetchItems(false);
  //         }
  //     }
  // }
  /**
   * 利用 transition 和transform  改变位移
   * @param time 时间
   * @param translate  距离
   */
  // transformScroller=(time, translate)=> {
  //     this.setState({translate: translate});
  //     //let scroller = document.getElementById("messages");
  //     var elStyle =  this.refs.scroller.style;
  //     elStyle.webkitTransition = elStyle.MozTransition = elStyle.transition = 'all ' + time + 's ease-in-out';
  //     elStyle.webkitTransform = elStyle.MozTransform = elStyle.transform = 'translate3d(0, ' + translate + 'px, 0)';
  // }
  /**
   * 下拉刷新完毕
   */
  // dragLoadingDone=()=> {
  //     this.setState({dragLoading: false});
  //     this.transformScroller(0.1, 0);
  // }
  /**
   * 滚动加载完毕
   */
  // scrollLoadingDone=()=> {
  //     this.setState({scrollerLoading: false});
  //     console.log("下拉加载");
  //     this.refs.dropDownRefreshText.innerHTML = (dropDownRefreshText = XLJZ);
  // }
  // componentWillReceiveProps=(nextProps)=> {
  //     var self = this;
  //     self.fetchItems(false);//把新的数据填进列表
  //     if (this.state.dragLoading) {//如果之前是下拉刷新状态，恢复
  //         setTimeout(function () {
  //             self.dragLoadingDone();
  //         }, 1000);
  //     }
  //     if (this.state.scrollerLoading) {//如果之前是滚动加载状态，恢复
  //         setTimeout(function () {
  //             self.scrollLoadingDone();
  //         }, 1000);
  //     }
  // }
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
        this.setState({
                  data: [...this.state.data, {from_userId: this.state.userId,'post_message':message,to_userId:this.state.to_userId}]
                });
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
            anchorElement.scrollIntoView();
          }
        })
        if(false){
          let qryParam=[{in: {begindate: "", enddate: "", org_id: "", po_number: "", vendor_name: "电讯盈科"}}];
          await HttpService.post('/reportServer/query/execqueryToExcel/2/87', JSON.stringify(qryParam))
          .then(res=>{
          //函数查询 execQuery  execqueryToExcel
          // })
          // //首先进行
          // await HttpService.post('/reportServer/nlp/getResult/' + newMessage, null)
          //   .then(res => {
              if (res.resultCode == "1000") {
                if(undefined== res.data.filetype){
                  res.data.filetype="json";
                }
                //数据保存到数据库
                let responseInfo={'from_userId':this.state.to_userId,
                'to_userId':this.state.userId,
                'post_message':res,
                'message_type':res.data.filetype,
                'message_state':'0'
                }
                  HttpService.post('/reportServer/chat/createChat', JSON.stringify(responseInfo))
                      .then(res => {
                      if (res.resultCode != "1000") {
                      }
                  })
                  this.setState({
                    data: [...this.state.data, {from_userId:this.state.to_userId,'post_message':res,'message_type':res.data.filetype,to_userId: this.state.userId}]
                  });
                  anchorElement.scrollIntoView();
              } else {

              }
            })
            .catch((error) => {
               Toast.fail(error);
            });
          var that = this;
          fetch('https://api.ownthink.com/bot?spoken=' + message, {
            method: 'POST',
            type: 'cors'
          }).then(function (response) {
            return response.json();
          }).then(function (detail) {
            if (detail.message =="success") {
              let responseInfo={'from_userId':that.state.to_userId,
                      'to_userId':that.state.userId,
                      'post_message':detail.data.info.text,
                      'message_type':'0',
                      'message_state':'0'
                    }
              HttpService.post('/reportServer/chat/createChat', JSON.stringify(responseInfo))
                .then(res => {
                  if (res.resultCode != "1000") {
                  }
                })
            return that.setState({
                        data: [...that.state.data, {from_userId: 0,'post_message':detail.data.info.text,to_userId: that.state.userId}]
                      },function(){
                        anchorElement.scrollIntoView();
                      });
                      anchorElement.scrollIntoView();

            } else {
            }
          })
        }
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
                    {data.map(val => (
                        <Item
                        multipleLine
                        onClick={() => this.onClassClick(val.class_id)}
                        >
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
            );
        }else{
         
        }
      }else 
      if (props.message_type=="file"){
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
      } else 
      if (props.message_type=="text"){
        return props.post_message;
      }else 
      if (props.message_type=="voice") {
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
      }
      else{
        return props.post_message;
      }
    };
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
  render() {
    var meg = this.state.meg
    return (
        <div className="content" >
          <Script url="../src/page/ai/jquery-3.2.1.min.js"/>
          <Script url="../src/page/ai/record.js"/>
          <div className="header" style={{textAlign:'center'}}>
              <span style={{textAlign:'center'}}>PCCW智能机器人</span>
              {/* <span style={{float: "left"}}><Link to={`/Main`}><img src={require("../assets/返回.svg")} style={{width:"20px",height:"20px",marginTop:'10px'}}/></Link></span>
              <span style={{float: "right"}} id="root"></span> */}
          </div>
          <div ref="scroller" style={{width:"100%",height:'100%',overflow:'auto',flex:1}}>
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
              {this.state.data.map((elem,index) => {
                  if(elem.from_userId==this.state.userId){
                    return <li style={{background:'#f5f5f9' }} >
                          <img src={this.state.userIcon==''?my:this.state.userIcon} className="imgright"/><span style={{float:"right"}}>
                          {this.RenderContent(elem)}
                        </span>
                      </li>
                  } else{
                    return <li style={{background:'#f5f5f9' }} >
                        <img src={ai} className="imgleft"/><span style={{float:"left",background:'#f1ebeb00'}}>
                        {this.RenderContent(elem)}
                        </span></li>
                  }
              })}
               <div id="scrolld"> </div>
              </PullToRefresh>
            </ul>
           
          </div>
         
          {this.state.saying==true?<div className="saying"> <img src={require("../assets/saying.gif")}/></div>:''}
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
      </div>
    )
  }
}