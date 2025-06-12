import React, { useState, useEffect } from "react";
import {
  Clock,
  DollarSign,
  Calendar,
  ChevronDown,
  ChevronUp,
  Plus,
  Layers,
  Info,
  Check,
  Send,
  InfoIcon,
} from "lucide-react";
import { TaskForm } from "./TaskForm";
import { TaskList } from "./TaskList";
import { MaterialsStore } from "./MaterialsStore";
import { Task } from "./types";
import { PaymentScheduleButton } from "./PaymentScheduleButton";
import { PaymentScheduleForm } from "./PaymentScheduleForm";
import axiosInstance from "../../../axios";
import { useLoader } from "../../../context/LoaderContext";
import { toast } from "react-toastify";
import AnimatedSubmitButton from "./SubmitButtonAnimated";

// Animation popup component for task save confirmation
const SaveConfirmPopup = ({ isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-white rounded-lg shadow-lg p-4 flex items-center space-x-3 animate-fadeIn">
        <div className="bg-green-100 rounded-full p-1">
          <Check className="w-5 h-5 text-green-600 animate-checkmarkFade" />
        </div>
        <span className="font-medium text-gray-700">
          Task saved successfully!
        </span>
      </div>
    </div>
  );
};

// Animation popup component for approval submission
const ApprovalPopup = ({ isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
        <div className="flex flex-col items-center">
          <div className="relative">
            <Send className="w-12 h-12 text-blue-500 animate-flyAway opacity-0" />
            <span className="absolute top-0 left-0 w-12 h-12 flex items-center justify-center text-blue-500">
              <Send className="w-12 h-12 animate-sendPlane" />
            </span>
          </div>
          <h3 className="mt-4 text-xl font-bold text-gray-800">
            Quote Sent for Approval
          </h3>
          <p className="mt-2 text-gray-600 text-center">
            Your quote has been sent to the customer for approval. You'll be
            notified when they respond.
          </p>
        </div>
      </div>
    </div>
  );
};

interface PendingQuoteCardProps {
  projectName: string;
  customerName: string;
  projectType: string;
  id: string;
  setContext: any;
  doCombineCosts?: boolean;
  reviewMessage?: string;
  status?: string;
}

const projectTypes = {
  "Interior Renovation & Remodeling": [
    "Kitchen Remodeling",
    "Bathroom Renovation",
    "Basement Finishing & Remodeling",
    "Attic Conversion",
    "Whole Home Renovation",
    "Interior Wall Removal & Open Concept Conversion",
    "Garage Conversion",
    "Laundry Room Upgrade or Expansion",
    "Walk-in Closet Addition or Expansion",
    "Mudroom Addition or Renovation",
  ],
  "Home Additions & Expansions": [
    "Single-Room Home Addition",
    "Multi-Room Home Addition",
    "Second Story Addition",
    "Sunroom Addition",
    "In-Law Suite Addition",
    "ADU Construction",
    "Garage Addition",
    "Covered Patio or Porch Addition",
  ],
  "Roofing & Exterior Renovation": [
    "Roof Replacement or Repair",
    "Gutter Installation or Replacement",
    "Siding Replacement or Exterior Cladding",
    "Exterior Painting or Refinishing",
    "Window Replacement & Installation",
    "Door Replacement",
    "Chimney Repair & Restoration",
  ],
  "Landscaping & Outdoor Living": [
    "General Landscaping Design & Installation",
    "Lawn Irrigation System Installation",
    "Driveway Paving or Replacement",
    "Patio or Deck Construction",
    "Outdoor Kitchen Installation",
    "Pergola or Gazebo Installation",
    "Fire Pit or Outdoor Fireplace Installation",
    "Fence Installation or Repair",
    "Retaining Wall Installation",
    "Swimming Pool Construction",
    "Hot Tub or Spa Installation",
    "Pond or Water Feature Installation",
    "Outdoor Lighting Installation",
  ],
  "Structural & Utility Work": [
    "Foundation Repair or Reinforcement",
    "Crawl Space Encapsulation",
    "Seismic Retrofitting",
    "Energy-Efficient Window & Door Upgrades",
    "Waterproofing & Drainage Solutions",
  ],
  "Electrical & Smart Home Upgrades": [
    "General Electrical Work & Rewiring",
    "Home Automation & Smart Home Installation",
    "EV Charging Station Installation",
    "Solar Panel Installation",
    "Backup Generator Installation",
    "Security System & Surveillance Installation",
    "Indoor/Outdoor Lighting Upgrades",
  ],
  "Plumbing & HVAC": [
    "General Plumbing Work",
    "Water Heater Replacement or Tankless Upgrade",
    "Whole-House Repiping",
    "Sewer Line Repair or Replacement",
    "Gas Line Installation or Repair",
    "Well Water & Filtration System Installation",
    "HVAC System Replacement or Installation",
    "Ductwork Installation or Cleaning",
    "Radiant Floor Heating Installation",
    "Whole-House Humidifier or Dehumidifier Installation",
  ],
  "Specialty & Custom Projects": [
    "Custom Home Build",
    "Tiny Home Construction",
    "Barn or Shed Construction",
    "Home Theater or Media Room Installation",
    "Wine Cellar or Home Bar Installation",
    "Home Office Buildout or Soundproofing",
    "Custom Staircase Installation",
    "Safe Room or Storm Shelter Installation",
    "Pet-Friendly Home Modifications",
  ],
};

const primaryCategories = Object.keys(projectTypes);

export const PendingQuoteCard: React.FC<PendingQuoteCardProps> = ({
  projectName,
  customerName,
  projectType,
  id,
  setContext,
  doCombineCosts,
  reviewMessage,
  status = "pending",
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(
    "Interior Renovation & Remodeling"
  );

  const hasTasksWithMissingPayment = (tasks: Task[]): boolean => {
    console.log("taskas", tasks);
    if (tasks.length === 0) return true;
    return tasks.some(
      (task) => task.paymentAmount == null || task.paymentAmount == 0
    );
  };

  const [selectedType, setSelectedType] = useState(projectType);
  const [showPaymentSchedule, setShowPaymentSchedule] = useState(false);
  const [showMaterialsStore, setShowMaterialsStore] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { showLoader, hideLoader } = useLoader();
  const [combineCosts, setCombineCosts] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Animation states
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [showApprovalConfirmation, setShowApprovalConfirmation] =
    useState(false);

  // Check if the component should be in read only mode
  const isReadOnly = status === "approval-pending";

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        showLoader();
        const response = await axiosInstance.get(`/quote/v2/tasks/${id}`);
        const data = response.data;
        const sortedTasks = data.tasks.sort((a, b) => {
          const dateA = a.startDate ? new Date(a.startDate) : null;
          const dateB = b.startDate ? new Date(b.startDate) : null;

          if (!dateA && !dateB) return 0;
          if (!dateA) return 1; // null dates go last
          if (!dateB) return -1;

          return dateA - dateB; // ascending order
        });

        setTasks(sortedTasks);
        setTasks(data.tasks);
        console.log("tasks", data);
        console.log("dcomined", doCombineCosts);
        setCombineCosts(doCombineCosts);
        setContext(data.tasks);
      } catch (err) {
        console.log("err", err);
      } finally {
        hideLoader();
      }
    };
    fetchQuote();
  }, []);

  const handleAddTask = (taskData: Omit<Task, "id">) => {
    if (isReadOnly) return; // Prevent action if in read-only mode

    if (selectedTask) {
      console.log("task data", taskData);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === selectedTask.id
            ? {
                ...t, // Keep existing fields
                ...taskData, // Overwrite only the specified fields
              }
            : t
        )
      );
      setShowTaskForm(false);
      setSelectedTask(null);
      setShowSaveConfirmation(true); // Show save confirmation
      return;
    }

    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
    };
    setTasks((prev) => [...prev, newTask]);
    setShowTaskForm(false);
    setShowSaveConfirmation(true); // Show save confirmation
  };

  const handleEditTask = (task: Task) => {
    if (isReadOnly) return; // Prevent action if in read-only mode

    setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
    // setShowSaveConfirmation(true); // Show save confirmation
  };

  const handleDeleteTask = (taskId: string) => {
    if (isReadOnly) return; // Prevent action if in read-only mode

    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const handleOpenMaterialsStore = (task: Task) => {
    if (isReadOnly) return; // Prevent action if in read-only mode

    setSelectedTask(task);
    setShowMaterialsStore(true);
  };

  const handleCreatePaymentSchedule = () => {
    if (isReadOnly) return; // Prevent action if in read-only mode

    setShowPaymentSchedule(true);
  };

  const saveTasksToQuote = async (quoteId, tasks) => {
    if (isReadOnly) return; // Prevent action if in read-only mode

    try {
      showLoader();
      const response = await axiosInstance.post(
        `/quote/v2/add/${quoteId}/tasks?combinedCosts=${combineCosts}`,
        { tasks }
      );
      setShowApprovalConfirmation(true); // Show approval confirmation popup
      toast.success("Approval Requested");
      return response.data;
    } catch (error) {
      console.error(
        "Error saving tasks:",
        error.response?.data || error.message
      );
      throw error;
    } finally {
      hideLoader();
    }
  };

  const handleSubmitForApproval = () => {
    if (isReadOnly) return; // Prevent action if in read-only mode

    saveTasksToQuote(id, tasks);
  };

  const handleSavePaymentSchedule = (
    payments: Array<{ taskId: string; amount: number }>
  ) => {
    if (isReadOnly) return; // Prevent action if in read-only mode

    // Create a Set of task IDs that have payments
    const paymentTaskIds = new Set(payments.map((p) => p.taskId));

    // Update tasks, removing payment info from tasks that are no longer in the payment schedule
    const updatedTasks = tasks.map((task) => {
      if (paymentTaskIds.has(task.id)) {
        // Task has a payment in the schedule
        const payment = payments.find((p) => p.taskId === task.id);
        return {
          ...task,
          isMilestonePayment: true,
          paymentAmount: payment?.amount,
        };
      } else {
        // Task is not in payment schedule - remove payment properties
        const { isMilestonePayment, paymentAmount, ...taskWithoutPayment } =
          task;
        return taskWithoutPayment;
      }
    });

    setTasks(updatedTasks);
    setShowPaymentSchedule(false);
    setShowSaveConfirmation(true); // Show save confirmation
  };

  const calculateProjectSummary = () => {
    const totalMaterialsCost = tasks.reduce((sum, task) => {
      return (
        sum +
        (task.materials?.reduce(
          (materialSum, material) =>
            materialSum + material.price * material.quantity,
          0
        ) || 0)
      );
    }, 0);

    const totalLaborCost = tasks.reduce((sum, task) => {
      return sum + (task.labor?.hours || 0) * (task.labor?.rate || 0);
    }, 0);

    const totalPaymentAmount = tasks.reduce((sum, task) => {
      return sum + (task.paymentAmount || 0);
    }, 0);
    const totalTimeframe = tasks.reduce((sum, task) => {
      const multiplier =
        task.timeframeUnit === "weeks"
          ? 7
          : task.timeframeUnit === "months"
          ? 30
          : 1;
      return sum + task.timeframe * multiplier;
    }, 0);

    return {
      totalCost: totalMaterialsCost + totalLaborCost + totalPaymentAmount,
      totalTasks: tasks.length,
      totalDays: totalTimeframe,
    };
  };

  const projectSummary = calculateProjectSummary();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleEditTaskClick = (task: Task) => {
    if (isReadOnly) return; // Prevent action if in read-only mode

    setSelectedTask(task); // Set the task to be edited
    setShowTaskForm(true); // Show the form
  };

  const formatTimeframe = (days: number) => {
    if (days < 7) return `${days} days`;
    if (days < 30) {
      const weeks = Math.floor(days / 7);
      const remainingDays = days % 7;
      return `${weeks} week${weeks > 1 ? "s" : ""}${
        remainingDays
          ? ` ${remainingDays} day${remainingDays > 1 ? "s" : ""}`
          : ""
      }`;
    }
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;
    return `${months} month${months > 1 ? "s" : ""}${
      remainingDays
        ? ` ${remainingDays} day${remainingDays > 1 ? "s" : ""}`
        : ""
    }`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "green";
      case "in-progress":
        return "blue";
      case "rejected":
        return "red";
      case "approval-pending":
        return "orange";
      default:
        return "gray"; // fallback for unknown statuses
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Save Confirmation Popup */}
      <SaveConfirmPopup
        isVisible={showSaveConfirmation}
        onClose={() => setShowSaveConfirmation(false)}
      />

      {/* Approval Confirmation Popup */}
      <ApprovalPopup
        isVisible={showApprovalConfirmation}
        onClose={() => setShowApprovalConfirmation(false)}
      />

      <div
        className="px-6 py-5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative inline-block">
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    if (isReadOnly) return; // Prevent action if in read-only mode
                    setSelectedCategory(e.target.value);
                    setSelectedType(
                      projectTypes[
                        e.target.value as keyof typeof projectTypes
                      ][0]
                    );
                  }}
                  onClick={(e) => e.stopPropagation()}
                  disabled={isReadOnly}
                  className={`text-xl font-bold text-gray-900 border-0 bg-transparent focus:ring-0 cursor-pointer ${
                    isReadOnly
                      ? "opacity-80 cursor-not-allowed"
                      : "hover:text-blue-600"
                  } transition-colors appearance-none pr-8`}
                  style={{
                    backgroundImage: isReadOnly
                      ? "none"
                      : `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: "right 0 center",
                    backgroundSize: "1.25em 1.25em",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  {primaryCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center mr-2 relative">
              <button
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  combineCosts
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                } ${isReadOnly ? "opacity-60 cursor-not-allowed" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isReadOnly) {
                    setCombineCosts(!combineCosts);
                  }
                }}
                disabled={isReadOnly}
                aria-label={combineCosts ? "Separate costs" : "Combine costs"}
                onMouseEnter={() => !isReadOnly && setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <Layers className="w-4 h-4 mr-2" />
                {combineCosts ? "Combined Costs" : "Separate Costs"}
              </button>

              {showTooltip && !isReadOnly && (
                <div className="absolute top-12 left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-xs text-white bg-gray-800 rounded-md shadow-lg whitespace-nowrap z-10">
                  {combineCosts
                    ? "Click to separate labor and material costs"
                    : "Click to combine labor and material costs for easier budgeting"}
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-800"></div>
                </div>
              )}
            </div>
            {!isReadOnly && (
              <div className="flex items-center space-x-2">
                <PaymentScheduleButton
                  onClick={handleCreatePaymentSchedule}
                  tasks={tasks}
                />
                <AnimatedSubmitButton
                  status={status}
                  hasTasksWithMissingPayment={hasTasksWithMissingPayment}
                  tasks={tasks}
                  handleSubmitForApproval={handleSubmitForApproval}
                />
              </div>
            )}
            {isReadOnly && (
              <div className="bg-orange-100 px-3 py-1 rounded-md text-sm text-orange-800 font-medium">
                Awaiting Approval
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2 min-w-fit ">
              <span className="font-medium text-gray-500 text-sm">
                Customer:
              </span>
              <span className="font-semibold text-gray-900 text-xl">
                {customerName}
              </span>
            </div>
            <div className="flex items-center space-x-2 min-w-fit capitalize">
              <span className="text-xl font-medium text-gray-500">Status:</span>
              <span
                style={{ color: getStatusColor(status) }}
                className="text-xl"
              >
                {status === "approval-pending"
                  ? "awaiting approval"
                  : status === "active"
                  ? "approved"
                  : status}
              </span>

              {status === "rejected" && reviewMessage && (
                <div className="relative group">
                  <span className="text-gray-400 cursor-pointer">
                    <InfoIcon size={16} />
                  </span>
                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-3 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-normal break-words max-w-xs z-10 shadow-lg text-left">
                    {reviewMessage}
                  </div>
                </div>
              )}
            </div>

            <div className="text-gray-400 hidden sm:block">|</div>
            <div className="relative inline-block">
              <select
                value={selectedType}
                onChange={(e) => !isReadOnly && setSelectedType(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                disabled={isReadOnly}
                className={`text-sm font-medium text-gray-900 border-0 bg-transparent focus:ring-0 cursor-pointer ${
                  isReadOnly
                    ? "opacity-80 cursor-not-allowed"
                    : "hover:text-blue-600"
                } transition-colors appearance-none pr-8`}
                style={{
                  backgroundImage: isReadOnly
                    ? "none"
                    : `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: "right 0 center",
                  backgroundSize: "1.25em 1.25em",
                  backgroundRepeat: "no-repeat",
                }}
              >
                {projectTypes[
                  selectedCategory as keyof typeof projectTypes
                ].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center text-gray-500 mb-1">
                <DollarSign className="w-4 h-4 mr-1" />
                <span className="text-sm">Total Cost</span>
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {formatCurrency(projectSummary.totalCost)}
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center text-gray-500 mb-1">
                <Clock className="w-4 h-4 mr-1" />
                <span className="text-sm">Total Time</span>
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {formatTimeframe(projectSummary.totalDays)}
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center text-gray-500 mb-1">
                <Calendar className="w-4 h-4 mr-1" />
                <span className="text-sm">Total Tasks</span>
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {projectSummary.totalTasks}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-6">
          {!isReadOnly && showTaskForm ? (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {selectedTask ? "Edit Task" : "Add New Task"}
              </h3>
              <TaskForm
                onSubmit={handleAddTask}
                onCancel={() => {
                  setShowTaskForm(false);
                  setSelectedTask(null); // Clear selected task after canceling
                }}
                initialData={selectedTask} // Pass selected task data for editing
                existingTasks={tasks}
              />
            </div>
          ) : !isReadOnly ? (
            <button
              onClick={() => setShowTaskForm(true)}
              className="mb-6 flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Task
            </button>
          ) : null}

          <TaskList
            tasks={tasks}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onOpenMaterialsStore={handleOpenMaterialsStore}
            editTask={handleEditTaskClick}
            readOnly={isReadOnly} // Pass read-only status to TaskList
          />

          {!isReadOnly && (
            <>
              <MaterialsStore
                isOpen={showMaterialsStore}
                onClose={() => setShowMaterialsStore(false)}
                task={selectedTask}
                onUpdateTask={handleEditTask}
                tasks={tasks}
              />

              <PaymentScheduleForm
                isOpen={showPaymentSchedule}
                onClose={() => setShowPaymentSchedule(false)}
                customerName={customerName}
                projectName={projectName}
                tasks={tasks}
                onSave={handleSavePaymentSchedule}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};
