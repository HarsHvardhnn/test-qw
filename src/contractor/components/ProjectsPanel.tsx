import React from 'react';
import { ProjectsPanel as Projects } from './projects/ProjectsPanel';

interface ProjectsPanelProps {
  onPanelChange?: (panel: string) => void;
}

export const ProjectsPanel: React.FC<ProjectsPanelProps> = ({ onPanelChange }) => {
  return <Projects onPanelChange={onPanelChange} />;
};