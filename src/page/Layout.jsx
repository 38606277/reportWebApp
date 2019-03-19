import React from 'react';
import Loadable from 'react-loadable';
import loading from '../util/loading.jsx'
import LocalStorge from '../util/LogcalStorge.jsx';
import WxTabBar from '../components/TabBar';
const localStorge = new LocalStorge();

export default class MainLoyout extends React.Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        let userInfo=localStorge.getStorage('userInfo');
        if(undefined==userInfo || null==userInfo || ''==userInfo){
          window.location.href="#/My";
        }
    }
    componentWillReceiveProps(nextProps){
        let userInfo=localStorge.getStorage('userInfo');
        if(undefined==userInfo || null==userInfo || ''==userInfo){
          window.location.href="#/My";
        }
    }
    render() {
        return (
            <div >
                <div style={{paddingBottom:'50px'}}> {this.props.children}</div>
                <WxTabBar {...this.props}/>
            </div>
            
        );
    }
}

