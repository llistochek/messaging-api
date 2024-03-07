export type MessageModel = {
  id: string;
  text: string;
  fromMe: boolean;
  isReply: boolean;
  chatId: string;
  senderId: string;
  timestamp: number;
  senderName: string;
  phoneNumber?: string;
  isGroup: boolean;
  source: string;
};
export type ChatModel = {
  id: string;
  name: string;
  isGroup: boolean;
  description?: string;
  participants?: string[];
  source: string;
};
