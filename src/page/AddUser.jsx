import React        from 'react';
import {  List, InputItem,Button,NavBar,Icon,Drawer,WhiteSpace,Checkbox,Picker } from 'antd-mobile';
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


export default class AddUser extends React.Component {
  constructor(){
    super();
  }
  onSubmit(){
    //alert("aa");
    //browserHistory.push('/list');
    window.location.href="#/";
  // withRouter('/list');
    //this.props.history.push("/list");
  }
   
  onReset(){
    this.props.form.resetFields();
  } 
  onOpenChange(){

  }
  
   


  render(){
    return(

      <div>
       <NavBar
      mode="light"
      icon={<Icon type="left" />}
      onLeftClick={() =>  window.location.href="#/"}
     
    >新增缴费账户</NavBar>
      {/* <Drawer
        className="my-drawer"
        style={{ minHeight: document.documentElement.clientHeight }}
        enableDragHandle
        contentStyle={{ color: '#A6A6A6', textAlign: 'center', paddingTop: 42 }}
       
      >
        Click upper-left corner
      </Drawer> */}

      <List renderFooter={() => '户号为7位数字'} >
        {/* <InputItem
           arrow="horizontal"
          type="text"
          defaultValue="长春市自来水公司"
          placeholder="长春市自来水公司"
          clear
        >缴费单位</InputItem> */}
        <Picker data={seasons} cols={1}  className="forss">
          <List.Item arrow="horizontal">缴费单位</List.Item>
        </Picker>
        
         <InputItem
          type="text"
          defaultValue=""
          placeholder=""
          clear
        >长水号</InputItem>
         
        
        <Item>
        <AgreeItem data-seed="logId" onChange={e => console.log('checkbox', e)}>
             <a onClick={(e) => { e.preventDefault(); alert('agree it'); }}>我已阅读并同意《中信银行缴费协议》</a>
          </AgreeItem>
        </Item>
       <Item>
       <Button type="primary" onClick={this.onSubmit}>下一步</Button><WhiteSpace />
         {/* <Button type="primary" size="large" inline onClick={this.onSubmit}>Submit</Button> */}
       </Item>
      </List>
      
      </div>
    )
  }
}

//export default AddUser;