import React, { useEffect, useState } from "react";
import {
  Clock,
  AlertCircle,
  ChevronDown,
  X,
  CheckCircle,
  Play,
} from "lucide-react";
import { Task } from "./types";
import axiosInstance from "../../../axios";

interface TaskActionsProps {
  task: Task;
  onUpdateTask: (task: Task) => void;
}

export const TaskActions: React.FC<TaskActionsProps> = ({
  task,
  onUpdateTask,
}) => {
  const [showDelayOptions, setShowDelayOptions] = useState(false);
  const [delayReason, setDelayReason] = useState("");
  const [delayTime, setDelayTime] = useState("");
  const [delayAmount, setDelayAmount] = useState("");
  const [timeUnit, setTimeUnit] = useState("hours"); // Default to hours
  const [delayNotes, setDelayNotes] = useState("");
  const [pendingStatus, setPendingStatus] = useState<
    "in-progress" | "completed" | null
  >(null);
  const [showStatusPopup, setShowStatusPopup] = useState(false);
  const [statusPopupMessage, setStatusPopupMessage] = useState("");
  const [animateButton, setAnimateButton] = useState(false);

  console.log("task", task);

  useEffect(() => {
    if (task.delays || task.delay) {
      // Handle delay data if needed
    }
  }, [task]);

  // Auto-hide the status popup after 3 seconds
  useEffect(() => {
    if (showStatusPopup) {
      const timer = setTimeout(() => {
        setShowStatusPopup(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showStatusPopup]);

  const updateTaskDelay = async (taskId, delayData) => {
    try {
      const response = await axiosInstance.post(
        `/quote/v2/tasks/${taskId}/delay`,
        delayData
      );
      return response.data; // Returns the updated task data
    } catch (error) {
      console.error(
        "Error updating task delay:",
        error?.response?.data || error.message
      );
      throw error;
    }
  };

  const handleStatusChange = (newStatus: "in-progress" | "completed") => {
    setPendingStatus(newStatus);
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      const response = await axiosInstance.put(
        `/quote/v2/tasks/${taskId}/status`,
        { status }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error updating task status:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  const handleStatusConfirm = async () => {
    if (!pendingStatus) return;

    // Update the task
    onUpdateTask({
      ...task,
      status: pendingStatus,
      completedDate:
        pendingStatus === "completed" ? new Date().toISOString() : undefined,
    });

    await updateTaskStatus(task.id, pendingStatus);

    // Show popup based on status
    if (pendingStatus === "in-progress") {
      setStatusPopupMessage("Task has been started!");
    } else if (pendingStatus === "completed") {
      setStatusPopupMessage("Task ready for review");
    }

    setShowStatusPopup(true);
    setAnimateButton(true);

    // Reset animation after it plays
    setTimeout(() => {
      setAnimateButton(false);
    }, 1000);

    setPendingStatus(null);
  };

  const handleStatusCancel = () => {
    setPendingStatus(null);
  };

  const handleDelay = async () => {
    if (!delayNotes.trim() || !delayTime) return;

    const newDelay = {
      reason: delayReason,
      delayTime,
      delayAmount: delayAmount,
      delayUnit: timeUnit,
      notes: delayNotes,
      date: new Date().toISOString(),
    };

    console.log("delay", newDelay);

    try {
      // Send to backend
      await updateTaskDelay(task.id, newDelay);

      // Update local state
      onUpdateTask({
        ...task,
        delays: [...(task.delays || []), newDelay], // Push instead of replacing
      });

      console.log("Delay added:", newDelay);

      // Reset fields
      setShowDelayOptions(false);
      setDelayReason("");
      setDelayTime("");
      setTimeUnit("hours");
      setDelayNotes("");
      setDelayAmount("");
    } catch (error) {
      console.error("Error adding delay:", error);
    }
  };

  const handleRemoveDelay = (index) => {
    if (!task.delays) return;

    const updatedDelays = task.delays.filter((_, i) => i !== index);
    onUpdateTask({
      ...task,
      delays: updatedDelays,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="mt-4 space-y-4 relative">
      {/* Status Popup Notification */}
      {showStatusPopup && (
        <div className="absolute top-0 left-0 right-0 flex justify-center z-10">
          <div
            className={`bg-white shadow-lg rounded-lg px-4 py-3 flex items-center text-sm font-medium ${
              statusPopupMessage.includes("completed")
                ? "text-green-600"
                : "text-blue-600"
            } border ${
              statusPopupMessage.includes("completed")
                ? "border-green-200"
                : "border-blue-200"
            } animate-fadeIn`}
          >
            {statusPopupMessage.includes("completed") ? (
              <CheckCircle className="w-5 h-5 mr-2" />
            ) : (
              <Play className="w-5 h-5 mr-2" />
            )}
            {statusPopupMessage}
          </div>
        </div>
      )}

      {/* Status Controls */}
      <div className="flex flex-col bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Task Status</span>
          <div className="flex space-x-2">
            {task.status !== "completed" && (
              <button
                onClick={() => handleStatusChange("in-progress")}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  animateButton && pendingStatus === "in-progress"
                    ? "animate-sparkle"
                    : ""
                } ${
                  task.status === "in-progress"
                    ? "bg-blue-200 text-blue-800"
                    : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                }`}
              >
                {task.status === "in-progress" ? "In Progress" : "Start"}
              </button>
            )}
            {task.status === "in-progress" && (
              <button
                onClick={() => handleStatusChange("completed")}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  animateButton && pendingStatus === "completed"
                    ? "animate-sparkle"
                    : ""
                } ${
                  task.status === "completed"
                    ? "bg-green-200 text-green-800"
                    : "bg-green-100 text-green-600 hover:bg-green-200"
                }`}
              >
                Complete
              </button>
            )}
          </div>
        </div>

        {/* Status Change Confirmation */}
        {pendingStatus && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Confirm changing status to{" "}
                {pendingStatus === "in-progress" ? "Started" : "Completed"}?
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={handleStatusCancel}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusConfirm}
                  className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delay Controls */}
      {task.status !== "completed" && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">
              Delay Status
            </span>
            <button
              onClick={() => setShowDelayOptions(!showDelayOptions)}
              className="px-3 py-1.5 text-sm text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors flex items-center"
            >
              <Clock className="w-4 h-4 mr-1.5" />
              Report Delay
            </button>
          </div>
          {showDelayOptions && (
            <div className="space-y-3">
              {/* Delay Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delay Reason
                </label>
                <select
                  value={delayReason}
                  onChange={(e) => setDelayReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select reason...</option>
                  <option value="weather">Weather</option>
                  <option value="material-delivery">Material Delivery</option>
                  <option value="scheduling">Scheduling</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Delay Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delay Duration
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={delayTime}
                    onChange={(e) => setDelayTime(e.target.value)}
                    min="1"
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter duration"
                  />
                  <select
                    value={timeUnit}
                    onChange={(e) => setTimeUnit(e.target.value)}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                  </select>
                </div>
              </div>

              {/* Delay Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delay Cost (Amount)
                </label>
                <input
                  type="number"
                  value={delayAmount}
                  onChange={(e) => setDelayAmount(e.target.value)}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter amount"
                />
              </div>

              {/* Delay Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={delayNotes}
                  onChange={(e) => setDelayNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  rows={3}
                  placeholder="Provide details about the delay..."
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => {
                    setShowDelayOptions(false);
                    setDelayReason("");
                    setDelayNotes("");
                    setDelayTime("");
                    setDelayAmount("");
                    setTimeUnit("hours");
                  }}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelay}
                  disabled={
                    !delayReason ||
                    !delayNotes.trim() ||
                    !delayTime ||
                    !delayAmount
                  }
                  className="px-3 py-1.5 text-sm text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Delay
                </button>
              </div>
            </div>
          )}

          {/* Delay History */}
          {task.delays && task.delays.length > 0 && (
            <div className="mt-3 space-y-3">
              {task.delays.map((delay, index) => (
                <div
                  key={index}
                  className="bg-orange-50 border border-orange-100 rounded-lg p-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-orange-800">
                          Delay Reported: {formatDate(delay.date)}
                        </p>
                        <p className="text-sm text-orange-700 mt-1">
                          Reason:{" "}
                          {delay?.reason.charAt(0).toUpperCase() +
                            delay.reason.slice(1)}
                        </p>
                        <p className="text-sm text-orange-700 mt-1">
                          {delay.notes}
                        </p>
                        <p className="text-sm text-orange-700 mt-1">
                          Delayed by: {delay?.delayTime} {delay?.delayUnit}
                        </p>
                        {delay?.delayAmount && (
                          <p className="text-sm text-orange-700 mt-1 font-semibold">
                            Additional Cost: ${delay.delayAmount}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveDelay(index)}
                      className="text-orange-600 hover:text-orange-800 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add this style tag to include the CSS animations */}
      {/* <style jsx>{`
        @keyframes sparkle {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 10px 4px rgba(59, 130, 246, 0.3);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-sparkle {
          animation: sparkle 0.8s ease-in-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style> */}
    </div>
  );
};
