import React from 'react';
import {
  Panel,
  Image,
  Grid,
  Col,
  Input,
  Form,
} from 'amazeui-react';
import { Users } from '../../models';
import {
  Top,
  BottomBar,
  Icon,
  BgColorMixin,
  Pagination,
} from '../../components';
import {
  Api,
} from '../../utils';

const List = React.createClass({
  mixins: [BgColorMixin],

  contextTypes: {
    router: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
      pageSize : 20,
    };
  },

  getInitialState: function() {
    return {
      data: [], 
      currentTab: this.props.location.state,
      keyword: null,
      page: 1,
      isEnd: true,
    };
  },

  componentDidMount: function() {
    this.loadData(this.props.location.state);
  },

  componentDidUpdate(nextProps, nextState) {
    if (nextState.keyword !== this.state.keyword) {
      this.loadData(this.props.location.state);
    } else if (nextProps.location.state !== this.state.currentTab) {
      this.loadData(nextProps.location.state);
    }
  },

  loadData(tab) {
    this.setState({
      currentTab: tab,
      data: [],
      page: 1,
      isEnd: true,
    });
    let params = {
      page: 1,
      num: this.props.pageSize,
    };
    if (this.props.location.state === 'my') {
      if (!Users.isLogin()) {
        return;
      }
      params.token = Users.getToken();
    } else if (this.state.keyword) {
      params.keyword = this.state.keyword;
    }
    Api.get('Room/List', params, resp => {
      this.setState({
        data: resp,
        isEnd: resp.length < this.props.pageSize,
      });
    });
  },

  handlerClick(id, event) {
    this.context.router.push(`/room/topic/${id}`);
  },

  handlerSearch(e) {
    e.preventDefault();
    let keyword = this.refs.keyword.getValue();
    if (keyword.length > 0) {
      this.setState({
        keyword: keyword
      });
    }
  },

  handlerNext() {
    let params = {
      page: this.state.page + 1,
      num: this.props.pageSize,
    };
    if (this.props.location.state === 'my') {
      if (!Users.isLogin()) {
        return;
      }
      params.token = Users.getToken();
    } else if (this.state.keyword) {
      params.keyword = this.state.keyword;
    }
    Api.get('Room/List', params, resp => {
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

  renderList() {
    return this.state.data.map((item, key) => {
      if (!item) return;
      return (
        <li key={key}>
          <Panel className="am-margin-bottom-sm yf-panel-padding-0">
            <div>
              <div className="am-padding-0" onClick={this.handlerClick.bind(this, item.RoomId)}>
                <img src={item.RoomPic} height="100" width="100" className="am-fl" />
                <div style={{ height: '100px', paddingLeft: '110px' }} className="yf-bg-white am-padding-sm">
                  <div className="am-text-lg am-text-truncate">
                    <Icon size="sm" icon={this.state.currentTab === 'my' ? "ysc" : (item.Status == 11 ? "bf" : "zt")} className={this.state.currentTab === 'my' || item.Status == 11 ?  "am-fr am-text-danger" : "am-fr yf-text-gray"} />
                    {item.TeacherName}
                  </div>
                  <div className="am-text-sm am-link-muted am-text-truncate am-padding-top-xs am-padding-bottom-xs">主题：{item.TopicName}</div>
                  <div className="am-text-sm am-text-truncate am-text-danger">
                    <Icon color="red" icon="tag" className="am-padding-right-xs" />
                    {
                      item.Tags.split(',').map((val, key) => {
                        return (
                          <span key={key} className="am-padding-right-xs">{val}</span>
                        );
                      })
                    }
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        </li>
      );
    });
  },
  
  render() {
    let search = this.props.location.state !== 'my' ? <Form onSubmit={this.handlerSearch}><Input type="search" placeholder="搜索老师" ref="keyword" amSize="lg" standalone defaultValue={this.state.keyword} /></Form> : '';
    return (
      <div>
        <Top title="所有直播" />
        {search}
        <ul className="am-padding-sm am-margin-0">
          {this.renderList()}
        </ul>
        <Pagination status={!this.state.isEnd} onClick={this.handlerNext}>点击加载更多</Pagination>
      </div>
    );
  },
});

export default List;
