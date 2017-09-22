import React from 'react';
import {
  Link,
} from 'react-router';
import {
  Panel,
  Image,
  Grid,
  Col,
} from 'amazeui-react';
import {
	Top,
	BottomBar,
  Icon,
} from '../../components';
import {
  Api,
  Cache,
} from '../../utils';

const Index = React.createClass({
  CACHE_KEY: "YF_ROOM_CACHE",

  contextTypes: {
    router: React.PropTypes.object
  },

  getInitialState() {
    return Cache.get(this.CACHE_KEY) ? JSON.parse(Cache.get(this.CACHE_KEY)) : {
      StarRoomData: [],
      EssenceIntroductionData:[],
      ExclusiveRoomdata:[],
      RoomHalldata:[],
    };
  },

  componentDidMount() {
    //加载今日之星
    if (this.state.StarRoomData.length === 0) {
      Api.get('RoomIndex/DayStarRoom', {}, data => {
        this.setState({
          StarRoomData: data,
        }); 
      }); 
    }

    //加载博文
    if (this.state.EssenceIntroductionData.length === 0) {
      Api.get('RoomIndex/EssenceIntroduction', {}, data => {
        this.setState({
          EssenceIntroductionData: data,
        }); 
      });
    }

    //加载独家直播
    if (this.state.ExclusiveRoomdata.length === 0) {
      Api.get('RoomIndex/ExclusiveRoom', {}, data => {
        this.setState({
          ExclusiveRoomdata: data,
        }); 
      });
    }

    //加载直播大厅
    if (this.state.RoomHalldata.length === 0) {
      Api.get('RoomIndex/RoomHall', {}, data => { 
        this.setState({
          RoomHalldata: data,
        }); 
      });
    }
  },

  componentWillUnmount() {
    if (!Cache.get(this.CACHE_KEY)) {
      Cache.set(this.CACHE_KEY, JSON.stringify(this.state), 600);
    }
  },

  handerClick(id, event) {
    this.context.router.push('/room/topic/' + id);
  },

  //今日之星
  renderStar() { 
     var header = (
      <div className="am-padding-top-xs am-padding-bottom-xs am-padding-left-sm am-padding-right-sm">
        今日之星 
      </div>
    );
    return (
     <Panel header={header} className="am-margin-0 yf-room-bg-ddd am-padding-0 yf-panel-padding-0 yf-panel-border-0">
        <div className="am-padding-bottom-sm">
                   {this.state.StarRoomData.map(function(item, i) {
            return (
              <Link to={`/room/topic/${item.RoomId}`} key={i}>
            <div className="am-padding-sm am-padding-bottom-0" >
            <img src={item.RoomPic} height="100" width="100" className="am-fl" />
            <div style={{ height: '100px', paddingLeft: '110px' }} className="yf-bg-white am-padding-sm">
              <div className="am-text-lg am-text-truncate">
                {item.TeacherName}
                <Icon size="sm" icon={item.Status == 11 ? "bf" : "zt"} className={item.Status == 11 ? "am-fr am-text-danger" : "am-fr yf-text-gray"} />
              </div>
              <div className="am-text-sm am-link-muted am-text-truncate am-padding-top-xs am-padding-bottom-xs">主题：{item.TopicName}</div>
              <div className="am-text-sm am-text-truncate am-text-danger">
                <Icon color="red" icon="tag" className="am-padding-right-xs" />
                  {item.RoomLable.split(',').map(function(item,k)
                    { 
                       return (
                     <span className="am-padding-right-xs" key={k}>{item}</span>
                     )
                    })
                  } 
              </div>
            </div>  
          </div>
          </Link>
            );
          })}
        </div>
       </Panel>
    );
  },

  //博文
  renderArticle() {
    return (
      <ul className="am-avg-sm-2 am-link-muted am-padding-left-xs am-padding-right-xs am-text-sm">
        {this.state.EssenceIntroductionData.map(function(item,i)
          { 
            if(i%2==0){
              return (
                  <li className="am-text-truncate am-padding-xs yf-bw-border-right yf-bw-border-bottom" key={i}><Link to={`/room/topic/${item.RoomId}`}>{item.Title}</Link>  </li>
                     )
                }else{
              return (
                  <li className="am-text-truncate am-padding-xs yf-bw-border-bottom" key={i}><Link to={`/room/topic/${item.RoomId}`}>{item.Title}</Link>  </li>
                     )
                } 
          })}  
      </ul>
    );
  },

  //独家直播
  renderOnly() {
    var header = (
      <div className="am-padding-top-xs am-padding-bottom-xs am-padding-left-sm am-padding-right-sm">
       独家直播
      </div>
    );

    return (
      <Panel header={header} className="am-margin-0 yf-room-bg-ddd am-padding-0 yf-panel-padding-0 yf-panel-border-0">
        <ul className="am-avg-sm-4 am-text-center am-text-xs am-padding-top-sm am-padding-bottom-sm">
        {this.state.ExclusiveRoomdata.map(function(item,i)
          {
             return (
             <li key={i}>
              <Link to={`/room/topic/${item.RoomId}`} className="am-link-muted">
                   <img className="am-circle" src={item.RoomPic} height="40" />
              <div className="am-padding-top-xs am-text-truncate"><Icon icon={item.Status==11?"bf":"zt"} className={item.Status == 11 ? "am-fr am-text-danger am-margin-right-sm" : "am-fr am-text-gray am-margin-right-sm"} />{item.TeacherName}</div>
               </Link> 
          </li>
          )
          })} 
       </ul>
      </Panel>
    );
  },










  //直播大厅
  renderList() {
    var header = (
      <div className="am-padding-top-xs am-padding-bottom-xs am-padding-left-sm am-padding-right-sm">
        直播大厅
        <Link to="/room/list" className="am-fr am-link-muted"><Icon icon="more" size="sm" /></Link>
      </div>
    );

    return (
      <Panel header={header} className="am-margin-0 yf-panel-padding-0 yf-panel-border-0">
        <ul className="am-avg-sm-4 am-text-center am-text-xs am-margin-top-sm am-margin-bottom-sm">
         
          {this.state.RoomHalldata.map(function(item,i)
            {
                return(
                   <li key={i}>
                     <Link to={`/room/topic/${item.RoomId}`} className="am-link-muted">
                           <img className="am-circle" src={item.RoomPic} height="40" width="40"/>
              <div className="am-padding-top-xs am-padding-bottom-xs am-text-truncate"><Icon icon={item.Status==11?"bf":"zt"} className={item.Status == 11 ? "am-fr am-text-danger am-margin-right-sm" : "am-fr am-text-gray am-margin-right-sm"} />{item.TeacherName}</div>
                     </Link>
              
                   </li>
                  )  
                   })}
 
       </ul>
      </Panel>
    );
  },
  
  render() {
    
    return (
      <div>
      	<Top title="股市直播" link="#/" />
        {this.renderStar()}
        {this.renderArticle()}
        {this.renderOnly()}
        {this.renderList()}
      	<BottomBar />
      </div>
    );
  },
});

export default Index;
