import React from 'react';
import { List, WhiteSpace, WingBlank, Checkbox, SwipeAction, NavBar, Icon,Toast } from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import { Link } from 'react-router-dom';
import QueryList from './QueryList.jsx';
import UserService from '../service/UserService.jsx';
import HttpService from '../util/HttpService.jsx';
const userService = new UserService();
const Item = List.Item;
const CheckboxItem = Checkbox.CheckboxItem;
const AgreeItem = Checkbox.AgreeItem;
const Brief = Item.Brief;

export default class QueryClassList extends React.Component {
  constructor(props) {
    super(props);
    const renderResult=null;
    this.state = {
      data: [],
      imgHeight: 176,
      driver: "aaaa",
      paramClass:null,
      isLoading:true
    }
  }


  loadData = () => {

    //var userService = new UserService();
    userService.getUserList()
      .then(json => {
        // console.log((JSON.stringify(json)));
        this.setState({ data: json })
      })
      .catch((error) => {
        alert(error)
      });



  };

  onReset() {
    this.props.form.resetFields();
  }
  onOpenChange() {

  }
  //设置当前页面加载的对象，如果是null，则加载首次数据与div
  onChildChanged=()=>{
    this.setState({
      paramClass: null
    });
  }
  onClassClick(item) {
    this.setState({paramClass:item});
     // window.location.href = "#/QueryList/"+item;
      this.renderResult=<QueryList class_id={item} callbackParent={this.onChildChanged}/>;
  }

  componentDidMount() {

    this.getAllQueryClass();
  }
  getAllQueryClass() {
    let param = {};
    HttpService.post('/reportServer/query/getAllQueryClass', null)
      .then(res => {
        if (res.resultCode == "1000"){
          this.setState({ data: res.data ,isLoading:false})
        }else{
          Toast.fail(res.message);
          this.setState({isLoading:false})
        }
      }).catch((error)=>{
        Toast.fail(error);
      });


  }


  render() {
      if(this.state.data.length>0 && this.state.paramClass==null){
        this.renderResult=(
          <div>
                <NavBar
                  mode="light"
                  // icon={<Icon type="left" />}
                  // onLeftClick={() => window.location.href = "#/Main"}
                  rightContent={[
                    <Icon key="1" type="ellipsis" onClick={this.loadData} />
                  ]}
                >
                  选择一个查询类别
                </NavBar>
    
                <list renderHeader={() => 'aa缴费'}
                      renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
                      {this.state.isLoading ? 'Loading...' : 'Loaded'}
                    </div>)}
                >
                  {this.state.data.map(val => (
                    <Item
                      arrow="horizontal"
                      thumb={require("../assets/a.png")}
                      multipleLine
                      onClick={()=>this.onClassClick(val.class_id)}
                      extra=""
                    >
                      {val.class_name}
                    </Item>
                  ))}
                </list>
    
                <WhiteSpace size="lg" />
                <WingBlank><Link to='/UserPayList'>缴费记录</Link></WingBlank>
    
              </div>);
               
      }
     
      
    return (
       <div>{this.renderResult}</div>
    )
  }
}
