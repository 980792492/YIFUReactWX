import React from 'react';
import {
  Link,
} from 'react-router';
import {
	Container,
	Button,
	Divider,
	Input,
	Panel,
	Table,
	List,
	ListItem,
} from 'amazeui-react';

import {
  Top,
  Icon,
  AuthMixin,
  BgColorMixin,
} from '../../../components';

const PayOffline = React.createClass({ 
	mixins: [AuthMixin, BgColorMixin],
	render: function() {
	  	let header=(
			<div className="yf-bg-blue am-padding-0">
				<Icon icon="jsyh" size="xs" className="yf-text-white am-margin-left-sm am-margin-top-xs am-margin-bottom-xs"/>
				<span className="am-margin-left-xs yf-text-white">中国建设银行</span>
			</div>
		)
		let headergs=(
            <div className="yf-bg-red">
                <Icon icon="gsyh" size="xs" className="yf-text-white am-margin-left-sm am-margin-top-xs am-margin-bottom-xs"/>
                <span className="am-margin-left-xs yf-text-white" >中国工商银行</span>
            </div>
        )
        let headerny=(
            <div className="yf-bg-green">
                <Icon icon="nyyh" size="xs" className="yf-text-white am-margin-left-sm am-margin-top-xs am-margin-bottom-xs"/>
                <span className="am-margin-left-xs yf-text-white" >中国农业银行</span>
            </div>
        )
        let headerzs=(
            <div className="yf-bg-zs-red">
                <Icon icon="zsyh" size="xs" className="yf-text-white am-margin-left-sm am-margin-top-xs am-margin-bottom-xs"/>
                <span className="am-margin-left-xs yf-text-white" >招商银行</span>
            </div>
        )
          let headerzfb=(
            <div className="yf-bg-zfb-blue am-padding-top-xs am-padding-bottom-xs">
                <span className="yf-text-white am-margin-left-sm " >支付宝账号</span>
            </div>
        )
	
    return (
      <div>
        <Top title="应急账户" />
	    <Container>
			 <p className="am-text-sm am-margin-top-sm">请选择以下付款方式：</p>
			 <Panel header={header} className="yf-panel-padding-0">
				      <ul className="am-padding-left-sm am-padding-right-sm am-padding-top-sm am-padding-bottom-xs">
				        <li>户&nbsp;&nbsp;名:杨上越</li>
				        <li>账&nbsp;&nbsp;号:6217 0015 4000 1811 205</li>
				        <li>开户行:建设银行滨江支行</li>
				      </ul>
			  </Panel>
			   <Panel header={headergs} className="yf-panel-padding-0">
                      <ul className="am-padding-left-sm am-padding-right-sm am-padding-top-sm am-padding-bottom-xs">
                        <li>户&nbsp;&nbsp;名:杨上越</li>
                        <li>账&nbsp;&nbsp;号:6212 2612 0200 4698 198</li>
                        <li>开户行:工商银行杭州钱江支行</li>
                      </ul>
              </Panel>
               <Panel header={headerny} className="yf-panel-padding-0">
                      <ul className="am-padding-left-sm am-padding-right-sm am-padding-top-sm am-padding-bottom-xs">
                         <li>户&nbsp;&nbsp;名:杨上越</li>
                         <li>账&nbsp;&nbsp;号:6228 4803 2306 5502 219</li>
                         <li>开户行:农业银行滨江支行</li>
                      </ul>
              </Panel>
               <Panel header={headerzs} className="yf-panel-padding-0">
                      <ul className="am-padding-left-sm am-padding-right-sm am-padding-top-sm am-padding-bottom-xs">
                          <li>户&nbsp;&nbsp;名:杨上越</li>
                          <li>账&nbsp;&nbsp;号:6214 8357 1000 6725</li>
                          <li>开户行:招商银行杭州分行钱塘支行</li> 
                      </ul>
              </Panel>
               <Panel header={headerzfb} className="yf-panel-padding-0">
                      <ul className="am-padding-left-sm am-padding-right-sm am-padding-top-sm am-padding-bottom-xs">
                        <li>户&nbsp;&nbsp;名:杨上越</li>
                        <li>账&nbsp;号:18968198017@163.com</li>
                      </ul>
              </Panel>
			  <p className="am-margin-top-sm am-margin-bottom-xs">特别提示：</p>      
			  <ul className=" am-padding-left-0 am-margin-top-0">
			    <li className="am-text-sm"><span className="am-fl yf-bg-red yf-text-bg-yq am-text-center am-margin-right-xs yf-text-white">1</span>您在汇款时，为方便查询核对，请充整数，如501元、503元。</li>
			    <hr data-am-widget="divider"className="am-divider am-divider-dotted" />
			    <li className="am-text-sm"><span className="am-fl yf-bg-red yf-text-bg-yq am-text-center am-margin-right-xs yf-text-white">2</span>汇款完成后，请填写汇款信息或致电<strong className="yf-text-red am-text-sm">0571-87119797&nbsp;17826802022</strong>，告知您的汇款金额和用户名，工作人员手动帮您充值。</li>
			    <hr data-am-widget="divider" className="am-divider am-divider-dotted" />
			    <li className="am-text-sm"><span className="am-fl yf-bg-red yf-text-bg-yq am-text-center am-margin-right-xs yf-text-white">3</span>凡通过应急账户汇款的，表示您已阅读并同意<Link to="agreement" className="yf-text-blue">《一富财经G币购买使用协议》</Link></li>
			  </ul>
			 </Container>

       
      </div>
    );
  }

});

export default PayOffline;