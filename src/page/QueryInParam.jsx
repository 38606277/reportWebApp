import React from 'react';
import { List, Toast, WhiteSpace, WingBlank,Table,Pagination, Modal,Checkbox, SwipeAction, NavBar, Icon, InputItem, Button, Picker, DatePicker } from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import { Link } from 'react-router-dom';
import UserService from '../service/UserService.jsx';
import HttpService from '../util/HttpService.jsx';
import WxTabBar from '../components/TabBar';


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
      qry_id: this.props.match.params.qry_id,
      class_id:this.props.match.params.class_id,
      data: [],      inParam: {},
      displayInParam:{},      imgHeight: 176,
      driver: "aaaa",      paramClass:null,
      dictData:{},      dateInParam:{},
      visible:false,colorValue: [],paramValue:'',
      pageNumd: 1, perPaged: 5, searchDictionary: '', totald: 0,
      paramName: '', selectedRowKeys: [], dictionaryList: []
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
    HttpService.post('/reportServer/query/getQueryParam/' + this.state.qry_id, null)
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
    window.location.href = "#/QueryResult/"+this.state.class_id+"/"+this.state.qry_id+"/"+paramStr;

    // this.renderQueryResult=<QueryResult qry_id={this.state.qry_id} class_id={this.state.class_id} inParam={paramStr} callbackParent={this.onChildChanged}/>;
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
  
  onCheckChange(fieldName, value) {
    if(value.target.checked){
      value='1';
    }else{
      value='0';
    }
    const {inParam}=this.state;
    inParam[fieldName] = value;
    this.setState({inParam:inParam});
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
  //打开模式窗口
  openModelClick(e,name, dicId) {
    e.preventDefault();
      this.okdata = [];
      this.setState({
          visible: true,
          dictionaryList: [], paramValue: dicId, paramName: name,
          totald: 0, selectedRowKeys: []
      }, function () {
          this.loadModelData(dicId);
      });
  }
  //调用模式窗口内的数据查询
  loadModelData(dicId) {
      let page = {};
      page.pageNumd = this.state.pageNumd;
      page.perPaged = this.state.perPaged;
      page.searchDictionary = this.state.searchDictionary;
      this.setState({ loading: true });
      HttpService.post("reportServer/dict/getDictValueByID/"+dicId,JSON.stringify(page)).then(response => {
          this.setState({ loading: false, dictionaryList: response.data, totald: response.totald }, function () { });
      }).catch(error => {
          this.setState({ loading: false });
          Toast.fail(error);
      });
  }
  // 字典页数发生变化的时候
  onPageNumdChange(pageNumd) {
      this.setState({
          pageNumd: pageNumd
      }, () => {
          this.loadModelData(this.state.paramValue);
      });
  }
   //模式窗口点击确认
   handleOk = (e) => {
    let values = this.state.selectedRowKeys.join(",");
    let name = this.state.paramName;
    this.state.inParam[name] = values;
    // this.props.form.setFieldsValue({ [name]: values });
    this.setState({ visible: false, pageNumd: 1, });
}
//模式窗口点击取消
handleCancel = (e) => {
    this.okdata = [];
    this.setState({
        visible: false,
        selectedRowKeys: []
    });
}
//数据字典选中事件
onSelectChangeDic = (selectedRowKeys) => {
    this.okdata = selectedRowKeys;
    this.setState({ selectedRowKeys });
}
//设置上一窗口的数据进行显示，返回上一级
  goback(){
    window.location.href = "#/QueryList/"+this.state.class_id;
    //this.props.callbackParent();
  }
  
  onDictChange=(v,name)=>{
    //console.log(v,name);
    const {selectedRowKeys}=this.state;
    let newarr=[];
    let v1=0;
    for ( var i=0 ; i < selectedRowKeys.length ; i++ ) {
      if(name!=selectedRowKeys[i]){
        newarr.push(selectedRowKeys[i]);
      }else{
        v1=v1+1;
      }
    }
    if(v1==0){
      newarr.push(name);
    }
    this.setState({
      selectedRowKeys:newarr
    });
      
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
      }else if (item.render == 'InputButton') {
        return (<InputItem
          type="text"
          placeholder=""
          clear
          extra={<Button style={{background:'url(./../src/assets/more.png) center center /  21px 21px no-repeat',border:'0PX solid #ddd'}} 
          size="small" inline  onClick={(e) => this.openModelClick(e,item.in_id,item.dict_id)}></Button>}
          onChange={v => this.onValueChange(item.in_id, v)}
          value={this.state.inParam[item.in_id]}
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
      }else if (item.render == 'Checkbox') {
          return (
            <div>
              <div  style={{float:'left'}}><List.Item>{item.in_name}:</List.Item></div>
              <CheckboxItem key={1} onChange={(value) => this.onCheckChange(item.in_id,value)}></CheckboxItem>
            </div>
         )
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
    
    return (
      
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

          <List style={{ textAlign: 'center',marginBottom:"50px" }}>
            {html}
            <Item>
              <Button type="primary" onClick={() => this.execQuery()} >执行查询</Button><WhiteSpace />
              {/* <Button type="primary" size="large" inline onClick={this.onSubmit}>Submit</Button> */}
            </Item>
          </List>
          <WhiteSpace size="lg" />
          <WxTabBar {...this.props}/>
          {/* <WhiteSpace size="lg" />
          <WingBlank><Link to='/UserPayList'>缴费记录</Link></WingBlank> */}
          <WingBlank>
              <Modal popup={true} 
                title="字典查询" 
                visible={this.state.visible}
                maskClosable={false}
                closable={true}
                afterClose={this.handleOk} 
                onClose={this.handleOk}
                style={{paddingTop:'10px'}}
                >
                <List>
                    {this.state.dictionaryList.map(i => (
                      <CheckboxItem  key={i.value_code} onChange={() => this.onDictChange(i.value_code,i.value_name)}>
                        {i.value_name}
                      </CheckboxItem>
                    ))}
                  </List>
                  {/* <InputItem
                      style={{ width: 10, marginBottom: '10px' }}
                      placeholder="请输入..." enterButton="查询"
                      onSearch={value => this.onDictionarySearch(value)}
                  /> */}
                  <Pagination current={this.state.pageNumd}
                      total={this.state.totald/this.state.perPaged}
                      onChange={(pageNumd) => this.onPageNumdChange(pageNumd)} />
              </Modal>
              </WingBlank>
              
      </div>
    )
  }
}
