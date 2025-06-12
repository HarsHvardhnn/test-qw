import React, { useState } from "react";
import { useTasks, TaskStatus, VerificationType } from "../context/TaskContext";
import {
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Info,
  DollarSign,
  Camera,
  FileText,
  Video,
  X,
} from "lucide-react";
import { ChangeOrderModal } from "./ChangeOrderModal";
import { VerificationViewer } from "./VerificationViewer";
import axiosInstance from "../../axios";
import ChangeOrderCard from "./ChangeOrderCard";
import { toast } from "react-toastify";

interface TaskProgressTrackerProps {
  onBack?: () => void;
  projectId: string;
}

export const TaskProgressTracker: React.FC<TaskProgressTrackerProps> = ({
  onBack,
  projectId,
}) => {
  const {
    tasks,
    requestVerification,
    removeVerification,
    fetchTasksByProjectId,
    setTasks,
  } = useTasks();
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [showVerificationOptions, setShowVerificationOptions] = useState<
    string | null
  >(null);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [showChangeOrderModal, setShowChangeOrderModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showVerificationViewer, setShowVerificationViewer] = useState(false);
  const [selectedVerificationType, setSelectedVerificationType] = useState<
    "photo" | "video" | "inspection" | null
  >(null);

  // Calculate progress statistics
  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;
  const notStartedTasks = tasks.filter(
    (task) => task.status === "not-started"
  ).length;
  const totalTasks = tasks.length;
  const progressPercentage =
    Math.round((completedTasks / totalTasks) * 100) || 0;
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

   const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTask, setSelectedTask] = useState();
  const [isApproved,setIsApproved]=useState(false)

  // Task approval and rejection service
  const reviewAdditionalTask = async (taskId, action, reviewNotes = "") => {
    try {
      const response = await axiosInstance.put(`/quote/v2/tasks/${taskId}/review`, {
        action,
        reviewNotes,
      });

      return response.data;
    } catch (error) {
      console.error("Error reviewing task:", error);
      throw error.response?.data || error;
    }
  };

  // Function to approve a task
  const approveTask = async (taskId) => {
    return reviewAdditionalTask(taskId, "approve");
  };

  // Function to reject a task with required notes
  const rejectTask = async (taskId, rejectionReason) => {
    if (!rejectionReason || rejectionReason.trim() === "") {
      throw new Error("Rejection reason is required");
    }
    return reviewAdditionalTask(taskId, "reject", rejectionReason);
  };

 const handleApprove = async (id :string) => {
   setIsSubmitting(true);
   try {
     const result = await approveTask(id);
     toast.success("Task successfully approved");
     setIsApproved(true);
   } catch (error) {
     toast.error(error.message || "Failed to approve task");
   } finally {
     setIsSubmitting(false);
   }
 };

 const handleReject = async (id,rejectionReason) => {
   if (!rejectionReason.trim()) {
     toast.error("Please provide a reason for rejection");
     return;
   }

   setIsSubmitting(true);
   try {
     const result = await rejectTask(id, rejectionReason);
     toast.success("Task successfully rejected");
     setShowRejectModal(false);
     setRejectionReason("");
     setIsApproved(true)
    //  if (onTaskUpdated) onTaskUpdated(result.task);
   } catch (error) {
     toast.error(error.message || "Failed to reject task");
   } finally {
     setIsSubmitting(false);
   }
 };
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Get status badge styling and icon
  const getStatusInfo = (status: TaskStatus) => {
    switch (status) {
      case "completed":
        return {
          label: "Completed",
          color: "bg-green-100 text-green-800 border-green-200",
          icon: <CheckCircle className="w-4 h-4 mr-1" />,
        };
      case "in-progress":
        return {
          label: "In Progress",
          color: "bg-blue-100 text-blue-800 border-blue-200",
          icon: <Clock className="w-4 h-4 mr-1" />,
        };
      case "not-started":
        return {
          label: "Not Started",
          color: "bg-gray-100 text-gray-600 border-gray-200",
          icon: <AlertCircle className="w-4 h-4 mr-1" />,
        };
      default:
        return {
          label: "Unknown",
          color: "bg-gray-100 text-gray-600 border-gray-200",
          icon: <Info className="w-4 h-4 mr-1" />,
        };
    }
  };

  // Get verification type icon and color
  const getVerificationInfo = (type: VerificationType) => {
    switch (type) {
      case "photo":
        return {
          label: "Photo Verification",
          color: "bg-blue-100 text-blue-800 border-blue-200",
          icon: <Camera className="w-4 h-4 mr-2" />,
        };
      case "video":
        return {
          label: "Video Verification",
          color: "bg-purple-100 text-purple-800 border-purple-200",
          icon: <Video className="w-4 h-4 mr-2" />,
        };
      case "inspection":
        return {
          label: "Inspection Required",
          color: "bg-amber-100 text-amber-800 border-amber-200",
          icon: <CheckCircle className="w-4 h-4 mr-2" />,
        };
      default:
        return {
          label: "Verification Required",
          color: "bg-gray-100 text-gray-600 border-gray-200",
          icon: <Info className="w-4 h-4 mr-2" />,
        };
    }
  };

  const toggleTaskDetails = (taskId: string) => {
    setSelectedTaskId(taskId);
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  const handleRequestVerification = async (
    taskId: string,
    type: VerificationType
  ) => {
    requestVerification(taskId, type);
    setShowVerificationOptions(null);

    await updateVerificationTypes(taskId, type);
  };

  const updateVerificationTypes = async (taskId, verificationTypes) => {
    try {
      const response = await axiosInstance.patch(
        `/quote/v2/tasks/${taskId}/verification-types`,
        { verificationTypes }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating verification types:", error);
      throw error;
    }
  };

  const removeVerificationType = async (
    taskId: string,
    verificationType: string
  ) => {
    try {
      const response = await axiosInstance.patch(
        `/quote/v2/tasks/${taskId}/remove-verification-type`,
        {
          verificationType,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error removing verification type:", error);
      throw error;
    }
  };
  const handleRemoveVerification = async (taskId: string, type: string) => {
    await removeVerificationType(taskId, type);
    const tasks = await fetchTasksByProjectId(projectId);
    setTasks(tasks);
  };

  const handleViewVerification = (type: "photo" | "video" | "inspection") => {
    setSelectedVerificationType(type);
    setShowVerificationViewer(true);
  };

  const approvePaymentForTask = async (taskId: string) => {
    try {
      const response = await axiosInstance.patch(
        `/quote/v2/tasks/${taskId}/payment-approved`
      );
      return response.data;
    } catch (error) {
      console.error("Error approving payment:", error);
      throw error;
    }
  };
  const handleApprovePayment = async (taskId: string) => {
    await approvePaymentForTask(taskId);
    // In a real app, this would approve the payment
    console.log(`Approved payment for task ${taskId}`);

    // Show success message (in a real app, this would be a toast notification)
    alert("Payment approved successfully!");
  };

  const togglePanelCollapse = () => {
    setIsPanelCollapsed(!isPanelCollapsed);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header with toggle button */}
      <div
        className="flex items-center justify-between mb-6 cursor-pointer"
        onClick={togglePanelCollapse}
      >
        <h2 className="text-xl font-semibold text-gray-800">
          Project Progress
        </h2>
        <button
          className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          aria-label={isPanelCollapsed ? "Expand panel" : "Collapse panel"}
        >
          {isPanelCollapsed ? (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          )}
        </button>
      </div>

      {/* Progress Summary - Always visible */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center justify-between mb-2">
          <div className="flex items-center">
            <span className="text-lg font-medium text-gray-700">
              {progressPercentage ?? 0}% Complete
            </span>
            <span className="ml-4 text-sm text-gray-500">
              {completedTasks} of {totalTasks} tasks completed
            </span>
          </div>
          <div className="flex space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
              <span className="text-gray-800">
                Completed ({completedTasks})
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
              <span className="text-gray-800">
                In Progress ({inProgressTasks})
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-gray-300 mr-1"></div>
              <span className="text-gray-800">
                Not Started ({notStartedTasks})
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-green-500 h-2.5 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Tasks List - Collapsible */}
      {!isPanelCollapsed && (
        <div className="space-y-4">
          {tasks.map((task) => {
            const statusInfo = getStatusInfo(task.status);
            const isExpanded = expandedTaskId === task.id;

            // Determine if this task has a payment milestone
            const hasPayment =
              task.isMilestonePayment &&
              task.paymentAmount &&
              task.paymentAmount > 0;
            const paymentRequested = hasPayment && task.paymentRequested;
            const paymentApproved = hasPayment && task.paymentApproved;

            // Collect all verification requirements
            const verificationTypes: VerificationType[] =
              task.verificationTypes || [];
            if (task.verificationType) {
              verificationTypes.push(task.verificationType);
            }
            if (
              task.verificationRequests &&
              task.verificationRequests.length > 0
            ) {
              task.verificationRequests.forEach((type) => {
                if (type && !verificationTypes.includes(type)) {
                  verificationTypes.push(type);
                }
              });
            }

            return (
              <div
                key={task.id}
                className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200"
              >
                {/* Task Header */}
                <div
                  className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 ${
                    task.status === "completed"
                      ? "bg-green-50"
                      : task.status === "in-progress"
                      ? "bg-blue-50"
                      : "bg-white"
                  }`}
                  onClick={() => toggleTaskDetails(task.id)}
                >
                  <div className="flex items-center">
                    <div
                      className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color} mr-3`}
                    >
                      {statusInfo.icon}
                      <span>{statusInfo.label}</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">
                      {task.title}
                    </h3>

                    {/* Payment Badge - Only show for milestone payments */}
                    {hasPayment && (
                      <div
                        className={`ml-3 flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          paymentApproved
                            ? "bg-green-100 text-green-800"
                            : paymentRequested
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <DollarSign className="w-3 h-3 mr-1" />
                        <span>
                          {paymentApproved
                            ? "Paid"
                            : paymentRequested
                            ? "Payment Due"
                            : "Payment Scheduled"}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center">
                    <div className="text-sm text-gray-500 mr-4 hidden md:block">
                      Due: {formatDate(task.dueDate)}
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Task Details (Expanded) */}
                {isExpanded && (
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-600 mb-4">{task.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-sm font-medium text-gray-500">
                          Start Date
                        </div>
                        <div className="flex items-center mt-1">
                          <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-gray-800">
                            {formatDate(task.startDate)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500">
                          Due Date
                        </div>
                        <div className="flex items-center mt-1">
                          <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-gray-800">
                            {formatDate(task.dueDate)}
                          </span>
                        </div>
                      </div>
                      {task.status === "completed" && (
                        <div>
                          <div className="text-sm font-medium text-gray-500">
                            Completed Date
                          </div>
                          <div className="flex items-center mt-1">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-gray-800">
                              {formatDate(task.completedDate)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Payment Information - Only show for milestone payments */}
                    {hasPayment && (
                      <div
                        className={`mt-4 p-4 rounded-lg border ${
                          paymentApproved
                            ? "bg-green-50 border-green-200"
                            : paymentRequested
                            ? "bg-yellow-50 border-yellow-200"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-gray-800 flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            Milestone Payment
                          </h4>
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(task.paymentAmount || 0)}
                          </span>
                        </div>

                        <div className="text-sm text-gray-600 mb-3">
                          {paymentApproved
                            ? "Payment has been approved and processed."
                            : paymentRequested
                            ? "Contractor has requested payment for this milestone."
                            : "Payment will be requested upon completion of this milestone."}
                        </div>

                        {paymentRequested && !paymentApproved && (
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() =>
                                setShowVerificationOptions(
                                  showVerificationOptions === task.id
                                    ? null
                                    : task.id
                                )
                              }
                              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                            >
                              Request Verification
                            </button>

                            {showVerificationOptions === task.id && (
                              <div className="absolute mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                <button
                                  onClick={() =>
                                    handleRequestVerification(task.id, "photo")
                                  }
                                  className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-50 text-sm text-gray-800"
                                >
                                  <Camera className="w-4 h-4 text-blue-500 mr-2" />
                                  <span>Request Photos</span>
                                </button>
                                <button
                                  onClick={() =>
                                    handleRequestVerification(task.id, "video")
                                  }
                                  className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-50 text-sm text-gray-800"
                                >
                                  <Video className="w-4 h-4 text-purple-500 mr-2" />
                                  <span>Request Video</span>
                                </button>
                                <button
                                  onClick={() =>
                                    handleRequestVerification(
                                      task.id,
                                      "inspection"
                                    )
                                  }
                                  className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-50 text-sm text-gray-800"
                                >
                                  <CheckCircle className="w-4 h-4 text-amber-500 mr-2" />
                                  <span>Request Inspection</span>
                                </button>
                              </div>
                            )}

                            {task.paymentApproved ? (
                              <button
                                // onClick={() => handleApprovePayment(task.id)}
                                className="px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                              >
                                Payment Approved
                              </button>
                            ) : (
                              <button
                                onClick={() => handleApprovePayment(task.id)}
                                className="px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                              >
                                Approve Payment
                              </button>
                            )}
                          </div>
                        )}

                        {/* Verification Requirements Section */}
                        {verificationTypes.length > 0 && (
                          <div className="mt-4 border-t border-gray-200 pt-3">
                            <h5 className="font-medium text-gray-700 mb-2">
                              Required Verifications:
                            </h5>
                            <div className="space-y-2">
                              {verificationTypes.map((type, index) => {
                                if (!type) return null;
                                const verificationInfo =
                                  getVerificationInfo(type);

                                const shouldShowViewButton =
                                  (type === "photo" &&
                                    task?.verificationImage &&
                                    task?.verificationImage.trim() !== "") ||
                                  (type === "video" &&
                                    task?.verificationVideo &&
                                    task?.verificationVideo.trim() != "");

                                return (
                                  <div
                                    key={`${type}-${index}`}
                                    className="flex items-center justify-between"
                                  >
                                    <div
                                      className={`flex items-center px-3 py-1.5 rounded-md ${verificationInfo.color}`}
                                    >
                                      {verificationInfo.icon}
                                      <span className="text-sm">
                                        {verificationInfo.label}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      {shouldShowViewButton && (
                                        <button
                                          onClick={() => {
                                            setSelectedTask(task);
                                            handleViewVerification(type);
                                          }}
                                          className="text-blue-600 hover:text-blue-800 text-sm"
                                        >
                                          View
                                        </button>
                                      )}
                                      {!shouldShowViewButton && (
                                        <button
                                          onClick={() =>
                                            handleRemoveVerification(
                                              task.id,
                                              type
                                            )
                                          }
                                          className="text-red-600 hover:text-red-800"
                                        >
                                          <X className="w-4 h-4" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {task.isAdditional && (
                      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                        <div className="flex items-center mb-2">
                          <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
                          <span className="text-sm font-medium text-gray-700">
                            Additional Task
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          This is an additional task that requires your review
                          and approval.
                        </p>

                        {task.additionalStatus == "pending" && !isApproved ? (
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleApprove(task.id)}
                              className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => setShowRejectModal(true)}
                              className="px-3 py-1.5 bg-white text-red-600 border border-red-300 text-sm font-medium rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          !isApproved && (
                            <div className="flex items-center">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                              <span className="text-sm text-gray-700">
                                {task.additionalStatus == "approved"
                                  ? "Approved"
                                  : "Rejected"}{" "}
                                on {formatDate(task.reviewDate)}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    )}

                    {/* Rejection Modal */}
                    {showRejectModal && (
                      <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                          <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Rejection Reason
                          </h3>
                          <textarea
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="4"
                            placeholder="Please provide a reason for rejection..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                          ></textarea>
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={() => setShowRejectModal(false)}
                              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => {
                                handleReject(task.id, rejectionReason);
                                setShowRejectModal(false);
                                setRejectionReason("");
                              }}
                              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                              disabled={!rejectionReason.trim()}
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Change Order Section */}
                    <ChangeOrderCard
                      taskId={task.id}
                      onViewChangeOrder={() => setShowChangeOrderModal(true)}
                    />

                    {task.notes && (
                      <div className="mt-4">
                        <div className="text-sm font-medium text-gray-500 mb-1">
                          Notes
                        </div>
                        <div className="bg-white p-3 rounded-md border border-gray-200 text-gray-700 space-y-1">
                          {Array.isArray(task.notes) ? (
                            task.notes.map((note, idx) => (
                              <div key={idx} className="text-sm">
                                • {note}
                              </div>
                            ))
                          ) : (
                            <div className="text-sm">{task.notes}</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Change Order Modal */}
      {showChangeOrderModal && selectedTaskId && (
        <ChangeOrderModal
          taskId={selectedTaskId}
          isOpen={showChangeOrderModal}
          onClose={() => {
            setShowChangeOrderModal(false);
            setSelectedTaskId(null);
          }}
        />
      )}

      {/* Verification Viewer */}
      {showVerificationViewer && selectedVerificationType && (
        <VerificationViewer
          type={selectedVerificationType}
          isOpen={showVerificationViewer}
          contentUrls={[selectedTask?.verificationImage]}
          videoUrls={[selectedTask?.verificationVideo]}
          onClose={() => {
            setShowVerificationViewer(false);
            setSelectedVerificationType(null);
          }}
        />
      )}
    </div>
  );
};
