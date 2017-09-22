import React from 'react';
import {
  Link,
} from 'react-router';
import {
  Slider,
  Panel,
  List,
  ListItem,
  button
} from 'amazeui-react';
import {
  Top,
  BottomBar,
  Icon,
} from '../components';
import {
  Api,
  Cache,
} from '../utils';

const Home = React.createClass({
  CACHE_KEY: "YF_HOME_CACHE",

  contextTypes: {
    router: React.PropTypes.object
  },

  getInitialState() {
    return Cache.get(this.CACHE_KEY) ? JSON.parse(Cache.get(this.CACHE_KEY)) : {
      Imgdata: [],
      Letters:[],
      RoomData:[],
      NewsPaper:[],
    };
  },

  componentDidMount() {
    //加载轮播
    if (this.state.Imgdata.length === 0) {
      Api.get('Index/Advertising', {}, data => {
        this.setState({
          Imgdata: data,
        }); 
      }); 
    }

    //加载广告语
    if (this.state.Letters.length === 0) {
      Api.get('Index/Letters', {}, data => {
        this.setState({
          Letters: data,
        }); 
      });
    }

    //加载推荐直播
    if (this.state.RoomData.length === 0) {
      Api.get('Index/RecommendedRoom', {}, data => {
        this.setState({
          RoomData: data,
        });
      });
    }

    //加载最新问答
    if (this.state.NewsPaper.length === 0) {
      Api.get('Index/NewestPaper', {}, data => { 
        this.setState({
          NewsPaper: data,
        }); 
      });  
    }
  },

  componentWillUnmount() {
    if (!Cache.get(this.CACHE_KEY)) {
      Cache.set(this.CACHE_KEY, JSON.stringify(this.state), 600);
    }
  },
 
  renderSlider() {  
    return (
      <div>
        <Slider theme="b1">
          {this.state.Imgdata.map(function(item, i) {
            return (
              <Slider.Item key={i}>
                <img src={item.Src} />
              </Slider.Item>
            );
          })}
        </Slider>
      </div>
    );
  },

  renderSub() { 
       return (
      <div className="am-text-sm am-text-truncate am-padding-sm" > {this.state.Letters.Title} </div>
    ); 
  },

  renderRecommend() { 
    let header = (
      <div className="am-padding-top-sm am-padding-bottom-sm am-padding-left-sm am-padding-right-sm">
        推荐直播
        <Link to="/room/list" className="am-fr am-link-muted"><Icon icon="more" size="sm" /></Link>
      </div>
    );
    return (
      <Panel header={header} className="am-margin-0 yf-panel-padding-0 yf-panel-border-0">
      <ul className="am-avg-sm-4 am-text-center am-text-xs am-padding-bottom-sm"> 
         {this.state.RoomData.map(function(item,i)
            { 
             return (
              <li className="am-padding-top-sm" key={i} >  
               <Link to={`/room/topic/${item.RoomId}`} className="am-link-muted">
                 <img className="am-circle" src={item.RoomPic} height="40" width="40"/>
                 <div className="am-padding-top-xs am-text-truncate"  >{item.TeacherName}</div>
                 </Link> 
              </li>
             );
            }
         )}

       </ul> 
      </Panel>
    );
  },

  renderAnswer() {   
    
    let header = (
      <div className="am-padding-top-sm am-padding-bottom-sm am-padding-left-sm am-padding-right-sm">
        最新问答
        <a className="am-fr am-link-muted"></a>
      </div>
    );
    return (
      <Panel header={header} className="am-margin-0 yf-panel-padding-0 yf-panel-border-0">
        <List static fill className="am-margin-0">
        {this.state.NewsPaper.map(function(item,i){
            return(
                  <ListItem key={i}>
                     <div>{item.Body}</div>
                     <div className="am-text-sm am-margin-bottom-xs am-padding-top-sm">{item.TeacherName} <Link to={`/room/topic/${item.RoomId}/paper`} className="am-fr am-btn am-btn-danger am-text-xs">我要提问</Link></div>
                 </ListItem>
              ); 
             } 
          )} 
        </List>
      </Panel>
    );
  }, 
  // <button type="button" className="am-fr am-btn am-btn-danger am-text-xs" >我要提问</button>
  render() {
    return (
      <div>
        <Top title="首页" />
        {this.renderSlider()}
        {this.renderSub()}
        {this.renderRecommend()}
        {this.renderAnswer()}
        <BottomBar />
      </div>
    );
  },
});

export default Home;
