import React from 'react';
import { Image, FileText } from 'lucide-react';

interface Message {
  id: string | number;
  content: string;
  timestamp: string;
  sender: 'contractor' | 'customer' | 'system';
  attachments?: Array<{
    id: string;
    type: 'image' | 'document';
    url: string;
    name: string;
    size?: string;
  }>;
}

interface MessageListProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, messagesEndRef }) => {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.sender === 'contractor' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div className={`max-w-[75%] rounded-lg p-3 ${
            message.sender === 'system' 
              ? 'bg-gray-100 text-gray-600 mx-auto text-center'
              : message.sender === 'contractor'
                ? 'bg-blue-500 text-white'
                : 'bg-white border border-gray-200 text-gray-800'
          }`}>
            <p className="whitespace-pre-wrap">{message.content}</p>
            
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-2 space-y-2">
                {message.attachments.map(attachment => (
                  <div 
                    key={attachment.id}
                    className={`rounded-lg overflow-hidden ${
                      attachment.type === 'image' ? '' : 'p-3 bg-white bg-opacity-10'
                    }`}
                  >
                    {attachment.type === 'image' ? (
                      <img 
                        src={attachment.url} 
                        alt={attachment.name}
                        className="w-full h-auto max-h-40 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm font-medium truncate">{attachment.name}</p>
                          {attachment.size && (
                            <p className="text-xs opacity-75">{attachment.size}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <div className={`text-xs mt-1 ${
              message.sender === 'contractor' ? 'text-blue-100' : 'text-gray-500'
            }`}>
              {message.timestamp}
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};