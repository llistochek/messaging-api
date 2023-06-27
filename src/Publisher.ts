import * as zmq from 'zeromq';
import { MessageModel, ChatModel } from './models';
import MessagingProvider from './MessagingProvider';

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

  attach(messageProvider: MessagingProvider) {
    messageProvider.on('newMessages', async (messages) => {
      for (const message of messages) {
        await this.publishMessage(message).catch(console.error);
      }
    });
    messageProvider.on('newChats', async (chats) => {
      for (const chat of chats) {
        await this.publishChat(chat).catch(console.error);
      }
    });
  }
}
