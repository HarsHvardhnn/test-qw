import React, { createContext, useContext, useState } from 'react';

interface ProjectContextType {
  projectName: string;
  customerName: string;
  contractorName: string;
  projectId: string;
  setProjectName: (name: string) => void;
  setCustomerName: (name: string) => void;
  setContractorName: (name: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projectName, setProjectName] = useState<string>('Kitchen Remodel');
  const [customerName, setCustomerName] = useState<string>('Sarah Johnson');
  const [contractorName, setContractorName] = useState<string>('J9 Construction, LLC');
  const [projectId] = useState<string>('PRJ-2025-001');

  const value = {
    projectName,
    customerName,
    contractorName,
    projectId,
    setProjectName,
    setCustomerName,
    setContractorName
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};