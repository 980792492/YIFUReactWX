import React from 'react';
import {
  Container,
  Article,
} from 'amazeui-react';
import {
  Top,
} from '../components';

const Agreement = React.createClass({
  componentDidMount() {
    this.goTop();
  },

  goTop() {
    if (document.body.scrollTop !== 0) {
      window.scrollTo(0,0); 
    }
  },

  render() {
    return (
      <div>
        <Top title="G币购买使用协议"  />
        <Article >
          <h3 className="yf-text-center am-margin-0 am-text-size">G币购买使用协议</h3>
         <ul className="yf-text-align am-padding-left-0 am-text-sm am-margin-top-xs">
             
             <li>一.任何购买或使用一富财经G币的用户均需仔细阅读本须知，请您仔细阅读本协议，并选择接受或者不接受本协议。除非您同意并接受本协议中的各个条款，否则您无权购买、使用本协议项下所涉及的相关一富财经G币服务。
</li>
             <li>二.一富财经G币为虚拟货币，使用范围仅限于一富财经服务平台提供的课程购买、订阅等活动，不用于支付、购买实物产品或兑换其他企业的任何产品和服务。</li>
             <li>三.一富财经G币的单位购买价格：1G币=1元人民币。</li>
             <li>四.一富财经G币是可以在一富财经网站统一支付使用的虚拟货币，每个一富财经注册用户均可购买。用户可以通过转账汇款的方式购买一富财经G币，所购一富财经G币数额将被充入本人的一富财经账户内。</li>
             <li>五. 一富财经用户的购买方式为：应急账户汇款、网银支付、支付宝支付。除利用上述方式购买之外，一富财经服务平台不接受其它任何方式向的充值，并且一富财经服务平台将保存用户的充值记录，该记录保存期自用户充值之日起2年。
</li>
             <li>六.在购买或使用一富财经G币前请仔细填写并确认充值用户名，以免输入错误导致为他人的一富财经G币帐户充值 。</li>
             <li>七. 购买一富财经G币的用户即成为一富财经会员，会员账户内的一富财经G币不能退还为人民币。为了保障您的购买消费服务，请务必通过一富财经网站提供的支付方式进行购买充值。</li>
             <li>八.会员应按照一富财经收费标准、付款方式支付相关费用，遵守服务条款。资费说明和服务条款标明在相应收费服务的相应页面。
</li>
             <li>九.一富财经搭建平台为网站会员传递信息、产品、服务，并为实现相关功能而提供技术开发、资源整合、信息交流、客服服务等服务项，用户使用上述服务需交纳平台服务费用，该项费用仅对会员优惠暂免。</li>
             <li>十.保护用户隐私是一富财经服务平台的一项基本政策，一富财经服务平台保证不对外公开或向第三方提供单个用户的存储在一富财经服务平台的充值使用等非公开内容，但下列情况除外:</li>
             <ol className="am-margin-0 am-padding-left-0">
                <li>事先获得用户的明确授权；</li>
                <li>根据有关的法律法规要求；</li>
                <li>照相关政府主管部门的要求；</li>
                <li>为维护社会公众的利益；</li>
                <li>为用户提供更好的服务；</li>
                <li>维护一富财经服务平台的合法权益。</li>
             </ol>
             <li>十一.一富财经保留对以上须知的最终解释权。</li>
          </ul>
      </Article>
      </div>
    );
  },
});

export default Agreement;
