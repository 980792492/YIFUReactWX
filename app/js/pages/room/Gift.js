import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import $ from 'jquery';
import {
  Grid,
  Col,
  List,
  ListItem,
  AvgGrid,
  Container,
  Image,
  Form,
  FormGroup,
  Input,
  ButtonToolbar,
  Button,
} from 'amazeui-react';
import { Users } from '../../models';
import {
  Icon,
  PayLink,
} from '../../components';
import {
  Api,
  Modal,
  Cache,
} from '../../utils';

const Gift = React.createClass({
  CACHE_KEY: "YF_GIFT_CACHE",

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
      giftData: {},
      giftCategoryData: [],
      currentCategoryId: 0,
      gold: 0,
      gcoins: 0,
      gcents: 0,
      currentGiftTeacher: [],
    };
  },

  componentDidMount: function() {
    if (!this.isDetail()) {
      this.loadData();
    }

    if (Users.isLogin()) {
      Users.getUserInfo(resp => {
        this.setState({
          gcoins: resp.CurrentGcoinsCount,
          gcents: resp.CurrentGcentsCount,
        });
      });
    }
  },

  componentDidUpdate(prevProps, prevState) {
    if (!this.isDetail()) {
      let categoryList = ReactDOM.findDOMNode(this.refs.categoryList),
          top = $('#root').css('paddingTop');
      $(categoryList).css('top', top);
    }
  },

  loadData() {
    let resp = Cache.get(this.CACHE_KEY);
    if(resp) {
      this.initGift(JSON.parse(resp));
    } else {
      Api.get('Room/Gift', {}, resp => {
        this.initGift(resp);
        Cache.set(this.CACHE_KEY, JSON.stringify(resp), 3600);
      });
    }

  },

  // 通过api返回数据初始化礼物数据
  initGift(resp) {
    let giftData = {}, giftCategoryData = [];
    for (var i = 0; i < resp.length; i++) {
      if (!giftData[resp[i].GiftCategoryId]) {
        giftCategoryData.push({
          id: resp[i].GiftCategoryId,
          name: resp[i].GiftCategoryName,
        });
        giftData[resp[i].GiftCategoryId] = [];
      }
      giftData[resp[i].GiftCategoryId].push(resp[i]);
    }
    this.setState({
      giftData: giftData,
      giftCategoryData: giftCategoryData, 
      currentCategoryId: giftCategoryData[0].id
    });
  },

  isDetail() {
    return this.props.location.state !== null;
  },

  handlerSelectCategory(id, e) {
    this.setState({
      currentCategoryId: id 
    });
  },

  handlerSelectGift(item, e) {
    this.context.router.replace({pathname: this.props.location.pathname, state: item});
  },

  handlerReSelectGift() {
    this.context.router.replace({pathname: this.props.location.pathname, state: null});
  },

  handlerSelectTeacher(id, e) {
    let teacher = this.state.currentGiftTeacher,
        index = teacher.indexOf(id),
        gold = 0;

    index === -1 ? teacher.push(id) : teacher.splice(index, 1);

    //计算价格
    gold = teacher.length * this.props.location.state.Golds;

    this.setState({
      currentGiftTeacher: teacher,
      gold: gold,
    });
  },

  handlerSubmit(e) {
    if (!Users.isLogin()) {
      Modal.confirm('您还未登录！', () => {
        this.context.router.push({pathname: "user/login", state: { "backurl" : this.props.location.pathname}});
      }, null, "登录", "取消");
      return;
    }

    e.preventDefault();
    let giftId = this.props.location.state.GiftId,
        content = this.refs.content.getValue(),
        teacher = this.state.currentGiftTeacher,
        name = this.props.location.state.Type == 1 ? 'G币' : '积分';

    if ((this.props.location.state.Type == 1 && this.state.gold > this.state.gcoins)
      || (this.props.location.state.Type == 2 && this.state.gold > this.state.gcents)) {
      Modal.alert(`您的${name}不足!`);
      return false;
    }

    if (giftId > 0 && teacher.length > 0) {
      Modal.confirm(`本次送礼将消耗${this.state.gold + name}请确认消费！`, () => {
        Api.post('Room/AddGift', {
          token: Users.getToken(),
          topic_id: this.context.topicId,
          gift_id: giftId,
          content: content,
          teacher_ids: teacher.join(','),
        }, resp => {
          this.context.setMessage(this.context.messageData.concat(resp));
          this.context.router.replace(`room/topic/${this.props.params.id}`);
        });
      });
    }
  },

  renderGift() {
    if (this.state.giftData && this.state.giftData[this.state.currentCategoryId]) {
      return this.state.giftData[this.state.currentCategoryId].map((item, key) => {
        return (
          <li key={key} onClick={this.handlerSelectGift.bind(this, item)} className="am-padding-sm">
            <img className="am-thumbnail am-margin-bottom-0" src={item.SmallImgUrl} />
          </li>
        )
      })
    }
  },

  renderList() {
    return (
      <Grid collapse>
        <Col sm={3} className="yf-sl-position" ref="categoryList">
          <List static>
            {this.state.giftCategoryData.map((item, key) => {
              return <ListItem key={key} className={item.id == this.state.currentCategoryId ? "am-text-center am-text-xs yf-gift-bg-gray yf-gift-chanse" : "am-text-center am-text-xs yf-gift-bg-gray "} truncate onClick={this.handlerSelectCategory.bind(this, item.id)}>{item.name}<span className="yf-text-white am-icon-caret-left am-fr am-text-md yf-margin-right"></span></ListItem>
            })}
          </List>
        </Col>
        <Col sm={9} className="yf-bg-white">
          <AvgGrid sm={4} className="am-thumbnails am-margin-0 am-padding-xs">
            {this.renderGift()}
          </AvgGrid>
        </Col>
      </Grid>
    );
  },

  renderDetail() {
    let giftTeacher = [{
      TeacherId: this.context.teacher.id, 
      TeacherName: this.context.teacher.name,
      HeadImg: this.context.teacher.head,
      Introdouce: "",
    }].concat(this.context.inviteTeacherData);
    return (
      <Container>
        <div className="am-text-center am-padding-xl">
          <Image src={this.props.location.state.BigImgUrl} width="50%" />
        </div>
        <Form horizontal onSubmit={this.handlerSubmit}>
          <FormGroup className="am-margin-0">
            <label className="am-form-label am-u-sm-2 am-text-sm am-padding-left-0 am-padding-right-0 am-text-center">赠送给：</label>
            <div className="am-u-sm-10">
              <ButtonToolbar>
                { giftTeacher.map((item, key) => {
                  return <Button key={key} active={this.state.currentGiftTeacher.indexOf(item.TeacherId) !== -1} className="am-margin-bottom-sm" onClick={this.handlerSelectTeacher.bind(this, item.TeacherId)}>{item.TeacherName} <Icon icon="zq" /></Button>
                }) }
              </ButtonToolbar>
            </div>
          </FormGroup>
          <Input
            label="赠言:"
            defaultValue={this.props.location.state.Description}
            ref="content"
            groupClassName="am-margin-0"
            labelClassName="am-u-sm-2 am-text-sm am-padding-left-0 am-padding-right-0 am-text-center"
            wrapperClassName="am-u-sm-10"
          />
          <p className="am-text-sm am-margin-top-sm am-text-center">
            本次赠送礼物将花费<span className="am-text-danger">{this.state.gold}</span>{this.props.location.state.Type == 1 ? 'G币' : '积分'}，
            您的余额为：<span className="am-text-danger">{this.props.location.state.Type == 1 ? this.state.gcoins : this.state.gcents}</span>&nbsp;
            <PayLink className="am-text-secondary">G币充值</PayLink>
          </p>
          <Input block type="submit" amStyle="danger" value="送礼"
            wrapperClassName="am-u-sm-centered" />
          <Input block type="button" value="重新选择礼物"
            wrapperClassName="am-u-sm-centered" onClick={this.handlerReSelectGift} />
        </Form>
      </Container>
    );
  },

  render() {
    if (this.context.isTeacher) {
      return <div />;
    }

    return (
      <div>
        {this.isDetail() ? this.renderDetail() : this.renderList()}
      </div>
    )
  },

});

export default Gift;
