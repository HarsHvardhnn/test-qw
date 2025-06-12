import React from 'react';
import { Project } from './ProjectCard';
import { ProjectCard } from './ProjectCard';

interface ProjectListProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({ projects, onSelectProject }) => {
  if (projects.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">No projects found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {projects.map((project) => (
        <ProjectCard 
          key={project.id} 
          project={project} 
          onClick={() => onSelectProject(project)}
        />
      ))}
    </div>
  );
};