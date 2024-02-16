export class WebSocketManager {
  socket: WebSocket;
  url: string | URL;
  isConnected: boolean;
  constructor(url) {
    this.url = url;
    this.socket = null;
  }

  start() {
    if ('WebSocket' in window) {
      this.socket = new WebSocket(this.url);

      this.socket.addEventListener('open', () => {
        this.isConnected = true;
        console.log('WebSocket connected');
      });

      this.socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        console.log('Received from WebSocket:', data);
      });

      this.socket.addEventListener('close', () => {
        console.log('WebSocket connection closed');
      });

      this.socket.addEventListener('error', (event) => {
        console.error('WebSocket error:', event);
      });
    } else {
      console.error('WebSocket is not supported by this browser.');
    }
  }

  stop() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  sendData(data) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
      console.log('Sent to WebSocket:', data);
    } else {
      console.warn(
        'WebSocket is not connected or readyState is not OPEN. Message not sent.'
      );
    }
  }
}
