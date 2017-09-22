import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {
  Topbar,
  Divider,
} from 'amazeui-react';
import {
  AuthMixin,
  BgColorMixin,
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
  mixins: [AuthMixin, BgColorMixin],

  comment: [],
  replyIndex: 0,
  topIndex: 0,

  contextTypes: {
    commentData: React.PropTypes.array,
    topicId: React.PropTypes.number,
    roomId: React.PropTypes.number,
    switchData: React.PropTypes.func,
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
    let data = this.comment[index];
    this.replyIndex = index;
    $(this.refs.content.getFieldDOMNode()).val('回复 @' + data.UserName + ':').focus();
  },

  handlerSend(content, attachment) {
    if (content.value.length > 0 || attachment.length > 0) {
      let data = {
        token: this.token,
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

      Api.post('Vip/SendComment', data, resp => {
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
      Api.get('Vip/UpComment', {token: this.token, topic_id: this.context.topicId, end: this.topIndex - 1, num: this.props.pageSize}, resp => {
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
          <div data-index={data.Index} onClick={this.handlerReply.bind(this, data.Index) } 
               className="yf-bg-white am-padding-top-xs am-padding-left-sm am-padding-right-sm am-padding-bottom-sm am-margin-bottom-sm">
            <section>
              <h6 className="am-margin-0">
                <span className="am-time am-fr yf-time-gray am-text-xs am-margin-top-xs">{data.CreateDate}</span>
                <img className="am-circle am-fl" src={data.HeadImg} width="32" height="32"/>
                <Icon icon="sf" style={{color: UserIdentityMap[data.Identity]}} className="am-fl am-margin-top-xs am-text-sm am-margin-right-0 am-margin-left-xs"/>
                <span className="am-text-middle am-text-sm">{data.UserName}</span>
              </h6>
              <Divider theme="dotted" />
              <div className="am-margin-top-xs am-text-sm js-body" dangerouslySetInnerHTML={{__html: data.Body}}></div>
            </section>
           
          </div>
        );
      case 4: 
        //互动区回复
        return (
         <div data-index={data.Index} onClick={this.handlerReply.bind(this, data.Index)}
           className="yf-bg-white am-padding-top-xs am-padding-left-sm am-padding-right-sm am-padding-bottom-sm am-margin-bottom-sm">
            <section>
              <h6 className="am-margin-0">
                <span className="am-time am-fr yf-time-gray am-text-xs am-margin-top-xs">{data.CreateDate}</span>
                <img className="am-circle am-fl" src={data.HeadImg} width="32" height="32"/>
                <Icon icon="sf" style={{color: UserIdentityMap[data.Identity]}} className=" am-fl am-margin-left-xs am-text-sm am-margin-top-xs am-margin-right-0"/>
                <span className="am-text-middle am-text-sm ">{data.UserName}</span>
              </h6>
              <Divider theme="dotted" />
              <blockquote><div className="am-text-sm js-body" dangerouslySetInnerHTML={{__html: `【原文】${data.ReplyUserName}: ${data.ReplyComment}`}} /></blockquote>
              <div className="am-text-sm js-body" dangerouslySetInnerHTML={{__html: `【回复】${data.Body}`}}></div>
            </section>
          </div>
          );
      default: 
        return (
          <div data-index={data.Index} />
        );
        break;
    }
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
          <SendButton ref="sendButton" onSubmit={this.handlerSend} onUpdate={this.handlerUpdate} more={["image"]} />
        </Topbar>
      </div>
    );
  }

});

export default Chat;
