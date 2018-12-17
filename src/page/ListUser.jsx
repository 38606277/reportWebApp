import React from 'react';
import { List, WhiteSpace, WingBlank, Checkbox, SwipeAction,  NavBar, Icon } from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import { Link } from 'react-router-dom';


import UserService from '../service/UserService.jsx';

const userService = new UserService();


const Item = List.Item;
const CheckboxItem = Checkbox.CheckboxItem;
const AgreeItem = Checkbox.AgreeItem;
const Brief = Item.Brief;




export default class ListUser extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [{ name: '南湖大路', driver: '120号' }, 
      { name: '自由大路', driver: '338号' }, 
      { name: '同街12', driver: '340号' }],
      imgHeight: 176,
      driver: "aaaa"
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
  onPayClick() {
    window.location.href = "#/UserBill";
  }

  componentDidMount() {

    
  }


  render() {
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => window.location.href = "#/"}
          rightContent={[
            <Icon key="1" type="ellipsis" onClick={this.loadData} />
          ]}
        >
          水费
        </NavBar>
        <List renderHeader={() => '常用缴费'} >
          {/* <List.Item>
            <InputItem
              type="text"
              defaultValue=""
              placeholder="张三丰"
              clear
            >用户名称</InputItem>
            <Icon key="1" type="ellipsis" onClick={this.loadData} />

          </List.Item> */}
          <List.Item>
            <WingBlank style={{ textAlign: "center" }}><Link to='/AddUser'  > +添加常用缴费号码</Link></WingBlank>

          </List.Item>
        </List>
        <list renderHeader={() => 'aa缴费'}>
          {this.state.data.map(val => (
            <SwipeAction
              style={{ backgroundColor: 'gray' }}
              autoClose
              right={[
                {
                  text: '删除',
                  onPress: () => console.log('cancel'),
                  style: { backgroundColor: '#ddd', color: 'white' },
                },
                {
                  text: '取消',
                  onPress: () => console.log('delete'),
                  style: { backgroundColor: '#F4333C', color: 'white' },
                },
              ]}
              onOpen={() => console.log('global open')}
              onClose={() => console.log('global close')}
            >
              <Item
                arrow="horizontal"
                thumb={require("../assets/a.png")}
                multipleLine
                onClick={this.onPayClick}
                extra="240"
              >
                {val.name}<Brief>{val.driver}</Brief><Brief>{val.driver}</Brief>
              </Item>
            </SwipeAction>

          ))}
        </list>

        <WhiteSpace size="lg" />
        <WingBlank><Link to='/UserPayList'>缴费记录</Link></WingBlank>

      </div>
    )
  }
}
