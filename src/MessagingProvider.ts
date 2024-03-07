import { MessageModel, ChatModel } from './models';
import TypedEmitter from 'typed-emitter';
import EventEmitter from 'events';

type MessagingEvents = {
  newMessages: (messages: MessageModel[]) => void;
  newChats: (chats: ChatModel[]) => void;
};
export default abstract class MessagingProvider extends (EventEmitter as new () => TypedEmitter<MessagingEvents>) {
  abstract sendMessage(
    chatId: string,
    text: string
  ): Promise<MessageModel | null>;

  abstract getChatInfo(chatId: string): Promise<ChatModel | null>;
}
