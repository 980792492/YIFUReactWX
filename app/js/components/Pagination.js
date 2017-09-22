import React from 'react';
import {
  Button,
} from 'amazeui-react';

const Pagination = React.createClass({
  getDefaultProps: function() {
    return {
      status: true,
      onClick: () => {},
    };
  },
  render() {
    const { status, ...rest } = this.props;
    return this.props.status ? 
      <Button block {...rest}>{this.props.children}</Button> :
      <div />;
  },
});

export default Pagination;
