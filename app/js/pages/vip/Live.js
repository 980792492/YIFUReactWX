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

const Live = React.createClass({
  topIndex: 0,

  mixins: [AuthMixin, BgColorMixin],

  contextTypes: {
    messageData: React.PropTypes.array,
    topicId: React.PropTypes.number,
    roomId: React.PropTypes.number,
    isTeacher: React.PropTypes.bool,
    isInviteTeacher: React.PropTypes.bool,
    switchData: React.PropTypes.func,
    setMessage: React.PropTypes.func,
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

  handlerSend(content, attachment) {
    if (!this.context.isTeacher || !this.context.isInviteTeacher) {
      Modal.alert('您没有发言的权限！');
      return;
    }

    if (content.value.length > 0 || attachment.length > 0) {
      let data = {
        token: this.token,
        room_id: this.context.roomId,
        topic_id: this.context.topicId,
        content: content.value,
        quote_index: -1,
      };

      if (attachment.length > 0) {
        attachment = attachment.map(item => {
          return "wx://" + item;
        });
        data.attachment = attachment.join('|');
      }

      Api.post('Vip/SendMessage', data, resp => {
        this.context.setMessage(this.context.messageData.concat(resp));

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
      Api.get('Vip/UpMessage', {token: this.token, topic_id: this.context.topicId, end: this.topIndex - 1, num: this.props.pageSize}, resp => {
        this.topIndex = resp[0] ? resp[0].Index : 0;
        this.context.setMessage(resp.concat(this.context.messageData));
      });
    }
  },

  //渲染模版，通过转换过的数据，渲染dom节点
  //todo 封装为react组件
  renderTemplate(data) {
    switch(data.idx) {
      case 1: 
        //直播区发言
        return (
          <div data-index={data.Index} className="am-margin-bottom-sm">
            <section>
              <h6 className="am-margin-0">
                <span className="am-time am-fr yf-time-gray am-text-xs am-margin-top-xs">{data.CreateDate}</span>
                {/*<img className="am-circle" src={data.HeadImg} width="32" height="32"/>
                <Icon icon="sf" style={{color: UserIdentityMap[data.Identity]}} className="am-margin-left-xs"/>*/}
                <span className="am-text-middle am-text-sm">{data.UserName}</span>
              </h6>
              <div className="am-margin-top-xs am-padding-left-xs am-padding-right-xs am-padding-top-xs am-padding-bottom-sm yf-bg-white">
              <div className="am-margin-top-xs am-text-sm js-body" dangerouslySetInnerHTML={{__html: data.Body}}></div>
              </div>
            </section>
          </div>
        );
      case 2:
        //直播区引用
        let quote = data.QuoteUserName ? `${data.QuoteUserName}：${data.QuoteBody}` : data.QuoteBody;
        return (
          <div data-index={data.Index}>
            <section>
              <h6 className="am-margin-0">
                <span className="am-time am-fr yf-time-gray am-text-xs am-margin-top-xs">{data.CreateDate}</span>
                <Icon icon="sf" style={{color: UserIdentityMap[data.Identity]}} className="am-margin-left-xs"/>*/}
                <span className="am-text-middle am-text-sm">{data.UserName}</span>
              </h6>
              <div className="yf-bg-white am-padding-top-xs am-padding-left-sm am-padding-right-sm am-padding-bottom-sm am-margin-bottom-sm am-margin-top-xs">
                <blockquote><div className="am-text-sm js-body" dangerouslySetInnerHTML={{__html: `【原文】${quote}`}} /></blockquote>
                <div className="am-margin-top-xs am-text-sm js-body" dangerouslySetInnerHTML={{__html: `【回复】${data.Body}`}}></div>
              </div>
            </section>
          </div>
        );
      case 6:
        //投票
        return (
          <div data-index={data.Index}>
            <section>
              <h6>
                <span className="am-time am-fr">{data.CreateDate}</span>&nbsp;
              </h6>
              <dl>
                  <dt>爱心投票</dt>
                  <div dangerouslySetInnerHTML={{__html: data.Body}} />
              </dl>
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

  renderSend() {
    if (this.context.isTeacher || this.context.isInviteTeacher) {
      return (
        <Topbar fixedBottom toggleBtn={<div />} ref="sendTopbar">
          <SendButton ref="sendButton" onSubmit={this.handlerSend} onUpdate={this.handlerUpdate} more={["image"]} />
        </Topbar>
      );
    }
  },

  render() {
    this.topIndex = this.context.messageData.length > 0 ? this.context.messageData[0].Index : 0;
    return (
      <div>
        <MyScroll ref="scroll" status={1} isEnd={this.topIndex == 0} onPullDown={this.handlerPullDown}>
          <ul className="am-padding-sm am-margin-0">
            {this.context.messageData.map((item, key) => {
              return (
                <li key={key}>
                  {this.renderTemplate(this.context.switchData(item))}
                </li>
              )
            })}
          </ul>
        </MyScroll>
        {this.renderSend()}
      </div>
    );
  }

});

export default Live;
