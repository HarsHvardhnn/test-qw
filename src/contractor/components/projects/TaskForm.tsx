import React, { useState, useRef } from 'react';
import { Clock, Plus, ChevronDown } from 'lucide-react';
import { getStandardTasks } from './standardTasks';

interface TaskFormProps {
  onSubmit: (task: {
    title: string;
    description: string;
    timeframe: number;
    timeframeUnit: "days" | "weeks" | "months";
    startDate: string;
    endDate: string;
  }) => void;
  onCancel: () => void;
  initialData?: {
    title: string;
    description: string;
    timeframe: number;
    timeframeUnit: "days" | "weeks" | "months";
    startDate: string;
    endDate: string;
    isAdditional: boolean;
  };
}

export const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onCancel, initialData ,isAdditional=false}) => {
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [isCustomTask, setIsCustomTask] = useState(!!initialData);
  const [selectedTaskType, setSelectedTaskType] = useState('');

  // Get current date in YYYY-MM-DD format, adjusting for timezone
  const getCurrentDate = () => {
    const date = new Date();
    const offset = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() - offset);
    return date.toISOString().split('T')[0];
  };

  const [task, setTask] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    timeframe: initialData?.timeframe || 1,
    timeframeUnit: initialData?.timeframeUnit || 'days' as const,
    startDate: initialData?.startDate || getCurrentDate(),
    endDate: initialData?.endDate || '',
    isAdditional: isAdditional
  });

  const calculateEndDate = (startDate: string, timeframe: number, unit: 'days' | 'weeks' | 'months') => {
    const date = new Date(startDate);
    let days = timeframe;
    if (unit === 'weeks') days = timeframe * 7;
    if (unit === 'months') days = timeframe * 30;
    date.setDate(date.getDate() + days);
    
    // Adjust for timezone
    const offset = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() - offset);
    return date.toISOString().split('T')[0];
  };

  const handleTimeframeChange = (value: number, unit: 'days' | 'weeks' | 'months') => {
    const endDate = calculateEndDate(task.startDate, value, unit);
    setTask(prev => ({
      ...prev,
      timeframe: value,
      timeframeUnit: unit,
      endDate
    }));
  };

  const handleStartDateChange = (date: string) => {
    const endDate = calculateEndDate(date, task.timeframe, task.timeframeUnit);
    setTask(prev => ({
      ...prev,
      startDate: date,
      endDate
    }));
  };

  const handleTaskTypeChange = (taskType: string) => {
    const standardTasks = getStandardTasks('Interior Renovation & Remodeling', 'Kitchen Remodeling');
    const selectedTask = standardTasks.find(t => t.title === taskType);
    
    if (selectedTask) {
      const endDate = calculateEndDate(task.startDate, selectedTask.timeframe, selectedTask.timeframeUnit);
      setTask({
        ...selectedTask,
        startDate: task.startDate,
        endDate
      });
      setSelectedTaskType(taskType);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(task);
  };

  // Get standard tasks for dropdown
  const standardTasks = getStandardTasks('Interior Renovation & Remodeling', 'Kitchen Remodeling');

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Task Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Task Type
        </label>
        <div className="flex items-center space-x-4 mb-4">
          <button
            type="button"
            onClick={() => setIsCustomTask(false)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              !isCustomTask
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Common Tasks
          </button>
          <button
            type="button"
            onClick={() => setIsCustomTask(true)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              isCustomTask
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Custom Task
          </button>
        </div>

        {isCustomTask ? (
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              id="title"
              required
              value={task.title}
              onChange={(e) => setTask(prev => ({ ...prev, title: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Enter task title"
            />
          </div>
        ) : (
          <div className="relative">
            <select
              value={selectedTaskType}
              onChange={(e) => handleTaskTypeChange(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pr-10 appearance-none"
            >
              <option value="">Select a common task</option>
              {standardTasks.map((standardTask) => (
                <option key={standardTask.title} value={standardTask.title}>
                  {standardTask.title}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Task Description
        </label>
        <textarea
          id="description"
          rows={3}
          value={task.description}
          onChange={(e) => setTask(prev => ({ ...prev, description: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Enter task description"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Timeframe *
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="1"
              required
              value={task.timeframe}
              onChange={(e) => handleTimeframeChange(parseInt(e.target.value) || 1, task.timeframeUnit)}
              className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            <div className="flex rounded-md shadow-sm">
              <button
                type="button"
                onClick={() => handleTimeframeChange(task.timeframe, 'days')}
                className={`px-3 py-2 text-sm font-medium rounded-l-md border ${
                  task.timeframeUnit === 'days'
                    ? 'bg-blue-50 text-blue-700 border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Days
              </button>
              <button
                type="button"
                onClick={() => handleTimeframeChange(task.timeframe, 'weeks')}
                className={`px-3 py-2 text-sm font-medium border-l-0 border ${
                  task.timeframeUnit === 'weeks'
                    ? 'bg-blue-50 text-blue-700 border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Weeks
              </button>
              <button
                type="button"
                onClick={() => handleTimeframeChange(task.timeframe, 'months')}
                className={`px-3 py-2 text-sm font-medium rounded-r-md border-l-0 border ${
                  task.timeframeUnit === 'months'
                    ? 'bg-blue-50 text-blue-700 border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Months
              </button>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date *
          </label>
          <div className="relative">
            <input
              ref={dateInputRef}
              type="date"
              id="startDate"
              required
              value={task.startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              onClick={(e) => {
                e.currentTarget.focus();
                e.currentTarget.click();
              }}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Estimated Completion
        </label>
        <div className="mt-1 flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="h-5 w-5 text-gray-400" />
          <span>{new Date(task.endDate).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {initialData ? 'Save Changes' : 'Add Task'}
        </button>
      </div>
    </form>
  );
};