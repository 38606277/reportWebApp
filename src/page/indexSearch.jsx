import React from 'react';
import { List, InputItem, Tag, Icon, SearchBar, Toast, Button, Brief } from 'antd-mobile';
import HttpService from '../util/HttpService.jsx';
import LocalStorge from '../util/LogcalStorge.jsx';
const localStorge = new LocalStorge();
import './indexSearch.scss';

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let moneyKeyboardWrapProps;
if (isIPhone) {
    moneyKeyboardWrapProps = {
        onTouchStart: e => e.preventDefault(),
    };
}
const Item = List.Item;
class IndexSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // path: this.props.match.params.path,
            localStorgeSearchList: [],
            value: '',
            data: [],
            out: []
        }
    }
    componentDidMount() {
        this.autoFocusInst.focus();
        let searchList = localStorge.getStorage('searchList');
        if (undefined == searchList || searchList == '' || searchList == null) {
            searchList = []
        }
        this.setState({
            localStorgeSearchList: searchList
        });
    }
    clearLocalStorge() {
        localStorge.removeStorage('searchList');
        this.setState({
            localStorgeSearchList: []
        });
    }
    //设置上一窗口的数据进行显示，返回上一级
    goback() {
        window.location.href = "#/" + this.state.path;
        // this.props.callbackParent();
    }
    searchfouce() {
        const searchList = localStorge.getStorage('searchList');
        if (undefined != searchList && searchList != '' && searchList != null && searchList.length > 0) {
            this.setState({
                localStorgeSearchList: searchList
            });
        } else {
            this.setState({
                localStorgeSearchList: []
            });
        }
    }
    getQueryResult(value) {
        let searchList = localStorge.getStorage('searchList');
        if (undefined == searchList || searchList == '' || searchList == null) {
            searchList = [value];
        } else if (searchList.length == 10) {
            searchList.pop();
            searchList.unshift(value);
        } else {
            searchList.unshift(value);
        }
        localStorge.setStorage('searchList', searchList);
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
    onClickTag(value) {
        this.autoFocusInst.focus();
        this.setState({ value: value.item });
    }
    onClearSearch = () => {
        this.setState({ value: '' });
    }
    onChange = (value) => {
        this.setState({ value });
    };
    render() {
        return (
            <div>
                <List>
                    <div>
                        <Icon type="left" onClick={() => this.goback()} style={{
                            float: 'left', backgroundColor: '#efeff4',
                            height: '44px'
                        }} />
                        <SearchBar value={this.state.value} placeholder="请输入你想要查询的内容" onSubmit={(value) => this.getQueryResult(value)}
                            ref={ref => this.autoFocusInst = ref} onFocus={() => this.searchfouce()} onClear={() => this.onClearSearch()}
                            onChange={this.onChange}
                        /></div>
                </List>

                <div style={{ display: 'block' }}>
                    {this.state.localStorgeSearchList.length > 0 ?
                        <List>
                            <Item
                                extra={<Button style={{ background: 'url(./../src/assets/delete.png) center center /  21px 21px no-repeat', border: '0PX solid #ddd' }} size="small" inline onClick={() => this.clearLocalStorge()}></Button>}
                                multipleLine
                            >搜索历史</Item>
                            <div className="tag-container">
                                {this.state.localStorgeSearchList.map((item, index) => (
                                    <Tag color="magenta" onChange={() => this.onClickTag({ item })}>{item}</Tag>
                                ))}
                            </div>
                        </List> : ''}
                </div>
                <List renderHeader={() => '查询结果'}>

                    {this.state.data.map(val => (
                        <Item
                            thumb={require("../assets/a.png")}
                            multipleLine
                        >
                            {this.state.out.map((aItem) => {
                                return <div><Brief>{aItem.out_name}:{val[aItem.out_id.toUpperCase()]}</Brief></div>
                                    
                            }

                            )}
                        </Item>
                    ))}
                </List>

            </div>
        )
    }
}
export default IndexSearch;