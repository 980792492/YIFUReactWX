import React from 'react';
import { Modal, ModalTrigger } from 'amazeui-react';

const Dialog = React.createClass({
  getInitialState() {
    return {
      modal: <Modal />,
      onConfirm: null,
      onCancel: null,
      onClose: null,
      show: false,
    };
  },

  open() {
    this.refs.mt.open();
  },

  close() {
    this.refs.mt.close();
  },
  
  render() {
    return <ModalTrigger ref="mt"
                         modal={this.state.modal}
                         onConfirm={this.state.onConfirm}
                         onCancel={this.state.onCancel}
                         onClose={() => {
                           this.setState({
                             show: false 
                           });
                         }}
                         show={this.state.show} />;
  }
});

export default Dialog;
