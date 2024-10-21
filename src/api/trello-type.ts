export interface Container {
  _id: string;
  name: string;
  cards: Card[];
}

export interface AddContainerDTO {
  name: string;
}

export interface Card {
  _id: string;
  title: string;
  description: string;
  date: string;
  coverImage: string;
  attachments: Attachment[];
  containerId: string;
}

export interface UpdateCardDTO {
  title?: string;
  description?: string;
  date?: string;
}

export interface Attachment {
  url: string;
  title: string;
  uploadedAt: string;
}
