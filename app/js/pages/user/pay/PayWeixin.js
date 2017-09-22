import React from 'react';
import {
  Link,
} from 'react-router';
import {
  Container,
  Input,
  Form,
  Button,
  Image
} from 'amazeui-react';
import {
  Top,
  AuthMixin,
} from '../../../components';
import {
  Modal,
  Api,
  Weixin,
  Cache,
} from '../../../utils';

const PayWeixin = React.createClass({
  timer: null,
  mixins: [AuthMixin],

  contextTypes: {
    router: React.PropTypes.object,
  },

  getInitialState: function() {
    return {
      QRCode: null,
      isSubmit: false,
    };
  },

  componentWillMount() {
    if (Weixin.url && Weixin.url !== location.hash) {
      window.location.reload();
    }
  },

  componentWillUnmount() {
    clearInterval(this.timer);
  },

  handlerSubmit(e) {
    e.preventDefault();
    this.setState({
      isSubmit: true,
    });

    if (!this.refs.agree.getChecked()) {
      Modal.alert("您未同意协议，无法充值");
      return;
    }

    let money = Number(this.refs.money.getValue());
    if (money > 0) {
      //获取微信支付数据
      wx.ready(() => {
        Api.get('Weixin/Pay', {token: this.token, gold: money}, resp => {
          wx.chooseWXPay({
            timestamp: resp.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr: resp.noncestr, // 支付签名随机串，不长于 32 位
            package: 'prepay_id=' + resp.prepay_id, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
            signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: resp.paySign, // 支付签名
            success: res => {
              // 支付成功后的回调函数
              Modal.alert("支付成功", () => {
                this.finishPay();
              });
            },
            fail: res => {
              Api.post('WeiXin/NativePay', {token: this.token, gold: money}, resp => {
                this.setState({
                  QRCode: resp.Code,
                });
                this.timer = setInterval(() => {
                  Api.get('WeiXin/QueryPay', {orderNo: resp.OrderNo}, resp => {
                    if (resp.Status === 'SUCCESS') {
                      clearInterval(this.timer);
                      Modal.alert("支付成功", () => {
                        this.finishPay();
                      });
                    }
                  });
                }, 3000);
              });
            },
            complete: res => {
              this.setState({
                isSubmit: false,
              });
            },
          });
        });
      });
    }
  },

  handlerBack(e) {
    e.preventDefault();
    clearInterval(this.timer);
    this.setState({
      QRCode: null, 
    });
  },

  // pay sucessful and go back to pre page
  finishPay() {
    let payLink = Cache.get("payLink", "user/balance");
    this.context.router.push(payLink);
  },

  renderNormal() {
    if (Weixin.url && Weixin.url !== location.hash) {
      return;
    }
    let header=(
      <div className="am-text-sm yf-text-align">您已阅读并同意
        <Link to="agreement" className="yf-text-blue am-text-sm">《一富财经G币购买使用协议》</Link>
      </div>
    )
    return (
      <Form horizontal className="am-margin-top-sm">
        <Input
          ref="money"
          label="充值金额："
          labelClassName="am-u-sm-3 am-form-label am-text-sm am-padding-left-0 am-padding-right-0 am-text-center"
          wrapperClassName="am-u-sm-9 am-padding-right-0" />
        <Button type="submit" disabled={this.state.isSubmit} amStyle="danger" className="am-margin-top-sm" block onClick={this.handlerSubmit}>去支付</Button>
        <Input
          type="checkbox"
          defaultChecked="true"
          ref="agree"
          label={header}
          labelClassName="am-u-sm-12 am-form-label am-text-sm am-padding-left-0 am-padding-right-0 am-text-center"
          wrapperClassName="am-u-sm-0 am-padding-right-0 am-padding-left-0"/>
      </Form>
    );
  },

  renderNative() {
    if (Weixin.url && Weixin.url !== location.hash) {
      return;
    }
    return (
      <div className="am-text-center">
        <Image src={`data:image/png;base64,${this.state.QRCode}`} />
        <p>请长按二维码图片，选择识别图中二维码，完成支付</p>
        <p>支付完成，请耐心等待</p>
        <Button type="submit" amStyle="danger" className="am-margin-top-sm" block onClick={this.handlerBack}>返回</Button>
      </div>
    );
  },

  render() {
    return (
      <div>
        <Top title="微信支付" />
        <Container>
          <p className="am-text-sm am-margin-top-xl yf-font-bold">用户名：{this.user.UserName}</p>
          {this.state.QRCode ? this.renderNative() : this.renderNormal()}
          <div className="yf-clear-both yf-font-size am-padding-top-sm">客服电话：0571-87119797，客服QQ群：600300</div>
          <div className="yf-clear-both yf-font-size">值班时间：周一至周五&nbsp;8:00-17:00</div> 
        </Container>
      </div>
    );
  }
});

export default PayWeixin;
