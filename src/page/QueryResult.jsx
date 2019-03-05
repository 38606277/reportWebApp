import React from 'react';
import { List, Toast, WhiteSpace, WingBlank, Checkbox, ActivityIndicator,Action, NavBar, Icon, InputItem, Button, Picker, DatePicker } from 'antd-mobile';
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

export default class QueryResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      qry_id: this.props.qry_id,
      inStrParam: this.props.inParam,
      data: [],
      inParam: {},
      imgHeight: 176,
      driver: "aaaa",
      animating: true,
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
    // alert(JSON.stringify(item));
  }

  componentDidMount() {

    // alert(this.state.inParam);
    let paramInIdValue = [];
    paramInIdValue = this.state.inStrParam.split("&");

    //load out_param
    // loadOutParam();


    for (var j = 0; j < paramInIdValue.length; j++) {
      let indexkey = paramInIdValue[j].indexOf("=");
      let inkey = paramInIdValue[j].substring(0, indexkey);
      let invalue = paramInIdValue[j].substring(indexkey + 1, paramInIdValue[j].length);
      // let nv={[inkey]:invalue};
      this.state.inParam[inkey] = invalue;
      // this.state.data.push(nv);
      // if(null!=invalue && ''!=invalue){
      //     this.props.form.setFieldsValue({[inkey]:invalue});
    }
    this.execQuery();
  }

  loadOutParam(){

   
  }
  execQuery() {
    this.setState({animating:true});
    HttpService.post('reportServer/query/getQueryParam/' + this.state.qry_id, null)
    .then(res => {
      if (res.resultCode == "1000") {
        this.setState({ outParam: res.data.out });let aParam = []
        aParam.push({ "in": this.state.inParam })
        HttpService.post('reportServer/query/execQuery/2/' + this.state.qry_id, JSON.stringify(aParam))
          .then(res => {
            if (res.resultCode == "1000") {
              this.setState({ data: res.data.list });
              this.setState({animating:false});
    
            }
            else
              Toast.fail(res.message, 1);
              this.setState({animating:false});
    
          });

      }
      else
        Toast.fail(res.message, 1);
        this.setState({animating:false});

    });

    
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
          显示查询结果
        </NavBar>
        <ActivityIndicator toast text="正在加载"   animating={this.state.animating}/>
        <list renderHeader={() => 'aa缴费'}>
          {this.state.data.map(val => (
            <Item
              arrow="down"
              thumb={require("../assets/a.png")}
              multipleLine
              onClick={() => this.onClassClick(val.class_id)}
            // extra={<div><Brief>{val.CREATION_DATE}</Brief><Brief>{'2016-1'}</Brief></div>}
            >
              {this.state.outParam.map((item) => {
                // if (item.out_id.toUpperCase() == val.out_id) {
                  return <div>
                    {}
                    <Brief>{item.out_name}:{val[item.out_id.toUpperCase()]}</Brief>
                  </div>
                // }
              }

              )}
            </Item>
          ))}
        </list>

        <WhiteSpace size="lg" />
        <WingBlank><Link to='/UserPayList'>缴费记录</Link></WingBlank>

      </div >
    )
  }
}
