import React, { useState } from 'react';
import { Project } from './types';
import { Calendar, CheckSquare, User, MapPin } from 'lucide-react';

interface ScheduleInspectionModalProps {
  onClose: () => void;
  onSchedule: (projectId: number, milestone: string, date: string, inspector: string) => void;
  projects: Project[];
}

export const ScheduleInspectionModal: React.FC<ScheduleInspectionModalProps> = ({
  onClose,
  onSchedule,
  projects
}) => {
  const [selectedProject, setSelectedProject] = useState<number | ''>('');
  const [inspectionDate, setInspectionDate] = useState('');
  const [inspector, setInspector] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // Sample inspectors
  const inspectors = [
    { id: 1, name: 'John Smith' },
    { id: 2, name: 'Emily Johnson' },
    { id: 3, name: 'Michael Brown' },
    { id: 4, name: 'Sarah Davis' }
  ];

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    if (!selectedProject) newErrors.project = 'Please select a project';
    if (!inspector) newErrors.inspector = 'Please select an inspector';
    if (!inspectionDate) newErrors.date = 'Please select a date';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    if (selectedProject && inspectionDate && inspector) {
      const project = projects.find(p => p.id === selectedProject);
      if (project) {
        onSchedule(selectedProject, project.milestone, inspectionDate, inspector);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6 flex items-center">
                  <CheckSquare className="w-6 h-6 text-blue-600 mr-2" />
                  Schedule New Inspection
                </h3>
                
                <div className="mt-4 space-y-6">
                  <div>
                    <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                      Project
                      {errors.project && <span className="ml-2 text-xs text-red-500">{errors.project}</span>}
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <select
                        id="project"
                        className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md text-gray-900 p-2.5 ${errors.project ? 'border-red-300' : ''}`}
                        value={selectedProject}
                        onChange={(e) => {
                          setSelectedProject(Number(e.target.value));
                          if (errors.project) {
                            const newErrors = {...errors};
                            delete newErrors.project;
                            setErrors(newErrors);
                          }
                        }}
                      >
                        <option value="">Select a project</option>
                        {projects.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.name} - {project.milestone}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="inspector" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <User className="w-4 h-4 text-gray-500 mr-2" />
                      Inspector
                      {errors.inspector && <span className="ml-2 text-xs text-red-500">{errors.inspector}</span>}
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <select
                        id="inspector"
                        className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md text-gray-900 p-2.5 ${errors.inspector ? 'border-red-300' : ''}`}
                        value={inspector}
                        onChange={(e) => {
                          setInspector(e.target.value);
                          if (errors.inspector) {
                            const newErrors = {...errors};
                            delete newErrors.inspector;
                            setErrors(newErrors);
                          }
                        }}
                      >
                        <option value="">Select an inspector</option>
                        {inspectors.map((insp) => (
                          <option key={insp.id} value={insp.name}>
                            {insp.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                      Inspection Date
                      {errors.date && <span className="ml-2 text-xs text-red-500">{errors.date}</span>}
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="date"
                        id="date"
                        className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md text-gray-900 p-2.5 ${errors.date ? 'border-red-300' : ''}`}
                        value={inspectionDate}
                        onChange={(e) => {
                          setInspectionDate(e.target.value);
                          if (errors.date) {
                            const newErrors = {...errors};
                            delete newErrors.date;
                            setErrors(newErrors);
                          }
                        }}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleSubmit}
            >
              Schedule Inspection
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};