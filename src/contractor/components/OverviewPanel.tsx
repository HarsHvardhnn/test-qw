import React, { useState, useEffect, useRef } from "react";
import {
  Clock,
  FileText,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  FileText as FileIcon,
  Users,
  Plus,
  DollarSign,
  Building2,
  Shield,
  Tag,
  Handshake as HandShake,
  Upload,
  Camera,
  Video,
  X,
  User,
  Briefcase,
  Mail,
} from "lucide-react";
import { BsTools } from "react-icons/bs";
import axiosInstance from "../../axios";
interface OverviewPanelProps {
  onCreateMeeting: () => void;
}

interface Task {
  _id: string;
  title: string;
  status: string;
  startDate: string;
  dueDate: string;
  verificationTypes: string[];
}

interface RecentActivity {
  _id: string;
  user: string;
  type: string;
  message: string;
  task: Task | null;
  createdAt: string;
}

interface DashboardData {
  recentActivities: RecentActivity[];
  totalProjects: number;
}

export const OverviewPanel: React.FC<OverviewPanelProps> = ({
  onCreateMeeting,
  setActivePanel,
}) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [timeFilter, setTimeFilter] = useState<"week" | "month" | "year">(
    "month"
  );

  // Helper function to get time period stats
  const getTimeStats = () => {
    switch (timeFilter) {
      case "week":
        return { amount: 25000, period: "This Week", projects: 3 };
      case "month":
        return { amount: 75000, period: "This Month", projects: 5 };
      case "year":
        return { amount: 850000, period: "This Year", projects: 12 };
      default:
        return { amount: 75000, period: "This Month", projects: 5 };
    }
  };

  const timeStats = getTimeStats();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingType, setUploadingType] = useState<{
    [key: string]: boolean;
  }>({});
  const [uploadedFiles, setUploadedFiles] = useState<{
    [key: string]: { url: string; name: string } | null;
  }>({});
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/quote/v2/user/dashboard");
      setDashboardData(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" }); // Feb, Mar, etc.
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 0 to 12 for 12 AM/PM format

    const time = `${hours.toString().padStart(2, "0")}:${minutes} ${ampm}`;

    return `${day} ${month} ${year} at ${time}`;
  };

  const handleUpload = (activityId: string, taskId: string, type: string) => {
    // Trigger the hidden file input
    if (fileInputRefs.current[`${activityId}-${type}`]) {
      fileInputRefs.current[`${activityId}-${type}`]?.click();
    }
  };

  const handleFileChange = async (
    activityId: string,
    taskId: string,
    type: "photo" | "video",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show uploading state
    setUploadingType((prev) => ({ ...prev, [`${activityId}-${type}`]: true }));

    try {
      // Create form data for upload
      const formData = new FormData();
      formData.append("file", file);

      console.log("file", file);
      // Determine the correct API endpoint based on file type
      const uploadUrl =
        type === "photo"
          ? "/api/auth/upload-image-file"
          : "/api/auth/upload-video";

      // Upload file to Cloudinary via backend
      const response = await axiosInstance.post(uploadUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Let the browser set boundary
        },
      });
      // Extract the uploaded file URL
      const uploadedUrl = response.data.imageUrl;

      // Store the uploaded file URL and file name
      setUploadedFiles((prev) => ({
        ...prev,
        [`${activityId}-${type}`]: {
          url: uploadedUrl,
          name: file.name,
        },
      }));

      console.log(`Successfully uploaded ${file.name}:`, uploadedUrl);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      // Reset uploading state
      setUploadingType((prev) => ({
        ...prev,
        [`${activityId}-${type}`]: false,
      }));
    }
  };

  const removeFile = (activityId: string, type: string) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [`${activityId}-${type}`]: null,
    }));
  };

  const handleMessageClick = () => {
    const dashboardLayout = document.querySelector(".min-h-screen.bg-gray-100");
    if (!dashboardLayout) return;

    const messagesButton = dashboardLayout.querySelector(
      'button[aria-label="Open Messages"]'
    );
    if (messagesButton instanceof HTMLButtonElement) {
      messagesButton.click();
    }
  };

  const getCurrentTimeValue = () => {
    return dashboardData.timeStats[timeFilter] || 0;
  };

  if (loading)
    return <div className="text-center p-6">Loading dashboard data...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

  const submitVerification = async (
    activityId: string,
    taskId: string,
    type: "photo" | "video"
  ) => {
    const fileData = uploadedFiles[`${activityId}-${type}`];

    if (!fileData) {
      console.warn("No file uploaded for verification");
      return;
    }

    try {
      // Send verification data to backend
      await axiosInstance.patch(
        `/quote/v2/tasks/${taskId}/update-verification-media?activityId=${activityId}`,
        {
          verificationType: type,
          url: fileData.url,
        }
      );

      await fetchDashboardData();
      console.log(`Verification ${type} submitted for task ${taskId}`);
    } catch (error) {
      console.error("Failed to submit verification:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">
          Dashboard Overview
        </h1>
        <button
          onClick={onCreateMeeting}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Instant Meeting
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Time Stats Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-50 text-green-700">
              <DollarSign className="w-6 h-6" />
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => setTimeFilter("week")}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  timeFilter === "week"
                    ? "bg-green-100 text-green-700"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setTimeFilter("month")}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  timeFilter === "month"
                    ? "bg-green-100 text-green-700"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setTimeFilter("year")}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  timeFilter === "year"
                    ? "bg-green-100 text-green-700"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                Year
              </button>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-500">Total Payments</h3>
          <div className="mt-1">
            <p className="text-2xl font-semibold text-gray-800">
              ${getCurrentTimeValue().toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">
              Based on {timeFilter} activity
            </p>
          </div>
        </div>

        {/* Total Quote Stats Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-50 text-blue-700">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-blue-600">
              Total Quotes
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-500">
            Pending Quotes 
          </h3>
          <div className="mt-1">
            <p className="text-2xl font-semibold text-gray-800">
              {dashboardData.totalQuoteStats.count} Quotes
            </p>
            <p className="text-sm text-gray-500">
              ${dashboardData.totalQuoteStats.value.toLocaleString()} total
              value
            </p>
          </div>
        </div>

        {/* Project Stats Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-50 text-purple-700">
              <Briefcase className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-purple-600">
              Projects
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-500">Project Status</h3>
          <div className="mt-1">
            <p className="text-2xl font-semibold text-gray-800">
              {dashboardData.projectStats.total} Total
            </p>
            <p className="text-sm text-gray-500">
              <span className="text-green-600">
                {dashboardData.projectStats.active}
              </span>{" "}
              active •
              <span className="text-blue-600 ml-1">
                {dashboardData.projectStats.inProgress}
              </span>{" "}
              Pending
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Layout for Recent Activity and Marketing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Activity
            </h2>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-4">Loading activities...</div>
            ) : error ? (
              <div className="text-center py-4 text-red-500">{error}</div>
            ) : (
              <div className="space-y-6">
                {/* Activities Group - Timeline Style */}
                {dashboardData?.recentActivities.length > 0 && (
                  <div className="relative">
                    {dashboardData?.recentActivities.map((activity, index) => (
                      <div key={activity._id} className="relative">
                        {/* Timeline Header - Only show for first item or when type changes */}
                        {(index === 0 ||
                          dashboardData.recentActivities[index - 1].type !==
                            activity.type) && (
                          <div className="flex items-center mb-4">
                            <div
                              className={`z-10 flex items-center justify-center w-10 h-10 rounded-full ${
                                activity.type === "verification requested"
                                  ? "bg-amber-100"
                                  : activity.type === "project update"
                                  ? "bg-green-100"
                                  : "bg-blue-100"
                              }`}
                            >
                              {activity.type === "verification requested" ? (
                                <AlertCircle
                                  className={`w-5 h-5 ${
                                    activity.type === "verification requested"
                                      ? "text-amber-600"
                                      : activity.type === "project update"
                                      ? "text-green-600"
                                      : "text-blue-600"
                                  }`}
                                />
                              ) : activity.type === "project update" ? (
                                <FileText className="w-5 h-5 text-green-600" />
                              ) : (
                                <Users className="w-5 h-5 text-blue-600" />
                              )}
                            </div>
                            <h3 className="ml-4 text-sm font-medium text-gray-900">
                              {activity.type === "verification requested"
                                ? "Verification Requested"
                                : activity.type === "project update"
                                ? "Project Updates"
                                : "New Activities"}
                            </h3>
                          </div>
                        )}

                        {/* Activity Card */}
                        <div className="ml-10 mb-4">
                          <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {activity.task?.title || "Activity Update"}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {activity.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  Requested: {formatDate(activity.createdAt)}
                                </p>
                              </div>
                              {activity.task && (
                                <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full capitalize bg-blue-100 text-blue-800">
                                  {activity.task.status}
                                </span>
                              )}
                            </div>

                            {/* Task Verification Details - Only for verification requested */}
                            {activity.type === "verification requested" &&
                              activity.task && (
                                <div className="mt-3">
                                  {/* Customer and Project Info */}
                                  <div className="mb-2 text-xs text-gray-600">
                                    <div className="grid grid-cols-2 gap-2">
                                      {activity?.customerName && (
                                        <span className="flex items-center">
                                          <User className="w-3 h-3 mr-1" />
                                          Customer: {activity?.customerName}
                                        </span>
                                      )}
                                      {activity?.customerEmail && (
                                        <span className="flex items-center">
                                          <Mail className="w-3 h-3 mr-1" />
                                          Email: {activity?.customerEmail}
                                        </span>
                                      )}
                                      {activity.projectName && (
                                        <span className="flex items-center">
                                          <Briefcase className="w-3 h-3 mr-1" />
                                          Project: {activity?.projectName}
                                        </span>
                                      )}
                                      <span className="flex items-center">
                                        <Clock className="w-3 h-3 mr-1" />
                                        Due:{" "}
                                        {new Date(
                                          activity.task.dueDate
                                        ).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Status Indicator */}
                                  {activity.task.verificationTypes.includes(
                                    "inspection"
                                  ) && (
                                    <div className="mt-3 flex items-center text-sm text-amber-800 bg-amber-50 px-3 py-1 rounded-lg">
                                      <AlertCircle className="w-4 h-4 mr-2" />
                                      Pending Inspection
                                    </div>
                                  )}

                                  {/* Verification Upload Section */}
                                  <div className="mt-3 space-y-3">
                                    {/* Photo Upload */}
                                    {activity.task.verificationTypes.includes(
                                      "photo"
                                    ) && (
                                      <div>
                                        <input
                                          type="file"
                                          accept="image/*"
                                          ref={(el) =>
                                            (fileInputRefs.current[
                                              `${activity._id}-photo`
                                            ] = el)
                                          }
                                          onChange={(e) =>
                                            handleFileChange(
                                              activity._id,
                                              activity.task!._id,
                                              "photo",
                                              e
                                            )
                                          }
                                          className="hidden"
                                        />

                                        {!uploadedFiles[
                                          `${activity._id}-photo`
                                        ] ? (
                                          <button
                                            onClick={() =>
                                              handleUpload(
                                                activity._id,
                                                activity.task!._id,
                                                "photo"
                                              )
                                            }
                                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 w-full justify-center"
                                          >
                                            <Camera className="w-3 h-3 mr-1" />
                                            Upload Photo
                                          </button>
                                        ) : (
                                          <div className="space-y-2">
                                            {/* Preview for photo */}
                                            <div className="relative bg-gray-100 rounded-md overflow-hidden">
                                              <img
                                                src={
                                                  uploadedFiles[
                                                    `${activity._id}-photo`
                                                  ]?.url
                                                }
                                                alt="Preview"
                                                className="w-full h-32 object-cover"
                                              />
                                            </div>

                                            <div className="flex items-center justify-between bg-blue-50 px-3 py-1.5 rounded-md">
                                              <div className="flex items-center text-xs text-blue-700">
                                                <Camera className="w-3 h-3 mr-1" />
                                                <span className="truncate max-w-xs">
                                                  {
                                                    uploadedFiles[
                                                      `${activity._id}-photo`
                                                    ]?.name
                                                  }
                                                </span>
                                              </div>
                                              <div className="flex space-x-2">
                                                <button
                                                  onClick={() =>
                                                    removeFile(
                                                      activity._id,
                                                      "photo"
                                                    )
                                                  }
                                                  className="p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                                                >
                                                  <X className="w-3 h-3" />
                                                </button>
                                                <button
                                                  onClick={() =>
                                                    submitVerification(
                                                      activity._id,
                                                      activity.task!._id,
                                                      "photo"
                                                    )
                                                  }
                                                  className="p-1 bg-green-100 text-green-600 rounded-full hover:bg-green-200"
                                                >
                                                  <CheckCircle className="w-3 h-3" />
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        )}

                                        {uploadingType[
                                          `${activity._id}-photo`
                                        ] && (
                                          <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                                            <div className="bg-blue-600 h-1.5 rounded-full w-1/2"></div>
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {/* Video Upload */}
                                    {activity.task.verificationTypes.includes(
                                      "video"
                                    ) && (
                                      <div>
                                        <input
                                          type="file"
                                          accept="video/*"
                                          ref={(el) =>
                                            (fileInputRefs.current[
                                              `${activity._id}-video`
                                            ] = el)
                                          }
                                          onChange={(e) =>
                                            handleFileChange(
                                              activity._id,
                                              activity.task!._id,
                                              "video",
                                              e
                                            )
                                          }
                                          className="hidden"
                                        />

                                        {!uploadedFiles[
                                          `${activity._id}-video`
                                        ] ? (
                                          <button
                                            onClick={() =>
                                              handleUpload(
                                                activity._id,
                                                activity.task!._id,
                                                "video"
                                              )
                                            }
                                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-green-50 text-green-700 rounded-md hover:bg-green-100 w-full justify-center"
                                          >
                                            <Video className="w-3 h-3 mr-1" />
                                            Upload Video
                                          </button>
                                        ) : (
                                          <div className="space-y-2">
                                            {/* Preview for video */}
                                            <div className="relative bg-gray-100 rounded-md overflow-hidden">
                                              <video
                                                src={
                                                  uploadedFiles[
                                                    `${activity._id}-video`
                                                  ]?.url
                                                }
                                                controls
                                                className="w-full h-32 object-cover"
                                              ></video>
                                            </div>

                                            <div className="flex items-center justify-between bg-green-50 px-3 py-1.5 rounded-md">
                                              <div className="flex items-center text-xs text-green-700">
                                                <Video className="w-3 h-3 mr-1" />
                                                <span className="truncate max-w-xs">
                                                  {
                                                    uploadedFiles[
                                                      `${activity._id}-video`
                                                    ]?.name
                                                  }
                                                </span>
                                              </div>
                                              <div className="flex space-x-2">
                                                <button
                                                  onClick={() =>
                                                    removeFile(
                                                      activity._id,
                                                      "video"
                                                    )
                                                  }
                                                  className="p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                                                >
                                                  <X className="w-3 h-3" />
                                                </button>
                                                <button
                                                  onClick={() =>
                                                    submitVerification(
                                                      activity._id,
                                                      activity.task!._id,
                                                      "video"
                                                    )
                                                  }
                                                  className="p-1 bg-green-100 text-green-600 rounded-full hover:bg-green-200"
                                                >
                                                  <CheckCircle className="w-3 h-3" />
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        )}

                                        {uploadingType[
                                          `${activity._id}-video`
                                        ] && (
                                          <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                                            <div className="bg-green-600 h-1.5 rounded-full w-1/2"></div>
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {/* Inspection Request */}
                                    {activity.task.verificationTypes.includes(
                                      "inspection"
                                    ) && (
                                      <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-amber-50 text-amber-700 rounded-md hover:bg-amber-100 w-full justify-center">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Request Inspection
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {dashboardData?.recentActivities.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No recent activities
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Marketing Panel */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex w-full justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Business Growth Tools
            </h2>
            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-sm whitespace-nowrap">
              Coming Soon
            </span>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {/* <div className="relative"> */}

              {/* Upcoming banner */}
              {/* </div> */}

              <button className="w-full flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-colors group">
                <div className="p-3 bg-blue-100 rounded-lg mr-4">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Project Financing
                  </h3>
                  <p className="text-sm text-gray-600">
                    Get funding for your upcoming projects
                  </p>
                </div>
              </button>
              <button className="w-full flex items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-colors group">
                <div className="p-3 bg-purple-100 rounded-lg mr-4">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Insurance Solutions
                  </h3>
                  <p className="text-sm text-gray-600">
                    Lower your company insurance rates
                  </p>
                </div>
              </button>
              <button className="w-full flex items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-colors group">
                <div className="p-3 bg-green-100 rounded-lg mr-4">
                  <Tag className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Material Deals
                  </h3>
                  <p className="text-sm text-gray-600">
                    Exclusive discounts from top suppliers
                  </p>
                </div>
              </button>
              <button className="w-full flex items-center p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg hover:from-amber-100 hover:to-amber-200 transition-colors group">
                <div className="p-3 bg-amber-100 rounded-lg mr-4">
                  <HandShake className="w-6 h-6 text-amber-600" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Quality Subcontractors
                  </h3>
                  <p className="text-sm text-gray-600">
                    Connect with verified subs in your area
                  </p>
                </div>
              </button>

              <button className="w-full flex items-center p-4 bg-gradient-to-r from-amber-300 to-amber-400 rounded-lg hover:from-amber-200 hover:to-amber-300 transition-colors group">
                <div className="p-3 bg-amber-100 rounded-lg mr-4 group-hover:bg-amber-200 transition-colors">
                  <BsTools className="w-6 h-6 text-amber-600" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Contractor Tool Store
                  </h3>
                  <p className="text-sm text-gray-600 ">
                    Your favourite tools at your finger tips!
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
