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
        name TEXT
      )
    `,
    `
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        text TEXT,
        fromMe BOOLEAN,
        isReply BOOLEAN,
        chat_id TEXT,
        sender TEXT,
        timestamp INTEGER,
        senderName TEXT
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
        INSERT OR IGNORE INTO messages (id, text, fromMe, isReply, chat_id, sender, timestamp, senderName)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        message.id,
        message.text,
        message.fromMe,
        message.isReply,
        message.chat,
        message.sender,
        message.timestamp,
        message.senderName
      ]
    );
  }

  async insertChat(chat: ChatModel) {
    await this.db.run(
      `
        INSERT OR IGNORE INTO chats (id, name)
        VALUES (?, ?)
      `,
      [chat.id, chat.name]
    );
  }

  async getChats(): Promise<ChatModel[]> {
    const chats = await this.db.all(
      `
        SELECT id, name FROM chats
      `
    );
    return chats.map((c) => {
      return { id: c.id, name: c.name };
    });
  }
}
