import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {
  Link,
} from 'react-router';
import Icon from './Icon';

const BottomBar = React.createClass({
  componentDidMount() {
    var dom = ReactDOM.findDOMNode(this);
    $('#root').css('paddingBottom', $(dom).height());
  },

  componentWillUnmount() {
    $('#root').css('paddingBottom', '');
  },

  renderItems() {
    const navs = [
      { 'link': '/', 'icon': 'home', 'title':   '首页' },
      { 'link': '/room', 'icon': 'zb', 'title': '直播' },
      { 'link': '/cjg', 'icon': 'cjg', 'title': '藏金阁' },
      { 'link': '/vip', 'icon': 'txb', 'title': '特训班' },
      { 'link': '/user', 'icon': 'my', 'title': '个人中心' },
    ];
    return navs.map((item, key) => {
      return (
        <li key={key}>
          <Link to={item.link} activeClassName="yf-bg-red-active" onlyActiveOnIndex={key === 0}>
            <Icon className="am-vertical-align-middle" size="sm" icon={item.icon} />
            <span className="am-navbar-label">{item.title}</span>
          </Link>
        </li>
      );
    });
  },
  
  render() {
    return (
      <div className="am-nav am-cf am-navbar-default am-nav-pills am-topbar-fixed-bottom">
        <ul className="am-navbar-nav am-cf am-avg-sm-5 am-avg-md-5  yf-bg-red am-text-center">
          {this.renderItems()}
        </ul>
      </div>
    );
  },
});

export default BottomBar;
