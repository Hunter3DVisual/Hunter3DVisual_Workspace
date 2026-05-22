export enum MessageRole {
  USER = "user",
  ASSISTANT = "assistant",
}

export type Message = {
  id: string;
  sessionId: string;
  role: MessageRole;
  content: string;
  createdAt: Date;
};

export type ChatSession = {
  id: string;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
};
