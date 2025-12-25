type JSONValue = Record<string, any>;

export type WSOptions = {
  baseUrl?: string; // ws(s)://host:port
  path: string; // e.g., /ws/notifications/
  onMessage?: (data: any) => void;
  onOpen?: () => void;
  onClose?: (ev: CloseEvent) => void;
  protocols?: string | string[];
  token?: string; // optional JWT to include as query param
};

export class ReconnectingWS {
  private url: string;
  private ws?: WebSocket;
  private onMessage?: (data: any) => void;
  private onOpen?: () => void;
  private onClose?: (ev: CloseEvent) => void;
  private heartbeatInterval?: number;
  private reconnectAttempts = 0;
  private closedByUser = false;

  constructor(opts: WSOptions) {
    const base = opts.baseUrl || process.env.NEXT_PUBLIC_WS_BASE || '';
    const q = opts.token ? (opts.path.includes('?') ? `&token=${opts.token}` : `?token=${opts.token}`) : '';
    this.url = `${base}${opts.path}${q}`;
    this.onMessage = opts.onMessage;
    this.onOpen = opts.onOpen;
    this.onClose = opts.onClose;
    this.connect();
  }

  private connect() {
    this.ws = new WebSocket(this.url);
    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.startHeartbeat();
      this.onOpen && this.onOpen();
    };
    this.ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data);
        this.onMessage && this.onMessage(data);
      } catch {
        // non-JSON messages ignored
      }
    };
    this.ws.onclose = (ev) => {
      this.stopHeartbeat();
      this.onClose && this.onClose(ev);
      if (!this.closedByUser) this.scheduleReconnect();
    };
    this.ws.onerror = () => {
      // error handled by onclose
    };
  }

  private scheduleReconnect() {
    const delay = Math.min(30000, 1000 * Math.pow(2, this.reconnectAttempts) + Math.random() * 1000);
    this.reconnectAttempts += 1;
    setTimeout(() => this.connect(), delay);
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatInterval = window.setInterval(() => {
      this.send({ type: 'heartbeat' });
    }, 25000);
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = undefined;
    }
  }

  public send(obj: JSONValue) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(obj));
    }
  }

  public close() {
    this.closedByUser = true;
    this.stopHeartbeat();
    this.ws?.close();
  }
}
