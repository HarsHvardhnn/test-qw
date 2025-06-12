import React from 'react';
import { DollarSign, Eye } from 'lucide-react';
import { Task } from './TaskList';

interface PaymentScheduleButtonProps {
  onClick: () => void;
  tasks?: Task[];
}

export const PaymentScheduleButton: React.FC<PaymentScheduleButtonProps> = ({ onClick, tasks = [] }) => {
  const hasPaymentSchedule = tasks.some(task => task.isMilestonePayment && task.paymentAmount);

  return (
    <button
      className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors flex items-center ${
        hasPaymentSchedule ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {hasPaymentSchedule ? (
        <>
          <Eye className="w-4 h-4 mr-2" />
          View Payment Schedule
        </>
      ) : (
        <>
          <DollarSign className="w-4 h-4 mr-2" />
          Create Payment Schedule
        </>
      )}
    </button>
  );
};