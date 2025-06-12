export interface Task {
  id: string;
  title: string;
  description: string;
  isAdditional: boolean;
  status?: 'not-started' | 'in-progress' | 'completed';
  startDate: string;
  dueDate: string;
  endDate: string;
  timeframe: number;
  timeframeUnit: 'days' | 'weeks' | 'months';
  completedDate?: string;
  notes?: string[];
  materials?: Array<{
    id: string;
    name: string;
    quantity: number;
    unit: string;
    price: number;
  }>;
  labor?: {
    hours: number;
    rate: number;
  };
  paymentAmount?: number;
  paymentStatus?: 'pending' | 'approved';
  isMilestonePayment?: boolean;
  verificationRequired?: boolean;
  verificationType?: 'photo' | 'video' | 'inspection';
  verificationRequests?: Array<'photo' | 'video' | 'inspection'>;
  delay?: {
    reason: string;
    notes: string;
    date: string;
  };
}