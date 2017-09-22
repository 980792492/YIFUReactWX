import React from 'react';
import {
  Link,
} from 'react-router';
import {
  Container,
  Form,
  Input,
} from 'amazeui-react';
import {
  Top,
  SendSmsButton,
  AuthMixin,
} from '../../../components';
import {
  Api,
  Modal,
} from '../../../utils';

const Password = React.createClass({
  mixins: [AuthMixin],

  handlerSubmit(e) {
    e.preventDefault();
    //请求接口
    var originPassword = this.refs.originPassword.getValue(),
        password = this.refs.password.getValue(),
        password2 = this.refs.password2.getValue();

    if (password !== password2) {
    	Modal.alert("两次密码输入不一致");
    }

    //修改密码
    Api.post('User/EditPassword', {
      token: this.token,
      origin_password: originPassword,
      password: password,
    }, function(){
      this.context.router.push('/user/account');
    }.bind(this));
  },

  render() {
    return (
      <div>
        <Top title="修改密码" link="#/user/account" />
        <Container>
          <Form horizontal className="am-margin-top-xl" onSubmit={this.handlerSubmit}>
          	<div className="am-form-group">
          		<label className="am-u-sm-2 am-form-label am-text-sm am-padding-left-0 am-padding-right-0 am-text-center am-form-label">
          			<span>帐号</span>
          		</label>
          		<div className="am-u-sm-10 am-padding-right-0"><p className="yf-static">{this.user.UserName}</p></div>
          		<span></span>
          	</div>
		        <Input
		          ref="originPassword"
		          label="原密码"
              type="password"
		          placeholder="请输入原密码"
		          minLength="6"
		          maxLength="24"
		          labelClassName="am-u-sm-2 am-form-label am-text-sm am-padding-left-0 am-padding-right-0 am-text-center"
		          wrapperClassName="am-u-sm-10 am-padding-right-0" />
		        <Input
		          ref="password"
		          label="新密码"
              type="password"
		          placeholder="请输入新密码"
		          minLength="6"
		          maxLength="24"
		          labelClassName="am-u-sm-2 am-form-label am-text-sm am-padding-left-0 am-padding-right-0 am-text-center"
		          wrapperClassName="am-u-sm-10 am-padding-right-0" />
		        <Input
		          ref="password2"
		          label="确认"
              type="password"
		          placeholder="再次输入密码"
		          minLength="6"
		          maxLength="24"
		          labelClassName="am-u-sm-2 am-form-label am-text-sm am-padding-left-0 am-padding-right-0 am-text-center"
		          wrapperClassName="am-u-sm-10 am-padding-right-0" />
		        <Input type="submit" value="完成" amStyle="primary" className="am-margin-top yf-bg-red" block />
	      </Form>
        </Container>
      </div>
    );
  },
});

export default Password;
