import React from 'react';
import Loadable from 'react-loadable';
import loading from '../util/loading.jsx'
//import './Layout.scss';
import WxTabBar from '../components/TabBar';

export default class MainLoyout extends React.Component {
    constructor(props) {
        super(props)
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

