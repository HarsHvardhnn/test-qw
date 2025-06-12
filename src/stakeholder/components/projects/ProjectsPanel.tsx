import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { ProjectFilters } from './ProjectFilters';
import { ProjectList } from './ProjectList';
import { ProjectDetailModal, Project as DetailProject } from './ProjectDetailModal';
import { Project } from './ProjectCard';

interface ProjectsPanelProps {
  onPanelChange?: (panel: string) => void;
}

export const ProjectsPanel: React.FC<ProjectsPanelProps> = ({ onPanelChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [selectedProject, setSelectedProject] = useState<DetailProject | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Sample projects data
  const projects: Project[] = [
    {
      id: 1,
      name: 'Smith Home Remodel',
      contractor: 'J9 Construction',
      amount: '$250,000',
      progress: 35,
      status: 'active',
      nextMilestone: 'Foundation Complete',
      nextPayment: '$25,000',
      dueDate: '2025-06-15',
      flagged: false
    },
    {
      id: 2,
      name: 'Johnson Kitchen Renovation',
      contractor: 'Modern Designs Inc.',
      amount: '$75,000',
      progress: 60,
      status: 'active',
      nextMilestone: 'Cabinets Installed',
      nextPayment: '$15,000',
      dueDate: '2025-06-10',
      flagged: false
    },
    {
      id: 3,
      name: 'Davis Bathroom Remodel',
      contractor: 'Luxury Bath Solutions',
      amount: '$45,000',
      progress: 25,
      status: 'active',
      nextMilestone: 'Plumbing Rough-In',
      nextPayment: '$10,000',
      dueDate: '2025-06-08',
      flagged: true,
      flagReason: 'Behind Schedule'
    },
    {
      id: 4,
      name: 'Wilson Basement Finishing',
      contractor: 'Basement Experts LLC',
      amount: '$85,000',
      progress: 15,
      status: 'active',
      nextMilestone: 'Framing Complete',
      nextPayment: '$20,000',
      dueDate: '2025-06-20',
      flagged: false
    },
    {
      id: 5,
      name: 'Thompson Roof Replacement',
      contractor: 'Superior Roofing Co.',
      amount: '$35,000',
      progress: 100,
      status: 'completed',
      nextMilestone: 'Project Complete',
      nextPayment: '$0',
      dueDate: '2025-04-30',
      flagged: false
    },
    {
      id: 6,
      name: 'Garcia Deck Construction',
      contractor: 'Outdoor Living Spaces',
      amount: '$28,000',
      progress: 0,
      status: 'pending',
      nextMilestone: 'Project Initiation',
      nextPayment: '$8,000',
      dueDate: '2025-06-15',
      flagged: false
    },
    {
      id: 7,
      name: 'Brown Pool Installation',
      contractor: 'Aqua Pools & Spas',
      amount: '$120,000',
      progress: 40,
      status: 'on-hold',
      nextMilestone: 'Plumbing Installation',
      nextPayment: '$25,000',
      dueDate: '2025-06-01',
      flagged: true,
      flagReason: 'Permit Issue'
    }
  ];

  // Sample detailed project data for modal
  const getDetailedProject = (id: number): DetailProject => {
    const baseProject = projects.find(p => p.id === id) as Project;
    
    return {
      ...baseProject,
      contractorContact: {
        name: 'John Smith',
        phone: '(555) 123-4567',
        email: 'john@example.com'
      },
      customer: {
        name: 'Robert Smith',
        phone: '(555) 987-6543',
        email: 'robert.smith@example.com'
      },
      address: '123 Main St, Anytown, CA 90210',
      startDate: '2025-05-01',
      endDate: '2025-09-15',
      milestones: [
        {
          id: 1,
          name: 'Project Initiation',
          amount: '$50,000',
          status: 'completed',
          dueDate: '2025-05-15',
          completedDate: '2025-05-12'
        },
        {
          id: 2,
          name: 'Foundation Complete',
          amount: '$25,000',
          status: 'in-progress',
          dueDate: '2025-06-15'
        },
        {
          id: 3,
          name: 'Framing Complete',
          amount: '$50,000',
          status: 'upcoming',
          dueDate: '2025-07-15'
        },
        {
          id: 4,
          name: 'Drywall Installation',
          amount: '$30,000',
          status: 'upcoming',
          dueDate: '2025-08-01'
        },
        {
          id: 5,
          name: 'Final Completion',
          amount: '$95,000',
          status: 'upcoming',
          dueDate: '2025-09-15'
        }
      ],
      documents: [
        {
          id: 1,
          name: 'Construction Contract',
          type: 'contract',
          date: '2025-04-15',
          url: '#'
        },
        {
          id: 2,
          name: 'Building Permit',
          type: 'permit',
          date: '2025-04-28',
          url: '#'
        },
        {
          id: 3,
          name: 'Initial Payment Invoice',
          type: 'invoice',
          date: '2025-05-05',
          url: '#'
        }
      ]
    };
  };

  // Filter projects based on search term and status filter
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.contractor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Sort projects based on selected sort option
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'amount':
        return parseFloat(a.amount.replace(/[^0-9.-]+/g, '')) - parseFloat(b.amount.replace(/[^0-9.-]+/g, ''));
      case 'progress':
        return b.progress - a.progress;
      case 'dueDate':
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      default:
        return 0;
    }
  });

  const handleSelectProject = (project: Project) => {
    const detailedProject = getDetailedProject(project.id);
    setSelectedProject(detailedProject);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Projects</h1>
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-500">Last updated: Today, 10:45 AM</span>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <ProjectFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />

      {/* Projects List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            {filteredProjects.length} {filteredProjects.length === 1 ? 'Project' : 'Projects'}
          </h2>
        </div>

        <ProjectList 
          projects={sortedProjects} 
          onSelectProject={handleSelectProject}
        />
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
};