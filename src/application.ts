import Store from './Store';
import * as zmq from 'zeromq';
import MessagingProvider from './MessagingProvider';
import Server from './Server';
import Publisher from './Publisher';

export async function runApplication(
  serverAddress: string,
  publisherAddress: string,
  store: Store,
  messagingProvider: MessagingProvider
) {
  const serverSocket = new zmq.Reply();
  await serverSocket.bind(serverAddress);
  const publisherSocket = new zmq.Publisher();
  await publisherSocket.bind(publisherAddress);

  const server = new Server(serverSocket, store, messagingProvider);
  const publisher = new Publisher(publisherSocket);
  messagingProvider.on('newMessages', async (messages) => {
    for (const message of messages) {
      await store.insertMessage(message);
      publisher.publishMessage(message);
    }
  });
  messagingProvider.on('newChats', async (chats) => {
    for (const chat of chats) {
      await store.insertChat(chat);
      publisher.publishChat(chat);
    }
  });
  await server.listen();
}
