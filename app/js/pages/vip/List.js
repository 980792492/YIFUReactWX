import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import {
  Nav,
  NavItem,
  Container,
  Panel,
  Divider,
  AvgGrid,
} from 'amazeui-react';
import { Users } from '../../models';
import {
  Icon,
  BgColorMixin,
  BottomBar,
  Pagination,
} from '../../components';
import {
  Api,
} from '../../utils';

const VipStatusMap = {
  0: {
    name: '等待开播',
    color: 'yf-vip-bg-yellow',
  },
  11: {
    name: '正在直播',
    color: 'yf-bg-red',
  },
  21: {
    name: '服务结束',
    color: 'yf-vip-bg-gray',
  },
};

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

  getInitialState() {
    return {
      data: [],
      currentTab: this.props.location.state,
      page: 1,
      isEnd: true,
    };
  },

  componentDidMount() {
    this.loadData(this.props.location.state);
  },

  componentDidUpdate(nextProps, nextState) {
    if (nextProps.location.state !== this.state.currentTab) {
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
    } else if (this.props.params.teacher_id > 0) {
      params.teacher_id = this.props.params.teacher_id
    }
    
    Api.get('Vip/List', params, resp => {
      this.setState({
        data: resp,
        isEnd: resp.length < this.props.pageSize,
      });
    });
  },

  handlerTab(tab, e) {
    let location = this.props.location;
    location.state = tab;
    this.context.router.replace(location);
  },

  handlerClick(id, e) {
    this.context.router.push(`vip/detail/${id}`);
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
    }

    Api.get('Vip/List', params, resp => {
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
    let title;
    return this.state.data.map((item, key) => {
      title = (
        <h4 className="am-text-sm am-margin-bottom-0">
          <span className="am-margin-right-sm yf-text-white yf-bg-red" style={{display: "inline-block", borderRadius: "30px", padding: "5px 10px"}}>{item.TeacherName}</span>
          {item.Title}
        </h4>
      );
      if (this.props.location.state === 'my') {
        //我的vip
        return (
          <div key={key} className="am-padding-bottom-lg">
            <Panel className="am-margin-bottom-0 yf-panel-padding-0 am-padding-sm" style={{position: "relative"}} onClick={this.handlerClick.bind(this, item.Id)}>
              {title}
              <div className="am-text-sm am-margin-top-sm">服务期限: {moment(item.StartTime).format('MM.DD')}至{moment(item.EndTime).format('MM.DD')}</div>
            </Panel>
            <div className={`am-fr am-text-center am-text-xs am-padding-right-xs am-padding-left-xs yf-text-white ${VipStatusMap[item.Status].color}`}>{VipStatusMap[item.Status].name}</div>
          </div>
        );
      } else {
        //vip列表
        return (
          <Panel key={key} className="am-margin-bottom-sm yf-panel-padding-0 am-padding-sm" style={{position: "relative"}} onClick={this.handlerClick.bind(this, item.Id)}>
            {title}
            <div className="am-text-sm am-margin-top-xs am-margin-bottom-xs">说明: {item.Tintroduce}</div>
            <AvgGrid sm={3} className="am-text-center am-text-sm am-padding-top-sm am-padding-bottom-sm yf-bg-gray">
              <li>
                <div className="yf-text-gray am-text-xs">课程价格</div>
                <div className="am-text-danger">{item.Gold}<small>G币</small></div>
              </li>
              <li>
                <div className="yf-text-gray am-text-xs">服务期限</div>
                <div className="am-text-danger">{moment(item.StartTime).format('MM.DD')}至{moment(item.EndTime).format('MM.DD')}</div>
              </li>
              <li>
                <div className="yf-text-gray am-text-xs">剩余名额</div>
                <div className="am-text-danger">{item.LeftLimit < 0 ? "无限制" : item.LeftLimit}</div>
              </li>
            </AvgGrid>
            <Icon
              icon={item.PayStatus == 1 ? "qgz" : "yts"}
              className={item.PayStatus == 1 ? "am-text-danger" : "yf-text-gray"}
              hide={this.props.location.state === 'my'}
              style={{position: "absolute", fontSize: "5.3rem", top: "-1.7rem", right: "-0.3rem"}}
            />
          </Panel>
        );
      }
    });
  },
  
  render() {
    return (
      <div>
        <Nav tabs justify className="am-margin-0 yf-tabs am-text-sm">
          <NavItem active={this.props.location.state !== 'my'} linkComponent="a" onClick={this.handlerTab.bind(this, '')} >特训班列表</NavItem>
          <NavItem active={this.props.location.state === 'my'} linkComponent="a" onClick={this.handlerTab.bind(this, 'my')}>我的特训班</NavItem>
        </Nav>
        <Container className="am-padding-top-sm">
          {this.renderList()}
        </Container>
        <Pagination status={!this.state.isEnd} onClick={this.handlerNext}>点击加载更多</Pagination>
        <BottomBar />
      </div>
    );
  },
});

export default List;
