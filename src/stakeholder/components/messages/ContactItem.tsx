import React from 'react';
import { Contact } from './types';

interface ContactItemProps {
  contact: Contact;
  isSelected: boolean;
  onClick: () => void;
}

export const ContactItem: React.FC<ContactItemProps> = ({ contact, isSelected, onClick }) => {
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
    <li className="w-full">
      <button
        className={`w-full px-4 py-3 hover:bg-gray-50 transition-colors flex items-start ${
          isSelected ? 'bg-blue-50' : ''
        }`}
        onClick={onClick}
      >
        <div className="relative flex-shrink-0">
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
          {contact.online && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
          )}
        </div>
        <div className="ml-3 flex-1 min-w-0 text-left">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900 truncate">{contact.name}</p>
            {contact.lastMessage && (
              <p className="text-xs text-gray-500 ml-1 flex-shrink-0">{contact.lastMessage.timestamp}</p>
            )}
          </div>
          <div className="flex items-center mt-1">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(contact.role)}`}>
              {contact.role.charAt(0).toUpperCase() + contact.role.slice(1)}
            </span>
            {contact.company && (
              <span className="ml-2 text-xs text-gray-500 truncate">{contact.company}</span>
            )}
          </div>
          {contact.lastMessage && (
            <p className={`mt-1 text-sm truncate ${
              !contact.lastMessage.isRead && contact.lastMessage.sender === 'them'
                ? 'font-semibold text-gray-900'
                : 'text-gray-500'
            }`}>
              {contact.lastMessage.sender === 'you' && 'You: '}
              {contact.lastMessage.content}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500 truncate">
            {contact.projectName}
          </p>
        </div>
        {!contact.lastMessage?.isRead && contact.lastMessage?.sender === 'them' && (
          <div className="ml-2 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
        )}
      </button>
    </li>
  );
};