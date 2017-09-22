import React from 'react';
import moment from 'moment';
import {
  Container,
  Article,
  Input,
  FormGroup,
  Button,
  Panel,
} from 'amazeui-react';
import { Users } from '../../models';
import {
  Icon,
  BgColorMixin,
  PayLink,
} from '../../components';
import {
  Modal,
  Api,
} from '../../utils';

const Detail = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },

  vouchers : {},

  getInitialState() {
    return {
      data: null,
      gold: 0,
    };
  },

  componentDidMount() {
    this.loadData();
  },

  loadData() {
    let params = {
      id: this.props.params.id,
    };
    if (Users.isLogin()) {
      params.token = Users.getToken();
      Users.getUserInfo(resp => {
        this.setState({
          gold: resp.CurrentGcoinsCount,
        });
      });
    }

    Api.get('Vip/Detail', params, resp => {
      if (resp.Status == 11 && resp.IsBuy == 1) {
        //已购买并且已开播的直接进入直播室
        this.context.router.replace(`vip/topic/${resp.Id}`);
        return;
      }
      this.setState({
        data: resp, 
      });
    });
  },

  handlerBuy() {
    if (!Users.isLogin()) {
      Modal.confirm('您还未登录，无法购买！', () => {
        this.context.router.push({pathname: "user/login", state: { "backurl" : this.props.location.pathname}});
      }, null, "登录", "取消");
      return;
    }

    let voucher = this.refs.voucher ? this.refs.voucher.getValue() : 0;
    let price = this.state.data.Gold - (this.vouchers[voucher] ? this.vouchers[voucher].FaceValue : 0);
    price = price > 0 ? price : 0;
    
    if (this.state.gold < price) {
      Modal.alert('您的G币不足，请充值！');
      return;
    }

    Modal.confirm(`购买本期VIP将消费${price}G币，您确认购买吗？`, () => {
      Api.post('Vip/Pay', {
        id: this.props.params.id,
        token: Users.getToken(),
        voucher_id: voucher,
      }, resp => {
        Modal.alert("您已成功购买，点击确认进入", () => {
          this.context.router.push(`vip/topic/${this.props.params.id}`);
        });
      })
    });
  },

  renderVoucher() {
    if (this.state.data.Vouchers.length > 0) {
      return (
        <Input type="select" ref="voucher" standalone className="am-text-sm am-margin-bottom-sm">
          <option value="">不使用优惠券</option>
          {this.state.data.Vouchers.map((item, key) => {
            this.vouchers[item.Id] = item;
            return <option key={key} value={item.Id}>{item.FaceValue}元代金券&nbsp;&nbsp;{moment(item.EndDate).format('YYYY.MM.DD')}过期</option>;
          })}
        </Input>
      );
    }
  },

  renderContent() {
    let button = '';
    if (this.state.data.PayStatus == 1) {
      if (this.state.data.IsBuy == 1) {
        if (this.state.data.Status == 11)
          button = <Button block href={`vip/topic/${this.props.params.id}`}>进入直播室</Button>;
        else if (this.state.data.Status == 21)
          button = <Button block disabled>直播已结束</Button>;
        else
          button = <Button block disabled>等待开播</Button>;
      } else {
        button = <Button block amStyle="danger" onClick={this.handlerBuy}>确认购买</Button>;
      }
    } else {
      button = <Button block disabled>已停售</Button>;
    }
    return (
      <Article>
        <Article.Child role="title" className="am-text-center am-text-default am am-margin-top am-margin-bottom"><strong>{this.state.data.Title}</strong></Article.Child>
        <ul className="am-padding-0 am-text-sm" style={{listStyleType: "none"}}>
          <li className="am-margin-bottom-xs"><Icon className="am-text-danger " icon="ls" /> 老师: {this.state.data.TeacherName}</li>
          <li className="am-margin-bottom-xs"><Icon className="am-text-danger " icon="jg" /> 价格: <span className='am-text-danger'>{this.state.data.Gold}G币</span></li>
          <li className="am-margin-bottom-xs"><Icon className="am-text-danger " icon="nz" /> 服务期限: {moment(this.state.data.StartTime).format('MM.DD')}至{moment(this.state.data.EndTime).format('MM.DD')}</li>
        </ul>
        <p className="am-text-sm">说明：{this.state.data.Tintroduce}</p>
        <Article.Child role="divider" className="am-margin-bottom-sm"/>
        {this.renderBuy()}
      </Article>
    );
  },

  renderBuy() {
    let button;
    if (this.state.data.IsBuy == 0) {
      if (this.state.data.PayStatus == 1) 
        button = <Button block amStyle="danger" onClick={this.handlerBuy}>确认购买</Button>;
      else 
        button = <Button block disabled>已停售</Button>;

      return (
        <div>
          {this.renderVoucher()}
          <div className="am-text-sm">您的G币余额为：{this.state.gold}G币<PayLink className="am-fr am-margin-bottom">立即充值>></PayLink></div>
          {button}
        </div>
      );
    } else {
      if (this.state.data.Status == 11)
        button = <Button block amStyle="primary" href={`#/vip/topic/${this.props.params.id}`}>进入直播室</Button>;
      else if (this.state.data.Status == 21)
        button = <Button block disabled>直播已结束</Button>;
      else
        button = <Button block disabled>等待开播</Button>;
      return button;
    }
  },
  
  render() {
    return (
      <Container>
        {this.state.data ? this.renderContent() : null}
      </Container>
    );
  },
});

export default Detail;
