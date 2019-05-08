import React from 'react';
import ReactDOM from 'react-dom';
import { Widget, addResponseMessage,toggleWidget,dropMessages,addLinkSnippet, addUserMessage, renderCustomComponent } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import ai from './../assets/icon/ai.png';
import HttpService from '../util/HttpService.jsx';
import my from './../assets/icon/chart.png';
import down from './../assets/icon/down.png';
import "babel-polyfill";
import { List, ListView, PullToRefresh, WhiteSpace, WingBlank, Toast, Checkbox, Card, SwipeAction, InputItem, NavBar, Icon } from 'antd-mobile';
import { Link, Redirect } from 'react-router-dom';
// import 'antd-mobile/dist/antd-mobile.css';
import './Chat.css';
import LocalStorge from '../util/LogcalStorge.jsx';
const localStorge = new LocalStorge();
// import Script from 'react-load-script';
// import IScroll from 'iscroll';
const Item = List.Item;
const Brief = Item.Brief;
const url=window.getServerUrl();
var XLJZ = '下拉加载';
var SKJZ = '松开加载';
var JZ = '加载中...'
var dropDownRefreshText = XLJZ;
var dragValve = 40; // 下拉加载阀值
var scrollValve = 40; // 滚动加载阀值
export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isWrite: true,
      saying: false,
      isClick: true,
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
      openDragLoading: true,//是否开启下拉刷新
      openScrollLoading: true,//是否开启下拉刷新
    }
    this.page = 1;
  }

 // 组件加载完成
  componentDidMount() {
    //调用组件内部方法打开窗口，再次调用是关闭；在组件销毁时调用一次关闭，可以保证每次打开都是开启状态
    toggleWidget();
    dropMessages();
    let userInfo = localStorge.getStorage('userInfo');
    if (undefined != userInfo && null != userInfo && '' != userInfo) {
      this.setState({ userId:userInfo.id,
        userIcon:userInfo.icon==undefined?'':url+"/report/"+userInfo.icon,
        translate: 0,
        openDragLoading: this.openDragLoading || true,//根据外面设置的开关改变自己的状态
        openScrollLoading: this.openScrollLoading || true},function(){
          this.fetchItems(true);
          // this.loadQuestion();
        });
    }else{
      window.location.href="/My";
    }
    
  }
  fetchItems(isTrue) {
        let mInfo={'from_userId':this.state.userId,'to_userId':this.state.to_userId,
              pageNumd:this.page,perPaged:5}
        HttpService.post('/reportServer/chat/getChatByuserID', JSON.stringify(mInfo))
        .then(res => {
          let list=res.data;
          for(var i=0;i<list.length;i++){
              if(this.state.userId==list[i].from_userId){
                addUserMessage(list[i].post_message);
              }else{
                if(list[i].message_type=='json'){
                    let ress=JSON.parse(list[i].post_message);
                    renderCustomComponent(this.FormD, {data: ress.data.list, out: ress.data.out }); 
                }else if(list[i].message_type=="file"){
                    let ress=JSON.parse(list[i].post_message);
                    renderCustomComponent(this.FormFile, {data:  ress.data.fileName, file:ress.data.filePath }); 
                }else if(list[i].message_type=="text"){
                    addResponseMessage(list[i].post_message);
                }else{
                    addResponseMessage(list[i].post_message);
                }
              }
          }
          if(isTrue){
            this.initRefresh();//初始化下拉刷新
            this.initScroll();//初始化滚动加载更多
          }
            ++this.page;
        });
    }

  //组件即将销毁
  componentWillUnmount() {
    //调用组件内部方法打开窗口，再次调用是关闭；在组件销毁时调用一次关闭，可以保证每次打开都是开启状态
    toggleWidget();
  }
  initRefresh=()=> {
    var self = this;//对象转存，防止闭包函数内无法访问
    var isTouchStart = false; // 是否已经触发下拉条件
    var isDragStart = false; // 是否已经开始下拉
    var startX, startY;        // 下拉方向，touchstart 时的点坐标
    var hasTouch = 'ontouchstart' in window;//判断是否是在移动端手机上
    // 监听下拉加载，兼容电脑端
    let pullDown = document.getElementById("messages");
    if (self.state.openDragLoading) {
      pullDown.addEventListener('touchstart', touchStart, false);
      pullDown.addEventListener('touchmove', touchMove, false);
      pullDown.addEventListener('touchend', touchEnd, false);
      pullDown.addEventListener('mousedown', touchStart, false);
      pullDown.addEventListener('mousemove', touchMove, false);
      pullDown.addEventListener('mouseup', touchEnd, false);
    }
    function touchStart(event) {
        if (pullDown.scrollTop <= 0) {
            isTouchStart = true;
            startY = hasTouch ? event.changedTouches[0].pageY : event.pageY;
            startX = hasTouch ? event.changedTouches[0].pageX : event.pageX;
        }
    }

    function touchMove(event) {
        if (!isTouchStart) return;
        var distanceY = (hasTouch ? event.changedTouches[0].pageY : event.pageY) - startY;
        var distanceX = (hasTouch ? event.changedTouches[0].pageX : event.pageX) - startX;
        //如果X方向上的位移大于Y方向，则认为是左右滑动
        if (Math.abs(distanceX) > Math.abs(distanceY))return;
        if (distanceY > 0) {
            self.setState({
                translate: Math.pow((hasTouch ? event.changedTouches[0].pageY : event.pageY) - startY, 0.85)
            });
        } else {
            if (self.state.translate !== 0) {
                self.setState({translate: 0});
                self.transformScroller(0, self.state.translate);
            }
        }

        if (distanceY > 0) {
            if (!isDragStart) {
                isDragStart = true;
            }
            if (self.state.translate <= dragValve) {// 下拉中，但还没到刷新阀值
                if (dropDownRefreshText !== XLJZ){
                   // self.refs.dropDownRefreshText.innerHTML = (dropDownRefreshText = XLJZ);
                    console.log("下拉加载")
                }
            } else { // 下拉中，已经达到刷新阀值
                if (dropDownRefreshText !== SKJZ){
                   // self.refs.dropDownRefreshText.innerHTML = (dropDownRefreshText = SKJZ);
                    console.log("松开加载");
                  }
            }
            self.transformScroller(0, self.state.translate);
        }
      }
      function touchEnd(event) {
          isDragStart = false;
          if (!isTouchStart) return;
          isTouchStart = false;
          if (self.state.translate <= dragValve) {
              self.transformScroller(0.3, 0);
          } else {
              self.setState({dragLoading: true});//设置在下拉刷新状态中
              self.transformScroller(0.1, 0);
              console.log("加载中....");
            //  self.refs.dropDownRefreshText.innerHTML = (dropDownRefreshText = JZ);
              self.fetchItems(false);//触发冲外面传进来的刷新回调函数
          }
      }
  }

  initScroll=()=> {
      var self = this;
      let scroller = document.getElementById("messages");

      // 监听滚动加载
      if (this.state.openScrollLoading) {
          scroller.addEventListener('scroll', scrolling, false);
      }

      function scrolling() {
          if (self.state.scrollerLoading) return;
          var scrollerscrollHeight = scroller.scrollHeight; // 容器滚动总高度
          var scrollerHeight =scroller.getBoundingClientRect().height;// 容器滚动可见高度
          var scrollerTop = scroller.scrollTop;//滚过的高度
          // 达到滚动加载阀值
          if (scrollerscrollHeight - scrollerHeight - scrollerTop <= scrollValve) {
              self.setState({scrollerLoading: true});
              self.fetchItems(false);
          }
      }
  }
  /**
   * 利用 transition 和transform  改变位移
   * @param time 时间
   * @param translate  距离
   */
  transformScroller=(time, translate)=> {
      this.setState({translate: translate});
      let scroller = document.getElementById("messages");
      var elStyle = scroller.style;
      elStyle.webkitTransition = elStyle.MozTransition = elStyle.transition = 'all ' + time + 's ease-in-out';
      elStyle.webkitTransform = elStyle.MozTransform = elStyle.transform = 'translate3d(0, ' + translate + 'px, 0)';
  }
  /**
   * 下拉刷新完毕
   */
  dragLoadingDone=()=> {
      this.setState({dragLoading: false});
      this.transformScroller(0.1, 0);
  }
  /**
   * 滚动加载完毕
   */
  scrollLoadingDone=()=> {
      this.setState({scrollerLoading: false});
      console.log("下拉加载");
    //  this.refs.dropDownRefreshText.innerHTML = (dropDownRefreshText = XLJZ);
  }
  componentWillReceiveProps=(nextProps)=> {
      var self = this;
      self.fetchItems(false);//把新的数据填进列表
      if (this.state.dragLoading) {//如果之前是下拉刷新状态，恢复
          setTimeout(function () {
              self.dragLoadingDone();
          }, 1000);
      }
      if (this.state.scrollerLoading) {//如果之前是滚动加载状态，恢复
          setTimeout(function () {
              self.scrollLoadingDone();
          }, 1000);
      }
  }
  FormD = ({ data, out }) => {
    return <Card style={{backgroundColor:'#f4f7f9'}}>
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
  }
  FormFile = ({ data, file }) => {
    let fileIcon=this.state.fileIcon;
    var fileExtension = file.substring(file.lastIndexOf('.') + 1);
    fileExtension=fileExtension.toUpperCase();
    if(fileExtension=='DOC' || fileExtension=='DOCX'){
      fileIcon="./../src/assets/icon/word.png";
    }else  if(fileExtension=='XLS' || fileExtension=='XLSX'){
      fileIcon="./../src/assets/icon/excel.png";
    }else  if(fileExtension=='PPT' || fileExtension=='PPTX'){
      fileIcon="./../src/assets/icon/ppt.png";
    }
    return <div  style={{backgroundColor:'#f4f7f9',maxWidth:'370px'}}>
            <List>
              <Item align="top" thumb={fileIcon} multipleLine>
                <a href={file} target="_black" style={{marginRight:'5px'}}>{data}</a>
                <Brief><a onClick={()=>this.domnFile(file)} href="javascript:void(0);" target="_black" style={{marginRight:'5px'}}>点击下载</a></Brief>
              </Item>
            </List>
          </div>
  }

  QuestionList = ({ data }) => {
    return <List renderHeader={() => '常见问题'} className="my-list">
        {data.map(item => (
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
  loadQuestion(){
    let listParam = {};
    listParam.pageNum  = 1;
    listParam.perPage  = 5;
    HttpService.post('/reportServer/questions/getQuestionsList', JSON.stringify(listParam))
    .then(res => {
      if (res.resultCode != "1000") {
        this.setState({questionList:res.list});
        renderCustomComponent(this.QuestionList, {data:res.list});
      }
    })
  }

  async onQuestionClick(question_id,question){
    // this.sendMessageByQuestion(question);
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
        addUserMessage(question);
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
          addResponseMessage(res.data[0].answer);
        }else{
          addResponseMessage("没有符合您问题的答案，请重新选择");
          renderCustomComponent(this.QuestionList, {data:this.state.questionList});
        }
      });
    }
  }
  handleModalDataChange(event) {
    this.setState({ test: event.target.value })
  }
   //发送消息
   async sendMessageByQuestion(newMessage){ 
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
      }else{
        addUserMessage(newMessage);
      }
    })
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
      let qryParam=[{in: {begindate: "", enddate: "", org_id: "", po_number: "", vendor_name: "电讯盈科"}}];
      // await HttpService.post('/reportServer/query/execqueryToExcel/2/87', JSON.stringify(qryParam))
      // .then(res=>{

      // })
      // //首先进行函数查询
      await HttpService.post('/reportServer/nlp/getResult/' + newMessage, null)
        .then(res => {
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
                  // console.log(res);
                  }
              })
              if(res.data.filetype=="json"){
                  return renderCustomComponent(this.FormD, {data: res.data.list, out: res.data.out }); 
              }else if(res.data.filetype=="file"){
                  return renderCustomComponent(this.FormFile, {data:res.data.fileName, file:res.data.filePath });//url+'report/'+res.data.filePath 
              }else if(res.data.filetype=="text"){
                  return addResponseMessage(res.data);
              }
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
      fetch('https://api.ownthink.com/bot?spoken=' + newMessage, {
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
               // console.log(res);
              }
            })
          //  renderCustomComponent(that.FormFile, {data: "改为文件名", file:"http://localhost:8080/report/upload/PRC02 利润表.xlsx" }); 

          return addResponseMessage(detail.data.info.text);
        } else {
        }
      })

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
        //console.log()
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
        <Widget
          handleNewUserMessage={newMessage=>this.sendMessage(newMessage)}
          senderPlaceHolder="输入想要做什么"
          profileAvatar={ai}
          titleAvatar={this.state.userIcon==''?my:this.state.userIcon}
          ShowCloseButton="false"
          title="智能机器人"
          subtitle=""
          badge="1"
          fullScreenMode={false}
        />
      </div>
    )
  }
}