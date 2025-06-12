import React from 'react';
import { Calendar, Clock, CheckCircle, XCircle, CheckSquare } from 'lucide-react';

interface InspectionsSummaryProps {
  scheduledCount: number;
  pendingCount: number;
  completedCount: number;
  failedCount: number;
}

export const InspectionsSummary: React.FC<InspectionsSummaryProps> = ({
  scheduledCount,
  pendingCount,
  completedCount,
  failedCount
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-lg bg-blue-50 text-blue-700">
            <Calendar className="w-6 h-6" />
          </div>
          <span className="text-sm font-medium text-blue-600">{scheduledCount} inspections</span>
        </div>
        <h3 className="text-sm font-medium text-gray-500">Scheduled</h3>
        <p className="text-2xl font-semibold text-gray-800 mt-1">
          {scheduledCount}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-lg bg-yellow-50 text-yellow-700">
            <Clock className="w-6 h-6" />
          </div>
          <span className="text-sm font-medium text-yellow-600">{pendingCount} inspections</span>
        </div>
        <h3 className="text-sm font-medium text-gray-500">Pending Assignment</h3>
        <p className="text-2xl font-semibold text-gray-800 mt-1">
          {pendingCount}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-lg bg-green-50 text-green-700">
            <CheckCircle className="w-6 h-6" />
          </div>
          <span className="text-sm font-medium text-green-600">{completedCount} inspections</span>
        </div>
        <h3 className="text-sm font-medium text-gray-500">Passed</h3>
        <p className="text-2xl font-semibold text-gray-800 mt-1">
          {completedCount}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-lg bg-red-50 text-red-700">
            <XCircle className="w-6 h-6" />
          </div>
          <span className="text-sm font-medium text-red-600">{failedCount} inspections</span>
        </div>
        <h3 className="text-sm font-medium text-gray-500">Failed</h3>
        <p className="text-2xl font-semibold text-gray-800 mt-1">
          {failedCount}
        </p>
      </div>
    </div>
  );
};