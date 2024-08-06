export type MessageModel = {
  id: string;
  text: string;
  fromMe: boolean;
  isReply: boolean;
  chatId: string;
  senderId: string;
  timestamp: number;
  senderName: string;
  attachedMediaKeys?: string[];
  phoneNumber?: string;
  isGroup: boolean;
  source: string;
};
export type ParticipantModel = {
  id: string;
  isAdmin: boolean;
  name?: string;
  phoneNumber?: string;
};
export type ChatModel = {
  id: string;
  name: string;
  isGroup: boolean;
  description?: string;
  participants?: ParticipantModel[];
  source: string;
};
