import React from 'react';
import { List, WhiteSpace, WingBlank, Checkbox, SwipeAction, NavBar, Icon,Toast } from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import { Link } from 'react-router-dom';
import UserService from '../service/UserService.jsx';
import HttpService from '../util/HttpService.jsx';
const userService = new UserService();
const Item = List.Item;
const Brief = Item.Brief;

export default class QueryClassList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading:true
    }
  }
  onClassClick(item) {
      window.location.href = "#/QueryList/"+item;
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
    return (
      <div>

        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => window.location.href = "#/Home"}
          
        >
          选择一个查询类别
        </NavBar>

        <List style={{ textAlign: 'center'}}>
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
        </List>
      </div>
    )
  }
}
