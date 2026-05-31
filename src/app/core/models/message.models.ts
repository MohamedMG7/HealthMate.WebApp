export interface MessageSummary {
  id: number;
  isRead: boolean;
  subject: string;
  senderName: string;
  date: string;
}

export interface MessageAttachment {
  attatchmentType: string;
  attatchmentId: string;
}

export interface MessageDetail {
  senderName: string;
  receiverName: string;
  createdAt: string;
  subject: string;
  body: string;
  attachments: MessageAttachment[];
}

export interface Receiver {
  id: string;
  name: string;
  nationlId: string;
}
