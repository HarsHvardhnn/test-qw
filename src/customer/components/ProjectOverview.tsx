import React, { useState } from "react";
import { useProject } from "../context/ProjectContext";

import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  UserPlus,
  ChevronDown,
  ChevronUp,
  Building2,
  Shield,
  User,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Activity,
} from "lucide-react";
// import { AssignStakeholderModal } from './AssignStakeholderModal';

interface Stakeholder {
  id: string;
  name: string;
  company: string;
  type: "financial" | "insurance" | "inspector" | "realtor" | "investor";
  email: string;
  phone?: string;
  address: string;
  status: "active" | "pending";
  logo?: string;
  contactPerson?: {
    name: string;
    title: string;
    phone: string;
    email: string;
    photo?: string;
  };
}

export const ProjectOverview: React.FC = () => {
  const {
    projectName,
    customerName,
    contractorName,
    projectStatus,
    projectId,
    date,
    projectIdShort,
  } = useProject();
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showStakeholders, setShowStakeholders] = useState(true);

  // Sample stakeholders data with logos and contact person photos
  const [stakeholders] = useState<Stakeholder[]>([
    {
      id: "1",
      name: "First National Bank",
      company: "First National Bank",
      type: "financial",
      email: "contact@fnb.com",
      phone: "(212) 555-0123",
      address: "123 Financial Ave, New York, NY 10001",
      status: "active",
      logo: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&q=80",
      contactPerson: {
        name: "John Smith",
        title: "Loan Officer",
        phone: "(212) 555-0124",
        email: "john.smith@fnb.com",
        photo:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80",
      },
    },
    {
      id: "2",
      name: "SafeGuard Insurance",
      company: "SafeGuard Insurance Co.",
      type: "insurance",
      email: "info@safeguard.com",
      phone: "(312) 555-0456",
      address: "456 Insurance Blvd, Chicago, IL 60601",
      status: "pending",
      logo: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&q=80",
      contactPerson: {
        name: "Emily Johnson",
        title: "Insurance Agent",
        phone: "(312) 555-0457",
        email: "emily.johnson@safeguard.com",
        photo:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80",
      },
    },
  ]);

  // Function to get status display information
  const getStatusInfo = () => {
    switch (projectStatus) {
      case "active":
        return {
          label: "Active",
          color: "bg-purple-100 text-purple-800 border-purple-200",
          icon: <Activity className="w-5 h-5 mr-2" />,
        };
      case "awaiting-finalization":
        return {
          label: "Awaiting Finalization",
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: <Clock className="w-5 h-5 mr-2" />,
        };
      case "in-progress":
        return {
          label: "In Progress",
          color: "bg-blue-100 text-blue-800 border-blue-200",
          icon: <AlertCircle className="w-5 h-5 mr-2" />,
        };
      case "completed":
        return {
          label: "Completed",
          color: "bg-green-100 text-green-800 border-green-200",
          icon: <CheckCircle className="w-5 h-5 mr-2" />,
        };
      default:
        return {
          label: "Unknown Status",
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: <Clock className="w-5 h-5 mr-2" />,
        };
    }
  };

  const getStakeholderIcon = (type: string) => {
    switch (type) {
      case "financial":
        return <Building2 className="w-5 h-5 text-blue-600" />;
      case "insurance":
        return <Shield className="w-5 h-5 text-green-600" />;
      case "inspector":
        return <User className="w-5 h-5 text-purple-600" />;
      case "realtor":
        return <Building2 className="w-5 h-5 text-orange-600" />;
      case "investor":
        return <Building2 className="w-5 h-5 text-yellow-600" />;
      default:
        return <User className="w-5 h-5 text-gray-600" />;
    }
  };

  const handleMessageClick = (stakeholder: Stakeholder) => {
    // Get the parent element that contains the messages panel
    const dashboardLayout = document.querySelector(".min-h-screen.bg-gray-50");
    if (!dashboardLayout) return;

    // Find the messages button in the header
    const messagesButton = dashboardLayout.querySelector(
      'button[aria-label="Open Messages"]'
    );
    if (messagesButton instanceof HTMLButtonElement) {
      messagesButton.click();
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <>
      <div className="space-y-6 w-full px-2 sm:px-4">
        {/* Project Info Card */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                {projectName}
              </h1>
              <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 text-gray-600 text-sm">
                <div className="flex items-center">
                  <span className="font-medium">Customer:</span>
                  <span className="ml-2">{customerName}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">Contractor:</span>
                  <span className="ml-2">{contractorName}</span>
                </div>
              </div>
              <div className="text-xs sm:text-sm text-gray-500">
                <span>Project ID: {projectIdShort}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <button
                onClick={() => setShowAssignModal(true)}
                className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors flex items-center text-sm w-full sm:w-auto justify-center"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                <span>Assign Stakeholder</span>
              </button>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div
                  className={`flex items-center px-3 py-2 rounded-lg border text-sm ${statusInfo.color}`}
                >
                  {statusInfo.icon}
                  <span className="font-medium">{statusInfo.label}</span>
                </div>

                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span>{date}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stakeholders Panel */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div
            className="px-4 sm:px-6 py-4 border-b border-gray-200 flex items-center justify-between opacity-60"
            // Removed onClick handler to disable toggling
          >
            <div className="flex items-center">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                Project Stakeholders
              </h2>
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {stakeholders.length}
              </span>
            </div>
            {/* Always show ChevronDown since it's always collapsed */}
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </div>

          {/* The content section is not rendered at all since showStakeholders will always be false */}
        </div>
      </div>
      {/* <AssignStakeholderModal 
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
      /> */}
    </>
  );
};
