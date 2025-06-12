import React from 'react';
import { Image, FileText } from 'lucide-react';
import { Message } from './types';

interface MessageItemProps {
  message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const formatMessageTime = (timestamp: string) => {
    // Simple formatter for demo purposes
    return timestamp;
  };

  return (
    <div
      className={`flex ${message.sender === 'you' ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[75%] ${
        message.sender === 'you'
          ? 'bg-blue-500 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg'
          : 'bg-white text-gray-800 border border-gray-200 rounded-tl-lg rounded-tr-lg rounded-br-lg'
      } p-3 shadow-sm`}>
        <p className="text-sm">{message.content}</p>
        
        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 space-y-2">
            {message.attachments.map(attachment => (
              <div key={attachment.id} className="group">
                {attachment.type === 'image' ? (
                  <div className="relative rounded-lg overflow-hidden">
                    <img
                      src={attachment.url}
                      alt={attachment.name}
                      className="w-full h-auto max-h-40 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button className="p-1 bg-white rounded-full">
                        <Image className="h-5 w-5 text-gray-700" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <a
                    href="#"
                    className={`flex items-center p-2 rounded ${
                      message.sender === 'you' ? 'bg-blue-400 hover:bg-blue-300' : 'bg-gray-100 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    <FileText className={`h-5 w-5 ${message.sender === 'you' ? 'text-white' : 'text-gray-500'} mr-2`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${message.sender === 'you' ? 'text-white' : 'text-gray-900'}`}>
                        {attachment.name}
                      </p>
                      {attachment.size && (
                        <p className={`text-xs ${message.sender === 'you' ? 'text-blue-100' : 'text-gray-500'}`}>
                          {attachment.size}
                        </p>
                      )}
                    </div>
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
        
        <div className={`mt-1 flex items-center justify-end space-x-1 text-xs ${
          message.sender === 'you' ? 'text-blue-100' : 'text-gray-500'
        }`}>
          <span>{formatMessageTime(message.timestamp)}</span>
          {message.sender === 'you' && message.status && (
            <span>
              {message.status === 'sent' && '✓'}
              {message.status === 'delivered' && '✓✓'}
              {message.status === 'read' && (
                <span className="text-blue-300">✓✓</span>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};