import React, { useEffect, useState } from "react";
import { X, Users, FileText, MessageSquare, Bell } from "lucide-react";
import axiosInstance from "../../axios";
interface NotificationItem {
  id: number;
  type: string;
  title: string;
  message: string;
  time: string;
  targetPanel: string;
}

interface NotificationsPanelProps {
  onClose: () => void;
  onNavigate?: (panel: string) => void;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  onClose,
  onNavigate,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 👇 Icon mapping for types
  const iconMap: Record<string, JSX.Element> = {
    project: <FileText className="w-5 h-5 text-green-500" />,
    meeting: <Users className="w-5 h-5 text-blue-500" />,
    message: <MessageSquare className="w-5 h-5 text-purple-500" />,
    quote: <FileText className="w-5 h-5 text-orange-500" />,
    info: <Bell className="w-5 h-5 text-gray-400" />,
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // replace with actual userId
        const response = await axiosInstance.get(`/notifications/`);
        setNotifications(response.data);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleNotificationClick = (targetPanel: string) => {
    if (onNavigate) {
      onNavigate(targetPanel);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black bg-opacity-30"
        onClick={onClose}
      />

      <div className="absolute right-0 top-0 bottom-0 w-96 bg-white shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto h-full pb-20">
          {loading ? (
            <div className="p-4 text-gray-500">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-gray-500">No notifications yet.</div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() =>
                  handleNotificationClick(notification.targetPanel)
                }
                className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    {iconMap[notification.type] || iconMap["info"]}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">
                      {notification.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
