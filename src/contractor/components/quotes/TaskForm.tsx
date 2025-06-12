import React, { useState, useRef, useEffect } from "react";
import { Clock, Search, Plus } from "lucide-react";
import { getStandardTasks } from "../projects/standardTasks";
import { Task } from "./types";

interface TaskFormProps {
  onSubmit: (task: Task) => void;
  onCancel: () => void;
  initialData?: Task;
  existingTasks?: Task[];
}

export const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  existingTasks = [],
}) => {
  console.log("initialData", initialData);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState(initialData?.title || "");
  const [showDropdown, setShowDropdown] = useState(false);
  const [task, setTask] = useState({
    id: initialData?.id || "",
    title: initialData?.title || "",
    description: initialData?.description || "",
    timeframe: initialData?.timeframe || 1,
    timeframeUnit: initialData?.timeframeUnit || ("days" as const),
    startDate: initialData?.startDate || new Date().toISOString().split("T")[0],
    endDate: initialData?.endDate || "",
    labor: initialData?.labor || null,
    materials: initialData?.materials || [],
    isMilestonePayment: initialData?.isMilestonePayment || false,
    paymentAmount: initialData?.paymentAmount || 0,
  });

  // Get standard tasks and filter out existing ones (excluding the current task being edited)
  const standardTasks = getStandardTasks(
    "Interior Renovation & Remodeling",
    "Kitchen Remodeling"
  ).filter(
    (standardTask) =>
      !existingTasks.some(
        (existingTask) =>
          existingTask.title.toLowerCase() ===
            standardTask.title.toLowerCase() &&
          (!initialData || existingTask.id !== initialData.id)
      )
  );

  // Filter tasks based on search term
  const filteredTasks = standardTasks.filter((standardTask) =>
    standardTask.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateEndDate = (
    startDate: string,
    timeframe: number,
    unit: "days" | "weeks" | "months"
  ) => {
    const date = new Date(startDate);
    let days = timeframe;
    if (unit === "weeks") days = timeframe * 7;
    if (unit === "months") days = timeframe * 30;
    date.setDate(date.getDate() + days);
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    // Initialize endDate when component mounts
    if (!task.endDate) {
      const endDate = calculateEndDate(
        task.startDate,
        task.timeframe,
        task.timeframeUnit
      );
      setTask((prev) => ({
        ...prev,
        endDate,
      }));
    }
  }, []);

  const handleTimeframeChange = (
    value: number,
    unit: "days" | "weeks" | "months"
  ) => {
    const endDate = calculateEndDate(task.startDate, value, unit);
    setTask((prev) => ({
      ...prev,
      timeframe: value,
      timeframeUnit: unit,
      endDate,
    }));
  };

  const handleStartDateChange = (date: string) => {
    const endDate = calculateEndDate(date, task.timeframe, task.timeframeUnit);
    setTask((prev) => ({
      ...prev,
      startDate: date,
      endDate,
    }));
  };

  const handleTaskSelect = (selectedTask: any) => {
    const endDate = calculateEndDate(
      task.startDate,
      selectedTask.timeframe || task.timeframe,
      selectedTask.timeframeUnit || task.timeframeUnit
    );

    setTask((prev) => ({
      ...prev,
      ...selectedTask,
      id: initialData?.id || prev.id, // Keep the original ID when editing
      startDate: prev.startDate,
      endDate,
      // Preserve existing labor and materials if they exist and aren't in the selected task
      labor: selectedTask.labor || prev.labor,
      materials: selectedTask.materials || prev.materials,
      isMilestonePayment:
        selectedTask.isMilestonePayment || prev.isMilestonePayment,
      paymentAmount: selectedTask.paymentAmount || prev.paymentAmount,
    }));

    setSearchTerm(selectedTask.title);
    setShowDropdown(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setTask((prev) => ({ ...prev, title: value }));
    setShowDropdown(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedTask = {
      ...task,
      title: searchTerm, // Use the search term as the title
      endDate: calculateEndDate(
        task.startDate,
        task.timeframe,
        task.timeframeUnit
      ),
    };

    console.log("Submitting task:", updatedTask);
    onSubmit(updatedTask);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".task-search-container")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="task-search-container">
        <label
          htmlFor="taskTitle"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Task Title *
        </label>
        <div className="relative">
          <input
            type="text"
            autocomplete="off"
            id="taskTitle"
            required
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setShowDropdown(true)}
            className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            placeholder="Search or enter task title..."
          />

          {/* Task Suggestions Dropdown */}
          {showDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200">
              <ul className="max-h-60 overflow-auto py-1">
                {filteredTasks.map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-900"
                    onClick={() => handleTaskSelect(suggestion)}
                  >
                    {suggestion.title}
                  </li>
                ))}
                {searchTerm && filteredTasks.length === 0 && (
                  <li
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm flex items-center text-blue-600"
                    onClick={() => {
                      handleTaskSelect({
                        title: searchTerm,
                        description: "",
                        timeframe: task.timeframe,
                        timeframeUnit: task.timeframeUnit,
                      });
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add "{searchTerm}" to list
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Task Description
        </label>
        <textarea
          id="description"
          rows={3}
          value={task.description}
          onChange={(e) =>
            setTask((prev) => ({ ...prev, description: e.target.value }))
          }
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
              onChange={(e) =>
                handleTimeframeChange(
                  parseInt(e.target.value) || 1,
                  task.timeframeUnit
                )
              }
              className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            <div className="flex rounded-md shadow-sm">
              <button
                type="button"
                onClick={() => handleTimeframeChange(task.timeframe, "days")}
                className={`px-3 py-2 text-sm font-medium rounded-l-md border ${
                  task.timeframeUnit === "days"
                    ? "bg-blue-50 text-blue-700 border-blue-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Days
              </button>
              <button
                type="button"
                onClick={() => handleTimeframeChange(task.timeframe, "weeks")}
                className={`px-3 py-2 text-sm font-medium border-l-0 border ${
                  task.timeframeUnit === "weeks"
                    ? "bg-blue-50 text-blue-700 border-blue-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Weeks
              </button>
              <button
                type="button"
                onClick={() => handleTimeframeChange(task.timeframe, "months")}
                className={`px-3 py-2 text-sm font-medium rounded-r-md border-l-0 border ${
                  task.timeframeUnit === "months"
                    ? "bg-blue-50 text-blue-700 border-blue-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Months
              </button>
            </div>
          </div>
        </div>
        <div>
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
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
          {initialData ? "Save" : "Add Task"}
        </button>
      </div>
    </form>
  );
};
