import React from 'react';
import {
  Link,
} from 'react-router';
import $ from 'jquery';
import {
  List,
  ListItem,
  Container,
  Button,
} from 'amazeui-react';
import {
  Top,
  BottomBar,
  AuthMixin,
  BgColorMixin,
  Icon,
} from '../../components';
import {
  Users,
} from '../../models';
import {
  Modal,
  Weixin,
  Api,
} from '../../utils';

const My = React.createClass({
  mixins: [AuthMixin, BgColorMixin],

  componentDidMount() {
    Users.getUserInfo(data => {
      this.setState({
        users: data
      });
    });
  },

  getInitialState() {
    return {
      users: false
    };
  },

  handlerLogout() {
    let text = Weixin.isEnable() ? "您是否需要注销登录并解除绑定？" : "您是否需要注销登录？";
    Modal.confirm(text, () => {
      Api.post("User/Logout", {token: this.token}, () => {
        Users.logout();
        this.context.router.replace('/user/login');
      });
    });
  },

  renderImage() {
    if (this.state.users) {
      return (
        <div className="yf-box am-text-center am-padding-xs yf-bg-red">
          <div>
            <img className="am-circle" src={this.state.users.HeadImg} height="60" />
          </div>
          <p className="yf-text-white am-margin-xs">{this.state.users.UserName}</p>
        </div>
      );
    }
  },

  renderGcoins() {
    if (this.state.users) {
      return (
        <ul className="am-avg-sm-3 am-text-center yf-bg-white">
          <li><Link to="/user/balance" className="am-text-danger am-text-sm">{this.state.users.CurrentGcoinsCount}<br/><span className="am-text-xs yf-text-gray">G币</span></Link></li>
          <li><Link to="/user/voucher" className="am-text-danger am-text-sm">{this.state.users.VoucherCount}张<br/><span className="am-text-xs yf-text-gray">代金券</span></Link></li>
          <li><Link to="/user" className="am-text-danger am-text-sm">{this.state.users.CurrentGcentsCount}<br/><span className="am-text-xs yf-text-gray">积分</span></Link></li>
        </ul>
      );
    }
  },

  renderList() {
    const list = [
      { to: {pathname: 'user/account'}, icon: 'sz', title: '账户管理' },
      { to: {pathname: 'cjg', state: 'my'}, icon: 'cjg', title: '我的藏金阁' },
      { to: {pathname: 'vip', state: 'my'}, icon: 'txb', title: '我的VIP' },
      { to: {pathname: 'room/list', state: 'my'}, icon: 'wsc', title: '我关注的直播室' },
      { to: {pathname: 'user/pay-live'}, icon: 'cjg', title: '我订阅的加密观点' },
      { to: {pathname: 'user/invite'}, icon: 'yqhy', title: '邀请好友' },
      { to: {pathname: '/user/message/list/1'}, icon: 'xx', title: '消息中心' },
      { to: {pathname: '/user/bill'}, icon: 'shouzhimingxi', title: '收支明细' },
    ];
    return list.map((item, key) => {
      return (
        <ListItem key={key} className="am-link-muted" linkComponent={Link} linkProps={{to: item.to}}><Icon icon={item.icon} /> {item.title}</ListItem>
      );
    });
  },

  render() {
    return (
      <div>
        <Top title="个人中心" link="#/" />
        {this.renderImage()}
        {this.renderGcoins()}
        <hr className="am-margin-0" />
        <Container>
          <List border className="am-padding-top">
            {this.renderList()}
          </List>
          <Button block amStyle="warning" className="am-margin-bottom" onClick={this.handlerLogout}>{Weixin.isEnable() ? "注销并解除绑定" : "注销"}</Button>
        </Container>
        <BottomBar />
      </div>
    );
  },
});

export default My;
