import React from 'react';
import moment from 'moment';
import {
  Panel,
  PanelGroup,
} from 'amazeui-react';
import {
  Top,
  AuthMixin,
  BgColorMixin,
  Icon,
  Pagination,
} from '../../components';
import {
  Api,
} from '../../utils';

const UsePositionMap = {
  0: "全场通用",
  1: "仅限购买VIP使用",
  2: "仅限购买藏经阁使用",
  3: "仅限购买直播室产品使用",
};

const Voucher = React.createClass({
  mixins: [AuthMixin, BgColorMixin],

  getDefaultProps: function() {
    return {
      pageSize : 20,
    };
  },

  getInitialState() {
    return {
      data: [],
      page: 1,
      isEnd: true,
    };
  },

  componentDidMount() {
    this.loadData();
  },

  loadData() {
    Api.get('User/Voucher', {
      token: this.token,
      page: 1,
      num: this.props.pageSize,
    }, resp => {
      this.setState({
        data: resp, 
        isEnd: resp.length < this.props.pageSize,
      });
    });
  },

  handlerNext() {
    let page = this.state.page + 1;
    Api.get('User/Voucher', {
      token: this.token,
      page: page,
      num: this.props.pageSize,
    }, resp => {
      if (resp.length > 0) {
        this.setState({
          page: page,
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
  	return (
      <PanelGroup className="am-padding-sm">
        {this.state.data.map((item, key) => {
          return (
            <Panel key={key} style={{position:"relative"}} className="yf-djq-padding">
              <Icon icon="yhq" className={item.UseState == 0 ? "am-text-danger yf-icon-postion" : "yf-djq-text-gray yf-icon-postion"} size="lg"></Icon>
              <Icon icon="yishixiao" className="yf-djq-text-gray yf-icon-yishixiao-postion" size="lg" hide={item.UseState == 0}></Icon>
              <span className="yf-text-white am-text-sm yf-djq-postion-3">￥{item.FaceValue}</span>
              <dl className="am-margin-0 yf-djq-padding-left">
                <dt className="am-text-xs">{item.UseValue > 0 ? "满" + item.UseValue + "可使用，" : ""}{UsePositionMap[item.UsePosition]}</dt>
                <dd className="am-text-xs am-margin-0 am-link-muted">使用期限：{moment(item.StartDate).format('MM/DD HH:mm')}-{moment(item.EndDate).format('MM/DD HH:mm')}</dd>
              </dl>
            </Panel>
          );
        })}
      </PanelGroup>
    )
  },

  render() {
    return (
      <div>
        <Top title="我的代金券" link="#/user" />
       	{this.renderList()}
        <Pagination status={!this.state.isEnd} onClick={this.handlerNext}>点击加载更多</Pagination>
      </div>
    );
  },
});

export default Voucher;
