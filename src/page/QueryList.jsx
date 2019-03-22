import React from 'react';
import { List, Grid, WhiteSpace, WingBlank, Checkbox, SwipeAction, NavBar, Card, Button, Icon, Toast } from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import { Link } from 'react-router-dom';
import UserService from '../service/UserService.jsx';
import HttpService from '../util/HttpService.jsx';
import './QueryList.css';

const userService = new UserService();
const Item = List.Item;
const CheckboxItem = Checkbox.CheckboxItem;
const AgreeItem = Checkbox.AgreeItem;
const Brief = Item.Brief;
const url = window.getServerUrl();

export default class QueryList extends React.Component {
  constructor(props) {
    super(props);
    const renderResultParam = null;
    this.state = {
      class_id: this.props.match.params.class_id,
      data: [],
      imgHeight: 176,
    }
  }

  onClassClick = (item) => {
    window.location.href = "#/QueryInParam/" + this.state.class_id + "/" + item.qry_id;
  }

  componentDidMount() {
    this.getAllQueryClass();
  }
  getAllQueryClass() {
    let param = {};
    HttpService.post('/reportServer/query/getQueryByClassID/' + this.state.class_id, null)
      .then(res => {
        if (res.resultCode == "1000")
          this.setState({ data: res.data })
        else
          Toast.fail(res.message);
      }).catch((error) => {
        Toast.fail(error);
      });
  }
  //设置上一窗口的数据进行显示，返回上一级
  goback() {
    window.location.href = "#/Query";
    //this.props.callbackParent();
  }
  render() {
    const datas = [];
    if (null != this.state.data) {
      this.state.data.map((item, index) => {
        let urls = './../src/assets/icon/default.png';
        if (item.qry_file != null && item.qry_file != '') {
          urls = url + "/report/" + item.qry_file
        }
        datas.push({ icon: urls, text: item.qry_name, qry_id: item.qry_id })
      });
    }
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
          选择一个查询
            </NavBar>
        {/* <Grid data={datas}  onClick={this.onClassClick} /> */}
        {/* {this.state.data.map(val => (
            <div style={{ verticalAlign: 'middle',borderBottom:'solid gray 1px', display: 'flex',height:'60px',alignItems:'center',backgroundColor:'white',padding:'15px' }}>
              <img style={{height:'40px', width:'40px'}} src={url+"report/"+val.img_file} alt="" />
              <div style={{marginLeft:'10px'}} >
                  <div style={{fontSize:'16'}}>{val.qry_name}</div>
                  <div style={{marginTop:'10px', fontSize:'14',color:'gray'}}>{val.qry_desc}</div>
              </div>

            </div>
        ))} */}
     
        <List style={{ textAlign: 'center' }}>
          {this.state.data.map(val => (
            <Item
              arrow="horizontal"
            
          
              multipleLine
              onClick={() => this.onClassClick(val)}
              extra=""
            >
              <img style={{width:'30px',height:'30px',marginRight:'10px'}} src={val.qry_file!=null?(url+"report/"+val.qry_file):('../../src/assets/crm4_1.png')}/>
              {val.qry_name}
              <Brief>{val.qry_desc}</Brief>
            </Item>
          ))}
        </List>

      </div>
    )
  }
}
