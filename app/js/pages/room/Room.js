import React from 'react';

const Room = React.createClass({  
  
  render() {
    return (
      <div>
      	{this.props.children}
      </div>
    );
  },
});

export default Room;
