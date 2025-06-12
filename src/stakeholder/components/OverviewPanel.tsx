import React, { useState } from 'react';
import { 
  BarChart3, 
  DollarSign, 
  CheckSquare, 
  AlertCircle, 
  Clock, 
  ChevronRight,
  Calendar,
  Home,
  FileText
} from 'lucide-react';
import { StatCard } from './StatCard';
import { ProjectCard } from './ProjectCard';

interface OverviewPanelProps {
  onPanelChange?: (panel: string) => void;
}

export const OverviewPanel: React.FC<OverviewPanelProps> = ({ onPanelChange }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const stats = [
    {
      id: 'active',
      title: 'Active Projects',
      value: '12',
      change: '+2',
      changeType: 'increase',
      icon: <Home className="w-6 h-6 text-blue-500" />,
      color: 'blue'
    },
    {
      id: 'pending',
      title: 'Pending Approvals',
      value: '4',
      change: '+1',
      changeType: 'increase',
      icon: <DollarSign className="w-6 h-6 text-green-500" />,
      color: 'green'
    },
    {
      id: 'inspections',
      title: 'Upcoming Inspections',
      value: '7',
      change: '-2',
      changeType: 'decrease',
      icon: <CheckSquare className="w-6 h-6 text-purple-500" />,
      color: 'purple'
    },
    {
      id: 'disbursements',
      title: 'Funds Disbursed (MTD)',
      value: '$342,500',
      change: '+$45,000',
      changeType: 'increase',
      icon: <BarChart3 className="w-6 h-6 text-orange-500" />,
      color: 'orange'
    },
  ];

  const projects = [
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
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Inspection: Smith Home',
      type: 'inspection',
      date: 'Today, 2:00 PM',
      icon: <CheckSquare className="w-5 h-5 text-purple-500" />,
      targetPanel: 'inspections'
    },
    {
      id: 2,
      title: 'Payment Due: Johnson Kitchen',
      type: 'payment',
      date: 'Tomorrow, 9:00 AM',
      icon: <DollarSign className="w-5 h-5 text-green-500" />,
      targetPanel: 'approvals'
    },
    {
      id: 3,
      title: 'Project Review: Davis Bathroom',
      type: 'review',
      date: 'Jun 10, 11:30 AM',
      icon: <FileText className="w-5 h-5 text-blue-500" />,
      targetPanel: 'projects'
    },
    {
      id: 4,
      title: 'Inspection: Wilson Basement',
      type: 'inspection',
      date: 'Jun 12, 3:00 PM',
      icon: <CheckSquare className="w-5 h-5 text-purple-500" />,
      targetPanel: 'inspections'
    },
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => {
        if (activeFilter === 'flagged') return project.flagged;
        return project.status === activeFilter;
      });

  const handleNavigate = (panel: string) => {
    if (onPanelChange) {
      onPanelChange(panel);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard Overview</h1>
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-500">Last updated: Today, 10:45 AM</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* Projects Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Active Projects</h2>
            <a 
              href="#" 
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              onClick={(e) => {
                e.preventDefault();
                handleNavigate('projects');
              }}
            >
              View All Projects
              <ChevronRight className="w-4 h-4 ml-1" />
            </a>
          </div>
          
          {/* Filter Tabs */}
          <div className="flex space-x-4 mt-4">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 text-sm rounded-full ${
                activeFilter === 'all'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All Projects
            </button>
            <button
              onClick={() => setActiveFilter('active')}
              className={`px-3 py-1 text-sm rounded-full ${
                activeFilter === 'active'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveFilter('flagged')}
              className={`px-3 py-1 text-sm rounded-full ${
                activeFilter === 'flagged'
                  ? 'bg-orange-100 text-orange-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Flagged
            </button>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredProjects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onClick={() => handleNavigate('projects')}
            />
          ))}
        </div>
      </div>

      {/* Two Column Layout for Upcoming Events and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Upcoming Events</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-start space-x-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {event.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-800">{event.title}</h3>
                    <div className="flex items-center mt-1">
                      <Calendar className="w-4 h-4 text-gray-500 mr-1" />
                      <span className="text-xs text-gray-500">{event.date}</span>
                    </div>
                  </div>
                  <button 
                    className="text-blue-600 hover:text-blue-800 text-sm"
                    onClick={() => handleNavigate(event.targetPanel)}
                  >
                    Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alerts and Notifications */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Alerts & Notifications</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded-r-lg">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-orange-800">Project Behind Schedule</h3>
                    <p className="text-sm text-orange-700 mt-1">
                      Davis Bathroom Remodel is 5 days behind the projected timeline.
                    </p>
                    <div className="mt-2">
                      <button 
                        className="text-xs text-orange-800 bg-orange-100 px-2 py-1 rounded hover:bg-orange-200"
                        onClick={() => handleNavigate('projects')}
                      >
                        Review Project
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                <div className="flex items-start">
                  <DollarSign className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-800">Payment Approval Required</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Smith Home Remodel - Foundation Complete milestone requires your approval.
                    </p>
                    <div className="mt-2">
                      <button 
                        className="text-xs text-blue-800 bg-blue-100 px-2 py-1 rounded hover:bg-blue-200 mr-2"
                        onClick={() => handleNavigate('approvals')}
                      >
                        Approve
                      </button>
                      <button 
                        className="text-xs text-gray-800 bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                        onClick={() => handleNavigate('approvals')}
                      >
                        Review Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                <div className="flex items-start">
                  <CheckSquare className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-green-800">Inspection Passed</h3>
                    <p className="text-sm text-green-700 mt-1">
                      Johnson Kitchen Renovation passed the framing inspection.
                    </p>
                    <div className="mt-2">
                      <button 
                        className="text-xs text-green-800 bg-green-100 px-2 py-1 rounded hover:bg-green-200"
                        onClick={() => handleNavigate('inspections')}
                      >
                        View Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};