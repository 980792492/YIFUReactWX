var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
import React from 'react';
import classNames from 'classnames';

const Icon = React.createClass({
	propTypes: {
    icon: React.PropTypes.string.isRequired,
    size: React.PropTypes.string,
    color: React.PropTypes.string,
    hide: React.PropTypes.bool,
  },

  render() {
    let cls = ["yf-icon-" + this.props.icon];
  	if (this.props.size) {
  		cls.push("yf-icon-" + this.props.size);
  	}
  	if (this.props.color) {
  		cls.push("yf-text-" + this.props.color);
  	}
    if (this.props.hide) {
      cls.push("am-hide");
    }
    let props = _extends({}, this.props, {
      className: classNames(cls, this.props.className)
    });

    const { hide, ...rest } = props;
    return (
      <i {...rest}><span></span></i>
    );
  },
});

export default Icon;
