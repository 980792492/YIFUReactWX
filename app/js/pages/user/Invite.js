import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import {
  List,
  ListItem,
  Nav,
  NavItem,
  Container,
  Panel,
  Divider,
  AvgGrid,
  Input
} from 'amazeui-react';
import { Users } from '../../models';
import {
  AuthMixin,
  Icon,
  BgColorMixin,
  Top,
} from '../../components';
import {
  Api,
} from '../../utils';


const Invite = React.createClass({
  mixins: [AuthMixin, BgColorMixin],

  contextTypes: {
    router: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
      title: "一富财经，股市直播的领军者",
      link: location.origin + location.pathname + "?t=" + new Date().getTime(),
      desc: "名家高手免费股市直播，大盘解析，个股答疑",
      imgUrl: location.origin + location.pathname + "i/weixin-logo.png",
    };
  },

  getInitialState() {
    return {
      data: [],
      currentTab: this.props.location.state,
      showOverlay: false,
    };
  },

  componentDidMount() {
    this.loadData(this.props.location.state);
  },

  componentDidUpdate(nextProps, nextState) {
    if (nextProps.location.state !== this.state.currentTab) {
      this.loadData(nextProps.location.state);
    }
  },

  loadData(tab) {
    this.setState({
      currentTab: tab,
      data: [],
    });
    if (this.props.location.state === 'my') {
      Api.get('User/InviteUser', {
        token: this.token,
        page: 1,
        num: 99,
      }, resp => {  
        this.setState({
          data: resp.InviteUsers, 
        }); 
      });  
    }
  },

  handlerTab(tab, e) {
    let location = this.props.location;
    location.state = tab;
    this.context.router.replace(location);
  },

  handlerClick(e) {
    e.preventDefault();
    this.setState({
      showOverlay: true,
    });
    let link = this.props.link + this.context.router.createHref({pathname: `user/register/${this.user.Id}`});
    wx.ready(() => {
      wx.onMenuShareTimeline({
        title: this.props.title, // 分享标题
        link: link, // 分享链接
        imgUrl: this.props.imgUrl, // 分享图标
        success: () => { 
          // 用户确认分享后执行的回调函数
          // 如果需要分享获取积分，可以在这边调用
          // alert("分享成功！");
          this.setState({
            showOverlay: false, 
          });
        },
        cancel: function () { 
            // 用户取消分享后执行的回调函数
            // alert("分享取消");
        }
      });

      wx.onMenuShareAppMessage({
        title: this.props.title, // 分享标题
        desc: this.props.desc, // 分享描述
        link: link, // 分享链接
        imgUrl: this.props.imgUrl, // 分享图标
        //type: '', // 分享类型,music、video或link，不填默认为link
        //dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: () => { 
          // 用户确认分享后执行的回调函数
          this.setState({
            showOverlay: false, 
          });
        },
        cancel: function () { 
            // 用户取消分享后执行的回调函数
        }
      });
    });
  },

  handlerClickOverlay() {
    this.setState({
      showOverlay: false,
    });
  },

  renderOverlay() {
    if (this.state.showOverlay) {
      return (
        <div onClick={this.handlerClickOverlay}>
          <div id="zhezhao" className="yf-zzc"></div>
          <div id="zhezhao-text" className="am-padding-lg yf-zzc-image" onClick={this.handlerClickOverlay}>
            <img src="i/zhixiang.png" className="am-fr am-img-responsive" width="80" height="120" />
            <img src="i/tishi.png" className="am-fr am-margin-top-lg am-img-responsive " />
          </div>
        </div>
      );
    }
  },

  renderList() {
    if(this.props.location.state !== 'my'){
      return(  
        <Container className="am-padding-top-sm">
          <p className="am-text-md am-text-center am-margin-top-xl">每成功邀请一个好友注册就可得<span className="yf-text-red">5G币</span>奖励！</p>
          <Input type="submit" value="分享链接" amStyle="primary" className="am-margin-top yf-bg-red yf-text-white" block onClick={this.handlerClick} />
          {this.renderOverlay()}
        </Container>
      )
    } else {
      return(
        <div >
          <Container >
              <p className="am-text-sm am-margin-top-sm am-margin-bottom-sm am-padding-left-sm">您已成功邀请{this.state.data.length}个好友注册！</p>
              <List border static className="am-margin-0">
              {this.state.data.map(function(item,i) {
                return(
                  <ListItem  className="am-link-muted" key={i}>
                    {item.UserName}<span className="am-fr ">{item.RegTime}</span>
                  </ListItem>  
                ) 
              })} 
              </List>
          </Container>
        </div>  
      ) 
    } 
  },
  
  render() {
    return (
      <div>
        <Top title="邀请好友" />
        <Nav tabs justify className="am-margin-0 yf-tabs am-text-sm">
          <NavItem active={this.props.location.state !== 'my'} linkComponent="a" onClick={this.handlerTab.bind(this, '') }>邀请好友</NavItem>
          <NavItem active={this.props.location.state === 'my'} linkComponent="a" onClick={this.handlerTab.bind(this, 'my')}>我的邀请</NavItem>
        </Nav>
        <Container className="am-padding-left-0 am-padding-right-0 ">
          {this.renderList()}
        </Container>
       
      </div>
    );
  },
});
 
export default Invite;



