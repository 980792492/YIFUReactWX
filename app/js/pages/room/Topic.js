import React from 'react';
import ReactDOM from 'react-dom';
import {
  withRouter,
} from 'react-router';
import $ from 'jquery';
import moment from 'moment';
import Fingerprint2 from 'fingerprintjs2';
import {
  Nav,
  NavItem,
  PopoverTrigger,
  Popover,
} from 'amazeui-react';
import {
  Top,
  Icon,
} from '../../components';
import {
  Users,
} from '../../models';
import {
  Api,
  Ws,
  Constant,
  Modal,
} from '../../utils';

const TopicNav = withRouter(
  React.createClass({
    contextTypes: {
      teacher: React.PropTypes.object,
      isHistory:React.PropTypes.bool,
    },

    getInitialState() {
      return {
        data: [
          {title: '直播', href: ''},
          {title: '互动', href: '/chat'},
          {title: '纸条', href: '/paper'},
          {title: '投票', href: '/vote'},
          {title: '送礼', href: '/gift'},
        ],
      };
    },

    componentDidMount() {
      //tabs导航切换顶部悬浮效果 
      let tabs = ReactDOM.findDOMNode(this),
          top = $('#root').css('paddingTop');
      $(tabs).css('top', top);
      $('#root').css('paddingTop', "+=" + $(tabs).height());

      if (this.context.isHistory) {
        this.setState({
          data: [
            {title: '股市直播', href: ''},
            {title: '同学互动', href: '/chat'},
            {title: '纸条问答', href: '/paper'},
          ]
        });
      }
    },

    componentWillUnmount() {
      //tabs导航切换顶部悬浮效果 可考虑mixin
      let tabs = ReactDOM.findDOMNode(this);
      $('#root').css('paddingTop', '-=' + $(tabs).height());
    },

    handlerTabs(tab, e) {
      this.props.router.replace(tab);
    },

    renderPopover(){
      if(!this.context.teacher) {
        return;
      }

      const lists = [
        {link: "cjg/list", icon: "cjg", text: "藏金阁"},
        {link: "vip/list", icon: "txb", text: "特训班"},
        {link: "room/history", icon: "wqzb", text: "历史直播"},
      ];

      let data = (
        <Popover>
          <ul className="am-margin-0 yf-text-center am-padding-0 yf-room-xiala-ul">
            {
              lists.map((item, key) => {
                let link = `#/${item.link}/${this.context.teacher.id}`;
                return (
                  <li key={key} className="yf-room-xiala-li yf-room-line-height am-padding-top-sm">  
                    <a href={link} className="am-link-muted yf-display-block">
                      <Icon className="am-text-lg yf-text-white" icon={item.icon} />
                      <div className="am-text-xs yf-text-white">{item.text}</div>
                    </a> 
                  </li>
                );
              })
            }
          </ul>
        </Popover>
      );
      
      return (
        <PopoverTrigger
          trigger="click" // 设置触发方式
          amSize="sm" // 设置 popover 大小
          placement="bottom"
          popover={data}>
          <NavItem><a><Icon className="am-text-danger" icon="gd" /></a></NavItem>
        </PopoverTrigger>
      )
    },

    render(){
      return (
        <Nav tabs justify className="am-margin-0 yf-tabs yf-room-tabs yf-bg-gray am-width-topbar-fixed-top" ref="tabs">
          {this.state.data.map((item, key) => {
            let link = `/room/topic/${this.props.params.id}${item.href}`;
            return <NavItem key={key} active={link === this.props.location.pathname} linkComponent="a" onClick={this.handlerTabs.bind(this, link)}>{item.title}</NavItem>
          })}
          {this.renderPopover()}
        </Nav>
      );
    },
  })
);

const Topic = React.createClass({
  reCount: 100,
  timer: null,

  contextTypes: {
    router: React.PropTypes.object
  },

  getInitialState() {
    return {
      title: '',
      messageData: [],
      commentData: [],
      inviteTeacherData: [],
      teacher: {},
      topicId: 0,
      roomId: 0,
      isTeacher: false,
      isInviteTeacher: false,
      createDate: "",
      isHistory: this.props.params.id && this.props.params.id.substring(0, 2) === 't_',
    };
  },

  childContextTypes: {
    messageData: React.PropTypes.array,
    commentData: React.PropTypes.array,
    inviteTeacherData: React.PropTypes.array,
    teacher: React.PropTypes.object,
    topicId: React.PropTypes.number,
    roomId: React.PropTypes.number,
    isTeacher: React.PropTypes.bool,
    isInviteTeacher: React.PropTypes.bool,
    createDate: React.PropTypes.string,
    isHistory: React.PropTypes.bool,
    switchData: React.PropTypes.func,
    setComment: React.PropTypes.func,
    setMessage: React.PropTypes.func,
    loadPayLiveData: React.PropTypes.func,
  },

  getChildContext() {
    return {
      messageData: this.state.messageData,
      commentData: this.state.commentData,
      inviteTeacherData: this.state.inviteTeacherData,
      teacher: this.state.teacher,
      topicId: this.state.topicId,
      roomId: this.state.roomId,
      isTeacher: this.state.isTeacher,
      isInviteTeacher: this.state.isInviteTeacher,
      createDate: this.state.CreateDate,
      isHistory: this.state.isHistory,
      switchData: this.switchData,
      setComment: this.setComment,
      setMessage: this.setMessage,
      loadPayLiveData: this.loadPayLiveData,
    };
  },

  componentDidMount() {
    if (Users.isLogin() && !Users.getData()) {
      Users.getUserInfo(() => {
        this.loadData();
      });
    } else {
      this.loadData();
    }
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

  loadData() {
    //数据，用ajax获取
    let api, params;
    if (this.state.isHistory) {
      api = "Room/HistoryTopic";
      params = {topic_id: this.props.params.id.substring(2, this.props.params.id.length)}
    } else {
      api = "Room/Topic";
      params = {id : this.props.params.id}
    }
    Api.get(api, params, resp => {
      let data = {
        title: resp.TeacherName,
        messageData: resp.Message,
        commentData: resp.Comment, 
        inviteTeacherData: resp.InviteTeacher || [],
        topicId: resp.TopicId*1,
        roomId: resp.RoomId*1,
        createDate: resp.CreateDate,
        // isHistory:resp.Status == 13,
        teacher: {
          id: resp.TeacherId,
          name: resp.TeacherName,
          head: resp.HeadImg,
        },
        paylive: null,  // 付费观点数据
      };

      // 获取付费观点数据
      this.loadPayLiveData(data.topicId);

      //判断用户角色
      if (Users.isLogin() && !this.state.isHistory) {
        data.isTeacher = resp.TeacherId == Users.getData().Id;
        if (!data.isTeacher) {
          for (var i = 0; i < resp.InviteTeacher.length; i++) {
            if (resp.InviteTeacher[i].TeacherId == Users.getData().Id) {
              data.isInviteTeacher = true;
              break;
            }
          }
        }
      }
      this.setState(data);
      //链接ws
      this.startWs();
      //启用人气定时器
      if (!this.state.isHistory) {
        new Fingerprint2().get((result, components) => {
          this.startOnline(result, data.topicId);
        });
      }
    });

  },

  loadPayLiveData(topic_id) {
    if (Users.isLogin()) {
      Api.get('EncryptedView/Topic', {topicId: topic_id, token: Users.getToken()}, resp => {
        this.setState({
          paylive: resp,
        })
      });
    }
  },

  switchUbb(text) {
    if (text === undefined || text === null || text === '') return text; 

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
      switch (data.Type*1) {
        case  1 :
          // 老师发言
          if (/^<div class="room_LiveRoom_Quote">/.test(data.Body)) {
            data.Body.replace(/^<div class="room_LiveRoom_Quote">(<a href=".+" target="_blank">(.+)：<\/a> )?(.+)<\/div>(.*)$/g, function(m, s1, s2, s3, s4){
              data.QuoteUserName = s2 || "";
              data.QuoteBody = s3 || "";
              data.Body = s4 || "";
            });
            data.idx = 2;
          } else {
            data.idx = 1;
          }
          data.CreateDate = moment(data.CreateDate).format("HH:mm:ss");
          data.QuoteBody = this.switchUbb(data.QuoteBody);
          data.Body = this.switchUbb(data.Body);
          break;
        case  2 : 
          //纸条
          data.idx = 7;
          data.CreateDate = moment(data.CreateDate).format("HH:mm:ss");
          break;
        case 3 :
          //投票
          // data.Body.replace(/^<dd>.+给<span>(.+)<\/span>/g, function(m, s1){
          //   data.VoteUserName = s1;
          // });
          data.idx = 6;
          data.CreateDate = moment(data.CreateDate).format("HH:mm:ss");
          break;
        case 4 :
          //送礼
          data.idx = 8;
          data.CreateDate = moment(data.CreateDate).format("HH:mm:ss");
          break;
        case 5 :
          //系统公告
          data.idx = 10;
          data.Body = this.switchUbb(data.Body);
          data.CreateDate = moment(data.CreateDate).format("HH:mm:ss");
          break; 
        case 6 : 
          //同学互动
          if (data.ReplyId >= 0)
            data.idx = 4;
          else 
            data.idx = 3;
          data.CreateDate = moment(data.CreateDate).format("HH:mm:ss");
          data.ReplyComment = this.switchUbb(data.ReplyComment);
          data.Body = this.switchUbb(data.Body);
          break;
        case 7 : 
          //藏金阁
          data.idx = 9;
          data.CreateDate = moment(data.CreateDate, "MM月DD日 HH:mm:ss").format("HH:mm:ss");
          break; 
       
        case 9 : 
          //博文todo
          console.log("博文 todo");
          break;
        case 10 :
          //付费观点
          data.Body = JSON.parse(data.Body);
          data.CreateDate = moment(data.CreateDate).format("HH:mm:ss");
          data.Body.Content = this.switchUbb(data.Body.Content);

          let status = 0;
          if (this.state.isTeacher) {
            status = 1;
          } else if (this.state.paylive) {
            if (this.state.paylive.month == 1 || $.inArray(data.Body.ViewId, this.state.paylive.single) !== -1) {
              status = 1;
            }
          }
          if (status) {
            // 已购买
            data.idx = 11;
          } else {
            if (data.Body.Status == 1) {
              // 已下架
              data.idx = 13;
            } else {
              // 销售中
              data.idx = 12;
            } 
          }

          break;
        default : 
          console.log(data);
          break;
      }
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
          user : Users.isLogin() ? Users.getData().Id : new Date().getTime()/1000,
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
          // console.log(data);
          if (Users.isLogin() && data.UserId && data.UserId == Users.getData().Id) {
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
              if (data.Update && data.Update == 1) {
                let messageData = _this.state.messageData.map(item => {
                  if (item.Index == data.MIndex) {
                    item.Body = data.Body;
                  }
                  return item;
                });
                _this.setMessage(messageData);
              } else {
                _this.setMessage(_this.state.messageData.concat(data));
              }
          }
        }
      },
      onClose() {
        console.log("您已失去和直播室的链接");
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

  startOnline(guid, topicId) {
    const timer = () => {
      if (guid && topicId) {
        Api.post('Popularity/OnLineStatistics', {
          guid: guid,
          token: Users.getToken() || undefined,
          topic_id: topicId,
        }, () => {});
      }
    };
    timer();
    this.timer = window.setInterval(timer, 600 * 1000);
  },

  render() {
    return (
      <div>
        <Top title={this.state.title + "的直播室"} />
        <TopicNav {...this.props} />
        {this.props.children}
      </div>
    );
  },
});

export default Topic;
