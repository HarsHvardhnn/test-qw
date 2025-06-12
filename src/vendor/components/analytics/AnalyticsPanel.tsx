import React from 'react';
import { Clock } from 'lucide-react';

export const AnalyticsPanel: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Analytics</h1>
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-500">Last updated: Today, 10:45 AM</span>
        </div>
      </div>

      {/* Placeholder for analytics content */}
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Analytics dashboard will be implemented in the next phase.</p>
      </div>
    </div>
  );
};