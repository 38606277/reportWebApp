import React from 'react';
import ReactDOM from 'react-dom';
import { List, ListView,WhiteSpace, WingBlank, Checkbox, SwipeAction,  NavBar, Icon } from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import './Chat.css';
function ticking(){
  const element = (new Date().toLocaleTimeString());
  ReactDOM.render(
    element,
    document.getElementById('root')
  );
}

//查看历史信息使用下列加载 开始
function MyBody(props) {
  return (
    <div className="am-list-body my-body">
      <span style={{ display: 'none' }}>you can custom body wrap element</span>
      {props.children}
    </div>
  );
}

const data = [
  {
    img: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
    title: 'Meet hotel',
    des: '不是所有的兼职汪都需要风吹日晒',
  },
  {
    img: 'https://zos.alipayobjects.com/rmsportal/XmwCzSeJiqpkuMB.png',
    title: 'McDonald\'s invites you',
    des: '不是所有的兼职汪都需要风吹日晒',
  },
  {
    img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png',
    title: 'Eat the week',
    des: '不是所有的兼职汪都需要风吹日晒',
  },
];
const NUM_SECTIONS = 5;
const NUM_ROWS_PER_SECTION = 5;
let pageIndex = 0;

const dataBlobs = {};
let sectionIDs = [];
let rowIDs = [];
function genData(pIndex = 0) {
  for (let i = 0; i < NUM_SECTIONS; i++) {
    const ii = (pIndex * NUM_SECTIONS) + i;
    const sectionName = `Section ${ii}`;
    sectionIDs.push(sectionName);
    dataBlobs[sectionName] = sectionName;
    rowIDs[ii] = [];

    for (let jj = 0; jj < NUM_ROWS_PER_SECTION; jj++) {
      const rowName = `S${ii}, R${jj}`;
      rowIDs[ii].push(rowName);
      dataBlobs[rowName] = rowName;
    }
  }
  sectionIDs = [...sectionIDs];
  rowIDs = [...rowIDs];
}
//查看历史信息使用下列加载 结束

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
    const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];

    const dataSource = new ListView.DataSource({
      getRowData,
      getSectionHeaderData: getSectionData,
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });

    this.state = {
      meg: '',
      respon: [],
      megArray: [],
      isWrite:true,
      saying:false,
      dataSource,
      isLoading: true,
      height: document.documentElement.clientHeight * 3 / 4,
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
    componentDidMount() {
      // you can scroll to the specified position
      // setTimeout(() => this.lv.scrollTo(0, 120), 800);
  
      const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
      // simulate initial Ajax
      setTimeout(() => {
        genData();
        this.setState({
          dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
          isLoading: false,
          height: hei,
        });
      }, 600);
    }
  
    // If you use redux, the data maybe at props, you need use `componentWillReceiveProps`
    // componentWillReceiveProps(nextProps) {
    //   if (nextProps.dataSource !== this.props.dataSource) {
    //     this.setState({
    //       dataSource: this.state.dataSource.cloneWithRows(nextProps.dataSource),
    //     });
    //   }
    // }
  
    onEndReached = (event) => {
      // load new data
      // hasMore: from backend data, indicates whether it is the last page, here is false
      if (this.state.isLoading && !this.state.hasMore) {
        return;
      }
      console.log('reach end', event);
      this.setState({ isLoading: true });
      setTimeout(() => {
        genData(++pageIndex);
        this.setState({
          dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
          isLoading: false,
        });
      }, 1000);
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
    const separator = (sectionID, rowID) => (
      <div
        key={`${sectionID}-${rowID}`}
        style={{
          backgroundColor: '#f5f5f9',
        }}
      />
    );
    let index = data.length - 1;
    const row = (rowData, sectionID, rowID) => {
      if (index < 0) {
        index = data.length - 1;
      }
      const obj = data[index--];
      return (
        <div key={rowID} style={{background:'#f5f5f9' }}>
                  <li><img src={require("../assets/奥巴马-02.jpg")} className="imgright"/><span style={{float:"right"}}>{obj.des} </span></li>
                  <li><img src={require("../assets/川普-01.jpg")} className="imgleft"/><span style={{float:"left"}}>35 ¥ {rowID} </span></li>
              </div>
        // <div key={rowID} style={{ padding: '0 15px' }}>
        //   <div style={{ display: '-webkit-box', display: 'flex', padding: '15px 0' }}>
        //     <img style={{ height: '64px', marginRight: '15px' }} src={obj.img} alt="" />
        //     <div style={{ lineHeight: 1 }}>
        //       <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>{obj.des}</div>
        //       <div><span style={{ fontSize: '30px', color: '#FF6E27' }}>35</span>¥ {rowID}</div>
        //     </div>
        //   </div>
        // </div>
      );
    };

    return (
      <div className="content">
       <div className="header">
            <span style={{float: "left"}}><a href="#Main"><img src={require("../assets/返回.svg")} style={{width:"20px",height:"20px",marginTop:'10px'}}/></a></span>
            <span style={{float: "right"}} id="root"></span>
        </div>
        <ul className="contentes" ref="msgList">
          <ListView
            ref={el => this.lv = el}
            dataSource={this.state.dataSource}
            // renderHeader={() => <span>header</span>}
            renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
              {this.state.isLoading ? 'Loading...' : 'Loaded'}
            </div>)}
            // renderSectionHeader={sectionData => (
            //   <div>{`Task ${sectionData.split(' ')[1]}`}</div>
            // )}
            renderBodyComponent={() => <MyBody />}
            renderRow={row}
            // renderSeparator={separator}
            style={{
              height: this.state.height,
              overflow: 'auto',
            }}
            pageSize={4}
            onScroll={() => { console.log('scroll'); }}
            scrollRenderAheadDistance={500}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={10}
          />
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