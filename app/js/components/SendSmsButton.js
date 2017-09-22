import React from 'react';
import {
  // Link,
} from 'react-router';
import {
  Button,
} from 'amazeui-react';
import {
  Api,
  Cache,
} from '../utils';

const SendSmsButton = React.createClass({
  propTypes: {
    phone: React.PropTypes.string.isRequired,
  },

  getInitialState() {
    return {
      t: Cache.get("smsLastTime", 0),
    }
  },

  componentWillMount: function() {
    this.init();
  },

  componentWillUnmount: function() {
    clearInterval(this.interval);
  },

  handlerClick() {
    const wait = 60;
    if (this.state.t < 1) {
      Api.post('User/SendSms', {phone: this.props.phone}, function(){
        Cache.set("smsLastTime", wait, -1);
        this.setState({t: wait});
        this.start();
      }.bind(this));
    }
  },

  init() {
    if (this.state.t < 1) {
      // this.handlerClick();
    } else {
      this.start();
    }
  },

  start() {
    var interval = setInterval(function() {
      let t = this.state.t;
      if (--t < 1) {
        clearInterval(interval);
      }
      this.setState({t: t});
      Cache.set("smsLastTime", t, -1);
    }.bind(this), 1000);
    this.interval = interval;
  },

  render() {
    return (
      <Button 
        className="am-text-sm"
        onClick={this.handlerClick}
        disabled={this.state.t > 0}
        style={{width: '100px'}}
      >{this.state.t > 0 ? this.state.t + '秒' : '重新发送'}</Button>
    )
  }
});

export default SendSmsButton;
