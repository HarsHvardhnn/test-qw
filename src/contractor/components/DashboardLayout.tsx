import React, { useState, useRef, useEffect } from "react";
import { Bell, MessageSquare, User, ChevronDown, LogOut } from "lucide-react";
import { SideNavigation } from "./SideNavigation";
import { ContractorCommunication } from "./ContractorCommunication";
import { SettingsPanel } from "./SettingsPanel";
import { NotificationsPanel } from "./NotificationsPanel";
import { MessagesPanel } from "./MessagesPanel";
import axiosInstance from "../../axios";
import { useUser } from "../../context/UserContext";
import {clearUserSessionData} from "../../utils/logout"

interface DashboardLayoutProps {
  children: React.ReactNode;
  activePanel: string;
  onPanelChange: (panel: string) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activePanel,
  onPanelChange,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessagesPanel, setShowMessagesPanel] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [userName, setUserName] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [businessLogo, setBusinessLogo] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  const messagesPanelRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  
    const {
      userProfilePicture,
      businessProfilePicture,
      fetchUserProfilePicture,
      fetchBusinessProfilePicture,
    }= useUser()

  useEffect(() => {
    const fetchBusinessProfile = async () => {
      try {
            const { data } = await axiosInstance.get("/project-v2/business/profile");
         

        setBusinessName(data.businessName);
        setBusinessLogo(data.businessLogo);
        setProfilePicture(data.profilePicture);
      } catch (err) {
        console.error("Error fetching business profile", err);
      }
    };

    fetchBusinessProfile();
    fetchUserProfilePicture()

    const user = localStorage.getItem("user");
    if (user) {
      setUserName(JSON.parse(user).fullName);
    }
  }, []);

  // useEffect(() => {
  //   const user = localStorage.getItem("user");
  //   if (!user) {
  //     return;
  //   }
  //   setUserName(JSON.parse(user).fullName);
  // }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        messagesPanelRef.current &&
        !messagesPanelRef.current.contains(event.target as Node)
      ) {
        setShowMessagesPanel(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearUserSessionData()
    window.location.href = "/login";
  };

  // Handle sidebar collapse state
  const handleSidebarCollapseChange = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end h-16 items-center">
            <div className="flex items-center space-x-4">
              <button
                className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-5 w-5 text-gray-600" />
                {/* <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full"></span> */}
              </button>
              <button
                className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
                onClick={() => setShowMessagesPanel(!showMessagesPanel)}
                aria-label="Open Messages"
              >
                <MessageSquare className="h-5 w-5 text-gray-600" />
                {/* <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full"></span> */}
              </button>
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg px-2 py-1 transition-colors"
                >
                  {userProfilePicture ? (
                    <img
                      src={userProfilePicture}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                      {userName?.split(" ")[0][0]?.toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700 hidden md:block">
                    {userName || "Loading..."}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <div className="flex">
        <SideNavigation
          activePanel={activePanel}
          onPanelChange={onPanelChange}
          onCollapseChange={handleSidebarCollapseChange}
          businessLogo={businessLogo}
          businessName={businessName}
        />

        <main
          className={`flex-1 transition-all duration-300 ${
            isSidebarCollapsed ? "ml-16" : "ml-64"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {showSettingsPanel ? <SettingsPanel /> : children}
          </div>
        </main>
        {/* Messages Panel */}
        {showMessagesPanel && (
          <div
            ref={messagesPanelRef}
            className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl z-50"
          >
            <MessagesPanel onClose={() => setShowMessagesPanel(false)} />
          </div>
        )}
        {/* Notifications Panel */}
        {showNotifications && (
          <NotificationsPanel
            onClose={() => setShowNotifications(false)}
            onNavigate={(panel) => {
              onPanelChange(panel);
              setShowNotifications(false);
            }}
          />
        )}
        {/* Backdrop for mobile */}
        {(showNotifications || showMessagesPanel || showSettingsPanel) && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => {
              setShowNotifications(false);
              setShowMessagesPanel(false);
              setShowSettingsPanel(false);
            }}
          />
        )}
      </div>
    </div>
  );
};
