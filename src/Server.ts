import Store from './Store';
import MessagingProvider, { InMemoryMedia } from './MessagingProvider';
import Fastify, { FastifyInstance } from 'fastify';
import websocket from '@fastify/websocket';
import multipart, { MultipartFile } from '@fastify/multipart';

export default class Server {
  private store: Store;
  private messagingProvider: MessagingProvider;
  private app: FastifyInstance;

  constructor(store: Store, messagingProvider: MessagingProvider) {
    this.store = store;
    this.messagingProvider = messagingProvider;
  }

  async listen(port: number) {
    const app = Fastify({ logger: false, maxParamLength: 8192 });
    await app.register(websocket);
    await app.register(multipart, {
      limits: {
        fieldSize: 50 * 1024 * 1024,
        fileSize: 50 * 1024 * 1024
      }
    });

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
    app.get<{ Params: { key: string } }>('/media/:key', async (req, res) => {
      const media = await this.messagingProvider.getMedia(req.params.key);
      if (media == null) {
        res.status(404);
        res.send();
      } else {
        res.header('Content-Type', media.mimeType);
        res.send(media.data);
      }
    });
    app.post('/messages', async (req, res) => {
      const media: InMemoryMedia[] = [];
      let msg;
      for await (const data of req.parts()) {
        if (data.type === 'file') {
          media.push({
            mimeType: msg.mimeType,
            data: await (data as MultipartFile).toBuffer()
          });
        } else {
          const value = data.value as any;
          if (value == null) continue;
          msg = value;
        }
      }
      const resp = await this.messagingProvider.sendMessage(
        msg.chatId,
        msg.text,
        media
      );
      res.send(resp);
    });
    app.listen({ port });
    this.app = app;
  }

  async close() {
    this.app.close();
  }
}
