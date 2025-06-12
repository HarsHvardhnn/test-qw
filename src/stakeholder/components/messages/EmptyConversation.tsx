import React from 'react';
import { MessageSquare } from 'lucide-react';

export const EmptyConversation: React.FC = () => {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50 h-[calc(100vh-180px)]">
      <div className="text-center p-6">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <MessageSquare className="h-8 w-8 text-blue-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Your Messages</h3>
        <p className="text-gray-500 max-w-sm">
          Select a conversation from the list to view messages and communicate with contractors, customers, and inspectors.
        </p>
      </div>
    </div>
  );
};