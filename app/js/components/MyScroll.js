import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import iScroll from 'iscroll/build/iscroll-probe';
import ReactIScroll from 'react-iscroll';

const MyScroll = React.createClass({
  // pullFormTop = true;
  timer : null,
  topOffset: 0,

  propTypes: {
    isEnd: React.PropTypes.bool,
    options: React.PropTypes.object,
    onPullDown: React.PropTypes.func,
    status: React.PropTypes.number, //0：不滚动，1: 滚动到底部 2: 下拉加载
  },

  getDefaultProps: function() {
    return {
      options: {
        // preventDefault: false,
        click: true,
        tap: true,
        probeType: 3,
        bounce: true,
        zoom: false,
      },
    };
  },

  getInitialState: function() {
    return {
      status: this.props.status,
      isOverlay: false,
      overlayImageSrc: '',
    };
  },

  componentDidMount() {
    let pulldown = ReactDOM.findDOMNode(this.refs.pulldown);
    this.topOffset = -$(pulldown).outerHeight();

    //jquery 绑定图片预览事件
    let _this = this;
    $('.js-content').on('click', 'img', function(e){
      e.preventDefault();
      e.stopPropagation();
      let curImageSrc = this.src.replace('_80x60', '');
      if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { 
        wx.previewImage({
          current: curImageSrc,
          urls: [curImageSrc]
        });
      } else {
        _this.setState({
          isOverlay: true,
          overlayImageSrc: curImageSrc,
        });
      }
      $('input').blur();
    });
  },

  handlerRefresh(scroll) {
    if (this.state.status == 1) {
      scroll.scrollTo(0, scroll.maxScrollY);
    } else if (this.state.status == 2) {
      scroll.scrollTo(0, this.topOffset, 500, iScroll.utils.ease.elastic);
    } else {
      if (this.bottomOffset >= scroll.y) {
        scroll.scrollTo(0, scroll.maxScrollY);
      }
    }
    //把最后的坐标保存下来
    this.bottomOffset = scroll.maxScrollY;
    this.setState({
      status: 0,
    });
  },

  handlerScroll(scroll) {
    if (scroll.y >= this.topOffset && !this.pullFormTop) {
      this.pullFormTop = true;
    }
  },

  handlerScrollStart(scroll) {
    $('input').blur();
  },

  handlerScrollEnd(scroll) {
    if (this.pullFormTop && scroll.directionY === -1) {
      //下拉刷新
      if (!this.props.isEnd) {
        this.setState({
          status: 2, 
        });
        this.props.onPullDown();
      } else {
        scroll.scrollTo(0, this.topOffset, 500, iScroll.utils.ease.elastic);
      }
    }
    this.pullFormTop = false;

    // pull up to load more
    // if (this.pullStart === scroll.y && (scroll.directionY === 1)) {
    //   console.log("handlerPullUp");
    // }
  },

  refresh() {
    this.refs.iScroll.refresh();
  },

  fixHeight() {
    //计算wrapper高度
    $('.js-wrapper').css({
      top: $('#root').css("paddingTop"),
      bottom: $('#root').css("paddingBottom"),
    });
    // $('.js-wrapper').height("-=" + $('#root').css("paddingTop"));
    // $('.js-wrapper').height("-=" + $('#root').css("paddingBottom"));
    $('.js-content').css("minHeight", $('.js-wrapper').height() + $('.js-pulldown').height());
  },

  checkLoadingImg() {
    let isLoading = false;
    // console.log($('.js-body img').size());
    $('.js-body img').each(function() {
      // console.log(this.src, this.height)
      if (this.height == 0) {
        isLoading = true;
        return false;
      }
    });
    // console.log(isLoading);
    if (!isLoading) {
      clearTimeout(this.timer);
      this.refresh();
    } else {
      this.timer = setTimeout(() => {
        this.checkLoadingImg();
      }, 500);
    }
  },

  handlerClickOverlay() {
    this.setState({
      isOverlay: false,
    });
  },

  renderOverlay() {
    if (this.state.isOverlay && this.state.overlayImageSrc) {
      return (
        <div>
          <div id="zhezhao" className="yf-zzc"></div>
          <div id="zhezhao-text" className="yf-zzc-image am-text-center am-vertical-align" onClick={this.handlerClickOverlay}>
            <div className="am-vertical-align-middle">
              <img src={this.state.overlayImageSrc} className="am-img-responsive"/>
            </div>
          </div>
        </div>
      );
    }
  },

  render() {
    return (
      <div>
        <div className="js-wrapper" style={{position: 'absolute', top: 0, left: 0, right:0, bottom: 0, overflow: "hidden"}}>
          <ReactIScroll ref="iScroll"
                        iScroll={iScroll}
                        options={this.props.options}
                        onScrollStart={this.handlerScrollStart}
                        onScrollEnd={this.handlerScrollEnd}
                        onScroll={this.handlerScroll}
                        onRefresh={this.handlerRefresh}
                        >
            <div className="js-content">
              <div ref="pulldown" className="js-pulldown am-text-center">下拉更多</div>
              {this.props.children}
            </div>
          </ReactIScroll>
        </div>
        {this.renderOverlay()}
      </div>
    );
  },
});

export default MyScroll;
