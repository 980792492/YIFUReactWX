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
  Top,
} from '../../components';
import {
  Api,
} from '../../utils';

const CjgType = {
  1 : 'single',
  2 : 'week',
  3 : 'month',
  4 : 'jq',
}

const List = React.createClass({
  mixins: [BgColorMixin],

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

    let api = "Cjg/List";
    if (this.props.location.state === 'my') {
      if (!Users.isLogin()) {
        return;
      }
      params.token = Users.getToken();
      api = "Cjg/MyList";
    } else if (this.props.params.teacher_id > 0) {
      params.teacher_id = this.props.params.teacher_id
    }
    
    Api.get(api, params, resp => {
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
    this.context.router.push(`cjg/detail/${id}`);
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
    Api.get('Cjg/List', params, resp => {
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
      return (
        <Panel key={key} className="am-margin-bottom-sm yf-panel-padding-0 am-padding-sm" style={{position: "relative"}} onClick={this.handlerClick.bind(this, item.Id)}>
          <h4 className="am-text-sm am-margin-bottom-0 am-text-sm"  style={{lineHeight: "3.5rem", fontSize: "1.6rem"}}>
            <Icon icon={CjgType[item.CjgType]} className={`am-margin-left-xs am-text-xxl am-fl yf-icon-bg-${CjgType[item.CjgType]}`} />
            <div className="am-fl am-text-truncate yf-cjg-width">
              <span className="am-text-danger">{item.UserName}</span>
              {moment(item.CreateDate).format('MM月DD日')}
              {item.Title}
            </div>
          </h4>
          <Divider theme="dotted" className="yf-divider-xs" />
          <AvgGrid sm={3} className="am-text-center am-text-sm">
            <li>
              <div className="yf-text-gray am-text-xs">结束订阅时间</div>
              <div className="am-text-danger ">{moment(item.EndTime).format('MM/DD HH:59')}</div>
            </li>
 
            <li>
              <div className="yf-text-gray am-text-xs">停止服务时间</div>
              <div className="am-text-danger ">{item.StopDate ? moment(item.StopDate).format('MM/DD 23:59') : '无'}</div>
            </li>
            <li>
              <div className="yf-text-gray am-text-xs">价格</div>
              <div className="am-text-danger">{item.PreferentialPrice > 0 ? item.PreferentialPrice : item.Price}<small>G币</small></div>
            </li>
          </AvgGrid>
          <Icon
            icon={item.Status == 1 ? "qgz" : "yxj"}
            className={item.Status == 1 ? "am-text-danger" : "yf-text-gray"}
            hide={this.props.location.state === 'my'}
            style={{position: "absolute", fontSize: "5.3rem", top: "-1.7rem", right: "-0.3rem"}}
          />
        </Panel>
      );
    });
  },

  renderMyList() {
    return this.state.data.map((item, key) => {
      return (
        <Panel key={key} className="am-margin-bottom-sm yf-panel-padding-0 am-padding-sm" style={{position: "relative"}} onClick={this.handlerClick.bind(this, item.Id)}>
          <h4 className="am-text-sm am-margin-bottom-0 am-text-sm "  style={{lineHeight: "3.5rem", fontSize: "1.6rem"}} >
            <Icon icon={CjgType[item.CjgType]} className={`am-margin-left-xs am-text-xxl am-fl yf-icon-bg-${CjgType[item.CjgType]}`} />
            <div className="am-fl am-text-truncate yf-cjg-width">
              <span className="am-text-danger">{item.UserName}</span>
              {moment(item.CreateDate).format('MM月DD日')}
              {item.Title}

            </div>
          </h4>
          <Divider theme="dotted" className="yf-divider-xs" />
          <AvgGrid sm={3} className="am-text-center am-text-sm">
            <li>
              <div className="yf-text-gray am-text-xs">老师</div>
              <div className="am-text-danger ">{item.UserName}</div>
            </li>
            <li>
              <div className="yf-text-gray am-text-xs">停止服务时间</div>
              <div className="am-text-danger ">{item.StopDate ? moment(item.StopDate).format('MM/DD 23:59') : '无'}</div>
            </li>
            <li>
              <div className="yf-text-gray am-text-xs">购买时间</div>
              <div className="am-text-danger">{moment(item.CreateDate).format('MM/DD HH:mm')}</div>
            </li>
          </AvgGrid>
          <Icon
            icon={item.Status == 1 ? "qgz" : "yxj"}
            className={item.Status == 1 ? "am-text-danger" : "yf-text-gray"}
            hide={this.props.location.state === 'my'}
            style={{position: "absolute", fontSize: "5.3rem", top: "-1.7rem", right: "-0.3rem"}}
          />
        </Panel>
      );
    });
  },
  
  render() {
    return (
      <div>
        <Top title="藏金阁" />
        <Nav tabs justify className="am-margin-0 yf-tabs am-text-sm">
          <NavItem active={this.props.location.state !== 'my'} linkComponent="a" onClick={this.handlerTab.bind(this, '')}>藏金阁列表</NavItem>
          <NavItem active={this.props.location.state === 'my'} linkComponent="a" onClick={this.handlerTab.bind(this, 'my')}>我的藏金阁</NavItem>
        </Nav>
        <Container className="am-padding-top-sm">
          {this.props.location.state === 'my' ? this.renderMyList() : this.renderList()}
        </Container>
        <Pagination onClick={this.handlerNext} status={!this.state.isEnd}>点击加载更多</Pagination>
        <BottomBar />
      </div>
    );
  },
});

export default List;
