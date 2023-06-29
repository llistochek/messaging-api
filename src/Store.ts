import MessagingProvider from './MessagingProvider';
import { MessageModel, ChatModel } from './models';

export default interface Store {
  init(): Promise<void>;
  attach(messageProvider: MessagingProvider): void;
  insertMessage(message: MessageModel): Promise<void>;
  insertChat(chat: ChatModel): Promise<void>;
  getChats(): Promise<ChatModel[]>;
}
