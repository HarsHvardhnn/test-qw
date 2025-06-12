import React, { useEffect, useState, useRef } from "react";
import { QwilloLogo } from "../../components/QwilloLogo";
import {
  Bell,
  LogOutIcon,
  MessageSquare,
  Menu,
  Settings,
  User,
  X,
  ChevronDown,
} from "lucide-react";
import { ContractorCommunication } from "./ContractorCommunication";
import { SettingsPanel } from "./SettingsPanel";
import { AlertsPanel } from "./AlertsPanel";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../../axios";

import {clearUserSessionData} from "../../utils/logout"

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  const [showCommunicationPanel, setShowCommunicationPanel] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [showAlertsPanel, setShowAlertsPanel] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [userData, setUserData] = useState<any>({});
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch profile info
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get(
          "/project-v2/business/profile"
        );
        setUserData(response.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  }, []);

  // Toggle helpers
  const toggleCommunicationPanel = () => {
    setShowCommunicationPanel((prev) => !prev);
    setShowSettingsPanel(false);
    setShowAlertsPanel(false);
  };

  const toggleSettingsPanel = () => {
    setShowSettingsPanel((prev) => !prev);
    setShowCommunicationPanel(false);
    setShowAlertsPanel(false);
  };

  const toggleAlertsPanel = () => {
    setShowAlertsPanel((prev) => !prev);
    setShowSettingsPanel(false);
    setShowCommunicationPanel(false);
  };

  const toggleUserDropdown = () => {
    setShowUserDropdown((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu((prev) => !prev);
  };

  const handleMobileButtonClick = (toggleFn: () => void) => {
    toggleFn();
    setShowMobileMenu(false);
  };

  const handleBack = () => {
    setShowSettingsPanel(false);
    setShowAlertsPanel(false);
  };

  const handleLogout = () => {
    clearUserSessionData()
    window.location.href = "/login";
  };

  const getInitials = (fullName: string): string => {
    if (!fullName?.trim()) return "";
    const nameParts = fullName.trim().split(" ");
    const firstInitial = nameParts[0]?.charAt(0).toUpperCase() || "";
    const lastInitial =
      nameParts.length > 1
        ? nameParts[nameParts.length - 1].charAt(0).toUpperCase()
        : "";
    return firstInitial + lastInitial;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="w-32 h-8">
                <QwilloLogo variant="full" />
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={toggleAlertsPanel}
                className="p-2 rounded-full hover:bg-gray-100 relative"
              >
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full" />
              </button>
              <button
                onClick={toggleCommunicationPanel}
                className="p-2 rounded-full hover:bg-gray-100 relative"
              >
                <MessageSquare className="h-5 w-5 text-gray-600" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full" />
              </button>
              <button
                onClick={toggleSettingsPanel}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <Settings className="h-5 w-5 text-gray-600" />
              </button>

              {/* User dropdown menu */}
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={toggleUserDropdown}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  {userData?.profilePicture ? (
                    <img
                      src={userData.profilePicture}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                      {getInitials(
                        userData?.fullName || userData?.businessName
                      )}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {userData?.fullName || userData?.businessName}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>

                {/* Dropdown menu */}
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-700">
                        {userData?.fullName || userData?.businessName}
                      </p>
                      <p className="text-xs text-gray-500">{userData?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                    >
                      <LogOutIcon className="h-4 w-4 mr-2 text-gray-500" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center space-x-2">
              <button
                onClick={toggleUserDropdown}
                className="flex items-center space-x-1"
              >
                {userData?.profilePicture ? (
                  <img
                    src={userData.profilePicture}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                    {getInitials(userData?.fullName || userData?.businessName)}
                  </div>
                )}
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <Menu className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-lg z-50">
          <div className="px-4 py-2">
            <div className="py-1">
              <button
                onClick={() => handleMobileButtonClick(toggleAlertsPanel)}
                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <Bell className="h-5 w-5 mr-3 text-gray-500" />
                <span>Notifications</span>
                <span className="ml-auto w-2 h-2 bg-blue-500 rounded-full" />
              </button>
            </div>
            <div className="py-1">
              <button
                onClick={() =>
                  handleMobileButtonClick(toggleCommunicationPanel)
                }
                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <MessageSquare className="h-5 w-5 mr-3 text-gray-500" />
                <span>Messages</span>
                <span className="ml-auto w-2 h-2 bg-blue-500 rounded-full" />
              </button>
            </div>
            <div className="py-1">
              <button
                onClick={() => handleMobileButtonClick(toggleSettingsPanel)}
                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <Settings className="h-5 w-5 mr-3 text-gray-500" />
                <span>Settings</span>
              </button>
            </div>
            <div className="py-1 border-t border-gray-200 mt-1">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <LogOutIcon className="h-5 w-5 mr-3 text-gray-500" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User dropdown on mobile */}
      {showUserDropdown && (
        <div className="md:hidden fixed top-16 right-0 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200 mr-2">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-700">
              {userData?.fullName || userData?.businessName}
            </p>
            <p className="text-xs text-gray-500">{userData?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
          >
            <LogOutIcon className="h-4 w-4 mr-2 text-gray-500" />
            Log out
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showSettingsPanel ? (
          <SettingsPanel onBack={handleBack} />
        ) : showAlertsPanel ? (
          <AlertsPanel onBack={handleBack} />
        ) : (
          children
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="w-24 h-6">
                <QwilloLogo variant="full" />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                © 2025 Qwillo. All rights reserved.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                Help Center
              </a>
              <a
                href="/pp.pdf"
                target="_blank"
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                Privacy Policy
              </a>
              <a
                href="/tos.pdf"
                target="_blank"
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Slide-out Communication Panel */}
      <div
        className={`fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          showCommunicationPanel ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800 px-4 py-2">
              Messages
            </h2>
            <button
              onClick={toggleCommunicationPanel}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <ContractorCommunication onClose={toggleCommunicationPanel} />
          </div>
        </div>
      </div>

      {/* Backdrop for mobile */}
      {(showCommunicationPanel ||
        showSettingsPanel ||
        showAlertsPanel ||
        showMobileMenu ||
        showUserDropdown) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => {
            setShowCommunicationPanel(false);
            setShowSettingsPanel(false);
            setShowAlertsPanel(false);
            setShowMobileMenu(false);
            setShowUserDropdown(false);
          }}
        ></div>
      )}
    </div>
  );
};
