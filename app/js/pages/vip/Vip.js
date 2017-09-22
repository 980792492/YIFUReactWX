import React from 'react';
import {
  Top,
} from '../../components';

const Vip = React.createClass({  
  
  render() {
    return (
      <div>
      	<Top title="特训班" />
      	{this.props.children}
      </div>
    );
  },
});

export default Vip;
