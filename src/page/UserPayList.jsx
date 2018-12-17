import React from 'react';
import { List, Checkbox,NavBar,Icon} from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';

const Item = List.Item;
const CheckboxItem = Checkbox.CheckboxItem;
const AgreeItem = Checkbox.AgreeItem;
const Brief = Item.Brief;


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


 
export default  class UserPayList extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      initData: '',
      show: false,
    };
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
     
    >缴费记录</NavBar>
        <List  renderHeader={() => '7月缴费'}>
         
          <Item
            thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
            multipleLine
            onClick={() => { }}
            extra="240"
          >
            水费<Brief>85**199900|自由大路200号</Brief>
            <Brief>8-14 14:04</Brief>
          </Item>
          <Item
            thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
            multipleLine
            onClick={() => { }}
            extra={<a>hell</a>}
          >
            水费
            <Brief>85**199900|qqqq自由大路200号</Brief>
            <Brief>8-14 14:04</Brief>
            <Brief>hhhh</Brief><Brief><a href='www.baidu.com'>aaa</a></Brief>

          </Item>

        </List>
        <List  renderHeader={() => '本月缴费'}>
         
         <Item
           thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
           multipleLine
           onClick={() => { }}
           extra="240"
         >
           水费<Brief>85**199900|自由大路200号</Brief>
           <Brief>8-14 14:04</Brief>
         </Item>
         <Item
           thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
           multipleLine
           onClick={() => { }}
           extra="20"
         >
           水费<Brief>85**199900|qqqq自由大路200号</Brief>
           <Brief>8-14 14:04</Brief>
         </Item>
         
       </List>
      </div>
    )
  }
}
