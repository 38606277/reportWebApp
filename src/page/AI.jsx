import React from 'react';
import { List, Toast, WhiteSpace, WingBlank, SearchBar, Popover, Tag } from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import { Link } from 'react-router-dom';
import { Brief } from 'antd-mobile/lib/list/ListItem';
import HttpService from '../util/HttpService.jsx';

import './AI.css';

const Item = List.Item;


export default class AI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  getQueryResult(value) {
    let param = {};
    HttpService.post('/reportServer/nlp/getResult/' + value, null)
      .then(res => {
        if (res.resultCode == "1000") {
          console.log(res.data);
          this.setState({ data: res.data.list, out: res.data.out })
        } else {
          Toast.fail(res.message);
        }
      })
      .catch((error) => {
        Toast.fail(error);
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
          <SearchBar placeholder="说出你要查询什么..." onSubmit={(value) => this.getQueryResult(value)} ref={ref => this.autoFocusInst = ref} />
          <WhiteSpace />

        </List>
        <List>
          <Item>搜索历史</Item>
          <div className="tag-container">
            <Tag color="magenta">查询亚信科技的采购订单</Tag>
            <Tag>查询亚信的采购订单</Tag>
            <Tag>查询来信的供应商信息</Tag>
          </div>
         
        </List>


        {/* <WhiteSpace size="lg" /> */}
        <List renderHeader={() => '查询结果'}>
          {/* {this.state.data.map(val => (
            <List.Item
              arrow="horizontal"
              thumb={require("../assets/a.png")}
              multipleLine
              extra=""
            >
              {val.VENDOR_NAME}
            </List.Item>
          ))} */}
          <list renderHeader={() => 'aa缴费'}
            renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
              {this.state.isLoading ? 'Loading...' : 'Loaded'}
            </div>)}
          >
            {this.state.data.map(val => (
              <Item
                arrow="down"
                thumb={require("../assets/a.png")}
                multipleLine
                onClick={() => this.onClassClick(val.class_id)}
              // extra={<div><Brief>{val.CREATION_DATE}</Brief><Brief>{'2016-1'}</Brief></div>}
              >
                {this.state.out.map((item) => {
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
        </List>
      </div>
    );
  }
}
