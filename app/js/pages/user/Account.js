import React from 'react';
import {
  Link,
} from 'react-router';
import $ from 'jquery';
import {
  List,
  ListItem,
  Container,
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

const Account = React.createClass({
  mixins: [AuthMixin, BgColorMixin],

  componentDidMount: function() {
    Users.getUserInfo(function(data) {
      this.setState({
        users: data
      });
    }.bind(this));
  },

  getInitialState: function() {
    return {
      users: false
    };
  },

  renderList() {
    if (this.state.users) {
      var avatar = this.state.users.HeadImg ? <img src={this.state.users.HeadImg} height="22" /> : '';
      const list = [
        { 'link': '/user/account/avatar', 'content': avatar, 'title': '修改头像' },
        { 'link': '/user/account/phone', 'content': this.state.users.Phone, 'title': '修改手机' },
        { 'link': '/user/account/password', 'content': '', 'title': '修改密码' },
        { 'link': '/user/account', 'content': this.state.users.Email, 'title': '邮箱' },
        { 'link': '/user/account/sex', 'content': Users.sexArr[this.state.users.Sex*1], 'title': '性别' },
        { 'link': '/user/account/area', 'content': this.state.users.Province + this.state.users.City, 'title': '地区' },
        { 'link': '/user/account/job', 'content': this.state.users.Job, 'title': '职业' },
        { 'link': '/user/account/capital-scale', 'content': Users.capitalScaleArr[this.state.users.CapitalScale*1], 'title': '类型' },
        { 'link': '/user/account/sign', 'content': this.state.users.UserSign.substring(0,6)+'...', 'title': '个人简介' },
      ];
      return list.map((item, key) => {
        return (
          <ListItem key={key} className="am-link-muted" linkComponent={Link} linkProps={{to: item.link}}>
            <Icon icon="right" className="am-fr" />
            <span className="am-fr">{item.content}&nbsp;</span>
            {item.title}
          </ListItem>
        );
      });
    }
  },

  render() {
    return (
      <div>
        <Top title="账户管理" link="#/user" />
        <Container>
          <List border static className="am-padding-top">
            <ListItem>昵称: {this.state.users.UserName}</ListItem>
          </List>
          <List border>
            {this.renderList()}
          </List>
        </Container>
      </div>
    );
  },
});

export default Account;
