import React, { useState } from 'react';
import { X, DollarSign, Calendar, AlertCircle } from 'lucide-react';
import { Task } from './TaskList';

interface PaymentScheduleFormProps {
  isOpen: boolean;
  onClose: () => void;
  customerName: string;
  projectName: string;
  tasks: Task[];
  onSave: (payments: Array<{taskId: string, amount: number}>) => void;
}

export const PaymentScheduleForm: React.FC<PaymentScheduleFormProps> = ({
  isOpen,
  onClose,
  customerName,
  projectName,
  tasks,
  onSave
}) => {
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [payments, setPayments] = useState<Array<{taskId: string, amount: number}>>([]);
  const [error, setError] = useState<string>('');

  const handleAddPayment = () => {
    if (!selectedTask || !paymentAmount) {
      setError('Please select a task and enter a payment amount');
      return;
    }

    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid payment amount');
      return;
    }

    // Check if task already has a payment
    if (payments.some(p => p.taskId === selectedTask)) {
      setError('This task already has a payment scheduled');
      return;
    }

    setPayments([...payments, { taskId: selectedTask, amount }]);
    setSelectedTask('');
    setPaymentAmount('');
    setError('');
  };

  const handleRemovePayment = (taskId: string) => {
    setPayments(payments.filter(p => p.taskId !== taskId));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0);

  // Sort tasks by end date
  const sortedTasks = [...tasks].sort((a, b) => 
    new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="w-full">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                Create Payment Schedule
              </h3>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm font-medium text-gray-700">{projectName}</p>
                <p className="text-sm text-gray-500 mt-1">Customer: {customerName}</p>
              </div>

              <div className="space-y-4">
                {/* Task Selection */}
                <div>
                  <label htmlFor="task" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Task
                  </label>
                  <select
                    id="task"
                    value={selectedTask}
                    onChange={(e) => setSelectedTask(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Choose a task...</option>
                    {sortedTasks.map((task) => (
                      <option key={task.id} value={task.id}>
                        {task.title} (Due: {formatDate(task.endDate)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Task Details */}
                {selectedTask && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Payment will be due upon completion of this task on{' '}
                      <span className="font-medium">
                        {formatDate(tasks.find(t => t.id === selectedTask)?.endDate || '')}
                      </span>
                    </p>
                  </div>
                )}

                {/* Payment Amount */}
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Amount
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <DollarSign className="w-5 h-5 text-gray-400 mr-1" />
                    </div>
                    <input
                      type="number"
                      id="amount"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Add Payment Button */}
                <button
                  type="button"
                  onClick={handleAddPayment}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Payment to Schedule
                </button>

                {error && (
                  <div className="flex items-center text-sm text-red-600">
                    <AlertCircle className="w-4 h-4 mr-1.5" />
                    {error}
                  </div>
                )}

                {/* Scheduled Payments List */}
                {payments.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Scheduled Payments</h4>
                    <div className="space-y-3">
                      {payments.map((payment) => {
                        const task = tasks.find(t => t.id === payment.taskId);
                        return (
                          <div key={payment.taskId} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{task?.title}</p>
                              <div className="flex items-center mt-1">
                                <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                                <p className="text-xs text-gray-500">Due upon completion: {formatDate(task?.endDate || '')}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="text-sm font-medium text-gray-900">
                                {formatCurrency(payment.amount)}
                              </span>
                              <button
                                onClick={() => handleRemovePayment(payment.taskId)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-200">
                        <span className="text-sm font-medium text-gray-700">Total Payments</span>
                        <span className="text-lg font-medium text-gray-900">
                          {formatCurrency(totalPayments)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onSave(payments);
                onClose();
              }}
              disabled={payments.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Payment Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};