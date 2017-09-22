import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import moment from 'moment';
import {
  Nav,
  NavItem,
} from 'amazeui-react';
import {
  Top,
  AuthMixin,
} from '../../components';
import {
  Api,
  Ws,
  Constant,
} from '../../utils';

const TopicNav = React.createClass({
  contextTypes: {
    router: React.PropTypes.object,
  },

  getDefaultProps: function() {
    return {
      data: [
        {title: '观点', href: ''},
        {title: '互动', href: '/chat'},
        {title: '特训班守则', href: '/rule'},
        {title: '客服', href: '/service'},
      ],
    };
  },

  componentDidMount() {
    //tabs导航切换顶部悬浮效果
    let tabs = ReactDOM.findDOMNode(this),
        top = $('#root').css('paddingTop');
    $(tabs).css('top', top);
    $('#root').css('paddingTop', "+=" + $(tabs).height());
  },

  componentWillUnmount() {
    //tabs导航切换顶部悬浮效果 可考虑mixin
    let tabs = ReactDOM.findDOMNode(this);
    $('#root').css('paddingTop', '-=' + $(tabs).height());
  },

  handlerTabs(tab, e) {
    this.context.router.replace(tab);
  },

  render(){
    return (
      <Nav tabs justify className="am-margin-0 yf-tabs yf-vip-tabs yf-bg-lightbrown am-width-topbar-fixed-top" ref="tabs">
        {this.props.data.map((item, key) => {
          let link = `/vip/topic/${this.props.params.id}${item.href}`;
          return <NavItem key={key} active={link === this.props.location.pathname} linkComponent="a" onClick={this.handlerTabs.bind(this, link)}>{item.title}</NavItem>
        })}
      </Nav>
    );
  },
});

const Topic = React.createClass({
  reCount: 100,
  timer: null,

  mixins: [AuthMixin],

  contextTypes: {
    router: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
      pageSize: 20,
    };
  },

  getInitialState() {
    return {
      messageData: [],
      commentData: [],
      teacher: {},
      roomId: 0,
      topicId: 0,
      isTeacher: false,
      isInviteTeacher: false,
    };
  },

  childContextTypes: {
    messageData: React.PropTypes.array,
    commentData: React.PropTypes.array,
    teacher: React.PropTypes.object,
    roomId: React.PropTypes.number,
    topicId: React.PropTypes.number,
    isTeacher: React.PropTypes.bool,
    isInviteTeacher: React.PropTypes.bool,
    switchData: React.PropTypes.func,
    setComment: React.PropTypes.func,
    setMessage: React.PropTypes.func,
  },

  getChildContext() {
    return {
      messageData: this.state.messageData,
      commentData: this.state.commentData,
      teacher: this.state.teacher,
      roomId: this.state.roomId,
      topicId: this.state.topicId,
      isTeacher: this.state.isTeacher,
      isInviteTeacher: this.state.isInviteTeacher,
      switchData: this.switchData,
      setComment: this.setComment,
      setMessage: this.setMessage,
    };
  },

  componentDidMount() {
    //数据，用ajax获取
    Api.get('Vip/Topic', {
      token: this.token,
      id: this.props.params.id,
    }, resp => {
      // console.log(resp);
      let data = {
        messageData: resp.Message,
        commentData: resp.Comment, 
        topicId: resp.TopicId*1,
        roomId: resp.RoomId*1,
        teacher: {
          id: resp.TeacherId,
          name: resp.TeacherName,
        },
        isTeacher: resp.TeacherId == this.user.Id,
        isInviteTeacher: resp.UserType == 0 || resp.UserType == 1,
      };
      this.setState(data);
      //链接ws
      this.startWs();
    }, (error, message) => {
      this.context.router.push(`vip/detail/${this.props.params.id}`);
    });
  },

  componentWillUnmount() {
    //断开ws
    this.reCount = 0;
    this.ws.close();
    //清除定时器
    if (this.timer) {
      window.clearTimeout(this.timer);
    }
  },

  switchUbb(text) {
    if (text === undefined  || text === null || text === '') return text; 
    
    if (/\[@.*@\]/.test(text)) {
      text = text.replace(/\[@(F_[0-9]+)([J|G])@\]/g, (s0, s1, s2) => {
        return `<img class="js-ubb" src="${Constant.UBB_IMG_URL}${s1}.${s2==='J' ? 'jpg' : 'gif'}" />`;
      });
    }
    if (/\[#.*#\]/.test(text)) {
      text = text.replace(/\[#(.+?)#\]/g, (s0, s1) => {
        return `<img class="js-ubb-img am-img-thumbnail" src="${Constant.UPLOAD_IMG_URL}${s1}" />`;
      });
    }
    return text.replace(/href=["'].+?["']/g, "href=\"javascript:;\"");
  },

  //通过元数据识别消息类型，并转换为可以使用的数据结构
  switchData(item) {
    let data = $.extend({}, item);
    // if (!data.isSwitch) {
      //消息类型
      switch (data.Type) {
        case  1 : 
          //老师发言
          if (/^<div class="room_LiveRoom_Quote">/.test(data.Body)) {
            data.Body.replace(/^<div class="room_LiveRoom_Quote"><a href=".+" target="_blank">(.+)：<\/a> (.+)<\/div>(.+)$/g, function(m, s1, s2, s3){
              data.QuoteUserName = s1;
              data.QuoteBody = s2;
              data.Body = s3
            });
            data.idx = 2;
          } else {
            data.idx = 1;
          }
          data.QuoteBody = this.switchUbb(data.QuoteBody);
          data.Body = this.switchUbb(data.Body);
          break;
        case 3 :
          //投票
          data.idx = 6;
          break;
        case 6 : 
          //同学互动
          if (data.ReplyId >= 0)
            data.idx = 4;
          else 
            data.idx = 3;
          data.ReplyComment = this.switchUbb(data.ReplyComment);
          data.Body = this.switchUbb(data.Body);
          break;
        default : 
          // console.log(data);
          break;
      }
      //时间
      data.CreateDate = moment(data.CreateDate).format("MM/DD HH:mm:ss");
      // data.isSwitch = true;
    // }
    return data;
  },

  setMessage(data) {
    this.setState({
      messageData: data,
    });
  },

  setComment(data) {
    this.setState({
      commentData: data,
    });
  },

  //开启websocket长链接，并绑定websocket事件
  startWs() {
    var _this = this;
    //初始化ws
    this.ws = Ws.init({
      onOpen() {
        console.log("连接直播室成功");
        _this.reCount = 100;
        let data = {
          t : "login",
          topic : _this.state.topicId,
          user : _this.user.Id,
        };
        this.send(JSON.stringify(data));
      },
      onMessage(event) {
        let resp = JSON.parse(event.data);
        if (resp.type === 'tip') {
          console.log(resp.body);
          return;
        }

        if (resp.type === 'data') {
          let data = resp.body;
          if (data.UserId && data.UserId == _this.user.Id) {
            return;
          }

          switch(data.Type) {
            case 6 : 
              //评论
              _this.setComment(_this.state.commentData.concat(data));
              break;

            case 998 : 
              //删除观点
              if (data.DelIndex >= 0) {
                for (var i = 0; i < _this.state.messageData.length; i++) {
                  if(_this.state.messageData[i].Index == data.DelIndex) {
                    _this.state.messageData.splice(i, 1);
                    _this.setMessage(_this.state.messageData);
                    break;
                  }
                }
              }
              break;

            case 999 : 
              //删除评论
              if (data.DelIndex >= 0) {
                for (var i = 0; i < _this.state.commentData.length; i++) {
                  if(_this.state.commentData[i].Index == data.DelIndex) {
                    _this.state.commentData.splice(i, 1);
                    _this.setComment(_this.state.commentData);
                    break;
                  }
                }
              }
              break;

            default :
              //观点 
              _this.setMessage(_this.state.messageData.concat(data));
          }
        }
      },
      
      onClose() {
        console.log("您已失去和vip直播室的连接");
        //如果还在直播室，5秒重新连接，重连次数超过99次，停止
        if (_this.reCount > 0) {
          Modal.alert("您已失去和直播室的连接", () => {
            location.reload();
          }, "重新连接");
          // _this.timer = window.setTimeout(() => {
          //   _this.reCount --;
          //   console.log(`第${100 - _this.reCount}次重连`);
          //   _this.ws = Ws.connect();
          // }, 2000);
        }
      },
    });
  },

  render() {
    return (
      <div>
        <TopicNav {...this.props} />
        {this.props.children}
      </div>
    );
  },
});

export default Topic;
