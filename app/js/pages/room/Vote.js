import React from 'react';
import {
  Form,
  Button,
  Input,
  Divider,
} from 'amazeui-react';
import { Users } from '../../models';
import {
  Api,
  Modal,
} from '../../utils';
import { PayLink } from '../../components';

const VoteGold = 2;
const Vote = React.createClass({
  contextTypes: {
    router: React.PropTypes.object,
    messageData: React.PropTypes.array,
    inviteTeacherData: React.PropTypes.array,
    teacher: React.PropTypes.object,
    topicId: React.PropTypes.number,
    isTeacher: React.PropTypes.bool,
    isInviteTeacher: React.PropTypes.bool,
    setMessage: React.PropTypes.func,
  },

  getInitialState() {
    return {
      gold: 0,
    };
  },

  componentDidMount() {
    if (Users.isLogin()) {
      Users.getUserInfo(resp => {
        this.setState({
          gold: resp.CurrentGcoinsCount 
        });
      });
    }
  },

  handlerVote() {
    if (!Users.isLogin()) {
      Modal.confirm('您还未登录！', () => {
        this.context.router.push({pathname: "user/login", state: { "backurl" : this.props.location.pathname}});
      }, null, "登录", "取消");
      return;
    }

    let data = [], gold = 0;
    let voteTeacher = [{
      TeacherId: this.context.teacher.id, 
      TeacherName: this.context.teacher.name,
      HeadImg: this.context.teacher.head,
      Introdouce: "",
    }].concat(this.context.inviteTeacherData);
    
    voteTeacher.map(item => {
      let voteNum = this.refs['vote_' + item.TeacherId].getValue();
      if (voteNum > 0) {
        data.push({
          tid: item.TeacherId,
          num: voteNum
        });
        gold = gold + voteNum*VoteGold;
      }
    });

    if (gold > 0) {
      Modal.confirm("本次投票将消耗" + gold + "G币，请确认消费！", () => {
        Api.post('Room/AddVote', {
          token: Users.getToken(),
          room_id: this.props.params.id,
          topic_id: this.context.topicId,
          data: JSON.stringify(data)
        }, resp => {
          data.map(item => {
            this.refs['vote_' + item.tid].getFieldDOMNode().value = '';
          });
          this.context.setMessage(this.context.messageData.concat(resp));
          this.context.router.replace(`room/topic/${this.props.params.id}`);
        });
      });
    }
  },

  render() {
    if (this.context.isTeacher) {
      return <div />;
    }
    let voteTeacher = [{
      TeacherId: this.context.teacher.id, 
      TeacherName: this.context.teacher.name,
      HeadImg: this.context.teacher.head,
      Introdouce: "",
    }].concat(this.context.inviteTeacherData);

    return (
      <div className="am-padding-sm">
        <p className="am-text-center am-text-xs am-margin-top-sm">
          您的G币余额：<span className="am-text-danger">{this.state.gold}</span>&nbsp;
          您还可以投<span className="am-text-danger">{parseInt(this.state.gold/VoteGold)}</span>票&nbsp;
          <PayLink className="am-text-secondary">G币充值>></PayLink>
        </p>
        <Form>
          {voteTeacher.map((item, key) => {
            let label = <span>支持<span className="am-text-danger">{item.TeacherName}</span>老师的票数</span>;
            return <Input key={key} ref={"vote_" + item.TeacherId} label={label} />
          })}
        </Form>
        <Divider theme="dotted" />
        <Button block amStyle="danger" onClick={this.handlerVote}>投票</Button>
      </div>
    );
  }

});

export default Vote;