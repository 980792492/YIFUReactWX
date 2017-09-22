import React from 'react';
import $ from 'jquery';
import {
  Article,
  Container,
  ButtonGroup,
  Button,
  Topbar,
} from 'amazeui-react';
import {
  Top,
  AuthMixin,
  Icon,
} from '../../../components';
import {
  Api,
  Modal,
} from '../../../utils';

const MessageDetail = React.createClass({
  mixins: [AuthMixin],

  componentDidMount: function() {
    Api.get('User/MessageDetail', {
      token: this.token,
      id: this.props.params.id
    }, function(data) {
      this.setState({
        data: data 
      });
    }.bind(this));
  },

  getInitialState: function() {
    return {
      data: {} 
    };
  },

  handlerReply() {
    this.context.router.push({
      pathname: '/user/message/send',
      state: {
        replyId: this.state.data.Id,
        name: this.state.data.SendUserName,
        title: "回复：" + this.state.data.Title,
      }
    });
  },

  handlerForward() {
    this.context.router.push({
      pathname: '/user/message/send',
      state: {
        title: "转发：" + this.state.data.Title,
        content: this.state.data.Body,
      }
    });
  },

  handlerDel() {
    Modal.confirm("您确认要删除此信息吗？", function() {
      Api.post("Users/DelMessage", {
        token: this.token,
        id: this.state.Id
      }, function() {
        this.context.router.goBack();
      }.bind(this));
    }.bind(this));
  },

  renderReply() {
    if (this.state.data.ReBoxId > 0) {
      return (
        <Article.Child 
          role="lead" 
          dangerouslySetInnerHTML={{__html: this.state.data.ReBoxBody}}
        ></Article.Child>
      );
    } else {
      return '';
    } 
  },

  renderButton() {
    var toggleBtn = <div />;
    return (
      <Topbar fixedBottom fluid component="footer" toggleBtn={toggleBtn}>
        <ButtonGroup justify>
          <Button component="a" onClick={this.handlerReply}><Icon icon="hf" className="am-margin-right-xs"/>回复</Button>
          <Button component="a" onClick={this.handlerForward}><Icon icon="zf" className="am-margin-right-xs" />转发</Button>
          <Button component="a" onClick={this.handlerDel}><Icon icon="sc" className="am-margin-right-xs" />删除</Button>
        </ButtonGroup>
      </Topbar>
    )
  },

  render() {
    return (
      <div>
        <Top title="消息中心" />
        <Container className="am-padding">
          <Article 
            title={this.state.data.Title} >
            <Article.Child role="meta">
              发件人：{this.state.data.SendUserName} 
              收件人： {this.state.data.ReceiveUserName} 
              发送时间： {this.state.data.CreateDate}
            </Article.Child>
            <div dangerouslySetInnerHTML={{__html: this.state.data.Body}}></div>
            {this.renderReply()}
          </Article>
        </Container>
        {this.renderButton()}
      </div>
    );
  },
});

export default MessageDetail;
