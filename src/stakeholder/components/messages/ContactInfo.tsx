import React from 'react';
import { X, Phone, Mail, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { Contact } from './types';

interface ContactInfoProps {
  contact: Contact;
  onClose: () => void;
}

export const ContactInfo: React.FC<ContactInfoProps> = ({ contact, onClose }) => {
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
    <div className="w-80 border-l border-gray-200 bg-white h-full overflow-y-auto scrollbar-hide">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Contact Info</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        <div className="flex flex-col items-center">
          {contact.avatar ? (
            <img
              src={contact.avatar}
              alt={contact.name}
              className="w-20 h-20 rounded-full object-cover mb-4"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-4">
              <span className="text-gray-600 font-medium text-xl">
                {contact.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          )}
          <h4 className="text-xl font-semibold text-gray-900">{contact.name}</h4>
          <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(contact.role)}`}>
            {contact.role.charAt(0).toUpperCase() + contact.role.slice(1)}
          </span>
          {contact.company && (
            <p className="mt-1 text-gray-500">{contact.company}</p>
          )}
          {contact.online && (
            <p className="mt-2 text-sm text-green-500 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              Online
            </p>
          )}
        </div>
      </div>

      <div className="p-6 border-b border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-4">Contact Details</h4>
        <ul className="space-y-3">
          <li className="flex items-center">
            <Phone className="h-5 w-5 text-gray-400 mr-3" />
            <span className="text-sm text-gray-900">(555) 123-4567</span>
          </li>
          <li className="flex items-center">
            <Mail className="h-5 w-5 text-gray-400 mr-3" />
            <span className="text-sm text-gray-900">{contact.name.toLowerCase().replace(' ', '.')}@example.com</span>
          </li>
        </ul>
      </div>

      <div className="p-6 border-b border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-4">Project Information</h4>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-900 mb-1">{contact.projectName}</p>
          <p className="text-sm text-gray-500 mb-3">Project ID: {contact.projectId}</p>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Start Date: June 1, 2025</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h4 className="text-sm font-medium text-gray-700 mb-4">Recent Activity</h4>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <CheckCircle className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-900">Payment Approved</p>
              <p className="text-xs text-gray-500">Foundation Complete milestone - $25,000</p>
              <p className="text-xs text-gray-400 mt-1">2 days ago</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <Calendar className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-900">Inspection Scheduled</p>
              <p className="text-xs text-gray-500">Framing Complete milestone</p>
              <p className="text-xs text-gray-400 mt-1">1 week ago</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="p-2 bg-orange-100 rounded-lg mr-3">
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-900">Timeline Updated</p>
              <p className="text-xs text-gray-500">Project completion extended by 2 weeks</p>
              <p className="text-xs text-gray-400 mt-1">2 weeks ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};