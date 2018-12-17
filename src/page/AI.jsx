import React from 'react';
import { List, Toast, WhiteSpace, WingBlank, SearchBar, Popover} from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import { Link } from 'react-router-dom';
import { Brief } from 'antd-mobile/lib/list/ListItem';
import HttpService from '../util/HttpService.jsx';

export default class AI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data:[],
    };
  }

  getQueryResult(value) {
    let param = {};
    HttpService.post('reportServer/nlp/getResult/'+value, null)
      .then(res => {
        if (res.resultCode == "1000")
          this.setState({ data: res.data.list })
        else
          message.error(res.message);

      });




  }

  render() {
    return (
      <div>
        <List>
          {/* <InputItem
            defaultValue={100}
            placeholder="start from left"
            clear
          >光标在左</InputItem> */}

          <WingBlank></WingBlank>
            <SearchBar placeholder="说出你要查询什么..."  onSubmit={(value) =>this.getQueryResult(value)} ref={ref => this.autoFocusInst = ref} />
          <WhiteSpace />

        </List>
        {/* <WhiteSpace size="lg" /> */}
        <List renderHeader={() => '查询结果'}>
        {this.state.data.map(val => (
            <List.Item
              arrow="horizontal"
              thumb={require("../assets/a.png")}
              multipleLine
              extra=""
            >
              {val.VENDOR_NAME}
            </List.Item>
          ))}
        </List>
      </div>
    );
  }
}
