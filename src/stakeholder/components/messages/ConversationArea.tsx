import React, { useRef, useState } from 'react';
import { ChevronLeft, Phone, MoreHorizontal, User } from 'lucide-react';
import { Contact, Message } from './types';
import { MessageInput } from './MessageInput';
import { MessageItem } from './MessageItem';

interface ConversationAreaProps {
  contact: Contact;
  messages: Message[];
  onSendMessage: (message: string) => void;
  onBackClick: () => void;
  onInfoClick: () => void;
}

export const ConversationArea: React.FC<ConversationAreaProps> = ({
  contact,
  messages,
  onSendMessage,
  onBackClick,
  onInfoClick
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages when messages change
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'contractor':
        return 'bg-blue-100 text-blue-800';
      case 'customer':
        return 'bg-green-100 text-green-800';
      case 'inspector':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-180px)]">
      {/* Conversation Header */}
      <div className="px-6 py-3 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center">
          <button
            className="md:hidden mr-2 p-1 rounded-md hover:bg-gray-100 transition-colors"
            onClick={onBackClick}
          >
            <ChevronLeft className="h-5 w-5 text-gray-500" />
          </button>
          {contact.avatar ? (
            <img
              src={contact.avatar}
              alt={contact.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-600 font-medium">
                {contact.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          )}
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{contact.name}</p>
            <div className="flex items-center">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(contact.role)}`}>
                {contact.role.charAt(0).toUpperCase() + contact.role.slice(1)}
              </span>
              {contact.online && (
                <span className="ml-2 text-xs text-green-500 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  Online
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onInfoClick}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <User className="h-5 w-5 text-gray-500" />
          </button>
          <button className="p-2 rounded-md hover:bg-gray-100 transition-colors">
            <Phone className="h-5 w-5 text-gray-500" />
          </button>
          <button className="p-2 rounded-md hover:bg-gray-100 transition-colors">
            <MoreHorizontal className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Messages Area - With modern scrollbar */}
      <div className="flex-1 overflow-y-auto bg-gray-50 conversation-scrollbar">
        <div className="p-4 space-y-4">
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
};