import React from 'react';
import { List, Toast, WhiteSpace, WingBlank, Checkbox, SwipeAction, NavBar, Icon, InputItem, Button, Picker, DatePicker } from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import { Link } from 'react-router-dom';
import UserService from '../service/UserService.jsx';
import HttpService from '../util/HttpService.jsx';
import QueryResult from './QueryResult.jsx';

const userService = new UserService();
const Item = List.Item;
const CheckboxItem = Checkbox.CheckboxItem;
const AgreeItem = Checkbox.AgreeItem;
const Brief = Item.Brief;

export default class QueryInParam extends React.Component {
  constructor(props) {
    super(props);
    const renderQueryResult=null;
    this.state = {
      qry_id: this.props.qry_id,
      class_id:this.props.class_id,
      data: [],
      inParam: {},
      displayInParam:{},
      imgHeight: 176,
      driver: "aaaa",
      paramClass:null,
      dictData:{},
      dateInParam:{},
      colorValue: []
    }
  }
  onChangeColor=(color)=> {
    this.setState({
      colorValue: color
    });
  };

  onReset() {
    this.props.form.resetFields();
  }
 
  componentDidMount() {
    this.getQueryParam();
  }
  getQueryParam() {
    let param = {};
    HttpService.post('reportServer/query/getQueryParam/' + this.state.qry_id, null)
      .then(res => {
        if (res.resultCode == "1000") {
          let inColumns=res.data.in;
          for (var i = 0; i < inColumns.length; i++) {
            let idkey = inColumns[i].in_id;
            if ("Select" == inColumns[i].render) {
                this.getDiclist(inColumns[i].in_id, inColumns[i].dict_id, "Select");
                this.state.inParam[idkey] = '';
            } else if ("TagSelect" == inColumns[i].render) {
                this.getDiclist(inColumns[i].in_id, inColumns[i].dict_id, "TagSelect");
                this.state.inParam[idkey] = '';
            } else if ("Checkbox" == inColumns[i].render) {
                this.getDiclist(inColumns[i].in_id, inColumns[i].dict_id, "Checkbox");
                this.state.inParam[idkey] = '0';
              } else if ("Datepicker" == inColumns[i].render) {
                this.state.inParam[idkey] = '';
                this.state.dateInParam[idkey]=null;
            } else {
                this.state.inParam[idkey] = '';
            }
        }
          this.setState({ data: res.data.in });
          // //初始化参数对象
          this.state.data.map((item) => this.state.displayInParam[item.in_id]=[] );
        }
        else
        Toast.fail(res.message);
      }).catch((error)=>{
        Toast.fail(error);
      });
  }
  //根据条件列的dict_id进行查询数据字典
  getDiclist(in_id, dictId, type) {
    let page = {};
    page.pageNumd = 1;
    page.perPaged = 15;
    page.searchDictionary = '';
    HttpService.post("reportServer/dict/getDictValueByID/"+dictId,JSON.stringify(page)).then(response => {
        let optionlist1 = [];
        let rlist = response.data;
        if (undefined != rlist) {
            for (let i = 0; i < rlist.length; i++) {
                // if (type == "Select") {
                //  let json= {
                //     label:rlist[i].value_name,
                //     value: rlist[i].value_code
                //   };
                //   optionlist1.push(json);
                // } else if (type == "TagSelect") {
                //     optionlist1.push(<TagSelect.Option value={rlist[i].value_code} key={rlist[i].value_code}>{rlist[i].value_name}</TagSelect.Option>);
                // }
                let json= {
                  label:rlist[i].value_name,
                  value: rlist[i].value_code
                };
                optionlist1.push(json);
            }
            var objs = this.state.dictData;
            if (type == "TagSelect") {
                objs[dictId] = optionlist1;
            } else {
                objs[in_id + dictId] = optionlist1;
            }
            this.setState({ dictData: objs });
        }
    });
  }
    //设置当前页面加载的对象，如果是null，则加载首次数据与div
  onChildChanged=()=>{
    let clearparm={};
    for (let key of Object.keys(this.state.inParam)) {
      clearparm[key]=null;
    }
    this.setState({ paramClass: null, inParam:clearparm });
  }
  execQuery() {
    let paramStr = "";
    for (let key of Object.keys(this.state.inParam)) {
      paramStr = paramStr + "&" + key + '=' + this.state.inParam[key];
    }
    paramStr = paramStr.substring(1, paramStr.length);
    this.setState({paramClass:this.state.qry_id});
    this.renderQueryResult=<QueryResult qry_id={this.state.qry_id} class_id={this.state.class_id} inParam={paramStr} callbackParent={this.onChildChanged}/>;
  }
  onValueChange(fieldName, value) {
    const {inParam}=this.state;
    inParam[fieldName] = value;
    this.setState({inParam:inParam});
  }
  onSelectChange(fieldName, value) {
    this.state.displayInParam[fieldName]=value;
    if(value.length>0){
      value=value[0];
    }
    this.state.inParam[fieldName] = value;
  }
  onDateChange(fieldName, value) {
    if(null!=value && ''!=value){
      var d = new Date(value);  
      var m=(d.getMonth() + 1);
      if(m<10){
        m="0"+m;
      }
      var  resDate = d.getFullYear() + '-' + m + '-' + d.getDate();
      const {inParam,dateInParam}=this.state;
      inParam[fieldName] = resDate;
      dateInParam[fieldName]=value;
      this.setState({inParam:inParam,dateInParam:dateInParam});
    }
  }
//设置上一窗口的数据进行显示，返回上一级
  goback(){
    this.props.callbackParent();
  }
  render() {
    const html = this.state.data.map((item) => {
      if(item.render == 'Input') {
        return (<InputItem
          type="text"
          placeholder=""
          clear
          onChange={v => this.onValueChange(item.in_id, v)}
        >{item.in_name}:</InputItem>)
      }else if (item.render == 'Select') {
        return (<Picker
          data={this.state.dictData[item.in_id + item.dict_id]}
          title={"选择"+item.in_name}
          value={this.state.displayInParam[item.in_id]}
          cols={1}
          onOk={this.onChangeColor}
          onChange={v => this.onSelectChange(item.in_id,v)}
        >
          <List.Item arrow="horizontal">{item.in_name}</List.Item>
        </Picker>)
      }else if (item.render == 'TagSelect') {
        return (<Picker
          data={this.state.dictData[item.in_id + item.dict_id]}
          title={"选择"+item.in_name}
          value={this.state.displayInParam[item.in_id]}
          cols={1}
          onOk={this.onChangeColor}
          onChange={v => this.onSelectChange(item.in_id,v)}
        >
          <List.Item arrow="horizontal">{item.in_name}</List.Item>
        </Picker>)  
      }else if (item.render == 'Datepicker') {
        return (<DatePicker
          mode="date"
          title="Select Date"
          extra=""
          value={this.state.dateInParam[item.in_id]}
          onChange={v => this.onDateChange(item.in_id, v)}
        >
          <List.Item arrow="horizontal">{item.in_name}</List.Item>
        </DatePicker>)
      }else {
        return (<InputItem
          type="text"
          placeholder=""
          clear
          onChange={v => this.onValueChange(item.in_id, v)}
        >{item.in_name}:</InputItem>)
      }
    }
    );
    if(this.state.data.length>0 && this.state.paramClass==null){
      this.renderQueryResult=(
          <div>
              <NavBar
                mode="light"
                icon={<Icon type="left" />}
                onLeftClick={() => this.goback()}
                // rightContent={[
                //   <Icon key="1" type="ellipsis" onClick={this.loadData} />
                // ]}
              >
                输入查询条件
              </NavBar>

              <list>
                {html}
                <Item>
                  <Button type="primary" onClick={() => this.execQuery()} >执行查询</Button><WhiteSpace />
                  {/* <Button type="primary" size="large" inline onClick={this.onSubmit}>Submit</Button> */}
                </Item>
              </list>

              {/* <WhiteSpace size="lg" />
              <WingBlank><Link to='/UserPayList'>缴费记录</Link></WingBlank> */}

            </div>);
             
    }
    return (
      
      <div>{this.renderQueryResult}</div>
    )
  }
}
