import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {
  Link,
} from 'react-router';
import {
  Header,
} from 'amazeui-react';
import { Weixin } from '../utils';

const Top = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },

  propTypes: {
    title: React.PropTypes.string,
    link: React.PropTypes.string,
  },

  getDefaultProps() {
    return {
      title: '',
      link: '',
      isShow: !Weixin.isEnable(),
      shareTitle: "一富财经，股市直播的领军者——",
      shareLink : location.origin + location.pathname + "?t=" + new Date().getTime() + location.hash,
      shareImgUrl : location.origin + location.pathname + "i/weixin-logo.png",
      shareDesc: "名家高手免费股市直播，大盘解析，个股答疑",
    };
  },

  componentDidMount() {
    this.changeTitle(this.props.title);
    var dom = ReactDOM.findDOMNode(this);
    $('#root').css('paddingTop', $(dom).height());
    wx.ready(() => {
      wx.onMenuShareTimeline({
        title: this.props.shareTitle + this.props.title, // 分享标题
        link: this.props.shareLink, // 分享链接
        imgUrl: this.props.shareImgUrl, // 分享图标
        success: function () {},
        cancel: function () {}
      });

      wx.onMenuShareAppMessage({
        title: this.props.shareTitle + this.props.title, // 分享标题
        desc: this.props.shareDesc, // 分享描述
        link: this.props.shareLink, // 分享链接
        imgUrl: this.props.shareImgUrl, // 分享图标
        //type: '', // 分享类型,music、video或link，不填默认为link
        //dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {},
        cancel: function () {}
      });
    });
    
  },

  componentWillUpdate: function(nextProps, nextState) {
    if (this.props.title !== nextProps.title) {
      this.changeTitle(nextProps.title);
    }  
  },

  componentWillUnmount() {
    $('#root').css('paddingTop', '');
  },

  //修改title黑科技，兼容ios
  changeTitle(title) {
    var $body = $('body');
    document.title = title;
    var $iframe = $('<iframe src="i/none.png"></iframe>');
    $iframe.on('load',function() {
      setTimeout(function() {
          $iframe.off('load').remove();
      }, 0);
    }).appendTo($body);
  },

  render() {
    if (this.props.isShow) {
      const props = {
        title: this.props.title,
        className: "yf-bg-red am-header-fixed",
        data: {
          left: [
            {
              link: this.props.link, 
              icon: 'chevron-left',
              onSelect: (nav, e) => {
                if (!nav.link) {
                  e.preventDefault();
                  this.context.router.goBack();
                }
              },
            }
          ],
        }
      };
      return (
        <Header {...props} />
      );
    } else {
      return <div />;
    }
  }
});

export default Top;
