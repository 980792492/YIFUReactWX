import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import $ from 'jquery';
import moment from 'moment';
import {
  Topbar,
  Divider,
  Alert,
  Modal as AModal,
  Panel,
  ButtonGroup,
  Button,
  Input,
} from 'amazeui-react';
import { Users } from '../../models';
import {
  Icon,
  MyScroll,
  SendButton,
  BottomBar,
} from '../../components';
import {
  Api,
  Modal,
  Constant,
} from '../../utils';

const UserIdentityMap = {
  1: 'yellow',
  2: '#ff120c',
  3: '#029aff',
  4: '#ad02fd',
};

const Live = React.createClass({
  topIndex: 0,
  Body: {},
  vouchers: {},
  contextTypes: {
    router: React.PropTypes.object,
    messageData: React.PropTypes.array,
    topicId: React.PropTypes.number,
    roomId: React.PropTypes.number,
    isTeacher: React.PropTypes.bool,
    isInviteTeacher: React.PropTypes.bool,
    createDate: React.PropTypes.string,
    isHistory: React.PropTypes.bool,
    switchData: React.PropTypes.func,
    setMessage: React.PropTypes.func,
    loadPayLiveData: React.PropTypes.func,
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
    if (!Users.isLogin()) {
      Modal.confirm('您还未登录！', () => {
        this.context.router.push({pathname: "user/login", state: { "backurl" : this.props.location.pathname}});
      }, null, "登录", "取消");
      return;
    }

    if (!this.context.isTeacher && !this.context.isInviteTeacher) {
      Modal.alert('您没有发言的权限！');
      return;
    }

    if (content.value.length > 0 || attachment.length > 0) {
      let data = {
        token: Users.getToken(),
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

      Api.post('Room/SendMessage', data, resp => {
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
      Api.get('Room/UpMessage', {topic_id: this.context.topicId, end: this.topIndex - 1, num: this.props.pageSize}, resp => {
        this.topIndex = resp[0] ? resp[0].Index : 0;
        this.context.setMessage(resp.concat(this.context.messageData));
      });
    }
  },

  handlerViewPaper() {
    if (!Users.isLogin()) {
      Modal.confirm('您还未登录，无法查看纸条！', () => {
        this.context.router.push({pathname: "user/login", state: { "backurl" : this.props.location.pathname}});
      }, null, "登录", "取消");
      return;
    } else {
      this.context.router.replace(`/room/topic/${this.context.roomId}/paper`);
    }
  },

  // 点击付费观点
  handlerPayView(data, e) {
    if (!Users.isLogin()) {
      Modal.confirm('您还未登录，无法购买加密观点！', () => {
        this.context.router.push({pathname: "user/login", state: { "backurl" : this.props.location.pathname}});
      }, null, "登录", "取消");
      return;
    } else {
       this.PayViewPOP(data);    
    }
  },

  handlerPayLive(id, type, e) {
    var voucherid = $("#myDiscount").val() 
    if (!voucherid) { voucherid = 0 }
    Api.post('EncryptedView/Pay', {
      id: id,
      token: Users.getToken(),
      type: type,
      voucher_id: voucherid
    }, resp => {
      this.context.loadPayLiveData(this.context.topicId);
    }); 
  },
  renderVoucher(resp) {
    if (resp.Vouchers.length > 0) {
      return (
        <Input type="select"  id='myDiscount'  standalone className="am-text-sm am-margin-bottom-sm">
          <option value="">不使用优惠券</option>
          {resp.Vouchers.map((item, key) => {
            this.vouchers[item.Id] = item;
            return <option key={key} data-price={item.FaceValue} value={item.Id}>{item.FaceValue}元代金券&nbsp;&nbsp;{moment(item.EndDate).format('YYYY.MM.DD')}过期</option>;
          })}
        </Input>
      );
    }
  },
  PayViewPOP(data, e) {
     Api.get('EncryptedView/TopicDetail',{
          id:data.ViewId,
          type:1,
          token:Users.getToken()
        }, resp => {
          let data = resp;
          let startDate = moment(data.CreateDate).format("YYYYMMDD HH:mm");
          let modal = (
            <AModal style={{position: 'relative'}} className="yf-payview-box">
              <h3 className="am-padding-top-sm am-margin-bottom-sm">请确认订阅信息</h3>
              <ul className="am-padding-0 am-text-sm yf-text-align" style={{listStyleType: "none"}}>
                <li>订阅内容:{data.TeacherName}{startDate}加密观点</li>
                <li>订阅价格: <span className='am-text-danger'>{data.Golds}</span>G币</li>
                <li>用户名：{Users.getData().UserName}</li>
              </ul>
              {this.renderVoucher(data)}
              {data.MonthGolds > 0 ? <p className="yf-bg-fff7d2 yf-text-ee922f yf-padding-viewmonth am-text-sm" onClick={this.PayMonthViewPOP.bind(this, data)}>包月观点包仅{data.MonthGolds}G币/月，无需逐条订阅，更方便划算>></p> : ''}
              <ButtonGroup justify>
                <Button className="yf-bg-red yf-text-white" component="a" onClick={this.handlerPayLive.bind(this, data.ViewId, 1)}>确认订阅此条</Button>
              </ButtonGroup>
            </AModal>
          );
          Modal.open(modal);
        })     
  },

  PayMonthViewPOP(data){
     Api.get('EncryptedView/TopicDetail',{
          id:data.ViewId,
          type:2,
          token:Users.getToken()
        }, resp => {
          let data = resp;
          let modal_month = (
            <AModal style={{position: 'relative'}} className="yf-payview-box">
              <h3 className="am-padding-top-sm am-margin-bottom-sm">请确认订阅信息</h3>
              <ul className="am-padding-0 am-text-sm yf-text-align" style={{listStyleType: "none"}}>
                <li>订阅内容:{data.TeacherName}包月观点包</li>
                <li>包月价格: <span className='am-text-danger'>{data.MonthGolds}</span>G币</li>
                <li>服务期限:{moment(data.CreateDate).format("MM/DD 00:00")}至{moment().add(30,'days').format("MM/DD 23:59")}</li> 
                <li>用户名:{Users.getData().UserName}</li>
              </ul>
              {this.renderVoucher(data)}
              <ButtonGroup justify>
                <Button className="yf-bg-red yf-text-white" component="a" onClick={this.handlerPayLive.bind(this, data.ViewId, 2)}>确认订阅观点包</Button>
              </ButtonGroup>
            </AModal>
          );
          Modal.open(modal_month);
        })  
  },

  //渲染模版，通过转换过的数据，渲染dom节点
  //todo 封装为react组件
  renderTemplate(data) {
    switch(data.idx) {
      case 1: 
        //直播区发言
        return (
          <div data-index={data.Index}>
            <section>
              <h6 className="am-margin-0">
                <span className="am-time am-fr yf-time-gray">{data.CreateDate}</span>
                <img className="am-circle" src={data.HeadImg} width="32" height="32" />
                <Icon icon="sf" style={{color: UserIdentityMap[data.Identity]}} className="am-margin-left-xs" />
                <span className="am-text-middle">{data.UserName}</span>
              </h6>
              <div className="am-margin-top-xs js-body" dangerouslySetInnerHTML={{__html: data.Body}} />
            </section>
            <Divider theme="dotted" />
          </div>
        );
      case 2:
        //直播区引用
        let quote = data.QuoteUserName ? `${data.QuoteUserName}：${data.QuoteBody}` : data.QuoteBody;
        return (
          <div data-index={data.Index}>
            <section>
              <h6  className="am-margin-0">
                <span className="am-time am-fr yf-time-gray">{data.CreateDate}</span>
                <img className="am-circle" src={data.HeadImg} width="32" height="32" />
                <Icon icon="sf" style={{color: UserIdentityMap[data.Identity]}} className="am-margin-left-xs" />
                <span className="am-text-middle">{data.UserName}</span>
              </h6>
              <blockquote><div className="js-body" dangerouslySetInnerHTML={{__html: `【原文】${quote}`}} /></blockquote>
              <div className="am-margin-top-xs js-body" dangerouslySetInnerHTML={{__html: `【回复】${data.Body}`}} />
            </section>
            <Divider theme="dotted" />
          </div>
        );
      case 5:
        //预留
        return (<div></div>);

      case 6:
        //投票
        return (
          <div data-index={data.Index}>
            <section>
              <h6 className="am-margin-bottom-0">
                <span className="am-time am-fr yf-time-gray">{data.CreateDate}</span>&nbsp;
              </h6>
              <dl className="am-margin-0">
                  <dt className="yf-room-vote-bg-pink am-padding-left-sm yf-text-white am-text-sm">爱心投票</dt>
                  <div dangerouslySetInnerHTML={{__html: data.Body}} className="am-text-sm yf-text-vote-gray yf-room-vote-pink am-padding-top-xs am-padding-bottom-xs am-padding-left-sm am-padding-right-sm"/>
              </dl>
            </section>
            <Divider theme="dotted" />
          </div>
        );
      case 7:
        //纸条
        if (this.isTeacher && !data.Answer) {
          return (
            <div data-index={data.Index}>
              <section>
                <h6 className="am-margin-bottom-0">
                  <span className="am-time am-fr yf-time-gray">{data.CreateDate}</span>&nbsp;
                </h6>
                <dl className="am-margin-0">
                  <dd className="am-padding-left-lg am-margin-bottom-sm"><Icon icon="q" className="am-text-danger am-text-xl yf-zt-icon" />{data.UserName}: {data.Body}<span className="am-text-danger">［{data.Gold}G币］</span></dd>
                  <dd className="am-padding-left-lg am-margin-bottom-sm"><Icon icon="a" className="am-text-danger am-text-xl yf-zt-icon" /><span className="am-text-primary">点击回答>></span></dd>
                </dl>
              </section>
              <Divider theme="dotted" />
            </div>
          );
        }else if(!this.isTeacher && data.Answer) {
          return (
            <div data-index={data.Index}>
              <section>
                <h6>
                  <span className="am-time am-fr yf-time-gray">{data.CreateDate}</span>&nbsp;
                </h6>
                <dl>
                  <dd className="am-padding-left-lg am-margin-bottom-sm"><Icon icon="q" className="am-text-danger am-text-xl yf-zt-icon" />{data.UserName}: {data.Body}<span className="am-text-danger">［{data.Gold}G币］</span></dd>
                  <dd className="am-padding-left-lg am-margin-bottom-sm"><Icon icon="a" className="am-text-danger am-text-xl yf-zt-icon" /><span className="am-text-primary" onClick={this.handlerViewPaper}>老师已回答，查看答案>></span></dd>
                </dl>
              </section>
              <Divider theme="dotted" />
            </div>
          );
        } else {
          return '';
        }
      case 8:
        //送礼
        let giftSrc = data.ToHeadImg.substr(0,7).toLowerCase() === "http://" ? data.ToHeadImg : Constant.GIFT_IMG_URL + data.ToHeadImg;
        return (
          <div data-index={data.Index}>
            <section>
              <h6 className="am-margin-bottom-0">
                <span className="am-time am-fr yf-time-gray">{data.CreateDate}</span>&nbsp;
              </h6>
              <dl className="am-margin-0">
                <dt className="am-text-center yf-room-gift-border-lightyellow am-padding-top-xs am-padding-bottom-xs"><img src={giftSrc} /></dt>
                {data.ToUserName.split(',').map((item, key) => {
                  if (item) {
                    return <dd key={key} className=" am-margin-top-0 yf-room-gift-bg-lightred am-text-sm yf-text-white am-padding-top-xs am-padding-bottom-xs am-padding-left-sm am-padding-right-sm"><span className="yf-roon-username-yellow">{data.UserName}</span>给{item}送上{data.GiftName}</dd>
                  }
                })}
              </dl>
            </section>
            <Divider theme="dotted" />
          </div>
        );
      case 9:
        //藏金阁更新
        return (
          <div data-index={data.Index}>
            <section>
              <h6>
                <span className="am-time am-fr">{data.CreateDate}</span>&nbsp;
              </h6>
              <Alert amStyle="warning">
                <p className="am-text-truncate">
                  <span className="am-fr">&gt;</span>
                  <Link to={`cjg/detail/${data.GoldenId}`}>{data.UserName}{data.Status == 1 ? '发布' : '更新'}了藏金阁《{data.Body}》</Link>
                </p>
              </Alert>
            </section>
            <Divider theme="dotted" />
          </div>
        );
      case 10:
        //系统公告
        return (
          <div data-index={data.Index}>
            <section>
              <Alert amStyle="danger" className="am-padding-0">
                <h4 className="yf-text-white am-text-center am-padding-xs">
                  系统公告
                </h4>
              </Alert>
              <div dangerouslySetInnerHTML={{__html: data.Body}}></div>
            </section>
            <Divider theme="dotted" />
          </div>
        );
      case 11:
        // console.log(data);
        // 付费观点已购买
        return(
          <div data-index={data.Index}>
            <section>
              <h6 className="am-margin-0">
                <span className="am-fr am-text-danger am-text-sm" style={{border: "1px solid", borderRadius: "15px", padding: "1px 15px"}}>加密</span>
                <span className="am-time am-fr yf-time-gray" style={{paddingRight: "5px"}}>{data.CreateDate}</span>
                <img className="am-circle" src={data.HeadImg} width="32" height="32" />
                <Icon icon="sf" style={{color: UserIdentityMap[data.Identity]}} className="am-margin-left-xs" />
                <span className="am-text-middle">{data.UserName}</span>
              </h6>
              <div className="am-panel am-panel-default yf-panel-view am-padding-top-xs">
                <div className="am-panel-hd yf-panal-bgcolor yf-panel-hd-view">此观点<span>{data.Body.Golds}</span>G币，您已拥有查看的权限</div>
                <div className="am-panel-bd yf-panel-bd-view js-body" dangerouslySetInnerHTML={{__html: data.Body.Content}}></div>
              </div>
            </section>
            <Divider theme="dotted" />
          </div>
        );
      case 12 :
        // 付费观点销售中
        return(
        <div data-index={data.Index}>
          <section>
            <h6 className="am-margin-0">
            <span className="am-fr am-text-danger am-text-sm" style={{border: "1px solid", borderRadius: "15px", padding: "1px 15px"}}>加密</span>
            <span className="am-time am-fr yf-time-gray" style={{paddingRight: "5px"}}>{data.CreateDate}</span>
            <img className="am-circle" src={data.HeadImg} width="32" height="32" />
            <Icon icon="sf" style={{color: UserIdentityMap[data.Identity]}} className="am-margin-left-xs" />
            <span className="am-text-middle">{data.UserName}</span>
            </h6>
            <div className="am-panel am-panel-default yf-panel-view am-padding-top-xs" onClick={this.handlerPayView.bind(this, data.Body)}>
              <div className="am-panel-bd yf-panel-bd-view-sale" ><p className="yf-text-white am-padding-left-sm yf-view-padding-left am-padding-top-xs yf-font-size-view yf-view-line-height">此观点加密，{data.Body.Golds}G币即可查看</p></div>
            </div>
          </section>
          <Divider theme="dotted" />
        </div>
        );
      case 13 :
        // 付费观点已下架
        return(
          <div data-index={data.Index}>
            <section>
              <h6 className="am-margin-0">
                <span className="am-fr am-text-danger am-text-sm" style={{border: "1px solid", borderRadius: "15px", padding: "1px 15px"}}>加密</span>
                <span className="am-time am-fr yf-time-gray" style={{paddingRight: "5px"}}>{data.CreateDate}</span>
                <img className="am-circle" src={data.HeadImg} width="32" height="32" />
                <Icon icon="sf" style={{color: UserIdentityMap[data.Identity]}} className="am-margin-left-xs" />
                <span className="am-text-middle">{data.UserName}</span>
              </h6>
              <div className="am-panel am-panel-default yf-panel-view am-padding-top-xs">
                <div className="am-panel-bd yf-panel-bd-view-stop" >

                </div>
              </div>
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
    } else {
      return <BottomBar />
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
        {this.context.isHistory ? this.renderBar() : this.renderSend()}
      </div>
    );
  }

});

export default Live;