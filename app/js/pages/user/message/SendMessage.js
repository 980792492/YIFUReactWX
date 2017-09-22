import React from 'react';
import {
  Nav,
  NavItem,
  Form,
  Input,
  Container,
  Button,
} from 'amazeui-react';
import {
  Top,
  AuthMixin,
} from '../../../components';
import {
  Api,
} from '../../../utils';

const SendMessage = React.createClass({
  contextTypes: {
    router: React.PropTypes.object,
  },

  mixins: [AuthMixin],

  getInitialState: function() {
    let state = this.props.location.state || {};
    return {
      replyId: state.replyId || 0,
      name: state.name || '',
      title: state.title || '',
      content: state.content || ''
    };
  },

  handlerSubmit(e) {
    e.preventDefault();
    var name = this.refs.name.getValue();
    var title = this.refs.title.getValue();
    var content = this.refs.content.getValue();
    if (name && title && content) {
      Api.post('User/AddMessage', {
        token: this.token,
        receive_user: name,
        title: title,
        content: content,
        reply_id: this.state.replyId
      }, data => {
        this.context.router.push('user/message/list/3');
      });
    }
  },

  handlerTabs(tab, e) {
    this.context.router.replace(tab);
  },

  renderSend() {
  	return (
  		<Input type="text" label="收件人：" />
  	);
  },

  render() {
    return (
      <div>
        <Top title="消息中心" link="#/user" />
        <Nav tabs justify className="am-margin-0 yf-tabs am-text-sm yf-bg-gray">
			    <NavItem linkComponent="a" onClick={this.handlerTabs.bind(this, "user/message/list/1")}>系统消息</NavItem>
          <NavItem linkComponent="a" onClick={this.handlerTabs.bind(this, "user/message/list/2")}>收件箱</NavItem>
          <NavItem linkComponent="a" onClick={this.handlerTabs.bind(this, "user/message/list/3")}>发件箱</NavItem>
          <NavItem active linkComponent="a" onClick={this.handlerTabs.bind(this, "user/message/send")}>发站内信</NavItem>
			  </Nav>
        <Container>
  			  <Form horizontal className="am-padding-top" onSubmit={this.handlerSubmit}>
            <Input label="收件人："
                   ref="name"
                   defaultValue={this.state.name}
                   placeholder="多个用户请用;号隔开"
                   labelClassName="am-u-sm-3 am-text-sm am-padding-left-0 am-padding-right-0 am-text-center"
                   wrapperClassName="am-u-sm-9 am-padding-left-0 am-padding-right-0" />
            <Input label="标题："
                   ref="title"
                   defaultValue={this.state.title}
                   labelClassName="am-u-sm-3 am-text-sm am-padding-left-0 am-padding-right-0 am-text-center" 
                   wrapperClassName="am-u-sm-9 am-padding-left-0 am-padding-right-0" />
            <Input type="textarea" label="内容："
                   ref="content"
                   defaultValue={this.state.content}
                   labelClassName="am-u-sm-3 am-text-sm am-padding-left-0 am-padding-right-0 am-text-center"
                   wrapperClassName="am-u-sm-9 am-padding-left-0 am-padding-right-0" />
            <Button type="submit" block amStyle="danger" className="am-margin-top-lg">提交</Button>
          </Form>
        </Container>
      </div>
    );
  },
});

export default SendMessage;
