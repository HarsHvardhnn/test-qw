export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed';
  startDate: string;
  dueDate: string;
  completedDate?: string;
  notes?: string;
  paymentAmount?: number;
  paymentStatus?: 'pending' | 'approved';
  verificationRequired?: boolean;
  verificationType?: 'photo' | 'video' | 'inspection';
  verificationStatus?: 'pending' | 'submitted' | 'approved';
  verificationFiles?: Array<{
    id: string;
    type: 'photo' | 'video' | 'document';
    url: string;
    name: string;
  }>;
  isMilestonePayment?: boolean;
  delays?: Array<{
    reason: string | any;
    notes: string;
    date: string;
  }>;
}

export interface ChangeOrder {
  id: string;
  type: 'modification' | 'additional';
  taskId?: string;
  description: string;
  requestedBy: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  timeAdjustment: number;
  costAdjustment: number;
  attachments?: Array<{
    id: string;
    type: 'photo' | 'video' | 'document';
    url: string;
    name: string;
  }>;
}