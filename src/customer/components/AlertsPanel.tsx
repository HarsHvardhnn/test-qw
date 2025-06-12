import React, { useState, useEffect } from "react";
import {
  Bell,
  CheckCircle,
  Clock,
  AlertTriangle,
  Info,
  X,
  ChevronDown,
  ChevronUp,
  Calendar,
  DollarSign,
  PenTool as Tool,
  MessageSquare,
  ChevronLeft,
} from "lucide-react";
import axiosInstance from "../../axios";
interface Alert {
  id: string;
  type: "success" | "warning" | "info" | "error";
  title: string;
  message: string | JSX.Element;
  timestamp: string;
  isRead: boolean;
  category: "task" | "payment" | "inspection" | "message" | "meeting";
}

interface AlertsPanelProps {
  onBack?: () => void;
}

const mapTypeToAlertType = (type: string): Alert["type"] => {
  switch (type) {
    case "task":
      return "success";
    case "payment":
      return "warning";
    case "inspection":
      return "info";
    case "message":
      return "info";
    case "meeting":
      return "info";
    default:
      return "info";
  }
};

const mapTypeToCategory = (type: string): Alert["category"] => {
  switch (type) {
    case "task":
      return "task";
    case "payment":
      return "payment";
    case "inspection":
      return "inspection";
    case "message":
      return "message";
    case "meeting":
      return "meeting";
    default:
      return "message";
  }
};

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ onBack }) => {
  const [expandedSections, setExpandedSections] = useState({
    unread: true,
    today: true,
    earlier: true,
  });

  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    axiosInstance
      .get(`/notifications`) // replace with dynamic user id if needed
      .then((res) => {
        const formatted = res.data.map((n: any) => {
          const type = mapTypeToAlertType(n.type);
          const category = mapTypeToCategory(n.type);

          let message: string | JSX.Element = n.message;

          // Handle meeting link if present
          if (category === "meeting") {
            const match = n.message.match(/meeting link\s*:\s*([\w-]+)/i);
            const meetingCode = match?.[1];
            if (meetingCode) {
              const fullUrl = `${window.location.origin}/meeting/${meetingCode}`;
              message = (
                <>
                  {n.message.split("meeting link")[0]}{" "}
                  <a
                    href={fullUrl}
                    className="text-blue-600 underline hover:text-blue-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Join Meeting
                  </a>
                </>
              );
            }
          }

          return {
            id: n.id.toString(),
            type,
            title: n.title,
            message,
            timestamp: n.time,
            isRead: false,
            category,
          };
        });

        setAlerts(formatted);
      })
      .catch((err) => {
        console.error("Failed to fetch alerts:", err);
      });
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getAlertIcon = (type: string, category: string) => {
    switch (category) {
      case "task":
        return <Tool className="w-5 h-5" />;
      case "payment":
        return <DollarSign className="w-5 h-5" />;
      case "inspection":
        return <Calendar className="w-5 h-5" />;
      case "message":
        return <MessageSquare className="w-5 h-5" />;
      case "meeting":
        return <Calendar className="w-5 h-5" />;
      default:
        switch (type) {
          case "success":
            return <CheckCircle className="w-5 h-5" />;
          case "warning":
            return <AlertTriangle className="w-5 h-5" />;
          case "info":
            return <Info className="w-5 h-5" />;
          case "error":
            return <X className="w-5 h-5" />;
          default:
            return <Bell className="w-5 h-5" />;
        }
    }
  };

  const getAlertStyles = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 text-green-800 border-green-100";
      case "warning":
        return "bg-yellow-50 text-yellow-800 border-yellow-100";
      case "info":
        return "bg-blue-50 text-blue-800 border-blue-100";
      case "error":
        return "bg-red-50 text-red-800 border-red-100";
      default:
        return "bg-gray-50 text-gray-800 border-gray-100";
    }
  };

  const getIconStyles = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-500";
      case "warning":
        return "text-yellow-500";
      case "info":
        return "text-blue-500";
      case "error":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const unreadAlerts = alerts.filter((alert) => !alert.isRead);
  const todayAlerts = alerts.filter(
    (alert) =>
      alert.isRead &&
      (alert.timestamp.includes("ago") || alert.timestamp === "Today")
  );
  const earlierAlerts = alerts.filter(
    (alert) =>
      alert.isRead &&
      !alert.timestamp.includes("ago") &&
      alert.timestamp !== "Today"
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex items-center">
            <Bell className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Alerts</h2>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-1" />
          Last updated: Just now
        </div>
      </div>

      <div className="space-y-6">
        {/* Unread Alerts */}
        {unreadAlerts.length > 0 && (
          <AlertSection
            title="Unread"
            alerts={unreadAlerts}
            isExpanded={expandedSections.unread}
            onToggle={() => toggleSection("unread")}
            getAlertIcon={getAlertIcon}
            getAlertStyles={getAlertStyles}
            getIconStyles={getIconStyles}
          />
        )}

        {/* Today's Alerts */}
        {todayAlerts.length > 0 && (
          <AlertSection
            title="Today"
            alerts={todayAlerts}
            isExpanded={expandedSections.today}
            onToggle={() => toggleSection("today")}
            getAlertIcon={getAlertIcon}
            getAlertStyles={getAlertStyles}
            getIconStyles={getIconStyles}
          />
        )}

        {/* Earlier Alerts */}
        {earlierAlerts.length > 0 && (
          <AlertSection
            title="Earlier"
            alerts={earlierAlerts}
            isExpanded={expandedSections.earlier}
            onToggle={() => toggleSection("earlier")}
            getAlertIcon={getAlertIcon}
            getAlertStyles={getAlertStyles}
            getIconStyles={getIconStyles}
          />
        )}
      </div>
    </div>
  );
};

interface AlertSectionProps {
  title: string;
  alerts: Alert[];
  isExpanded: boolean;
  onToggle: () => void;
  getAlertIcon: (type: string, category: string) => JSX.Element;
  getAlertStyles: (type: string) => string;
  getIconStyles: (type: string) => string;
}

const AlertSection: React.FC<AlertSectionProps> = ({
  title,
  alerts,
  isExpanded,
  onToggle,
  getAlertIcon,
  getAlertStyles,
  getIconStyles,
}) => (
  <div className="border border-gray-200 rounded-lg overflow-hidden">
    <div
      className="bg-gray-50 px-6 py-4 flex justify-between items-center cursor-pointer"
      onClick={onToggle}
    >
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      {isExpanded ? (
        <ChevronUp className="h-5 w-5 text-gray-500" />
      ) : (
        <ChevronDown className="h-5 w-5 text-gray-500" />
      )}
    </div>
    {isExpanded && (
      <div className="divide-y divide-gray-200">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 ${getAlertStyles(
              alert.type
            )} transition-colors hover:bg-opacity-80`}
          >
            <div className="flex items-start">
              <div
                className={`${getIconStyles(alert.type)} flex-shrink-0 mr-3`}
              >
                {getAlertIcon(alert.type, alert.category)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{alert.title}</p>
                  <span className="text-xs">{alert.timestamp}</span>
                </div>
                <p className="text-sm mt-1">{alert.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
