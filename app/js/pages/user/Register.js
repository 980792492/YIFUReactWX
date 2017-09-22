import React from 'react';
import {
  Link,
} from 'react-router';
import {
  Container,
  Form,
  Input,
  Modal as AModal,
  ButtonGroup,
  Button,
} from 'amazeui-react';
import {
  Top,
  SendSmsButton,
  BottomBar,
} from '../../components';
import {
  Api,
  Modal,
  Cache,
} from '../../utils';
import {
  Users,
} from '../../models';

const Register = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },

  getInitialState() {
    return {
      phone: null,
      inviteUserName: null,
    };
  },

  componentDidMount() {
    if (this.props.params.invite > 0) {
      //邀请注册，写入缓存
      Users.setInvite(this.props.params.invite);
    }

    if (Users.getInvite() > 0) {
      //获取邀请人数据
      Api.get('User/CheckInviteUser', {id : Users.getInvite()}, resp => {
        if (resp) {
          this.setState({
            inviteUserName: resp,
          });
        }
      });
    }
  },

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  },

  handlerNext(e) {
    e.preventDefault();
    let phone = this.refs.phone.getValue();
    if (!phone) {
      return false;
    }
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
        Modal.alert('该手机号已被使用');
      }
    }.bind(this));
    
  },

  handlerSubmit(e) {
    e.preventDefault();
    //请求接口
    let data = {
      phone: this.state.phone,
      nickname: this.refs.nickname.getValue(),
      password: this.refs.password.getValue(),
      code: this.refs.code.getValue(),
      invite: Users.getInvite(),
      openid: Users.getOpenid(),
    };

    if (!data.nickname) {
      Modal.alert('昵称不能为空哦！');
      return false;
    }

    if(data.nickname == data.phone){
      Modal.alert('昵称不能和您的手机号相同哦！');
      return false;
    }

    //检测用户名是否存在
    Api.get('User/Verify', {type: 'username', value: data.nickname}, resp => {
      if (resp.used == 0) {
        //注册提交
        Api.post('User/Register', data, resp => {
          Users.login(resp.token);
          // 注册成功，清除邀请id
          Users.setInvite(0);
          // 注册成功，清除openid
          Users.setOpenid(false);
          this.initUserData();
        });
        
      } else {
        Modal.alert('该昵称已被使用，请重新选择');
      }
    });
  },

  // 初始化用户信息
  initUserData() {
    let modal = (
      <AModal style={{position: 'relative'}} className="yf-login-box">
        <h3 className="am-padding-top-sm am-margin-bottom-sm">恭喜您</h3>
        <p className="am-text-sm">
          您已成功注册一富财经官方直播
          <br />
          5秒后会自动跳转
        </p>
        <ButtonGroup justify>
          <Button component="a" onClick={() => {
            Modal.close();
            this.registerSuccessJump();
          }}>立即跳转</Button>
        </ButtonGroup>
      </AModal>
    );
    Users.getUserInfo(resp => {
      Modal.open(modal);
      this.timer = setTimeout(() => {
        Modal.close();
        this.registerSuccessJump();
      }, 5000);
    });
  },

  registerSuccessJump() {
    if (this.props.location.state && this.props.location.state.backurl) {
      this.context.router.replace(this.props.location.state.backurl);
    } else {
      this.context.router.replace('user');
    }
  },

  renderInvite() {
    if (this.state.inviteUserName) {
      return <p className="am-text-sm">您的好友{this.state.inviteUserName}邀请您注册一富财经</p>;
    }
  },

  renderStep1() {
    return (
      <Form horizontal className="am-margin-top-sm" onSubmit={this.handlerNext}>
        {this.renderInvite()}
        <Input
          ref="phone"
          label="手机号"
          placeholder=""
          maxLength="11"
          labelClassName="am-u-sm-2 am-form-label am-text-sm am-padding-left-0 am-padding-right-0 am-text-center"
          wrapperClassName="am-u-sm-10 am-padding-right-0" />
        <Input type="submit" value="下一步" amStyle="primary" className="am-margin-top-xs yf-bg-red yf-text-white" block />
        <p className="am-text-sm am-text-right">
          已有账号？
          <Link to="/user/login">立即登录</Link>
        </p>
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
        <input type="hidden" />
        <Input
          ref="nickname"
          label="昵称"
          placeholder=""
          maxLength="26"
          labelClassName="am-u-sm-2 am-form-label am-text-sm am-padding-left-0 am-padding-right-0 am-text-center"
          wrapperClassName="am-u-sm-10" />
        <Input
          ref="password"
          type="password"
          label="密码"
          placeholder=""
          maxLength="26"
          labelClassName="am-u-sm-2 am-form-label am-text-sm am-padding-left-0 am-padding-right-0 am-text-center"
          wrapperClassName="am-u-sm-10" />
        <Input type="submit" value="完成" amStyle="primary" className="am-margin-top yf-bg-red yf-text-white" block />
      </Form>
    );
  },

  render() {
    return (
      <div>
        <Top title="注册" />
          {(() => {
            if (!this.state.phone) {
              return (<img src="i/logobanner.jpg"  className="am-img-responsive" />);
            }
          })()}
          <Container>
            {this.state.phone ? this.renderStep2() : this.renderStep1()}
          </Container>
          {(() => {
            if (!this.state.phone) 
              return (<BottomBar />);
          })()}
      </div>
    );
  },
});

export default Register;
