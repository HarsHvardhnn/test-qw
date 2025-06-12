import React, { useEffect, useState, useRef } from "react";
import { SideNavigation } from "./components/SideNavigation";
import { OverviewPanel } from "./components/OverviewPanel";
import { ProductsPanel } from "./components/products/ProductsPanel";
import { ServicesPanel } from "./components/services/ServicesPanel";
import { MarketingPlansPanel } from "./components/marketing/MarketingPlansPanel";
import { SettingsPanel } from "./components/settings/SettingsPanel";
import { Bell, Laptop, LogOutIcon, ChevronDown, User } from "lucide-react";
import useRequireRole from "../utils/authRole";
import { jwtDecode } from "jwt-decode";

import {clearUserSessionData} from "../utils/logout"

type PanelType =
  | "overview"
  | "products"
  | "services"
  | "marketing"
  | "orders"
  | "analytics"
  | "settings";

export const VendorDashboard: React.FC = () => {
  const [activePanel, setActivePanel] = useState<PanelType>("overview");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [userData, setUserData] = useState<any>({});
  const [isDesktop, setIsDesktop] = useState(true);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useRequireRole("vendor");

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
    const decoded: any = jwtDecode(token);
    setUserData(decoded);
  }, []);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1300); // Tailwind's `lg:` breakpoint
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const toggleUserDropdown = () => {
    setShowUserDropdown((prev) => !prev);
  };

  const handleLogout = () => {
    console.log('logging out')
    clearUserSessionData()
    window.location.href = "/login";
  };

  const getInitials = (fullName: string): string => {
    if (!fullName?.trim()) return ""; // Handle empty input

    const nameParts = fullName?.trim().split(" ");
    const firstInitial = nameParts[0]?.charAt(0).toUpperCase() || "";

    let lastInitial = "";
    if (nameParts.length > 1) {
      lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
    }

    return firstInitial + lastInitial; // Combine initials
  };

  const renderPanel = () => {
    switch (activePanel) {
      case "overview":
        return <OverviewPanel setActivePanel={setActivePanel} />;
      case "products":
        return <ProductsPanel />;
      case "services":
        return <ServicesPanel />;
      case "marketing":
        return <MarketingPlansPanel />;
      case "settings":
        return <SettingsPanel />;
      default:
        return <OverviewPanel />;
    }
  };

  if (!isDesktop) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center p-6 z-50">
        <div className="max-w-md bg-gradient-to-br from-blue-800 to-indigo-900 rounded-xl shadow-lg p-6 border border-blue-700 text-center">
          <Laptop className="w-16 h-16 mx-auto mb-4 text-blue-300" />

          <h2 className="text-2xl font-bold mb-2 text-white">
            Vendor Dashboard
          </h2>

          <p className="text-gray-200 mb-6">
            This dashboard requires a larger screen (minimum width: 1024px) to
            properly display all vendor tools and features.
          </p>

          <div className="bg-blue-900 bg-opacity-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-100">
              Please switch to a desktop or tablet device with a larger screen
              to access your vendor dashboard.
            </p>
          </div>

          <button
            onClick={() => window.open(window.location.href, "_self")}
            className="bg-blue-600 hover:bg-blue-500 transition-colors w-full text-white py-3 px-4 rounded-lg font-medium"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Side Navigation */}
      <SideNavigation
        activePanel={activePanel}
        onPanelChange={setActivePanel}
        userData={userData}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-end px-6 sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Bell className="h-6 w-6 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
            </button>

            {/* User dropdown menu */}
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={toggleUserDropdown}
                className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                  {getInitials(userData?.fullName)}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden md:block">
                  {userData?.fullName}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              {/* Dropdown menu */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-700">
                      {userData?.fullName}
                    </p>
                    <p className="text-xs text-gray-500">{userData?.email}</p>
                    <p className="text-xs text-gray-500 mt-1">Vendor Account</p>
                  </div>
                
                  <div className="py-1 border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                    >
                      <LogOutIcon className="h-4 w-4 mr-2 text-gray-500" />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-auto">{renderPanel()}</main>
      </div>

      {/* Backdrop for dropdown when shown (for better UX) */}
      {/* {showUserDropdown && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowUserDropdown(false)}
        ></div>
      )} */}
    </div>
  );
};

export default VendorDashboard;
