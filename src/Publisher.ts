import * as zmq from 'zeromq';
import { MessageModel, ChatModel } from './models';

export default class Publisher {
  private socket: zmq.Publisher;
  constructor(socket: zmq.Publisher) {
    this.socket = socket;
  }

  async publishMessage(msg: MessageModel) {
    await this.socket.send('message' + JSON.stringify(msg));
  }

  async publishChat(chat: ChatModel) {
    await this.socket.send('chat' + JSON.stringify(chat));
  }
}
