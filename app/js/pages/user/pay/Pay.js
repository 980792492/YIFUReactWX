import React from 'react';

import {
  Container,
  Button,
  Divider,
} from 'amazeui-react';

import {
  Top,
  Icon,
  AuthMixin,
  BgColorMixin,
} from '../../../components';

import { Weixin } from '../../../utils';

const Pay = React.createClass({
  mixins: [AuthMixin, BgColorMixin],

  render: function() {
    return (
      <div>
        <Top title="充值中心" />
          <Container className="am-padding-top">
            <p className="am-text-sm">
              请选择以下付款方式：
            </p>
            <Button block href="#/user/pay-offline" className="am-text-left yf-bg-white am-padding-left-sm am-margin-bottom-sm">
              <Icon icon="hk" size="md" color="red" />
              <span> 应急账户汇款</span>
            </Button>
            <Button disabled={!Weixin.isEnable()} block href="#/user/pay-weixin" className="am-text-left yf-bg-white am-padding-left-sm am-margin-bottom-sm">
              <Icon icon="wx" size="md" style={{color: '#42a70b'}} />
              <span> 微信支付</span>
            </Button>
            {/*
            <Button block className="am-text-left yf-bg-white am-padding-left-sm am-margin-bottom-sm">
              <Icon icon="yhk" size="md" style={{color: '#d7a741'}} />
              <span> 网银支付</span>
            </Button>
            */}
            <Divider />
            <Button block href="#/user/recharge" className="am-text-left yf-bg-white am-padding-left-sm am-margin-bottom-sm">
              <Icon icon="czjl" size="md" />
              <span> 充值记录</span>
            </Button>
          </Container>
      </div>
    );
  }

});

export default Pay;