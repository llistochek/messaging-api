import { MessageModel, ChatModel } from './models';
import { Database, open } from 'sqlite';
import sqlite3 from 'sqlite3';
import Store from './Store';

export default class SqliteStore implements Store {
  private dbPath: string;
  private db: Database;

  constructor(dbPath: string) {
    this.dbPath = dbPath;
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
    this.db = await open({
      filename: this.dbPath,
      driver: sqlite3.Database
    });
    for (const t of SqliteStore.TABLES) {
      await this.db.run(t);
    }
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
        INSERT OR IGNORE INTO chats (id, name, is_group, source)
        VALUES (?, ?, ?, ?)
      `,
      [chat.id, chat.name, chat.isGroup, chat.source]
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
