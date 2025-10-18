import Store from './Store';
import { getEnvOrThrow, getEnvOrDefault } from './utils';
import MessagingProvider, { ConnectionState } from './MessagingProvider';
import Server from './Server';
import Metrics from './Metrics';

export async function runApplication(
  store: Store,
  messagingProvider: MessagingProvider,
  serverPort: number = parseInt(getEnvOrThrow('SERVER_PORT')),
  serverHost: string = getEnvOrDefault('SERVER_HOST', 'localhost'),
  metricsServerPort: number = parseInt(getEnvOrThrow('METRICS_SERVER_PORT')),
  metricsServerHost: string = getEnvOrDefault(
    'METRICS_SERVER_HOST',
    'localhost'
  )
) {
  const server = new Server(store, messagingProvider);
  const metrics = new Metrics(metricsServerPort, metricsServerHost);
  messagingProvider.on('newConnectionState', async (state) => {
    metrics.setConnectionState(state === ConnectionState.OPEN);
  });
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
