import React from 'react';
import { AlertCircle, ChevronRight, DollarSign, Calendar } from 'lucide-react';

export interface Project {
  id: number;
  name: string;
  contractor: string;
  amount: string;
  progress: number;
  status: string;
  nextMilestone: string;
  nextPayment: string;
  dueDate: string;
  flagged: boolean;
  flagReason?: string;
}

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer" onClick={onClick}>
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center">
            <h3 className="text-lg font-medium text-gray-800">{project.name}</h3>
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
              project.status === 'active' ? 'bg-green-100 text-green-800' :
              project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
              project.status === 'on-hold' ? 'bg-orange-100 text-orange-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
            {project.flagged && (
              <div className="ml-2 flex items-center text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full text-xs">
                <AlertCircle className="w-3 h-3 mr-1" />
                {project.flagReason || 'Flagged'}
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">Contractor: {project.contractor}</p>
          <div className="flex items-center mt-1 text-sm text-gray-500">
            <span>Project ID: {project.id}</span>
          </div>
        </div>
        
        <div className="mt-4 md:mt-0 md:ml-6 md:text-right">
          <p className="text-lg font-semibold text-gray-800">{project.amount}</p>
          <div className="flex items-center justify-end mt-1 text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            <span>Due: {formatDate(project.dueDate)}</span>
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-gray-700">Project Progress</span>
          <span className="text-xs font-medium text-gray-700">{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${
              project.status === 'on-hold' 
                ? 'bg-orange-500' 
                : project.status === 'completed'
                  ? 'bg-green-500'
                  : 'bg-blue-600'
            }`}
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
      </div>
      
      {/* Next Milestone */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-gray-500">Next Milestone</p>
          <p className="text-sm font-medium text-gray-800">{project.nextMilestone}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Next Payment</p>
          <p className="text-sm font-medium text-gray-800">{project.nextPayment}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Due Date</p>
          <div className="flex items-center">
            <Calendar className="w-3 h-3 text-gray-500 mr-1" />
            <p className="text-sm font-medium text-gray-800">
              {formatDate(project.dueDate)}
            </p>
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="mt-4 flex items-center justify-end space-x-2">
        <button 
          className="px-3 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors flex items-center"
          onClick={(e) => {
            e.stopPropagation();
            // Handle approve payment action
          }}
        >
          <DollarSign className="w-3 h-3 mr-1" />
          Approve Payment
        </button>
        <button 
          className="px-3 py-1 text-xs text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors flex items-center"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          View Details
          <ChevronRight className="w-3 h-3 ml-1" />
        </button>
      </div>
    </div>
  );
};