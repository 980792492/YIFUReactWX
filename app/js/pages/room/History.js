import React from 'react';
import moment from 'moment';
import $ from 'jquery';
import {
  IndexLink,
} from 'react-router';
import {
  Panel,
  Image,
  Grid,
  Col,
  Input,
  Form,
  List,
  ListItem,
  button,
} from 'amazeui-react';
import { Users } from '../../models';
import {
  Top,
  BottomBar,
  Pagination,
  Icon,
} from '../../components';
import {
  Api,
} from '../../utils';

const History = React.createClass({

  contextTypes: {
    router: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      pageSize : 20,
    };
  },

  getInitialState() {
    return {
      data: [],
      page: 1,
      isEnd: true,
      title: "",
    };
  },

  componentDidMount() {
    this.loadData();
  },

  loadData() {
    let params = {
      page: 1,
      num: this.props.pageSize,
      teacher_id: this.props.params.teacher_id,
    };
    
    Api.get("Room/History", params, resp => {
      if (resp.length > 0) {
        this.setState({
          title: resp[0].TeacherName,
          data: resp,
          isEnd: resp.length < this.props.pageSize,
        });
      } else {
        this.setState({
          isEnd: true, 
        });
      }
    });
  },

  handlerClick(id, event) {
    this.context.router.push(`/room/topic/${id}`);
  },

  handlerNext() {
    let params = {
      page: this.state.page + 1,
      num: this.props.pageSize,
      teacher_id: this.props.params.teacher_id,
    };

    Api.get("Room/History", params, resp => {
      if (resp.length > 0) {
        this.setState({
          page: params.page,
          data: this.state.data.concat(resp),
          isEnd: resp.length < this.props.pageSize,
        });
      } else {
        this.setState({
          isEnd: true, 
        });
      }
    });
  },

  renderHistoryList(){
     return this.state.data.map((item, key) => {
      if (item.Status == 13) {
        return (
          <ListItem key={key} className="am-margin-bottom-xs yf-panel-padding-0" key={key}>
            <div className="am-padding-0" onClick={this.handlerClick.bind(this, `t_${item.TopicId}`)}>
              <div style={{ height: '70px'}} className="yf-bg-white am-padding-sm">

                  <div className="am-text-md am-text-truncate am-fr">{moment(item.CreateDate).format('YY/MM/DD')}</div>
                  <div className="am-text-md am-link-muted am-text-truncate ">
                      <span className="yf-wqzb-circle am-fl yf-bg-gray" id={item.TopicId}></span>
                      主题：{item.TopicName}
                  </div>
                   <div className="am-text-sm am-text-truncate am-text-danger yf-wqzb-margin-left">
                     当日最高人气：{item.TotalOnLine}
                  </div>
              </div>
            </div>
          </ListItem>
        );
      } else{
        return (
           <ListItem key={key} className="yf-panel-padding-0 am-margin-bottom-0 am-link-muted">
                  <div style={{ height: '50px',lineHeight:'18px'}} className="yf-bg-white am-padding-sm" onClick={this.handlerClick.bind(this, item.RoomId)}>
                    <div className="am-text-md am-text-truncate am-fr am-text-danger" style={{lineHeight:'30px'}}>
                        正在直播
                        <Icon size="xs" icon="bf" className="am-fr am-text-danger" />
                    </div>
                    <div className="am-text-md am-link-muted am-text-truncate am-padding-top-xs am-padding-bottom-xs">今日主题:{item.TopicName}</div>
                  </div>
           </ListItem>
        );
      }
    });
  },  

  render() {
    return (
      <div>
        <Top title={this.state.title + "往期直播"} />
        <List className="am-margin-top-0" >
            {this.renderHistoryList()}
        </List>
        <Pagination status={!this.state.isEnd} onClick={this.handlerNext}>点击加载更多</Pagination>
      </div>
    );
  },
});

export default History;
