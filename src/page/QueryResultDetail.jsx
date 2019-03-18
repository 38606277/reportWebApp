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

    this.getAllQueryClass();
  }
  getAllQueryClass() {
    let param = {};
    HttpService.post('/reportServer/query/getQueryParamByFuncID/' + this.state.qry_id, null)
      .then(res => {
        if (res.resultCode == "1000") {
          this.setState({ data: res.data.in });
          //初始化参数对象
          this.state.data.map((item) => this.state.inParam.push({ [item.in_id]: '' }))
        }
        else
          message.error(res.message);

      });


  }
  execQuery() {
    // alert(this.state.inParam);

    let aParam = []
    aParam.push({ "in": this.state.inParam })
    // window.location.href = "#/ExecQuery";
    HttpService.post('/reportServer/query/execQuery/2/' + this.state.qry_id, JSON.stringify(aParam))
      .then(res => {
        if (res.resultCode == "1000")
          this.setState({ data: res.data })
        else
          Toast.fail(res.message, 1);

      });

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
          this.state.data.map((item) => {
            <Item
              arrow="horizontal"
              thumb={require("../assets/a.png")}
              multipleLine
              onClick={this.onPayClick}
              extra="240"
            >
              {item['name']}
              <Brief>{item['a']}</Brief>
              <Brief>{item['b']}</Brief>
            </Item>
          }
          );
          <Item>
            <Button type="primary" onClick={() => this.execQuery()} >执行查询</Button><WhiteSpace />
          </Item>
        </list>

      <WhiteSpace size="lg" />
      <WingBlank><Link to='/UserPayList'>缴费记录</Link></WingBlank>

      </div >
    )
  }
}
