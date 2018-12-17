import React from 'react';
import { List, InputItem, Button, Radio, NavBar, Icon, Drawer, WhiteSpace, Checkbox, Picker } from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';

const Item = List.Item;
const CheckboxItem = Checkbox.CheckboxItem;
const AgreeItem = Checkbox.AgreeItem;

const seasons = [
  [
    {
      label: '2013',
      value: '2013',
    },
    {
      label: '2014',
      value: '2014',
    },
  ],
  [
    {
      label: '春',
      value: '春',
    },
    {
      label: '夏',
      value: '夏',
    },
  ],
];


export default class UserBill extends React.Component {
  constructor() {
    super();
  }
  onSubmit() {

  }

  onReset() {
    this.props.form.resetFields();
  }
  onOpenChange() {

  }




  render() {
    return (
      <div>
          <NavBar
      mode="light"
      icon={<Icon type="left" />}
      onLeftClick={() =>  window.location.href="#/"}
     
    >缴费</NavBar>
        {/* <Drawer
          className="my-drawer"
          style={{ minHeight: document.documentElement.clientHeight }}
          enableDragHandle
          contentStyle={{ color: '#A6A6A6', textAlign: 'center', paddingTop: 42 }}

        >
          Click upper-left corner
      </Drawer> */}

        <List renderFooter={() => '户号为7位数字'} >


           <InputItem
            type="text"
            placeholder="CHX1234567"
            clear
          >编号</InputItem>
          <InputItem
            type="text"
            defaultValue=""
            placeholder="张三丰"
            clear
          >用户名称</InputItem>
          <InputItem
            type="text"
            defaultValue=""
            placeholder="解放大路120号"
            clear
          >地址</InputItem>
          <InputItem
            type="text"
            defaultValue=""
            placeholder="22吨"
            clear
          >本月数量</InputItem>
          <InputItem
            type="text"
            defaultValue=""
            placeholder="230"
            clear
          >应缴金额</InputItem>


          <Item>
            <Button type="primary"  > 确定</Button><WhiteSpace />
            {/* <Button type="primary" size="large" inline onClick={this.onSubmit}>Submit</Button> */}
          </Item>
        </List>

      </div>
    )
  }
}
