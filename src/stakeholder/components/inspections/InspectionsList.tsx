import React from 'react';
import { Calendar, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { Inspection } from './types';

interface InspectionsListProps {
  inspections: Inspection[];
  onSelectInspection: (inspection: Inspection) => void;
  onMarkPassed: (id: string) => void;
}

export const InspectionsList: React.FC<InspectionsListProps> = ({
  inspections,
  onSelectInspection,
  onMarkPassed
}) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Calculate days remaining or overdue
  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return 'Today';
    } else {
      return `${diffDays} days remaining`;
    }
  };

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">
          {inspections.length} {inspections.length === 1 ? 'Inspection' : 'Inspections'}
        </h2>
      </div>

      {inspections.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-gray-500">No inspections found matching your criteria.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project / Milestone
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contractor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inspector
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scheduled Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inspections.map((inspection) => (
                <tr key={inspection.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onSelectInspection(inspection)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{inspection.projectName}</div>
                        <div className="text-sm text-gray-500">{inspection.milestone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{inspection.contractor}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{inspection.inspector || 'Not assigned'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(inspection.scheduledDate)}</div>
                    {inspection.status === 'scheduled' && (
                      <div className={`text-xs ${
                        getDaysRemaining(inspection.scheduledDate).includes('overdue') 
                          ? 'text-red-600' 
                          : getDaysRemaining(inspection.scheduledDate) === 'Today'
                            ? 'text-yellow-600'
                            : 'text-gray-500'
                      }`}>
                        {getDaysRemaining(inspection.scheduledDate)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(inspection.status)} items-center`}>
                      {getStatusIcon(inspection.status)}
                      <span className="ml-1">
                        {inspection.status.charAt(0).toUpperCase() + inspection.status.slice(1)}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectInspection(inspection);
                      }}
                      className="text-purple-600 hover:text-purple-900 mr-4"
                    >
                      View Details
                    </button>
                    
                    {inspection.status === 'scheduled' && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onMarkPassed(inspection.id);
                          }}
                          className="text-green-600 hover:text-green-900 mr-4"
                        >
                          Mark Passed
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectInspection(inspection);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          Mark Failed
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};