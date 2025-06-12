import React, { useState } from 'react';
import { Camera, Video, CheckSquare, Plus, FileText, AlertCircle } from 'lucide-react';
import { Task } from './TaskList';

interface TaskActionsProps {
  task: Task;
  onUpdateTask: (task: Task) => void;
}

export const TaskActions: React.FC<TaskActionsProps> = ({ task, onUpdateTask }) => {
  const [showVerificationOptions, setShowVerificationOptions] = useState(false);
  const [showChangeOrderForm, setShowChangeOrderForm] = useState(false);
  const [verificationFiles, setVerificationFiles] = useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleStatusChange = (newStatus: 'not-started' | 'in-progress' | 'completed') => {
    onUpdateTask({
      ...task,
      status: newStatus,
      completedDate: newStatus === 'completed' ? new Date().toISOString() : undefined
    });
  };

  const handleVerificationRequest = (type: 'photo' | 'video' | 'inspection') => {
    onUpdateTask({
      ...task,
      verificationRequired: true,
      verificationType: type
    });
    setShowVerificationOptions(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setVerificationFiles(prev => [...prev, ...files]);
  };

  const handleSubmitVerification = () => {
    // Here you would typically upload the files and update the task
    console.log('Submitting verification files:', verificationFiles);
    setVerificationFiles([]);
  };

  return (
    <div className="mt-4 space-y-4">
      {/* Status Controls */}
      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
        <span className="text-sm font-medium text-gray-700">Task Status</span>
        <div className="flex space-x-2">
          <button
            onClick={() => handleStatusChange('not-started')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              task.status === 'not-started'
                ? 'bg-gray-200 text-gray-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Not Started
          </button>
          <button
            onClick={() => handleStatusChange('in-progress')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              task.status === 'in-progress'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => handleStatusChange('completed')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              task.status === 'completed'
                ? 'bg-green-200 text-green-800'
                : 'bg-green-100 text-green-600 hover:bg-green-200'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Verification Controls */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-700">Verification</span>
          <div className="relative">
            <button
              onClick={() => setShowVerificationOptions(!showVerificationOptions)}
              className="px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Verification
            </button>
            
            {showVerificationOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button 
                  onClick={() => handleVerificationRequest('photo')}
                  className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-50 text-sm text-gray-700"
                >
                  <Camera className="w-4 h-4 text-blue-500 mr-2" />
                  Photo Verification
                </button>
                <button 
                  onClick={() => handleVerificationRequest('video')}
                  className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-50 text-sm text-gray-700"
                >
                  <Video className="w-4 h-4 text-purple-500 mr-2" />
                  Video Verification
                </button>
                <button 
                  onClick={() => handleVerificationRequest('inspection')}
                  className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-50 text-sm text-gray-700"
                >
                  <CheckSquare className="w-4 h-4 text-green-500 mr-2" />
                  Inspection Required
                </button>
              </div>
            )}
          </div>
        </div>

        {task.verificationRequired && (
          <div className="space-y-3">
            <div className={`flex items-center px-3 py-2 rounded-lg ${
              task.verificationType === 'photo' ? 'bg-blue-100 text-blue-800' :
              task.verificationType === 'video' ? 'bg-purple-100 text-purple-800' :
              'bg-green-100 text-green-800'
            }`}>
              {task.verificationType === 'photo' ? (
                <Camera className="w-4 h-4 mr-2" />
              ) : task.verificationType === 'video' ? (
                <Video className="w-4 h-4 mr-2" />
              ) : (
                <CheckSquare className="w-4 h-4 mr-2" />
              )}
              <span className="text-sm font-medium">
                {task.verificationType === 'photo' ? 'Photo Verification Required' :
                 task.verificationType === 'video' ? 'Video Verification Required' :
                 'Inspection Required'}
              </span>
            </div>

            {(task.verificationType === 'photo' || task.verificationType === 'video') && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={task.verificationType === 'photo' ? 'image/*' : 'video/*'}
                  onChange={handleFileUpload}
                  className="hidden"
                  multiple
                />
                
                {verificationFiles.length > 0 ? (
                  <div className="space-y-2">
                    {verificationFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-2 rounded-lg">
                        <span className="text-sm text-gray-600">{file.name}</span>
                        <button
                          onClick={() => setVerificationFiles(prev => prev.filter((_, i) => i !== index))}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={handleSubmitVerification}
                      className="w-full px-3 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Submit Verification
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    Upload {task.verificationType === 'photo' ? 'Photos' : 'Video'}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Change Order Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowChangeOrderForm(true)}
          className="px-4 py-2 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
        >
          <FileText className="w-4 h-4 mr-2" />
          Create Change Order
        </button>
      </div>

      {/* Change Order Form Modal */}
      {showChangeOrderForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowChangeOrderForm(false)} />
          <div className="relative bg-white rounded-xl shadow-lg p-6 max-w-lg w-full m-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create Change Order</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Describe the changes needed..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Change
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={2}
                  placeholder="Explain why this change is needed..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cost Impact
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="number"
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time Impact (Days)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="0"
                  />
                </div>
              </div>
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
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowChangeOrderForm(false)}
                  className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit Change Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};