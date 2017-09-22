import Constant from './Constant';

const Ws = {
  init(option) {
    this.onOpen = option.onOpen || this.onOpen;
    this.onMessage = option.onMessage || this.onMessage;
    this.onClose = option.onClose || this.onClose;
    this.onError = option.onError || this.onError;

      return this.connect();
  },

  onOpen() {
    console.log("连接成功。");
  },

  onMessage(event) {
    console.log(event.data);
  },

  onClose() {
    console.log("连接关闭。", "ERROR");
  },

  onError() {
    console.log("WebSocket错误。", "ERROR");
  },

  connect() {
    let ws = new WebSocket(Constant.WS_URL);
    ws.onopen = this.onOpen;
      ws.onmessage = this.onMessage;
      ws.onclose = this.onClose;
      ws.onerror = this.onError;
      return ws;
  },
}

export default Ws;
