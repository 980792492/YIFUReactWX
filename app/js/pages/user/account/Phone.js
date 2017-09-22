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
  Cache,
} from '../../../utils';

const Phone = React.createClass({
  mixins: [AuthMixin],

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
      if (data.used == 0) {
        Api.post('User/SendSms', {phone: phone}, function(){
          Cache.set("smsLastTime", 60, -1);
          //next
          this.setState({phone: phone});
        }.bind(this));
      } else {
        Modal.alert('手机号已存在，请更换其他手机号');
      }
    }.bind(this));
    
  },

  handlerSubmit(e) {
    e.preventDefault();
    //请求接口
    var code = this.refs.code.getValue();

    //修改手机
    Api.post('User/EditPhone', {
    	token: this.token,
      phone: this.state.phone,
      code: code,
    }, function(){
      this.context.router.push('/user/account');
    }.bind(this));
  },

  renderStep1() {
    return (
      <Form horizontal className="am-margin-top-xl" onSubmit={this.handlerNext}>
        <Input
          ref="phone"
          label="手机号"
          placeholder="请输入新手机号"
          maxLength="11"
          labelClassName="am-u-sm-2 am-form-label am-text-sm am-padding-left-0 am-padding-right-0 am-text-center"
          wrapperClassName="am-u-sm-10 am-padding-right-0" />
        <Input type="submit" value="下一步" amStyle="primary" className="am-margin-top yf-bg-red" block />
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
        <Input type="submit" value="完成" amStyle="primary" className="am-margin-top yf-bg-red" block />
      </Form>
    );
  },

  render() {
    return (
      <div>
        <Top title="修改手机" link="#/user/account" />
        <Container>
          {this.state.phone ? this.renderStep2() : this.renderStep1()}
        </Container>
      </div>
    );
  },
});

export default Phone;
