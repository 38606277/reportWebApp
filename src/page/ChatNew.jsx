import React from 'react';
import ReactDOM from 'react-dom';
import { List, ListView,PullToRefresh,WhiteSpace, WingBlank, Checkbox, SwipeAction,  NavBar, Icon } from 'antd-mobile';
import { Link, Redirect } from 'react-router-dom';
import ai from './../assets/icon/ai.png';
import HttpService from '../util/HttpService.jsx';
import my from './../assets/icon/chart.png';
import down from './../assets/icon/down.png';
import LocalStorge from '../util/LogcalStorge.jsx';
const localStorge = new LocalStorge();
import 'antd-mobile/dist/antd-mobile.css';
import './Chat.css';
import "babel-polyfill";
const Item = List.Item;
const Brief = Item.Brief;
var XLJZ = '下拉加载';
var SKJZ = '松开加载';
var JZ = '加载中...'
var dropDownRefreshText = XLJZ;
var dragValve = 40; // 下拉加载阀值
var scrollValve = 40; // 滚动加载阀值
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
function genDatas(dataArr) {
  // const dataArr = [];
  for (let i = 10; i <20; i++) {
    dataArr.unshift(i);
  }
  return dataArr;
}
//查看历史信息使用下列加载 结束
const url=window.getServerUrl();

export default class ChatNew extends React.Component {
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
    this.page=1;
  }
  componentDidMount() {
    // const hei = this.state.height - ReactDOM.findDOMNode(this.lv).offsetTop;
    // setTimeout(() => {
    //   this.setState({
    //     height: hei,
    //    // data: genData(this.state.data),
    //     height: hei,
    //     refreshing: false
    //   });
    // }, 1500);
    let userInfo = localStorge.getStorage('userInfo');
    if (undefined != userInfo && null != userInfo && '' != userInfo) {
      this.setState({ userId:userInfo.id,
        userIcon:userInfo.icon==undefined?'':url+"/report/"+userInfo.icon,
        translate: 0,
        openDragLoading: this.openDragLoading || true,//根据外面设置的开关改变自己的状态
        openScrollLoading: this.openScrollLoading || true},function(){
          this.fetchItems(true);
          //this.loadQuestion();
        });
    }else{
      window.location.href="/My";
    }
}

onRefreshs = () => {
    this.setState({ refreshing: true });
    setTimeout(() => {
      this.setState({ refreshing: false,
       // data:, 
      });
      this.fetchItems(false);
    }, 600);
}
  fetchItems(isTrue) {
    let mInfo={'from_userId':this.state.userId,'to_userId':this.state.to_userId,
          pageNumd:this.page,perPaged:5}
    HttpService.post('/reportServer/chat/getChatByuserID', JSON.stringify(mInfo))
    .then(res => {
      let list=res.data;
      for(var i=0;i<list.length;i++){
          if(this.state.userId==list[i].from_userId){
            this.setState({data: [list[i],...this.state.data] });
           // addUserMessage(list[i].post_message);
          }else{
            if(list[i].message_type=='json'){
                let ress=JSON.parse(list[i].post_message);
                this.setState({
                  data:  [this.FormD(data:ress.data.list, out: ress.data.out),...this.state.data]
                }); 
            }else if(list[i].message_type=="file"){
                let ress=JSON.parse(list[i].post_message);
               // renderCustomComponent(this.FormFile, {data:  ress.data.fileName, file:ress.data.filePath }); 
            }else if(list[i].message_type=="text"){
               // addResponseMessage(list[i].post_message);
                this.setState({data: [list[i],...this.state.data] });

            }else{
               // addResponseMessage(list[i].post_message);
                this.setState({data: [list[i],...this.state.data] });
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
  handleData(e) {
    this.setState({
      meg: e.target.value
    })
  }
  //发送消息
  async sendMessage(){ 
    var ist=true; 
    //先保存发送信息
    var message = this.state.meg;
    this.setState({
              data: [...this.state.data, {from_userId: 1,'post_message':message,to_userId: 0}]
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
        var anchorElement = document.getElementById("scrolld");
        anchorElement.scrollIntoView();
      }
    })
    if(ist){
      let qryParam=[{in: {begindate: "", enddate: "", org_id: "", po_number: "", vendor_name: "电讯盈科"}}];
      await HttpService.post('/reportServer/query/execqueryToExcel/2/87', JSON.stringify(qryParam))
      .then(res=>{

      // })
      // //首先进行函数查询
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
                  // console.log(res);
                  }
              })
              // if(res.data.filetype=="json"){
              //     return renderCustomComponent(this.FormD, {data: res.data.list, out: res.data.out }); 
              // }else if(res.data.filetype=="file"){
              //     return renderCustomComponent(this.FormFile, {data:res.data.fileName, file:res.data.filePath });//url+'report/'+res.data.filePath 
              // }else if(res.data.filetype=="text"){
              //     return addResponseMessage(res.data);
              // }
              var anchorElement = document.getElementById("scrolld");
              anchorElement.scrollIntoView();
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
               // console.log(res);
              }
            })
          //  renderCustomComponent(that.FormFile, {data: "改为文件名", file:"http://localhost:8080/report/upload/PRC02 利润表.xlsx" }); 
         return that.setState({
                    data: [...that.state.data, {from_userId: 0,'post_message':detail.data.info.text,to_userId: 1}]
                  },function(){
                    var anchorElement = document.getElementById("scrolld");
                    anchorElement.scrollIntoView();
                  });
         
         // return addResponseMessage(detail.data.info.text);
        } else {
        }
      })
     
    }
  }
  // sendMessage() {
    
  //     var message = this.state.meg
  //     if (message === '') {
  //       alert('不能发送空白消息哦')
  //     } else {
  //       this.setState({
  //         data: [...this.state.data, {from_userId: 1,'post_message':message,to_userId: 0}]
  //       })
  //       var that = this
  //       var func = fetch('http://www.tuling123.com/openapi/api?key=f0d11b6cae4647b2bd810a6a3df2136f&info=' + message, {
  //         method: 'POST',
  //         type: 'cors'
  //       }).then(function(response) {
  //         return response.json();
  //         //return "hello";//response.json()
  //     }).then(function(detail) {
  //         if(detail.code===100000){
  //           return (that.setState({respon: [...that.state.respon, detail.text]}, () => {
  //             // var el = ReactDOM.findDOMNode(that.refs.msgList);
  //             // el.scrollTop=el.scrollHeight;
  //             let anchorElement = document.getElementById("scrolld");
  //             anchorElement.scrollIntoView();
  //           }))
  //         }else{
  //           return (that.setState({respon: [...that.state.respon, "不知道你说什么,好像服务器发生错误"]}, () => {
  //             // var el = ReactDOM.findDOMNode(that.refs.msgList);
  //             // el.scrollTop=el.scrollHeight;
  //             let anchorElement = document.getElementById("scrolld");
  //             anchorElement.scrollIntoView();
  //           }))
  //         }
  //       })
  //       this.state.meg = ''
  //     }
  //   }
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
      
       {/* <div className="header">
            <span style={{float: "left"}}><Link to={`/Main`}><img src={require("../assets/返回.svg")} style={{width:"20px",height:"20px",marginTop:'10px'}}/></Link></span>
            <span style={{float: "right"}} id="root"></span>
        </div> */}
        <div id="messages">
        <List >
            {this.state.data.map((elem,index) => {
              console.log(elem);
                if(elem.from_userId==1){
                  return <Item><div style={{background:'#f5f5f9' }} >
                        <li ><img src={require("../assets/奥巴马-02.jpg")} className="imgright"/><span style={{float:"right"}}>{elem.post_message} </span></li>
                    </div></Item>
                } else{
                  return <Item><div style={{background:'#f5f5f9' }}>
                      <li><img src={require("../assets/川普-01.jpg")} className="imgleft"/><span style={{float:"left",background:'#f1ebeb00'}}>{elem.post_message} </span></li>
                    </div></Item>
                }
            })}
        </List>
          </div>
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
            {this.state.data.map((elem,index) => {
              console.log(elem);
                if(elem.from_userId==1){
                  return <div style={{background:'#f5f5f9' }} >
                        <li ><img src={require("../assets/奥巴马-02.jpg")} className="imgright"/><span style={{float:"right"}}>{elem.post_message} </span></li>
                    </div>
                } else{
                  return <div style={{background:'#f5f5f9' }}>
                      <li><img src={require("../assets/川普-01.jpg")} className="imgleft"/><span style={{float:"left",background:'#f1ebeb00'}}>{elem.post_message} </span></li>
                    </div>
                }
            })}
          </PullToRefresh>
        </ul> */}
        
        {this.state.saying==true?<div className="saying"> <img src={require("../assets/saying.gif")}/></div>:''}
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
        <div id="scrolld" > </div>
      </div>
    )
  }
}