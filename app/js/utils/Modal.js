import React from 'react';
import { Modal as AModal } from 'amazeui-react';

const Modal = {
  dialog: null,

  setDialog(dialog) {
    this.dialog = dialog;
  },

  close() {
    if (this.dialog) {
      this.dialog.close();
    }
  },

  loading() {
    if (this.dialog) {
      let modal = <AModal type="loading" title="正在加载" />;
      this.dialog.setState({
        modal: modal,
        show: true,
      });
    }
  },

  alert(content, ok, okText) {
    if (this.dialog) {
      let modal = <AModal type="alert" title="提示" confirmText={okText}>{content}</AModal>;
      this.dialog.setState({
        modal: modal,
        onConfirm: ok,
        show: true,
      });
    }
  },

  confirm(content, ok, cancel, okText, cancelText) {
    if (this.dialog) {
      let modal = <AModal type="confirm" title="提示" confirmText={okText} cancelText={cancelText}>{content}</AModal>;
      this.dialog.setState({
        modal: modal,
        onConfirm: ok,
        onCancel: cancel,
        show: true,
      });
    }
  },

  //通用弹窗
  open(modal) {
    if (this.dialog) {
      this.dialog.setState({
        modal: modal,
        show: true,
      });
    }
  },
}

export default Modal;
