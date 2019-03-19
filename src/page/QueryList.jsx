import React from 'react';
import { List, WhiteSpace, WingBlank, Checkbox, SwipeAction, NavBar, Icon ,Toast} from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import { Link } from 'react-router-dom';
import UserService from '../service/UserService.jsx';
import HttpService from '../util/HttpService.jsx';

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
      class_id:this.props.match.params.class_id,
      data: [],
      imgHeight: 176,
    }
  }
  
  onClassClick(qry_id) {
    window.location.href = "#/QueryInParam/"+this.state.class_id+"/"+qry_id;
  }

  componentDidMount() {
    this.getAllQueryClass();
  }
  getAllQueryClass() {
    let param = {};
    HttpService.post('/reportServer/query/getQueryByClassID/'+this.state.class_id, null)
      .then(res => {
        if (res.resultCode == "1000")
          this.setState({ data: res.data })
        else
        Toast.fail(res.message);
      }).catch((error)=>{
        Toast.fail(error);
      });
  }
//设置上一窗口的数据进行显示，返回上一级
  goback(){
    window.location.href = "#/Query";
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
              选择一个查询
            </NavBar>

            <List style={{ textAlign: 'center'}}>
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
            </List>

      </div>
    )
  }
}
