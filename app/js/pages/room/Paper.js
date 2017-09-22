import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import moment from 'moment';
import {
  Divider,
  Button,
  ButtonGroup,
  Topbar,
  Input,
} from 'amazeui-react';
import {
  Icon,
} from '../../components';
import { Users } from '../../models';
import {
  Api,
  Modal,
} from '../../utils';

const PaperGoldList = [2, 5, 8, 18];

const Paper = React.createClass({
  contextTypes: {
    router: React.PropTypes.object,
    topicId: React.PropTypes.number,
    roomId: React.PropTypes.number,
    teacher: React.PropTypes.object,
    isTeacher: React.PropTypes.bool,
    isInviteTeacher: React.PropTypes.bool,
    createDate: React.PropTypes.string,
    isHistory:React.PropTypes.bool,
  },

  getInitialState() {
    return {
      paperData: [],
      paperGold: 2,
      gcoins: 0,
      gcents: 0,
    };
  },

  componentDidMount() {
    //底部发言区域浮动
    let sendTopbar = ReactDOM.findDOMNode(this.refs.sendTopbar);
    $('#root').css('paddingBottom', $(sendTopbar).height());

    if (this.context.topicId > 0) {
      this.loadData(this.context.topicId);
    }

    //获取用户g币
    if (Users.isLogin()) {
      Users.getUserInfo(resp => {
        this.setState({
          gcoins: resp.CurrentGcoinsCount,
          gcents: resp.CurrentGcentsCount,
        });
      });
    }
  },

  componentWillUpdate: function(nextProps, nextState, nextContext) {
    if (nextContext.topicId > 0 && this.context.topicId !== nextContext.topicId) {
      this.loadData(nextContext.topicId);
    } else {
      // console.log(this.context.messageData, nextContext.messageData);
    }
  },

  componentWillUnmount() {
    //底部发言区域浮动
    $('#root').css('paddingBottom', 0);
    if(this.api) this.api.abort();
  },

  loadData(topicId) {
    let data = {
      room_id: this.context.roomId,
      topic_id: topicId,
    };
    if (Users.isLogin()) {
      data.token = Users.getToken();
    }
    this.api = Api.get('Room/Papers', data, resp => {
      this.setState({
        paperData: resp
      });
    });
  },

  handlerSelect(gold, e) {
    this.setState({
      paperGold: gold 
    });
  },

  handlerSend() {
    if (!Users.isLogin()) {
      Modal.confirm('您还未登录！', () => {
        this.context.router.push({pathname: "user/login", state: { "backurl" : this.props.location.pathname}});
      }, null, "登录", "取消");
      return;
    }

    if (this.context.isTeacher || this.context.isInviteTeacher) {
      Modal.alert('只有普通用户才能给老师发纸条！');
      return;
    }

    let content = this.refs.content.getFieldDOMNode();

    if (content.value.length > 0 && this.state.paperGold > 0) {
      let data = {
        token: Users.getToken(),
        room_id: this.context.roomId,
        topic_id: this.context.topicId,
        content: content.value,
        gold: this.state.paperGold,
      };

      Modal.confirm("您确定消费" + data.gold + "G币， 纸条内容：" + data.content, () => {
        Api.post('Room/AddPaper', data, resp => {
          this.setState({
            paperData: [{
              PaperIndex: 0,
              TopicId: data.topic_id,
              UserId: Users.getData().Id,
              UserName: Users.getData().UserName,
              Gold: data.gold,
              Body: data.content,
              Status: 0,
              AnswerUserId: this.context.teacher.id,
              AnswerUserName: this.context.teacher.name,
              AnswerBody: '',
              CreateDate: new Date(),
            }].concat(this.state.paperData),
          });
        }); 
      });
      
      //清除输入框内容
      content.value = '';
    }
  },

  //查看纸条事件
  handlerViewPaper(index, e){
    if (!Users.isLogin()) {
      Modal.alert("查看纸条需要登录，您还未登录");
      return;
    }

    Modal.confirm("查看该纸条需要支付一半的G币，请确认是否支付", () => {
      Api.post('Room/BuyPaper', {
        token: Users.getToken(),
        topic_id: this.context.topicId,
        paper_index: index,
      }, function(resp){
        Modal.alert(resp.AnswerBody);
      });
    });
  },

  renderSend() {
    if (!this.context.isTeacher && !this.context.isInviteTeacher) {
      let toggleBtn = <div />;
      let btn = <Button onClick={this.handlerSend}>发送</Button>;
      return (
        <Topbar fixedBottom toggleBtn={toggleBtn} ref="sendTopbar" className="am-padding-bottom-xs yf-send-topbar am-topbar-fixed-bottom">
          <ButtonGroup justify className="am-margin-top-xs am-margin-bottom-xs">
            {PaperGoldList.map((item, key) => {
              return <Button component="a" key={key} amSize="sm" className="yf-bg-white" active={item === this.state.paperGold} onClick={this.handlerSelect.bind(this, item)}>{item}G币</Button>;
            })}
          </ButtonGroup>
          <Input ref="content" btnAfter={btn} groupClassName="am-margin-0" />
        </Topbar>
      );
    }
  },

  renderBar() {
    return (
      <Topbar fixedBottom toggleBtn={<div />} ref="sendTopbar">
        <div className="yf-text-center am-margin-top-sm yf-text-white">
          <span className="am-margin-right-sm">——</span>{`${moment(this.context.createDate).format('YYYY年MM月DD日')}历史直播`}<span className="am-margin-left-sm">——</span>
        </div>
      </Topbar>
    );
  },

  render() {
    return (
      <div className="am-padding-sm">
        {this.state.paperData.map((item, key) => {
          let answer;
          if (item.Status == 0) {
            //没有回答
            answer = <span className="am-text-primary">暂未回答</span>;
          } else if(item.Status == 1) {
            //已回答
            if (Users.isLogin() && item.AnswerBody !== "") {
              //已有权限看纸条
              answer = item.AnswerBody;
            } else {
              answer = <span className="am-text-danger" onClick={this.handlerViewPaper.bind(this, item.PaperIndex)}>老师已回答，查看答案>></span>
            }
          }
          return (
            <div key={key} data-index={item.PaperIndex}>
              <section>
                <dl>
                    <dd className="am-link-muted">{ moment(item.CreateDate).format("HH:mm:ss") }</dd>
                    <dd className="am-padding-left-lg am-margin-bottom-sm"><Icon icon="q" className="am-text-danger am-text-xl yf-zt-icon" />{item.UserName}: {item.Body}<span className="am-text-danger">［{item.Gold}G币］</span></dd>
                    <dd className="am-padding-left-lg am-margin-bottom-sm"><Icon icon="a" className="am-text-danger am-text-xl yf-zt-icon" />{this.context.teacher.name}: { answer }</dd>
                </dl>
              </section>
              <Divider theme="dotted" />
            </div>
          );
        })}
        {this.context.isHistory ? this.renderBar() : this.renderSend()}
      </div>
    ); 
  }
});

export default Paper;