import React from 'react';
import {
  Link,
} from 'react-router';
import {
  Header,
  Form,
  Input,
  Image,
} from 'amazeui-react';
import {
  Top,
  BottomBar,
} from '../../components';
import {
  Users,
} from '../../models';
import {
  Api,
  Weixin,
} from '../../utils';

const Login = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },

  componentDidMount() {
    if (Users.isLogin()) {
      this.initUserData();
    } else {
      Weixin.initJssdk();
    }
  },

  handlerSubmit(e) {
    e.preventDefault();
    var username = this.refs.username.getValue();
    var password = this.refs.password.getValue();
    if (username && password) {
      Api.post('User/Login', {
        username: username,
        password: password,
        openid: Users.getOpenid(),
      }, resp => {
        Users.login(resp.token);
        //登陆成功，清除openid
        Users.setOpenid(false);

        this.initUserData();
      });
    }
  },

  // 初始化用户信息
  initUserData() {
    Users.getUserInfo(resp => {
      if (this.props.location.state && this.props.location.state.backurl) {
        this.context.router.replace(this.props.location.state.backurl);
      } else {
        this.context.router.replace('user');
      }
    });
  },

  render() {
    return (
      <div>
        <Top title="登录" />
        <Form onSubmit={this.handlerSubmit}>
          <fieldset>
            <div className="am-text-center am-padding-xl">
              <Image src="i/login-logo.jpg" width="50%" />
            </div>
            <Input ref="username" placeholder="请输入用户名/手机号/邮箱" maxLength="26" />
            <Input ref="password" type="password" placeholder="请输入密码" maxLength="16" minLength="6" />
            <Input type="submit" value="登录" className="am-margin-top-xl yf-bg-red yf-text-white" amStyle="primary" block />
            <div className="am-text-sm">
              还没有账号？
              <Link to="/user/register" className="am-btn am-btn-link am-btn-sm am-padding-left-0 am-padding-right-0">立即注册</Link>
              <Link to="/user/forget" className="am-fr am-btn am-btn-link am-btn-sm am-padding-left-0 am-padding-right-0">忘记密码</Link>
            </div>
          </fieldset>
        </Form>
        <BottomBar />
      </div>
    );
  },
});

export default Login;
