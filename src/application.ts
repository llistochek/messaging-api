import Store from './Store';
import MessagingProvider from './MessagingProvider';
import Server from './Server';

export async function runApplication(
  serverPort: number,
  store: Store,
  messagingProvider: MessagingProvider
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
  await server.listen(serverPort);
}
