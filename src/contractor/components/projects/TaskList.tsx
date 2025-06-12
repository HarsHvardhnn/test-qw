import React, { useState } from 'react';
import { Calendar, Clock, DollarSign, ChevronDown, ChevronUp, Package, Plus, Minus } from 'lucide-react';
import { Task } from './TaskList';

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (task: Task) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onUpdateTask }) => {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [editingLabor, setEditingLabor] = useState<string | null>(null);
  const [laborHours, setLaborHours] = useState<number>(0);
  const [laborRate, setLaborRate] = useState<number>(0);
  const [hasLaborChanges, setHasLaborChanges] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          icon: <Clock className="w-5 h-5 text-green-500" />,
          text: 'Completed',
          bgColor: 'bg-green-50',
          textColor: 'text-green-800',
          borderColor: 'border-green-100'
        };
      case 'in-progress':
        return {
          icon: <Clock className="w-5 h-5 text-blue-500" />,
          text: 'In Progress',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-100'
        };
      default:
        return {
          icon: <Clock className="w-5 h-5 text-gray-500" />,
          text: 'Not Started',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-100'
        };
    }
  };

  const handleLaborEdit = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingLabor(task.id);
    setLaborHours(task.labor?.hours || 0);
    setLaborRate(task.labor?.rate || 0);
    setHasLaborChanges(false);
  };

  const handleLaborSave = (task: Task) => {
    onUpdateTask({
      ...task,
      labor: { hours: laborHours, rate: laborRate }
    });
    setEditingLabor(null);
    setHasLaborChanges(false);
  };

  const handleLaborCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingLabor(null);
    setLaborHours(0);
    setLaborRate(0);
    setHasLaborChanges(false);
  };

  const handleLaborHoursChange = (task: Task, change: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newHours = Math.max(0, laborHours + change);
    setLaborHours(newHours);
    setHasLaborChanges(true);
  };

  const handleLaborRateChange = (task: Task, change: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newRate = Math.max(0, laborRate + change);
    setLaborRate(newRate);
    setHasLaborChanges(true);
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        const statusInfo = getStatusInfo(task.status || 'not-started');
        const isExpanded = expandedTaskId === task.id;

        return (
          <div 
            key={task.id}
            className={`border rounded-lg overflow-hidden transition-all duration-200 ${statusInfo.borderColor}`}
          >
            <div 
              className={`p-4 cursor-pointer ${statusInfo.bgColor}`}
              onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${statusInfo.bgColor}`}>
                    {statusInfo.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                    {task.paymentAmount && (
                      <div className="flex items-center mt-1">
                        <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600">
                          {formatCurrency(task.paymentAmount)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-600">
                        Due: {formatDate(task.dueDate)}
                      </span>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            {isExpanded && (
              <div className="p-4 border-t border-gray-100">
                <div className="space-y-4">
                  {/* Description */}
                  {task.description && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                      <p className="text-gray-900">{task.description}</p>
                    </div>
                  )}

                  {/* Task Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Timeline</h4>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          <span>Start: {formatDate(task.startDate)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mt-2">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          <span>Due: {formatDate(task.dueDate)}</span>
                        </div>
                        {task.completedDate && (
                          <div className="flex items-center text-sm text-green-600 mt-2">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>Completed: {formatDate(task.completedDate)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {task.paymentAmount && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Payment</h4>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Amount:</span>
                            <span className="font-medium text-gray-900">
                              {formatCurrency(task.paymentAmount)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm mt-2">
                            <span className="text-gray-600">Status:</span>
                            <span className={`font-medium ${
                              task.paymentStatus === 'approved' 
                                ? 'text-green-600' 
                                : 'text-yellow-600'
                            }`}>
                              {task.paymentStatus === 'approved' ? 'Approved' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Notes</h4>
                    <textarea
                      value={task.notes || ''}
                      onChange={(e) => onUpdateTask({ ...task, notes: e.target.value })}
                      placeholder="Add notes..."
                      className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};