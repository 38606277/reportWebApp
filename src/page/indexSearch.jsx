import React        from 'react';
import {List,InputItem,Tag,Icon,SearchBar,Toast} from 'antd-mobile';
import HttpService from '../util/HttpService.jsx';
// import './indexSearch.scss';
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let moneyKeyboardWrapProps;
if (isIPhone) {
  moneyKeyboardWrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}
const Item = List.Item;
class IndexSearch extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            path: this.props.match.params.path,
            searchKeyword   : ''
        }
    }
    // 数据变化的时候
    onValueChange(e){
        let name    = e.target.name,
            value   = e.target.value.trim();
        this.setState({
            [name] : value
        });
    }
    
    // 输入关键字后按回车，自动提交
    onSearchKeywordKeyUp(e){
        if(e.keyCode === 13){
            this.getQueryResult();
        }
    }
    //设置上一窗口的数据进行显示，返回上一级
    goback(){
        window.location.href = "#/"+this.state.path;
       // this.props.callbackParent();
    }
    getQueryResult(value) {
        let param = {};
        HttpService.post('reportServer/nlp/getResult/' + value, null)
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
    searchBarOnFocus() {
        this.setState({
            searchKeyword: 'search focus',
        });
        am-search-value
      }
    render(){
        return (
            <div>
                <List>
                <div>
                    <Icon type="left"  onClick={() => this.goback()} style={{float:'left',backgroundColor: '#efeff4',
                        height: '44px'}}/>
                    <SearchBar  placeholder="说出你要查询什么..." onSubmit={(value) => this.getQueryResult(value)}
                     onFocus={this.searchBarOnFocus.bind(this)}  ref={ref => this.autoFocusInst = ref} /></div>
                </List>
                
                <div style={{display:'block'}}>
                    <List>
                        <Item>搜索历史</Item>
                        <div className="tag-container">
                            <Tag color="magenta">查询亚信科技的采购订单</Tag>
                            <Tag>查询亚信的采购订单</Tag>
                            <Tag>查询来信的供应商信息</Tag>
                        </div>
                    </List>
                </div> 
            </div>
        )
    }
}
export default IndexSearch;