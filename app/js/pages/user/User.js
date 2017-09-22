import React from 'react';

const User = React.createClass({  
  
  render() {
    return (
      <div>
      	{this.props.children}
      </div>
    );
  },
});

export default User;
