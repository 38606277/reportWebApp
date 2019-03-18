import React        from 'react';
import {Button} from 'antd-mobile';
import './commonSearch.scss';
class CommonSearch extends React.Component{
    constructor(props){
        super(props);
    }
    // 点击搜索按钮的时候
    onSearch(){
        this.props.onSearch();
    }
    toAI() {
        this.props.toAI();
       // window.location.href = "#/Chat";
    }
    render(){
        return (
            <div>
                <div style={{float:'left',height: '44px',width: '90%'}}>
                    <div className="am-search" >
                        <div className="am-search-input">
                            <div className="am-search-synthetic-ph" style={{width: '100%'}}>
                                <span className="am-search-synthetic-ph-container">
                                    <i className="am-search-synthetic-ph-icon"></i>
                                    <span className="am-search-synthetic-ph-placeholder" style={{visibility: 'visible'}}>输入你要查询的内容</span>
                                </span>
                            </div>
                            <input  type="search"  className="am-search-value" onFocus={(v) => this.onSearch()} placeholder="输入你要查询的内容" />
                            <a className="am-search-clear"></a>
                        </div>
                    </div>
                </div>
                <div style={{height: '44px',width: '10%',
                    background:'url(./../src/assets/icon/ai.png) center center /  21px 21px no-repeat',display:'inline-block'}}
                    onClick={() => this.toAI()}>
                </div>
            </div>
        )
    }
}
export default CommonSearch;