import Store from './Store';
import { getEnvOrThrow, getEnvOrDefault } from './utils';
import MessagingProvider from './MessagingProvider';
import Server from './Server';

export async function runApplication(
  store: Store,
  messagingProvider: MessagingProvider,
  serverPort: number = parseInt(getEnvOrThrow('SERVER_PORT')),
  serverHost: string = getEnvOrDefault('SERVER_HOST', 'localhost')
) {
  const server = new Server(store, messagingProvider);
  messagingProvider.on('newMessages', async (messages) => {
    for (const message of messages) {
      await store.insertMessage(message);
    }
  });
  messagingProvider.on('newChats', async (chats) => {
    for (const chat of chats) {
      await store.insertChat(chat);
    }
  });
  await server.listen(serverPort, serverHost);
}
