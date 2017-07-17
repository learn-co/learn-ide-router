class SocketWrapper extends EventEmitter {
  constructor(socket, key) {
    super()
    this.key = key;
    this.socket = socket;
  }

  send(msg) {
    var preparedMsg = {};
    preparedMsg[this.key] = msg;

    this.socket.send(JSON.stringify(preparedMsg));
  }
}

class LearnIdeRouter {
  constructor(url) {
    this.subscriptions = {};
    this.socket = new WebSocket(url);

    this.socket.on('message', (msg)=> {
      this.routeEvent('message', JSON.parse(msg));
    });
  }

  getSocket(key) {
    if (!this.subscriptions[key]) {
      this.subscriptions[key] = new SocketWrapper(this.socket, key);
    }
    return this.subscriptions[key];
  }

  routeEvent(event, data) {
    Object.keys(this.subscriptions).forEach((key)=>{
      if (data[key]) {
        this.subscriptions[key].emit(event, data[key]);
      }
    });
  }
}

module.exports = LearnIdeRouter()
