export interface MessageModel {
  id: string;
  text: string;
  fromMe: boolean;
  isReply: boolean;
  chatId: string;
  senderId: string;
  timestamp: number;
  senderName: string;
  phoneNumber?: string;
  source: string;
}

export interface ChatModel {
  id: string;
  name: string;
}