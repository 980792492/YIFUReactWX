import React from 'react'; 
import {
  Container,
  Divider,
} from 'amazeui-react';
import{
  Icon,
  AuthMixin,
  BgColorMixin,
} from '../../components';
const Service = React.createClass({
  mixins: [AuthMixin, BgColorMixin],

  render() {
    return (
      <Container>
        <ul className="am-text-md am-margin-0 am-padding-top-xl">
          <li  className="am-text-sm "><Icon icon="dh" size="md" className="am-fl am-text-danger am-margin-top-xs"/>客服电话：</li>
          <li  className=""><span className="am-padding-right-sm yf-font-bold ">0571-87119797</span><span className="am-text-xs">工作日8:30-17:00</span></li>
        </ul>
        {
          // 换成Divider
        }
        <hr data-am-widget="divider"className="am-divider am-divider-dotted am-margin-xs am-padding-0" />
        <ul className="am-text-md am-margin-0 ">
          <li className="am-text-sm"><Icon icon="qq" size="md" className="am-fl am-text-danger am-margin-top-xs"/>客服QQ群：</li>
          <li className="yf-font-bold ">600300</li>
        </ul>  
      </Container>
    );
  },
});

export default Service;
  
