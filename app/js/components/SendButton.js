import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {
  Button,
  Input,
  Form,
  Thumbnails,
  Thumbnail,
  AvgGrid,
  Popover,
  Image,
} from 'amazeui-react';
import Icon from './Icon';
import { Modal } from '../utils';

const SendButton = React.createClass({
  dragTime : 0,
  speed: 0,
  isMove: false,
  serverIds: [],

  moreConfig: [],

  getDefaultProps() {
    return {
      onSubmit : null,
      onUpdate : null,
      more: [],     // ["image", "voice"]
      //qq表情数据
      emotion: {
        qq: {
          start: 75,
          end: 178,
          row: 3,
          col: 8,
        }
      }
    };
  },

  getInitialState() {
    return {
      activeIndex: 0,
      showOption: '',
      currentEmotion: 'qq',
      emotionData: [],
      emotionHeight: 0,
      imageData: [],
    };
  },

  componentDidMount() {
    this.serverIds = [];
    this.initEmotion(this.state.currentEmotion);
    //init more
    this.moreConfig = [
      { key : "image", name: "图片", icon: "img", onClick: this.handlerChooseImage},
      { key : "voice", name: "语音", icon: "gd", onClick: this.handlerChooseImage},
    ];
  },

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentEmotion !== this.state.currentEmotion)
      this.initEmotion(this.state.currentEmotion);

    if (this.state.showOption !== prevState.showOption) {
      if (this.state.showOption === 'emotion') {
        this.setState({
          emotionHeight: $('.yf-emotion').height(),
        });
      }
      if (this.props.onUpdate) this.props.onUpdate();
    }
  },

  initEmotion(key) {
    let opt = this.props.emotion[key];
    if (!opt) return;

    let last = opt.start, data = [];
    while(last <= opt.end) {
      let between = [last];
      last = last + opt.col * opt.row - 2;
      last = last > opt.end ? opt.end : last;
      between.push(last);
      data.push(between);
      last++;
    };

    this.setState({
      emotionData: data,
    });
  },

  getContent() {
    return this.refs.content.getFieldDOMNode();
  },

  clearAttachment() {
    this.serverIds = [];
    this.setState({
      imageData: [], 
    });
  },

  uploadImage(data, callback) {
    let localId = data.pop();
    wx.uploadImage({
      localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
      isShowProgressTips: 1, // 默认为1，显示进度提示
      success: res => {
        this.serverIds.push(res.serverId);
        if (data.length === 0) {
          typeof callback === 'function' ? callback() : null;
        } else {
          this.uploadImage(data, callback);
        }
      },
      error: () => {
        Modal.alert("上传失败");
      }
    });
  },

  handlerSubmit(e) {
    e.preventDefault();
    // 获取输入框
    let content = this.refs.content.getFieldDOMNode();
    // 失去焦点控制输入框收回
    $(content).blur();

    //附件处理
    if (this.state.imageData.length > 0) {
      //wx上传
      this.uploadImage(this.state.imageData, () => {
        if (this.props.onSubmit) this.props.onSubmit(content, this.serverIds);
      });
    } else {
      // 回调onSubmit
      if (this.props.onSubmit) this.props.onSubmit(content, this.serverIds);
    }

  },

  handlerOptionToggle(option, e) {
    this.setState({
      showOption: option === this.state.showOption ? '' : option, 
    });
  },

  handlerOnFocus(){
    this.setState({
      showOption: '', 
    });
  },

  handlerEmotionTouchStart(e) {
    // 正在移动的情况，拒绝事件
    if (this.isMoving) return;

    this.dragTime = new Date().getTime();
    this.dragX = this.dragMoveX = e.touches[0].pageX;
    this.w = $(e.currentTarget).find('.active').width();

    let currentDom = $(e.currentTarget).find('.active');
    // remove transtion
    currentDom.parent().children().css("transition-duration", '0s');

    //add class
    currentDom.next().addClass('next');
    currentDom.prev().addClass('prev');
  },

  handlerEmotionTouchMove(e) {
    e.preventDefault();
    if (!this.dragTime) 
      return;

    this.isMove = true;
    this.offsetX = e.touches[0].pageX - this.dragX;
    this.offsetX = this.offsetX > this.w / 2 ? this.w / 2 : this.offsetX;

    let currentDom = $(e.currentTarget);
    currentDom.find('.active').css("transform", `translateX(${this.offsetX/2}px)`);
    currentDom.find('.next').css("transform", `translateX(${this.w + this.offsetX/2}px)`);
    currentDom.find('.prev').css("transform", `translateX(${this.offsetX/2 - this.w}px)`);

    this.speed = Math.abs(e.touches[0].pageX - this.dragMoveX);
    this.dragMoveX = e.touches[0].pageX;
  },

  handlerEmotionTouchEnd(e) {
    if (!this.isMove) return;
    //计算速度
    let currentDom = $(e.currentTarget).find('.active'),
        paging = $(e.currentTarget).next('ol.am-control-paging');

    // add transtion
    currentDom.parent().children().css("transition-duration", '0.6s');

    if (this.offsetX < 0 && currentDom.next().size() > 0 && (this.offsetX < -this.w/3 || this.speed > 10)) {
      //next
      currentDom.css("transform", `translateX(${-this.w}px)`);
      currentDom.next().css("transform", `translateX(0)`);
      this.isMoving = true;
      setTimeout(() => {
        currentDom.parent().children().removeClass();
        currentDom.next().addClass("active");
        this.setState({
          activeIndex: this.state.activeIndex + 1,
        });
        this.isMoving = false;
      }, 600);
      console.log("next");
    } else if(this.offsetX > 0 && currentDom.prev().size() > 0 && (this.offsetX > this.w/3 || this.speed > 10)) {
      //prev
      currentDom.css("transform", `translateX(${this.w}px)`);
      currentDom.prev().css("transform", `translateX(0)`);
      this.isMoving = true;
      setTimeout(() => {
        currentDom.parent().children().removeClass();
        currentDom.prev().addClass("active");
        this.setState({
          activeIndex: this.state.activeIndex - 1,
        });
        this.isMoving = false;
      }, 600);
      console.log("prev");
    } else {
      console.log("none");
      currentDom.css("transform", `translateX(0)`);
      currentDom.prev().css("transform", `translateX(${-this.w}px)`);
      currentDom.next().css("transform", `translateX(${this.w}px)`);
    }

    this.dragTime = 0;
    this.speed = 0;
    this.isMove = false;
  },

  handlerEmotionClick(i, e) {
    // 获取输入框
    let content = this.refs.content.getFieldDOMNode();
    content.value = content.value + `[@F_${i}G@]`;
  },

  handlerEmotionRemove(e) {
    // 获取输入框
    let content = this.refs.content.getFieldDOMNode();

    if (content.value.substr(-1, 1) == "]") {
      content.value = content.value.replace(/\[@F_\d+G@\]$/, "");
    } else {
      content.value = content.value.substr(0, content.value.length - 1);
    }
  },

  handlerChooseImage(e) {
    if (this.state.imageData.length >= 4) {
      Modal.alert("一次最多只能上传4张图片");
      return;
    }
    wx.ready(() => {
      wx.chooseImage({
        count: 3, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: res => {
          this.setState({
            imageData: this.state.imageData.concat(res.localIds),
          });
        }
      });
    });
    
  },

  handlerRemoveAttachment(i, e) {
    this.state.imageData.splice(i,1);
    this.setState({
      imageData: this.state.imageData,
    });
  },

  renderEmotion() {
    const emotions = (start, end) => {
      let data = [], retina = window.devicePixelRatio > 1 ? "@2x" : "";
      for (var i = start; i <= end; i++) {
        
        data.push(<Thumbnail key={i}
                             standalone
                             src={`i/bq/qq_${i}${retina}.png`}
                             onClick={this.handlerEmotionClick.bind(this, i)} />);
      }
      data.push(<Thumbnail key={i}
                             standalone
                             src="i/delemtion.png"
                             onClick={this.handlerEmotionRemove} />);
      return data;
    };

    return (
      <div className={this.state.showOption === 'emotion' ? "" : "am-hide"}>
        <div className="yf-slider am-slider am-slider-default am-slider-slide">
          <div className="am-viewport yf-viewport" 
               ref="emotion"
               style={{overflow: "hidden", position: "relative", width: "100%"}}
               onTouchStart={this.handlerEmotionTouchStart}
               onTouchMove={this.handlerEmotionTouchMove}
               onTouchEnd={this.handlerEmotionTouchEnd} >
            <ul className="am-slides">
              {this.state.emotionData.map((between, key) => {
                return (
                  <li key={key} className={this.state.activeIndex === key ? "active" : ""} style={{height: this.state.emotionHeight}}>
                    <Thumbnails sm={this.props.emotion[this.state.currentEmotion].col} className="yf-emotion am-margin-0">{ emotions(between[0], between[1]) }</Thumbnails>
                  </li>
                );
              })}
            </ul>
          </div>
          <ol className="am-control-nav am-control-paging">
            {this.state.emotionData.map((between, key) => {
              return <li key={key}><a href="javascript:;" className={key === this.state.activeIndex ? "am-active" : ""}>{key + 1}</a><i></i></li>;
            })}
          </ol>
        </div>
        <div>
          <Button type="submit" amSize="sm" className="am-fr am-margin-bottom-xs" >发送</Button>
        </div>
      </div>
    );
  },

  renderMore() {
    return (
      <AvgGrid sm={4} className={this.state.showOption === 'more' ? "" : "am-hide"}>
        {
          this.moreConfig.map((item, key) => {
            if (this.props.more.indexOf(item.key) !== -1) {
              return (
                <li key={key} className="am-text-center" onClick={item.onClick}>
                  <div className="yf-img-bg am-margin-top-xs ">
                  <Icon icon={item.icon}  className="yf-icon-css"/>
                  </div>
                  <div className="yf-icon-margin-top am-text-xs am-padding-bottom-xs">
                   {item.name}
                  </div>
                </li>
              );
            }
          })
        }
        
      </AvgGrid>
    );
  },

  renderAttachment() {
    if (this.state.imageData.length == 0) return;
    return (
      <Popover placement="top" positionLeft={0} positionTop={-86}>
        {this.state.imageData.map((item, key) => {
          return <Image src={item} key={key} height="60" width="60" className="am-margin-right-xs"
                      onClick={this.handlerRemoveAttachment.bind(this, key)} />
        })}
      </Popover>
    );
  },

  render() {
    return (
      <Form onSubmit={this.handlerSubmit}>
        <div className="am-form-group am-margin-0 am-padding-top-xs">
          <div className="am-input-group">
            {this.renderAttachment()}
            <span className="am-input-group-btn">
              {this.props.more.length > 0 ? <Button className="yf-icon-button"  onClick={this.handlerOptionToggle.bind(this, 'more')}><Icon icon="gd" /></Button> : null}
              <Button className="yf-icon-button" onClick={this.handlerOptionToggle.bind(this, 'emotion')}><Icon icon="bq" /></Button>
            </span>
            <Input standalone ref="content" onFocus={this.handlerOnFocus} />
            <span className="am-input-group-btn">
              <Button type="submit" style={{padding: ".5em .8em"}}>发送</Button>
            </span>
          </div>
        </div>
        {this.renderEmotion()}
        {this.renderMore()}
      </Form>
    );
  },
});

export default SendButton;
