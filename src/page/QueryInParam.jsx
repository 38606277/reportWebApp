import React from 'react';
import { List, Toast, WhiteSpace, WingBlank, Checkbox, SwipeAction, NavBar, Icon, InputItem, Button, Picker, DatePicker } from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import { Link } from 'react-router-dom';


import UserService from '../service/UserService.jsx';
import HttpService from '../util/HttpService.jsx';

const userService = new UserService();


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

export default class QueryInParam extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      qry_id: this.props.match.params.qry_id,
      data: [],
      inParam: {},
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
  onClassClick(item) {
    window.location.href = "#/UserBill";
    alert(JSON.stringify(item));
  }

  componentDidMount() {

    this.getQueryParam();
  }
  getQueryParam() {
    let param = {};
    HttpService.post('reportServer/query/getQueryParam/' + this.state.qry_id, null)
      .then(res => {
        if (res.resultCode == "1000") {
          this.setState({ data: res.data.in });
          //初始化参数对象
          this.state.data.map((item) => this.state.inParam[item.in_id]='' );
        }
        else
          message.error(res.message);

      });


  }
  execQuery() {
    let paramStr = "";
    for (let key of Object.keys(this.state.inParam)) {
      paramStr = paramStr + "&" + key + '=' + this.state.inParam[key];
    }
    paramStr = paramStr.substring(1, paramStr.length);
    window.location.href = "#/QueryResult/"+ this.state.qry_id+'/'+ paramStr;
  }
  onValueChange(fieldName, value) {
    // const { inParam } = this.state;
    // const newParam = inParam.map(item => ({ ...item }));
    // aParam={};
    this.state.inParam[fieldName] = value;
    //this.state.inParam.filter()
    // this.setState({ inParam[fieldName]: newParam });

    // let p={[field]:value};
    // this.inParam
    // this.setState({[field]:value});


    // let nv={[fieldName]:value};
    // let arrd=this.state.inParam;
    // arrd.forEach(function(item,index){
    //    for (var key in item) {
    //        if(fieldName==key){
    //            arrd.splice(index,1);     
    //        }
    //    }
    //  });
    // this.state.inParam.push(nv);

  }



  render() {
    const html = this.state.data.map((item) => {
      if (item.render == 'Input') {
        return (<InputItem
          type="text"
          placeholder=""
          clear
          onChange={v => this.onValueChange(item.in_id, v)}
        >{item.in_name}:</InputItem>)
      } else if (item.render == 'Select') {
        return (<Picker
          data={seasons}
          title="选择季节"
          cascade={false}
          extra="请选择(可选)"
          value={this.state.sValue}
          onChange={v => this.setState({ sValue: v })}
          onOk={v => this.setState({ sValue: v })}
        >
          <List.Item arrow="horizontal">{item.in_name}</List.Item>
        </Picker>)
      } else if (item.render == 'Datepicker') {
        return (<DatePicker
          mode="date"
          title="Select Date"
          extra=""
          value={this.state.date}
          onChange={v => this.onValueChange(item.name, v)}
        >
          <List.Item arrow="horizontal">{item.in_name}1</List.Item>
        </DatePicker>)
      }

      else {
        return (<InputItem
          type="text"
          placeholder=""
          clear
          onChange={v => this.onValueChange(item.in_id, v)}
        >{item.in_name}:1</InputItem>)
      }
    }
    );

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => window.location.href = "#/QueryClassList"}
          rightContent={[
            <Icon key="1" type="ellipsis" onClick={this.loadData} />
          ]}
        >
          输入查询条件
        </NavBar>

        <list renderHeader={() => 'aa缴费'}>
          {html}
          <Item>
            <Button type="primary" onClick={() => this.execQuery()} >执行查询</Button><WhiteSpace />
            {/* <Button type="primary" size="large" inline onClick={this.onSubmit}>Submit</Button> */}
          </Item>
        </list>

        <WhiteSpace size="lg" />
        <WingBlank><Link to='/UserPayList'>缴费记录</Link></WingBlank>

      </div>
    )
  }
}
