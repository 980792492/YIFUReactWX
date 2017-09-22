import React from 'react';
import moment from 'moment';
import {
  DateTimeInput,
  Table
} from 'amazeui-react';
import {
  Top,
  AuthMixin,
  BgColorMixin,
  Pagination,
} from '../../components';
import {
  Api,
} from '../../utils';

const Bill = React.createClass({
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
    Api.get('User/Balance', {
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
  			<tbody className="yf-margin-top">
  			{this.state.data.map((item, key) => {
  				return (
  					<tr key={key}>
  						<td className="yf-text-gray am-text-sm" width="80">{moment(item.CreateTime).format('MM月DD日HH:mm:ss')}</td>
  						<td className={item.Type == 1 ? 'am-text-danger am-text-middle' : 'am-text-middle'}>{item.Type == 1 ? '+' : '-'}{item.Gold}</td>
  						<td width="150">
  							{item.Title}
  							<div className="yf-text-gray am-text-sm am-text-truncate" style={{width: '150px'}}>{item.Description}</div>
  						</td>
  					</tr>
  				);
  			})}
  			</tbody>
  		</Table>
  	)
  },

  render() {
    return (
      <div>
        <Top title="收支明细" link="#/user" />
        <DateTimeInput format="YYYY-MM" 
        			   viewMode="months" 
        			   minViewMode="months" 
        			   icon="calendar"
        			   groupClassName="am-margin-bottom-xs"
        			   showTimePicker={false}
        			   onSelect={this.handlerSelect} />
       	{this.renderList()}
        <Pagination status={!this.state.isEnd} onClick={this.handlerNext}>点击加载更多</Pagination>
      </div>
    );
  },
});

export default Bill;
