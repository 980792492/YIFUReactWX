import React from 'react';
import moment from 'moment';
import {
  DateTimeInput,
  Table,
} from 'amazeui-react';
import {
  Top,
  AuthMixin,
  BgColorMixin,
  Pagination,
} from '../../../components';
import {
  Api,
} from '../../../utils';

const RechargeWayMap = {
  801: '应急帐号汇款',
  802: '网银支付',
  803: '支付宝转账',
  804: '微信支付',
  999: '其他',
};

const RechargeStatusMap = {
  '-1': {
    name: '充值失败',
    color: 'am-text-danger',
  },
  0: {
    name: '未生效',
    color: '',
  },
  1: {
    name: '等待确认',
    color: '',
  },
  2: {
    name: '充值成功',
    color: 'am-text-success',
  },
  3: {
    name: '等待付款',
    color: '',
  },
};

const Recharge = React.createClass({
  mixins: [AuthMixin, BgColorMixin],

  getDefaultProps: function() {
    return {
      pageSize : 20,
    };
  },

  getInitialState() {
    return {
      data: [],
      date: moment().format('YYYY-MM'),
      last: 0,
      isEnd: true,
    };
  },

  componentDidMount() {
    this.loadData(this.state.date);
  },

  loadData(date) {
    let start = moment(date, 'YYYY-MM').format('YYYY-MM-01 00:00:00'),
        end = moment(date, 'YYYY-MM').add(1, 'M').format('YYYY-MM-01 00:00:00');
    Api.get('User/Recharge', {
      token: this.token,
      start: start,
      end: end,
      last: this.state.last,
      num: this.props.pageSize,
    }, resp => {
      this.setState({
        data: this.state.data.concat(resp),
        date: date,
        last: resp[resp.length - 1] ? resp[resp.length - 1].Id : 0,
        isEnd: resp.length < this.props.pageSize,
      });
    });
  },

  handlerSelect(date) {
    this.setState({
      data: [],
      last: 0,
      isEnd: true, 
    });
    this.loadData(date);
  },

  handlerNext() {
    this.loadData(this.state.date);
  },

  renderList() {
    return (
      <Table className="yf-bg-white">
        <tbody>
        {this.state.data.map((item, key) => {
          return (
            <tr key={key}>
              <td>
                {RechargeWayMap[item.RechargeWay]}
                <br />
                <small>{ moment(item.CreateDate).format('MM-DD HH:mm') }</small>
              </td>
              <td className="am-text-right">
                <span className="am-text-danger">+{item.Gold}</span>
                <br />
                <small className={RechargeStatusMap[item.RechargeStatus].color}>{RechargeStatusMap[item.RechargeStatus].name}</small>
              </td>
            </tr>
          );
        })}
        </tbody>
      </Table>
    );
  },

  render() {
    return (
      <div>
        <Top title="充值记录" />
        <DateTimeInput
          format="YYYY-MM"
          viewMode="months"
          minViewMode="months"
          icon="calendar"
          groupClassName="am-margin-bottom-xs"
          showTimePicker={false}
          onSelect={this.handlerSelect}
        />
        {this.renderList()}
        <Pagination status={!this.state.isEnd} onClick={this.handlerNext}>点击加载更多</Pagination>
      </div>
    );
  },

});

export default Recharge;
