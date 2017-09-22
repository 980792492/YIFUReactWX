import React from 'react';
import {
  Container,
  Image,
  Thumbnails,
  Thumbnail,
  Button,
} from 'amazeui-react';
import {
  Top,
  AuthMixin,
} from '../../../components';
import {
  Api,
  Constant,
  Modal,
} from '../../../utils';

const Avatar = React.createClass({
  mixins: [AuthMixin],

  componentDidMount: function() {
    this.setState({
      list: this.getDefaultList(),
      avatar: this.user.HeadImg
    });
    //todo 头像缓存json
    // Api.get('User/Headimg', {}, function(data) {
    //   console.log(data);
    //   this.setState({
    //     list: data,
    //     avatar: this.user.HeadImg
    //   });
    // }.bind(this));
  },

  getInitialState: function() {
    return {
      avatar: '',
      value: '',
      type: 0, //0: 默认头像 1:自定义头像
      list : [],
    };
  },

  handlerClick(url, event) {
    this.setState({
      avatar: Constant.IMG_URL + url,
      value: url,
      type: 0,
    });
  },

  handlerSumbit() {
    if (!this.state.value)
      return false;

    if (this.state.type == 1) {
      //wx上传
      wx.uploadImage({
        localId: this.state.value, // 需要上传的图片的本地ID，由chooseImage接口获得
        isShowProgressTips: 1, // 默认为1，显示进度提示
        success: res => {
          this.doPost(`wx://${res.serverId}`);
        },
        error: () => {
          Modal.alert("上传失败");
        }
      });
    } else {
      this.doPost(this.state.value);
    }
  },

  handlerChoose() {
    wx.ready(() => {
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: res => {
          this.setState({
            avatar: res.localIds[0],
            value: res.localIds[0],
            type: 1,
          });
        }
      });
    });
  },

  getDefaultList() {
    let data = [];
    for (var i = 30; i > 0; i--) {
      data.push({
        id: i,
        url: `tx_0${i<10 ? "0" + i : i}.jpg`,
      });
    }
    return data;
  },

  doPost(data) {
    Api.post('User/Edit', {
      token: this.token,
      headimg: data,
    }, resp => {
      this.context.router.push('/user/account');
    });
  },

  renderList() {
    return this.state.list.map((item, key) => {
      return (
        <Thumbnail key={key} standalone src={Constant.IMG_URL + item.url} onClick={this.handlerClick.bind(this, item.url)} />
      );
    });
  },

  render() {
    return (
      <div>
        <Top title="修改头像" link="#/user/account" />
        <Container className="am-padding-bottom-xl">
          <section className="am-padding-top am-padding-bottom-xl">
            <span className="am-text-sm" style={{position: 'absolute'}}>当前头像</span>
            <div className="am-text-center">
              <Image ref="avatar" src={this.state.avatar} width="100" thumbnail />
            </div>
          </section>
          <Thumbnails sm={4}>
            {this.renderList()}
          </Thumbnails>
          <Button block amStyle="primary" className="yf-bg-gray" onClick={this.handlerChoose}>选择自定义头像</Button>
          <Button block amStyle="primary" className="yf-bg-red" onClick={this.handlerSumbit}>完成</Button>
        </Container>
      </div>
    );
  },
});

export default Avatar;
