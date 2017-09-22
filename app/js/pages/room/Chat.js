import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import moment from 'moment';
import {
  Topbar,
  Divider,
} from 'amazeui-react';
import { Users } from '../../models';
import {
  Icon,
  MyScroll,
  SendButton,
} from '../../components';
import {
  Api,
  Modal,
} from '../../utils';

const UserIdentityMap = {
  1: 'yellow',
  2: '#ff120c',
  3: '#029aff',
  4: '#ad02fd',
};

const Chat = React.createClass({
  comment: [],
  replyIndex: 0,
  topIndex: 0,

  contextTypes: {
    router: React.PropTypes.object,
    commentData: React.PropTypes.array,
    topicId: React.PropTypes.number,
    roomId: React.PropTypes.number,
    switchData: React.PropTypes.func,
    createDate: React.PropTypes.string,
    isHistory: React.PropTypes.bool,
    setComment: React.PropTypes.func,
  },

  getDefaultProps: function() {
    return {
      pageSize: 20,
    };
  },

  componentDidMount() {
    this.handlerUpdate();
    this.refs.scroll.checkLoadingImg();
  },

  componentDidUpdate(prevProps, prevState, preContext) {
    this.handlerUpdate();
    this.refs.scroll.checkLoadingImg();
  },

  componentWillUnmount() {
    //底部发言区域浮动
    $('#root').css('paddingBottom', 0);
  },

  handlerUpdate() {
    //底部发言区域浮动
    let sendTopbar = ReactDOM.findDOMNode(this.refs.sendTopbar);
    $('#root').css('paddingBottom', $(sendTopbar).height());
    this.refs.scroll.fixHeight();
    this.refs.scroll.refresh();
  },

  handlerReply(index, e) {
    if (this.context.isHistory) return;

    // console.log("触发回复事件");
    
    let data = this.comment[index];
    this.replyIndex = index;
    $(this.refs.sendButton.getContent()).val('回复 @' + data.UserName + ':').focus();
  },

  handlerSend(content, attachment) {
    if (!Users.isLogin()) {
      Modal.confirm('您还未登录！', () => {
        this.context.router.push({pathname: "user/login", state: { "backurl" : this.props.location.pathname}});
      }, null, "登录", "取消");
      return;
    }

    if (content.value.length > 0 || attachment.length > 0) {
      let data = {
        token: Users.getToken(),
        room_id: this.context.roomId,
        topic_id: this.context.topicId,
        content: content.value,
        reply_index: -1,
      };

      //发送回复处理
      if (content.value.length > 0) {
        if (/^回复 @(.+):/.test(content.value) && this.comment[this.replyIndex]) {
          data.reply_index = this.replyIndex;
          data.content = content.value.replace(/^回复 @.+:/g, '');
        }
      }

      //附件处理
      if (attachment.length > 0) {
        attachment = attachment.map(item => {
          return "wx://" + item;
        });
        data.attachment = attachment.join('|');
      }

      Api.post('Room/SendComment', data, resp => {
        this.context.setComment(this.context.commentData.concat(resp));
      
        //清除输入框内容
        if (content.value.length > 0) content.value = '';

        //清除附件内容
        if (attachment.length > 0) this.refs.sendButton.clearAttachment();

        //告诉scroll要滚动到底部
        this.refs.scroll.setState({
          status: 1
        });
      });
    }
  },

  handlerPullDown() {
    if (this.topIndex > 0) {
      Api.get('Room/UpComment', {topic_id: this.context.topicId, end: this.topIndex - 1, num: this.props.pageSize}, resp => {
        this.topIndex = resp[0] ? resp[0].Index : 0;
        this.context.setComment(resp.concat(this.context.commentData));
      });
    }
  },

  //渲染模版，通过转换过的数据，渲染dom节点
  //todo 封装为react组件
  renderTemplate(data) {
    switch(data.idx) {
      case 3: 
        //互动区发言
        return (
          <div data-index={data.Index} onClick={this.handlerReply.bind(this, data.Index)}>
            <section>
              <h6 className="am-margin-0">
                <span className="am-time am-fr yf-time-gray">{data.CreateDate}</span>
                <img className="am-circle" src={data.HeadImg} width="32" height="32"/>
                <Icon icon="sf" className="am-margin-left-xs" style={{color: UserIdentityMap[data.Identity]}} />
                <span className="am-text-middle">{data.UserName}</span>
              </h6>
              <div className="am-margin-top-xs js-body" dangerouslySetInnerHTML={{__html: data.Body}} />
            </section>
            <Divider theme="dotted" />
          </div>
        );
      case 4: 
        //互动区回复
        return (
          <div data-index={data.Index} onClick={this.handlerReply.bind(this, data.Index)}>
            <section>
              <h6 className="am-padding-bottom-sm">
                <span className="am-time am-fr yf-time-gray">{data.CreateDate}</span>
                <img className="am-circle" src={data.HeadImg} width="32" height="32"/>
                <Icon icon="sf" className="am-margin-left-xs" style={{color: UserIdentityMap[data.Identity]}} />
                <span className="am-text-middle">{data.UserName}</span>
              </h6>
              <blockquote><div className="js-body" dangerouslySetInnerHTML={{__html: `【原文】${data.ReplyUserName}: ${data.ReplyComment}`}} /></blockquote>
              <div className="am-margin-top-xs js-body" dangerouslySetInnerHTML={{__html: `【回复】${data.Body}`}} />
            </section>
            <Divider theme="dotted" />
          </div>
        );
      default: 
        return (
          <div data-index={data.Index} />
        );
        break;
    }
  },

  renderBar() {
    return (
      <div className="yf-text-center am-margin-top-sm yf-text-white">
        <span className="am-margin-right-sm">——</span>{`${moment(this.context.createDate).format('YYYY年MM月DD日')}历史直播`}<span className="am-margin-left-sm">——</span>
      </div>
    );
  },

  render() {
    this.topIndex = this.context.commentData.length > 0 ? this.context.commentData[0].Index : 0;
    return (
      <div>
        <MyScroll ref="scroll" status={1} isEnd={this.topIndex == 0} onPullDown={this.handlerPullDown}>
          <ul className="am-padding-sm am-margin-0">
            {this.context.commentData.map((item, key) => {
              this.comment[item.Index] = item;
              return (
                <li key={key}>
                  {this.renderTemplate(this.context.switchData(item))}
                </li>
              )
            })}
          </ul>
        </MyScroll>
        <Topbar fixedBottom toggleBtn={<div />} ref="sendTopbar">
          {this.context.isHistory ? this.renderBar() : <SendButton ref="sendButton" 
                                                                   onSubmit={this.handlerSend} 
                                                                   onUpdate={this.handlerUpdate} />}
        </Topbar>
      </div>
    );
  }

});

export default Chat;