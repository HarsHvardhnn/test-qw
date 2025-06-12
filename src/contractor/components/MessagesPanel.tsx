import React from 'react';
import { ContractorCommunication } from './ContractorCommunication';

export const MessagesPanel: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 px-4 py-2">
        <h1 className="text-2xl font-semibold text-gray-800">Messages</h1>
      </div>
      <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
        <ContractorCommunication onClose={() => {}} />
      </div>
    </div>
  );
};