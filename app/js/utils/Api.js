import $ from 'jquery';
import Modal from './Modal';
import Constant from './Constant';
import Users from '../models/Users';
import Jwt from 'jwt-simple';
import { hashHistory } from 'react-router';

$.ajaxSetup({
  dataType: 'json',
  crossDomain: true,
  ContentType: "application/json",
  beforeSend: xhr => {
    if (Api.timer) {
      clearTimeout(Api.timer);
    }
    Api.timer = setTimeout(() => {
      Modal.loading();
    }, 1000);
    xhr.setRequestHeader("Authorization", Api.getAuthorization());
  }
});

const Payload = {
  "iss": "YFCJ",
  "aud": "http://wxapi.yifucj.com",
  "nbf": 0,
  "exp": 0,
};

const Api = {
  timer : null,

  getAuthorization() {
    let t = parseInt(new Date().getTime()/1000);
    Payload.nbf = t - 60;
    Payload.exp = t + 60;
    let authorization = Jwt.encode(Payload, Constant.JWT_SECRET);
    return authorization;
  },

  get(api, data, callback, errorCallback) {
    let apiUrl = Constant.API_URL + api;
    let xhr = $.get(apiUrl, data);
    xhr.then(this.success.bind(this, callback, errorCallback), this.error.bind(this, errorCallback));
    return xhr;
  },

  post(api, data, callback, errorCallback) {
    let apiUrl = Constant.API_URL + api;
    return $.post(apiUrl, data).then(this.success.bind(this, callback, errorCallback), this.error.bind(this, errorCallback));
  },

  success(callback, errorCallback, resp) {
    if (this.timer)
      clearTimeout(this.timer);

    if (resp.error > 0) {
      if (resp.error == 100) {
        Users.logout();
      }
      Modal.alert(resp.message, () => {
        if (resp.error == 100) {
          hashHistory.push({pathname: "user/login", state: { "backurl" : this.getPath()}});
        } else {
          if (errorCallback) {
            errorCallback(resp.error, resp.message);
          }
        }
      });
    } else {
      Modal.close();
      callback(resp.data);
    }
  },

  error(callback, xhr, status, message) {
    if (this.timer)
      clearTimeout(this.timer);

    if (status === 'abort') return;

    Modal.alert(message, () => {
      if (callback) {
        callback(999, message);
      }
    });
  },

  // 通过location 获取router path
  // 和 PayLink 重用
  // todo 单独放到功能类库
  getPath() {
    return location.hash.slice(2, location.hash.indexOf('?'));
  },
}

export default Api;
