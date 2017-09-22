import React from 'react';
import { Cache } from '../utils';

const PayLink = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },

  propTypes: {
    to: React.PropTypes.string,
  },

  handlerClick() {
    Cache.set("payLink", this.getPath(), -1);
    this.context.router.push('user/pay');
  },

  // 通过location 获取router path
  getPath() {
    return location.hash.slice(2, location.hash.indexOf('?'));
  },

  render() {
    return (
      <a {...this.props} onClick={this.handlerClick}>{this.props.children}</a>
    );
  }

});

export default PayLink;