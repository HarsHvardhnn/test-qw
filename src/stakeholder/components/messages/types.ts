export interface Contact {
  id: string;
  name: string;
  role: 'contractor' | 'customer' | 'inspector';
  avatar?: string;
  company?: string;
  projectId: number;
  projectName: string;
  lastMessage?: {
    content: string;
    timestamp: string;
    isRead: boolean;
    sender: 'them' | 'you';
  };
  online?: boolean;
}

export interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: 'them' | 'you';
  status?: 'sent' | 'delivered' | 'read';
  attachments?: Array<{
    id: string;
    type: 'image' | 'document';
    url: string;
    name: string;
    size?: string;
  }>;
}