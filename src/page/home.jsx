import React from 'react';
import { List, WhiteSpace, WingBlank, SearchBar, Carousel,Checkbox, Button, NavBar, Icon, InputItem, Grid, Card } from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import User from '../service/user-service.jsx'
import LocalStorge from '../util/LogcalStorge.jsx';
import CommonSearch from './commonSearch.jsx';
import QueryClassList from './QueryClassList.jsx';

// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import './home.scss';
const _user = new User();
const localStorge = new LocalStorge();

const data1 = Array.from(new Array(3)).map(() => ({
  icon: (<Icon type='check' />),
  text: 'hello'
}));


const data = [{ text: '数据查询', icon: require('../assets/radio-o.png') },
{ text: '机器人小涵', icon: require('../assets/saying.gif') },
{ text: '自然语言查询', icon: require('../assets/java.png') },
{ text: '查询', icon: require('../assets/yy_btn.png') }]

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    const renderResult = null;
    this.state = {
      paramClass: null,
      selectedTab:this.props.selectedTab,
      data: ['1', '2', '3'],
      imgHeight: 176,
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        data: ['AiyWuByWklrrUDlFignR', 'TekJlZRVCjLFexlOCuWn', 'IJOtIlfsYdTyaDTRVrLI'],
      });
    }, 100);
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));
    // 绘制图表
    myChart.setOption({
      
      xAxis: {
        data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
      },
      yAxis: {},
      series: [{
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }]
    });
  }


  // 当用户点击查询文本框时显示真正的查询文本框
  onSearch() {
    window.location.href = "#/IndexSearch/Home";
  }
  
  toAI(){
    window.location.href = "#/Chat";
  }
  onClick = ((el, index) => {
    alert(el);
  })
  onChangeClick(e,index){
    if(index==0){
      window.location.href = "#/Query";
    }else if(index==1){
      window.location.href = "#/AI";
    }else if(index==2){
      window.location.href = "#/Chat";
    }else if(index==3){
      window.location.href = "#/My";
    }
  }
  //界面渲染
  render() {
    return (
      <div>
        <div className="headerBar">
         <CommonSearch onSearch={() => { this.onSearch() }}  toAI={()=>this.toAI()}/>
         </div>
        {/* <Grid data={data1} columnNum={3} itemStyle={{ height: '150px', background: 'rgba(0,0,0,.05)' }} /> */}
        {/* <div style={{marginTop:'20px'}}>
          <Grid data={data} columnNum={4} hasLine={false} activeStyle={true} square={true} 
          onClick={(e,index) => this.onChangeClick(e,index)} />
        </div> */}

        <Carousel style={{marginTop:'20px'}}
          autoplay={false}
          infinite
          beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
          afterChange={index => console.log('slide to', index)}
        >
            <a
              href="http://www.alipay.com"
              style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
            >
              <img
                src={require("../assets/banner.png")} 
                alt=""
                style={{ width: '100%', verticalAlign: 'top',height:'150px' }}
                onLoad={() => {
                  // fire window resize event to change height
                  window.dispatchEvent(new Event('resize'));
                  this.setState({ imgHeight: '20px' });
                }}
              />
            </a>
           

        </Carousel>
        <WhiteSpace size="lg" />
        <QueryClassList/>
        
        <Card full >
        <Card.Header style={{fontSize:'14px'}}
            title="收入情况"
           
            extra={<span><Icon type='right' /></span>}
          />
          <Card.Body>
            <div id="main" style={{ width: 300, height: 240 }}></div>
          </Card.Body>
        </Card>
      </div>
    )
  }
}
