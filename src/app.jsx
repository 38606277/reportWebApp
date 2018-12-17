
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';
import loading from './common/loading.jsx'
import './app.css'


const ListUser = Loadable({
    loader: () => import('./page/ListUser.jsx'),
    loading: loading,
    delay:3000
});

import Login from "./page/Login.jsx";


const UserPayList = Loadable({
    loader: () => import('./page/UserPayList.jsx'),
    loading: loading
});

const UserBill = Loadable({
    loader: () => import('./page/UserBill.jsx'),
    loading: loading
});

const QueryClassList = Loadable({
    loader: () => import('./page/QueryClassList.jsx'),
    loading: loading
});

const QueryList = Loadable({
    loader: () => import('./page/QueryList.jsx'),
    loading: loading
});

const QueryInParam = Loadable({
    loader: () => import('./page/QueryInParam.jsx'),
    loading: loading
});


const QueryResult = Loadable({
    loader: () => import('./page/QueryResult.jsx'),
    loading: loading
});

const Main = Loadable({
    loader: () => import('./page/Main.jsx'),
    loading: loading
});

const AI = Loadable({
    loader: () => import('./page/AI.jsx'),
    loading: loading
});
const Chat = Loadable({
    loader: () => import('./page/Chat.jsx'),
    loading: loading
});
// function loadPage(url){
//    return Loadable({
//     loader:()=>import(url),
//     loading:loading
//    })
// }


class App extends React.Component {

    // loadPage(url){
    //     return Loadable({
    //      loader:()=>import(url),
    //      loading:loading
    //     })
    //  }

    render() {

        return (
                <Router>
                    <Switch>
                        <Route exact path="/" component={Login} />
                        <Route path="/ListUser" component={ListUser} />
                        <Route path="/Main" component={Main} />
                        <Route path="/AI" component={AI} />
                        <Route path="/Chat" component={Chat} />
                        <Route path="/QueryClassList" component={QueryClassList} />
                        <Route path="/QueryList/:class_id" component={QueryList} />
                        <Route path="/QueryInParam/:qry_id" component={QueryInParam} />
                        <Route path="/QueryResult/:qry_id/:inParam" component={QueryResult} />
                        <Route path="/Login" component={Login} />
                        <Route path="/AddUser" component={Loadable({
                                                                    loader: () => import('./page/AddUser.jsx'),
                                                                    loading: loading
                                                                })} />
                        <Route path="/UserPayList" component={UserPayList} />
                        <Route path="/UserBill" component={UserBill} />
                        {/* <Route path="/app1" component={app1} /> */}

                        {/* <Route component={Error}/> */}
                    </Switch>
                </Router>
        )
    }
}


ReactDOM.render(
    <App />,
    document.getElementById('app')
);
