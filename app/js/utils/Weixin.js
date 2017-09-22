import Api from './Api';
import { Users } from '../models';
import { Cache } from '../utils';

const Weixin = {
  appId : null,
  url: null,

  initOpenId() {
    if (Users.isLogin()) {
      return true;
    }
    if (!this.appId) {
      console.log("appId 不存在");
      return false;
    }
    if (!Users.getOpenid() && this.appId) {
      window.location.href = this.getCodeUrl();
    }
  },

  getCodeUrl() {
    let redirect_uri = encodeURIComponent(location.origin + location.pathname + "code.html");
    let state = encodeURIComponent(window.location.hash);
    return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.appId}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_base&state=${state}#wechat_redirect`;
  },

  getOpenId() {
    return Cache.get("openId") || false;
  },

  getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
    var r = window.location.search.substr(1).match(reg);
    if (r!=null) return (r[2]); return null;
  },

  isEnable(){
    var ua = window.navigator.userAgent.toLowerCase();
    return ua.match(/MicroMessenger/i) == 'micromessenger';
  },

  initJssdk() {
    if (!this.isEnable()) {
      return false;
    }
    Api.get('Weixin/Auth', {}, resp => {
      this.appId = resp.appId;
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: resp.appId, // 必填，公众号的唯一标识
        timestamp: resp.timestamp, // 必填，生成签名的时间戳
        nonceStr: resp.noncestr, // 必填，生成签名的随机串
        signature: resp.signature,// 必填，签名，见附录1
        jsApiList: [
          'checkJsApi',
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
          'onMenuShareQQ',
          'onMenuShareWeibo',
          'onMenuShareQZone',
          'hideMenuItems',
          'showMenuItems',
          'hideAllNonBaseMenuItem',
          'showAllNonBaseMenuItem',
          'chooseImage',
          'previewImage',
          'uploadImage',
          'downloadImage',
          'getNetworkType',
          'openLocation',
          'getLocation',
          'hideOptionMenu',
          'showOptionMenu',
          'closeWindow',
          'scanQRCode',
          'chooseWXPay',
        ], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });
    });

    wx.ready(() => {
      this.url = location.hash;
      this.initOpenId();
    });

    wx.error(res => {
      // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
      console.log(res);
    });
  },
}

export default Weixin;