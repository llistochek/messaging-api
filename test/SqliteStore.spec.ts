import assert from 'assert';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import SqliteStore from '../src/SqliteStore';
import { describe, it, beforeEach } from 'mocha';

const testChats = [
  {
    id: '123',
    name: '123',
    isGroup: false,
    source: '123'
  },
  {
    id: '456',
    name: '456',
    isGroup: false,
    source: '456'
  }
];

describe('Store', async function() {
  let store: SqliteStore;
  beforeEach(async function() {
    const db = await open({
      filename: ':memory:',
      driver: sqlite3.Database
    });
    store = new SqliteStore(db);
    await store.init();
  });
  describe('insertMessage', function() {
    it('should insert a message', async function() {
      const message = {
        id: '123',
        text: 'hello',
        fromMe: false,
        isReply: false,
        chatId: '123',
        sender: '123',
        timestamp: 123,
        senderName: '123',
        phone_number: '123',
        isGroup: false,
        source: '123',
        senderId: '123'
      };
      return await store.insertMessage(message);
    });
  });

  function insertChats() {
    const promises = testChats.map((chat) => {
      return store.insertChat(chat);
    });
    return Promise.all(promises);
  }
  describe('insertChats', function() {
    it('should insert chats', async function() {
      return insertChats();
    });
  });
  describe('getChats', function() {
    it('should return chats', async function() {
      await insertChats();
      const chats = await store.getChats();
      assert.deepEqual(chats, testChats);
    });
  });
});
