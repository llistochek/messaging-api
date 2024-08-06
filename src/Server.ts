import Store from './Store';
import MessagingProvider from './MessagingProvider';
import Fastify, { FastifyInstance } from 'fastify';
import websocket from '@fastify/websocket';

export default class Server {
  private store: Store;
  private messagingProvider: MessagingProvider;
  private app: FastifyInstance;

  constructor(store: Store, messagingProvider: MessagingProvider) {
    this.store = store;
    this.messagingProvider = messagingProvider;
  }

  async listen(port: number) {
    const app = Fastify({ logger: false });
    await app.register(websocket);
    app.get('/newMessages', { websocket: true }, (socket, req) => {
      this.messagingProvider.on('newMessages', (messages) => {
        for (const message of messages) {
          socket.send(JSON.stringify(message));
        }
      });
    });
    app.get('/chats', async (req, res) => {
      const resp = await this.store.getChats();
      res.send(resp);
    });
    app.get<{ Params: { chatId: string } }>(
      '/chats/:chatId',
      async (req, res) => {
        const resp = await this.messagingProvider.getChatInfo(
          req.params.chatId
        );
        res.send(resp);
      }
    );
    app.post<{ Body: { chatId: string; text: string } }>(
      '/messages',
      async (req, res) => {
        const { chatId, text } = req.body;
        const resp = await this.messagingProvider.sendMessage(chatId, text);
        res.send(resp);
      }
    );
    app.listen({ port });
    this.app = app;
  }

  async close() {
    this.app.close();
  }
}
