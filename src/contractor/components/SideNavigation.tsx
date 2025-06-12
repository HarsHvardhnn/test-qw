import React, { useEffect, useState } from "react";
import {
  Home,
  FileText,
  Users,
  Settings,
  UserPlus,
  FolderTree,
  DollarSign,
  ChevronRight,
  ChevronLeft,
  Network,
} from "lucide-react";
import { QwilloLogo } from "../../components/QwilloLogo";
import { jwtDecode } from "jwt-decode";
import { useUser } from "../../context/UserContext";

interface SideNavigationProps {
  activePanel: string;
  onPanelChange: (panel: string) => void;
  onCollapseChange?: (collapsed: boolean) => void;
  businessName: string; // Business name
}

export const SideNavigation: React.FC<SideNavigationProps> = ({
  activePanel,
  onPanelChange,
  onCollapseChange,

  businessName,
}) => {
  const {
    userProfilePicture,
    businessProfilePicture,
    fetchUserProfilePicture,
    fetchBusinessProfilePicture,
  }= useUser()
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {

        fetchUserProfilePicture();
        fetchBusinessProfilePicture();
      
    }
  }, []);
  // Notify parent component when sidebar collapses or expands
  useEffect(() => {
   
    if (onCollapseChange) {
      onCollapseChange(isCollapsed);
    }
  }, [isCollapsed, onCollapseChange]);

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

  const navItems = [
    { id: "overview", label: "Dashboard", icon: <Home className="w-5 h-5" /> },
    { id: "quotes", label: "Quotes", icon: <DollarSign className="w-5 h-5" /> },
    {
      id: "projects",
      label: "Projects",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      id: "subprojects",
      label: "Sub Projects",
      icon: <FolderTree className="w-5 h-5" />,
      comingSoon: true,
    },
    {
      id: "teams",
      label: "Teams",
      icon: <Network className="w-5 h-5" />,
      comingSoon: true,
    },
    {
      id: "leads",
      label: "Customers & Leads",
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: "subcontractors",
      label: "Sub Contractors",
      icon: <UserPlus className="w-5 h-5" />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <div
      className={`bg-white shadow-md flex flex-col h-screen fixed left-0 top-0 z-20 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-12 bg-white rounded-r-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {/* Header with Business Logo/Name */}
      <div className="p-6">
        {isCollapsed ? (
          <div className="flex flex-col items-center justify-center">
            {businessProfilePicture ? (
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
                <img
                  src={businessProfilePicture}
                  alt={`${businessName} logo`}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-medium">
                  {getInitials(businessName)}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center">
            {businessProfilePicture ? (
              <div className="w-12 h-12 mr-3 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
                <img
                  src={businessProfilePicture}
                  alt={`${businessName} logo`}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-12 h-12 mr-3 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-medium text-lg">
                  {getInitials(businessName)}
                </span>
              </div>
            )}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
                {businessName}
              </h2>
              <p className="text-xs text-gray-500">Contractor Portal</p>
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 px-2 pb-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onPanelChange(item.id)}
                disabled={item.comingSoon}
                className={`w-full flex items-center transition-colors rounded-lg ${
                  activePanel === item.id
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                } ${item.comingSoon ? " cursor-not-allowed" : ""}`}
              >
                <div
                  className={`flex items-center justify-center w-12 h-12 ${
                    isCollapsed ? "w-full" : ""
                  }`}
                >
                  <span
                    className={
                      activePanel === item.id
                        ? "text-blue-600"
                        : "text-gray-500"
                    }
                  >
                    {item.icon}
                  </span>
                </div>
                {!isCollapsed && (
                  <div className="flex items-center justify-between flex-1 pr-4">
                    <span className="whitespace-nowrap">{item.label}</span>
                    {item.comingSoon && (
                      <span className="px-1.5 py-0.5 text-[10px] font-medium bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-sm whitespace-nowrap">
                        Coming Soon
                      </span>
                    )}
                  </div>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Qwillo Logo and Version */}
      <div
        className={`px-4 pt-3 pb-4 border-t border-gray-200 bg-gray-50 ${
          isCollapsed ? "text-center" : ""
        }`}
      >
        <div
          className={`mx-auto opacity-75 ${
            isCollapsed ? "w-10 h-10" : "w-32 h-8"
          }`}
        >
          <QwilloLogo variant={isCollapsed ? "icon" : "full"} />
        </div>
        {!isCollapsed && (
          <div className="mt-2 flex flex-col items-center justify-center space-y-1">
            <div className="px-2 py-0.5 bg-white/50 rounded-full">
              <span className="text-[10px] font-medium tracking-wider text-gray-600">
                VERSION 1.3
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
