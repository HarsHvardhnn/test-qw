import React, { createContext, useContext, useEffect, useState } from 'react';
import axiosInstance from '../../axios';

// Define task status types
export type TaskStatus = 'not-started' | 'in-progress' | 'completed';

// Define verification types
export type VerificationType = 'photo' | 'video' | 'inspection' | null;

// Define task interface
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  startDate?: string;
  completedDate?: string;
  dueDate?: string;
  notes?: string;
  paymentAmount?: number;
  paymentRequested?: boolean;
  paymentApproved?: boolean;
  verificationRequired?: boolean;
  verificationType?: VerificationType;
  isMilestonePayment?: boolean; // Flag to indicate if this task has a milestone payment
  verificationRequests?: VerificationType[]; // Array to track verification requests
}

// Define the task context interface
interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  requestVerification: (id: string, type: VerificationType) => void;
  removeVerification: (id: string, type: string) => void;
  fetchTasksByProjectId: (projectId: string) => Promise<void>;
}

// Create the context with default values
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Provider component
export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children ,projectId}) => {

  const fetchTasksByProjectId = async (projectId : string) => {
    try {
      const response = await axiosInstance.get(`/quote/v2/tracker/tasks/${projectId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  };
  useEffect(() => {
    const fetchTasks = async () => {
      if (!projectId) return;
      try {
        const tasksData = await fetchTasksByProjectId(projectId);
        setTasks(tasksData);
      } catch (error) {
        console.error("Failed to fetch tasks", error);
      }
    };

    fetchTasks();
  }, [projectId]);

  // Sample tasks for a kitchen remodel
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'task-1',
      title: 'Project Planning & Design',
      description: 'Finalize kitchen layout, design elements, and material selections.',
      status: 'completed',
      startDate: '2025-06-01',
      completedDate: '2025-06-10',
      dueDate: '2025-06-15',
      notes: 'All design elements approved. Material selections finalized through the Qwillo store.',
      paymentAmount: 5000,
      paymentRequested: true,
      paymentApproved: true,
      isMilestonePayment: true
    },
    {
      id: 'task-2',
      title: 'Demolition & Removal',
      description: 'Remove existing cabinets, countertops, appliances, and flooring.',
      status: 'completed',
      startDate: '2025-06-16',
      completedDate: '2025-06-20',
      dueDate: '2025-06-22',
      notes: 'Demolition completed ahead of schedule. All debris removed from site.',
      paymentAmount: 7500,
      paymentRequested: true,
      paymentApproved: false,
      verificationRequired: true,
      verificationType: 'photo',
      isMilestonePayment: true
    },
    {
      id: 'task-3',
      title: 'Plumbing & Electrical Rough-In',
      description: 'Update plumbing and electrical to accommodate new layout.',
      status: 'in-progress',
      startDate: '2025-06-23',
      dueDate: '2025-06-30',
      notes: 'Electrical work is 75% complete. Plumbing connections for sink and dishwasher in progress.'
    },
    {
      id: 'task-4',
      title: 'Cabinet Installation',
      description: 'Install base and wall cabinets according to design plan.',
      status: 'not-started',
      dueDate: '2025-07-10',
      paymentAmount: 15000,
      isMilestonePayment: true,
      verificationRequired: true,
      verificationType: 'inspection'
    },
    {
      id: 'task-5',
      title: 'Countertop Installation',
      description: 'Template, fabricate, and install countertops.',
      status: 'not-started',
      dueDate: '2025-07-20'
    },
    {
      id: 'task-6',
      title: 'Backsplash Installation',
      description: 'Install tile backsplash and grout.',
      status: 'not-started',
      dueDate: '2025-07-25'
    },
    {
      id: 'task-7',
      title: 'Appliance Installation',
      description: 'Install new appliances and connect to utilities.',
      status: 'not-started',
      dueDate: '2025-07-30',
      paymentAmount: 2500,
      isMilestonePayment: true,
      verificationRequired: true,
      verificationType: 'photo'
    },
    {
      id: 'task-8',
      title: 'Final Touches & Cleanup',
      description: 'Complete final details, touch-ups, and thorough cleaning.',
      status: 'not-started',
      dueDate: '2025-08-05',
      paymentAmount: 20000,
      isMilestonePayment: true,
      verificationRequired: true,
      verificationType: 'inspection'
    }
  ]);

  const addTask = (task: Task) => {
    setTasks(prevTasks => [...prevTasks, task]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, ...updates } : task
      )
    );
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === id) {
          const updates: Partial<Task> = { status };
          
          // Add or update dates based on status
          if (status === 'in-progress' && !task.startDate) {
            updates.startDate = new Date().toISOString().split('T')[0];
          } else if (status === 'completed') {
            updates.completedDate = new Date().toISOString().split('T')[0];
          }
          
          return { ...task, ...updates };
        }
        return task;
      })
    );
  };

  const requestVerification = (id: string, type: VerificationType) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === id) {
          const verificationRequests = task.verificationRequests || [];
          // Only add if not already requested
          if (!verificationRequests.includes(type)) {
            return { 
              ...task, 
              verificationRequests: [...verificationRequests, type],
              verificationRequired: true
            };
          }
        }
        return task;
      })
    );
  };

  const removeVerification = (id: string, type: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === id) {
          const verificationRequests = task.verificationRequests?.filter(t => t !== type) || [];
          return {
            ...task,
            verificationRequests,
            // If this was the only verification type and it matches the main verificationType, remove it
            verificationType: task.verificationType === type ? null : task.verificationType,
            // Only keep verificationRequired true if there are still verifications
            verificationRequired: verificationRequests.length > 0 || (task.verificationType && task.verificationType !== type)
          };
        }
        return task;
      })
    );
  };

  const value = {
    tasks,
    addTask,
    updateTask,
    updateTaskStatus,
    requestVerification,
    removeVerification,
    fetchTasksByProjectId,
    setTasks
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

// Custom hook to use the task context
export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};