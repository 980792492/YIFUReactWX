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
} from '../../components';
import {
  Api,
  Modal,
  Cache,
} from '../../utils';

const Forget = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },
  
  getInitialState() {
    return {
      phone: null
    };
  },

  handlerNext(e) {
    e.preventDefault();
    let phone = this.refs.phone.getValue();
    if (!phone) {
      return false;
    }
    //todo 统一验证类
    if (!/^[0-9]{11}$/.test(phone)) {
      Modal.alert('手机号格式不正确');
      return false;
    }
    //请求接口检查手机号是否存在
    Api.get('User/Verify', {type: 'phone', value: phone}, function(data){
      if (data.used == 1) {
        Api.post('User/SendSms', {phone: phone}, function(){
          Cache.set("smsLastTime", 60, -1);
          //next
          this.setState({phone: phone});
        }.bind(this));
      } else {
        Modal.alert('用户不存在或没有绑定手机');
      }
    }.bind(this));
    
  },

  handlerSubmit(e) {
    e.preventDefault();
    //请求接口
    var password = this.refs.password.getValue(),
        code = this.refs.code.getValue();

    //修改密码
    Api.post('User/ForgetPassword', {
      phone: this.state.phone,
      password: password,
      code: code,
    }, function(){
      this.context.router.push('/user/login');
    }.bind(this));
  },

  renderStep1() {
    return (
      <Form horizontal className="am-margin-top-xl" onSubmit={this.handlerNext}>
        <Input
          ref="phone"
          label="手机号"
          placeholder=""
          maxLength="11"
          labelClassName="am-u-sm-2 am-form-label am-text-sm am-padding-left-0 am-padding-right-0 am-text-center"
          wrapperClassName="am-u-sm-10 am-padding-right-0" />
        <Input type="submit" value="下一步" amStyle="primary" className="am-margin-top yf-bg-red yf-text-white" block />
      </Form>
    );
  },

  renderStep2() {
    return (
      <Form horizontal className="am-margin-top-xl" onSubmit={this.handlerSubmit}>
        <Input
          ref="code"
          label="验证码"
          placeholder=""
          maxLength="6"
          labelClassName="am-u-sm-2 am-form-label am-text-sm am-padding-left-0 am-padding-right-0 am-text-center"
          wrapperClassName="am-u-sm-10"
          btnAfter={(<SendSmsButton phone={this.state.phone} />)} />
        <Input
          ref="password"
          type="password"
          label="新密码"
          placeholder=""
          maxLength="26"
          labelClassName="am-u-sm-2 am-form-label am-text-sm am-padding-left-0 am-padding-right-0 am-text-center"
          wrapperClassName="am-u-sm-10" />
        <Input type="submit" value="完成" amStyle="primary" className="am-margin-top yf-bg-red" block />
      </Form>
    );
  },

  render() {
    return (
      <div>
        <Top title="找回密码" />
        <Container>
          {this.state.phone ? this.renderStep2() : this.renderStep1()}
        </Container>
      </div>
    );
  },
});

export default Forget;
