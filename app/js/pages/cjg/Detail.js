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
  Top,
  PayLink,
} from '../../components';
import {
  Modal,
  Api,
} from '../../utils';

const Detail = React.createClass({
  mixins: [BgColorMixin],

  vouchers : {},

  contextTypes: {
    router: React.PropTypes.object,
  },

  getInitialState() {
    return {
      title: null,
      data: null,
      gold: 0,
      shareList: [],
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
    Api.get('Cjg/Detail', params, resp => {
      if (resp.IsBuy == 0) {
        this.removeBgColor();
      }
      let shareList = [];
      resp.Content.map((item, key) => {
        if (item.Type == 1) {
          shareList.unshift(item);
        }
      });
      this.setState({
        title: resp.UserName + moment(resp.CreateDate).format('MM月DD日') + resp.Title,
        data: resp,
        shareList: shareList,
      });

    });
  },

  handlerBuy() {
    if (!Users.isLogin()) {
      Modal.confirm('您还未登录！，无法购买！', () => {
        this.context.router.push({pathname: "user/login", state: { "backurl" : this.props.location.pathname}});
      }, null, "登录", "取消");
      return;
    }

    let voucher = this.refs.voucher ? this.refs.voucher.getValue() : 0;
    let price = this.state.data.PreferentialPrice - (this.vouchers[voucher] ? this.vouchers[voucher].FaceValue : 0);
    price = price > 0 ? price : 0;

    if (this.state.gold < price) {
      Modal.alert('您的G币不足，请充值！');
      return;
    }

    Modal.confirm(`购买藏金阁将消费${price}G币，您确认购买吗？`, () => {
      Api.post('Cjg/Pay', {
        id: this.props.params.id,
        token: Users.getToken(),
        voucher_id: voucher,
      }, resp => {
        Modal.alert("您已成功购买，点击确认进入", () => {
          window.location.reload();
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
            return <option key={key} data-price={item.FaceValue} value={item.Id}>{item.FaceValue}元代金券&nbsp;&nbsp;{moment(item.EndDate).format('YYYY.MM.DD')}过期</option>;
          })}
        </Input>
      );
    }
  },

  renderBuy() {
    let notice = '', button = '';
    if (this.state.data.Promotion) {
      notice = <div className="am-text-danger yf-bg-yellow am-text-center am-text-sm am-padding-xs">{this.state.data.Promotion}</div>;
    }
    if (this.state.data.Status == 1) {
      button = <Button block amStyle="danger" className="am-margin-bottom-xl" onClick={this.handlerBuy}>确认购买</Button>
    } else {
      button = <Button block disabled>已下架</Button>
    }
    return (
      <Article>
        <Article.Child role="title" className="am-text-center am-text-default  am-margin-top am-margin-bottom"><strong>{moment(this.state.data.CreateDate).format('MM月DD日')}{this.state.data.Title}</strong></Article.Child>
        <ul className="am-padding-0 am-text-sm" style={{listStyleType: "none"}}>
          <li><Icon className="am-text-danger" icon="ls" /> 老师: {this.state.data.UserName}</li>
          <li><Icon className="am-text-danger" icon="nz" /> 结束购买时间: {moment(this.state.data.EndTime, 'YYYY-MM-DD HH:mm:ss').format('YY.MM.DD HH:59')}</li>
          <li><Icon className="am-text-danger" icon="nz" /> 停止服务时间: {this.state.data.StopDate ? moment(this.state.data.StopDate).format('YY.MM.DD 23:59') : '无'}</li>
          <li><Icon className="am-text-danger" icon="jg" /> 价格: <span className='am-text-danger'>{this.state.data.PreferentialPrice}G币</span> <small><del className="yf-text-gray">原价{this.state.data.Price}G币</del></small></li>
        </ul>
        {notice}
        <p className="am-text-sm am-margin-top-xs">藏金阁介绍：{this.state.data.Description}</p>
        <Article.Child role="divider" />
        {this.renderVoucher()}
        <div className="am-text-sm">您的G币余额为：{this.state.gold}G币<PayLink className="am-fr am-margin-bottom">立即充值>></PayLink></div>
        {button}
      </Article>
    );
  },

  renderContent() {
    return this.state.data.Content.map((item, key) => {
      if (!item.Content) return;

      let share = item.Type == 1 && item.ShareName ? <span className="am-text-danger am-margin-right-xs">{item.ShareName}</span> : null;

      return (
        <div key={key} className="am-padding-bottom-xs yf-clear-both">
          <div className="am-text-xs yf-text-gray am-margin-bottom-xs">追加时间：{moment(item.CreateDate).format('YYYY/MM/DD HH:mm:ss')}</div>
          <Panel className="am-margin-bottom-0">
            <div className="am-text-sm am-margin-bottom-0">{share}我现在的策略是：</div>
            <div className="am-text-sm" dangerouslySetInnerHTML={{__html: item.Content}} />
          </Panel>
        </div>
      );
    });
  },

  renderOptional(){
    let index = 0;
    return this.state.shareList.map((item, key) => {
      index++;
      return (
        <div key={key} className="yf-clear-both">
          <Panel className="am-margin-bottom-sm yf-overflow-hidden">
             <dl className="am-text-sm am-fl am-margin-top-0 yf-width am-margin-bottom-xs">
                <dt className="yf-font-weight-normal">
                  <div className="am-fl yf-bg-red yf-cjg-bg-yq am-text-center am-margin-right-xs yf-text-white" style={{fontSize: "1.5rem"}}>{index}</div>
                  <span className="am-text-lg">{item.ShareName}</span>
                </dt>
                <hr data-am-widget="divider" className="am-divider-cjg am-divider-dotted" />
                <dd className="yf-margin-left-cjg">发布时间：{moment(item.CreateDate).format('YY/MM/DD HH:mm')}</dd>
                <dd className="yf-margin-left-cjg">关注价位：{item.Price}</dd>
                <dd className="yf-margin-left-cjg">止盈价位：{item.TargetProfit}</dd>
                <dd className="yf-margin-left-cjg">止损价位：{item.StopLoss}</dd>
             </dl>
          </Panel>
        </div>
      );
    });
  },
  
  renderDetail() {
    return(
      <div>
        <div className="am-text-sm am-margin-bottom-0 yf-font-bold am-padding-top-sm" style={{lineHeight: "3.5rem", fontSize: "1.6rem",}}>
           <div className="yf-cjg-tittle">{this.state.title}</div>
        </div>
         <p className="am-text-xs am-margin-bottom-xs am-margin-top-sm">我的自选股</p>
        {this.renderOptional()}
        {this.renderContent()}
      </div>
    );
  },
  
  render() {
    if (this.state.data) {
      return (
        <div>
          <Top title={this.state.title} />
          <Container>
            {this.state.data.IsBuy == 0 ? this.renderBuy() : this.renderDetail()}
          </Container>
        </div>
      );
    } else {
      return <div />;
    }
  },
});

export default Detail;
