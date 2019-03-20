import React from 'react';
import { List, Grid ,WhiteSpace, WingBlank, Checkbox, SwipeAction, NavBar, Icon,Toast } from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import { Link } from 'react-router-dom';
import UserService from '../service/UserService.jsx';
import HttpService from '../util/HttpService.jsx';
const userService = new UserService();
const Item = List.Item;
const Brief = Item.Brief;
const url=window.getServerUrl();

export default class QueryClassList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading:true
    }
  }
  onClassClick=(item)=> {
      window.location.href = "#/QueryList/"+item.class_id;
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
    const datas=[];
    if (null != this.state.data) {
      this.state.data.map((item, index) => {
          let urls='./../src/assets/icon/default.png';
          if(item.img_file!=null && item.img_file!=''){
            urls=url+"/report/"+item.img_file
          }
          datas.push({icon:urls,text:item.class_name,class_id:item.class_id})
      });
    }
    // const data = Array.from(new Array(9)).map((_val, i) => ({
    //   icon: 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png',
    //   text: `name${i}`,
    // }));

    return (
      <div>

        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => window.location.href = "#/Home"}
          
        >
          选择一个查询类别
        </NavBar>
        <Grid data={datas}  onClick={this.onClassClick} />
        {/* <List style={{ textAlign: 'center'}}>
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
        </List> */}
      </div>
    )
  }
}
