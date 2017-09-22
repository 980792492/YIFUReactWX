import React from 'react';
import {
  Form,
  Input,
} from 'amazeui-react';
import {
  Top,
  AuthMixin,
} from '../../../components';
import {
  Api,
} from '../../../utils';

const Sign = React.createClass({
  mixins: [AuthMixin], 
     
  handlerSubmit(e){
    e.preventDefault();
    var user_sign = this.refs.sign.getValue(); 
    Api.post('/User/Edit',{
      token: this.token,
      user_sign: user_sign,
    }, () => {
      this.context.router.push('/user/account');
    });
  },

  render() {
    return (
      <div>
        <Top title="个人简介" />
        <Form className="am-padding-sm" onSubmit={this.handlerSubmit}>
          <Input ref="sign" type="textarea" label="请输入个人简介" height="120px" defaultValue={this.user.UserSign}/>
          <Input type="submit" value="提交" amStyle="primary" className="am-margin-top yf-bg-red" block />
        </Form>
      </div>
    );
  },

});

export default Sign;