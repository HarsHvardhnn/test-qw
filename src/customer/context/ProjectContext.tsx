import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../../axios'; // Ensure axiosInstance is correctly configured
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// Define the project status types
export type ProjectStatus = 'awaiting-finalization' | 'in-progress' | 'completed' | 'active';

// Define the project context interface
interface ProjectContextType {
  projectName: string;
  customerName: string;
  contractorName: string;
  projectStatus: ProjectStatus;
  projectId: string;
  projectLocation: string;
  projectType: string;
  setProjectName: (name: string) => void;
  setProjectStatus: (status: ProjectStatus) => void;
  projectIdShort: string;
}

// Create the context with default values
const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Provider component
export const ProjectProvider: React.FC<{ children: React.ReactNode; projectId: string }> = ({ children, projectId }) => {
  const [projectName, setProjectName] = useState<string>('Loading...');
  const [customerName ,setCustomerName] = useState<string>('John Doe'); // Hardcoded customer name
  const [contractorName,setContractorName] = useState<string>('J9 Construction, LLC'); // Hardcoded contractor
  const [projectStatus, setProjectStatus] = useState<ProjectStatus>('in-progress');
  const [projectLocation, setProjectLocation] = useState<string>('');
  const [projectType, setProjectType] = useState<string>('');
  const [projectIdShort, setProjectIdShort] = useState<string>(''); // Shortened project ID
  const [date,setDate]=useState<string>(''); // Date state

  const navigate=useNavigate()
  // Fetch project details
  useEffect(() => {
    if (!projectId) {
      return;
      // navigate('/login')
    }

    const fetchProject = async () => {
      try {
        const response = await axiosInstance.get(`/project-v2/${projectId}`);
        const project = response.data;

        setProjectName(project.fullName || 'Unknown Project');
        setProjectLocation(project.projectLocation || 'Unknown Location');
        setProjectType(project.projectType || 'Unknown Type');
        setContractorName(project.userId?.fullName)
        setCustomerName(project.quote?.customer?.fullName)
        setProjectIdShort(project?.projectId || "Unknown ID");
        setDate(project?.createdAt?.split('T')[0] || "Unknown Date")
        setProjectStatus(project.status.toLowerCase() as ProjectStatus); // Convert to expected type
      } catch (error) {
        console.error('Error fetching project details:', error);
      }
    };

    fetchProject();
  }, [projectId]);

  const value = {
    projectName,
    customerName,
    contractorName,
    projectStatus,
    projectId,
    projectLocation,
    projectType,
    setProjectName,
    setProjectStatus,
    projectIdShort,
    date
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};

// Custom hook to use the project context
export const useProject = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
