import React from 'react';
import { Calendar, MapPin, User, Briefcase, Home, CheckSquare, Clock } from 'lucide-react';
import { Inspection } from './types';

interface InspectionDetailCardProps {
  inspection: Inspection;
  onViewFull?: () => void;
}

export const InspectionDetailCard: React.FC<InspectionDetailCardProps> = ({ 
  inspection,
  onViewFull
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

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transform transition-all duration-300 hover:shadow-xl">
      {/* Header with status badge */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">Inspection Details</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(inspection.status)}`}>
          {inspection.status.charAt(0).toUpperCase() + inspection.status.slice(1)}
        </span>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <div className="text-sm text-gray-500 font-medium">Project:</div>
            <div className="text-gray-900 font-semibold">{inspection.projectName}</div>
          </div>
          
          <div className="col-span-1">
            <div className="text-sm text-gray-500 font-medium">Milestone:</div>
            <div className="text-gray-900 font-semibold">{inspection.milestone}</div>
          </div>
          
          <div className="col-span-1">
            <div className="text-sm text-gray-500 font-medium">Contractor:</div>
            <div className="text-gray-900 font-semibold">{inspection.contractor}</div>
          </div>
          
          <div className="col-span-1">
            <div className="text-sm text-gray-500 font-medium">Address:</div>
            <div className="text-gray-900 font-semibold">{inspection.address}</div>
          </div>
          
          <div className="col-span-1">
            <div className="text-sm text-gray-500 font-medium">Inspector:</div>
            <div className="text-gray-900 font-semibold">{inspection.inspector || 'Not assigned'}</div>
          </div>
          
          <div className="col-span-1">
            <div className="text-sm text-gray-500 font-medium">Scheduled Date:</div>
            <div className="text-gray-900 font-semibold">{formatDate(inspection.scheduledDate)}</div>
          </div>
        </div>
        
        {/* Actions */}
        {onViewFull && (
          <div className="pt-4 mt-4 border-t border-gray-200">
            <button
              onClick={onViewFull}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View Full Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
};