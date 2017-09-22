import React from 'react';
import {
  render,
} from 'react-dom';
import {
  Router,
  Route,
  IndexRoute,
  hashHistory,
} from 'react-router';
import {
  Dialog,
} from './components';
import {
  Modal,
  Weixin,
} from './utils';

const App = React.createClass({
  propTypes: {
    children: React.PropTypes.element.isRequired,
  },

  componentWillMount() {
    Weixin.initJssdk();

    // 运营需求，如果首次进入页面不是首页，后退时不能关闭，需要跳到首页
    if(this.props.location.pathname !== "/") {
      history.replaceState({}, "首页", location.pathname);
      history.pushState({}, "首页", location.pathname + "#" + this.props.location.pathname);
    }
  },

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  },
});

//弹窗和主程序分离，优先渲染
const DialogInstance = React.createClass({
  componentDidMount() {
    //初始化全局弹窗
    Modal.setDialog(this.refs.dialog);
  },

  render() {
    return (
      <Dialog ref="dialog" />
    );
  },
});

//pages
import {
  Home,
  Agreement,

  //room
  Room,
  RoomIndex,
  RoomList,
  RoomHistory,
  RoomTopic,
  RoomTopicLive,
  RoomTopicChat,
  RoomTopicPaper,
  RoomTopicVote,
  RoomTopicGift,

  //cjg
  Cjg,
  CjgList,
  CjgDetail,

  //vip
  Vip,
  VipList,
  VipDetail,
  VipTopic,
  VipTopicLive,
  VipTopicChat,
  VipTopicRule,
  VipTopicService,

 

  //user
  User,
  My,
  Login,
  Register,
  Forget,
  Invite,
  PayLive,
  PayLiveDetail,
  //user/acount
  Account,
  Avatar,
  Area,
  Password,
  Phone,
  Sex,
  Job,
  CapitalScale,
  Sign,
  Bill,
  Balance,
  Voucher,
  //user/message
  Message,
  MessageDetail,
  SendMessage,
  //user/pay
  Pay,
  PayOffline,
  PayWeixin,
  Recharge,

  Test,
} from './pages';

const routes = (
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="agreement" component={Agreement} />
      <Route path="test" component={Test} />
      <Route path="room" component={Room}>
        <IndexRoute component={RoomIndex} />
        <Route path="list" component={RoomList} />
        <Route path="history/:teacher_id" component={RoomHistory} />
        <Route path="topic/:id" component={RoomTopic}>
          <IndexRoute component={RoomTopicLive} />
          <Route path="chat" component={RoomTopicChat} />
          <Route path="paper" component={RoomTopicPaper} />
          <Route path="vote" component={RoomTopicVote} />
          <Route path="gift" component={RoomTopicGift} />
        </Route>
      </Route>
      <Route path="cjg" component={Cjg}>
        <IndexRoute component={CjgList} />
        <Route path="list/:teacher_id" component={CjgList} />
        <Route path="detail/:id" component={CjgDetail} />
      </Route>
      <Route path="vip" component={Vip}>
        <IndexRoute component={VipList} />
        <Route path="list/:teacher_id" component={VipList} />
        <Route path="detail/:id" component={VipDetail} />
        <Route path="topic/:id" component={VipTopic}>
          <IndexRoute component={VipTopicLive} />
          <Route path="chat" component={VipTopicChat} />
          <Route path="rule" component={VipTopicRule} />
          <Route path="service" component={VipTopicService} />
        </Route>
      </Route>
      <Route path="user" component={User}>
        <IndexRoute component={My} />
        <Route path="login" component={Login} />
        <Route path="register(/:invite)" component={Register} />
        <Route path="forget" component={Forget} />

        <Route path="account" component={Account} />
        <Route path="account/avatar" component={Avatar} />
        <Route path="account/area" component={Area} />
        <Route path="account/password" component={Password} />
        <Route path="account/phone" component={Phone} />
        <Route path="account/sex" component={Sex} />
        <Route path="account/job" component={Job} />
        <Route path="account/capital-scale" component={CapitalScale} />
        <Route path="account/sign" component={Sign} />

        <Route path="message/list/:type" component={Message} />
        <Route path="message/detail/:id" component={MessageDetail} />
        <Route path="message/send" component={SendMessage} />
        <Route path="pay-live" component={PayLive} />
        <Route path="pay-live-detail/:id" component={PayLiveDetail} />
        <Route path="invite" component={Invite} />
        <Route path="bill" component={Bill} />
        <Route path="balance" component={Balance} />
        <Route path="voucher" component={Voucher} />
        
        <Route path="pay" component={Pay} />
        <Route path="pay-offline" component={PayOffline} />
        <Route path="pay-weixin" component={PayWeixin} />
        <Route path="recharge" component={Recharge} />
      </Route>
    </Route>
  </Router>
);

document.addEventListener('DOMContentLoaded', () => {
  render(<DialogInstance />, document.getElementById('dialog'));
  render(routes, document.getElementById('root'));
});
