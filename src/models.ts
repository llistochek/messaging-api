export type AttachedMedia = {
  mimeType: string;
  key: string;
};
export type MessageModel = {
  id: string;
  text: string;
  fromMe: boolean;
  isReply: boolean;
  chatId: string;
  senderId: string;
  timestamp: number;
  senderName: string;
  attachedMedia: AttachedMedia[];
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
