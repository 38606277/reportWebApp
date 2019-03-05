import React from 'react';
import { List, WhiteSpace, WingBlank, Checkbox, SwipeAction, NavBar, Icon } from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import { Link } from 'react-router-dom';
import UserService from '../service/UserService.jsx';
import HttpService from '../util/HttpService.jsx';
import QueryInParam from './QueryInParam.jsx';
const userService = new UserService();
const Item = List.Item;
const CheckboxItem = Checkbox.CheckboxItem;
const AgreeItem = Checkbox.AgreeItem;
const Brief = Item.Brief;

export default class QueryList extends React.Component {
  constructor(props) {
    super(props);
    const renderResultParam=null;
    this.state = {
      class_id:this.props.class_id,
      data: [],
      imgHeight: 176,
      driver: "aaaa",
      paramClass:null
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
  onClassClick(qry_id) {
    //window.location.href = "#/QueryInParam/"+qry_id;
    this.setState({paramClass:qry_id});
    this.renderResultParam=<QueryInParam qry_id={qry_id}/>;
  }

  componentDidMount() {
    this.getAllQueryClass();
  }
  getAllQueryClass() {
    let param = {};
    HttpService.post('reportServer/query/getQueryByClassID/'+this.state.class_id, null)
      .then(res => {
        if (res.resultCode == "1000")
          this.setState({ data: res.data })
        else
          message.error(res.message);
      });
  }

  render() {
    if(this.state.data.length>0 && this.state.paramClass==null){
      this.renderResultParam=(
            <div>
            <NavBar
              mode="light"
              icon={<Icon type="left" />}
              onLeftClick={() => window.location.href = "#/QueryClassList"}
              rightContent={[
                <Icon key="1" type="ellipsis" onClick={this.loadData} />
              ]}
            >
              选择一个查询
            </NavBar>

            <list renderHeader={() => 'aa缴费'}>
              {this.state.data.map(val => (
                <Item
                  arrow="horizontal"
                  thumb={require("../assets/a.png")}
                  multipleLine
                  onClick={()=>this.onClassClick(val.qry_id)}
                  extra=""
                >
                  {val.qry_name}
                </Item>
              ))}
            </list>

            <WhiteSpace size="lg" />
            <WingBlank><Link to='/UserPayList'>缴费记录</Link></WingBlank>

          </div>);
    }
    return (
      <div>{this.renderResultParam}</div>
    )
  }
}
