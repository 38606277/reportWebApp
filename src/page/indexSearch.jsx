import React        from 'react';
import {List,InputItem,Tag,Icon,SearchBar,Toast} from 'antd-mobile';
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
class IndexSearch extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            path: this.props.match.params.path,
            localStorgeSearchList:[]
        }
    }
    componentDidMount() {
        this.autoFocusInst.focus();
        //localStorge.removeStorage('searchList');
        let  searchList=localStorge.getStorage('searchList');
        if( undefined ==searchList || searchList=='' || searchList==null){
            searchList=[]
        }
        this.setState({
            localStorgeSearchList:searchList
        });
    }
    
    //设置上一窗口的数据进行显示，返回上一级
    goback(){
        window.location.href = "#/"+this.state.path;
       // this.props.callbackParent();
    }
    searchfouce(){
        const  searchList=localStorge.getStorage('searchList');
        if( undefined !=searchList && searchList!='' && searchList!=null && searchList.length>0){
            this.setState({
                localStorgeSearchList:searchList
            });
        }
    }
    getQueryResult(value) {
       let  searchList=localStorge.getStorage('searchList');
       if( undefined ==searchList || searchList=='' || searchList==null){
            searchList=[value];
        }else if(searchList.length==10){
            searchList.pop();
            searchList.unshift(value);
        }else{
            searchList.unshift(value);
        }
        localStorge.setStorage('searchList', searchList);
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
    render(){
        return (
            <div>
                <List>
                <div>
                    <Icon type="left"  onClick={() => this.goback()} style={{float:'left',backgroundColor: '#efeff4',
                        height: '44px'}}/>
                    <SearchBar  placeholder="说出你要查询什么..." onSubmit={(value) => this.getQueryResult(value)}
                      ref={ref => this.autoFocusInst = ref} onFocus={() => this.searchfouce()}/></div>
                </List>
                
                <div style={{display:'block'}}>
                {this.state.localStorgeSearchList.length>0?
                    <List>
                        <Item>搜索历史</Item>
                        <div className="tag-container">
                            {this.state.localStorgeSearchList.map((item,index) =>(
                                <Tag color="magenta">{item}</Tag>
                            ))}
                        </div>
                    </List>:''}
                </div> 
            </div>
        )
    }
}
export default IndexSearch;