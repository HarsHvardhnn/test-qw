import React from 'react';

interface LeadsPanelProps {
  onCreateMeeting: () => void;
}

export const LeadsPanel: React.FC<LeadsPanelProps> = ({ onCreateMeeting }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Customer Management</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">Customer management features will be implemented based on future requirements.</p>
      </div>
    </div>
  );
};