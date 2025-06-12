import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { ProjectManagement } from "../project-management/ProjectManagement";
import axiosInstance from "../../../axios";
import { useLoader } from "../../../context/LoaderContext";

interface ProjectsPanelProps {
  onPanelChange?: (panel: string) => void;
  setActiveProject: any;
}

export const ProjectsPanel: React.FC<ProjectsPanelProps> = ({
  onPanelChange,
  setActiveProject,
}) => {
  const { showLoader, hideLoader } = useLoader();
  const [activeProjects, setActiveProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  // Add this useEffect to scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        showLoader();
        const response = await axiosInstance.get(
          "/quote/v2/projects/dashboard"
        );
        setActiveProjects(response.data);
      } catch (err) {
        console.error("Error fetching projects:", err);
        // setError(err.response?.data?.message || "Something went wrong!");
      } finally {
        hideLoader();
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      setActiveProject(selectedProject);
    }
  }, [selectedProject, setActiveProject]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Projects</h1>
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-500">
            Last updated: Today, 10:45 AM
          </span>
        </div>
      </div>

      {selectedProject ? (
        <ProjectManagement
          project={selectedProject}
          onBack={() => setSelectedProject(null)}
          quoteId={selectedProject?.quoteId}
        />
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-800">Active Projects</h2>
          <div className="grid grid-cols-1 gap-4">
            {activeProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-medium text-gray-900">
                        {project.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Customer: {project.customerName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        ${Number(project.totalAmount).toFixed(2)}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">Total Amount</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        Project Progress
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {project.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Project Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Next Milestone</p>
                      <p className="text-sm font-medium text-gray-900">
                        {project.nextMilestone}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Next Payment</p>
                      <p className="text-sm font-medium text-gray-900">
                        {project.nextPayment}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Due Date</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(project.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Manage Project
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
