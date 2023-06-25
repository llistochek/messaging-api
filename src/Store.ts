import { Database } from 'sqlite';
import { MessageModel, ChatModel } from './models';
import MessagingProvider from './MessagingProvider';

export default class Store {
  private db: Database;
  constructor(db: Database) {
    this.db = db;
  }

  static TABLES = [
    `
      CREATE TABLE IF NOT EXISTS chats (
        id TEXT PRIMARY KEY,
        name TEXT,
        is_group BOOLEAN,
        source TEXT
      )
    `,
    `
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        text TEXT,
        from_me BOOLEAN,
        is_reply BOOLEAN,
        chat_id TEXT,
        sender TEXT,
        timestamp INTEGER,
        sender_name TEXT,
        phone_number TEXT,
        is_group BOOLEAN,
        source TEXT
      )
    `
  ];

  async init() {
    Store.TABLES.forEach((t) => this.db.run(t));
  }

  attach(messageProvider: MessagingProvider) {
    messageProvider.on('newMessages', (messages) => {
      for (const message of messages) {
        this.insertMessage(message).catch(console.error);
      }
    });
    messageProvider.on('newChats', (chats) => {
      for (const chat of chats) {
        this.insertChat(chat).catch(console.error);
      }
    });
  }

  async insertMessage(message: MessageModel) {
    await this.db.run(
      `
        INSERT OR IGNORE INTO messages (id, text, from_me, is_reply, chat_id, sender, timestamp, sender_name, phone_number, is_group, source)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        message.id,
        message.text,
        message.fromMe,
        message.isReply,
        message.chatId,
        message.senderId,
        message.timestamp,
        message.senderName,
        message.phoneNumber,
        message.isGroup,
        message.source
      ]
    );
  }

  async insertChat(chat: ChatModel) {
    await this.db.run(
      `
        INSERT OR IGNORE INTO chats (id, name, source)
        VALUES (?, ?)
      `,
      [chat.id, chat.name]
    );
  }

  async getChats(): Promise<ChatModel[]> {
    const chats = await this.db.all(
      `
        SELECT id, name, is_group, source FROM chats
      `
    );
    return chats.map((c) => {
      return { id: c.id, name: c.name, isGroup: c.is_group, source: c.source };
    });
  }
}
