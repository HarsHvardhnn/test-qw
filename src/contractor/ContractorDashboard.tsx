import React, { useState, useEffect } from "react";
import { DashboardLayout } from "./components/DashboardLayout";
import { OverviewPanel } from "./components/OverviewPanel";
import { LeadsPanel } from "./components/leads/LeadsPanel";
import { ProjectsPanel } from "./components/projects/ProjectsPanel";
import { MessagesPanel } from "./components/MessagesPanel";
import { SettingsPanel } from "./components/settings/SettingsPanel";
import { SubContractorsPanel } from "./components/subcontractors/SubContractorsPanel";
import { QuotesPanel } from "./components/QuotesPanel";
import { CreateMeetingModal } from "./components/CreateMeetingModal";
import { QwilloAIFloating } from "../components/QwilloAIFloating";
import useRequireRole from "../utils/authRole";

type PanelType =
  | "overview"
  | "quotes"
  | "leads"
  | "projects"
  | "messages"
  | "settings"
  | "subcontractors";

export const ContractorDashboard: React.FC = () => {
  const [activePanel, setActivePanel] = useState<PanelType>("overview");
  const [showCreateMeeting, setShowCreateMeeting] = useState(false);
  const [activeProject, setActiveProject] = useState();
  const [isDesktop, setIsDesktop] = useState(true);

  useRequireRole("business");

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

  const renderPanel = () => {
    switch (activePanel) {
      case "overview":
        return (
          <OverviewPanel
            onCreateMeeting={() => setShowCreateMeeting(true)}
            setActivePanel={setActivePanel}
          />
        );
      case "quotes":
        return <QuotesPanel setContext={setActiveProject} />;
      case "leads":
        return <LeadsPanel />;
      case "projects":
        return (
          <ProjectsPanel
            onPanelChange={handlePanelChange}
            setActiveProject={setActiveProject}
          />
        );
      case "messages":
        return <MessagesPanel />;
      case "settings":
        return <SettingsPanel />;
      case "subcontractors":
        return <SubContractorsPanel />;
      default:
        return (
          <OverviewPanel onCreateMeeting={() => setShowCreateMeeting(true)} />
        );
    }
  };

  const handlePanelChange = (panel: string) => {
    setActivePanel(panel as PanelType);
  };

  if (!isDesktop) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center p-6 z-50">
        <div className="max-w-md bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 border border-gray-700 text-center">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-yellow-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            ></path>
          </svg>

          <h2 className="text-2xl font-bold mb-2 text-white">
            Larger Screen Required
          </h2>

          <p className="text-gray-300 mb-6">
            This dashboard contains complex features that require a desktop or
            tablet device with a screen width of at least 1024px.
          </p>

          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-300">
              Please access this dashboard from a larger screen for the complete
              experience.
            </p>
          </div>

          <button
            onClick={() => window.open(window.location.href, "_self")}
            className="bg-blue-600 hover:bg-blue-700 transition-colors w-full text-white py-3 px-4 rounded-lg font-medium"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardLayout activePanel={activePanel} onPanelChange={setActivePanel}>
        {renderPanel()}
      </DashboardLayout>

      <CreateMeetingModal
        isOpen={showCreateMeeting}
        onClose={() => setShowCreateMeeting(false)}
      />

      <QwilloAIFloating context={activeProject} />
    </div>
  );
};

export default ContractorDashboard;
