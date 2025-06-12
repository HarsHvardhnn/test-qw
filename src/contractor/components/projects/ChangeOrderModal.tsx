import React, { useState, useRef } from 'react';
import { X, AlertCircle, DollarSign, Clock, Paperclip, FileText } from 'lucide-react';
import { Task } from './TaskList';

interface ChangeOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onSubmit: (changeOrder: {
    type: 'modification' | 'additional';
    taskId?: string;
    description: string;
    requestedBy: string;
    timeAdjustment: number;
    costAdjustment: number;
    attachments?: File[];
  }) => void;
}

export const ChangeOrderModal: React.FC<ChangeOrderModalProps> = ({
  isOpen,
  onClose,
  tasks,
  onSubmit
}) => {
  const [type, setType] = useState<'modification' | 'additional'>('modification');
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [description, setDescription] = useState('');
  const [requestedBy, setRequestedBy] = useState('');
  const [timeAdjustment, setTimeAdjustment] = useState(0);
  const [costAdjustment, setCostAdjustment] = useState(0);
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type,
      taskId: type === 'modification' ? selectedTaskId : undefined,
      description,
      requestedBy,
      timeAdjustment,
      costAdjustment,
      attachments
    });
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Create Change Order</h3>
              <p className="mt-1 text-sm text-gray-500">
                Please provide the details for this change order request.
              </p>
            </div>

            {/* Change Order Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Change Order Type
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setType('modification')}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    type === 'modification'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Modification
                </button>
                <button
                  type="button"
                  onClick={() => setType('additional')}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    type === 'additional'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Additional Scope
                </button>
              </div>
            </div>

            {/* Task Selection (for modifications) */}
            {type === 'modification' && (
              <div>
                <label htmlFor="task" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Task to Modify
                </label>
                <select
                  id="task"
                  value={selectedTaskId}
                  onChange={(e) => setSelectedTaskId(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                >
                  <option value="">Choose a task...</option>
                  {tasks.map(task => (
                    <option key={task.id} value={task.id}>{task.title}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Describe the changes needed..."
                required
              />
            </div>

            {/* Requested By */}
            <div>
              <label htmlFor="requestedBy" className="block text-sm font-medium text-gray-700 mb-1">
                Requested By
              </label>
              <input
                type="text"
                id="requestedBy"
                value={requestedBy}
                onChange={(e) => setRequestedBy(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter name"
                required
              />
            </div>

            {/* Time and Cost Adjustments */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="timeAdjustment" className="block text-sm font-medium text-gray-700 mb-1">
                  Time Adjustment (Days)
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="timeAdjustment"
                    value={timeAdjustment}
                    onChange={(e) => setTimeAdjustment(parseInt(e.target.value) || 0)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="costAdjustment" className="block text-sm font-medium text-gray-700 mb-1">
                  Cost Adjustment
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="costAdjustment"
                    value={costAdjustment}
                    onChange={(e) => setCostAdjustment(parseFloat(e.target.value) || 0)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Attachments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachments
              </label>
              <div className="space-y-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">{file.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors w-full"
                >
                  <Paperclip className="w-4 h-4 mr-2" />
                  Attach Files
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  multiple
                />
              </div>
            </div>

            {/* Important Note */}
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
              <div className="flex">
                <AlertCircle className="w-5 h-5 text-yellow-800 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">Important Note</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    This change order will require customer approval and may affect the project timeline and budget.
                  </p>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Submit Change Order
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};