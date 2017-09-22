import React from 'react';
import{
	 Container,
	 Divider,
} from 'amazeui-react' ;
const Rule = React.createClass({  
  
  render() {
    return (
      <div>
        <Container>
            <p className="am-text-md am-text-center am-margin-top-xl yf-font-bold">VIP直播室播主守则</p>
            <p className="am-text-xs yf-text-indent am-padding-0 am-margin-0">特训班播主资格可以平台常规直播室播主身份申请，经一富财经后台审核，达到开播条件者，承诺以下约定者，可给予开启特训直播室。</p>
            <hr data-am-widget="divider" className="am-divider am-divider-dotted" />
            <ul className="am-text-md am-padding-bottom-xs am-margin-0 am-padding-left-0 am-padding-right-0">
				<li className="am-text-sm"><span className="am-fl yf-bg-red yf-text-bg-yq am-text-center am-margin-right-xs yf-text-white">1</span>特训班播主不得在一富财经发布不符合法律法规、行业行规、社会道德及侵害一富财经权益的各自言论，一旦触及，一富财经有权关闭乙方特训班并删除相关内容；</li>
				<hr data-am-widget="divider" className="am-divider am-divider-dotted" />
				<li className="am-text-sm"><span className="am-fl yf-bg-red yf-text-bg-yq am-text-center am-margin-right-xs yf-text-white">2</span>特训班内严禁发布色情淫秽、血腥暴力图片、敏感政治信息、政治段子、重要领导人信息；禁止发布与一富财经无关的其他广告、信息、产品及未经网站同意，不符合网站规定的内容；</li>
				<hr data-am-widget="divider"  className="am-divider am-divider-dotted" />
				<li className="am-text-sm"><span className="am-fl yf-bg-red yf-text-bg-yq am-text-center am-margin-right-xs yf-text-white">3</span>不得采用讽刺、诋毁、谩骂等不文明行为贬损其他播主，开展恶性竞争；</li>
				<hr data-am-widget="divider"  className="am-divider am-divider-dotted" />
				<li className="am-text-sm"><span className="am-fl yf-bg-red yf-text-bg-yq am-text-center am-margin-right-xs yf-text-white">4</span>特训班播主在特训班直播室内，不得明示、暗示私人联系方式，如手机号、Q号（昵称）、QQ群、微信号等、外网博客、网址、微博等；</li>
				<hr data-am-widget="divider"  className="am-divider am-divider-dotted" />
				<li className="am-text-sm"><span className="am-fl yf-bg-red yf-text-bg-yq am-text-center am-margin-right-xs yf-text-white">5</span>特训班播主不得以任何方式向VIP用户做出投资必赚或保证最低投资收益的承诺，不得夸大、虚报过往业绩、自身能力而进行诱导性的宣传；</li>
				<hr data-am-widget="divider"  className="am-divider am-divider-dotted" />
				<li className="am-text-sm"><span className="am-fl yf-bg-red yf-text-bg-yq am-text-center am-margin-right-xs yf-text-white">6</span>特训班播主在VIP直播室正常知道时间内，应快速对特训班用户的提问、质疑等做出答复，第一时间解决用户问题；</li>
				<hr data-am-widget="divider"  className="am-divider am-divider-dotted" />
				<li className="am-text-sm"><span className="am-fl yf-bg-red yf-text-bg-yq am-text-center am-margin-right-xs yf-text-white">7</span>特训班播主不得代替特训班用户进行操作，或私下与用户约定分享投资收益或分担投资损失等有损用户利益的行为；</li>
		    </ul>
        </Container>
      </div>
    );
  },
});

export default Rule;
