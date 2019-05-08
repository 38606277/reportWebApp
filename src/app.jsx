
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
    loader: () => import('./page/ChatNew.jsx'),
    loading: loading
});

const IndexSearch = Loadable({
    loader: () => import('./page/indexSearch.jsx'),
    loading: loading,
    delay:3000
});
const My = Loadable({
    loader: () => import('./page/My.jsx'),
    loading: loading,
    delay:3000
});
const Home = Loadable({
    loader: () => import('./page/home.jsx'),
    loading: loading,
    delay:3000
});

const Layout = Loadable({
    loader: () => import('./page/Layout.jsx'),
    loading: loading,
    delay:3000
});
const UploadInfo = Loadable({
    loader: () => import('./page/UploadInfo.jsx'),
    loading: loading,
    delay:3000
});
const Demo = Loadable({
    loader: () => import('./page/ai/demo.jsx'),
    loading: loading,
    delay:3000
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
        let LayoutRouter = (
                <Layout>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/ListUser" component={ListUser} />
                        <Route path="/Main" component={Main} />
                        <Route path="/Home" component={Home} />
                        <Route path="/AI" component={AI} />
                        <Route path="/Chat" component={Chat} />
                        <Route path="/My" component={My} />
                        <Route path="/Query" component={QueryClassList} />
                        <Route path="/QueryList/:class_id" component={QueryList} />
                        <Route path="/QueryInParam/:class_id/:qry_id" component={QueryInParam} />
                        <Route path="/QueryResult/:class_id/:qry_id/:inParam" component={QueryResult} />
                        <Route path="/Login" component={Login} />
                        <Route path="/AddUser" component={Loadable({
                                                                    loader: () => import('./page/AddUser.jsx'),
                                                                    loading: loading
                                                                })} />
                        <Route path="/UserPayList" component={UserPayList} />
                        <Route path="/UserBill" component={UserBill} />
                        <Route path="/IndexSearch" component={IndexSearch} />
                        <Route path="/UploadInfo" component={UploadInfo} />
                        <Route path="/Demo" component={Demo} />
                    </Switch>
                </Layout>
            );
        return (
                <Router>
                    <Switch>
                        <Route path="/" render={props=>LayoutRouter} />
                    </Switch>
                </Router>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('app')
);
