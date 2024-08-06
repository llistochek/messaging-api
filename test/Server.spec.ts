import assert from 'assert';
import Server from '../src/Server';
import { describe, it, beforeEach, afterEach } from 'mocha';
import { ChatModel, MessageModel } from '../src/models';
import Store from '../src/Store';
import MessagingProvider from '../src/MessagingProvider';

class MockMessagingProvider extends MessagingProvider {
  message: MessageModel = {
    id: '123',
    text: 'hello',
    fromMe: false,
    isReply: false,
    chatId: '123',
    senderId: '123',
    timestamp: 123,
    senderName: '123',
    phoneNumber: '123',
    isGroup: false,
    source: '123'
  };

  sendMessage(chatId: string, text: string) {
    return Promise.resolve(this.message);
  }
}
class MockStore implements Store {
  chats: ChatModel[] = [
    {
      id: '123',
      name: '123',
      isGroup: false,
      source: '123'
    },
    {
      id: '456',
      name: '456',
      isGroup: false,
      source: '456'
    }
  ];

  async init() {}
  async attach() {}
  async insertMessage() {}
  async insertChat() {}
  async getChats() {
    return this.chats;
  }
}

const SOCKET_ADDR = 'tcp://127.0.0.1:5829';
describe('Server', function () {
  let store: MockStore;
  let provider: MockMessagingProvider;
  let server: Server;
  let sendSocket: zmq.Request;
  beforeEach(async () => {
    store = new MockStore();
    provider = new MockMessagingProvider();
    const serverSocket = new zmq.Reply();
    await serverSocket.bind(SOCKET_ADDR);
    server = new Server({
      socket: serverSocket,
      store,
      messagingProvider: provider
    });
    server.listen();
    sendSocket = new zmq.Request();
  });
  afterEach(async () => {
    server.close();
    sendSocket.close();
  });

  describe('sendMessage', function () {
    it('should send message', async function () {
      sendSocket.connect(SOCKET_ADDR);
      await sendSocket.send(
        JSON.stringify({
          type: 'sendMessage',
          body: {
            chatId: provider.message.chatId,
            text: provider.message.text
          }
        })
      );
      const resp = await sendSocket.receive();
      assert.deepEqual(JSON.parse(resp.toString()), provider.message);
    });
  });
  describe('getChats', function () {
    it('should get chats', async function () {
      sendSocket.connect(SOCKET_ADDR);
      await sendSocket.send(
        JSON.stringify({
          type: 'getChats'
        })
      );
      const resp = await sendSocket.receive();
      assert.deepEqual(JSON.parse(resp.toString()), store.chats);
    });
  });
});
