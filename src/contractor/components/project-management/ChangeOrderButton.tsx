import React, { useState } from 'react';
import { FileText, Plus } from 'lucide-react';
import { ChangeOrderModal } from './ChangeOrderModal';
import { Task } from './types';

interface ChangeOrderButtonProps {
  tasks: Task[];
  onCreateChangeOrder: (changeOrder: {
    type: 'modification' | 'additional';
    taskId?: string;
    description: string;
    requestedBy: string;
    timeAdjustment: number;
    costAdjustment: number;
    attachments?: File[];
  }) => void;
}

export const ChangeOrderButton: React.FC<ChangeOrderButtonProps> = ({
  tasks,
  onCreateChangeOrder
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
      onClick={()=>{setShowModal(true)}}
        className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
        <Plus className="w-5 h-5 mr-2" />
        Modify Tasks
      </button>

      <ChangeOrderModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        tasks={tasks}
        onSubmit={onCreateChangeOrder}
      />
    </>
  );
};