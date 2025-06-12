import React, { useState } from "react";
import {
  Calendar,
  Clock,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Package,
  Plus,
  Minus,
  Edit2,
  Trash2,
  Info,
} from "lucide-react";
import { Task } from "./types";
import { TaskForm } from "./TaskForm";
import DeleteConfirmationModal from  "./DeleteConfirmation.jsx"
import { QwilloLogo } from "../../../components/QwilloLogo";
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_PUBLIC_GENAI_API_KEY!
);

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenMaterialsStore: (task: Task) => void;
}

interface LaborState {
  hours: number;
  rate: number;
  totalAmount: number;
  useTotal: boolean;
  hasChanges: boolean;
  isEditing: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onEditTask,
  onDeleteTask,
  onOpenMaterialsStore,
  editTask

}) => {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [laborStates, setLaborStates] = useState<Record<string, LaborState>>(
    {}
  );
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);


  const handleDeleteClick = (e, task) => {
    e.stopPropagation();
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      onDeleteTask(taskToDelete.id);
      setShowDeleteModal(false);
      setTaskToDelete(null);
    }
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const calculateTaskTotal = (task: Task) => {
    const materialsTotal =
      task.materials?.reduce(
        (sum, material) => sum + material.price * material.quantity,
        0
      ) || 0;

    const laborTotal = task.labor ? task.labor.hours * task.labor.rate : 0;

    return materialsTotal + laborTotal;
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    taskId: string
  ) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";

    const taskElement = e.currentTarget;
    taskElement.classList.add("drag-over");
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const taskElement = e.currentTarget;
    taskElement.classList.remove("drag-over");
  };

  const handleDrop = (e: React.DragEvent, task: Task) => {
    e.preventDefault();
    try {
      const materialData = e.dataTransfer.getData("application/json");
      if (!materialData) return;

      const material = JSON.parse(materialData);

      const existingMaterial = task.materials?.find(
        (m) => m.id === material.id
      );

      if (existingMaterial) {
        const updatedMaterials = task.materials?.map((m) =>
          m.id === material.id ? { ...m, quantity: m.quantity + 1 } : m
        );

        onEditTask({
          ...task,
          materials: updatedMaterials,
        });
      } else {
        const updatedTask = {
          ...task,
          materials: [
            ...(task.materials || []),
            {
              id: material.id,
              name: material.name,
              quantity: 1,
              unit: material.unit,
              price: material.price,
            },
          ],
        };

        onEditTask(updatedTask);
      }

      e.currentTarget.classList.remove("drag-over");
    } catch (error) {
      console.error("Error handling drop:", error);
    }
  };

  const fetchAIResponse = async (userMessage) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const result = await model.generateContent(
        `Summarize the following text concisely while keeping the key details but not in third person give response in pov of author:\n\n"${userMessage}"`
      );
      const response = await result.response;
      const aiText = response.text().trim();

      return aiText || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
      console.error("Error fetching AI response:", error);
      return "Oops! Something went wrong while communicating with AI.";
    }
  };

  const handleSummarize = async (task,newNote) => {
    console.log('new nt',newNote)
    if (!newNote?.trim()) return; // Prevents empty input
    const btn = document.getElementById("ai-summarize-btn");
    console.log('btn',btn)
    if (btn) {
      btn.textContent = "Summarizing...";
      btn.classList.add("animate-pulse");
    }

    const summarizedText = await fetchAIResponse(newNote);

    onEditTask({ ...task, newNote: summarizedText });

    if (btn) {
      btn.textContent = "AI Summarize";
      btn.classList.remove("animate-pulse");
    }
  };

  const handleLaborEdit = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();

    setLaborStates((prev) => ({
      ...prev,
      [task.id]: {
        hours: task.labor?.hours === 1 ? 0 : task.labor?.hours || 0,
        rate: task.labor?.hours === 1 ? task.labor.rate : task.labor?.rate || 0,
        totalAmount: task.labor?.hours === 1 ? task.labor.rate : 0,
        useTotal: task.labor?.hours === 1,
        hasChanges: false,
        isEditing: true,
      },
    }));
  };

  const handleTotalAmountChange = (
    taskId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(e.target.value) || 0;
    if (value >= 0) {
      setLaborStates((prev) => ({
        ...prev,
        [taskId]: {
          ...prev[taskId],
          totalAmount: value,
          hasChanges: true,
        },
      }));
    }
  };

  const handleLaborSave = (task: Task) => {
    const laborState = laborStates[task.id];
    if (!laborState) return;

    if (laborState.useTotal) {
      onEditTask({
        ...task,
        labor: { hours: 1, rate: laborState.totalAmount },
      });
    } else {
      onEditTask({
        ...task,
        labor: { hours: laborState.hours, rate: laborState.rate },
      });
    }
    setLaborStates((prev) => {
      const { [task.id]: removed, ...rest } = prev;
      return rest;
    });
  };

  const handleLaborCancel = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLaborStates((prev) => {
      const { [taskId]: removed, ...rest } = prev;
      return rest;
    });
  };

  const handleLaborHoursChange = (taskId: string, change: number) => {
    setLaborStates((prev) => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        hours: Math.max(0, prev[taskId].hours + change),
        hasChanges: true,
      },
    }));
  };

  const handleLaborRateChange = (taskId: string, change: number) => {
    setLaborStates((prev) => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        rate: Math.max(0, prev[taskId].rate + change),
        hasChanges: true,
      },
    }));
  };

  const handleMaterialQuantityChange = (
    task: Task,
    materialId: string,
    value: string
  ) => {
    const quantity = parseInt(value) || 0;
    if (quantity >= 0) {
      const updatedMaterials = task.materials?.map((material) =>
        material.id === materialId ? { ...material, quantity } : material
      );
      onEditTask({
        ...task,
        materials: updatedMaterials,
      });
    }
  };

  const handleLaborHoursInput = (
    taskId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(e.target.value) || 0;
    if (value >= 0) {
      setLaborStates((prev) => ({
        ...prev,
        [taskId]: {
          ...prev[taskId],
          hours: value,
          hasChanges: true,
        },
      }));
    }
  };

  const handleLaborRateInput = (
    taskId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(e.target.value) || 0;
    if (value >= 0) {
      setLaborStates((prev) => ({
        ...prev,
        [taskId]: {
          ...prev[taskId],
          rate: value,
          hasChanges: true,
        },
      }));
    }
  };

  const toggleLaborMode = (taskId: string, useTotal: boolean) => {
    setLaborStates((prev) => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        useTotal,
        hasChanges: false,
      },
    }));
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "completed":
        return {
          bgColor: "bg-green-100",
          textColor: "text-green-600",
          ringColor: "ring-green-600/20",
        };
      case "in-progress":
        return {
          bgColor: "bg-blue-100",
          textColor: "text-blue-600",
          ringColor: "ring-blue-600/20",
        };
      default:
        return {
          bgColor: "bg-gray-100",
          textColor: "text-gray-600",
          ringColor: "ring-gray-600/20",
        };
    }
  };

  return (
    <div className="space-y-4">
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        taskTitle={taskToDelete?.title || ""}
      />
      {tasks.map((task) => {
        const statusInfo = getStatusInfo(task.status || "not-started");
        const isExpanded = expandedTaskId === task.id;
        const laborState = laborStates[task.id];

        return (
          <div
            key={task.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
            onDragOver={(e) => handleDragOver(e, task.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, task)}
          >
            <div
              className="p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
            >
              <div className="flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${statusInfo.bgColor} ${statusInfo.textColor} ring-2 ${statusInfo.ringColor} transition-all duration-200`}
                    >
                      {task.status === "completed" ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : task.status === "in-progress" ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {task.title}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    {task?.isAdditional && (
                      <div className="relative group">
                        <span
                          className={`cursor-help ${
                            task.additionalStatus === "approved"
                              ? "text-green-500"
                              : task.additionalStatus === "rejected"
                              ? "text-red-500"
                              : "text-blue-500"
                          }`}
                        >
                          <Info size={16} />
                        </span>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-black text-white text-xs px-3 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg max-w-xs">
                          {task.additionalStatus === "approved" ? (
                            <span>Additional task (Approved)</span>
                          ) : task.additionalStatus === "rejected" ? (
                            <div>
                              <span>Additional task (Rejected)</span>
                              {task.additionalReview && (
                                <div className="mt-1 border-t border-gray-600 pt-1">
                                  <span className="font-semibold">Reason:</span>{" "}
                                  {task.additionalReview}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span>This is an additional task</span>
                          )}
                        </div>
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedTaskId(isExpanded ? null : task.id);
                        setEditingTaskId(task.id);
                        onEditTask(task);
                        editTask(task);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        handleDeleteClick(e, task);
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>
                        {formatDate(task.startDate)} -{" "}
                        {formatDate(task.dueDate)}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <DollarSign className="w-4 h-4 mr-1" />
                      <span>
                        Total: {formatCurrency(calculateTaskTotal(task))}
                      </span>
                    </div>
                  </div>
                  {task.isMilestonePayment && task.paymentAmount && (
                    <div className="flex items-center">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          task.paymentStatus === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        Payment: {formatCurrency(task.paymentAmount)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {isExpanded && (
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="space-y-4">
                  {task.description && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Description
                      </h4>
                      <p className="text-gray-900">{task.description}</p>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-700">
                        Materials
                      </h4>
                      <button
                        onClick={() => onOpenMaterialsStore(task)}
                        className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md shadow flex items-center transition-colors"
                      >
                        <Package className="w-4 h-4 mr-1" />
                        {task.materials?.length
                          ? "Add More Materials"
                          : "Add Materials"}
                      </button>
                    </div>
                    {task.materials && task.materials.length > 0 && (
                      <div className="space-y-2">
                        {task.materials.map((material) => (
                          <div
                            key={material.id}
                            className="flex items-center justify-between bg-white p-2 rounded-lg"
                          >
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {material.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                ${material.price} per {material.unit}
                              </p>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() =>
                                    handleMaterialQuantityChange(
                                      task,
                                      material.id,
                                      (material.quantity - 1).toString()
                                    )
                                  }
                                  className="p-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <input
                                  type="number"
                                  value={material.quantity}
                                  onChange={(e) =>
                                    handleMaterialQuantityChange(
                                      task,
                                      material.id,
                                      e.target.value
                                    )
                                  }
                                  className="w-16 text-center border border-gray-200 rounded-md py-1 px-2 text-sm"
                                  min="0"
                                />
                                <button
                                  onClick={() =>
                                    handleMaterialQuantityChange(
                                      task,
                                      material.id,
                                      (material.quantity + 1).toString()
                                    )
                                  }
                                  className="p-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                $
                                {(material.price * material.quantity).toFixed(
                                  2
                                )}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-700">
                        Labor
                      </h4>
                      {!laborState?.isEditing && (
                        <button
                          onClick={(e) => handleLaborEdit(task, e)}
                          className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md shadow flex items-center transition-colors"
                        >
                          <Clock className="w-4 h-4 mr-1" />
                          {task.labor ? "Edit Labor" : "Add Labor"}
                        </button>
                      )}
                    </div>
                    {laborState?.isEditing ? (
                      <div className="space-y-3 bg-white p-3 rounded-lg">
                        <div className="flex items-start space-x-2 mb-4 w-1/2">
                          <button
                            onClick={() => toggleLaborMode(task.id, false)}
                            className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                              !laborState.useTotal
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            Hours & Rate
                          </button>
                          <button
                            onClick={() => toggleLaborMode(task.id, true)}
                            className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                              laborState.useTotal
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            Enter Total Amount
                          </button>
                          <button
                            className="flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 bg-blue-600 text-white relative hover:bg-blue-700 active:scale-95"
                            disabled
                          >
                            SUB OUT
                            <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px] font-medium bg-blue-500 text-white rounded-full">
                              Coming Soon
                            </span>
                          </button>
                        </div>

                        {laborState.useTotal ? (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              Total Labor Amount:
                            </span>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center">
                                <DollarSign className="w-4 h-4 text-gray-400 absolute ml-2" />
                                <input
                                  type="number"
                                  value={laborState.totalAmount}
                                  onChange={(e) =>
                                    handleTotalAmountChange(task.id, e)
                                  }
                                  className="w-32 text-right border border-gray-200 rounded-md py-1 pl-8 pr-2 text-sm"
                                  min="0"
                                  step="0.01"
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">
                                Hours:
                              </span>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() =>
                                    handleLaborHoursChange(task.id, -1)
                                  }
                                  className="p-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <input
                                  type="number"
                                  value={laborState.hours}
                                  onChange={(e) =>
                                    handleLaborHoursInput(task.id, e)
                                  }
                                  className="w-16 text-center border border-gray-200 rounded-md py-1 px-2 text-sm"
                                  min="0"
                                />
                                <button
                                  onClick={() =>
                                    handleLaborHoursChange(task.id, 1)
                                  }
                                  className="p-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">
                                Rate per Hour:
                              </span>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() =>
                                    handleLaborRateChange(task.id, -5)
                                  }
                                  className="p-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <div className="flex items-center">
                                  <DollarSign className="w-4 h-4 text-gray-400 absolute ml-2" />
                                  <input
                                    type="number"
                                    value={laborState.rate}
                                    onChange={(e) =>
                                      handleLaborRateInput(task.id, e)
                                    }
                                    className="w-24 text-right border border-gray-200 rounded-md py-1 pl-8 pr-2 text-sm"
                                    min="0"
                                  />
                                </div>
                                <button
                                  onClick={() =>
                                    handleLaborRateChange(task.id, 5)
                                  }
                                  className="p-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <span className="text-sm font-medium text-gray-700">
                            Total:
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            $
                            {laborState.useTotal
                              ? laborState.totalAmount.toFixed(2)
                              : (laborState.hours * laborState.rate).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-end space-x-2 pt-2">
                          <button
                            onClick={(e) => handleLaborCancel(task.id, e)}
                            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                          >
                            Cancel
                          </button>
                          {laborState.hasChanges && (
                            <button
                              onClick={() => handleLaborSave(task)}
                              className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                            >
                              Save
                            </button>
                          )}
                        </div>
                      </div>
                    ) : task.labor ? (
                      <div className="bg-white p-3 rounded-lg">
                        {task.labor.hours === 1 ? (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Rate:</span>
                            <span className="font-medium text-gray-900">
                              ${task.labor.rate}
                            </span>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Hours:</span>
                              <span className="font-medium text-gray-900">
                                {task.labor.hours}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm mt-1">
                              <span className="text-gray-600">
                                Rate per Hour:
                              </span>
                              <span className="font-medium text-gray-900">
                                ${task.labor.rate}
                              </span>
                            </div>
                          </>
                        )}
                        <div className="flex items-center justify-between text-sm mt-2 pt-2 border-t border-gray-100">
                          <span className="font-medium text-gray-700">
                            Total:
                          </span>
                          <span className="font-medium text-gray-900">
                            ${(task.labor.hours * task.labor.rate).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {task.isMilestonePayment && task.paymentAmount && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Scheduled Payment
                      </h4>
                      <div className="bg-white p-3 rounded-lg">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Payment Amount:</span>
                          <span className="font-medium text-gray-900">
                            ${task.paymentAmount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-2">
                          <span className="text-gray-600">Status:</span>
                          <span
                            className={`font-medium ${
                              task.paymentStatus === "approved"
                                ? "text-green-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {task.paymentStatus === "approved"
                              ? "Approved"
                              : "Pending"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </h4>
                    <div className="relative">
                      {/* Textarea for new notes */}
                      <textarea
                        value={task.newNote || ""}
                        onChange={(e) =>
                          onEditTask({ ...task, newNote: e.target.value })
                        }
                        placeholder="Add a new note..."
                        className="w-full px-3 py-2 pr-10 text-gray-900 bg-white border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none"
                        rows={3}
                      />

                      {/* AI Summarize Button (Only visible when text exists) */}
                      {task.newNote?.trim() && (
                        <button
                          id="ai-summarize-btn"
                          onClick={() => {
                            handleSummarize(task, task.newNote);
                          }}
                          className="absolute bottom-2 right-2 px-2 py-1 rounded-md text-gray-400 hover:text-blue-500 transition-opacity bg-white"
                          title="AI Summarize"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4">
                              <QwilloLogo variant="icon" />
                            </div>
                            <span>AI Summarize</span>
                          </div>
                        </button>
                      )}
                    </div>

                    {/* Save Note Button */}
                    {task?.newNote?.trim() && (
                      <button
                        onClick={() => {
                          if (!task.newNote?.trim()) return;
                          const updatedNotes = [
                            ...(task.notes || []),
                            task.newNote.trim(),
                          ];
                          onEditTask({
                            ...task,
                            notes: updatedNotes,
                            newNote: "",
                          });
                        }}
                        className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition"
                      >
                        Save Note
                      </button>
                    )}
                    {/* Display Saved Notes */}
                    {task?.notes?.length > 0 && (
                      <ul className="mt-3 space-y-2">
                        {task?.notes.map((note, index) => {
                          const isChangeOrderNote =
                            /^Change order CO-.* approved on/.test(note);

                          return (
                            <li
                              key={index}
                              className="relative bg-gray-100 p-4 rounded-lg border border-gray-300"
                            >
                              {/* Delete Button in top-right */}
                              {!isChangeOrderNote && (
                                <button
                                  onClick={() => {
                                    const updatedNotes = task.notes.filter(
                                      (_, i) => i !== index
                                    );
                                    onEditTask({
                                      ...task,
                                      notes: updatedNotes,
                                    });
                                  }}
                                  className="absolute top-2 right-2 text-red-500 text-xs hover:underline"
                                >
                                  Delete
                                </button>
                              )}

                              {/* Note Content */}
                              <p className="text-black">
                                {isChangeOrderNote ? `timeline: ${note}` : note}
                              </p>
                            </li>
                          );
                        })}
                      </ul>
                    )}
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
