import React from 'react';
import { List, Toast, WhiteSpace, WingBlank, Checkbox, ActivityIndicator,Action, NavBar, Icon, PullToRefresh,InputItem, Button, Picker, DatePicker } from 'antd-mobile';
// import 'antd-mobile/dist/antd-mobile.css';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom';
import './QueryResult.scss';
import UserService from '../service/UserService.jsx';
import HttpService from '../util/HttpService.jsx';
const userService = new UserService();
const Item = List.Item;
const Brief = Item.Brief;

export default class QueryResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      qry_id: this.props.match.params.qry_id,
      class_id:this.props.match.params.class_id,
      inStrParam: this.props.match.params.inParam,
      data: [],
      height: document.documentElement.clientHeight,
      inParam: {},
      imgHeight: 176,
      animating: true,
      isLoading:true,
      startIndex: 1, perPage: 10, searchResult: '', total: 0,
    }
  }
  loadData = () => {
    userService.getUserList()
      .then(json => {
        this.setState({ data: json })
      })
      .catch((error) => {
        alert(error)
      });
  };

  onClassClick(item) {
    window.location.href = "#/UserBill";
  }

  componentDidMount() {
    const hei = this.state.height - ReactDOM.findDOMNode(this.ptr).offsetTop;
    setTimeout(() => this.setState({
      height: hei,
    }), 0);
    let paramInIdValue = [];
    paramInIdValue = this.state.inStrParam.split("&");
    for (var j = 0; j < paramInIdValue.length; j++) {
      let indexkey = paramInIdValue[j].indexOf("=");
      let inkey = paramInIdValue[j].substring(0, indexkey);
      let invalue = paramInIdValue[j].substring(indexkey + 1, paramInIdValue[j].length);
      this.state.inParam[inkey] = invalue;
    }
    this.execQuery();
  }

  execQuery() {
    this.setState({animating:true});
    let page = {};
    page.startIndex = this.state.startIndex;
    page.perPage = this.state.perPage;
    HttpService.post('/reportServer/query/getQueryParam/' + this.state.qry_id, null)
    .then(res => {
      if (res.resultCode == "1000") {
        this.setState({ outParam: res.data.out,isLoading:true });
        let aParam = [{ "in": this.state.inParam }, page];
        HttpService.post('/reportServer/query/execQuery/'+this.state.class_id+'/' + this.state.qry_id, JSON.stringify(aParam))
          .then(res => {
            if (res.resultCode == "1000") {
              this.setState({ data: res.data.list });
              this.setState({animating:false,isLoading:false});
            }
            else
              Toast.fail(res.message, 1);
              this.setState({animating:false,isLoading:false});
          });
      }
      else
        Toast.fail(res.message, 1);
        this.setState({animating:false,isLoading:false});
    });
  }
  pageexecQuery() {
      this.setState({animating:true});
      let page = {};
      page.startIndex = this.state.startIndex;
      page.perPage = this.state.perPage;
      let aParam = [{ "in": this.state.inParam }, page];
      HttpService.post('/reportServer/query/execQuery/'+this.state.class_id+'/' + this.state.qry_id, JSON.stringify(aParam))
        .then(res => {
          if (res.resultCode == "1000") {
            var moment_list = this.state.data;
            for (var i = 0; i < res.data.list.length; i++) {
              moment_list.push(res.data.list[i]);
            }
            this.setState({ data: moment_list,animating:false,isLoading:false,refreshing: false,total:res.data.totalSize });
          }else
            Toast.fail(res.message, 1);
            this.setState({animating:false,isLoading:false,refreshing: false});
      });
  }
  onRefreshs(){
    if(this.state.data.length==this.state.total){
      let startIndex=this.state.startIndex;
      this.setState({ refreshing: true, startIndex:startIndex+1},function(){
        this.pageexecQuery();
      });
    }
  }
  //设置上一窗口的数据进行显示，返回上一级
  goback(){
    window.location.href = "#/QueryInParam/"+this.state.class_id+"/"+this.state.qry_id;
    //this.props.callbackParent();
  }
  render() {
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => this.goback()}
          rightContent={[
            <Icon key="1" type="ellipsis" onClick={this.loadData} />
          ]}
        >
          显示查询结果
        </NavBar>
        <ActivityIndicator toast text="正在加载"   animating={this.state.animating}/>
        <PullToRefresh
            damping={60}
            ref={el => this.ptr = el}
            style={{
              height: this.state.height,
              overflow: 'auto',
            }}
            indicator={this.state.down ? {} : { deactivate: '上拉可以刷新' }}
            direction={this.state.down ? 'down' : 'up'}
            refreshing={this.state.refreshing}
            onRefresh={()=>this.onRefreshs()}
        >
        <list
         renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
         {this.state.isLoading ? 'Loading...' : 'Loaded'}
       </div>)}
        >
          {this.state.data.map(val => (
            <Item
              arrow="down"
              thumb={require("../assets/a.png")}
              multipleLine
              onClick={() => this.onClassClick(val.class_id)}
            // extra={<div><Brief>{val.CREATION_DATE}</Brief><Brief>{'2016-1'}</Brief></div>}
            >
              {this.state.outParam.map((item) => {
                  return <div>
                    {}
                    <Brief>
                    <div class='flex-wrp-row itemnew'>
                      <div class='item-left flex-wrp-row'>
                        <div class='text'>{item.out_name}:</div>
                      </div>
                      <div class='item-right flex-wrp-row'>
                        <div class='text'>{val[item.out_id.toUpperCase()]}</div>
                      </div>
                    </div>
                    </Brief>
                  </div>
                }
              )}
            </Item>
          ))}
        </list>
        </PullToRefresh>
        {this.state.data.length==0?<div>{this.state.total==0?<div className='tips'>---暂无数据---</div>:''}</div>:''}
        {this.state.data.length==this.state.total?<div>{this.state.total>0?<div className='tips'>---没有数据了---</div>:''}</div>:''}
      </div >
    )
  }
}
