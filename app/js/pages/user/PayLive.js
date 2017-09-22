import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import {
  Nav,
  NavItem,
  Container,
  Panel,
  Divider,
  Badge,
} from 'amazeui-react';
import { Users } from '../../models';
import {
  AuthMixin,
  BgColorMixin,
  BottomBar,
  Pagination,
  Top,
} from '../../components';
import {
  Api,
} from '../../utils';

const PayLive = React.createClass({
  mixins: [AuthMixin, BgColorMixin],

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
      type : 1,
      page: 1,
      num: this.props.pageSize,
      token: this.token,
    };

    let api = "EncryptedView/List";
    if (this.props.location.state === 'm') {
      params.type = 2;
    } 
    
    Api.get(api, params, resp => {
      // console.log(resp);
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

  handlerClick(id, type, e) {
    this.context.router.push({pathname: `user/pay-live-detail/${id}`, state: { t : type}});
  },

  handlerNext() {
    let params = {
      page: this.state.page + 1,
      num: this.props.pageSize,
      type : 1,
      token: this.token,
    };
    if (this.props.location.state === 'm') {
      params.type = 2;
    }

    let api = "EncryptedView/List";
    Api.get(api, params, resp => {
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
        <Panel key={key} className="am-margin-bottom-sm yf-panel-padding-0 am-padding-sm" style={{position: "relative"}} onClick={this.handlerClick.bind(this, item.Id, item.ViewOrderType)}>
          <h4 className="am-margin-bottom-0">
            <div className="am-text-truncate">
              {item.TeacherName}
              {moment(item.StartDate).format('MM/DD HH:mm:ss')}
              加密观点
            </div>
          </h4>
          <Divider />
          <div className="yf-text-gray am-text-xs">
            <span className="am-fr">{item.ActualPayGolds}G币</span>订阅时间：{moment(item.CreateDate).format('MM/DD HH:mm:ss')}
          </div>
        </Panel>
      );
    });
  },

  renderMonthList() {
    return this.state.data.map((item, key) => {

      return (
        <Panel key={key} className="am-margin-bottom-sm yf-panel-padding-0 am-padding-sm" style={{position: "relative"}} onClick={this.handlerClick.bind(this, item.Id, item.ViewOrderType)}>
          <h4 className="am-margin-bottom-0" >
            <div className="am-text-truncate">
              <Badge className="am-fr" amStyle={moment().isBefore(item.EndDate) ? "danger" : "default"} round>{moment().isBefore(item.EndDate) ? "服务中" : "已到期"}</Badge>
              <span>{item.TeacherName}包月观点包</span>
            </div>
          </h4>
          <Divider />
          <div className="yf-text-gray am-text-xs">
            <span className="am-fr">{item.ActualPayGolds}币</span>
            服务期限：{moment(item.StartDate).format('MM/DD 00:00')}至{moment(item.EndDate).format('MM/DD 00:00')}
          </div>
        </Panel>
      );
    });
  },
  
  render() {
    return (
      <div>
        <Top title="我的付费观点" />
        <Nav tabs justify className="am-margin-0 yf-tabs am-text-sm">
          <NavItem active={this.props.location.state !== 'm'} linkComponent="a" onClick={this.handlerTab.bind(this, '')}>单条加密观点</NavItem>
          <NavItem active={this.props.location.state === 'm'} linkComponent="a" onClick={this.handlerTab.bind(this, 'm')}>包月观点包</NavItem>
        </Nav>
        <Container className="am-padding-top-sm">
          {this.props.location.state === 'm' ? this.renderMonthList() : this.renderList()}
        </Container>
        <Pagination onClick={this.handlerNext} status={!this.state.isEnd}>点击加载更多</Pagination>
        <BottomBar />
      </div>
    );
  },
});


 
export default PayLive;



