import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { DashboardLayout } from "./components/DashboardLayout";
import { ProjectOverview } from "./components/ProjectOverview";
import { TaskProgressTracker } from "./components/TaskProgressTracker";
import { ProductSelections } from "./components/ProductSelections";
import { QuoteBreakdown } from "./components/QuoteBreakdown";
import { ProjectProvider } from "./context/ProjectContext";
import { TaskProvider } from "./context/TaskContext";
import { ProductProvider } from "./context/ProductContext";
import { QuoteProvider } from "./context/QuoteContext";
import { WelcomeAnimation } from "./components/WelcomeAnimation";
import { RelatedServicesCarousel } from "./components/RelatedServicesCarousel";
import useRequireRole from "../utils/authRole";
import axiosInstance from "../axios";

import noproject from "../assets/no_project.png"; // Adjust path if needed

export const CustomerDashboard: React.FC = () => {
  const [showDashboard, setShowDashboard] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [p, setP] = useState();
  const [noProject, setNoProject] = useState(false);
  useRequireRole("user");

  useEffect(() => {
    const idFromParams = searchParams.get("projectId");

    if (idFromParams) {
      setProjectId(idFromParams);
    } else {
      const fetchLatestProject = async () => {
        try {
          const res = await axiosInstance.get("/project-v2/prj/latest");
          if (res.data?.project?._id) {
            const latestId = res.data.project._id;
            setProjectId(latestId);
            setSearchParams({ projectId: latestId });
            
          } else {
            setNoProject(true);
          }
        } catch (err) {
          console.error("Error fetching latest project:", err);
          setNoProject(true);
        }
      };

      fetchLatestProject();
    }
  }, [searchParams, setSearchParams]);

  console.log('no project?',noProject)
  if (noProject) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
        <img
          src={noproject}
          alt="No Project"
          className="w-64 h-64 object-contain mb-6"
        />
        <h2 className="text-xl md:text-2xl font-semibold text-gray-700">
          No Projects (Yet), But Plenty of Ideas Brewing ☕
        </h2>
      </div>
    );
  }

  return (
    <ProjectProvider projectId={projectId}>
      <TaskProvider projectId={projectId}>
        <ProductProvider onProductChange={setP}>
          <QuoteProvider projectId={projectId} p={p}>
            <div className="relative min-h-screen">
              <div
                className={`transition-opacity duration-500 ${
                  showDashboard
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                <DashboardLayout>
                  <div className="space-y-6">
                    <ProjectOverview projectId={projectId} />
                    <TaskProgressTracker projectId={projectId} />
                    <ProductSelections projectId={projectId} setP={setP} />
                    <RelatedServicesCarousel />
                    <QuoteBreakdown projectId={projectId} />
                  </div>
                </DashboardLayout>
              </div>

              {!showDashboard && (
                <WelcomeAnimation onComplete={() => setShowDashboard(true)} />
              )}
            </div>
          </QuoteProvider>
        </ProductProvider>
      </TaskProvider>
    </ProjectProvider>
  );
};
