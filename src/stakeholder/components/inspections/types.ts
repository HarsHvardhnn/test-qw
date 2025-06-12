export interface InspectionReport {
  id: string;
  date: string;
  notes: string;
  photos: string[];
  issues?: string[];
  checklist?: {
    id: string;
    name: string;
    passed: boolean;
    notes?: string;
  }[];
  signature?: string;
}

export interface Inspection {
  id: string;
  projectId: number;
  projectName: string;
  contractor: string;
  milestone: string;
  address: string;
  inspector?: string;
  scheduledDate: string;
  status: 'scheduled' | 'completed' | 'failed' | 'pending';
  report?: InspectionReport;
}

export interface Project {
  id: number;
  name: string;
  milestone: string;
}