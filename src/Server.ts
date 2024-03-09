import * as zmq from 'zeromq';
import Store from './Store';
import MessagingProvider from './MessagingProvider';

interface Request {
  type: string;
  body: any;
}

type ServerParameters = {
  socket: zmq.Reply;
  store: Store;
  messagingProvider: MessagingProvider;
};

export default class Server {
  private socket: zmq.Reply;
  private store: Store;
  private messagingProvider: MessagingProvider;

  constructor({ socket, store, messagingProvider }: ServerParameters) {
    this.socket = socket;
    this.store = store;
    this.messagingProvider = messagingProvider;
  }

  private readonly handlerTable: { [key: string]: (req: any) => Promise<any> } =
    {
      sendMessage: this._sendMessage,
      getChats: this._getChats,
      getChatInfo: this._getChatInfo
    };

  async listen() {
    while (true) {
      const rawReq = await this.socket.receive();
      const req: Request = JSON.parse(rawReq.toString());
      let resp;
      try {
        resp = await this.handlerTable[req.type].call(this, req.body);
      } catch (e: any) {
        console.error(e);
        resp = { error: e.message };
      }
      await this.socket.send(JSON.stringify(resp));
    }
  }

  private async _sendMessage(msg: any) {
    const resp = await this.messagingProvider.sendMessage(msg.chatId, msg.text);
    return resp;
  }

  private async _getChats(req: any) {
    const resp = await this.store.getChats();
    return resp;
  }

  private async _getChatInfo(req: any) {
    const resp = await this.messagingProvider.getChatInfo(req.chatId);
    return resp;
  }

  close() {
    this.socket.close();
  }
}
